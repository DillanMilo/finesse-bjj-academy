"use client";

import Link from "next/link";
import ParallaxPhoto from "@/components/motion/ParallaxPhoto";
import { useOpenLeadForm } from "@/lib/lead-form-context";
import { schedule } from "@/lib/schedule";

const classes = schedule.flatMap(day => day.classes
  .filter(slot => slot.title.includes("Striking"))
  .map(slot => ({ ...slot, day: day.day })));

const foundations = [
  { title: "BALANCE & MOVEMENT", text: "A strong stance and purposeful footwork are the foundation of effective stand-up technique." },
  { title: "DISTANCE & TIMING", text: "Striking brings a different perspective to range, rhythm, and choosing when to move." },
  { title: "CONTROL & TECHNIQUE", text: "Build your approach around balance and control. Talk with the team about the right starting point for your experience." },
];

export default function StrikingProgram() {
  const openLeadForm = useOpenLeadForm();
  return (
    <main>
      <section className="relative overflow-hidden bg-[#0A0A0A] pt-28 pb-12 md:pt-32 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#40131b]/50 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <Link href="/#programs" className="inline-block py-3 mb-6 text-sm text-[#E6BDB9] hover:text-white">← All programs</Link>
            <p className="font-headline text-sm tracking-widest text-[#CC1122] mb-4">COMBAT STRIKING</p>
            <h1 className="font-headline text-7xl sm:text-8xl lg:text-9xl italic tracking-tighter leading-none mb-6">BUILD YOUR<br /><span className="text-[#CC1122]">STAND-UP.</span></h1>
            <p className="font-serif text-2xl sm:text-3xl italic text-[#E6BDB9] mb-8">Find your rhythm. Develop your technique.</p>
            <p className="text-[#E6BDB9] leading-relaxed max-w-lg mb-8">Explore striking alongside your grappling, or make it your starting point at Finesse. The schedule includes all-levels sessions and a separate kids striking class.</p>
            <div className="flex flex-wrap gap-4 items-center">
              <button onClick={openLeadForm} className="bg-[#CC1122] hover:bg-red-700 px-6 py-4 font-headline text-xl tracking-wider">BOOK A CONSULTATION</button>
              <a href="#striking-classes" className="font-headline text-xl tracking-wider py-4 text-[#E6BDB9] hover:text-white">VIEW CLASSES ↓</a>
            </div>
          </div>
          <div className="border border-[#CC1122]/20 bg-gradient-to-r from-[#1A1014] via-black to-[#1A1014] clip-corner flex justify-center">
            <ParallaxPhoto src="/photos/striking-training.webp" alt="An athlete practicing a kick on a heavy bag" className="w-full max-w-[280px] aspect-[739/1600]" sizes="(max-width: 320px) 90vw, 280px" priority />
          </div>
        </div>
      </section>
      <div className="gradient-divider" />
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <p className="font-headline text-sm tracking-widest text-[#CC1122] mb-4">PROGRAM OVERVIEW</p>
        <h2 className="font-headline text-4xl sm:text-6xl italic mb-6">A DIFFERENT SIDE OF YOUR GAME</h2>
        <p className="text-[#E6BDB9] text-lg leading-relaxed max-w-3xl mb-12">Striking focuses on stand-up skills. Whether you already train jiu-jitsu or are exploring your first martial arts class, meet with the team to discuss your goals, class format, and the equipment you’ll need.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {foundations.map((item, index) => <article key={item.title} className="bg-[#1A1014] border border-[#CC1122]/20 p-6 sm:p-8 clip-corner">
            <span className="font-headline text-4xl text-[#CC1122] block mb-6">0{index + 1}</span>
            <h3 className="font-headline text-3xl mb-4">{item.title}</h3>
            <p className="text-[#E6BDB9] leading-relaxed">{item.text}</p>
          </article>)}
        </div>
      </section>
      <section id="striking-classes" className="scroll-mt-24 py-16 md:py-24 bg-[#1A1014]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="font-headline text-4xl sm:text-6xl italic mb-4">FIND YOUR SESSION</h2>
          <p className="text-[#E6BDB9] mb-8">All times Central. End times are awaiting confirmation.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {classes.map(slot => <article key={`${slot.day}-${slot.time}`} className="bg-[#0A0A0A] border-l-4 border-[#CC1122] p-6">
              <p className="font-headline text-xl text-[#CC1122] mb-2">{slot.day}</p>
              <h3 className="font-headline text-3xl mb-2">{slot.title}</h3>
              <p className="text-[#E6BDB9] mb-4">{slot.subtitle}</p>
              <p className="font-headline text-3xl">{slot.time}</p>
              <p className="text-sm text-[#E6BDB9] mt-3">{slot.timingNote}</p>
            </article>)}
          </div>
          <Link href="/schedule" className="inline-block py-3 mt-6 font-headline text-xl text-[#CC1122] tracking-wider">FULL ACADEMY SCHEDULE →</Link>
        </div>
      </section>
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid md:grid-cols-2 gap-10">
        <div><h2 className="font-headline text-4xl sm:text-5xl italic mb-6">BEFORE YOUR FIRST CLASS</h2><p className="text-[#E6BDB9] leading-relaxed">Contact the academy to confirm the session that suits you, what to wear, and any gloves or protective equipment required. For kids striking, confirm age eligibility and class details with the team before attending.</p></div>
        <div className="bg-[#1A1014] p-6 sm:p-8 border border-[#CC1122]/20 clip-corner"><h3 className="font-headline text-3xl mb-4">START WITH A CONVERSATION</h3><p className="text-[#E6BDB9] leading-relaxed mb-6">Book a free 20-minute consultation to discuss your experience, goals, and next steps.</p><button onClick={openLeadForm} className="bg-[#CC1122] hover:bg-red-700 px-6 py-4 font-headline text-xl tracking-wider">BOOK YOUR CONSULTATION</button></div>
      </section>
    </main>
  );
}
