"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import ArrowIcon from "@/components/ui/ArrowIcon";
import { formatPrice, lowestPrice, timeLeftLabel, type Special } from "@/lib/specials";
import { useActiveSpecial, useNowSeconds } from "@/lib/use-special";

// Slim bar above the navbar while a special is running (src/lib/specials.ts). Not a pop-up, so it doesn't
// compete with the free trial prompt or the belt promotion button. It slides away once the page scrolls,
// hides on the special's own page, and stays closed for the rest of the visit once someone closes it.

export const SPECIAL_BAR_HEIGHT = 40;
const DISMISSED_KEY = "finesse-special-bar-dismissed";
const DISMISSED_EVENT = "finesse-special-bar-dismissed";

function subscribe(onChange: () => void) {
  window.addEventListener(DISMISSED_EVENT, onChange);
  return () => window.removeEventListener(DISMISSED_EVENT, onChange);
}
function dismissedSlug() {
  try { return sessionStorage.getItem(DISMISSED_KEY) ?? ""; } catch { return ""; }
}

/** The special the bar is showing on this page, or null. The navbar uses it to sit below the bar. */
export function useSpecialBar() {
  const special = useActiveSpecial();
  const dismissed = useSyncExternalStore(subscribe, dismissedSlug, () => "");
  const pathname = usePathname();
  return special && dismissed !== special.slug && pathname !== `/${special.slug}` ? special : null;
}

export default function SpecialBar({ special, tucked }: { special: Special | null; tucked: boolean }) {
  const reduceMotion = useReducedMotion();
  const now = useNowSeconds();
  // Pages with little room above their heading add this to their top padding: --special-bar-space.
  useEffect(() => {
    document.documentElement.style.setProperty("--special-bar-space", special ? `${SPECIAL_BAR_HEIGHT}px` : "0px");
  }, [special]);

  function dismiss(slug: string) {
    try { sessionStorage.setItem(DISMISSED_KEY, slug); } catch { /* Without storage it just hides until the next page. */ }
    window.dispatchEvent(new Event(DISMISSED_EVENT));
  }

  return <AnimatePresence>
    {special && <motion.div key={special.slug} aria-label={special.name} role="region"
      className="fixed inset-x-0 top-0 z-[51] overflow-hidden bg-[#CC1122] text-white"
      style={{ height: SPECIAL_BAR_HEIGHT }}
      initial={{ y: -SPECIAL_BAR_HEIGHT }} animate={{ y: tucked ? -SPECIAL_BAR_HEIGHT : 0 }} exit={{ y: -SPECIAL_BAR_HEIGHT }}
      transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}>
      {/* A light sweep every few seconds, so the bar catches the eye without blinking. */}
      {!reduceMotion && <motion.span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        initial={{ left: "-40%" }} animate={{ left: "140%" }} transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }} />}
      <Link href={`/${special.slug}`} className="relative flex h-full items-center justify-center gap-2 px-11 text-center font-headline text-[15px] leading-none tracking-wider sm:gap-3 sm:text-base">
        <span className="bg-black px-2 py-1 text-[11px] font-bold tracking-[.2em] sm:text-xs"><span className="sm:hidden">{special.shortName.toUpperCase()}</span><span className="hidden sm:inline">{special.name.toUpperCase()}</span></span>
        <span className="hidden md:inline">{special.when.toUpperCase()} · MEMBERSHIPS FROM {formatPrice(Math.floor(lowestPrice(special)))} PER YEAR</span>
        {now !== null && <span className="text-white/90"><span className="hidden md:inline">· </span>{timeLeftLabel(special, now * 1000).toUpperCase()}</span>}
        <span className="inline-flex items-center gap-1"><span className="hidden underline underline-offset-4 sm:inline">SEE DEALS</span><ArrowIcon direction="right" className="h-3 w-3" /></span>
      </Link>
      <button type="button" onClick={() => dismiss(special.slug)} aria-label={`Hide the ${special.name} bar`}
        className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-white/80 hover:text-white">&#x2715;</button>
    </motion.div>}
  </AnimatePresence>;
}
