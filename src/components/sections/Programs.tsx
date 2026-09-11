"use client";

import DnaHelix from "@/components/motion/DnaHelix";
import PhotoCarousel from "@/components/motion/PhotoCarousel";
import { adultPhotos } from "@/lib/adult-photos";
import ParallaxPhoto from "@/components/motion/ParallaxPhoto";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const rotatingPhotos: Record<string, readonly { src: string; alt: string; position?: string }[]> = {
  "ADULT BJJ": adultPhotos,
  "KIDS BJJ": [
    { src: "/photos/kids-coaching-1427.webp", alt: "A coach guiding young students through a grappling drill", position: "45% 45%" },
    { src: "/photos/kids-drills-1429.webp", alt: "Kids practicing standing grappling in pairs", position: "50% 40%" },
    { src: "/photos/kids-class.webp", alt: "Kids and coaches celebrating together on the mats" },
  ],
  "WOMEN’S PROGRAM": [
    { src: "/photos/womens-1421.webp", alt: "Women from the Finesse community together in their gis", position: "50% 45%" },
    { src: "/photos/womens-group.webp", alt: "Women from the Finesse community together on the mats", position: "50% 65%" },
  ],
};

const programs = [
  {
    badge: "ELITE LEVEL",
    title: "ADULT BJJ",
    image: "/photos/adult-1414.webp",
    alt: "Training partners practicing no-gi grappling",
    description:
      "Fundamental and advanced Brazilian Jiu-Jitsu for all skill levels. Focused on technical mastery and live sparring.",
    href: "/programs/adult-bjj",
  },
  {
    badge: "YOUTH DEVELOPMENT",
    title: "KIDS BJJ",
    image: "/photos/kids-coaching-1427.webp",
    alt: "A coach guiding two young students through a grappling drill",
    description:
      "Building discipline, confidence, and respect through specialized grappling training for children in the 6–7 and 8–14 age groups.",
    href: "/programs/kids-bjj",
  },
  {
    badge: "TECHNICAL TAKEDOWNS",
    title: "WRESTLING",
    image: "/photos/wrestling-1423.webp",
    alt: "Training partners practicing standing grappling",
    description:
      "Explosive takedowns and top control. Essential wrestling techniques adapted specifically for the submission game.",
    href: "/programs/wrestling",
  },
  {
    badge: "AGES 4–5",
    title: "TINY TOTS",
    image: "/photos/kids-friends.webp",
    alt: "Five young Finesse students smiling together",
    description:
      "Introduction to martial arts for our youngest warriors. Building coordination, confidence, and discipline through fun, age-appropriate grappling games and exercises.",
    href: "/schedule",
  },
  {
    badge: "COMBAT STRIKING",
    title: "STRIKING",
    image: "/photos/striking-training.webp",
    alt: "An athlete practicing a kick on a heavy bag",
    description:
      "Develop effective stand-up skills. Learn proper technique in kickboxing and striking fundamentals to complement your grappling game.",
    href: "/programs/striking",
  },
  {
    badge: "ONE-ON-ONE",
    title: "PRIVATE LESSONS",
    image: "/photos/adult-training.webp",
    alt: "Partners working through grappling technique",
    description:
      "Personalized one-on-one coaching with our expert instructors. Tailor your learning, refine techniques, and accelerate your progress at any skill level.",
    href: "/contact",
  },
  {
    badge: "CONFIDENCE & COMMUNITY",
    title: "WOMEN’S PROGRAM",
    image: "/photos/womens-1421.webp",
    alt: "Women from the Finesse community together on the mats",
    description: "Women’s no-gi fundamentals in a supportive training environment. Learn technique, build confidence, and grow alongside your training partners.",
    href: "/programs/womens-program",
  },
  {
    badge: "BUILT AROUND YOU",
    title: "PERSONALIZED OPTIONS",
    image: "/photos/adult-1406.webp",
    alt: "A Finesse student in a black gi",
    description: "Create your mix of private coaching, nutrition guidance, and strength training. Start with your goals and build a plan that fits your life.",
    href: "/programs/personalized-options",
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: (index % 3) * 0.12 }}
      className="group h-full clip-corner bg-[#1A1014] p-1 hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="flex flex-col h-full bg-[#0A0A0A] p-5 sm:p-6 md:p-8 border border-[#CC1122]/10">
        <span className="inline-block font-headline text-sm bg-[#CC1122]/20 text-[#CC1122] px-3 py-1 mb-6">
          {program.badge}
        </span>

        {rotatingPhotos[program.title] ? (
          <PhotoCarousel photos={rotatingPhotos[program.title]} label={`${program.title} training photos`} className="h-56 w-full mb-6" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        ) : program.title === "PERSONALIZED OPTIONS" ? (
          <div className="h-56 mb-6 flex items-center border border-[#CC1122]/20 bg-[#1A1014]/40"><DnaHelix /></div>
        ) : program.title === "STRIKING" ? (
          <div className="h-56 mb-6 bg-gradient-to-r from-[#1A1014] via-black to-[#1A1014] border border-[#CC1122]/20">
            <ParallaxPhoto src={program.image} alt={program.alt} className="h-full w-28 mx-auto" sizes="112px" />
          </div>
        ) : program.image ? (
          <ParallaxPhoto src={program.image} alt={program.alt} className="h-56 w-full mb-6" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        ) : (
          <div className="h-56 mb-6 flex items-center justify-center bg-gradient-to-br from-[#40131b] to-[#151015] border border-[#CC1122]/20">
            <span className="font-headline text-4xl text-[#E6BDB9] italic">BUILD YOUR STAND-UP</span>
          </div>
        )}

        <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl text-white group-hover:text-[#CC1122] transition-colors duration-300 mb-4">
          {program.title}
        </h3>

        <p className="text-[#E6BDB9] font-body leading-relaxed mb-8">
          {program.description}
        </p>

        <a
          href={program.href}
          className="font-headline text-xl text-[#CC1122] tracking-widest inline-block py-2 mt-auto"
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
