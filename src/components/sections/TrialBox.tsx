"use client";
import TrialSessionForm from "@/components/ui/TrialSessionForm";
export default function TrialBox() {
  return <section id="free-trial" className="px-6 py-16 bg-[#1a1014] border-y border-white/10"><div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center"><div><p className="text-[#ffb3ad] text-xs tracking-[.25em] mb-4">YOUR FIRST STEP ON THE MATS</p><h2 className="font-headline text-5xl md:text-6xl">SCHEDULE YOUR<br/><span className="text-[#CC1122]">FREE TRIAL</span></h2><p className="text-zinc-400 mt-4 max-w-md">New to jiu-jitsu? Start with a beginner-friendly kids’ class. Choose a session and our team will help you prepare.</p></div><TrialSessionForm idPrefix="trial-box"/></div></section>;
}
