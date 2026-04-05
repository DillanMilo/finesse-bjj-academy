"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useOpenLeadForm } from "@/lib/lead-form-context";

const curriculum = [
  {
    title: "BALANCE & COORDINATION",
    description:
      "Age-appropriate movement drills that develop body awareness, agility, and motor skills. Kids build an athletic foundation that translates to every sport and activity.",
  },
  {
    title: "SELF-DEFENSE BASICS",
    description:
      "Practical techniques for escaping grabs, controlling distance, and staying safe. Built around anti-bullying principles so kids know how to protect themselves without escalating.",
  },
  {
    title: "DISCIPLINE & FOCUS",
    description:
      "Structured classes that reward effort, patience, and consistency. Students learn to listen, follow instruction, and push through challenges — habits that carry into school and life.",
  },
  {
    title: "TEAMWORK & RESPECT",
    description:
      "Partner drills and group exercises teach kids to trust, communicate, and support their training partners. Respect for coaches, teammates, and the mats is non-negotiable.",
  },
];

const classDetails = [
  {
    label: "KIDS CLASS",
    times: "Mon through Fri — 4:30 PM to 5:30 PM",
  },
];

function SectionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealElement({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function KidsBJJPage() {
  const openLeadForm = useOpenLeadForm();
  const heroParallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroParallaxRef,
    offset: ["start end", "end start"],
  });
  const heroY = useTransform(heroScrollY, [0, 1], ["-15%", "15%"]);

  const overviewParallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: overviewScrollY } = useScroll({
    target: overviewParallaxRef,
    offset: ["start end", "end start"],
  });
  const overviewY = useTransform(overviewScrollY, [0, 1], ["-15%", "15%"]);

  return (
    <main>
      {/* ── Hero ── */}
      <section ref={heroParallaxRef} className="relative h-[500px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-[1.3] bg-[#1A1014]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 pb-12 md:pb-16">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block font-headline text-sm bg-[#CC1122]/20 text-[#CC1122] px-4 py-1 mb-6"
          >
            YOUTH DEVELOPMENT
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] tracking-tighter italic leading-none mb-4"
          >
            <span className="text-white">KIDS </span>
            <span className="text-[#CC1122]">BJJ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="font-serif text-xl md:text-2xl italic text-[#E6BDB9] max-w-xl"
          >
            Confidence, discipline, and resilience — built one class at a time.
          </motion.p>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* ── Overview ── */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <SectionReveal>
              <span className="font-headline text-sm text-[#CC1122] tracking-[0.3em] mb-4 block">
                PROGRAM OVERVIEW
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter italic text-white mb-8">
                BUILDING <span className="text-[#CC1122]">CHAMPIONS</span> ON
                AND OFF THE MAT
              </h2>
              <div className="space-y-5 text-[#E6BDB9] font-body leading-relaxed text-lg">
                <p>
                  Our Kids BJJ program is designed for children ages 5 through
                  14. We blend the technical side of Brazilian Jiu-Jitsu with
                  age-appropriate games, drills, and challenges that keep young
                  athletes engaged while they develop real grappling skill.
                </p>
                <p>
                  Beyond technique, this program emphasizes discipline,
                  confidence, and respect. Kids learn to handle adversity, work
                  through frustration, and support their teammates — qualities
                  that directly transfer to the classroom, the home, and
                  everyday life.
                </p>
                <p>
                  Our anti-bullying curriculum gives students practical
                  self-defense tools and the confidence to de-escalate conflict.
                  Every class is supervised by experienced coaches who create a
                  safe, positive environment where kids thrive.
                </p>
                <p>
                  We also offer our Tiny Tots program for children ages 4-7,
                  introducing them to martial arts through fun, age-appropriate
                  activities that build coordination, confidence, and discipline
                  from the very start.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="relative">
                <div ref={overviewParallaxRef} className="overflow-hidden w-full aspect-[4/3]">
                  <motion.div style={{ y: overviewY }} className="bg-[#1A1014] w-full h-full scale-[1.3]" />
                </div>
                <div className="absolute top-4 left-4 w-full h-full border-2 border-[#CC1122]/40 -z-10" />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── What They'll Learn ── */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <SectionReveal>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tighter italic text-white mb-4">
              WHAT THEY&apos;LL{" "}
              <span className="text-[#CC1122]">LEARN</span>
            </h2>
            <div className="gradient-divider mb-16" />
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {curriculum.map((item, i) => (
              <SectionReveal key={item.title} delay={i * 0.12}>
                <div className="clip-corner bg-[#1A1014] p-1 h-full">
                  <div className="bg-[#0A0A0A] p-8 border border-[#CC1122]/10 h-full flex flex-col">
                    <div className="w-12 h-12 bg-[#CC1122]/20 mb-6 flex items-center justify-center">
                      <div className="w-5 h-5 bg-[#CC1122]/60" />
                    </div>
                    <h3 className="font-headline text-2xl md:text-3xl text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-[#E6BDB9] font-body leading-relaxed text-sm flex-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Class Details ── */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <SectionReveal className="lg:col-span-2">
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tighter italic text-white mb-8 md:mb-12">
                CLASS <span className="text-[#CC1122]">DETAILS</span>
              </h2>

              <div className="space-y-6">
                {classDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="bg-[#1A1014] border-l-4 border-[#CC1122] p-6"
                  >
                    <span className="font-headline text-xl text-[#CC1122] block mb-1">
                      {detail.label}
                    </span>
                    <span className="font-body text-[#E6BDB9] text-lg">
                      {detail.times}
                    </span>
                  </div>
                ))}
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="bg-[#1A1014] p-8 border border-[#CC1122]/10 clip-corner">
                <h3 className="font-headline text-2xl text-white mb-6">
                  INFO
                </h3>

                <div className="space-y-6">
                  <div>
                    <span className="font-headline text-sm text-[#CC1122] tracking-[0.2em] block mb-1">
                      AGES
                    </span>
                    <span className="font-body text-[#E6BDB9]">
                      5 to 14 years old
                    </span>
                  </div>
                  <div className="h-px bg-[#CC1122]/10" />
                  <div>
                    <span className="font-headline text-sm text-[#CC1122] tracking-[0.2em] block mb-1">
                      REQUIRED GEAR
                    </span>
                    <ul className="font-body text-[#E6BDB9] space-y-1 text-sm">
                      <li>BJJ Gi (white, blue, or black)</li>
                      <li>Mouthguard</li>
                      <li>Water bottle</li>
                    </ul>
                  </div>
                  <div className="h-px bg-[#CC1122]/10" />
                  <div>
                    <span className="font-headline text-sm text-[#CC1122] tracking-[0.2em] block mb-1">
                      FIRST VISIT
                    </span>
                    <span className="font-body text-[#E6BDB9]">
                      Free 20-minute consultation
                    </span>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#CC1122]/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center container mx-auto px-4 sm:px-6 md:px-8">
          <RevealElement>
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-[8rem] tracking-tighter italic leading-none mb-8">
              <span className="text-white block">ENROLL YOUR</span>
              <span className="text-[#CC1122] block">CHILD</span>
            </h2>
          </RevealElement>

          <RevealElement delay={0.15}>
            <p className="font-serif text-xl md:text-2xl italic text-[#E6BDB9] max-w-2xl mx-auto mb-12">
              Give them the gift of confidence. Book a free 20-minute consultation.
            </p>
          </RevealElement>

          <RevealElement delay={0.3}>
            <button
              onClick={openLeadForm}
              className="-skew-x-12 bg-[#CC1122] px-6 sm:px-8 md:px-12 lg:px-16 py-4 md:py-6 shadow-[0_0_30px_rgba(204,17,34,0.4)] hover:brightness-125 transition-all"
            >
              <span className="skew-x-12 inline-block font-headline text-base sm:text-xl md:text-2xl lg:text-4xl tracking-widest text-white uppercase">
                BOOK A CONSULTATION
              </span>
            </button>
          </RevealElement>
        </div>
      </section>
    </main>
  );
}
