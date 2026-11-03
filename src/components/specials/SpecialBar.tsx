"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import ArrowIcon from "@/components/ui/ArrowIcon";
import { formatPrice, lowestPrice, timeLeftLabel, type Special } from "@/lib/specials";
import { useActiveSpecial, useNowSeconds } from "@/lib/use-special";

// Slim bar just below the navbar while a special is running (src/lib/specials.ts). Not a pop-up, so it doesn't
// compete with the free trial prompt or the belt promotion button. It tucks away once the page scrolls,
// hides on the special's own page, and stays closed for the rest of the visit once someone closes it.
// Wide screens show the whole line; narrower screens scroll the same line across as a ticker.

export const SPECIAL_BAR_HEIGHT = 40;
/** The navbar's height (h-16); the bar sits right under it. */
const NAV_HEIGHT = 64;
const DISMISSED_KEY = "finesse-special-bar-dismissed";
const DISMISSED_EVENT = "finesse-special-bar-dismissed";

function subscribe(onChange: () => void) {
  window.addEventListener(DISMISSED_EVENT, onChange);
  return () => window.removeEventListener(DISMISSED_EVENT, onChange);
}
function dismissedSlug() {
  try { return sessionStorage.getItem(DISMISSED_KEY) ?? ""; } catch { return ""; }
}

/** The special the bar is showing on this page, or null. */
export function useSpecialBar() {
  const special = useActiveSpecial();
  const dismissed = useSyncExternalStore(subscribe, dismissedSlug, () => "");
  const pathname = usePathname();
  return special && dismissed !== special.slug && pathname !== `/${special.slug}` ? special : null;
}

export default function SpecialBar({ special, tucked }: { special: Special | null; tucked: boolean }) {
  const reduceMotion = useReducedMotion();
  const now = useNowSeconds();
  const timeLeft = special && now !== null ? timeLeftLabel(special, now * 1000).toUpperCase() : "";
  // Pages with little room under the navbar add this to their top padding: --special-bar-space.
  useEffect(() => {
    document.documentElement.style.setProperty("--special-bar-space", special ? `${SPECIAL_BAR_HEIGHT}px` : "0px");
  }, [special]);

  function dismiss(slug: string) {
    try { sessionStorage.setItem(DISMISSED_KEY, slug); } catch { /* Without storage it just hides until the next page. */ }
    window.dispatchEvent(new Event(DISMISSED_EVENT));
  }

  return <AnimatePresence>
    {special && <motion.div key={special.slug} aria-label={special.name} role="region"
      className="fixed inset-x-0 z-[49] overflow-hidden bg-[#CC1122] text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
      style={{ top: NAV_HEIGHT, height: SPECIAL_BAR_HEIGHT }}
      initial={{ y: -SPECIAL_BAR_HEIGHT, opacity: 0 }} animate={{ y: tucked ? -SPECIAL_BAR_HEIGHT : 0, opacity: tucked ? 0 : 1 }} exit={{ y: -SPECIAL_BAR_HEIGHT, opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}>
      {/* A light sweep every few seconds, so the bar catches the eye without blinking. */}
      {!reduceMotion && <motion.span aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        initial={{ left: "-40%" }} animate={{ left: "140%" }} transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }} />}
      <Link href={`/${special.slug}`} aria-label={`${special.name}: see the deals`} className="relative block h-full font-headline text-[15px] leading-none tracking-wider sm:text-base">
        {/* Wide screens: the whole line, centered. */}
        <span className="hidden h-full items-center justify-center gap-3 px-11 lg:flex"><BarLine special={special} timeLeft={timeLeft} /></span>
        {/* Narrower screens: the same line as a ticker (two copies, so the loop is seamless). Static if motion is reduced. */}
        {reduceMotion
          ? <span className="flex h-full items-center justify-center gap-2 px-11 lg:hidden"><BarBadge special={special} />{timeLeft && <span>{timeLeft}</span>}<ArrowIcon direction="right" className="h-3 w-3" /></span>
          : <motion.span aria-hidden="true" className="flex h-full w-max items-center lg:hidden" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 18, ease: "linear", repeat: Infinity }}>
            {[0, 1].map(copy => <span key={copy} className="flex shrink-0 items-center gap-3 pr-10"><BarLine special={special} timeLeft={timeLeft} /></span>)}
          </motion.span>}
      </Link>
      <button type="button" onClick={() => dismiss(special.slug)} aria-label={`Hide the ${special.name} bar`}
        className="absolute right-0 top-0 z-20 flex h-10 w-12 items-center justify-end bg-gradient-to-l from-[#CC1122] from-60% to-transparent pr-3.5 text-white/85 hover:text-white">&#x2715;</button>
    </motion.div>}
  </AnimatePresence>;
}

function BarBadge({ special }: { special: Special }) {
  return <span className="shrink-0 bg-black px-2 py-1 text-[11px] font-bold tracking-[.2em] sm:text-xs">{special.name.toUpperCase()}</span>;
}

/** "BLACK FRIDAY SPECIAL  ALL NOVEMBER · MEMBERSHIPS FROM $1,598 PER YEAR · 27 DAYS LEFT  SEE DEALS →" */
function BarLine({ special, timeLeft }: { special: Special; timeLeft: string }) {
  return <>
    <BarBadge special={special} />
    <span className="whitespace-nowrap">{special.when.toUpperCase()} · MEMBERSHIPS FROM {formatPrice(Math.floor(lowestPrice(special)))} PER YEAR</span>
    {timeLeft && <span className="whitespace-nowrap text-white/90">· {timeLeft}</span>}
    <span className="inline-flex shrink-0 items-center gap-1"><span className="underline underline-offset-4">SEE DEALS</span><ArrowIcon direction="right" className="h-3 w-3" /></span>
  </>;
}
