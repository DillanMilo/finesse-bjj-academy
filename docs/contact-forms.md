# Contact forms (OPS-027)

Every form on the site emails the academy at `CONTACT.email` (`src/lib/constants.ts`, currently info@finessebjj.com).

## How it works
- Three forms post JSON to one route handler, `src/app/api/contact/route.ts`:
  - Contact page form (`src/app/contact/page.tsx`): subject `New website enquiry: <name>`.
  - "Book your free trial" pop-up, general mode (`src/components/ui/LeadPopup.tsx`): subject `[TRIAL] New free trial request: <name>`.
  - Trial class form (`src/components/ui/TrialSessionForm.tsx`, used in the pop-up trial mode and `TrialBox` on About and Schedule): subject `[TRIAL] New free trial request: <name>`, includes the chosen class.
- The client helper is `src/lib/contact-form.ts` (`sendContactForm`, shared status type, messages, trial lock). React hooks for the forms are in `src/lib/use-contact-form.ts`.
- The route trims and length-checks every field, checks the email format, escapes all visitor text in the HTML email, and sets `reply_to` to the visitor's email so the academy can just hit Reply.
- Spam (OPS-027b, Heimdall's spec), checked in this order before anything is sent:
  1. Content-Type must be `application/json`, otherwise 415.
  2. `Origin` (or `Referer`) host must match the request host, otherwise 403.
  3. Per-IP limit of 5 requests per 10 minutes (first `x-forwarded-for` entry), otherwise 429.
  4. Hidden `website` field (`HoneypotField`): if filled, the route answers success and sends nothing.
  5. `startedAt` (set when the form appears) must be 2 s to 24 h old, otherwise 400.
  6. Field checks, then more than 3 links in the message gives 400.
  7. Cap of 60 sends a day per server instance, then 503 with the normal failure message.
  The rate limit and daily cap live in memory, so they are best-effort: each Vercel instance counts separately and resets on cold start.
- Trial requests: subjects start with `[TRIAL]` so repeats are easy to spot. After a successful trial request the browser stores `localStorage["finesse-trial-requested"]`; the trial forms then show "We already have your free trial request…" and the pop-up stops opening by itself (clicking a trial button still opens it). Clearing site data brings the forms back. There is no server-side duplicate check.
- Sending uses Resend's REST API with `fetch` (no npm package). If env vars are missing or Resend fails, the route returns a generic failure (503 or 502) and logs the reason on the server. The visitor sees "Something went wrong. Please call (346) 418-2999 or email info@finessebjj.com."

## Environment variables (set in Vercel, Production and Preview)
| Name | Required | Example |
|---|---|---|
| `RESEND_API_KEY` | yes | Resend API key with sending access |
| `CONTACT_FROM_EMAIL` | yes | `Finesse BJJ Website <website@finessebjj.com>` (must be on a domain verified in Resend) |
| `CONTACT_TO_EMAIL` | no | Defaults to `CONTACT.email`. Only set it to send somewhere else. |

Names only are in `.env.example`. Redeploy after changing them.

## Resend domain verification
1. In Resend, add the domain `finessebjj.com`. Resend shows the DNS records to add.
2. Add those records in GoDaddy (where finessebjj.com DNS lives). The Resend records use the `send` subdomain (an MX and a TXT/SPF record on `send.finessebjj.com`) plus a DKIM TXT record (`resend._domainkey`).
3. **Do not change or remove the existing Microsoft 365 MX or SPF records on the root domain.** That is what delivers info@finessebjj.com mail. The Resend records live on their own subdomain and do not conflict.
4. Wait for Resend to show the domain as Verified, then set `CONTACT_FROM_EMAIL` to an address on it.
5. Test: submit each form on the preview and confirm the email lands in the info@finessebjj.com inbox (check Junk the first time) and that Reply goes to the visitor.
