import { competitions, isUpcoming } from "@/lib/competitions";
import { handleSheetSubmission, isPhoneOrEmail, text } from "@/lib/sheet-submission";

// Competition sign-ups: one row per member in the "Competition sign-ups" Google Sheet (docs/google-sheets-setup.md).

const MAX_GUESTS = 20;

export async function POST(request: Request) {
  return handleSheetSubmission(request, {
    scriptUrlEnv: "FINESSE_COMPETITION_SHEET_URL",
    label: "api/competition-signup",
    validate(body) {
      const name = text(body.name, 100);
      const contact = text(body.contact, 254);
      const event = competitions.find((item) => item.slug === body.event && isUpcoming(item));
      const role = body.role === "competing" || body.role === "supporting" ? body.role : null;
      const guests = role === "supporting" && body.guests ? Number(body.guests) : 0;
      if (!name) return { error: "Please enter your name." };
      if (!contact || !isPhoneOrEmail(contact)) return { error: "Please enter a phone number or email." };
      if (!event) return { error: "Please choose a competition." };
      if (!role || (role === "competing" && event.supportOnly)) return { error: "Please choose competing or supporting." };
      if (!Number.isInteger(guests) || guests < 0 || guests > MAX_GUESTS) return { error: "Please check the guests field." };
      return {
        row: [
          ["Name", name],
          ["Phone or email", contact],
          ["Competition", event.name],
          ["Event date", event.isoDate],
          ["Competing or supporting", role === "competing" ? "Competing" : "Supporting"],
          ["Guests", String(guests)],
        ],
      };
    },
  });
}
