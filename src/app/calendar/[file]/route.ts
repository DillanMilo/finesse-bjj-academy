import { buildIcs, CALENDAR_NOTES, type CalendarNote } from "@/lib/calendar";
import { competitions, signupEvent } from "@/lib/competitions";
import { checkinEvent, promotions } from "@/lib/promotions";

// /calendar/<event slug>.ics?for=competing|supporting|promotion: the Apple Calendar / Outlook file
// behind the "add to calendar" buttons (src/lib/calendar.ts).

export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const slug = file.endsWith(".ics") ? file.slice(0, -4) : "";
  const promotion = promotions.find(item => item.slug === slug);
  const competition = competitions.find(item => item.slug === slug);
  const event = promotion ? checkinEvent(promotion) : competition ? signupEvent(competition) : null;
  if (!event) return new Response("Event not found.", { status: 404 });

  const requested = new URL(request.url).searchParams.get("for");
  const note: CalendarNote = requested && Object.hasOwn(CALENDAR_NOTES, requested) ? requested as CalendarNote : promotion ? "promotion" : "supporting";
  return new Response(buildIcs(event, note), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
