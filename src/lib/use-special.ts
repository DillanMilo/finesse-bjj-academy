"use client";

import { useSyncExternalStore } from "react";
import { activeSpecial, specials } from "@/lib/specials";

// Specials are checked in the browser (not at build time), so a cached page never shows one that has ended.
// Both hooks return null during the server render and the first paint.

function tick(intervalMs: number) {
  return (onChange: () => void) => {
    const timer = setInterval(onChange, intervalMs);
    return () => clearInterval(timer);
  };
}
const everySecond = tick(1000);
const everyMinute = tick(60_000);

/** Current time in whole seconds, updated every second. Null on the server. */
export function useNowSeconds() {
  return useSyncExternalStore(everySecond, () => Math.floor(Date.now() / 1000), () => null);
}

/** The special running right now (rechecked every minute), or null. */
export function useActiveSpecial() {
  const slug = useSyncExternalStore(everyMinute, () => activeSpecial()?.slug ?? "", () => "");
  return specials.find(special => special.slug === slug) ?? null;
}
