import { isUpcoming } from "@/lib/competitions";
import { BELTS, maxStripes, promotions } from "@/lib/promotions";
import { handleSheetSubmission, isPhoneOrEmail, text } from "@/lib/sheet-submission";

// Promotion check-ins: one row per member in the "Promotion check-ins" Google Sheet (docs/google-sheets-setup.md).

export async function POST(request: Request) {
  return handleSheetSubmission(request, {
    scriptUrlEnv: "FINESSE_PROMOTION_SHEET_URL",
    label: "api/promotion-checkin",
    validate(body) {
      const name = text(body.name, 100);
      const contact = text(body.contact, 254);
      const event = promotions.find((item) => item.slug === body.event && isUpcoming(item));
      const belt = BELTS.find((item) => item === body.belt);
      const stripes = typeof body.stripes === "string" && /^\d$/.test(body.stripes) ? Number(body.stripes) : -1;
      const attending = body.attending === "yes" || body.attending === "no" ? body.attending : null;
      if (!name) return { error: "Please enter your name." };
      if (!contact || !isPhoneOrEmail(contact)) return { error: "Please enter a phone number or email." };
      if (!event) return { error: "Please choose a promotion." };
      if (!belt) return { error: "Please choose your belt." };
      if (stripes < 0 || stripes > maxStripes(belt)) return { error: "Please choose your stripes." };
      if (!attending) return { error: "Please say whether you're attending." };
      return {
        row: [
          ["Name", name],
          ["Phone or email", contact],
          ["Promotion", event.name],
          ["Event date", event.isoDate],
          ["Belt", belt],
          ["Attending", attending === "yes" ? "Yes" : "No"],
          // Added after the sheet went live, so it goes last to keep earlier rows lined up.
          ["Stripes", String(stripes)],
        ],
      };
    },
  });
}
