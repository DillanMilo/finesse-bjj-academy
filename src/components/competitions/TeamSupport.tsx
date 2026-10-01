"use client";
import { useState } from "react";
export default function TeamSupport() {
  const [choice, setChoice] = useState("");
  return <div className="bg-[#CC1122] text-white p-7 md:p-10"><p className="text-xs font-bold tracking-[.2em] mb-4">EVERY TEAMMATE COUNTS</p><h2 className="font-headline text-5xl mb-4">WILL YOU BE IN OUR CORNER?</h2><p className="mb-6">Competing or cheering? There’s a place for you with the team.</p><div className="flex flex-wrap gap-3">{["I want to compete", "I’m coming to support"].map(label => <button key={label} aria-pressed={choice === label} onClick={() => setChoice(label)} className={`px-5 py-3 font-headline text-xl border border-white/50 ${choice === label ? "bg-black text-white" : "hover:bg-white/10"}`}>{label}</button>)}</div>{choice && <p role="status" className="mt-5 text-sm">{choice === "I want to compete" ? "Next step: talk with your coach about your division and preparation." : "Bring your team spirit! Meetup and spectator details will appear here once confirmed."} Preview only — your interest has not been submitted.</p>}</div>;
}
