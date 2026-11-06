# Google Analytics 4 setup (2026-11-05)

The previous self-built website never had a Google Analytics account that Creative Currents could access. The old tag `G-9N5EQ7RVHQ` is retired. This is a fresh account.

| Item | Value |
| --- | --- |
| Owner login | dillan@creativecurrents.io |
| Account | Finesse BJJ (`415091722`), all optional data sharing off, US terms and GDPR Data Processing Terms accepted 2026-11-05 with Dillan's approval |
| Property | Finesse BJJ Website (`562795024`), (GMT-06:00) Chicago Time, USD, Sports, Small, objective Generate leads |
| Web stream | Finesse BJJ Website (`16282720048`), https://finessebjj.com |
| Measurement ID | `G-HZ491L13L8` (set as `GA_ID` in `src/lib/analytics.ts`) |
| Enhanced measurement | On, including page changes based on browser history events (client-side navigation page views) |
| Google signals | Off. No Google Ads or other product links. |
| Key event | `generate_lead` |
| Reports | https://analytics.google.com/analytics/web/#/p562795024/reports/intelligenthome |

The implementation is unchanged. Google loads only after "Allow analytics" and only on finessebjj.com or www.finessebjj.com in production. Withdrawing consent clears the `_ga` cookies and reloads the page. Custom events carry fixed categories only, never names, emails, phone numbers or form contents. The regression test in `tests/analytics.test.cjs` keeps exactly one Google tag and this single measurement ID.
