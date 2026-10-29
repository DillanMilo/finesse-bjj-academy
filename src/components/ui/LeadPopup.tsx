"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TrialSessionForm, { type Audience } from "./TrialSessionForm";

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  /** Which class list the picker opens on. */
  audience?: Audience;
}

/** The one free trial pop-up: navbar, footer, page buttons and the timed prompt all open this. */
export default function LeadPopup({ isOpen, onClose, audience }: LeadPopupProps) {
  const handleClose = onClose;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-popup-title"
            onKeyDown={(e) => { if (e.key === "Escape") handleClose(); }}
            className="relative max-w-lg w-full mx-4 max-h-[90dvh] overflow-y-auto bg-[#1A1014] border border-[#CC1122]/30 p-5 sm:p-6 md:p-8 lg:p-12 clip-corner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Neon corner accents */}
            {/* Top-left */}
            <div className="absolute top-0 left-0 w-6 h-[2px] bg-[#CC1122] shadow-[0_0_8px_rgba(204,17,34,0.6)]" />
            <div className="absolute top-0 left-0 w-[2px] h-6 bg-[#CC1122] shadow-[0_0_8px_rgba(204,17,34,0.6)]" />
            {/* Top-right */}
            <div className="absolute top-0 right-0 w-6 h-[2px] bg-[#CC1122] shadow-[0_0_8px_rgba(204,17,34,0.6)]" />
            <div className="absolute top-0 right-0 w-[2px] h-6 bg-[#CC1122] shadow-[0_0_8px_rgba(204,17,34,0.6)]" />
            {/* Bottom-left */}
            <div className="absolute bottom-0 left-0 w-6 h-[2px] bg-[#CC1122] shadow-[0_0_8px_rgba(204,17,34,0.6)]" />
            <div className="absolute bottom-0 left-0 w-[2px] h-6 bg-[#CC1122] shadow-[0_0_8px_rgba(204,17,34,0.6)]" />
            {/* Bottom-right */}
            <div className="absolute bottom-0 right-0 w-6 h-[2px] bg-[#CC1122] shadow-[0_0_8px_rgba(204,17,34,0.6)]" />
            <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-[#CC1122] shadow-[0_0_8px_rgba(204,17,34,0.6)]" />

            {/* Close button */}
            <button
              onClick={handleClose}
              autoFocus
              aria-label="Close booking pop-up"
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-zinc-400 hover:text-white transition-colors text-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              &#x2715;
            </button>

            {/* Heading */}
            <h2 id="lead-popup-title" className="font-headline text-2xl sm:text-3xl md:text-4xl tracking-tighter italic mb-2 text-white">
              BOOK YOUR FREE TRIAL
            </h2>
            <p className="font-serif text-base sm:text-lg italic text-[#E6BDB9] mb-6 sm:mb-8">
              Kids, teens &amp; adults welcome. Pick a beginner-friendly class.
            </p>

            <TrialSessionForm idPrefix="trial-popup" defaultAudience={audience} />
            <p className="text-zinc-500 text-sm text-center mt-5">
              No commitment. No pressure. Take your first step on the mats.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
