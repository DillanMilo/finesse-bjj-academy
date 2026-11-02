import { HONEYPOT_FIELD } from "@/lib/contact-form";
import { isPhoneOrEmail } from "@/lib/sheet-forms";

export { isPhoneOrEmail };

// Server side of the Google Sheets forms. Each route validates its own fields, then this posts one row
// to a Google Apps Script web app (URL from env) that appends it to the sheet. No Google credentials
// live here: the script runs as the sheet owner and checks FINESSE_SHEETS_SECRET.
// Same-origin, rate limit, honeypot and timing checks match src/app/api/contact/route.ts.

const MAX_BODY_BYTES = 5_000;
const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 } as const;
const MIN_FILL_MS = 2_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60_000;
const SCRIPT_TIMEOUT_MS = 10_000;
// Sheets treats text starting with these as a formula, so such values are stored as plain text.
const FORMULA_START = /^[=+\-@\t\r]/;
const FAILURE_MESSAGE = "The form could not be sent right now.";

// Best-effort, per-instance memory: each Vercel instance keeps its own counts and they reset on cold start.
const recentRequests = new Map<string, number[]>();

export type SheetRow = [header: string, value: string][];
type Validated = { row: SheetRow } | { error: string };

function fail(status: number, error: string) {
  return Response.json({ ok: false, error }, { status });
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

/** Trimmed single-line text up to `max` characters, or null if it isn't valid. Empty when missing. */
export function text(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length > max ? null : trimmed;
}

function sheetSafe(value: string) {
  return FORMULA_START.test(value) ? `'${value}` : value;
}

/**
 * Handles one sheet form POST. `scriptUrlEnv` names the env var with the Apps Script web-app URL.
 * Missing env gives 503 "not configured" so builds and previews work without it.
 */
export async function handleSheetSubmission(request: Request, { scriptUrlEnv, label, validate }: { scriptUrlEnv: string; label: string; validate: (body: Record<string, unknown>) => Validated }) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") return fail(415, "Invalid form submission.");
  if (!originMatchesHost(request)) return fail(403, "Invalid form submission.");

  const scriptUrl = process.env[scriptUrlEnv];
  const secret = process.env.FINESSE_SHEETS_SECRET;
  if (!scriptUrl || !secret) {
    const missing = [!scriptUrl && scriptUrlEnv, !secret && "FINESSE_SHEETS_SECRET"].filter(Boolean).join(", ");
    console.error(`[${label}] Google Sheets is not configured. Missing env: ${missing}`);
    return Response.json({ ok: false, configured: false, error: "Sign-ups are not configured yet." }, { status: 503 });
  }

  const now = Date.now();
  if (isRateLimited(firstHeaderValue(request, "x-forwarded-for") || "unknown", now)) {
    return fail(429, "Too many attempts. Please try again later.");
  }

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail(413, "Invalid form submission.");
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

  const result = validate(body);
  if ("error" in result) return fail(400, result.error);

  // Apps Script answers through a redirect; fetch follows it. It always returns HTTP 200, so trust only { ok: true }.
  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, headers: result.row.map(([header]) => header), values: result.row.map(([, value]) => sheetSafe(value)) }),
      signal: AbortSignal.timeout(SCRIPT_TIMEOUT_MS),
    });
    const reply = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (res.ok && reply?.ok === true) return Response.json({ ok: true });
    console.error(`[${label}] Apps Script did not add the row (HTTP ${res.status}): ${reply?.error ?? "no JSON reply"}`);
  } catch (error) {
    console.error(`[${label}] Apps Script request failed:`, error instanceof Error ? error.message : error);
  }
  return fail(502, FAILURE_MESSAGE);
}
