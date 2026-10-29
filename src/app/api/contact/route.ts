import { createHash } from "node:crypto";
import { CONTACT } from "@/lib/constants";
import { competitions, isUpcoming } from "@/lib/competitions";
import { HONEYPOT_FIELD } from "@/lib/contact-form";
import { escapeHtml, supportConfirmationEmail, trialConfirmationEmail, type EmailContent } from "@/lib/emails";

// Single server-side send path for every website form (contact page, lead pop-up, trial form,
// competition support RSVP). Sends through Resend's REST API with fetch, so no extra npm package is needed.
// Trial and support requests also get a confirmation email back to the visitor (best effort).

const MAX_BODY_BYTES = 20_000;
const LIMITS = { name: 100, email: 254, phone: 40, experience: 40, message: 5000, trialClass: 200, source: 60, event: 80, guests: 2 } as const;
const MAX_GUESTS = 20;
const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const EXPERIENCE_LABELS: Record<string, string> = {
  white: "White belt / novice",
  "blue-purple": "Blue / purple belt",
  "brown-black": "Brown / black belt",
};

const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 } as const;
const DAILY_SEND_CAP = 60;
const SHARED_DAILY_SEND_CAP = 90;
const TRIAL_LOCK_SECONDS = 365 * 24 * 60 * 60;
const UPSTASH_TIMEOUT_MS = 2_000;
const MIN_FILL_MS = 2_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60_000;
const MAX_LINKS = 3;
const LINK_PATTERN = /https?:\/\/(?:www\.)?|www\./gi;
const FAILURE_MESSAGE = "The form could not be sent right now.";

// Best-effort, per-instance memory: each Vercel instance keeps its own counts and they reset on cold start.
const recentRequests = new Map<string, number[]>();
let dailySends = { day: "", count: 0 };

type Field = keyof typeof LIMITS;

function fail(status: number, error: string) {
  return Response.json({ ok: false, error }, { status });
}

function clean(value: unknown, field: Field): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > LIMITS[field] ? null : trimmed;
}

function firstHeaderValue(request: Request, name: string) {
  return request.headers.get(name)?.split(",")[0].trim() || "";
}

function originMatchesHost(request: Request) {
  const host = firstHeaderValue(request, "x-forwarded-host") || firstHeaderValue(request, "host");
  const source = request.headers.get("origin") || request.headers.get("referer");
  if (!host || !source) return false;
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

/**
 * Optional shared store (Upstash Redis REST pipeline). Returns one result per command, or null when
 * Upstash isn't configured or fails, so callers fall back to the in-memory checks.
 */
async function upstash(commands: (string | number)[][]): Promise<unknown[] | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands.map((command) => command.map(String))),
      signal: AbortSignal.timeout(UPSTASH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const replies: unknown = await res.json();
    if (!Array.isArray(replies) || replies.length !== commands.length) throw new Error("unexpected reply");
    return replies.map((reply: { result?: unknown; error?: string } | null) => {
      if (!reply || reply.error) throw new Error(reply?.error ?? "empty reply");
      return reply.result;
    });
  } catch (error) {
    console.error("[api/contact] Upstash failed, using in-memory checks:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** Shared per-IP limit when Upstash is set, otherwise this instance's memory. Counts this request. */
async function isRateLimitedShared(ip: string, now: number) {
  const key = `rl:${ip}:${Math.floor(now / RATE_LIMIT.windowMs)}`;
  const replies = await upstash([["INCR", key], ["EXPIRE", key, RATE_LIMIT.windowMs / 1000]]);
  if (typeof replies?.[0] !== "number") return isRateLimited(ip, now);
  return replies[0] > RATE_LIMIT.max;
}

/** Shared daily cap when Upstash is set, otherwise this instance's cap. Returns false once it is used up. */
async function reserveDailySendShared(now: number) {
  const key = `sends:${new Date(now).toISOString().slice(0, 10)}`;
  const replies = await upstash([["INCR", key], ["EXPIRE", key, 2 * 24 * 60 * 60]]);
  if (typeof replies?.[0] !== "number") return reserveDailySend(now);
  if (replies[0] <= SHARED_DAILY_SEND_CAP) return true;
  console.error(`[api/contact] Shared daily send cap of ${SHARED_DAILY_SEND_CAP} reached.`);
  return false;
}

/** Once-per-email trial lock. "taken" means this email already has one; "skipped" means no store (or it failed). */
async function claimTrialLock(key: string): Promise<"claimed" | "taken" | "skipped"> {
  const replies = await upstash([["SET", key, "1", "NX", "EX", TRIAL_LOCK_SECONDS]]);
  if (!replies) return "skipped";
  return replies[0] === "OK" ? "claimed" : "taken";
}

/**
 * Cloudflare Turnstile. Runs only when both keys are set. A rejected token fails, but if Cloudflare
 * itself can't be reached or errors, the send is allowed (the other spam checks still run), so an
 * outage never loses a real enquiry.
 */
async function passesTurnstile(token: unknown, ip: string) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!siteKey && !secret) return true;
  if (!siteKey || !secret) {
    console.warn(`[api/contact] Turnstile check skipped. Missing env: ${siteKey ? "TURNSTILE_SECRET_KEY" : "NEXT_PUBLIC_TURNSTILE_SITE_KEY"}`);
    return true;
  }
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) {
      console.error(`[api/contact] Turnstile unavailable (HTTP ${res.status}); allowing send.`);
      return true;
    }
    const result = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (result.success === true) return true;
    console.warn(`[api/contact] Turnstile rejected the token: ${result["error-codes"]?.join(", ") || res.status}`);
    return false;
  } catch (error) {
    console.error("[api/contact] Turnstile unreachable; allowing send:", error instanceof Error ? error.message : error);
    return true;
  }
}

/** Counts this request against the IP and reports whether it is over the limit (this instance only). */
function isRateLimited(ip: string, now: number) {
  for (const [key, times] of recentRequests) {
    if (times[times.length - 1] <= now - RATE_LIMIT.windowMs) recentRequests.delete(key);
  }
  const times = (recentRequests.get(ip) ?? []).filter((time) => time > now - RATE_LIMIT.windowMs);
  if (times.length >= RATE_LIMIT.max) {
    recentRequests.set(ip, times);
    return true;
  }
  times.push(now);
  recentRequests.set(ip, times);
  return false;
}

/** Reserves one send from this instance's daily cap. Returns false once the cap is used up. */
function reserveDailySend(now: number) {
  const day = new Date(now).toISOString().slice(0, 10);
  if (dailySends.day !== day) dailySends = { day, count: 0 };
  if (dailySends.count >= DAILY_SEND_CAP) {
    console.error(`[api/contact] Daily send cap of ${DAILY_SEND_CAP} reached on this instance.`);
    return false;
  }
  dailySends.count += 1;
  return true;
}

/** One email through Resend. Returns false (and logs why) if it wasn't accepted. */
async function sendEmail(apiKey: string, { from, to, replyTo, subject, html, text }: EmailContent & { from: string; to: string; replyTo: string }) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, html, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) return true;
    console.error(`[api/contact] Resend returned ${res.status}: ${(await res.text()).slice(0, 500)}`);
  } catch (error) {
    console.error("[api/contact] Resend request failed:", error instanceof Error ? error.message : error);
  }
  return false;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") return fail(415, "Invalid form submission.");
  if (!originMatchesHost(request)) return fail(403, "Invalid form submission.");

  const now = Date.now();
  const ip = firstHeaderValue(request, "x-forwarded-for");
  if (await isRateLimitedShared(ip || "unknown", now)) {
    return fail(429, "Too many attempts. Please try again later.");
  }

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail(413, "Your message is too long.");
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "Invalid form submission.");
  }

  // Honeypot: real visitors never see this field. Accept silently and drop.
  if (typeof body[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD].trim() !== "") {
    return Response.json({ ok: true });
  }

  const startedAt = body.startedAt;
  const formAge = typeof startedAt === "number" && Number.isFinite(startedAt) ? now - startedAt : NaN;
  if (!(formAge >= MIN_FILL_MS && formAge <= MAX_FORM_AGE_MS)) return fail(400, "Please try again.");

  const kind = body.kind === "trial" || body.kind === "enquiry" || body.kind === "support" ? body.kind : null;
  const fields = {} as Record<Field, string>;
  for (const field of Object.keys(LIMITS) as Field[]) {
    const value = clean(body[field], field);
    if (value === null) return fail(400, `Please check the ${field} field.`);
    fields[field] = value;
  }
  // Names go into the subject line, so collapse any line breaks.
  fields.name = fields.name.replace(/\s+/g, " ");

  if (!kind) return fail(400, "Invalid form submission.");
  if (!fields.name) return fail(400, "Please enter your name.");
  if (!EMAIL_PATTERN.test(fields.email)) return fail(400, "Please enter a valid email address.");
  if (fields.experience && !EXPERIENCE_LABELS[fields.experience]) return fail(400, "Please check the experience field.");
  const event = kind === "support" ? competitions.find((item) => item.slug === fields.event && isUpcoming(item)) : undefined;
  if (kind === "support" && !event) return fail(400, "Please check the event field.");
  const guests = fields.guests ? Number(fields.guests) : 0;
  if (!Number.isInteger(guests) || guests < 0 || guests > MAX_GUESTS) return fail(400, "Please check the guests field.");
  if ((fields.message.match(LINK_PATTERN)?.length ?? 0) > MAX_LINKS) return fail(400, "Please remove some links from your message.");
  if (!(await passesTurnstile(body.turnstileToken, ip))) return fail(400, "Please try again.");

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || CONTACT.email;
  if (!apiKey || !from) {
    const missing = [!apiKey && "RESEND_API_KEY", !from && "CONTACT_FROM_EMAIL"].filter(Boolean).join(", ");
    console.error(`[api/contact] Email sending is not configured. Missing env: ${missing}`);
    return fail(503, FAILURE_MESSAGE);
  }

  // Trial lock before the daily cap so a repeat email doesn't use up a send. Released if nothing gets sent.
  const trialKey = kind === "trial" ? `trial:${createHash("sha256").update(fields.email.toLowerCase()).digest("hex")}` : "";
  const trialLock = trialKey ? await claimTrialLock(trialKey) : "skipped";
  if (trialLock === "taken") return fail(409, "A free trial was already requested with this email.");
  const releaseTrialLock = async () => {
    if (trialLock === "claimed") await upstash([["DEL", trialKey]]);
  };

  if (!(await reserveDailySendShared(now))) {
    await releaseTrialLock();
    return fail(503, FAILURE_MESSAGE);
  }

  const subject =
    kind === "trial" ? `[TRIAL] New free trial request: ${fields.name}`
    : event ? `[SUPPORT] ${fields.name} is coming to ${event.name}${guests ? ` (+${guests} guest${guests === 1 ? "" : "s"})` : ""}`
    : `New website enquiry: ${fields.name}`;
  const rows: [string, string][] = [
    ["Name", fields.name],
    ["Email", fields.email],
    ["Phone", fields.phone],
    ["Trial class", fields.trialClass],
    ["Supporting at", event ? `${event.name} · ${event.date}` : ""],
    ["Guests", event ? String(guests) : ""],
    ["Experience", fields.experience ? EXPERIENCE_LABELS[fields.experience] : ""],
    ["Message", fields.message],
    ["Sent from", fields.source],
  ].filter((row): row is [string, string] => row[1] !== "");

  const html = `<h2>${escapeHtml(subject)}</h2><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([label, value]) => `<tr><td style="vertical-align:top"><strong>${label}</strong></td><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join("")}</table><p>Reply to this email to answer ${escapeHtml(fields.name)} directly.</p>`;
  const text = `${subject}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nReply to this email to answer ${fields.name} directly.`;

  if (!(await sendEmail(apiKey, { from, to, replyTo: fields.email, subject, html, text }))) {
    await releaseTrialLock();
    return fail(502, FAILURE_MESSAGE);
  }

  // The academy has the request, so a failed confirmation never fails the form. It shares the daily cap.
  const confirmation =
    kind === "trial" ? trialConfirmationEmail({ name: fields.name, trialClass: fields.trialClass })
    : event ? supportConfirmationEmail({ name: fields.name, event: event.name, date: event.date, location: event.location, guests })
    : null;
  if (confirmation && (await reserveDailySendShared(Date.now()))) {
    await sendEmail(apiKey, { from, to: fields.email, replyTo: to, ...confirmation });
  }

  return Response.json({ ok: true });
}
