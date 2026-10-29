"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ArrowIcon from "./ArrowIcon";
import type { Audience } from "./TrialSessionForm";

interface TrialNudgeProps {
  isOpen: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  audience?: Audience;
}

const LINE: Record<Audience, string> = {
  kids: "Kids, teens & adults welcome. No experience needed.",
  adults: "Never trained? Perfect. Beginners start here.",
};

/** The small timed prompt. It only invites; the full trial form opens when the visitor says yes. */
export default function TrialNudge({ isOpen, onAccept, onDismiss, audience = "kids" }: TrialNudgeProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          aria-label="Free trial invitation"
          className="fixed inset-x-3 bottom-3 z-[55] mx-auto max-w-[560px] sm:bottom-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onKeyDown={(e) => { if (e.key === "Escape") onDismiss(); }}
        >
          <div className="relative flex overflow-hidden border border-[#CC1122]/40 bg-[#1A1014] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#CC1122] to-transparent" />
            <div className="relative w-24 shrink-0 min-[400px]:w-32 sm:w-48">
              <Image src="/photos/adult-1416.webp" alt="A smiling Finesse student giving a thumbs up while training" fill loading="eager" sizes="(min-width: 640px) 192px, 128px" className="object-cover object-[40%_40%]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent from-70% to-[#1A1014]" />
            </div>
            <div className="flex-1 p-4 pr-10 sm:p-6 sm:pr-12">
              <p className="font-headline text-[11px] tracking-[0.3em] text-[#CC1122]">YOUR FIRST CLASS IS ON US</p>
              <p className="mt-1 font-headline text-2xl sm:text-3xl italic leading-none tracking-tighter text-white">READY TO STEP ON THE MAT?</p>
              <p className="mt-2 text-sm text-zinc-400">{LINE[audience]}</p>
              <button
                onClick={onAccept}
                className="mt-3 -skew-x-12 bg-[#CC1122] px-5 py-2.5 transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(204,17,34,0.4)]"
              >
                <span className="inline-block skew-x-12 font-headline text-base tracking-wider text-white">
                  CLAIM MY FREE CLASS <ArrowIcon direction="right" />
                </span>
              </button>
            </div>
            <button
              onClick={onDismiss}
              aria-label="Dismiss free trial invitation"
              className="absolute top-1 right-1 flex min-h-[40px] min-w-[40px] items-center justify-center text-zinc-500 transition-colors hover:text-white"
            >
              &#x2715;
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
