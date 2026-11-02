import { HONEYPOT_FIELD, type SendResult } from "@/lib/contact-form";

// Client side of the two Google Sheets forms (competition sign-ups and promotion check-ins).
// Each posts JSON to its own route handler, which adds a row to the matching sheet (docs/google-sheets-setup.md).

export interface CompetitionSignupPayload {
  name: string;
  /** Phone number or email, whichever the member prefers. */
  contact: string;
  /** Competition slug from src/lib/competitions.ts. */
  event: string;
  role: "competing" | "supporting";
  /** Guests coming along, only when supporting. */
  guests: string;
  startedAt: number;
  [HONEYPOT_FIELD]?: string;
}

export interface PromotionCheckinPayload {
  name: string;
  contact: string;
  /** Promotion slug from src/lib/promotions.ts. */
  event: string;
  belt: string;
  attending: "yes" | "no";
  startedAt: number;
  [HONEYPOT_FIELD]?: string;
}

/** Posts a sheet form. "sent" only when the route confirms the row was added. */
export async function sendSheetForm(path: "/api/competition-signup" | "/api/promotion-checkin", payload: CompetitionSignupPayload | PromotionCheckinPayload): Promise<SendResult> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
