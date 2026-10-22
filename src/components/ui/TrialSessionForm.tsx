"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import HoneypotField from "@/components/ui/HoneypotField";
import { FormEvent, useState } from "react";
import { schedule } from "@/lib/schedule";
import { FORM_FAILURE_MESSAGE, HONEYPOT_FIELD, sendContactForm, type FormStatus } from "@/lib/contact-form";
const beginnerSlots = schedule.flatMap(day => day.classes.filter(slot => slot.subtitle.includes("Beginners welcome")).map(slot => `${day.day} · 5:30 PM · ${slot.title}`));
const inputClass = "w-full bg-[#201f1f] text-white p-4 border border-white/20";
export default function TrialSessionForm({ idPrefix = "trial" }: { idPrefix?: string }) {
  const [selection, setSelection] = useState(beginnerSlots[0]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [sentSelection, setSentSelection] = useState("");
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const ok = await sendContactForm({ kind: "trial", source: "Free trial form", trialClass: selection, name: String(data.get("name") ?? ""), email: String(data.get("email") ?? ""), phone: String(data.get("phone") ?? ""), [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? "") });
    if (ok) { setSentSelection(selection); form.reset(); }
    setStatus(ok ? "sent" : "failed");
  }
  return <form onSubmit={handleSubmit} className="relative bg-black/30 border border-white/10 p-6 md:p-8"><HoneypotField /><label htmlFor={`${idPrefix}-class`} className="block text-sm mb-3">Choose a beginner-friendly class</label><select id={`${idPrefix}-class`} value={selection} onChange={e => {setSelection(e.target.value); if (status !== "sending") setStatus("idle");}} className={inputClass}>{beginnerSlots.map(slot => <option key={slot}>{slot}</option>)}</select><p className="text-xs text-zinc-400 mt-3">Kids ages 8–14 · Central Time · Monday & Friday: Gi · Wednesday: NoGi</p><label htmlFor={`${idPrefix}-name`} className="block text-sm mb-3 mt-6">Parent or guardian name</label><input id={`${idPrefix}-name`} name="name" type="text" required maxLength={100} autoComplete="name" className={inputClass} /><label htmlFor={`${idPrefix}-email`} className="block text-sm mb-3 mt-5">Email</label><input id={`${idPrefix}-email`} name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} /><label htmlFor={`${idPrefix}-phone`} className="block text-sm mb-3 mt-5">Phone</label><input id={`${idPrefix}-phone`} name="phone" type="tel" required maxLength={40} autoComplete="tel" className={inputClass} /><button disabled={status === "sending"} className="w-full mt-6 bg-[#CC1122] py-4 font-headline text-xl tracking-wider disabled:opacity-60">{status === "sending" ? "SENDING…" : <>CHOOSE MY TRIAL SESSION <ArrowIcon direction="right" /></>}</button>{(status === "sent" || status === "failed") && <div role="status" className="mt-5 border-l-2 border-[#CC1122] pl-4 text-sm">{status === "sent" ? <><p>Your choice: {sentSelection}.</p><p className="text-zinc-400 mt-2">Thanks, your request has been sent. The academy will confirm your trial class.</p></> : <p>{FORM_FAILURE_MESSAGE}</p>}</div>}<p className="text-xs text-zinc-500 mt-4">Advanced classes and competition training are excluded.</p></form>;
}
