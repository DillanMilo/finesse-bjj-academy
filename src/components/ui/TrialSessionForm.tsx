"use client";
import { useState } from "react";
import { schedule } from "@/lib/schedule";
const beginnerSlots = schedule.flatMap(day => day.classes.filter(slot => slot.subtitle.includes("Beginners welcome")).map(slot => `${day.day} · 5:30 PM · ${slot.title}`));
export default function TrialSessionForm({ idPrefix = "trial" }: { idPrefix?: string }) {
  const [selection, setSelection] = useState(beginnerSlots[0]);
  const [review, setReview] = useState(false);
  return <form onSubmit={e => { e.preventDefault(); setReview(true); }} className="bg-black/30 border border-white/10 p-6 md:p-8"><label htmlFor={`${idPrefix}-class`} className="block text-sm mb-3">Choose a beginner-friendly class</label><select id={`${idPrefix}-class`} value={selection} onChange={e => {setSelection(e.target.value); setReview(false);}} className="w-full bg-[#201f1f] text-white p-4 border border-white/20">{beginnerSlots.map(slot => <option key={slot}>{slot}</option>)}</select><p className="text-xs text-zinc-400 mt-3">Kids ages 8–14 · Central Time · Monday & Friday: Gi · Wednesday: NoGi</p><button className="w-full mt-6 bg-[#CC1122] py-4 font-headline text-xl tracking-wider">CHOOSE MY TRIAL SESSION →</button>{review && <div role="status" className="mt-5 border-l-2 border-[#CC1122] pl-4 text-sm"><p>Your choice: {selection}.</p><p className="text-zinc-400 mt-2">Preview only — no booking has been sent. The academy will confirm availability before your first class.</p></div>}<p className="text-xs text-zinc-500 mt-4">Local booking concept. Advanced classes and competition training are excluded.</p></form>;
}
