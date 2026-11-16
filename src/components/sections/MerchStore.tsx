"use client";

import ArrowIcon from "@/components/ui/ArrowIcon";
import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { finesseStore, nogiStore } from "@/lib/store";

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
          <a href={finesseStore.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-3 mt-8 bg-[#CC1122] px-7 py-4 font-headline text-2xl tracking-wider text-white hover:bg-[#a90e1c] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><span>SHOP THE FINESSE STORE</span><ArrowIcon /></a>
        </div>
        <a href={finesseStore.url} target="_blank" rel="noopener noreferrer" aria-label="Browse Finesse merchandise at BSN SPORTS (opens in a new tab)" className="block border border-white/15 bg-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <div className="relative aspect-[421/298]">
          {/* Keep flyer artwork uncropped so any product details stay legible. */}
          {flyerFailed ? <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#30131b] to-black"><Image src="/logo.png" alt="" width={180} height={180} className="h-36 w-auto mb-5"/><span className="font-headline text-4xl sm:text-5xl text-white">ONE TEAM. YOUR GEAR.</span><span className="text-[#FFB3AD] text-sm mt-3 tracking-widest">EXPLORE THE STORE <ArrowIcon /></span></div> : <Image src={finesseStore.flyer} alt="Finesse Jiu Jitsu team store merchandise flyer" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" onError={() => setFlyerFailed(true)} />}
          </div>
          <span className="flex justify-between gap-4 bg-black/90 px-5 py-3 text-xs text-zinc-300 tracking-widest"><span>FINESSE TEAM MERCH</span><span className="inline-flex items-center gap-1">BSN SPORTS <ArrowIcon className="h-3 w-3" /></span></span>
        </a>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: reducedMotion ? 0 : 0.6 }}
        className="max-w-7xl mx-auto px-6 md:px-8 mt-14 sm:mt-20"
      >
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12 items-center border-t border-white/10 pt-14 sm:pt-20">
          <div>
            <p className="text-[#FFB3AD] text-xs font-bold tracking-[.25em] mb-4">NOGI UNIFORMS / FIRST ROLL GEAR</p>
            <h3 className="font-headline italic text-5xl sm:text-6xl leading-none">TRAIN IN THE<br/><span className="text-[#CC1122]">TEAM COLORS.</span></h3>
            <p className="text-zinc-300 text-lg leading-relaxed mt-6 max-w-lg">Official Finesse rashguards and shorts, from {nogiStore.fromPrice}. Made to order: orders go out weekly and take about 2 to 3 weeks to arrive.</p>
            <a href={nogiStore.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-3 mt-8 bg-[#CC1122] px-7 py-4 font-headline text-2xl tracking-wider text-white hover:bg-[#a90e1c] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><span>ORDER NOGI UNIFORMS</span><ArrowIcon /></a>
          </div>
          <a href={nogiStore.url} target="_blank" rel="noopener noreferrer" aria-label="Order Finesse NoGi uniforms at First Roll Gear (opens in a new tab)" className="group block border border-white/15 bg-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10">
              {nogiStore.products.map(product => <li key={product.name} className="bg-[#ededed] p-3">
                <div className="relative aspect-square"><Image src={product.image} alt={`Finesse ${product.name}`} fill sizes="(min-width: 1024px) 15vw, (min-width: 640px) 25vw, 50vw" className="object-contain transition-transform duration-500 group-hover:scale-105" /></div>
                <p className="mt-2 text-center text-[11px] font-bold tracking-wider text-zinc-800">{product.name.toUpperCase()}</p>
              </li>)}
            </ul>
            <span className="flex justify-between gap-4 bg-black/90 px-5 py-3 text-xs text-zinc-300 tracking-widest"><span className="whitespace-nowrap">MORE STYLES<span className="hidden sm:inline"> IN THE STORE</span></span><span className="inline-flex items-center gap-1 whitespace-nowrap">FIRST ROLL <ArrowIcon className="h-3 w-3" /></span></span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
