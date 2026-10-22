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

export async function POST(request: Request) {
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

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || CONTACT.email;
  if (!apiKey || !from) {
    const missing = [!apiKey && "RESEND_API_KEY", !from && "CONTACT_FROM_EMAIL"].filter(Boolean).join(", ");
    console.error(`[api/contact] Email sending is not configured. Missing env: ${missing}`);
    return fail(503, "The form could not be sent right now.");
  }

  const subject = kind === "trial" ? `New free trial request: ${fields.name}` : `New website enquiry: ${fields.name}`;
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
      return fail(502, "The form could not be sent right now.");
    }
  } catch (error) {
    console.error("[api/contact] Resend request failed:", error instanceof Error ? error.message : error);
    return fail(502, "The form could not be sent right now.");
  }

  return Response.json({ ok: true });
}
