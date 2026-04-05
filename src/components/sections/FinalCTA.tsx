"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useOpenLeadForm } from "@/lib/lead-form-context";

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const openLeadForm = useOpenLeadForm();

  return (
    <section className="py-20 sm:py-28 md:py-40 bg-[#0A0A0A] relative overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-[#CC1122]/20 blur-[120px] rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <div ref={ref} className="relative z-10 text-center container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <motion.h2
          className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-[10rem] tracking-tighter italic leading-none mb-8 sm:mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-white block">FREE 20-MIN</span>
          <span className="text-[#CC1122] block">CONSULTATION</span>
        </motion.h2>

        <motion.p
          className="font-serif text-xl sm:text-2xl md:text-3xl italic text-[#E6BDB9] max-w-3xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          &ldquo;No shortcuts. No limits. Just the mats and the drive to be better
          than you were yesterday.&rdquo;
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <button
            onClick={openLeadForm}
            className="-skew-x-12 bg-[#CC1122] px-8 sm:px-12 md:px-16 py-4 sm:py-6 shadow-[0_0_30px_rgba(204,17,34,0.4)] hover:brightness-125 transition-all"
          >
            <span className="skew-x-12 inline-block font-headline text-xl sm:text-2xl md:text-4xl tracking-widest text-white uppercase">
              BOOK YOUR CONSULTATION
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
