"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { finesseStore } from "@/lib/store";

export default function MerchStore() {
  const [flyerFailed, setFlyerFailed] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <section id="store" aria-labelledby="store-heading" className="scroll-mt-20 bg-[#151013] border-y border-white/10 py-16 sm:py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: reducedMotion ? 0 : 0.6 }}
        className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
      >
        <div>
          <p className="text-[#FFB3AD] text-xs font-bold tracking-[.25em] mb-4">FINESSE JIU JITSU / TEAM STORE</p>
          <h2 id="store-heading" className="font-headline italic text-6xl sm:text-7xl lg:text-8xl leading-none">WEAR THE<br/><span className="text-[#CC1122]">FINESSE.</span></h2>
          <p className="text-zinc-300 text-lg leading-relaxed mt-6 max-w-lg">Represent your academy beyond the mats. Explore Finesse merchandise in our BSN SPORTS team store.</p>
          <a href={finesseStore.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-5 mt-8 bg-[#CC1122] px-7 py-4 font-headline text-2xl tracking-wider text-white hover:bg-[#a90e1c] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">SHOP THE FINESSE STORE <span aria-hidden="true">↗</span></a>
          <p className="text-xs text-zinc-400 mt-3">Opens the BSN SPORTS shop in a new tab.</p>
        </div>
        <a href={finesseStore.url} target="_blank" rel="noopener noreferrer" aria-label="Browse Finesse merchandise at BSN SPORTS (opens in a new tab)" className="block border border-white/15 bg-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <div className="relative aspect-[421/298]">
          {/* Keep flyer artwork uncropped so any product details stay legible. */}
          {flyerFailed ? <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#30131b] to-black"><Image src="/logo.png" alt="" width={180} height={180} className="h-36 w-auto mb-5"/><span className="font-headline text-4xl sm:text-5xl text-white">ONE TEAM. YOUR GEAR.</span><span className="text-[#FFB3AD] text-sm mt-3 tracking-widest">EXPLORE THE STORE ↗</span></div> : <Image src={finesseStore.flyer} alt="Finesse Jiu Jitsu team store merchandise flyer" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" onError={() => setFlyerFailed(true)} />}
          </div>
          <span className="flex justify-between gap-4 bg-black/90 px-5 py-3 text-xs text-zinc-300 tracking-widest"><span>FINESSE TEAM MERCH</span><span>BSN SPORTS ↗</span></span>
        </a>
      </motion.div>
    </section>
  );
}
