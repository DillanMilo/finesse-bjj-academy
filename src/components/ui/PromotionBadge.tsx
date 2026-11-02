"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import PromotionCheckinForm from "@/components/ui/PromotionCheckinForm";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { competitionPhase } from "@/lib/competitions";
import { checkinEvent, promotions } from "@/lib/promotions";

// Bottom-right "Belt promotion" button, shown on every page while a promotion is upcoming (src/lib/promotions.ts).
// Tapping it opens the check-in form in a pop-up. It goes away by itself the day after the promotion,
// for the rest of the visit once someone closes it, and for good on this device once they've checked in.

const DISMISSED_KEY = "finesse-promotion-badge-dismissed";
const CHECKED_IN_KEY = "finesse-promotion-checked-in";
const DISMISSED_EVENT = "finesse-promotion-badge-dismissed";
const BELT_CYCLE = ["#f4f4f5", "#1f5fbf", "#6b2fa3", "#6b4226", "#111111"];

function subscribe(onChange: () => void) {
  window.addEventListener(DISMISSED_EVENT, onChange);
  return () => window.removeEventListener(DISMISSED_EVENT, onChange);
}
/** Slug of the next promotion, unless this visitor closed the button for it this visit. Empty on the server. */
function visibleSlug() {
  const next = promotions.find(event => competitionPhase(event) !== "past");
  if (!next) return "";
  try {
    if (sessionStorage.getItem(DISMISSED_KEY) === next.slug || localStorage.getItem(CHECKED_IN_KEY) === next.slug) return "";
  } catch { /* Without storage the button just stays until closed. */ }
  return next.slug;
}

export default function PromotionBadge({ hidden }: { hidden?: boolean }) {
  const slug = useSyncExternalStore(subscribe, visibleSlug, () => "");
  // The promotion whose pop-up is open. Kept separately so the pop-up stays on its success screen
  // after the check-in hides the button.
  const [openSlug, setOpenSlug] = useState("");
  const open = openSlug !== "";
  const reduceMotion = useReducedMotion();
  const promotion = promotions.find(event => event.slug === slug);
  const openPromotion = promotions.find(event => event.slug === openSlug);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function hideFor(storage: () => Storage, key: string, hiddenSlug: string) {
    try { storage().setItem(key, hiddenSlug); } catch { /* Without storage the button just comes back on the next page. */ }
    window.dispatchEvent(new Event(DISMISSED_EVENT));
  }

  const today = promotion && competitionPhase(promotion) === "today";
  const shortDate = promotion && new Date(`${promotion.isoDate}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }).replace(",", " ·").toUpperCase();

  return <>
    <AnimatePresence>
      {promotion && !hidden && !open && <motion.aside aria-label="Belt promotion check-in" className="fixed bottom-4 right-4 z-[54] sm:bottom-6 sm:right-6"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.9 }}
        transition={{ type: "spring", damping: 18, stiffness: 220, delay: 0.8 }}>
        <motion.button type="button" onClick={() => setOpenSlug(promotion.slug)} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 bg-[#CC1122] py-3 pl-3 pr-11 text-left text-white shadow-[0_18px_40px_rgba(0,0,0,0.55)]">
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center bg-black">
            <motion.span className="relative block h-3 w-8" animate={reduceMotion ? undefined : { backgroundColor: BELT_CYCLE }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ backgroundColor: BELT_CYCLE[0] }}>
              <span className="absolute right-1 top-0 h-full w-2 bg-[#CC1122]" />
            </motion.span>
          </span>
          <span>
            <span className="block text-[11px] font-bold tracking-[.2em]">BELT PROMOTION</span>
            <span className="block font-headline text-2xl leading-none">{today ? "TODAY" : shortDate}</span>
            <span className="mt-1 block text-xs font-bold tracking-[.12em] underline underline-offset-4">CHECK IN <ArrowIcon direction="right" className="h-3 w-3" /></span>
          </span>
        </motion.button>
        <button type="button" onClick={() => hideFor(() => sessionStorage, DISMISSED_KEY, promotion.slug)} aria-label="Hide the belt promotion button" className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-white/80 hover:text-white">&#x2715;</button>
      </motion.aside>}
    </AnimatePresence>
    <AnimatePresence>
      {openPromotion && <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenSlug("")}>
        <motion.div role="dialog" aria-modal="true" aria-label="Belt promotion check-in" className="relative max-h-[92dvh] w-full max-w-xl overflow-y-auto sm:mx-4"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === "Escape") setOpenSlug(""); }}>
          <button type="button" onClick={() => setOpenSlug("")} autoFocus aria-label="Close check-in" className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center text-xl text-white/85 hover:text-white">&#x2715;</button>
          <PromotionCheckinForm events={[checkinEvent(openPromotion)]} onSent={checkedInSlug => hideFor(() => localStorage, CHECKED_IN_KEY, checkedInSlug)} />
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
