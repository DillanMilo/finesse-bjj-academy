"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import ArrowIcon from "@/components/ui/ArrowIcon";
import SpecialCountdown from "@/components/specials/SpecialCountdown";
import { CONTACT } from "@/lib/constants";
import { useOpenLeadForm } from "@/lib/lead-form-context";
import { formatPrice, monthlyPrice, type Special, type SpecialPlan } from "@/lib/specials";
import { useNowSeconds } from "@/lib/use-special";

// FIN-SPECIAL-1103: the full offer for a special (/black-friday). Headings and copy are placeholders for
// Patty to approve. Members claim it in person, by phone or by email; there's no online checkout.

const TEL = `tel:${CONTACT.phone.replace(/\D/g, "")}`;

export default function SpecialPage({ special }: { special: Special }) {
  const now = useNowSeconds();
  const ended = now !== null && now * 1000 >= Date.parse(special.endsAt);
  const openTrial = useOpenLeadForm();
  const reduceMotion = useReducedMotion();
  const rise = (delay = 0) => reduceMotion ? {} : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.5, delay, ease: "easeOut" as const } };
  const mail = `mailto:${CONTACT.email}?subject=${encodeURIComponent(special.name)}`;

  if (ended) return <main className="bg-[#0A0A0A] px-6 pb-24 pt-40 text-white">
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-bold tracking-[.25em] text-[#FFB3AD]">{special.name.toUpperCase()}</p>
      <h1 className="mt-4 font-headline text-6xl md:text-8xl">THIS SPECIAL HAS ENDED.</h1>
      <p className="mt-4 text-lg text-white/80">Thanks to everyone who locked in. Keep an eye out for the next one, or come try a class.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={openTrial} className="bg-[#CC1122] px-7 py-4 font-headline text-xl tracking-wider hover:brightness-110">BOOK A FREE TRIAL <ArrowIcon /></button>
        <Link href="/schedule" className="border border-white/40 px-7 py-4 font-headline text-xl tracking-wider hover:bg-white/10">SEE THE SCHEDULE</Link>
      </div>
    </div>
  </main>;

  return <main className="bg-[#0A0A0A] text-white">
    {/* Hero: no fade-in, so the headline paints straight away. */}
    <section className="relative isolate overflow-hidden px-6 pb-16 pt-32 md:pb-24 md:pt-44">
      <Image src="/photos/academy-1422.webp" alt="" fill priority sizes="100vw" className="-z-30 object-cover object-[50%_40%] opacity-50 grayscale" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-b from-black/70 via-[#0A0A0A]/80 to-[#0A0A0A]" />
      <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#CC1122]/35 blur-[120px]" />
      <p aria-hidden="true" className="pointer-events-none absolute -bottom-6 left-1/2 -z-10 -translate-x-1/2 whitespace-nowrap font-headline text-[26vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.07)] md:-bottom-12">BLACK FRIDAY</p>
      <div className="mx-auto max-w-6xl">
        <p className="inline-flex items-center gap-2 bg-[#CC1122] px-3 py-1.5 text-[11px] font-bold tracking-[.25em]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />{special.when.toUpperCase()} · ENDS {special.lastDay.split(", ")[1].toUpperCase()}
        </p>
        <h1 className="mt-6 font-headline text-[17vw] leading-[.85] sm:text-8xl md:text-[9rem]">
          BLACK FRIDAY<span className="block text-[#CC1122]">SPECIAL.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/80 md:text-xl">
          Lock in a full year of Jiu-Jitsu or Striking at Black Friday prices, or pay once and train for life. Adults and kids. All month long.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,28rem)_auto] lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[.25em] text-white/60">ENDS IN</p>
            <SpecialCountdown special={special} />
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#prices" className="inline-flex items-center gap-3 bg-[#CC1122] px-7 py-4 font-headline text-xl tracking-wider shadow-[0_12px_40px_rgba(204,17,34,0.35)] hover:brightness-110">SEE THE PRICES <ArrowIcon direction="down" /></a>
            <a href={TEL} className="inline-flex items-center gap-3 border border-white/40 px-7 py-4 font-headline text-xl tracking-wider hover:bg-white/10">CALL {CONTACT.phone}</a>
          </div>
        </div>
      </div>
    </section>

    {/* Prices */}
    <section id="prices" className="scroll-mt-24 px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl space-y-16">
        {special.groups.map(group => <div key={group.program}>
          <motion.div {...rise()} className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
            <h2 className="font-headline text-5xl md:text-6xl">{group.program.toUpperCase()}</h2>
            <p className="text-xs font-bold tracking-[.25em] text-[#FFB3AD]">{group.audience.toUpperCase()}</p>
          </motion.div>
          <div className={`grid gap-4 md:gap-5 ${group.plans.length > 1 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {group.plans.map((plan, n) => <motion.div key={plan.term} {...rise(n * 0.08)} className="grid"><PlanCard plan={plan} /></motion.div>)}
            {group.plans.length === 1 && <motion.div {...rise(0.08)} className="relative flex flex-col justify-end overflow-hidden border border-white/10 p-7 min-h-56">
              <Image src="/photos/striking-training.webp" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="-z-10 object-cover opacity-50" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <p className="font-headline text-3xl leading-tight">Twice a week. Range, rhythm, footwork.</p>
              <p className="mt-2 text-sm text-white/75">Stand-up technique for adults, built on balance and control.</p>
              <Link href="/programs/striking" className="mt-4 inline-flex items-center gap-2 text-sm font-bold tracking-[.18em] underline underline-offset-4">ABOUT STRIKING <ArrowIcon direction="right" className="h-3 w-3" /></Link>
            </motion.div>}
          </div>
        </div>)}
      </div>
    </section>

    {/* How to claim */}
    <section id="claim" className="scroll-mt-24 bg-[#CC1122] px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <motion.div {...rise()}>
          <p className="text-xs font-bold tracking-[.25em]">HOW TO CLAIM IT</p>
          <h2 className="mt-3 font-headline text-5xl leading-none md:text-7xl">PICK YOUR PLAN. TELL US. YOU’RE IN.</h2>
          <ol className="mt-8 grid gap-4">
            {[["Pick your plan", "Jiu-Jitsu for 1 year, 2 years or life, or a year of Striking."],
              ["Let us know", "Grab us at the front desk, give us a call, or send an email."],
              [`Lock it in by ${special.lastDay.split(", ")[1]}`, "The special ends at midnight, Central Time."]].map(([title, body], n) =>
              <li key={title} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center bg-black font-headline text-xl">{n + 1}</span><span><span className="block font-headline text-2xl leading-tight">{title.toUpperCase()}</span><span className="text-white/85">{body}</span></span></li>)}
          </ol>
        </motion.div>
        <motion.div {...rise(0.1)} className="bg-black p-7 md:p-10">
          <p className="font-headline text-3xl">READY WHEN YOU ARE.</p>
          <div className="mt-6 grid gap-3">
            <a href={TEL} className="flex items-center justify-between bg-[#CC1122] px-6 py-4 font-headline text-xl tracking-wider hover:brightness-110">CALL {CONTACT.phone} <ArrowIcon /></a>
            <a href={mail} className="flex items-center justify-between border border-white/30 px-6 py-4 font-headline text-xl tracking-wider hover:bg-white/10">EMAIL US <ArrowIcon /></a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Finesse BJJ Academy, ${CONTACT.address}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border border-white/30 px-6 py-4 font-headline text-xl tracking-wider hover:bg-white/10">VISIT THE FRONT DESK <ArrowIcon /></a>
          </div>
          <p className="mt-4 text-sm text-white/60">{CONTACT.address}</p>
          <div className="mt-8 border-t border-white/15 pt-6">
            <p className="text-sm text-white/80">New to Finesse? Come try a class first, on us.</p>
            <button type="button" onClick={openTrial} className="mt-3 font-headline text-xl tracking-wider text-[#FF6B6B] underline underline-offset-4 hover:text-white">BOOK A FREE TRIAL <ArrowIcon direction="right" className="h-4 w-4" /></button>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="px-6 py-10">
      <p className="mx-auto max-w-6xl text-sm text-white/50">Prices are for the full term shown. Offer ends at midnight on {special.lastDay}, Central Time. Ask the front desk for details.</p>
    </section>
  </main>;
}

/** One price. The featured plan is red with a "best value" tag. */
function PlanCard({ plan }: { plan: SpecialPlan }) {
  const [dollars, cents] = formatPrice(plan.price).split(".");
  const monthly = monthlyPrice(plan);
  return <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
    className={`relative flex flex-col overflow-hidden p-7 md:p-8 ${plan.featured ? "bg-[#CC1122] shadow-[0_24px_60px_rgba(204,17,34,0.35)]" : "border border-white/12 bg-[#151515]"}`}>
    {plan.featured && <span className="absolute right-0 top-0 bg-black px-3 py-1.5 text-[11px] font-bold tracking-[.22em]">BEST VALUE</span>}
    <p className={`text-xs font-bold tracking-[.25em] ${plan.featured ? "text-white" : "text-[#FFB3AD]"}`}>{plan.term.toUpperCase()}</p>
    <p className="mt-5 font-headline leading-none"><span className="text-6xl md:text-7xl">{dollars}</span>{cents && <span className="align-top text-3xl">.{cents}</span>}</p>
    <p className={`mt-3 mb-8 text-sm ${plan.featured ? "text-white/90" : "text-white/65"}`}>{monthly ? `About ${formatPrice(monthly)} a month` : "One payment. Train for life."}</p>
    <a href="#claim" className={`mt-auto flex items-center justify-between px-5 py-3 font-headline text-lg tracking-wider ${plan.featured ? "bg-black hover:bg-[#1a1a1a]" : "border border-white/30 hover:bg-white/10"}`}>CLAIM THIS DEAL <ArrowIcon direction="down" /></a>
  </motion.div>;
}
