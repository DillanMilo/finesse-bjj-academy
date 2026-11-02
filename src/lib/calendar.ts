import type { SheetEvent } from "@/lib/sheet-forms";

// "Add to calendar" for the sheet forms' finish screen: a Google Calendar link, and an .ics file
// served by src/app/calendar/[file]/route.ts for Apple Calendar and Outlook. A real file (not a data: link)
// is what makes iPhones show their "Add to Calendar" sheet.
// Events with a startTime are saved as timed events (Central Time); the rest are all-day.

/** The line added to the calendar entry, picked from a fixed list so the .ics URL can't carry arbitrary text. */
export const CALENDAR_NOTES = {
  competing: "Competing with Finesse BJJ.",
  supporting: "Cheering on the Finesse BJJ team.",
  promotion: "Belt promotion at Finesse BJJ Academy.",
} as const;
export type CalendarNote = keyof typeof CALENDAR_NOTES;

const TIME_ZONE = "America/Chicago";
/** Length of a timed event with no endTime. */
const DEFAULT_HOURS = 3;

const compact = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** UTC instant of a Central Time wall-clock time, whatever the daylight saving offset is that day. */
function centralToUtc(isoDate: string, time: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" })
    .formatToParts(new Date(asUtc)).map(part => [part.type, Number(part.value)]));
  const centralAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
  return new Date(asUtc + (asUtc - centralAsUtc));
}

/** Start and end in calendar format: "20261118"/"20261119" all-day, or UTC "20261115T193000Z" timed. */
export function eventTimes(event: SheetEvent) {
  if (event.startTime) {
    const start = centralToUtc(event.isoDate, event.startTime);
    const end = event.endTime ? centralToUtc(event.isoDate, event.endTime) : new Date(start.getTime() + DEFAULT_HOURS * 3_600_000);
    return { allDay: false, start: compact(start.toISOString()), end: compact(end.toISOString()) };
  }
  const next = new Date(`${event.isoDate}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return { allDay: true, start: compact(event.isoDate), end: compact(next.toISOString().slice(0, 10)) };
}

function description(event: SheetEvent, note: CalendarNote) {
  return [CALENDAR_NOTES[note], event.time].filter(Boolean).join("\n");
}

export function calendarLinks(event: SheetEvent, note: CalendarNote) {
  const { start, end } = eventTimes(event);
  const google = `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: event.name, dates: `${start}/${end}`, details: description(event, note), location: event.location ?? "", ctz: TIME_ZONE })}`;
  return { google, ics: `/calendar/${event.slug}.ics?for=${note}` };
}

/** Lines over 75 bytes continue on the next line after a space (RFC 5545). */
function fold(line: string) {
  const chunks: string[] = [];
  let rest = line;
  while (new TextEncoder().encode(rest).length > 75) {
    let cut = 74;
    while (new TextEncoder().encode(rest.slice(0, cut)).length > 74) cut--;
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  return [...chunks, rest].join("\r\n ");
}

export function buildIcs(event: SheetEvent, note: CalendarNote, now = new Date()) {
  const { allDay, start, end } = eventTimes(event);
  const text = (value: string) => value.replace(/[\\;,]/g, c => `\\${c}`).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Finesse BJJ//Website//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:${event.slug}@finessebjj.com`, `DTSTAMP:${compact(now.toISOString())}`,
    allDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
    allDay ? `DTEND;VALUE=DATE:${end}` : `DTEND:${end}`,
    `SUMMARY:${text(event.name)}`, `DESCRIPTION:${text(description(event, note))}`,
    ...(event.location ? [`LOCATION:${text(event.location)}`] : []),
    "END:VEVENT", "END:VCALENDAR", "",
  ].map(fold).join("\r\n");
}
