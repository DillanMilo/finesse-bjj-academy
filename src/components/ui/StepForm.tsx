"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { calendarLinks, type CalendarNote } from "@/lib/calendar";
import type { SheetEvent } from "@/lib/sheet-forms";

// Building blocks for the one-question-per-screen sheet forms (competition sign-up, promotion check-in).

export const stepInputClass = "w-full bg-black/25 text-white text-lg p-4 border border-white/40 placeholder:text-white/50 focus:border-white outline-none transition-colors";

/** Progress bar, back button and an animated, focus-managed panel for the current step. */
export function StepShell({ stepKey, index, total, title, hint, onBack, children }: { stepKey: string; index: number; total: number; title: string; hint?: string; onBack?: () => void; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; }, []);
  // Move focus to each new question as it appears (after the old one animates out), so keyboard and
  // screen reader users land on it. Not on first load, so the page doesn't jump to the form.
  const focusHeading = useCallback((el: HTMLHeadingElement | null) => {
    if (!el || !mounted.current) return;
    el.focus({ preventScroll: true });
    // On phones the new question can start above the screen (under the fixed header) or below it.
    const top = el.getBoundingClientRect().top;
    if (top < 90 || top > window.innerHeight - 120) el.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);
  return <div>
    <div className="flex items-center justify-between gap-4 mb-3">
      <p className="text-xs font-bold tracking-[.2em]">STEP {index + 1} OF {total}</p>
      {onBack && <button type="button" onClick={onBack} className="text-sm text-white/85 hover:text-white underline underline-offset-4"><ArrowIcon direction="left" className="h-3.5 w-3.5" /> Back</button>}
    </div>
    <div className="flex gap-1.5 mb-8" aria-hidden="true">{Array.from({ length: total }, (_, n) => <div key={n} className="h-1.5 flex-1 bg-white/25 overflow-hidden"><motion.div className="h-full bg-white" initial={false} animate={{ width: n <= index ? "100%" : "0%" }} transition={{ duration: reduceMotion ? 0 : 0.35 }} /></div>)}</div>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={stepKey} initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -40 }} transition={{ duration: reduceMotion ? 0.1 : 0.25, ease: "easeOut" }}>
        <h3 ref={focusHeading} tabIndex={-1} className="font-headline text-4xl md:text-5xl leading-none outline-none">{title}</h3>
        {hint && <p className="mt-3 text-white/85">{hint}</p>}
        <div className="mt-6">{children}</div>
      </motion.div>
    </AnimatePresence>
  </div>;
}

/** A big tap target for one answer. Picking it usually moves straight on to the next step. */
export function ChoiceCard({ selected, onClick, title, sub, children }: { selected?: boolean; onClick: () => void; title: string; sub?: string; children?: ReactNode }) {
  return <motion.button type="button" aria-pressed={selected} onClick={onClick} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
    className={`w-full text-left p-5 border-2 transition-colors ${selected ? "bg-black border-black" : "border-white/45 hover:border-white hover:bg-white/10"}`}>
    {children}
    <span className="block font-headline text-3xl leading-none">{title}</span>
    {sub && <span className="block mt-2 text-sm text-white/85">{sub}</span>}
  </motion.button>;
}

export function NextButton({ children, disabled, type = "button", onClick }: { children: ReactNode; disabled?: boolean; type?: "button" | "submit"; onClick?: () => void }) {
  return <button type={type} disabled={disabled} onClick={onClick} className="w-full bg-black py-4 font-headline text-2xl tracking-wider hover:bg-[#1a1a1a] transition-colors disabled:opacity-60">{children}</button>;
}

const BURST = Array.from({ length: 16 }, (_, n) => {
  const angle = (n / 16) * Math.PI * 2;
  const distance = 70 + (n % 3) * 28;
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, rotate: n * 47, color: ["#ffffff", "#000000", "#FFB3AD"][n % 3] };
});

/** The finish screen: a little confetti burst, what they signed up for, and add-to-calendar links. */
export function Celebration({ title, message, event, calendarNote, summary, onAgain, againLabel }: { title: string; message: string; event?: SheetEvent; calendarNote?: CalendarNote; summary: [string, string][]; onAgain: () => void; againLabel: string }) {
  const reduceMotion = useReducedMotion();
  const links = event && calendarNote ? calendarLinks(event, calendarNote) : null;
  return <div role="status" className="relative">
    {!reduceMotion && <div aria-hidden="true" className="pointer-events-none absolute left-12 top-10">{BURST.map((piece, n) => <motion.span key={n} className="absolute block h-2.5 w-2.5" style={{ background: piece.color }} initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }} animate={{ x: piece.x, y: piece.y, opacity: 0, rotate: piece.rotate, scale: 1 }} transition={{ duration: 1.1, ease: "easeOut" }} />)}</div>}
    <motion.div initial={reduceMotion ? false : { scale: 0.6, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: "spring", damping: 12, stiffness: 180 }} className="inline-flex h-16 w-16 items-center justify-center bg-black">
      <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.4 }} /></svg>
    </motion.div>
    <p className="mt-6 font-headline text-5xl md:text-6xl leading-none">{title}</p>
    <p className="mt-3 text-white/90 max-w-xl">{message}</p>
    <dl className="mt-6 grid sm:grid-cols-2 gap-px bg-white/25 border border-white/25">{summary.map(([label, value]) => <div key={label} className="bg-[#CC1122] p-4"><dt className="text-xs font-bold tracking-[.2em] text-white/80">{label.toUpperCase()}</dt><dd className="mt-1 font-headline text-2xl leading-tight">{value}</dd></div>)}</dl>
    <div className="mt-6 flex flex-wrap gap-3">
      {links && <><a href={links.google} target="_blank" rel="noopener noreferrer" className="bg-black px-5 py-3 font-headline text-xl tracking-wider hover:bg-[#1a1a1a]">ADD TO GOOGLE CALENDAR <ArrowIcon /></a>
      <a href={links.ics} className="border border-white/60 px-5 py-3 font-headline text-xl tracking-wider hover:bg-white/10">APPLE / OUTLOOK</a></>}
      <button type="button" onClick={onAgain} className="px-5 py-3 font-headline text-xl tracking-wider underline underline-offset-4 hover:text-white/80">{againLabel}</button>
    </div>
  </div>;
}
