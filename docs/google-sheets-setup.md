# Google Sheets sign-ups (FIN-SHEETS-1102)

Two member forms add one row each to a Google Sheet, so the team reads the sheet instead of members typing into it.

| Form | Page | Route | Sheet | Env var |
|---|---|---|---|---|
| Competition sign-up (competing or supporting, guests if supporting) | `/competitions/sign-up` | `src/app/api/competition-signup/route.ts` | Competition sign-ups | `FINESSE_COMPETITION_SHEET_URL` |
| Promotion check-in (belt, stripes, attending yes/no) | `/promotion-check-in` | `src/app/api/promotion-checkin/route.ts` | Promotion check-ins | `FINESSE_PROMOTION_SHEET_URL` |

Both pages are `noindex`, not in the sitemap and not linked from the site yet.

## How it works
- The form posts JSON to its route. The route checks, in order: JSON content type (415), same origin (403), env set (503 "not configured"), 5 requests per IP per 10 minutes (429, in memory per instance), honeypot `website` field (silent success, nothing saved), form age 2 s to 24 h (400), then the fields (400).
- Fields: name, phone or email (one box; must be an email or a 7 to 15 digit phone number), and an event that is still upcoming (`src/lib/competitions.ts` or `src/lib/promotions.ts`). Competitions add competing/supporting and guests (0 to 20, supporting only). Promotions add belt (`BELTS` in `src/lib/promotions.ts`, including the IBJJF kids' belts such as Grey/White and Yellow/Black), stripes (0 to 4, or 0 to 6 degrees on a black belt) and attending yes/no.
- The route posts `{ secret, headers, values }` to the Apps Script web app. The script checks the secret and appends a timestamped row. Values that Sheets would read as a formula (starting with `=`, `+`, `-`, `@`) are sent with a leading `'` so they stay plain text.
- The visitor only sees success once the script replies `{ "ok": true }`. Anything else shows the usual "Something went wrong. Please call…" message and is logged on the server.
- No Google credentials are stored in the repo or in Vercel. The script runs as the sheet owner. The only shared value is `FINESSE_SHEETS_SECRET`.
- With env missing, both routes return HTTP 503 `{ "ok": false, "configured": false, "error": "Sign-ups are not configured yet." }`. The site builds and runs the same without them.

## Apps Script (same code for both sheets)

```js
// Finesse BJJ website: adds one form submission per row to the first tab of this sheet.
// Script property FINESSE_SHEETS_SECRET must match the website's env var.
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('FINESSE_SHEETS_SECRET');
    if (!secret || body.secret !== secret) return reply({ ok: false, error: 'unauthorized' });
    if (!Array.isArray(body.headers) || !Array.isArray(body.values) || body.headers.length !== body.values.length) {
      return reply({ ok: false, error: 'bad request' });
    }
    lock.waitLock(10000);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(['Timestamp'].concat(body.headers));
    sheet.appendRow([new Date()].concat(body.values.map(String)));
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
```

The header row is written automatically on the first submission:
- Competition sign-ups: Timestamp, Name, Phone or email, Competition, Event date, Competing or supporting, Guests
- Promotion check-ins: Timestamp, Name, Phone or email, Promotion, Event date, Belt, Attending, Stripes

A column added later goes at the end, so rows already in the sheet stay lined up. The header row is only written on the first submission, so type the new column's header (e.g. "Stripes" in H1) into the live sheet by hand.

## Setup steps (Dillan)
1. **Create the sheets.** In the Finesse Google account, create two blank Google Sheets named "Competition sign-ups" and "Promotion check-ins". Share them with Luis and Patty as needed.
2. **Add the script.** In each sheet, open Extensions, Apps Script, replace everything with the code above and save.
3. **Set the secret.** Make one long random value (e.g. run `openssl rand -hex 32`). In each Apps Script project, open Project Settings, Script properties, and add `FINESSE_SHEETS_SECRET` with that value. Use the same value in both.
4. **Deploy each script.** Deploy, New deployment, type Web app, Execute as **Me**, Who has access **Anyone**. Approve the Google permission prompt, then copy the Web app URL (ends in `/exec`).
5. **Add to Vercel and test.** In the project's Settings, Environment Variables (Production and Preview), add `FINESSE_COMPETITION_SHEET_URL` and `FINESSE_PROMOTION_SHEET_URL` (the two `/exec` URLs) and `FINESSE_SHEETS_SECRET`. Redeploy, send one test from each page, check the rows appear, then delete the test rows.

If you change the script later, use Deploy, Manage deployments, edit, Version "New version", so the URL stays the same.

## Before linking the pages
- Replace the sample entry in `src/lib/promotions.ts` with the real promotion date.
- The competition list comes from `src/lib/competitions.ts`; the form shows a "no upcoming competitions" note when none are upcoming.
- Quill to approve the page and form wording (marked as placeholders in the components).
- The privacy notice (`src/app/privacy/page.tsx`) does not yet mention Google Sheets.
