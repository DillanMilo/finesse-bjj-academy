"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadPopup({ isOpen, onClose }: LeadPopupProps) {
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
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
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-zinc-400 hover:text-white transition-colors text-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              &#x2715;
            </button>

            {/* Heading */}
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl tracking-tighter italic mb-2 text-white">
              BOOK YOUR FREE CONSULTATION
            </h2>
            <p className="font-serif text-base sm:text-lg italic text-[#E6BDB9] mb-6 sm:mb-8">
              Your journey starts here.
            </p>

            {/* Form */}
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Your Name"
                className="bg-transparent border-b border-[#5C3F3D] focus:border-[#CC1122] py-3 text-white placeholder:text-zinc-600 font-body outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-b border-[#5C3F3D] focus:border-[#CC1122] py-3 text-white placeholder:text-zinc-600 font-body outline-none transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="bg-transparent border-b border-[#5C3F3D] focus:border-[#CC1122] py-3 text-white placeholder:text-zinc-600 font-body outline-none transition-colors"
              />
              <button
                type="submit"
                className="-skew-x-12 bg-[#CC1122] py-3 sm:py-4 mt-4 shadow-[0_0_30px_rgba(204,17,34,0.4)] hover:brightness-110 transition-all"
              >
                <span className="skew-x-12 inline-block font-headline text-base sm:text-lg md:text-xl tracking-widest text-white">
                  BOOK MY CONSULTATION
                </span>
              </button>
              <p className="text-zinc-600 text-sm text-center mt-4">
                No commitment. No pressure. Just a 20-minute conversation about your goals.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
