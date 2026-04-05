export const COLORS = {
  background: "#0A0A0A",
  surfaceContainer: "#1A1014",
  primaryContainer: "#CC1122",
  primaryContainerHover: "#E8222E",
  onSurface: "#E5E2E1",
  onSurfaceVariant: "#E6BDB9",
  outlineVariant: "#5C3F3D",
} as const;

export const TRAINERS = [
  {
    name: "Luis Diaz",
    role: "HEAD COACH / 3RD DEGREE BLACK BELT",
    quote:
      "Technique is the multiplier of force. We don't just fight; we solve puzzles with precision.",
    bio: "Coach Diaz has over 20 years of experience in high-level competition and teaching. His philosophy centers on the surgical application of BJJ fundamentals.",
    image: "/trainers/luis-diaz.jpg",
  },
  {
    name: "Nathan Bates",
    role: "BLACK BELT",
    quote:
      "Pressure creates diamonds. On these mats, you discover exactly who you are.",
    bio: "Specializing in pressure passing and modern leg lock systems, Nathan brings a relentless competitive edge to every class he leads.",
    image: "/trainers/nathan-bates.jpg",
  },
  {
    name: "Eric Synatschk",
    role: "BROWN BELT",
    quote:
      "The hardest part is walking through the door. Once you're here, the growth is inevitable.",
    bio: "Eric leads our fundamentals and kids programs, focusing on building a rock-solid foundation of movement and defensive responsibility.",
    image: "/trainers/eric-synatschk.jpg",
  },
] as const;

export const PROGRAMS = [
  {
    badge: "ELITE LEVEL",
    title: "ADULT BJJ",
    description:
      "Fundamental and advanced Brazilian Jiu-Jitsu for all skill levels. Focused on technical mastery and live sparring.",
  },
  {
    badge: "YOUTH DEVELOPMENT",
    title: "KIDS BJJ",
    description:
      "Building discipline, confidence, and respect through specialized grappling training for children ages 5-14.",
  },
  {
    badge: "TECHNICAL TAKEDOWNS",
    title: "WRESTLING",
    description:
      "Explosive takedowns and top control. Essential wrestling techniques adapted specifically for the submission game.",
  },
] as const;

export const SCHEDULE = [
  {
    label: "CURRENTLY TRAINING",
    title: "ADVANCED NO-GI",
    time: "18:00 - 19:30",
    detail: "COACH DIAZ",
    active: true,
  },
  {
    label: "UPCOMING",
    title: "KIDS FUNDAMENTALS",
    time: "16:30 - 17:30",
    detail: "DAILY",
    active: false,
  },
  {
    label: "MORNING SESSION",
    title: "ALL LEVELS GI",
    time: "06:00 - 07:00",
    detail: "M/W/F",
    active: false,
  },
  {
    label: "COMPETITION CLASS",
    title: "SITUATION SPARRING",
    time: "12:00 - 13:30",
    detail: "SATURDAY",
    active: false,
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Finesse changed my life. Not just the fitness, but the mindset. The level of detail in instruction here is unmatched in Texas.",
    name: "JOHN D.",
    belt: "PURPLE BELT",
    initials: "JD",
  },
  {
    quote:
      "As a professional athlete, I need coaching that understands elite performance. Finesse provides a world-class environment.",
    name: "MIKE K.",
    belt: "BLUE BELT",
    initials: "MK",
    featured: true,
  },
  {
    quote:
      "The culture here is incredible. It's tough, it's aggressive, but it's built on mutual respect. The best gym I've ever joined.",
    name: "SARAH R.",
    belt: "WHITE BELT (2 STRIPES)",
    initials: "SR",
  },
] as const;

export const STATS = [
  { value: "15+", label: "YEARS\nEXPERIENCE" },
  { value: "4", label: "BLACK BELT\nINSTRUCTORS" },
  { value: "200+", label: "ACTIVE\nMEMBERS" },
] as const;

export const CONTACT = {
  address: "17711 Kuykendahl Rd, Unit A, Spring, TX 77379",
  phone: "(346) 418-2999",
  email: "info@finessebjj.com",
} as const;
