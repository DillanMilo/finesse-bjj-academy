# Finesse BJJ launch cutover

Prepared October 29, 2026. **Do not execute the DNS changes until Dillan authorizes launch.** Spark is deferred by the client. No GoDaddy routing record has been changed during this preparation.

## Git handoff

Dillan subsequently authorized committing and pushing all launch preparation and verifying the deployment, while continuing to prohibit public DNS cutover. The source, tests, archive assets and handoff documents are being recorded on the existing `main` branch. Vercel's Git connection deploys this branch. At cutover, use the verified Git deployment matching the pushed commit; the CLI deployment IDs and source manifest below are the earlier preparation baseline, not a reason to roll back newer Git source. Confirm the production target and both alias deployment IDs against that Git commit before changing DNS.

## Prepared release

- Vercel project: `finesse-private-8k4q2m` / `prj_9AWYc17Qo4wnLudyTEcD9MsssYYo`.
- Release: `dpl_9DVqLChEJGg2RsMdfsBnuAsmm3i3`, READY and PROMOTED.
- Protected review URL: https://finesse-private-8k4q2m-gpn1t3dqj-dillans-projects-f662840b.vercel.app
- Both `finessebjj.com` and `www.finessebjj.com` are verified and assigned to this exact deployment. The www alias already has a 308 redirect to the apex on Vercel.
- Source manifest: `docs/launch-source-manifest.json`; digest `8611baa0b2cfd4e7c5c53425f5dc79bd613796157799b3f95c121137ee4a73df`.
- The initial source export was a direct CLI release. Its manifest and deployment evidence remain a historical baseline. The subsequent Git handoff preserves the launch source in the repository, including newer already-committed footer-credit changes.
- Production Resend, Turnstile and Redis environment entries are present. `CONTACT_TO_EMAIL` is unset, so the normal code sends academy notifications to `info@finessebjj.com`. The sender is the saved Finesse website sender. No test recipient or dummy CAPTCHA key is hardcoded into the release.
- Deployment protection remains enabled for unique deployment URLs and previews. Unauthenticated review URL returns 302 to Vercel authentication with noindex. Public production custom domains are outside that protection mode.

## Launch action: GoDaddy DNS only

Re-read the Vercel domain recommendations immediately before cutover in case the platform changes them. The project-specific rank-one values checked today are:

| Type | Name | Current value | Launch value |
|---|---|---|---|
| A | @ | `160.153.0.68` | `216.150.1.1` |
| A | @ | No second A record | `216.150.16.1` |
| CNAME | www | `finessebjj.com` | `84b8072a6b7ec5e4.vercel-dns-017.com` |

Replace the existing apex A value and add the second recommended apex A record. Replace the www CNAME target. Do not retain the old apex A alongside the new ones. No apex AAAA record was present at the authoritative check. Existing A TTL is 600 seconds and www TTL is 3600 seconds; resolver propagation can take longer.

Keep GoDaddy nameservers `ns71.domaincontrol.com` and `ns72.domaincontrol.com`. **Do not enable GoDaddy website forwarding:** the www-to-apex and eleven legacy URL redirects are already prepared on Vercel/in the app. No separate redirect setup is required at GoDaddy.

Preserve all unrelated records, including Microsoft 365 MX (`0 finessebjj-com.mail.protection.outlook.com`), Microsoft SPF, DKIM/autodiscover, existing verification records, and the Resend email records. These are website-routing edits, not an email migration.

## Checks already passed

- Lint and 14 automated tests, including confirmed timetable behavior and start-only sessions without invented end times.
- Clean lockfile production build with Next.js 16.4.1, plus successful final Vercel build on Node 22.x.
- Final deployed HTTP crawl: 52 pages, 70 internal destinations, 11 permanent redirects, 3 genuine 404s; unique metadata, canonicals, JSON-LD, social assets, initial homepage content, robots and 50-entry sitemap. Evidence: `docs/launch-deployment-checks.json`.
- Isolated deployed form test using saved Production Resend key and Redis store: enquiry 200, trial 200, repeat trial 409, support RSVP 200. All five resulting messages show Delivered in Resend and went only to synthetic `delivered+...@resend.dev` inboxes. The isolated test deployment used Cloudflare's official dummy test keys; it is not assigned to the business domains.
- Cloudflare's existing Finesse widget allows `finessebjj.com` and `www.finessebjj.com`, uses Managed mode and no pre-clearance. No widget settings were changed. Production CAPTCHA interaction still requires a check on the real hostname after cutover.
- Final protected homepage opened in Chrome with no recorded browser warnings/errors. Earlier desktop/mobile local checks cover contact, booking, support, consent and policy pages. Designs and animation settings were preserved.
- Authoritative GoDaddy DNS still shows the original A/CNAME and Microsoft 365 MX/SPF after Vercel preparation.

## Immediately after DNS propagation

These are launch verification steps, not additional features or pre-launch configuration:

1. Confirm both hostnames resolve to Vercel, its domain checks clear, and valid HTTPS certificates are active. A direct pre-cutover TLS attempt at Vercel using the business hostnames did not complete; normal hostname HTTPS cannot be signed off before routing/certificate activation. Do not bypass certificate warnings.
2. Confirm `https://finessebjj.com` returns the new site, www redirects permanently to the apex, HTTP upgrades to HTTPS, and paths/query strings survive the hostname redirect.
3. Check `/contact-us`, one archived article, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, and a missing URL on the real hostname.
4. Complete one clearly labeled real form test with normal production Turnstile. Confirm academy notification and visitor confirmation as applicable, Resend delivery, and human inbox/Junk receipt. Earlier approved `info@finessebjj.com` inbox test is marked Delivered; human inbox confirmation remains unavailable.
5. With analytics consent granted, confirm the GA tag sends to existing ID `G-9N5EQ7RVHQ`. Once the owner shares property access, inspect Realtime/DebugView and key events. Do not create a duplicate property. Current user still cannot favorite the inaccessible property; owner identity (Louise/Patty) is not established.
6. Once the new site serves the domain, submit its sitemap through an accessible verified Search Console/Bing property. No submission has been made in advance.

GA property access/admin checks, Spark, historical archive editorial review, and optional decorative coordinate copy correction remain separate follow-ups. None requires changing the prepared release to route traffic to it. The street address and Google Maps listing agree on 18300 Strack Dr, Suite/Unit 300.

## Rollback

If the new site fails critical launch checks, restore GoDaddy apex A `160.153.0.68` (remove the two new apex A records) and www CNAME `finessebjj.com`. Keep email records unchanged. DNS rollback also needs propagation. Previous Vercel production deployment before this preparation was `dpl_8dH4eXVhDrCeC9J7ej34ukuJY8dh`; reverting Vercel source alone will not restore the old GoDaddy-hosted website.
