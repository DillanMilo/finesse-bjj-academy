// Belt promotion events members can check in for (/promotion-check-in). Add new events here.
// Timing works like competitions (Central Time): an event can be checked in for up to and including its day.
// FIN-SHEETS-1102: the entry below is a SAMPLE so the form can be previewed. Replace it with the real
// promotion date before linking the page anywhere.
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
    slug: "belt-promotion-sample",
    name: "Belt Promotion (sample)",
    isoDate: "2026-12-12",
    date: "Saturday, December 12, 2026",
  },
];

/** Belts a member can be wearing at a promotion, kids' belts first. */
export const BELTS = ["White", "Grey", "Yellow", "Orange", "Green", "Blue", "Purple", "Brown", "Black"] as const;
