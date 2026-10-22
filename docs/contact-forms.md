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
  7. Cloudflare Turnstile token (`turnstileToken`), only when Turnstile is on (see below). Missing or rejected gives 400 "Please try again."
  8. Trial lock by email, only when Upstash is on (see below). Already used gives 409.
  9. Daily send cap, then 503 with the normal failure message.
  Without Upstash, the rate limit and the cap (60 a day) live in memory, so they are best-effort: each Vercel instance counts separately and resets on cold start.
- Trial requests: subjects start with `[TRIAL]` so repeats are easy to spot. After a successful trial request (or a 409) the browser stores `localStorage["finesse-trial-requested"]`; the trial forms then show "We already have your free trial request…" and the pop-up stops opening by itself (clicking a trial button still opens it). Clearing site data brings the forms back. Without Upstash there is no server-side duplicate check.

## Optional add-ons (OPS-027c)
Both are off until their env vars are set, so the site works the same without them.

### Cloudflare Turnstile (bot check)
- With `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set, each form shows a small Turnstile widget just above the submit button (`src/components/ui/TurnstileWidget.tsx`, script loaded with `next/script`). The widget resets after every send attempt.
- With `TURNSTILE_SECRET_KEY` also set, the route checks the token with Cloudflare's `siteverify` before sending. If Cloudflare can't be reached the send is refused (400), so the visitor sees the normal "please call or email" message.
- If only one of the two keys is set, the route skips the check and logs a warning. Set both together.

### Upstash Redis (trial lock by email, shared limits)
- With `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` set, the route uses Upstash's REST API (plain `fetch`, no package):
  - Trial lock: `SET trial:<sha256 of lowercased email> 1 NX EX 31536000` (one year). If the key exists, 409 and the trial forms show "We already have your free trial request…". If the email then fails to send, the key is deleted so the visitor can retry. The email address itself is never stored, only its hash.
  - Shared per-IP limit: `INCR` + `EXPIRE` on `rl:<ip>:<10-minute window>`, 5 per window, replacing the in-memory one.
  - Shared daily cap: `INCR` `sends:<YYYY-MM-DD>` (expires after 2 days), max 90 a day across all instances.
- If Upstash errors or takes over 2 seconds, the route falls back to the in-memory checks, skips the trial lock and still sends. A store outage never blocks a real enquiry.
- It catches the same email twice, not a different email from the same person.

### Setup steps (Dillan)
1. **Turnstile:** create a free Cloudflare account (no need to move DNS). Go to Turnstile, Add widget. Name it "Finesse BJJ website", add hostnames `finessebjj.com`, `www.finessebjj.com`, `finesse-bjj-academy.vercel.app` and `localhost`, widget mode Managed. Copy the Site Key and Secret Key.
2. **Upstash:** create a free Upstash account and a Redis database (free plan, region closest to the Vercel functions, e.g. US East). On the database page, open the REST API section and copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (not the read-only token).
3. **Vercel:** in the project's Settings, Environment Variables, add for Production and Preview: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Then redeploy (the site key is built into the page, so a redeploy is required).
4. **Test** on the preview: each form shows the widget and sends; the same trial email a second time shows the "already requested" message.

For local testing, Cloudflare's public test keys work: site key `1x00000000000000000000AA` with secret `1x0000000000000000000000000000000AA` (always passes) or `2x0000000000000000000000000000000AA` (always fails).
- Sending uses Resend's REST API with `fetch` (no npm package). If env vars are missing or Resend fails, the route returns a generic failure (503 or 502) and logs the reason on the server. The visitor sees "Something went wrong. Please call (346) 418-2999 or email info@finessebjj.com."

## Environment variables (set in Vercel, Production and Preview)
| Name | Required | Example |
|---|---|---|
| `RESEND_API_KEY` | yes | Resend API key with sending access |
| `CONTACT_FROM_EMAIL` | yes | `Finesse BJJ Website <website@finessebjj.com>` (must be on a domain verified in Resend) |
| `CONTACT_TO_EMAIL` | no | Defaults to `CONTACT.email`. Only set it to send somewhere else. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | no | Cloudflare Turnstile site key (shown in the browser, not secret) |
| `TURNSTILE_SECRET_KEY` | no | Cloudflare Turnstile secret key |
| `UPSTASH_REDIS_REST_URL` | no | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | no | Upstash Redis REST token (read and write) |

Names only are in `.env.example`. Redeploy after changing them.

## Resend domain verification
1. In Resend, add the domain `finessebjj.com`. Resend shows the DNS records to add.
2. Add those records in GoDaddy (where finessebjj.com DNS lives). The Resend records use the `send` subdomain (an MX and a TXT/SPF record on `send.finessebjj.com`) plus a DKIM TXT record (`resend._domainkey`).
3. **Do not change or remove the existing Microsoft 365 MX or SPF records on the root domain.** That is what delivers info@finessebjj.com mail. The Resend records live on their own subdomain and do not conflict.
4. Wait for Resend to show the domain as Verified, then set `CONTACT_FROM_EMAIL` to an address on it.
5. Test: submit each form on the preview and confirm the email lands in the info@finessebjj.com inbox (check Junk the first time) and that Reply goes to the visitor.
