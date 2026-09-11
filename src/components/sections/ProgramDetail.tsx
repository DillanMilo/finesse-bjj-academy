"use client";

import Link from "next/link";
import ParallaxPhoto from "@/components/motion/ParallaxPhoto";
import DnaHelix from "@/components/motion/DnaHelix";
import { useOpenLeadForm } from "@/lib/lead-form-context";
import { schedule } from "@/lib/schedule";

type Variant = "women" | "personalized";
const content = {
  women: {
    eyebrow: "WOMEN’S JIU-JITSU",
    title: "WOMEN’S PROGRAM",
    intro: "Find your confidence. Build your technique. Train together.",
    image: "/photos/womens-1421.webp",
    heading: "YOUR PLACE ON THE MATS",
    paragraphs: [
      "A dedicated space for women to learn Brazilian Jiu-Jitsu, ask questions, and grow alongside supportive training partners. Start with the fundamentals and build confidence one session at a time.",
      "Our women’s no-gi fundamentals class focuses on learning the positions, movement, and techniques that form a foundation for grappling. You don’t need previous martial arts experience to take the first step.",
      "Book a free consultation to meet the team, talk about your goals, and find out what to expect from your first class.",
    ],
    pillars: [
      { title: "BUILD YOUR FOUNDATION", text: "Get comfortable with basic positions, movement, and the language of jiu-jitsu." },
      { title: "LEARN WITH OTHERS", text: "Practice with training partners in a women’s class built around learning together." },
      { title: "FIND YOUR CONFIDENCE", text: "Develop your skills at your own pace and discover what you enjoy about training." },
    ],
    cta: "TAKE YOUR FIRST STEP",
    ctaText: "Meet the team and talk through your first class in a free 20-minute consultation.",
  },
  personalized: {
    eyebrow: "BUILT AROUND YOU",
    title: "PERSONALIZED OPTIONS",
    intro: "Your goals. Your starting point. A plan that fits your life.",
    image: "/photos/adult-training.webp",
    heading: "MORE THAN A SINGLE CLASS",
    paragraphs: [
      "Bring your training goals together with a personalized mix of private coaching, nutrition guidance, and strength training. The starting point is you: your experience, your priorities, and the time you have available.",
      "You might want more individual attention on the mats, support with your everyday nutrition habits, or strength work that complements your jiu-jitsu. We’ll discuss which options make sense together and where to begin.",
      "Use your consultation to explore the right combination, available coaching, session frequency, and pricing before choosing your program.",
    ],
    pillars: [
      { title: "PRIVATE COACHING", text: "Focused one-on-one attention for the techniques, positions, and questions you want to work on." },
      { title: "NUTRITION GUIDANCE", text: "Discuss nutrition support and everyday habits that fit your routine and training goals." },
      { title: "STRENGTH TRAINING", text: "Explore strength and conditioning as part of your broader training plan, matched to your starting point." },
    ],
    cta: "LET’S BUILD YOUR PLAN",
    ctaText: "Tell us what you want to work toward. Start with a free 20-minute consultation.",
  },
};

export default function ProgramDetail({ variant }: { variant: Variant }) {
  const page = content[variant];
  const openLeadForm = useOpenLeadForm();
  const womenClasses = schedule.flatMap(day => day.classes.filter(slot => slot.title.startsWith("Women")).map(slot => ({ ...slot, day: day.day })));
  return (
    <main>
      <section className="relative min-h-[500px] flex items-end overflow-hidden">
        {variant === "women" ? (
          <ParallaxPhoto src={page.image} alt="" className="absolute inset-0" position="50% 65%" priority />
        ) : (
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-60" aria-hidden="true">
            <div className="w-full max-w-7xl"><DnaHelix /></div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 pt-32 pb-12 md:pb-16">
          <Link href="/#programs" className="inline-block text-sm text-[#E6BDB9] py-3 mb-6 hover:text-white">← All programs</Link>
          <p className="font-headline text-sm text-[#E6BDB9] tracking-widest mb-4">{page.eyebrow}</p>
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter italic leading-none text-white mb-6">{page.title}</h1>
          <p className="font-serif text-xl sm:text-2xl italic text-[#E6BDB9] max-w-xl">{page.intro}</p>
        </div>
      </section>
      <div className="gradient-divider" />
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="font-headline text-sm text-[#CC1122] tracking-widest mb-4">PROGRAM OVERVIEW</p>
            <h2 className="font-headline text-4xl sm:text-5xl lg:text-6xl italic leading-none mb-8">{page.heading}</h2>
            <div className="space-y-5 text-[#E6BDB9] text-lg leading-relaxed">{page.paragraphs.map(text => <p key={text}>{text}</p>)}</div>
          </div>
          {variant === "women" ? (
            <div role="group" aria-label="Women’s program photo gallery" className="grid gap-4">
              <ParallaxPhoto src={page.image} alt="Women from the Finesse community together in their gis" className="w-full aspect-[3/2] clip-corner" sizes="(min-width: 1024px) 50vw, 100vw" />
              <ParallaxPhoto src="/photos/womens-group.webp" alt="Women from the Finesse community together on the mats" className="w-full aspect-[3/2] clip-corner" sizes="(min-width: 1024px) 50vw, 100vw" position="50% 65%" />
            </div>
          ) : (
            <DnaHelix />
          )}
        </div>
      </section>
      <section className="py-16 md:py-24 bg-[#1A1014]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="font-headline text-4xl sm:text-5xl italic mb-10">{variant === "women" ? "GROW YOUR GAME" : "YOUR PROGRAM, YOUR MIX"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {page.pillars.map((pillar, index) => (
              <article key={pillar.title} className="clip-corner bg-[#0A0A0A] border border-[#CC1122]/20 p-6 sm:p-8">
                <span className="font-headline text-4xl text-[#CC1122] block mb-6">0{index + 1}</span>
                <h3 className="font-headline text-3xl mb-4">{pillar.title}</h3>
                <p className="text-[#E6BDB9] leading-relaxed">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="font-headline text-4xl sm:text-5xl italic mb-6">{variant === "women" ? "FIND YOUR CLASS" : "HOW TO GET STARTED"}</h2>
            {variant === "women" ? <>
              {womenClasses.map(slot => <div key={`${slot.day}-${slot.time}`} className="border-l-4 border-[#CC1122] bg-[#1A1014] p-6 mb-4"><p className="font-headline text-2xl">{slot.title} · {slot.subtitle}</p><p className="text-[#E6BDB9] mt-2">{slot.day} · {slot.time} Central Time</p><p className="text-sm text-[#E6BDB9] mt-2">{slot.timingNote}</p></div>)}
              <Link href="/schedule" className="inline-block py-3 text-[#CC1122] font-headline text-xl tracking-wider">VIEW FULL SCHEDULE →</Link>
            </> : <ol className="space-y-5 text-[#E6BDB9] leading-relaxed list-decimal pl-5"><li>Tell us about your goals, experience, and weekly routine.</li><li>Discuss the combination of coaching, nutrition support, and strength training that suits you.</li><li>Agree on the details with the team and take your first step.</li></ol>}
          </div>
          <div className="bg-[#1A1014] border border-[#CC1122]/20 p-6 sm:p-8 clip-corner">
            <h3 className="font-headline text-3xl mb-4">{variant === "women" ? "NEW TO JIU-JITSU?" : "START WITH A CONVERSATION"}</h3>
            <p className="text-[#E6BDB9] leading-relaxed">{variant === "women" ? "You’re welcome to start with the basics. Contact us before your first visit to confirm what to bring and get answers to your questions." : "Every plan begins with a discussion of your needs. Ask about coaching availability, the scope of each option, and pricing during your consultation."}</p>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 text-center bg-[#1A1014] px-6">
        <h2 className="font-headline text-4xl sm:text-6xl lg:text-7xl italic mb-6">{page.cta}</h2>
        <p className="text-[#E6BDB9] max-w-xl mx-auto mb-8 leading-relaxed">{page.ctaText}</p>
        <button onClick={openLeadForm} className="bg-[#CC1122] px-6 sm:px-10 py-4 font-headline text-xl tracking-wider text-white hover:bg-red-700">BOOK YOUR CONSULTATION</button>
      </section>
    </main>
  );
}
