// Competitions the team is attending. Add new events here; check details on the organizer's page first.
// Timing is automatic (Central Time): "upcoming" before the day, "today" on competition day, then the
// event drops off the hub. It only comes back under Results & Recaps if you add a recap or results below.
export interface Competition {
  slug: string;
  name: string;
  organizer: string;
  /** ISO date (YYYY-MM-DD) of competition day, Central Time. */
  isoDate: string;
  date: string;
  month: string;
  day: string;
  time?: string;
  location: string;
  address?: string;
  image: string;
  imagePosition: string;
  imageAlt: string;
  /** Organizer's full event flyer (portrait), shown on the event page. */
  flyer?: string;
  description: string;
  audience: string;
  /** Organizer's official event page. */
  url?: string;
  /** Registration page; also where brackets and live results are posted (e.g. Smoothcomp). */
  registerUrl?: string;
  registrationNote?: string;
  /** Key times from the organizer, shown on the event page. */
  schedule?: [string, string][];
  /** Coach's recap, one paragraph per entry. Shown once the event is over. */
  recap?: string[];
  results?: { athlete: string; division: string; result: string }[];
  /** Photos from competition day, e.g. "/photos/naga-houston-1.webp". */
  gallery?: string[];
}

export type CompetitionPhase = "upcoming" | "today" | "past";

export const competitions: Competition[] = [
  {
    slug: "naga-houston-2026-10",
    name: "NAGA Houston Grappling Championship",
    organizer: "NAGA · Gi + NoGi",
    isoDate: "2026-10-31",
    date: "Saturday, October 31, 2026",
    month: "OCT",
    day: "31",
    time: "8:00 AM – 5:00 PM",
    location: "Community Fieldhouse, Spring, TX",
    address: "2007 Riley Fuzzel Rd, Spring, TX 77386",
    image: "/photos/naga-houston-2026-10-card.webp",
    imagePosition: "50% 0%",
    imageAlt: "NAGA Houston No-Gi & Gi Grappling Championship official event artwork",
    flyer: "/photos/naga-houston-2026-10-flyer.webp",
    description: "Gi and NoGi divisions for kids, teens and adults, right here in Spring. Compete or come cheer. Either way, you're with the team.",
    audience: "Kids, teens & adults · Gi and NoGi divisions",
    url: "https://www.nagafighter.com/event/houston-grappling-bjj-championship-spring-tx-3/",
    registerUrl: "https://naga.smoothcomp.com/en/event/32995",
    registrationNote: "Registration is through NAGA on Smoothcomp and closes Friday, October 30.",
    schedule: [
      ["Fri, Oct 30 · 7:30 – 8:00 PM", "Optional weigh-in at the venue"],
      ["Sat, Oct 31 · 8:00 AM", "Doors open"],
      ["Sat · by 9:30 AM", "Youth (17 & under) check-in and weigh-in, if not done Friday"],
      ["Sat · 60 min before your division", "Adult check-in and weigh-in"],
    ],
  },
];

/** Today's date (YYYY-MM-DD) in Central Time. */
function centralDate(now: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(now);
}

export function competitionPhase(event: Competition, now = new Date()): CompetitionPhase {
  const today = centralDate(now);
  return event.isoDate > today ? "upcoming" : event.isoDate === today ? "today" : "past";
}

/** Upcoming or happening today (Central Time). */
export function isUpcoming(event: Competition, now = new Date()) {
  return competitionPhase(event, now) !== "past";
}

/** Past events only stay listed once a recap or results have been added. */
export function hasRecap(event: Competition) {
  return Boolean(event.recap?.length || event.results?.length || event.gallery?.length);
}
