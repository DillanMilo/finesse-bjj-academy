"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useOpenLeadForm } from "@/lib/lead-form-context";
import { schedule, isClassActive } from "@/lib/schedule";

/* ─── Page ─── */

export default function SchedulePage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });
  const openLeadForm = useOpenLeadForm();

  // Re-evaluate active class every 60 seconds
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const heroParallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroParallaxRef,
    offset: ["start end", "end start"],
  });
  const heroY = useTransform(heroScrollY, [0, 1], ["-15%", "15%"]);

  return (
    <main>
      {/* ─── Hero Banner ─── */}
      <section ref={heroParallaxRef} className="relative h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background placeholder + gradient */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-[1.3] bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/50 to-transparent" />

        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8">
          <motion.h1
            className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-9xl tracking-tighter italic leading-[0.85] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-white">FIND YOUR </span>
            <span
              className="text-[#CC1122]"
              style={{ filter: "drop-shadow(0 0 20px rgba(204, 17, 34, 0.5))" }}
            >
              CLASS
            </span>
          </motion.h1>

          <motion.p
            className="font-serif text-xl md:text-2xl lg:text-3xl italic text-[#E6BDB9] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            &ldquo;The mat is a mirror. What you see there is what you are.&rdquo;
          </motion.p>
        </div>
      </section>

      {/* ─── Weekly Timetable ─── */}
      <section className="py-20 md:py-32 bg-[#0A0A0A]">
        <div ref={gridRef} className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
            <motion.h2
              className="font-headline text-4xl md:text-5xl tracking-wider text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={gridInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              WEEKLY TIMETABLE
            </motion.h2>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={gridInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <span className="w-4 h-4 bg-[#CC1122] inline-block" />
              <span className="font-headline text-sm tracking-widest text-[#E6BDB9]">
                ACTIVE SESSION
              </span>
            </motion.div>
          </div>

          <div className="gradient-divider mb-12" />

          {/* ─── Desktop Grid ─── */}
          <div className="hidden md:grid grid-cols-7 gap-2">
            {schedule.map((day, dayIdx) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 30 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.1 + dayIdx * 0.07,
                }}
              >
                {/* Day header */}
                <div className="text-center mb-4">
                  <span className="font-headline text-2xl tracking-widest text-[#E6BDB9]">
                    {day.day}
                  </span>
                </div>

                {/* Classes */}
                {day.rest ? (
                  <div className="border border-dashed border-zinc-700 p-6 text-center opacity-50 min-h-[120px] flex items-center justify-center">
                    <span className="font-headline text-xl tracking-widest text-zinc-500">
                      REST DAY
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {day.classes.map((cls) => (
                      <div
                        key={`${day.day}-${cls.time}`}
                        className={`clip-corner p-4 transition-colors group ${
                          isClassActive(day.dayIndex, cls.time)
                            ? "bg-[#2A2A2A] border-l-4 border-[#CC1122] shadow-[0_0_15px_rgba(204,17,34,0.2)]"
                            : "bg-[#201F1F] hover:bg-[#2A2A2A]"
                        }`}
                      >
                        <p
                          className={`font-headline text-xs tracking-[0.2em] mb-1 ${
                            isClassActive(day.dayIndex, cls.time) ? "text-[#CC1122]" : "text-zinc-500"
                          }`}
                        >
                          {cls.time}
                        </p>
                        <p className="font-headline text-xl text-white group-hover:text-[#CC1122] transition-colors leading-tight">
                          {cls.title}
                        </p>
                        <p className="text-[10px] text-[#E6BDB9] uppercase tracking-widest mt-1">
                          {cls.subtitle}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* ─── Mobile List ─── */}
          <div className="md:hidden flex flex-col gap-8">
            {schedule.map((day, dayIdx) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: 0.05 + dayIdx * 0.05,
                }}
              >
                <div className="border-l-2 border-[#CC1122] pl-4">
                  <h3 className="font-headline text-2xl tracking-widest text-[#E6BDB9] mb-3">
                    {day.day}
                  </h3>

                  {day.rest ? (
                    <div className="border border-dashed border-zinc-700 p-4 text-center opacity-50">
                      <span className="font-headline text-lg tracking-widest text-zinc-500">
                        REST DAY
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {day.classes.map((cls) => (
                        <div
                          key={`${day.day}-${cls.time}-mobile`}
                          className={`clip-corner p-4 ${
                            isClassActive(day.dayIndex, cls.time)
                              ? "bg-[#2A2A2A] border-l-4 border-[#CC1122] shadow-[0_0_15px_rgba(204,17,34,0.2)]"
                              : "bg-[#201F1F]"
                          }`}
                        >
                          <p
                            className={`font-headline text-xs tracking-[0.2em] mb-1 ${
                              isClassActive(day.dayIndex, cls.time) ? "text-[#CC1122]" : "text-zinc-500"
                            }`}
                          >
                            {cls.time}
                          </p>
                          <p className="font-headline text-xl text-white leading-tight">
                            {cls.title}
                          </p>
                          <p className="text-[10px] text-[#E6BDB9] uppercase tracking-widest mt-1">
                            {cls.subtitle}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#CC1122]/15 blur-[120px] rounded-full pointer-events-none" />

        <div ref={ctaRef} className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.h2
            className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tighter italic leading-none mb-8 md:mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-white block">READY TO</span>
            <span className="text-[#CC1122] block">TRAIN?</span>
          </motion.h2>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <button
              onClick={openLeadForm}
              className="-skew-x-12 bg-[#CC1122] px-6 sm:px-8 md:px-12 py-4 md:py-5 shadow-[0_0_30px_rgba(204,17,34,0.4)] hover:brightness-125 transition-all"
            >
              <span className="skew-x-12 inline-block font-headline text-base sm:text-lg md:text-2xl tracking-widest text-white uppercase">
                BOOK FREE CONSULTATION
              </span>
            </button>

            <Link
              href="/#programs"
              className="-skew-x-12 border border-[#CC1122]/50 px-6 sm:px-8 md:px-10 py-4 md:py-5 hover:bg-[#CC1122]/10 transition-colors"
            >
              <span className="skew-x-12 inline-block font-headline text-base sm:text-lg md:text-2xl tracking-widest text-white uppercase">
                VIEW PROGRAMS
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
