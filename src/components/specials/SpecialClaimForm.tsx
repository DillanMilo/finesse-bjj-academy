"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FormEvent, useEffect, useRef, useState } from "react";
import ArrowIcon from "@/components/ui/ArrowIcon";
import HoneypotField from "@/components/ui/HoneypotField";
import TurnstileWidget, { type TurnstileHandle } from "@/components/ui/TurnstileWidget";
import { CONTACT } from "@/lib/constants";
import { FORM_FAILURE_MESSAGE, HONEYPOT_FIELD, sendContactForm, type FormStatus } from "@/lib/contact-form";
import { specialPlans, type Special } from "@/lib/specials";
import { useFormStartedAt } from "@/lib/use-contact-form";

// "Claim this deal" pop-up on a special's page. Sends through /api/contact (kind "special"): the academy gets
// an email with who they are and which package, and they get a confirmation that someone will be in touch.

const inputClass = "mt-2 w-full border border-white/20 bg-black/40 px-4 py-3 text-white placeholder:text-white/35 focus:border-white focus:outline-none";

export default function SpecialClaimForm({ special, plan, onClose }: { special: Special; plan: string | null; onClose: () => void }) {
  const open = plan !== null;
  const reduceMotion = useReducedMotion();
  return <AnimatePresence>
    {open && <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label={`Claim the ${special.name}`} className="relative max-h-[92dvh] w-full max-w-xl overflow-y-auto bg-[#CC1122] text-white sm:mx-4"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === "Escape") onClose(); }}>
        <button type="button" onClick={onClose} autoFocus aria-label="Close" className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center text-xl text-white/85 hover:text-white">&#x2715;</button>
        <ClaimForm special={special} initialPlan={plan} onClose={onClose} />
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
}

function ClaimForm({ special, initialPlan, onClose }: { special: Special; initialPlan: string; onClose: () => void }) {
  const plans = specialPlans(special);
  const [plan, setPlan] = useState(initialPlan);
  const [planError, setPlanError] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [sent, setSent] = useState({ name: "", label: "" });
  const startedAt = useFormStartedAt();
  const turnstile = useRef<TurnstileHandle>(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const chosen = plans.find(item => item.key === plan);
    if (!chosen) { setPlanError(true); return; }
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    setStatus("sending");
    const result = await sendContactForm({ kind: "special", source: `${special.name} page`, plan, name, email: String(data.get("email") ?? ""), phone: String(data.get("phone") ?? ""), message: String(data.get("message") ?? ""), startedAt: startedAt.current, turnstileToken: turnstile.current?.token(), [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? "") });
    turnstile.current?.reset();
    if (result === "sent") setSent({ name: name.trim().split(" ")[0], label: chosen.label });
    setStatus(result);
  }

  if (status === "sent") return <div role="status" className="p-6 sm:p-7 md:p-10">
    <p className="text-xs font-bold tracking-[.2em]">{special.name.toUpperCase()}</p>
    <motion.div initial={{ scale: 0.6, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: "spring", damping: 12, stiffness: 180 }} className="mt-6 inline-flex h-16 w-16 items-center justify-center bg-black">
      <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    </motion.div>
    <p className="mt-6 text-balance font-headline text-5xl leading-none md:text-6xl">YOU’RE ON THE LIST{sent.name ? `, ${sent.name.toUpperCase()}` : ""}.</p>
    <p className="mt-3 text-white/90">We’ve sent a confirmation to your inbox. Someone from the Finesse team will be in touch shortly to get you set up.</p>
    <div className="mt-6 border border-white/30 p-4"><p className="text-xs font-bold tracking-[.2em] text-white/80">YOUR PACKAGE</p><p className="mt-1 font-headline text-2xl">{sent.label}</p></div>
    <button type="button" onClick={onClose} className="mt-6 bg-black px-6 py-3 font-headline text-xl tracking-wider hover:bg-[#1a1a1a]">DONE</button>
  </div>;

  return <form onSubmit={handleSubmit} className="relative p-6 sm:p-7 md:p-10"><HoneypotField />
    <p className="text-xs font-bold tracking-[.2em]">{special.name.toUpperCase()}</p>
    <h2 className="mt-4 text-balance font-headline text-5xl leading-none md:text-6xl">CLAIM YOUR SPOT.</h2>
    <p className="mt-3 text-white/90">Tell us who you are and which package you want. We’ll email you a confirmation, and someone from the team will be in touch shortly.</p>

    <fieldset className="mt-6">
      <legend className="text-xs font-bold tracking-[.2em]">YOUR PACKAGE</legend>
      <div className="mt-3 grid grid-cols-2 gap-2">{plans.map(item => {
        const selected = plan === item.key;
        return <label key={item.key} className={`flex cursor-pointer flex-col gap-1 border-2 px-3 py-3 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white ${selected ? "border-black bg-black" : "border-white/45 hover:border-white hover:bg-white/10"}`}>
          <input type="radio" name="plan" value={item.key} checked={selected} onChange={() => { setPlan(item.key); setPlanError(false); }} className="sr-only" />
          <span><span className="block text-[11px] font-bold tracking-[.18em] text-white/80">{item.group.program.toUpperCase()}</span><span className="block font-headline text-xl leading-tight">{item.plan.term.toUpperCase()}</span></span>
          <span className="font-headline text-lg sm:text-xl">{item.label.split(" · ").pop()}</span>
        </label>;
      })}</div>
      {planError && <p role="alert" className="mt-2 text-sm font-bold">Please pick a package.</p>}
    </fieldset>

    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <label className="block text-sm sm:col-span-2">Your name<input name="name" type="text" required maxLength={100} autoComplete="name" className={inputClass} /></label>
      <label className="block text-sm">Email<input name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} /></label>
      <label className="block text-sm">Phone<input name="phone" type="tel" required maxLength={40} autoComplete="tel" className={inputClass} /></label>
      <label className="block text-sm sm:col-span-2">Anything we should know? <span className="text-white/60">(optional)</span><textarea name="message" rows={3} maxLength={1000} placeholder="e.g. It’s for my son, or the best time to call" className={inputClass} /></label>
    </div>
    <TurnstileWidget ref={turnstile} className="mt-6" />
    <button disabled={status === "sending"} className="mt-6 flex w-full items-center justify-center gap-3 bg-black py-4 font-headline text-xl tracking-wider hover:bg-[#1a1a1a] disabled:opacity-60">{status === "sending" ? "SENDING…" : <>SEND MY REQUEST <ArrowIcon direction="right" /></>}</button>
    {status === "failed" && <p role="status" className="mt-4 border-l-2 border-white pl-4 text-sm">{FORM_FAILURE_MESSAGE}</p>}
    <p className="mt-4 text-xs text-white/70">Rather talk? Call <a href={`tel:+1${CONTACT.phone.replace(/\D/g, "")}`} className="underline">{CONTACT.phone}</a>.</p>
  </form>;
}
