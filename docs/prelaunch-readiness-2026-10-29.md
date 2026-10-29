# Finesse pre-launch readiness — October 29, 2026

Git handoff update: Dillan has now explicitly authorized committing and pushing the prepared source and verifying its deployment. Public DNS cutover remains prohibited. The release IDs and crawl artifacts in this report document the initial CLI preparation; the latest pushed Git commit and its Vercel deployment supersede that baseline after verification. Lint and all 14 tests passed again before the Git handoff. Generated local development type paths and `.claude/launch.json` are unrelated workstation state and are excluded from the launch commit.

## Verdict

The prepared release is built on Vercel and assigned to both verified business domains. **The remaining traffic-switch action is GoDaddy DNS, which has not been changed.** Spark is deferred and the client-confirmed timetable has been reconciled in the source. The www redirect is already configured on Vercel; no GoDaddy forwarding is needed. See [the cutover runbook](launch-cutover.md) for exact records, release identity and rollback.

The final deployment passed the 52-page HTTP crawl, and an isolated cloud test passed the real Resend/Redis flows with five synthetic messages marked Delivered. This does not claim real-hostname HTTPS/CAPTCHA or GA ingestion has been verified: certificates, real-domain forms and analytics reporting require post-cutover checks. GA property sharing remains an owner action and can follow launch. No Git commit, push, merge, public DNS cutover or search submission was performed.

## Completed and verified

| Area | Result | Evidence / files |
|---|---|---|
| Canonical domain | Metadata uses https://finessebjj.com; page-specific canonicals and sharing metadata replace the preview URL | src/lib/seo.ts; page/layout metadata; rendered crawl |
| Discovery | Generated production sitemap and robots; API excluded; local/Preview builds disallow crawling and use noindex | src/app/robots.ts, src/app/sitemap.ts; environment tests |
| Entity information | SportsActivityLocation + WebSite graph with confirmed address/phone; article schema and canonical URLs | src/app/layout.tsx; article pages; JSON parsing in crawl |
| Initial HTML | Six homepage import options now permit server rendering | src/app/page.tsx; programs, instructors and news links confirmed in initial HTML |
| Design preservation | Existing section styles, component markup, motion settings, timers and carousels are untouched | Exact homepage diff is six removed ssr:false options; Hero has only a lint comment preserving its existing navigation |
| Analytics code | Existing GA4 ID G-9N5EQ7RVHQ; consent before Google loads; production hostname guard; no local/Preview traffic | src/components/analytics/Analytics.tsx, src/lib/analytics.ts |
| Conversions | Successful enquiries/trials emit generate_lead with form_type; support emits team_support_rsvp; phone/email links emit contact_click | Successful/failed/duplicate tests; form field values excluded from custom events |
| Placeholder links | Privacy and terms now have local destinations; generic TikTok links removed | Footer, contact page, /privacy, /terms |
| Existing articles | 35 old article URLs handled: 34 distinct archived articles plus one identical-clone redirect; /news/archive index | src/lib/legacy-posts.json, src/lib/legacy-redirects.json, archive routes |
| Archive assets | 18 original media files copied locally; expired Spark promotion link disabled | public/legacy-media; import script and review notes |
| Legacy navigation | Six primary page redirects plus five archive/alias redirects; old internal links point to current pages | next.config.ts, legacy-redirects.json |
| Business address | Public Google Maps says 18300 Strack Dr Unit 300, Spring, TX 77379; website says Suite 300 | Checked directly October 29; no Business Profile edit needed/performed |
| Merchandise | Real BSN Finesse Jiu Jitsu store opened and showed 40 products | Existing store URL retained; no purchase or checkout test |
| Domain isolation | Website A 160.153.0.68; www CNAME finessebjj.com; Microsoft 365 MX remains finessebjj-com.mail.protection.outlook.com | Read-only DNS check at end of preparation |

All SEO metadata/schema/discovery/redirect changes are under the hood. Separately authorized presentation changes are the analytics consent controls, policy destinations, removal of generic TikTok links, and the new archive pages. Existing section components/animations were not redesigned.

The archive is linked by its sitemap and internally between its index/articles. No archive link was added to the existing homepage or current News listing, as promised. Later archive contact-address references were corrected to the confirmed current address. The clearly dated 2020 relocation story retains its historical address and displays the current address in the archive notice.

## Validation

- `npm run lint`: passed.
- `npm test`: 14 tests passed, covering email routing/escaping, trial duplicate locks, provider failures/retries, spam guards, rate limits, analytics exclusions and categorical events, archive safety/media, duplicate consolidation, and crawler environment isolation.
- Clean install of the exact lockfile in a temporary folder: Next.js **16.4.1**, Node **22.23.4**. `next build --webpack` passed with TypeScript and 59 generated outputs. Workspace-installed Next is 16.3.3; active development dependencies were deliberately not replaced.
- `node scripts/check-local-site.cjs http://127.0.0.1:3068`: **52 pages**, 71 internal destinations, **11 permanent redirects**, **3 genuine 404s** passed. Checked titles, descriptions, canonicals, H1/language, JSON-LD, social assets, initial homepage content, robots and sitemap.
- Local browser: enquiry success, trial selection/success and repeat-request message, team support success, error feedback, mobile contact/privacy layout, mobile menu, consent acceptance/decline/preferences, and Google script exclusion on localhost checked. Homepage counters, photos, reveal behavior and booking popup still function; no new React hydration/nesting errors observed.
- Clean-build API with Cloudflare's documented dummy keys: successful token validation observed, enquiry accepted by fixture email provider; direct provider failure **502**, trial **200**, duplicate **409**, support **200** verified. Email/storage fixtures never contact real email recipients or the real Redis instance.
- Earlier real Resend verification is separate: all synthetic test messages showed Delivered, and the approved real inbox test to info@finessebjj.com also showed Delivered. Human confirmation of the inbox/Junk result is still outstanding. No additional real inbox messages were sent during this preparation. A later isolated deployed test produced five additional Delivered synthetic messages using the saved Production Resend key and shared Redis; its dummy Turnstile keys and fixed synthetic academy recipient exist only in the separate test deployment, not the final release.
- Turbopack's local worker-port restriction affected the workspace compiler; the supported Webpack production build passed. No hosting build settings were changed. The later final Vercel build also passed with the pinned dependency version.
- Local checks are not field Core Web Vitals, Google indexing, rich-result eligibility, production analytics ingestion, or proof of calls/bookings. Those remain unmeasured.

## Remaining launch action and follow-ups

1. **GoDaddy DNS cutover — awaiting explicit launch instruction:** replace the apex A and www CNAME as documented in `docs/launch-cutover.md`. Both Vercel domains are verified, assigned to final release `dpl_9DVqLChEJGg2RsMdfsBnuAsmm3i3`, and www has a 308 redirect to the apex. GoDaddy A remains `160.153.0.68`; www remains a CNAME to `finessebjj.com`. Microsoft 365 MX/SPF are unchanged.
2. **Post-cutover verification:** check normal HTTPS/certificate activation, public host/path redirects and one real form with production Turnstile. A direct pre-cutover TLS attempt to Vercel with the business hostnames did not complete, so these checks are not represented as passed. Cloudflare already permits both business hostnames; no widget edit was necessary.
3. **Spark — deferred, not a launch blocker:** the client lead approved launching before Spark. Add and test its actual integration later; no guessed Spark URLs were introduced.
4. **Google Analytics access and ingestion:** the signed-in dillan@creativecurrents.io account has no accessible Finesse property. The owner of the existing `G-9N5EQ7RVHQ` property must share access before it can be favorited or reporting/key-event settings inspected. Owner identity is not established. Code is prepared to load only with consent on the Production business hostname, sends no manual duplicate page_view and excludes form-field PII from custom events. Reporting, stream settings, enhanced navigation measurement and key events remain unobserved; do not claim end-to-end tracking is verified.
5. **Schedule — complete:** the client confirmed the listed timetable. All listed starts and explicitly ranged ends are confirmed in the source. Start-only sessions retain no invented end time and cannot display a guessed live-class interval. Stale awaiting-confirmation notices were removed without changing listed times/design/animations.
6. **Policies and archive editorial follow-up:** factual website notices and the preserved dated archive are included in the prepared release. Technical route/content checks pass. Academy-specific legal practices and historical prices/claims are not newly certified by this work; article flags remain in `docs/legacy-article-review.json`. The old relocation video's existing 404 is handled by an unavailable notice.
7. **Search tools:** submit the final sitemap only after the new site serves the public domain, using an accessible verified Search Console/Bing property. No property creation or submission occurred here.

## Deployed release evidence

- `docs/launch-source-manifest.json`: hashes of the 168 exported application/config/media files; no environment files or local credentials uploaded.
- `docs/launch-deployment-checks.json`: final deployed crawl passed for 52 pages, 70 internal destinations, 11 redirects and 3 real 404s; sitemap/robots/metadata/schema/initial homepage content and confirmed timetable checked.
- Isolated provider test `dpl_Ee7kvMGUKKWaebEXtBD9NXiA3GEi`: enquiry 200, trial 200, repeat trial 409, support 200; saved Production Resend/Redis configuration used, five messages visibly Delivered in Resend to synthetic inboxes only.
- Final release `dpl_9DVqLChEJGg2RsMdfsBnuAsmm3i3`: normal production source/settings, no test-only source substitutions. Production protection preserved; unauthenticated unique URL redirects to Vercel login with noindex. Signed-in Chrome homepage opened with no captured warnings/errors.
- Direct alias reads confirm both business hosts target the final deployment; www redirect is 308 to apex. No additional deploy or promotion is required for the planned DNS switch.

## Optional follow-ups requiring presentation approval

The contact page still has a decorative map with coordinates 30.0799 N / 95.4431 W. Google Maps places the confirmed academy at approximately 30.0367 N / 95.4916 W. Its street address text is correct. Correcting those visible decorative coordinates or adding a directions link would be a separate presentation/interaction change; it was not bundled into the under-the-hood homepage approval. A verified academy TikTok URL can be restored when supplied.

## Evidence and source limits

Repository/build/HTTP/browser evidence is confirmed for local preparation and the protected final Vercel release. Domain routing, public address and merchandise destination were read directly. GA property configuration, Search Console/Bing data, rankings, field performance and actual production conversion ingestion were unavailable or intentionally not exercised. Schema syntax and visible-fact parity were checked locally; Google's hosted validator was not given unpublished localhost pages.

Primary guidance consulted October 29, 2026:

- [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [GA4 pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views) — automatic pageviews and manual-duplicate cautions
- [Google consent implementation](https://developers.google.com/tag-platform/security/guides/consent)
- [Cloudflare test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [Public Google Maps listing](https://www.google.com/maps/search/?api=1&query=Finesse+BJJ&query_place_id=ChIJFVGJ-vrNQIYRSMNGSG_SXLw)
- [Existing article source inventory](https://finessebjj.com/wp-json/wp/v2/posts?per_page=100&_fields=slug,link,title)

Existing public robots.txt is `User-Agent: *` with empty Disallow. The prepared production policy retains that generic crawl permission, excludes the new API endpoint and advertises the sitemap; no special model-training policy was invented. Preview/local exclusion is separate. A future weekly manual review should sample the homepage, one program, one news/article and one competition, then check forms, Search Console coverage, GA leads, and crawler controls. No recurring automation was scheduled.

## Final cleanup

Refreshed the workspace local build without fixture overrides: its actual robots output disallows all crawling and its sitemap is empty, as intended for a local build. Restored the pre-existing generated development type-reference paths in next-env.d.ts. Temporary smoke-test servers were stopped; the user's existing development servers were not stopped. The original .claude/launch.json and unrelated work were preserved. An earlier browser timeout was resolved in the subsequent launch-preparation session. The final protected release was reviewed in Chrome and a screenshot saved. Public DNS cutover remains pending.

## Where the policy/archive review notes are

These are internal review documents, not a public website section:

- `src/app/privacy/page.tsx`: local website privacy draft, served at `/privacy`.
- `src/app/terms/page.tsx`: local website terms/information draft, served at `/terms`.
- `src/app/news/archive/page.tsx`: local archive index at `/news/archive`.
- `docs/legacy-article-review.json`: internal article-by-article editorial flags.
- `docs/legacy-article-migration.md`: internal migration inventory and decisions.

The current public GoDaddy-hosted site will not show these changes until DNS is switched. The prepared Vercel release now includes the policy pages, footer links and archive. The archive was intentionally not added to the existing homepage or News navigation. Internal review notes remain repository documents, separate from visitor-facing pages.
