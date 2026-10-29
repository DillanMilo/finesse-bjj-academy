"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import HoneypotField from "@/components/ui/HoneypotField";
import TurnstileWidget, { type TurnstileHandle } from "@/components/ui/TurnstileWidget";
import { FormEvent, useRef, useState } from "react";
import { FORM_FAILURE_MESSAGE, HONEYPOT_FIELD, sendContactForm, type FormStatus } from "@/lib/contact-form";
import { useFormStartedAt } from "@/lib/use-contact-form";
type Choice = "" | "compete" | "support";
const inputClass = "w-full bg-black/25 text-white p-4 border border-white/40 placeholder:text-white/50 focus:border-white outline-none";
export default function TeamSupport({ slug, eventName, url, registrationNote }: { slug: string; eventName: string; url?: string; registrationNote?: string }) {
  const [choice, setChoice] = useState<Choice>("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const startedAt = useFormStartedAt(choice === "support");
  const turnstile = useRef<TurnstileHandle>(null);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const result = await sendContactForm({ kind: "support", source: `Competition support: ${eventName}`, event: slug, name: String(data.get("name") ?? ""), email: String(data.get("email") ?? ""), phone: String(data.get("phone") ?? ""), guests: String(data.get("guests") ?? "0"), message: String(data.get("message") ?? ""), startedAt: startedAt.current, turnstileToken: turnstile.current?.token(), [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? "") });
    turnstile.current?.reset();
    if (result === "sent") form.reset();
    setStatus(result);
  }
  return <div className="bg-[#CC1122] text-white p-7 md:p-10"><p className="text-xs font-bold tracking-[.2em] mb-4">EVERY TEAMMATE COUNTS</p><h2 className="font-headline text-5xl mb-4">WILL YOU BE IN OUR CORNER?</h2><p className="mb-6">Competing or cheering? There’s a place for you with the team.</p>
    <div className="flex flex-wrap gap-3">{([["compete", "I want to compete"], ["support", "I’m coming to support"]] as const).map(([value, label]) => <button key={value} aria-pressed={choice === value} aria-expanded={choice === value} onClick={() => setChoice(value)} className={`px-5 py-3 font-headline text-xl border border-white/50 ${choice === value ? "bg-black text-white" : "hover:bg-white/10"}`}>{label}</button>)}</div>
    {choice === "compete" && <div className="mt-6 border-l-2 border-white pl-5"><p className="font-headline text-2xl">LET’S GET YOU READY.</p><ol className="mt-3 space-y-2 text-white/90 list-decimal pl-5"><li>Talk with your coach about your division, weight class, and game plan.</li><li>Register directly with the organizer before the deadline.</li><li>Tell us you’re in so the team knows to look out for your matches.</li></ol>{registrationNote && <p className="mt-4 text-sm text-white/80">{registrationNote}</p>}{url && <a href={url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block bg-black px-6 py-3 font-headline text-xl">REGISTER WITH THE ORGANIZER <ArrowIcon /></a>}</div>}
    {choice === "support" && (status === "sent" ? <div role="status" className="mt-6 border-l-2 border-white pl-5"><p className="font-headline text-3xl">YOU’RE IN OUR CORNER.</p><p className="mt-2 text-white/90">Thanks for coming out! We’ve emailed you a confirmation, and the team will share meetup details before the event.</p></div> :
    <form onSubmit={handleSubmit} className="relative mt-6 grid sm:grid-cols-2 gap-4"><HoneypotField />
      <div className="sm:col-span-2"><p className="font-headline text-2xl">TELL US WHO’S COMING.</p><p className="text-sm text-white/80">We’ll email you a confirmation and let the coaches know you’ll be there.</p></div>
      <label className="block text-sm">Your name<input name="name" type="text" required maxLength={100} autoComplete="name" className={`${inputClass} mt-2`} /></label>
      <label className="block text-sm">Email<input name="email" type="email" required maxLength={254} autoComplete="email" className={`${inputClass} mt-2`} /></label>
      <label className="block text-sm">Phone <span className="text-white/70">(optional)</span><input name="phone" type="tel" maxLength={40} autoComplete="tel" className={`${inputClass} mt-2`} /></label>
      <label className="block text-sm">Bringing guests?<select name="guests" defaultValue="0" className={`${inputClass} mt-2`}>{Array.from({ length: 11 }, (_, n) => <option key={n} value={n} className="bg-[#1a1014]">{n === 0 ? "Just me" : `+${n} guest${n === 1 ? "" : "s"}`}</option>)}</select></label>
      <label className="block text-sm sm:col-span-2">Who are you cheering for? <span className="text-white/70">(optional)</span><textarea name="message" rows={2} maxLength={500} placeholder="e.g. My son Jake in the kids’ Gi division" className={`${inputClass} mt-2`} /></label>
      <TurnstileWidget ref={turnstile} className="sm:col-span-2" />
      <button disabled={status === "sending"} className="sm:col-span-2 bg-black py-4 font-headline text-xl tracking-wider disabled:opacity-60">{status === "sending" ? "SENDING…" : <>COUNT ME IN <ArrowIcon direction="right" /></>}</button>
      {status === "failed" && <p role="status" className="sm:col-span-2 border-l-2 border-white pl-4 text-sm">{FORM_FAILURE_MESSAGE}</p>}
    </form>)}
  </div>;
}
