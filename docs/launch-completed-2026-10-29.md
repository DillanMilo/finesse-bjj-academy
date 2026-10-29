# Finesse BJJ launch completed — October 29, 2026

Dillan explicitly authorized launching immediately, superseding the earlier prohibition on DNS cutover. GoDaddy accepted the three-record batch after account and DNS-save identity verification.

The public site is now https://finessebjj.com. HTTPS is active and the new site returns 200. Both prepared domains serve the verified application release from Git commit `9d74e089ae0483c1ec9b50ed0af507ea7ae748a4`, deployment `dpl_GU8jPQ8RBbiUSSEvZWpzbb2vgGsv`. A later documentation-only commit does not change that application source.

## Applied changes

- Apex A records: `216.150.1.1` and `216.150.16.1`, TTL 600 seconds. Old `160.153.0.68` was replaced.
- www CNAME: `84b8072a6b7ec5e4.vercel-dns-017.com`, TTL 3600 seconds.
- GoDaddy now shows 28 records, up from 27 because the recommended apex set has two addresses.
- Nameservers remain GoDaddy. Microsoft 365 MX/SPF, Resend DKIM/CNAME and existing verification records compared against the pre-launch baseline are unchanged. No email migration or GoDaddy forwarding was configured.
- Vercel verified both hostnames as configured correctly. Its HTTP-01 certificate issuance completed successfully for the apex and www; standard HTTPS validation succeeded without bypasses.

## Public verification

- Both authoritative nameservers and public Cloudflare/Google DNS return the new routing.
- Normal public HTTPS returns the new site. Both apex IP addresses independently returned 200 for the striking program with valid HTTPS.
- HTTP upgrades to HTTPS; www returns 308 to the apex. Path and query strings survived the redirects.
- Public crawl passed: 52 pages, 71 internal destinations, 11 permanent legacy redirects, 3 genuine 404s, metadata/canonicals/JSON-LD, initial homepage content, 50-entry sitemap and production robots. Indexable pages have no hosting noindex header.
- The first crawl encountered a transient connection failure during HTTPS activation. Both edge addresses were checked individually, then a complete crawl with bounded retries passed.
- Vercel runtime error scan for the application deployment: zero error entries in the inspected 30-minute window.
- Full sanitized results: `docs/launch-live-checks-2026-10-29.json`.

## Remaining follow-ups and limits

Spark remains deferred by client instruction. Existing GA4 ID `G-9N5EQ7RVHQ` is configured with consent and production-hostname restrictions, but property access/reporting and final live collection have not been verified. Saved browser-origin permissions prevented live anti-spam widget and Google Analytics request inspection even after renewed user authorization; no browser-security setting was weakened or bypassed. No post-launch form or real-inbox email was sent. Prior isolated deployed Resend/Redis tests and the earlier approved info inbox test remain documented separately.

Search Console/Bing access and sitemap submission remain pending; no property was created or sitemap submitted in this launch. DNS caches can take time to expire despite the verified resolver results. Retain the old host during that propagation window. The rollback record in `docs/launch-cutover.md` remains available.

## Requested compact consent notice

Dillan subsequently requested a smaller analytics notice and confirmation of live visit tracking. The notice is now capped at 384px rather than 672px, placed at the bottom left, and uses shorter copy and less padding. Both choices, the privacy link, saved preferences and footer preference controls remain; buttons retain 44px minimum height. Tracking behavior and measurement ID are unchanged. Lint, all 14 regression tests and an isolated pinned Next.js 16.4.1 production build passed. Browser permission gates declined access to the live site, Google Analytics and the local preview, so visual QA, live collection requests and Realtime/report receipt could not be confirmed. Configured tracking must not be described as observed traffic: only consenting visitors are eligible in the current integration.

Consent requirements depend on applicable jurisdiction and implementation. This notice was a conservative global opt-in choice, not a finding that every Texas business must show a large banner. Removing the consent mechanism would be a separate tracking-policy decision. Sources reviewed: [Google consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode), [EU cookie guidance](https://europa.eu/youreurope/business/growing/digitalising/online-privacy/index_en.htm), [ICO statistical-purpose exceptions](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/).
