// Competitions the team is attending. Add new events here; check details on the organizer's page first.
// Timing is automatic (Central Time): "upcoming" before the day, "today" on competition day, then the
// event drops off the hub. It only comes back under Results & Recaps if you add a recap or results below.
import type { SheetEvent } from "@/lib/sheet-forms";

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
  /** "HH:MM" (24-hour, Central Time) for "add to calendar". Without it the calendar entry is all-day. */
  startTime?: string;
  endTime?: string;
  location: string;
  address?: string;
  image: string;
  imagePosition: string;
  imageAlt: string;
  /** Organizer's full event flyer (portrait), shown on the event page. */
  flyer?: string;
  /** The flyer's width / height, so it shows uncropped. Defaults to NAGA's 1000 / 1534. */
  flyerAspect?: string;
  description: string;
  audience: string;
  /** Organizer's official event page. */
  url?: string;
  /** Registration page; also where brackets and live results are posted (e.g. Smoothcomp). */
  registerUrl?: string;
  registrationNote?: string;
  /** How supporters get tickets, shown on the event page and after they RSVP. */
  ticketNote?: string;
  /** Members come to cheer only (e.g. a coach's super fight): the sign-up form skips "competing or cheering?". */
  supportOnly?: boolean;
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
    slug: "submission-hunter-pro-105-2026-11",
    name: "Submission Hunter Pro 105",
    organizer: "Super fight · Coach Ty",
    isoDate: "2026-11-15",
    date: "Sunday, November 15, 2026",
    month: "NOV",
    day: "15",
    time: "Doors open 1:30 PM",
    startTime: "13:30",
    location: "Imagen Venues Escapade, Houston, TX",
    address: "11903 Eastex Fwy, Houston, TX 77039",
    image: "/photos/submission-hunter-pro-105-poster.webp",
    imagePosition: "50% 8%",
    imageAlt: "Submission Hunter Pro 105 fight poster: Ty Hazel vs Rodrigo Rivas",
    flyer: "/photos/submission-hunter-pro-105-poster.webp",
    flyerAspect: "1280 / 1600",
    description: "Coach Ty steps in for a super fight at Submission Hunter Pro 105. Come pack the stands, wear your Finesse colors, and make some noise for our coach.",
    audience: "Family, friends & the whole team · General admission $60",
    schedule: [["Sun, Nov 15 · 1:30 PM", "Doors open. No re-entry, so plan to stay."]],
    ticketNote: "General admission is $60. Talk to Coach Ty to get your tickets.",
    supportOnly: true,
  },
  {
    slug: "csc-grappling-43-2026-11",
    name: "CSC Grappling 43",
    organizer: "Super fight · Benji",
    isoDate: "2026-11-20",
    date: "Friday, November 20, 2026",
    month: "NOV",
    day: "20",
    time: "Doors open 4:00 PM · Starts 5:00 PM",
    startTime: "16:00",
    location: "Bad Astronaut Brewing Co., Houston, TX",
    address: "1519 Fulton St, Houston, TX 77009",
    image: "/photos/csc-grappling-43-poster.webp",
    imagePosition: "50% 24%",
    imageAlt: "CSC Grappling 43 Police vs Firefighter fight poster: Padron vs Chesser",
    flyer: "/photos/csc-grappling-43-poster.webp",
    flyerAspect: "1320 / 1637",
    description: "Our own Benji takes on Chesser in the Police vs Firefighter super fight at CSC Grappling 43, Friday, November 20 at Bad Astronaut Brewing in Houston. Come watch, wear your Finesse colors, and make some noise for Benji.",
    audience: "Family, friends & the whole team · General admission $39.99",
    url: "https://combatsportscoverage.com/csc/live/csc43.html",
    schedule: [
      ["Fri, Nov 20 · 4:00 PM", "Doors open"],
      ["Fri, Nov 20 · 5:00 PM", "Show starts"],
    ],
    ticketNote: "General admission is $39.99 and VIP seats are $65, plus tax, on cscgrappling.com. Can’t make it? The live stream is $24.99.",
    supportOnly: true,
  },
  {
    slug: "naga-dallas-worlds-2026-12",
    name: "NAGA World Grappling Championship",
    organizer: "NAGA Worlds · Gi + NoGi",
    isoDate: "2026-12-05",
    date: "Saturday, December 5, 2026",
    month: "DEC",
    day: "5",
    time: "8:00 AM – 5:00 PM",
    startTime: "08:00",
    endTime: "17:00",
    location: "Duncanville Fieldhouse, Duncanville, TX",
    address: "1700 S Main St, Duncanville, TX 75137",
    image: "/photos/naga-dallas-worlds-2026-12-flyer.webp",
    imagePosition: "50% 22%",
    imageAlt: "NAGA World Championship Dallas, Texas official event poster",
    flyer: "/photos/naga-dallas-worlds-2026-12-flyer.webp",
    flyerAspect: "1669 / 2560",
    description: "NAGA’s World Championship comes to Duncanville, with Gi and NoGi divisions for kids, teens and adults and championship belts for the winners. Compete or come cheer. Either way, you’re with the team.",
    audience: "Kids, teens & adults · Gi and NoGi divisions",
    url: "https://www.nagafighter.com/event/world-jiu-jitsu-championship-dallas-tx-5/",
    registerUrl: "https://naga.smoothcomp.com/en/event/33328",
    registrationNote: "Register through NAGA on Smoothcomp. It’s $119 through Nov 27, $139 through Dec 2, then $169 until registration closes Friday, December 4. Each extra division is $35.",
    ticketNote: "Spectator tickets are $20, $10 for kids 12 & under, and infants are free. Get them on NAGA’s Smoothcomp page or at the door.",
    schedule: [
      ["Thu, Dec 3 · Night", "Brackets and estimated match times posted on Smoothcomp"],
      ["Fri, Dec 4 · 6:00 – 6:30 PM", "Optional weigh-in at the venue"],
      ["Sat, Dec 5 · 8:00 AM", "Doors open"],
      ["Sat · by 9:30 AM", "Youth (17 & under) check-in and weigh-in, if not done Friday"],
      ["Sat · around 10:00 AM", "Kids and teens start with NoGi, then Gi. Adult divisions follow."],
      ["Sat · 60 min before your division", "Adult check-in and weigh-in"],
    ],
  },
  {
    slug: "naga-houston-2027-01",
    name: "NAGA Houston Grappling Championship",
    organizer: "NAGA · Gi + NoGi",
    isoDate: "2027-01-09",
    date: "Saturday, January 9, 2027",
    month: "JAN",
    day: "9",
    time: "8:00 AM – 5:00 PM",
    startTime: "08:00",
    endTime: "17:00",
    location: "Community Fieldhouse, Spring, TX",
    address: "2007 Riley Fuzzel Rd, Spring, TX 77386",
    image: "/photos/naga-houston-2027-01-flyer.webp",
    imagePosition: "50% 20%",
    imageAlt: "NAGA Houston No-Gi & Gi Grappling Championship official event poster",
    flyer: "/photos/naga-houston-2027-01-flyer.webp",
    flyerAspect: "1683 / 2560",
    description: "NAGA is back in Spring to start the new year, with Gi and NoGi divisions for kids, teens and adults. Compete or come cheer. Either way, you're with the team.",
    audience: "Kids, teens & adults · Gi and NoGi divisions",
    url: "https://www.nagafighter.com/event/houston-grappling-bjj-championship-spring-tx-4/",
    registerUrl: "https://naga.smoothcomp.com/en/event/34387",
    registrationNote: "Register through NAGA on Smoothcomp. It’s $89 through Nov 28 with code 2027HOUSTON30, or $99 through Dec 12 with code 2027HOUSTON20. After that the price climbs to $169, and registration closes Friday, January 8. Each extra division is $35.",
    ticketNote: "Spectator tickets are $20, $10 for kids 12 & under, and infants are free. Get them online through NAGA or at the door.",
    schedule: [
      ["Thu, Jan 7 · Night", "Brackets and estimated match times posted on Smoothcomp"],
      ["Fri, Jan 8 · 6:00 – 6:30 PM", "Optional weigh-in at the venue"],
      ["Sat, Jan 9 · 8:00 AM", "Doors open"],
      ["Sat · by 9:30 AM", "Youth (17 & under) check-in and weigh-in, if not done Friday"],
      ["Sat · around 10:00 AM", "Kids and teens start with NoGi, then Gi. Adult divisions follow."],
      ["Sat · 60 min before your division", "Adult check-in and weigh-in"],
    ],
  },
  {
    slug: "adcc-los-angeles-2027-01",
    name: "ADCC Los Angeles Open",
    organizer: "ADCC · NoGi",
    isoDate: "2027-01-09",
    date: "Saturday, January 9, 2027",
    month: "JAN",
    day: "9",
    time: "Mats open 8:00 AM Pacific",
    startTime: "10:00",
    endTime: "23:00",
    location: "Fairplex, Pomona, CA",
    address: "Fairplex Expo Hall 9, 1101 W McKinley Ave, Pomona, CA 91768",
    image: "/photos/adcc-los-angeles-2027-01-poster.webp",
    imagePosition: "50% 40%",
    imageAlt: "ADCC Los Angeles Open Championship 2027 official event poster",
    flyer: "/photos/adcc-los-angeles-2027-01-poster.webp",
    flyerAspect: "1600 / 900",
    description: "ADCC’s Los Angeles Open in Pomona: NoGi only, double elimination, for kids through masters. No qualifying needed. Compete or come cheer. Either way, you’re with the team.",
    audience: "Kids, teens, adults & masters · NoGi only",
    url: "https://adcc-official.com/pages/adcc-open-united-states",
    registerUrl: "https://athletes.perfectrumble.com/tournaments/1001",
    registrationNote: "Register through ADCC on Perfect Rumble. It’s $125 through Jan 3, then $150 until registration closes Thursday, January 7, or sooner if it fills up. Up to 2 divisions; the second is $75.",
    ticketNote: "Spectator tickets are $25 at the door.",
    schedule: [
      ["Fri, Jan 8 · 4:00 – 5:00 PM", "Kids weigh-in at the venue (everyone must weigh in)"],
      ["Fri, Jan 8 · 5:00 – 7:00 PM", "Adult weigh-in at the venue"],
      ["Fri, Jan 8 · after 9:00 PM", "Brackets and schedule released"],
      ["Sat, Jan 9 · 6:00 AM", "Same-day weigh-in for kids who missed Friday"],
      ["Sat, Jan 9 · 8:00 AM PT", "Mats open"],
      ["Sat · 2 hours before your division", "Latest same-day weigh-in for adults"],
    ],
  },
  {
    slug: "naga-dallas-2027-02",
    name: "NAGA Dallas Grappling Championship",
    organizer: "NAGA · Gi + NoGi",
    isoDate: "2027-02-27",
    date: "Saturday, February 27, 2027",
    month: "FEB",
    day: "27",
    time: "8:00 AM – 5:00 PM",
    startTime: "08:00",
    endTime: "17:00",
    location: "Duncanville Fieldhouse, Duncanville, TX",
    address: "1700 S Main St, Duncanville, TX 75137",
    image: "/photos/naga-dallas-2027-02-flyer.webp",
    imagePosition: "50% 55%",
    imageAlt: "NAGA Dallas No-Gi & Gi Grappling Championship official event poster",
    flyer: "/photos/naga-dallas-2027-02-flyer.webp",
    flyerAspect: "792 / 1225",
    description: "NAGA’s Dallas Championship at the Duncanville Fieldhouse, with Gi and NoGi divisions for kids, teens and adults. Compete or come cheer. Either way, you’re with the team.",
    audience: "Kids, teens & adults · Gi and NoGi divisions",
    url: "https://www.nagafighter.com/event/dallas-grappling-bjj-championship-dallas-tx-4/",
    registerUrl: "https://naga.smoothcomp.com/en/event/35561",
    registrationNote: "Register through NAGA on Smoothcomp. It’s $89 through Jan 16 with code 2027DALLAS30, or $99 through Jan 30 with code 2027DALLAS20. After that the price climbs to $169, and registration closes Friday, February 26. Each extra division is $35.",
    ticketNote: "Spectator tickets are $20, $10 for kids 12 & under, and infants are free. Get them online through NAGA or at the door.",
    schedule: [
      ["Thu, Feb 25 · Night", "Brackets and estimated match times posted on Smoothcomp"],
      ["Fri, Feb 26 · 6:00 – 6:30 PM", "Optional weigh-in at the venue"],
      ["Sat, Feb 27 · 8:00 AM", "Doors open"],
      ["Sat · by 9:30 AM", "Youth (17 & under) check-in and weigh-in, if not done Friday"],
      ["Sat · around 10:00 AM", "Kids and teens start with NoGi, then Gi. Adult divisions follow."],
      ["Sat · 60 min before your division", "Adult check-in and weigh-in"],
    ],
  },
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

export function competitionPhase(event: Pick<Competition, "isoDate">, now = new Date()): CompetitionPhase {
  const today = centralDate(now);
  return event.isoDate > today ? "upcoming" : event.isoDate === today ? "today" : "past";
}

/** Upcoming or happening today (Central Time). */
export function isUpcoming(event: Pick<Competition, "isoDate">, now = new Date()) {
  return competitionPhase(event, now) !== "past";
}

/** Past events only stay listed once a recap or results have been added. */
export function hasRecap(event: Competition) {
  return Boolean(event.recap?.length || event.results?.length || event.gallery?.length);
}

/** What the sign-up form needs to show a competition. */
export function signupEvent(event: Competition): SheetEvent {
  return { slug: event.slug, name: event.name, isoDate: event.isoDate, date: event.date, time: event.time, startTime: event.startTime, endTime: event.endTime, location: event.address ?? event.location, registerUrl: event.registerUrl ?? event.url, registrationNote: event.registrationNote, ticketNote: event.ticketNote, supportOnly: event.supportOnly };
}
