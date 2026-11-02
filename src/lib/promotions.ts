import { CONTACT } from "@/lib/constants";
import type { SheetEvent } from "@/lib/sheet-forms";

// Belt promotion events members can check in for (/promotion-check-in). Add new events here.
// Timing works like competitions (Central Time): an event can be checked in for up to and including its day.
// While one is upcoming, a "Belt promotion" button shows in the bottom-right corner of every page
// (PromotionBadge). It disappears by itself the day after the promotion.
export interface PromotionEvent {
  slug: string;
  name: string;
  /** ISO date (YYYY-MM-DD) of the promotion, Central Time. */
  isoDate: string;
  date: string;
  time?: string;
}

export const promotions: PromotionEvent[] = [
  {
    slug: "belt-promotion-2026-11-18",
    name: "Belt Promotion",
    isoDate: "2026-11-18",
    date: "Wednesday, November 18, 2026",
  },
];

/** Belts a member can be wearing at a promotion, kids' belts first. */
export const BELTS = ["White", "Grey", "Yellow", "Orange", "Green", "Blue", "Purple", "Brown", "Black"] as const;

/** What the check-in form needs to show a promotion. Promotions are held at the academy. */
export function checkinEvent(event: PromotionEvent): SheetEvent {
  return { ...event, location: `Finesse BJJ Academy, ${CONTACT.address}` };
}
