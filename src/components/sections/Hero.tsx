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

// Text reveal component — clips text and slides it in
function TextReveal({
  children,
  direction = "left",
  delay = 0,
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  delay?: number;
}) {
  return (
    <span className="block" style={{ clipPath: "inset(-10% -20% -10% -20%)" }}>
      <motion.span
        className="block"
        initial={{
          x: direction === "left" ? "-110%" : "110%",
          filter: "blur(8px)",
        }}
        animate={{
          x: "0%",
          filter: "blur(0px)",
        }}
        transition={{
          x: {
            type: "spring",
            damping: 30,
            stiffness: 200,
            delay,
          },
          filter: {
            duration: 0.8,
            delay: delay + 0.2,
            ease: "easeOut",
          },
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const openLeadForm = useOpenLeadForm();
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black grayscale opacity-40" />
      <div className="absolute inset-0 bg-[#0A0A0A]/70" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 z-10 pt-24 md:pt-28 pb-32 md:pb-36">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo — hero centerpiece with scale-in + glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              opacity: { duration: 0.6, ease: "easeOut" },
              scale: {
                type: "spring",
                damping: 20,
                stiffness: 150,
                mass: 1.2,
              },
              filter: { duration: 1, ease: "easeOut" },
            }}
            className="mb-8 flex justify-center"
          >
            <Image
              src="/logo.png"
              alt="Finesse BJJ Academy"
              width={640}
              height={320}
              className="h-40 md:h-52 lg:h-64 w-auto drop-shadow-[0_0_60px_rgba(204,17,34,0.35)]"
              priority
            />
          </motion.div>

          {/* Heading with clip-reveal text animations */}
          <h1 className="font-headline text-4xl min-[375px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] tracking-tighter italic mb-8">
            <TextReveal direction="left" delay={0.4}>
              <span className="text-white">MASTER THE ART</span>
            </TextReveal>
            <TextReveal direction="right" delay={0.6}>
              <span className="bg-gradient-to-r from-[#CC1122] to-red-800 bg-clip-text text-transparent inline-block -translate-x-6 md:-translate-x-10">
                OF FINESSE
              </span>
            </TextReveal>
          </h1>

          {/* Quote — blur-clear fade in */}
          <motion.p
            className="font-serif text-lg sm:text-xl md:text-3xl text-[#E6BDB9] italic mb-10"
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 1.2,
              delay: 1.0,
              ease: "easeOut",
            }}
          >
            &ldquo;The efficiency of technique over the brutality of strength.
            This is the art of the complete grappler.&rdquo;
          </motion.p>

          {/* Buttons — staggered slide-up */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 180,
                delay: 1.3,
              }}
              className="w-full md:w-auto"
            >
              <button
                onClick={openLeadForm}
                className="-skew-x-12 bg-[#CC1122] px-6 sm:px-10 py-4 shadow-[0_0_30px_rgba(204,17,34,0.4)] hover:shadow-[0_0_40px_rgba(204,17,34,0.6)] transition-shadow duration-300 w-full md:w-auto"
              >
                <span className="skew-x-12 inline-block font-headline text-base sm:text-xl md:text-2xl tracking-widest text-white">
                  BOOK FREE CONSULTATION
                </span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 180,
                delay: 1.5,
              }}
              className="w-full md:w-auto"
            >
              <a
                href="/schedule"
                className="-skew-x-12 border border-[#CC1122]/50 px-6 sm:px-10 py-4 hover:bg-[#CC1122]/10 transition-colors duration-300 w-full md:w-auto block"
              >
                <span className="skew-x-12 inline-block font-headline text-lg sm:text-xl md:text-2xl tracking-widest text-white">
                  VIEW SCHEDULE
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <div
        ref={statsRef}
        className="absolute bottom-0 left-0 right-0 bg-[#1A1014] py-4 sm:py-6 md:py-8 border-t border-[#CC1122]/20 z-10"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center border-l-2 border-[#CC1122] pl-3 sm:pl-6"
              >
                <span className="font-headline text-2xl min-[375px]:text-3xl sm:text-5xl text-[#CC1122] mr-2 sm:mr-4">
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    started={statsInView}
                  />
                </span>
                <span className="font-headline text-[10px] min-[375px]:text-xs sm:text-xl text-[#E6BDB9] tracking-widest">
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
