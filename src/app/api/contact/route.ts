import { CONTACT } from "@/lib/constants";
import { HONEYPOT_FIELD } from "@/lib/contact-form";

// Single server-side send path for every website form (contact page, lead pop-up, trial form).
// Sends through Resend's REST API with fetch, so no extra npm package is needed.

const MAX_BODY_BYTES = 20_000;
const LIMITS = { name: 100, email: 254, phone: 40, experience: 40, message: 5000, trialClass: 200, source: 60 } as const;
const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const EXPERIENCE_LABELS: Record<string, string> = {
  white: "White belt / novice",
  "blue-purple": "Blue / purple belt",
  "brown-black": "Brown / black belt",
};

const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 } as const;
const DAILY_SEND_CAP = 60;
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

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

/** Counts this request against the IP and reports whether it is over the limit. */
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
  if (dailySends.count >= DAILY_SEND_CAP) return false;
  dailySends.count += 1;
  return true;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") return fail(415, "Invalid form submission.");
  if (!originMatchesHost(request)) return fail(403, "Invalid form submission.");

  const now = Date.now();
  if (isRateLimited(firstHeaderValue(request, "x-forwarded-for") || "unknown", now)) {
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

  const kind = body.kind === "trial" ? "trial" : body.kind === "enquiry" ? "enquiry" : null;
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
  if ((fields.message.match(LINK_PATTERN)?.length ?? 0) > MAX_LINKS) return fail(400, "Please remove some links from your message.");

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || CONTACT.email;
  if (!apiKey || !from) {
    const missing = [!apiKey && "RESEND_API_KEY", !from && "CONTACT_FROM_EMAIL"].filter(Boolean).join(", ");
    console.error(`[api/contact] Email sending is not configured. Missing env: ${missing}`);
    return fail(503, FAILURE_MESSAGE);
  }
  if (!reserveDailySend(now)) {
    console.error(`[api/contact] Daily send cap of ${DAILY_SEND_CAP} reached on this instance.`);
    return fail(503, FAILURE_MESSAGE);
  }

  const subject = kind === "trial" ? `[TRIAL] New free trial request: ${fields.name}` : `New website enquiry: ${fields.name}`;
  const rows: [string, string][] = [
    ["Name", fields.name],
    ["Email", fields.email],
    ["Phone", fields.phone],
    ["Trial class", fields.trialClass],
    ["Experience", fields.experience ? EXPERIENCE_LABELS[fields.experience] : ""],
    ["Message", fields.message],
    ["Sent from", fields.source],
  ].filter((row): row is [string, string] => row[1] !== "");

  const html = `<h2>${escapeHtml(subject)}</h2><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([label, value]) => `<tr><td style="vertical-align:top"><strong>${label}</strong></td><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join("")}</table><p>Reply to this email to answer ${escapeHtml(fields.name)} directly.</p>`;
  const text = `${subject}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nReply to this email to answer ${fields.name} directly.`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: fields.email, subject, html, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`[api/contact] Resend returned ${res.status}: ${(await res.text()).slice(0, 500)}`);
      return fail(502, FAILURE_MESSAGE);
    }
  } catch (error) {
    console.error("[api/contact] Resend request failed:", error instanceof Error ? error.message : error);
    return fail(502, FAILURE_MESSAGE);
  }

  return Response.json({ ok: true });
}
