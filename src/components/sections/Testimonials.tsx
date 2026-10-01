"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Manually selected excerpts, checked directly on Google Maps on September 30, 2026.
const googleReviewsUrl = "https://www.google.com/maps/search/?api=1&query=Finesse+BJJ&query_place_id=ChIJFVGJ-vrNQIYRSMNGSG_SXLw";
const testimonials = [
  {
    quote: "They are patient, encouraging, and genuinely care about helping everyone improve. … It’s been an amazing experience for our whole family.",
    name: "Karel Rosabal",
    initials: "KR",
    offsetClass: "md:translate-y-8",
    featured: false,
  },
  {
    quote: "It's nice that everyone is willing to help each other out with techniques. All around good vibes and good people.",
    name: "Lauren Diaz",
    initials: "LD",
    offsetClass: "",
    featured: true,
  },
  {
    quote: "The coaches are extremely talented and knowledgeable instructors who clearly care about your learning and progress.",
    name: "Melizza Hernandez",
    initials: "MH",
    offsetClass: "md:translate-y-16",
    featured: false,
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.15 }}
      className={testimonial.offsetClass}
    >
      <div
        className={`bg-[#1A1014] p-6 sm:p-8 md:p-10 clip-corner ${
          testimonial.featured
            ? "border-l-2 border-[#CC1122] red-glow"
            : ""
        }`}
      >
        {/* Stars */}
        <div aria-label="5 out of 5 stars" className="text-[#CC1122] mb-6 text-xl tracking-wider">
          {"★★★★★"}
        </div>

        {/* Quote */}
        <p className="font-serif text-lg sm:text-xl md:text-2xl italic leading-relaxed text-[#E5E2E1] mb-10">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#CC1122] flex items-center justify-center font-headline text-xl text-white">
            {testimonial.initials}
          </div>
          <div>
            <div className="font-bold text-white">{testimonial.name}</div>
            <div className="text-[#CC1122] text-sm font-headline tracking-widest">
              GOOGLE REVIEW · EXCERPT
            </div>
          </div>
        </div>
        <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Read Google reviews including ${testimonial.name}’s review`} className="inline-block mt-6 text-sm text-[#FFB3AD] underline underline-offset-4 hover:text-white transition-colors">Read Google reviews ↗</a>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-16 sm:py-24 md:py-32 bg-[#0A0A0A] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        {/* Header */}
        <motion.h2
          ref={headerRef}
          className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tighter italic mb-5"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-white">REAL </span>
          <span className="text-[#CC1122]">RESULTS</span>
        </motion.h2>

        <p className="text-zinc-400 max-w-2xl mb-12 sm:mb-16 md:mb-24">Selected excerpts from five-star Google reviews, in reviewers’ own words.</p>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
