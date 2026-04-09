"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useOpenLeadForm } from "@/lib/lead-form-context";

/* ──────────────────────────── data ──────────────────────────── */

const galleryItems = [
  { title: "COMPETITION DAY", span: "md:col-span-8", aspect: "aspect-[16/9]" },
  { title: "THE GRIND", span: "md:col-span-4", aspect: "aspect-square" },
  { title: "DRILLING PRECISION", span: "md:col-span-4", aspect: "aspect-[4/5]" },
  { title: "OPEN MAT", span: "md:col-span-4", aspect: "aspect-[4/5]" },
  { title: "COMMUNITY", span: "md:col-span-4", aspect: "aspect-[4/5]" },
];

const filterTabs = ["ALL SHOTS", "GI", "NO-GI"];

const testimonials = [
  {
    quote:
      "I walked in a stranger and left with a family. The technique here is world-class, but it is the culture that keeps you coming back every single day.",
    name: "CARLOS M.",
    belt: "BROWN BELT",
    beltColor: "#6B3A2A",
    since: "2019",
    offset: "",
  },
  {
    quote:
      "Coach Diaz sees things in your game that you cannot see yourself. Every roll is a lesson, every lesson is a revelation. This place rewired my brain.",
    name: "ALEX T.",
    belt: "PURPLE BELT",
    beltColor: "#7B2D8E",
    since: "2020",
    offset: "md:translate-y-12",
  },
  {
    quote:
      "I have trained at six gyms across three states. Finesse is different. The attention to detail, the intensity, the community — nothing else compares.",
    name: "RACHEL W.",
    belt: "BLUE BELT",
    beltColor: "#1A4B8C",
    since: "2022",
    offset: "",
  },
];

/* ──────────────────────────── helpers ──────────────────────────── */

function useReveal(margin: string = "-100px") {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: margin as `${number}px` });
  return { ref, isInView };
}

function useParallax(range: [string, string] = ["-15%", "15%"]) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], range);
  return { ref, y };
}

/* ──────────────────────────── components ──────────────────────────── */

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isInView } = useReveal();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
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
  const { ref, isInView } = useReveal();

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

function MissionImage() {
  const { ref, y } = useParallax(["-15%", "15%"]);

  return (
    <div className="relative">
      <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-full h-full border border-[#CC1122]/30 z-0" />
      <div ref={ref} className="relative z-10 w-full aspect-[4/5] overflow-hidden clip-corner">
        <motion.div
          className="w-full h-full bg-zinc-800 scale-[1.3] grayscale brightness-90"
          style={{ y }}
        />
      </div>
    </div>
  );
}

function CtaBackground() {
  const { ref, y } = useParallax(["-10%", "10%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="w-full h-full bg-zinc-900 scale-[1.3]"
        style={{ y }}
      />
    </div>
  );
}

function GalleryItem({
  item,
  index,
}: {
  item: (typeof galleryItems)[number];
  index: number;
}) {
  const { ref: revealRef, isInView } = useReveal();
  const { ref: parallaxRef, y } = useParallax(["-15%", "15%"]);

  return (
    <motion.div
      ref={revealRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
      className={`${item.span} col-span-1 group relative overflow-hidden cursor-pointer`}
    >
      <div ref={parallaxRef} className={`${item.aspect} w-full overflow-hidden`}>
        <motion.div
          className="w-full h-full bg-zinc-800 scale-[1.3]"
          style={{ y }}
        />
      </div>
      {/* hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
        <span className="font-headline text-2xl tracking-wider text-white">
          {item.title}
        </span>
      </div>
    </motion.div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number];
  index: number;
}) {
  const { ref, isInView } = useReveal();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.15 }}
      className={testimonial.offset}
    >
      <div className="bg-[#1A1014] p-6 md:p-10 clip-corner h-full flex flex-col">
        {/* belt indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-1 h-8"
            style={{ backgroundColor: testimonial.beltColor }}
          />
          <span className="font-headline text-sm tracking-widest text-[#E6BDB9]">
            {testimonial.belt}
          </span>
        </div>

        {/* quote */}
        <p className="font-serif text-xl italic leading-relaxed text-[#E5E2E1] mb-auto pb-8">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        {/* author */}
        <div>
          <div className="font-headline text-2xl text-white mb-1">
            {testimonial.name}
          </div>
          <div className="text-xs tracking-[0.2em] text-[#E6BDB9]/60 uppercase">
            Member since {testimonial.since}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────── page ──────────────────────────── */

export default function AboutPage() {
  const openLeadForm = useOpenLeadForm();

  /* ── CTA section refs ── */
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <main>
      {/* ─── HERO BANNER ─── */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
        {/* placeholder background */}
        <div className="absolute inset-0 bg-zinc-900" />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0A0A0A]" />

        <div className="relative z-10 text-center px-6">
          <motion.h1
            className="font-headline text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] tracking-tighter italic leading-none mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-white">THE WALL OF </span>
            <span className="text-[#CC1122]">FINESSE</span>
          </motion.h1>

          <motion.p
            className="font-serif text-xl md:text-3xl italic text-[#E6BDB9]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
          >
            Where disciplined technique meets artistic precision.
          </motion.p>

          {/* bouncing down arrow */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 mx-auto text-[#CC1122]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <path strokeLinecap="square" strokeLinejoin="miter" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.div>
        </div>
      </section>

      {/* ─── MISSION SECTION ─── */}
      <Section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* left column */}
            <div>
              <RevealElement>
                <Image
                  src="/logo.png"
                  alt="Finesse BJJ Academy logo"
                  width={112}
                  height={112}
                  className="h-20 md:h-28 w-auto mb-8"
                />
              </RevealElement>

              <RevealElement delay={0.1}>
                <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tighter italic leading-none mb-10">
                  <span className="text-white block">THE PURSUIT</span>
                  <span className="text-[#CC1122] block">OF PRECISION</span>
                </h2>
              </RevealElement>

              <RevealElement delay={0.2}>
                <blockquote className="border-l-4 border-[#CC1122] pl-6 py-2 mb-8">
                  <p className="font-serif text-xl md:text-2xl italic text-[#E6BDB9] leading-relaxed">
                    &ldquo;We do not rise to the level of our expectations. We fall
                    to the level of our training.&rdquo;
                  </p>
                </blockquote>
              </RevealElement>

              <RevealElement delay={0.3}>
                <p className="text-[#E6BDB9] leading-relaxed text-lg">
                  Finesse BJJ Academy was founded on a simple conviction: that
                  martial arts mastery comes not from brute force, but from
                  relentless refinement. Every class, every drill, every roll is
                  an opportunity to sharpen the blade. We built this academy for
                  people who refuse to settle &mdash; who understand that
                  discipline on the mats translates to discipline in life. From
                  white belt to black belt, the standard never drops.
                </p>
              </RevealElement>
            </div>

            {/* right column: placeholder image with offset red border */}
            <RevealElement delay={0.2}>
              <MissionImage />
            </RevealElement>
          </div>
        </div>
      </Section>

      <div className="gradient-divider" />

      {/* ─── GALLERY SECTION ─── */}
      <Section className="py-16 sm:py-20 md:py-24 bg-[#0E0E0E]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          {/* header + filter tabs */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 md:mb-16">
            <RevealElement>
              <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tighter italic leading-none">
                <span className="text-white">THE </span>
                <span className="text-[#CC1122]">ARCHIVE</span>
              </h2>
            </RevealElement>

            <RevealElement delay={0.15}>
              <div className="flex gap-2">
                {filterTabs.map((tab, i) => (
                  <button
                    key={tab}
                    className={`font-headline text-sm tracking-widest px-5 py-2 transition-colors ${
                      i === 0
                        ? "bg-[#CC1122] text-white"
                        : "bg-zinc-800 text-[#E6BDB9] hover:bg-zinc-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </RevealElement>
          </div>

          {/* masonry-like grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {galleryItems.map((item, index) => (
              <GalleryItem key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <Section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <RevealElement>
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tighter italic mb-12 md:mb-24">
              <span className="text-white">VOICES FROM </span>
              <span className="text-[#CC1122]">THE MATS</span>
            </h2>
          </RevealElement>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── CTA SECTION ─── */}
      <Section className="py-20 sm:py-24 md:py-32 lg:py-40 relative overflow-hidden">
        {/* bg + overlay */}
        <CtaBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CC1122]/15 blur-[120px] rounded-full pointer-events-none" />

        <div ref={ctaRef} className="relative z-10 text-center container mx-auto px-4 sm:px-6 md:px-8">
          <motion.h2
            className="font-headline text-4xl sm:text-6xl md:text-7xl lg:text-[10rem] tracking-tighter italic leading-none mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-white block">JOIN THE</span>
            <span className="text-[#CC1122] block">FAMILY</span>
          </motion.h2>

          <motion.p
            className="font-serif text-xl md:text-3xl italic text-[#E6BDB9] max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            The mats are waiting. Your evolution starts with a single step
            through the door.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          >
            <button
              onClick={openLeadForm}
              className="-skew-x-12 bg-[#CC1122] px-6 sm:px-8 md:px-12 py-4 md:py-5 shadow-[0_0_30px_rgba(204,17,34,0.4)] hover:brightness-125 transition-all"
            >
              <span className="skew-x-12 inline-block font-headline text-base sm:text-lg md:text-2xl tracking-widest text-white uppercase">
                BOOK A FREE CONSULTATION
              </span>
            </button>

            <Link
              href="/schedule"
              className="-skew-x-12 border border-[#E6BDB9]/30 px-6 sm:px-8 md:px-12 py-4 md:py-5 hover:bg-white/5 transition-all inline-block"
            >
              <span className="skew-x-12 inline-block font-headline text-base sm:text-lg md:text-2xl tracking-widest text-[#E6BDB9] uppercase">
                VIEW SCHEDULE
              </span>
            </Link>
          </motion.div>
        </div>
      </Section>
    </main>
  );
}
