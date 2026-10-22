"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TrialSessionForm from "./TrialSessionForm";
import HoneypotField from "./HoneypotField";
import { FORM_FAILURE_MESSAGE, HONEYPOT_FIELD, sendContactForm, type FormStatus } from "@/lib/contact-form";

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "consultation" | "trial";
}

export default function LeadPopup({ isOpen, onClose, mode = "consultation" }: LeadPopupProps) {
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleClose() {
    if (status !== "sending") setStatus("idle");
    onClose();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const ok = await sendContactForm({
      kind: "trial",
      source: "Book your free trial pop-up",
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? ""),
    });
    if (ok) form.reset();
    setStatus(ok ? "sent" : "failed");
  }

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
              {mode === "trial" ? "Start with a beginner-friendly kids’ class. Ages 8–14." : "Your journey starts here."}
            </p>

            {/* Form */}
            {mode === "trial" ? <TrialSessionForm idPrefix="trial-popup" /> : <form
              className="relative flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <HoneypotField />
              <input
                type="text"
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                aria-label="Your Name"
                placeholder="Your Name"
                className="bg-transparent border-b border-[#5C3F3D] focus:border-[#CC1122] py-3 text-white placeholder:text-zinc-600 font-body outline-none transition-colors"
              />
              <input
                type="email"
                name="email"
                required
                maxLength={254}
                autoComplete="email"
                aria-label="Email Address"
                placeholder="Email Address"
                className="bg-transparent border-b border-[#5C3F3D] focus:border-[#CC1122] py-3 text-white placeholder:text-zinc-600 font-body outline-none transition-colors"
              />
              <input
                type="tel"
                name="phone"
                maxLength={40}
                autoComplete="tel"
                aria-label="Phone Number"
                placeholder="Phone Number"
                className="bg-transparent border-b border-[#5C3F3D] focus:border-[#CC1122] py-3 text-white placeholder:text-zinc-600 font-body outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="-skew-x-12 bg-[#CC1122] py-3 sm:py-4 mt-4 shadow-[0_0_30px_rgba(204,17,34,0.4)] hover:brightness-110 transition-all disabled:opacity-60"
              >
                <span className="skew-x-12 inline-block font-headline text-base sm:text-lg md:text-xl tracking-widest text-white">
                  {status === "sending" ? "SENDING…" : "BOOK MY FREE TRIAL"}
                </span>
              </button>
              {(status === "sent" || status === "failed") && (
                <p role="status" className="border-l-2 border-[#CC1122] pl-4 text-sm text-white">
                  {status === "sent"
                    ? "Thanks, your request has been sent. The academy will be in touch to confirm your free trial."
                    : FORM_FAILURE_MESSAGE}
                </p>
              )}
              <p className="text-zinc-600 text-sm text-center mt-4">
                No commitment. No pressure. Take your first step on the mats.
              </p>
            </form>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
