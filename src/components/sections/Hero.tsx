"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useOpenLeadForm } from "@/lib/lead-form-context";

const stats = [
  { end: 15, suffix: "+", label: "YEARS EXPERIENCE" },
  { end: 4, suffix: "", label: "BLACK BELT INSTRUCTORS" },
  { end: 200, suffix: "+", label: "ACTIVE MEMBERS" },
];

function CountUp({
  end,
  suffix,
  duration = 2000,
  started,
}: {
  end: number;
  suffix: string;
  duration?: number;
  started: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    let raf: number;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [started, end, duration]);

  return (
    <>
      {started ? count : 0}
      {suffix}
    </>
  );
}

export default function Hero() {
  const openLeadForm = useOpenLeadForm();
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black grayscale opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <Image
              src="/logo.png"
              alt="Finesse BJJ Academy"
              width={192}
              height={96}
              className="h-16 md:h-20 lg:h-24 w-auto"
              priority
            />
          </motion.div>

          <motion.h1
            className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-9xl leading-[0.85] tracking-tighter italic mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <span className="text-white block">MASTER THE ART</span>
            <span className="block bg-gradient-to-r from-[#CC1122] to-red-800 bg-clip-text text-transparent">
              OF FINESSE
            </span>
          </motion.h1>

          <motion.p
            className="font-serif text-lg sm:text-xl md:text-3xl text-[#E6BDB9] italic mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          >
            &ldquo;The efficiency of technique over the brutality of strength.
            This is the art of the complete grappler.&rdquo;
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            <button
              onClick={openLeadForm}
              className="-skew-x-12 bg-[#CC1122] px-6 sm:px-10 py-4 shadow-[0_0_30px_rgba(204,17,34,0.4)] hover:shadow-[0_0_40px_rgba(204,17,34,0.6)] transition-shadow duration-300 w-full md:w-auto"
            >
              <span className="skew-x-12 inline-block font-headline text-lg sm:text-xl md:text-2xl tracking-widest text-white">
                BOOK FREE CONSULTATION
              </span>
            </button>

            <a
              href="/schedule"
              className="-skew-x-12 border border-[#CC1122]/50 px-6 sm:px-10 py-4 hover:bg-[#CC1122]/10 transition-colors duration-300 w-full md:w-auto"
            >
              <span className="skew-x-12 inline-block font-headline text-lg sm:text-xl md:text-2xl tracking-widest text-white">
                VIEW SCHEDULE
              </span>
            </a>
          </motion.div>
        </div>
      </div>

      <div
        ref={statsRef}
        className="absolute bottom-0 left-0 right-0 bg-[#1A1014] py-4 sm:py-6 md:py-8 border-t border-[#CC1122]/20 z-10"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center border-l-2 border-[#CC1122] pl-6"
              >
                <span className="font-headline text-4xl sm:text-5xl text-[#CC1122] mr-4">
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    started={statsInView}
                  />
                </span>
                <span className="font-headline text-base sm:text-xl text-[#E6BDB9] tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
