"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const trainers = [
  {
    name: "LUIS DIAZ",
    role: "HEAD COACH",
    rank: "3RD DEGREE BLACK BELT",
    image: "/luis.JPG",
    imageClass: "",
    quote:
      "In the depth of the struggle, finesse becomes your only language.",
    bio: "Founder and 3rd Degree Black Belt. With over two decades on the mats, Luis has developed a system that prioritizes technical economy over brute strength. His philosophy has shaped regional champions and world-class competitors.",
  },
  {
    name: "NATHAN BATES",
    role: "NO-GI SPECIALIST",
    rank: "BLACK BELT",
    image: "/nathan.JPG",
    imageClass: "",
    quote:
      "The mat is a mirror. It doesn\u2019t lie about your preparation or your heart.",
    bio: "An active competitor and analytical mastermind. Nathan specializes in modern guard systems and leg-lock entries. He brings a surgical precision to the academy\u2019s advanced program.",
  },
  {
    name: "TY",
    role: "",
    rank: "COACH",
    image: "/Ty.JPG",
    imageClass: "",
    quote:
      "Show up, work hard, and trust the process. The mats will take care of the rest.",
    bio: "Coach Ty brings energy and dedication to every session. His coaching style focuses on building confidence and developing well-rounded grapplers from day one.",
  },
  {
    name: "PATTY",
    role: "",
    rank: "INSTRUCTOR",
    image: "/patty.JPG",
    imageClass: "object-[35%_25%]",
    quote:
      "Jiu-jitsu isn't just for everyone — it's for you. Step on the mat and surprise yourself.",
    bio: "Coach Patty is a dedicated instructor who brings passion and precision to every class. She creates a welcoming environment that empowers students of all backgrounds to push their limits and grow both on and off the mats.",
  },
];

function TrainerBlock({
  trainer,
  index,
}: {
  trainer: (typeof trainers)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isReversed = index % 2 !== 0;

  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`flex flex-col ${
        isReversed ? "md:flex-row-reverse" : "md:flex-row"
      } items-center gap-8 sm:gap-12 md:gap-16`}
    >
      {/* Photo side */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="w-full md:w-1/2"
      >
        <div ref={photoRef} className="relative overflow-hidden">
          {/* Offset border frame */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className={`absolute -top-2 sm:-top-4 ${
              isReversed ? "-right-2 sm:-right-4" : "-left-2 sm:-left-4"
            } w-full h-full border border-[#CC1122]/30 z-0`}
          />
          <motion.div style={{ y }} className="scale-[1.15]">
            <Image
              src={trainer.image}
              alt={trainer.name}
              width={800}
              height={1000}
              className={`relative z-10 w-full aspect-[4/5] object-cover grayscale brightness-90 ${trainer.imageClass || "object-top"}`}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Info side */}
      <div className="w-full md:w-1/2">
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-2"
        >
          {trainer.name}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
          className="font-headline text-base sm:text-lg md:text-xl lg:text-2xl text-[#CC1122] tracking-widest mb-6"
        >
          {trainer.role ? `${trainer.role} \u2022 ` : ""}
          {trainer.rank}
        </motion.p>
        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
          className="font-serif text-lg sm:text-xl md:text-2xl italic text-[#E6BDB9] border-l-4 border-[#CC1122] pl-6 py-2 mb-8"
        >
          &ldquo;{trainer.quote}&rdquo;
        </motion.blockquote>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
          className="text-[#E6BDB9] leading-relaxed mb-8"
        >
          {trainer.bio}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Trainers() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-100px" });

  return (
    <section id="trainers" className="py-16 sm:py-24 md:py-32 bg-[#1A1014]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tighter italic text-center mb-12 sm:mb-16 md:mb-24"
        >
          <span className="text-white">YOUR </span>
          <span className="text-[#CC1122]">INSTRUCTORS</span>
        </motion.h2>

        {/* Trainer profiles */}
        <div className="space-y-16 sm:space-y-24 md:space-y-32">
          {trainers.map((trainer, i) => (
            <TrainerBlock key={trainer.name} trainer={trainer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
