export const GA_ID = "G-HZ491L13L8";
export const ANALYTICS_CONSENT_KEY = "finesse-analytics-consent-v1";
export const ANALYTICS_CONSENT_EVENT = "finesse-analytics-consent-change";
type AnalyticsEvent = "generate_lead" | "team_support_rsvp" | "promotion_checkin" | "contact_click";
type EventParams = { form_type?: "trial" | "enquiry" | "competition" | "promotion" | "special"; contact_method?: "phone" | "email" };
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
// Visitors in the EU/EEA, UK and Switzerland are asked before analytics loads (GDPR/ePrivacy).
// Everyone else is measured by default; the privacy notice and footer Cookie preferences give a one-tap opt-out.
// Detection uses the browser time zone, so no location lookup or server request is needed.
const OPT_IN_ATLANTIC_ZONES = ["Atlantic/Reykjavik", "Atlantic/Canary", "Atlantic/Madeira", "Atlantic/Azores", "Atlantic/Faroe"];
export function requiresOptIn(timeZone: string | undefined, globalPrivacyControl: boolean): boolean {
  if (globalPrivacyControl) return true; // Honor the browser's Global Privacy Control signal.
  if (!timeZone) return false;
  return timeZone.startsWith("Europe/") || OPT_IN_ATLANTIC_ZONES.includes(timeZone);
}
export function visitorRequiresOptIn(): boolean {
  try {
    const gpc = Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
    return requiresOptIn(Intl.DateTimeFormat().resolvedOptions().timeZone, gpc);
  } catch { return true; } // If we cannot tell, take the cautious route.
}
export function analyticsAllowed(hostname: string, consent: string | null, production: boolean, optInRequired = true): boolean {
  if (!production || !["finessebjj.com", "www.finessebjj.com"].includes(hostname)) return false;
  if (consent === "granted") return true;
  if (consent === "denied") return false;
  return !optInRequired;
}
/** Only fixed event names and categorical parameters. Never send form field values. */
export function trackEvent(event: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  try {
    if (!analyticsAllowed(window.location.hostname, localStorage.getItem(ANALYTICS_CONSENT_KEY), Boolean(window.gtag), visitorRequiresOptIn())) return;
    window.gtag?.("event", event, { ...params, send_to: GA_ID });
  } catch { /* Analytics must never prevent a form submission or navigation. */ }
}
