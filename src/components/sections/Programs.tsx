"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const programs = [
  {
    badge: "ELITE LEVEL",
    title: "ADULT BJJ",
    description:
      "Fundamental and advanced Brazilian Jiu-Jitsu for all skill levels. Focused on technical mastery and live sparring.",
    href: "/programs/adult-bjj",
  },
  {
    badge: "YOUTH DEVELOPMENT",
    title: "KIDS BJJ",
    description:
      "Building discipline, confidence, and respect through specialized grappling training for children ages 5-14.",
    href: "/programs/kids-bjj",
  },
  {
    badge: "TECHNICAL TAKEDOWNS",
    title: "WRESTLING",
    description:
      "Explosive takedowns and top control. Essential wrestling techniques adapted specifically for the submission game.",
    href: "/programs/wrestling",
  },
  {
    badge: "AGES 4-7",
    title: "TINY TOTS",
    description:
      "Introduction to martial arts for our youngest warriors. Building coordination, confidence, and discipline through fun, age-appropriate grappling games and exercises.",
    href: "#",
  },
  {
    badge: "COMBAT STRIKING",
    title: "STRIKING",
    description:
      "Develop effective stand-up skills. Learn proper technique in kickboxing and striking fundamentals to complement your grappling game.",
    href: "#",
  },
  {
    badge: "ONE-ON-ONE",
    title: "PRIVATE LESSONS",
    description:
      "Personalized one-on-one coaching with our expert instructors. Tailor your learning, refine techniques, and accelerate your progress at any skill level.",
    href: "#",
  },
];

function ProgramCard({
  program,
  index,
}: {
  program: (typeof programs)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.15 }}
      className="group clip-corner bg-[#1A1014] p-1 hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="bg-[#0A0A0A] p-5 sm:p-6 md:p-8 border border-[#CC1122]/10">
        <span className="inline-block font-headline text-sm bg-[#CC1122]/20 text-[#CC1122] px-3 py-1 mb-6">
          {program.badge}
        </span>

        <div ref={parallaxRef} className="overflow-hidden h-48 w-full mb-6">
          <motion.div
            style={{ y }}
            className="bg-zinc-800/50 h-full w-full scale-[1.3] grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>

        <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl text-white group-hover:text-[#CC1122] transition-colors duration-300 mb-4">
          {program.title}
        </h3>

        <p className="text-[#E6BDB9] font-body leading-relaxed mb-8">
          {program.description}
        </p>

        <a
          href={program.href}
          className="font-headline text-xl text-[#CC1122] tracking-widest inline-block py-2"
        >
          LEARN MORE &rarr;
        </a>
      </div>
    </motion.div>
  );
}

export default function Programs() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="programs" className="py-16 sm:py-24 md:py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-end mb-10 sm:mb-14 md:mb-20">
          <motion.h2
            className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tighter italic"
            initial={{ opacity: 0, y: 40 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="text-white">FIND YOUR </span>
            <span className="text-[#CC1122]">PATH</span>
          </motion.h2>
          <motion.div
            className="hidden md:block flex-1 ml-12 h-[2px] bg-[#CC1122]/20"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={headerInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            style={{ originX: 0 }}
          />
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {programs.map((program, i) => (
            <ProgramCard key={program.title} program={program} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
