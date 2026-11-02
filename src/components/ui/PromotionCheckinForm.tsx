"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import HoneypotField from "@/components/ui/HoneypotField";
import { FormEvent, useState } from "react";
import { FORM_FAILURE_MESSAGE, HONEYPOT_FIELD, type FormStatus } from "@/lib/contact-form";
import { BELTS } from "@/lib/promotions";
import { sendSheetForm } from "@/lib/sheet-forms";
import { useFormStartedAt } from "@/lib/use-contact-form";
// FIN-SHEETS-1102: headings and helper text are placeholders for Quill to approve.
type Attending = "yes" | "no";
const inputClass = "w-full bg-black/25 text-white p-4 border border-white/40 placeholder:text-white/50 focus:border-white outline-none";
export default function PromotionCheckinForm({ events }: { events: { slug: string; label: string }[] }) {
  const [attending, setAttending] = useState<Attending>("yes");
  const [status, setStatus] = useState<FormStatus>("idle");
  const startedAt = useFormStartedAt();
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const result = await sendSheetForm("/api/promotion-checkin", { name: String(data.get("name") ?? ""), contact: String(data.get("contact") ?? ""), event: String(data.get("event") ?? ""), belt: String(data.get("belt") ?? ""), attending, startedAt: startedAt.current, [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? "") });
    if (result === "sent") form.reset();
    setStatus(result);
  }
  return <div className="bg-[#CC1122] text-white p-7 md:p-10"><p className="text-xs font-bold tracking-[.2em] mb-4">BELT PROMOTION</p><h2 className="font-headline text-5xl mb-4">CHECK IN.</h2><p className="mb-6">Let the coaches know you’ll be there.</p>
    {events.length === 0 ? <p className="border-l-2 border-white pl-5 text-white/90">No promotions are scheduled right now. Your coach will let you know when the next one is.</p>
    : status === "sent" ? <div role="status" className="border-l-2 border-white pl-5"><p className="font-headline text-3xl">YOU’RE CHECKED IN.</p><p className="mt-2 text-white/90">Thanks! The coaches can see your check-in now.</p></div> :
    <form onSubmit={handleSubmit} className="relative grid sm:grid-cols-2 gap-4"><HoneypotField />
      <div className="sm:col-span-2 flex flex-wrap gap-3" role="group" aria-label="Attending">{([["yes", "I’ll be there"], ["no", "I can’t make it"]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={attending === value} onClick={() => setAttending(value)} className={`px-5 py-3 font-headline text-xl border border-white/50 ${attending === value ? "bg-black text-white" : "hover:bg-white/10"}`}>{label}</button>)}</div>
      <label className="block text-sm">Your name<input name="name" type="text" required maxLength={100} autoComplete="name" className={`${inputClass} mt-2`} /></label>
      <label className="block text-sm">Phone or email<input name="contact" type="text" required maxLength={254} autoComplete="email" className={`${inputClass} mt-2`} /></label>
      <label className="block text-sm">Promotion<select name="event" required defaultValue={events.length === 1 ? events[0].slug : ""} className={`${inputClass} mt-2`}>{events.length > 1 && <option value="" disabled className="bg-[#1a1014]">Choose a promotion</option>}{events.map(event => <option key={event.slug} value={event.slug} className="bg-[#1a1014]">{event.label}</option>)}</select></label>
      <label className="block text-sm">Current belt<select name="belt" required defaultValue="" className={`${inputClass} mt-2`}><option value="" disabled className="bg-[#1a1014]">Choose your belt</option>{BELTS.map(belt => <option key={belt} value={belt} className="bg-[#1a1014]">{belt}</option>)}</select></label>
      <button disabled={status === "sending"} className="sm:col-span-2 bg-black py-4 font-headline text-xl tracking-wider disabled:opacity-60">{status === "sending" ? "SENDING…" : <>CHECK IN <ArrowIcon direction="right" /></>}</button>
      {status === "failed" && <p role="status" className="sm:col-span-2 border-l-2 border-white pl-4 text-sm">{FORM_FAILURE_MESSAGE}</p>}
    </form>}
  </div>;
}
