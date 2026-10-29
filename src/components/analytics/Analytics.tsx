"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { GA_ID, ANALYTICS_CONSENT_KEY, ANALYTICS_CONSENT_EVENT, analyticsAllowed, trackEvent } from "@/lib/analytics";

function snapshot() {
  try { return localStorage.getItem(ANALYTICS_CONSENT_KEY); } catch { return null; }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(ANALYTICS_CONSENT_EVENT, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(ANALYTICS_CONSENT_EVENT, callback); };
}
function saveConsent(choice: "granted" | "denied") {
  try { localStorage.setItem(ANALYTICS_CONSENT_KEY, choice); } catch { /* No storage means no analytics. */ }
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
  if (choice === "denied") {
    // Reload removes the loaded tag and its listeners immediately after withdrawal.
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ["", "; domain=finessebjj.com", "; domain=.finessebjj.com"]) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
      }
    }
    window.location.reload();
  }
}
export function AnalyticsPreferences() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("finesse-open-analytics-preferences"))} className="py-2 transition-colors hover:text-red-500">Cookie preferences</button>;
}
export default function Analytics({ production }: { production: boolean }) {
  const consent = useSyncExternalStore(subscribe, snapshot, () => null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const initialized = useRef(false);
  const enabled = typeof window !== "undefined" && analyticsAllowed(window.location.hostname, consent, production);
  useEffect(() => {
    if (initialized.current && consent !== "granted") {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      // A preference changed in another tab: stop automatic measurement here too.
      window.location.reload();
    }
  }, [consent]);
  useEffect(() => {
    const open = () => setPreferencesOpen(true);
    window.addEventListener("finesse-open-analytics-preferences", open);
    return () => window.removeEventListener("finesse-open-analytics-preferences", open);
  }, []);
  useEffect(() => {
    if (!enabled) return;
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackEvent("contact_click", { contact_method: "phone" });
      if (href.startsWith("mailto:")) trackEvent("contact_click", { contact_method: "email" });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [enabled]);
  function initialize() {
    if (initialized.current) return;
    initialized.current = true;
    window.dataLayer = window.dataLayer || [];
    // Google's command queue expects the gtag arguments object.
    // eslint-disable-next-line prefer-rest-params -- Preserve Google's documented gtag queue protocol.
    window.gtag = function () { window.dataLayer!.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    // Use GA's automatic pageviews only: never send a second manual page_view.
    window.gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  }
  const showChoice = preferencesOpen || (production && consent === null);
  return <>
    {enabled && <Script id="finesse-ga" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" onReady={initialize} />}
    {showChoice && <aside aria-label="Analytics cookie preferences" className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-2xl border border-white/20 bg-[#111] p-5 text-sm text-zinc-300 shadow-2xl">
      <p>Allow optional Google Analytics cookies to help us understand visits and training enquiries? Forms work with either choice. <Link href="/privacy" className="underline text-white">Privacy notice</Link></p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="border border-white/40 px-4 py-2 text-white" onClick={() => { saveConsent("denied"); setPreferencesOpen(false); }}>Decline analytics</button>
        <button type="button" className="bg-[#CC1122] px-4 py-2 text-white" onClick={() => { saveConsent("granted"); setPreferencesOpen(false); }}>Allow analytics</button>
      </div>
    </aside>}
  </>;
}
