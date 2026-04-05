"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const classes = [
  {
    label: "CURRENTLY TRAINING",
    title: "ADVANCED NO-GI",
    time: "18:00 - 19:30",
    subtitle: "COACH DIAZ",
    featured: true,
  },
  {
    label: "UPCOMING",
    title: "KIDS FUNDAMENTALS",
    time: "16:30 - 17:30",
    subtitle: "DAILY",
    featured: false,
  },
  {
    label: "MORNING SESSION",
    title: "ALL LEVELS GI",
    time: "06:00 - 07:00",
    subtitle: "M/W/F",
    featured: false,
  },
  {
    label: "COMPETITION CLASS",
    title: "SITUATION SPARRING",
    time: "12:00 - 13:30",
    subtitle: "SATURDAY",
    featured: false,
  },
  {
    label: "LITTLE WARRIORS",
    title: "TINY TOTS",
    time: "16:00 - 16:45",
    subtitle: "DAILY",
    featured: false,
  },
];

function ClassItem({
  item,
  index,
}: {
  item: (typeof classes)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
      className={`flex flex-col md:flex-row justify-between items-start md:items-center p-6 ${
        item.featured
          ? "bg-[#0A0A0A] border-l-4 border-[#CC1122] shadow-[0_0_30px_rgba(204,17,34,0.15)]"
          : "bg-[#0A0A0A]/50 border-l-4 border-zinc-800"
      }`}
    >
      {/* Left */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          {item.featured && (
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CC1122] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CC1122]" />
            </span>
          )}
          <span
            className={`font-headline tracking-widest text-sm ${
              item.featured ? "text-[#CC1122]" : "text-zinc-500"
            }`}
          >
            {item.label}
          </span>
        </div>
        <h3
          className={`font-headline text-2xl sm:text-3xl md:text-4xl ${
            item.featured ? "text-white" : "text-white"
          }`}
        >
          {item.title}
        </h3>
      </div>

      {/* Right */}
      <div className="text-left md:text-right mt-4 md:mt-0">
        <p
          className={`font-headline text-xl sm:text-2xl md:text-3xl ${
            item.featured ? "text-white" : "text-zinc-400"
          }`}
        >
          {item.time}
        </p>
        <p
          className={`${
            item.featured ? "text-[#E6BDB9]" : "text-zinc-500 italic"
          }`}
        >
          {item.subtitle}
        </p>
      </div>
    </motion.div>
  );
}

export default function Schedule() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-100px" });

  const descRef = useRef<HTMLParagraphElement>(null);
  const descInView = useInView(descRef, { once: true, margin: "-100px" });

  const ctaRef = useRef<HTMLAnchorElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <section id="schedule" className="py-16 sm:py-24 md:py-32 bg-[#1A1014]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-20">
          {/* Left column */}
          <div className="md:w-2/5">
            <motion.h2
              ref={headingRef}
              initial={{ opacity: 0, y: 40 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tighter italic leading-none mb-8"
            >
              <span className="text-white block">CLASS</span>
              <span className="text-[#CC1122] block">SCHEDULE</span>
            </motion.h2>
            <motion.p
              ref={descRef}
              initial={{ opacity: 0, y: 40 }}
              animate={descInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              className="text-[#E6BDB9] text-xl leading-relaxed mb-12"
            >
              We offer morning, afternoon, and evening sessions to fit any
              professional schedule. All levels welcome to open mat.
            </motion.p>
            <motion.a
              ref={ctaRef}
              initial={{ opacity: 0, y: 40 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              href="/schedule"
              className="inline-block -skew-x-12 bg-[#CC1122] px-6 sm:px-10 py-3 sm:py-4 hover:shadow-[0_0_30px_rgba(204,17,34,0.4)] transition-shadow duration-300"
            >
              <span className="skew-x-12 inline-block font-headline text-base sm:text-xl md:text-2xl tracking-widest text-white">
                VIEW FULL SCHEDULE
              </span>
            </motion.a>
          </div>

          {/* Right column */}
          <div className="md:w-3/5 space-y-4">
            {classes.map((item, i) => (
              <ClassItem key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
