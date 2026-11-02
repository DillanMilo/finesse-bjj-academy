import { trackEvent } from "@/lib/analytics";
import { HONEYPOT_FIELD, type SendResult } from "@/lib/contact-form";

// Client side of the two Google Sheets forms (competition sign-ups and promotion check-ins).
// Each posts JSON to its own route handler, which adds a row to the matching sheet (docs/google-sheets-setup.md).

const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]+$/;

/** An event as the step-by-step forms show it. Built on the server from competitions.ts or promotions.ts. */
export interface SheetEvent {
  slug: string;
  name: string;
  /** ISO date (YYYY-MM-DD), Central Time. */
  isoDate: string;
  /** Display date, e.g. "Saturday, December 12, 2026". */
  date: string;
  /** Shown as written, e.g. "Doors open 1:30 PM". */
  time?: string;
  /** "HH:MM" (24-hour, Central Time). With it, "add to calendar" saves a timed event instead of an all-day one. */
  startTime?: string;
  /** "HH:MM", Central Time. Defaults to three hours after startTime. */
  endTime?: string;
  location?: string;
  /** Where competitors register with the organizer. */
  registerUrl?: string;
  registrationNote?: string;
  /** How supporters get tickets, e.g. "Talk to Coach Ty to get your tickets." */
  ticketNote?: string;
  /** Members can only come to cheer, e.g. a coach's super fight. */
  supportOnly?: boolean;
}

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
  /** Stripes on the belt ("0" to "4"; degrees "0" to "6" on a black belt). */
  stripes: string;
  attending: "yes" | "no";
  startedAt: number;
  [HONEYPOT_FIELD]?: string;
}

/** A phone number (7 to 15 digits) or an email address. Checked again on the server. */
export function isPhoneOrEmail(value: string) {
  if (value.includes("@")) return value.length <= 254 && EMAIL_PATTERN.test(value);
  const digits = value.replace(/\D/g, "").length;
  return PHONE_PATTERN.test(value) && digits >= 7 && digits <= 15;
}

/** Posts a sheet form. "sent" only when the route confirms the row was added. */
export async function sendSheetForm(path: "/api/competition-signup" | "/api/promotion-checkin", payload: CompetitionSignupPayload | PromotionCheckinPayload): Promise<SendResult> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      if (path === "/api/competition-signup") trackEvent("team_support_rsvp", { form_type: "competition" });
      else trackEvent("promotion_checkin", { form_type: "promotion" });
    }
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
