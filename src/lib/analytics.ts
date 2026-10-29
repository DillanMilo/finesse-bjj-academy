export const GA_ID = "G-9N5EQ7RVHQ";
export const ANALYTICS_CONSENT_KEY = "finesse-analytics-consent-v1";
export const ANALYTICS_CONSENT_EVENT = "finesse-analytics-consent-change";
type AnalyticsEvent = "generate_lead" | "team_support_rsvp" | "contact_click";
type EventParams = { form_type?: "trial" | "enquiry" | "support"; contact_method?: "phone" | "email" };
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function analyticsAllowed(hostname: string, consent: string | null, production: boolean): boolean {
  return production && ["finessebjj.com", "www.finessebjj.com"].includes(hostname) && consent === "granted";
}
/** Only fixed event names and categorical parameters. Never send form field values. */
export function trackEvent(event: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  try {
    if (!analyticsAllowed(window.location.hostname, localStorage.getItem(ANALYTICS_CONSENT_KEY), Boolean(window.gtag))) return;
    window.gtag?.("event", event, { ...params, send_to: GA_ID });
  } catch { /* Analytics must never prevent a form submission or navigation. */ }
}
