// Membership specials (e.g. Black Friday). While one is running, a slim bar shows above the navbar on every page
// (SpecialBar), the home page shows a card (SpecialCard), and /<slug> has the full offer.
// Everything disappears by itself once `endsAt` passes. Add the next special here.

export interface SpecialPlan {
  /** "1 year", "2 years", "Lifetime". */
  term: string;
  /** Full price for the term, in dollars. */
  price: number;
  /** Length in months, to show "about $X a month". Leave out for lifetime. */
  months?: number;
  /** The highlighted "best value" card. */
  featured?: boolean;
}

export interface SpecialGroup {
  program: string;
  /** Who it's for, e.g. "Adults & kids". */
  audience: string;
  plans: SpecialPlan[];
}

export interface Special {
  slug: string;
  name: string;
  /** For tight spaces like the bar on phones, e.g. "Black Friday". */
  shortName: string;
  /** Short line for the bar and cards, e.g. "All November". */
  when: string;
  /** ISO instant with offset, Central Time. */
  startsAt: string;
  /** ISO instant with offset: the moment it ends (midnight after the last day, Central Time). */
  endsAt: string;
  /** Display date of the last day. */
  lastDay: string;
  groups: SpecialGroup[];
}

export const specials: Special[] = [
  {
    slug: "black-friday",
    name: "Black Friday Special",
    shortName: "Black Friday",
    when: "All November",
    startsAt: "2026-11-01T00:00:00-05:00",
    endsAt: "2026-12-01T00:00:00-06:00",
    lastDay: "Monday, November 30",
    groups: [
      {
        program: "Jiu-Jitsu",
        audience: "Adults & kids",
        plans: [
          { term: "1 year", price: 1839.2, months: 12 },
          { term: "2 years", price: 2988.7, months: 24 },
          { term: "Lifetime", price: 5997, featured: true },
        ],
      },
      {
        program: "Striking",
        audience: "Adults · 2x a week",
        plans: [{ term: "1 year", price: 1598.4, months: 12 }],
      },
    ],
  },
];

/** The special running right now, if any. */
export function activeSpecial(now = Date.now()) {
  return specials.find(special => Date.parse(special.startsAt) <= now && now < Date.parse(special.endsAt));
}

/** "$1,839.20", or "$5,997" for whole dollars. */
export function formatPrice(price: number) {
  return price.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: Number.isInteger(price) ? 0 : 2 });
}

/** Whole dollars a month over the term, e.g. 153 for $1,839.20 a year. */
export function monthlyPrice(plan: SpecialPlan) {
  return plan.months ? Math.round(plan.price / plan.months) : null;
}

/** The lowest price in the special, for "from $1,598". */
export function lowestPrice(special: Special) {
  return Math.min(...special.groups.flatMap(group => group.plans.map(plan => plan.price)));
}

/** "Ends tonight", "Ends tomorrow", "27 days left". */
export function timeLeftLabel(special: Special, now = Date.now()) {
  // Whole days, so it matches the countdown's "days".
  const days = Math.floor((Date.parse(special.endsAt) - now) / 86_400_000);
  return days < 1 ? "Ends tonight" : days === 1 ? "Ends tomorrow" : `${days} days left`;
}
