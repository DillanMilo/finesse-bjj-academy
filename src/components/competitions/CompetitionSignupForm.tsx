"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import HoneypotField from "@/components/ui/HoneypotField";
import { FormEvent, useState } from "react";
import { FORM_FAILURE_MESSAGE, HONEYPOT_FIELD, type FormStatus } from "@/lib/contact-form";
import { sendSheetForm } from "@/lib/sheet-forms";
import { useFormStartedAt } from "@/lib/use-contact-form";
// FIN-SHEETS-1102: headings and helper text are placeholders for Quill to approve.
type Role = "competing" | "supporting";
const inputClass = "w-full bg-black/25 text-white p-4 border border-white/40 placeholder:text-white/50 focus:border-white outline-none";
export default function CompetitionSignupForm({ events }: { events: { slug: string; label: string }[] }) {
  const [role, setRole] = useState<Role>("competing");
  const [status, setStatus] = useState<FormStatus>("idle");
  const startedAt = useFormStartedAt();
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const result = await sendSheetForm("/api/competition-signup", { name: String(data.get("name") ?? ""), contact: String(data.get("contact") ?? ""), event: String(data.get("event") ?? ""), role, guests: String(data.get("guests") ?? "0"), startedAt: startedAt.current, [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? "") });
    if (result === "sent") form.reset();
    setStatus(result);
  }
  return <div className="bg-[#CC1122] text-white p-7 md:p-10"><p className="text-xs font-bold tracking-[.2em] mb-4">EVERY TEAMMATE COUNTS</p><h2 className="font-headline text-5xl mb-4">ARE YOU IN?</h2><p className="mb-6">Tell the team which competition you’re competing in, or that you’re coming to support.</p>
    {events.length === 0 ? <p className="border-l-2 border-white pl-5 text-white/90">No upcoming competitions are listed right now. Ask your coach which competition the team is targeting next.</p>
    : status === "sent" ? <div role="status" className="border-l-2 border-white pl-5"><p className="font-headline text-3xl">YOU’RE ON THE LIST.</p><p className="mt-2 text-white/90">Thanks! The coaches can see your sign-up now.</p></div> :
    <form onSubmit={handleSubmit} className="relative grid sm:grid-cols-2 gap-4"><HoneypotField />
      <div className="sm:col-span-2 flex flex-wrap gap-3" role="group" aria-label="Competing or supporting">{([["competing", "I’m competing"], ["supporting", "I’m coming to support"]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={role === value} onClick={() => setRole(value)} className={`px-5 py-3 font-headline text-xl border border-white/50 ${role === value ? "bg-black text-white" : "hover:bg-white/10"}`}>{label}</button>)}</div>
      <label className="block text-sm">Your name<input name="name" type="text" required maxLength={100} autoComplete="name" className={`${inputClass} mt-2`} /></label>
      <label className="block text-sm">Phone or email<input name="contact" type="text" required maxLength={254} autoComplete="email" className={`${inputClass} mt-2`} /></label>
      <label className={`block text-sm ${role === "supporting" ? "" : "sm:col-span-2"}`}>Competition<select name="event" required defaultValue={events.length === 1 ? events[0].slug : ""} className={`${inputClass} mt-2`}>{events.length > 1 && <option value="" disabled className="bg-[#1a1014]">Choose a competition</option>}{events.map(event => <option key={event.slug} value={event.slug} className="bg-[#1a1014]">{event.label}</option>)}</select></label>
      {role === "supporting" && <label className="block text-sm">Bringing guests?<select name="guests" defaultValue="0" className={`${inputClass} mt-2`}>{Array.from({ length: 11 }, (_, n) => <option key={n} value={n} className="bg-[#1a1014]">{n === 0 ? "Just me" : `+${n} guest${n === 1 ? "" : "s"}`}</option>)}</select></label>}
      <button disabled={status === "sending"} className="sm:col-span-2 bg-black py-4 font-headline text-xl tracking-wider disabled:opacity-60">{status === "sending" ? "SENDING…" : <>COUNT ME IN <ArrowIcon direction="right" /></>}</button>
      {status === "failed" && <p role="status" className="sm:col-span-2 border-l-2 border-white pl-4 text-sm">{FORM_FAILURE_MESSAGE}</p>}
    </form>}
  </div>;
}
