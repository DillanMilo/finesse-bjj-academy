"use client";

import Script from "next/script";
import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from "react";

// Cloudflare Turnstile bot check. Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
/** Turnstile's "flexible" size needs at least this much width; narrower forms get "compact". */
const FLEXIBLE_MIN_WIDTH = 300;

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string | undefined;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
  getResponse(widgetId: string): string | undefined;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export interface TurnstileHandle {
  /** Current token, or "" when the widget is off or not solved yet. */
  token(): string;
  /** Gets a fresh token after a send attempt (tokens are single use). */
  reset(): void;
}

export default function TurnstileWidget({ ref, className = "" }: { ref: Ref<TurnstileHandle>; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    const el = container.current;
    if (!SITE_KEY || !el || widgetId.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(el, {
      sitekey: SITE_KEY,
      theme: "dark",
      size: el.clientWidth < FLEXIBLE_MIN_WIDTH ? "compact" : "flexible",
      "response-field": false,
    }) ?? null;
  }, []);

  useImperativeHandle(ref, () => ({
    token: () => (widgetId.current && window.turnstile?.getResponse(widgetId.current)) || "",
    reset: () => {
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    },
  }), []);

  // Covers re-mounts after the script has loaded (pop-up reopened); onLoad/onReady cover the first load.
  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [renderWidget]);

  if (!SITE_KEY) return null;
  return (
    <>
      <Script src={SCRIPT_SRC} strategy="afterInteractive" onLoad={renderWidget} onReady={renderWidget} />
      <div ref={container} className={className} />
    </>
  );
}
