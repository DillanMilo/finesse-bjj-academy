"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import { useOpenTrialForm } from "@/lib/lead-form-context";
export default function PostTrialCTA() {
  const openTrialForm = useOpenTrialForm();
  return <aside className="mt-16 border border-[#CC1122]/40 bg-[#1A1014] p-7 sm:p-10"><p className="font-headline text-xs tracking-[0.3em] text-[#CC1122]">KIDS, TEENS & ADULTS WELCOME</p><h2 className="mt-3 font-headline text-4xl sm:text-5xl italic tracking-tighter text-white">YOUR FIRST CLASS IS FREE.</h2><p className="mt-4 text-zinc-400 max-w-xl">Pick a beginner-friendly class and we&apos;ll email you everything you need to know before you step on the mat.</p><button onClick={openTrialForm} className="mt-7 -skew-x-12 bg-[#CC1122] px-8 py-4 transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(204,17,34,0.4)]"><span className="skew-x-12 inline-block font-headline text-lg tracking-wider text-white">BOOK YOUR FREE TRIAL <ArrowIcon direction="right" /></span></button></aside>;
}
