"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import HoneypotField from "@/components/ui/HoneypotField";
import TurnstileWidget, { type TurnstileHandle } from "@/components/ui/TurnstileWidget";
import { FormEvent, useRef, useState } from "react";
import { schedule } from "@/lib/schedule";
import { FORM_FAILURE_MESSAGE, HONEYPOT_FIELD, sendContactForm, TRIAL_ALREADY_REQUESTED_MESSAGE, type FormStatus } from "@/lib/contact-form";
import { useFormStartedAt, useTrialRequested } from "@/lib/use-contact-form";
// Trial-friendly classes for every age: beginner, all-levels and fundamentals classes. Advanced and competition classes are left out.
const TRIAL_FRIENDLY = /Beginners welcome|All Levels|Fundamentals/;
function startTime(range: string) {
  const [h, m] = range.split("–")[0].trim().split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
export type Audience = "kids" | "adults";
const trialSlots = schedule.flatMap(day => day.classes.filter(slot => TRIAL_FRIENDLY.test(slot.subtitle)).map(slot => {
  const time = startTime(slot.time);
  return { day: day.day, time, title: slot.title, label: `${day.day} · ${time} · ${slot.title}`, audience: (/^(Kids|Tiny)/.test(slot.title) ? "kids" : "adults") as Audience };
}));
const AUDIENCES: [Audience, string, string][] = [["kids", "KIDS", "Ages 4–14"], ["adults", "TEENS & ADULTS", "All levels"]];
const inputClass = "w-full bg-[#201f1f] text-white p-4 border border-white/20 focus:border-[#CC1122] outline-none transition-colors";
const stepClass = "flex items-center gap-3 font-headline text-sm tracking-[0.2em] text-zinc-300 mb-3";
export default function TrialSessionForm({ idPrefix = "trial", defaultAudience = "kids" }: { idPrefix?: string; defaultAudience?: Audience }) {
  const [audience, setAudience] = useState<Audience>(defaultAudience);
  const [selection, setSelection] = useState(trialSlots.find(slot => slot.audience === defaultAudience)!.label);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [sentSelection, setSentSelection] = useState("");
  const trialRequested = useTrialRequested();
  const startedAt = useFormStartedAt();
  const turnstile = useRef<TurnstileHandle>(null);
  const slots = trialSlots.filter(slot => slot.audience === audience);
  function choose(label: string) {
    setSelection(label);
    if (status !== "sending") setStatus("idle");
  }
  function chooseAudience(next: Audience) {
    setAudience(next);
    choose(trialSlots.find(slot => slot.audience === next)!.label);
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const result = await sendContactForm({ kind: "trial", source: "Free trial form", trialClass: selection, name: String(data.get("name") ?? ""), email: String(data.get("email") ?? ""), phone: String(data.get("phone") ?? ""), startedAt: startedAt.current, turnstileToken: turnstile.current?.token(), [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? "") });
    turnstile.current?.reset();
    if (result === "sent") { setSentSelection(selection); form.reset(); }
    setStatus(result);
  }
  if ((trialRequested && status !== "sent") || status === "duplicate") return <div className="relative bg-black/30 border border-white/10 p-6 md:p-8"><p role="status" className="border-l-2 border-[#CC1122] pl-4 text-sm">{TRIAL_ALREADY_REQUESTED_MESSAGE}</p></div>;
  return <form onSubmit={handleSubmit} className="@container relative bg-black/30 border border-white/10 p-5 sm:p-6 md:p-8"><HoneypotField />
    <fieldset><legend className={stepClass}><span className="text-[#CC1122]">01</span> WHO’S TRAINING?</legend>
      <div className="grid grid-cols-2 gap-2">{AUDIENCES.map(([value, label, note]) => <label key={value} className={`cursor-pointer border px-3 py-3 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white ${audience === value ? "border-[#CC1122] bg-[#CC1122] text-white" : "border-white/20 bg-[#201f1f] text-zinc-300 hover:border-[#CC1122]/60"}`}><input type="radio" name={`${idPrefix}-audience`} value={value} checked={audience === value} onChange={() => chooseAudience(value)} className="sr-only" /><span className="block font-headline text-lg sm:text-xl italic tracking-tight leading-none">{label}</span><span className={`block text-[11px] mt-1 ${audience === value ? "text-white/80" : "text-zinc-500"}`}>{note}</span></label>)}</div>
    </fieldset>
    <fieldset className="mt-6"><legend className={stepClass}><span className="text-[#CC1122]">02</span> PICK YOUR CLASS</legend>
      <div className="grid grid-cols-1 @md:grid-cols-2 gap-2 max-h-[15.5rem] overflow-y-auto overscroll-contain pr-1">{slots.map(slot => { const selected = selection === slot.label; return <label key={slot.label} className={`group flex cursor-pointer items-stretch border transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white ${selected ? "border-[#CC1122] bg-[#CC1122]/10" : "border-white/15 bg-[#201f1f] hover:border-[#CC1122]/60"}`}><input type="radio" name={`${idPrefix}-class`} value={slot.label} checked={selected} onChange={() => choose(slot.label)} className="sr-only" /><span className={`flex w-14 shrink-0 items-center justify-center font-headline text-lg italic ${selected ? "bg-[#CC1122] text-white" : "bg-black/40 text-[#CC1122]"}`}>{slot.day}</span><span className="min-w-0 flex-1 px-3 py-2.5"><span className="block font-headline text-base tracking-wide text-white">{slot.time}</span><span className="block truncate text-xs text-zinc-400">{slot.title}</span></span><span aria-hidden className={`flex items-center pr-3 text-[#CC1122] transition-opacity ${selected ? "opacity-100" : "opacity-0"}`}>✓</span></label>; })}</div>
      <p className="text-xs text-zinc-500 mt-3">Central Time · Advanced classes and competition training are excluded.</p>
    </fieldset>
    <p className={`${stepClass} mt-7`}><span className="text-[#CC1122]">03</span> YOUR DETAILS</p>
    <label htmlFor={`${idPrefix}-name`} className="block text-sm mb-2">Your name <span className="text-zinc-500">(parent or guardian for kids)</span></label><input id={`${idPrefix}-name`} name="name" type="text" required maxLength={100} autoComplete="name" className={inputClass} />
    <div className="grid @md:grid-cols-2 gap-x-4"><div><label htmlFor={`${idPrefix}-email`} className="block text-sm mb-2 mt-4">Email</label><input id={`${idPrefix}-email`} name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} /></div><div><label htmlFor={`${idPrefix}-phone`} className="block text-sm mb-2 mt-4">Phone</label><input id={`${idPrefix}-phone`} name="phone" type="tel" required maxLength={40} autoComplete="tel" className={inputClass} /></div></div>
    <TurnstileWidget ref={turnstile} className="mt-6" />
    <button disabled={status === "sending"} className="w-full mt-6 bg-[#CC1122] py-4 font-headline text-xl tracking-wider transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(204,17,34,0.4)] disabled:opacity-60">{status === "sending" ? "SENDING…" : <>BOOK MY FREE TRIAL <ArrowIcon direction="right" /></>}</button>
    {(status === "sent" || status === "failed") && <div role="status" className="mt-5 border-l-2 border-[#CC1122] pl-4 text-sm">{status === "sent" ? <><p>Your choice: {sentSelection}.</p><p className="text-zinc-400 mt-2">Request received. Check your inbox for a confirmation with what to bring. We&apos;ll reach out to confirm your trial class. See you on the mat.</p></> : <p>{FORM_FAILURE_MESSAGE}</p>}</div>}
  </form>;
}
