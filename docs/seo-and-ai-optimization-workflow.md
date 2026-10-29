# Finesse BJJ SEO and AI optimization workflow

Approved by Dillan on 2026-10-29 for local pre-launch preparation.

## Verified project facts

- Canonical launch origin: https://finessebjj.com (existing public website remains in place).
- Finesse BJJ Academy: 18300 Strack Dr, Suite 300, Spring, TX 77379; (346) 418-2999; info@finessebjj.com.
- Next.js App Router with program, schedule, contact, news, and competition pages.
- Vercel project: finesse-private-8k4q2m. Both business domains are now verified and prepared on Vercel; GoDaddy DNS still serves the old site. The www hostname has a Vercel 308 redirect to the apex.
- The current public website embeds GA4 measurement ID G-9N5EQ7RVHQ. Account access and stream configuration must be verified independently.
- Resend sending domain is verified. The real inbox test was marked Delivered; human inbox confirmation is still outstanding.

## Scope and constraints

- Original scope was local preparation only. Subsequent authorization permits protected Vercel deployment and domain/redirect preparation. Dillan has now also explicitly authorized committing and pushing all launch preparation and verifying the deployment. Do not change GoDaddy routing/DNS cutover or publish search submissions as part of this preparation.
- SEO work is under the hood: correct metadata/canonicals, generated sitemap/robots, accurate structured data, and verified legacy redirects.
- Preserve existing visual design and unrelated working-tree edits. Placeholder-link fixes and analytics integration are separately authorized by the user, not implicit SEO UI work.
- Keep previews non-indexable and exclude local/preview visits from production analytics.
- Use only confirmed visible facts in structured data. Do not invent ratings, hours, pricing, credentials, or outcomes.
- Spark integration is deferred until after launch, as confirmed by Dillan after speaking with the client lead. Do not invent Spark destinations or collect payment.
- External analytics/webmaster configuration changes require approval for the exact setting. Favoriting the Finesse GA property was explicitly requested.

## Validation and launch handoff

Run lint, type/build checks, rendered metadata/link/404 checks, and local browser checks across desktop/mobile. Exercise contact, trial, duplicate, error, and competition flows using isolated provider fixtures; clearly distinguish fixtures from actual provider delivery. After launch approval, verify real hostname/SSL/redirects, GA reporting, Search Console sitemap ingestion, and actual lead delivery.

## Update log

- 2026-10-29: Created after explicit approval; launch remains prohibited. Public Google Maps previously showed the confirmed street address. No Google Business edit was needed or performed.

- 2026-10-29: Dillan approved removing the six homepage `ssr:false` options on condition that component UI/UX and animation settings remain unchanged. Only those import options changed; animation components/settings were preserved.
- 2026-10-29: Dillan authorized the recommended local archive of 35 existing public article URLs using existing article styling. Thirty-four distinct articles are retained; the byte-identical cloned article redirects to its original. Main homepage and current News listing remain unchanged by the archive. Historical content needs editorial review; see docs/legacy-article-review.json.
- 2026-10-29: Current Google Maps listing again confirms 18300 Strack Dr Unit 300. No Business Profile edit was needed or performed. Current signed-in GA account has no accessible Finesse property; favoriting and GA admin verification remain blocked on property access.

- 2026-10-29: Dillan reports the client lead approved launching before Spark and confirmed the timetable details. Spark and timetable business approval are no longer launch blockers. This readiness update does not authorize deployment or routing changes. No application UI, animation, schedule flags, or live services were changed in this follow-up.

- 2026-10-29: Dillan requested completion of all remaining preparation so launch requires only the DNS cutover. Protected staging/production deployment and Vercel custom-domain/redirect setup are authorized; public DNS remains on the current GoDaddy-hosted site. Confirmed timetable notes were reconciled without changing listed times, component design or animation settings.
- 2026-10-29: Release dpl_9DVqLChEJGg2RsMdfsBnuAsmm3i3 is built and assigned to both prepared domains. Deployed HTTP checks passed for 52 pages, 70 internal destinations, 11 redirects and 3 real 404s. Cloud provider tests used real saved Resend/Redis configuration in an isolated test deployment with synthetic recipients and documented dummy Turnstile keys; five messages show Delivered. Final release uses normal source and production settings. Cloudflare already permits both production hostnames. See docs/launch-cutover.md for exact DNS changes and post-cutover validation; no public routing change has occurred.
- 2026-10-29: Dillan explicitly requested committing and pushing all launch prep, then verifying the deployment without DNS changes or public launch. The existing main branch is connected to the intended Vercel project. Local lint and 14 tests passed again; preserve unrelated workstation files and verify the Git deployment by its actual commit SHA.
