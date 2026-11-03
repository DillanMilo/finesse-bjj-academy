"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import ArrowIcon from "@/components/ui/ArrowIcon";
import SpecialCountdown from "@/components/specials/SpecialCountdown";
import { formatPrice } from "@/lib/specials";
import { useActiveSpecial } from "@/lib/use-special";

// Home page card under the hero while a special is running (src/lib/specials.ts). Renders nothing otherwise.

export default function SpecialCard() {
  const special = useActiveSpecial();
  const reduceMotion = useReducedMotion();
  if (!special) return null;
  const highlights = special.groups.flatMap(group => group.plans.map(plan => ({ label: `${group.program} · ${plan.term}`, price: formatPrice(plan.price), featured: plan.featured })));
  return <section aria-label={special.name} className="relative isolate overflow-hidden border-y border-[#CC1122]/40 bg-[#0A0A0A] px-6 py-14 text-white md:py-20">
    <div aria-hidden="true" className="absolute -left-32 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-[#CC1122]/30 blur-[110px]" />
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div>
        <p className="inline-flex items-center gap-2 bg-[#CC1122] px-3 py-1.5 text-[11px] font-bold tracking-[.25em]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />{special.when.toUpperCase()} ONLY</p>
        <h2 className="mt-5 font-headline text-6xl leading-[.9] md:text-8xl">BLACK FRIDAY<span className="block text-[#CC1122]">SPECIAL.</span></h2>
        <ul className="mt-6 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
          {highlights.map(item => <li key={item.label} className={`flex items-baseline justify-between gap-3 px-4 py-3 ${item.featured ? "bg-[#CC1122]" : "bg-[#121212]"}`}>
            <span className="text-[11px] font-bold tracking-[.1em] text-white/80 min-[360px]:tracking-[.18em] sm:text-xs">{item.label.toUpperCase()}</span>
            <span className="font-headline text-2xl">{item.price}</span>
          </li>)}
        </ul>
      </div>
      <div>
        <p className="mb-3 text-xs font-bold tracking-[.25em] text-white/60">ENDS IN</p>
        <SpecialCountdown special={special} />
        <Link href={`/${special.slug}`} className="mt-6 flex items-center justify-between bg-[#CC1122] px-7 py-4 font-headline text-xl tracking-wider shadow-[0_12px_40px_rgba(204,17,34,0.3)] hover:brightness-110">SEE THE DEALS <ArrowIcon /></Link>
      </div>
    </motion.div>
  </section>;
}
