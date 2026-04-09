export interface ClassSlot {
  time: string;
  title: string;
  subtitle: string;
}

export interface DaySchedule {
  day: string;
  dayIndex: number; // 0=Sun, 1=Mon, ..., 6=Sat
  classes: ClassSlot[];
  rest?: boolean;
}

export const schedule: DaySchedule[] = [
  {
    day: "MON",
    dayIndex: 1,
    classes: [
      { time: "06:00 – 07:00", title: "Adults NoGi", subtitle: "All Levels" },
      { time: "10:00 – 11:00", title: "Adults NoGi", subtitle: "All Levels" },
      { time: "16:45 – 17:30", title: "Kids 6–7 Gi", subtitle: "Ages 6–7" },
      { time: "17:30 – 18:30", title: "Kids 8–14 Gi", subtitle: "Ages 8–14" },
      { time: "18:30 – 20:00", title: "Adults Gi", subtitle: "All Levels" },
    ],
  },
  {
    day: "TUE",
    dayIndex: 2,
    classes: [
      { time: "10:00 – 11:00", title: "Adults Gi", subtitle: "All Levels" },
      { time: "16:00 – 16:45", title: "Tiny Dragons Gi", subtitle: "Ages 4–5" },
      { time: "16:45 – 17:30", title: "Kids 6–7 Gi", subtitle: "Ages 6–7" },
      { time: "17:30 – 18:30", title: "Kids 8–14 Wrestling", subtitle: "Ages 8–14" },
      { time: "18:30 – 20:00", title: "Adults Advanced NoGi", subtitle: "Advanced" },
    ],
  },
  {
    day: "WED",
    dayIndex: 3,
    classes: [
      { time: "06:00 – 07:00", title: "Adults Gi", subtitle: "All Levels" },
      { time: "10:00 – 11:00", title: "Adults NoGi", subtitle: "All Levels" },
      { time: "16:45 – 17:30", title: "Kids 6–7 NoGi", subtitle: "Ages 6–7" },
      { time: "17:30 – 18:30", title: "Kids 8–14 NoGi", subtitle: "Ages 8–14" },
      { time: "18:30 – 20:00", title: "Adults NoGi", subtitle: "All Levels" },
    ],
  },
  {
    day: "THU",
    dayIndex: 4,
    classes: [
      { time: "10:00 – 11:00", title: "Adults Gi", subtitle: "All Levels" },
      { time: "16:00 – 16:45", title: "Tiny Dragons Gi", subtitle: "Ages 4–5" },
      { time: "16:45 – 17:30", title: "Kids 6–7 Gi", subtitle: "Ages 6–7" },
      { time: "17:30 – 18:30", title: "Kids 8–14 Advanced NoGi", subtitle: "Ages 8–14 Advanced" },
      { time: "18:30 – 20:00", title: "Adults Advanced NoGi", subtitle: "Advanced" },
    ],
  },
  {
    day: "FRI",
    dayIndex: 5,
    classes: [
      { time: "06:00 – 07:00", title: "Adults NoGi", subtitle: "All Levels" },
      { time: "10:00 – 11:00", title: "Women's Only Beginners", subtitle: "Beginners" },
      { time: "17:30 – 18:30", title: "Kids 8–14 Gi", subtitle: "Ages 8–14" },
      { time: "18:30 – 20:00", title: "Adults Gi", subtitle: "All Levels" },
    ],
  },
  {
    day: "SAT",
    dayIndex: 6,
    classes: [
      { time: "11:00 – 12:30", title: "Adults Wrestling", subtitle: "All Levels" },
    ],
  },
  {
    day: "SUN",
    dayIndex: 0,
    classes: [],
    rest: true,
  },
];

/** Parse "06:00" into total minutes from midnight */
function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Parse "06:00 – 07:30" into [startMinutes, endMinutes] */
function parseTimeRange(range: string): [number, number] {
  const [start, end] = range.split("–").map((s) => s.trim());
  return [parseTime(start), parseTime(end)];
}

/** Get current Central Time date */
function getCentralTime(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
}

export interface ActiveClassInfo {
  dayIndex: number;
  day: string;
  classSlot: ClassSlot;
}

/** Find the class currently in session (Central Time), or null */
export function getCurrentClass(): ActiveClassInfo | null {
  const now = getCentralTime();
  const currentDay = now.getDay(); // 0=Sun
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todaySchedule = schedule.find((d) => d.dayIndex === currentDay);
  if (!todaySchedule || todaySchedule.rest) return null;

  for (const cls of todaySchedule.classes) {
    const [start, end] = parseTimeRange(cls.time);
    if (currentMinutes >= start && currentMinutes < end) {
      return { dayIndex: currentDay, day: todaySchedule.day, classSlot: cls };
    }
  }

  return null;
}

/** Find the next upcoming class (Central Time) */
export function getNextClass(): ActiveClassInfo | null {
  const now = getCentralTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Check remaining classes today first, then cycle through the week
  for (let offset = 0; offset < 7; offset++) {
    const checkDay = (currentDay + offset) % 7;
    const daySchedule = schedule.find((d) => d.dayIndex === checkDay);
    if (!daySchedule || daySchedule.rest) continue;

    for (const cls of daySchedule.classes) {
      const [start] = parseTimeRange(cls.time);
      // If same day, only consider classes that haven't started yet
      if (offset === 0 && start <= currentMinutes) continue;
      return { dayIndex: checkDay, day: daySchedule.day, classSlot: cls };
    }
  }

  return null;
}

/** Check if a specific class slot on a specific day is currently active */
export function isClassActive(dayIndex: number, timeRange: string): boolean {
  const now = getCentralTime();
  const currentDay = now.getDay();
  if (currentDay !== dayIndex) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [start, end] = parseTimeRange(timeRange);
  return currentMinutes >= start && currentMinutes < end;
}
