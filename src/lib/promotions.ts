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
  /** "HH:MM" (24-hour, Central Time) for "add to calendar". Without it the calendar entry is all-day. */
  startTime?: string;
  endTime?: string;
}

export const promotions: PromotionEvent[] = [
  {
    slug: "belt-promotion-2026-11-18",
    name: "Belt Promotion",
    isoDate: "2026-11-18",
    date: "Wednesday, November 18, 2026",
  },
];

/** Belts a member can be wearing at a promotion: white, the IBJJF kids' belts (under 16), then teen and adult belts. */
export const BELTS = [
  "White",
  "Grey/White", "Grey", "Grey/Black", "Yellow/White", "Yellow", "Yellow/Black",
  "Orange/White", "Orange", "Orange/Black", "Green/White", "Green", "Green/Black",
  "Blue", "Purple", "Brown", "Black",
] as const;
export type Belt = (typeof BELTS)[number];

/** Most stripes a belt can carry: four on every belt, up to six degrees on a black belt. */
export function maxStripes(belt: Belt) {
  return belt === "Black" ? 6 : 4;
}

/** "No stripes", "1 stripe", "3 degrees" (black belts count degrees). */
export function stripeLabel(belt: Belt, stripes: number) {
  const unit = belt === "Black" ? "degree" : "stripe";
  return stripes === 0 ? `No ${unit}s` : `${stripes} ${unit}${stripes === 1 ? "" : "s"}`;
}

/** What the check-in form needs to show a promotion. Promotions are held at the academy. */
export function checkinEvent(event: PromotionEvent): SheetEvent {
  return { ...event, location: `Finesse BJJ Academy, ${CONTACT.address}` };
}
