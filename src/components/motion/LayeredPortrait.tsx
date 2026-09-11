"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LayeredPortrait({ foreground, background, name, closeUp = false, reversed = false }: {
  foreground: string;
  background: string;
  name: string;
  closeUp?: boolean;
  reversed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const foregroundY = useTransform(scrollYProgress, [0, 0.65, 1], ["2%", "-4%", "-4%"]);
  const scale = useTransform(scrollYProgress, [0, 0.65, 1], [1.03, 1.16, 1.16]);

  return (
    <div ref={ref} className="layered-portrait relative isolate aspect-[4/5] w-full">
      <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 top-[12%] translate-y-2 border border-[#CC1122]/40 sm:translate-y-3 ${reversed ? "translate-x-2 sm:translate-x-3" : "-translate-x-2 sm:-translate-x-3"}`} />
      <div className="absolute inset-x-0 bottom-0 top-[12%] overflow-hidden bg-[#171717]">
        <motion.div style={{ y: backgroundY }} className="portrait-layer absolute -inset-[5%]">
          <Image src={background} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover grayscale brightness-[0.5]" />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
      </div>
      {/* Extra space above the frame lets the subject lift out; the bottom stays cropped. */}
      <div className="pointer-events-none absolute -top-[25%] inset-x-0 bottom-0 overflow-hidden">
        <motion.div style={{ y: foregroundY, scale }} className="portrait-layer absolute inset-x-0 -bottom-[10%] top-[20%] origin-bottom drop-shadow-[18px_24px_14px_rgba(0,0,0,0.85)]">
          <Image src={foreground} alt={name} fill sizes="(max-width: 767px) 100vw, 50vw" className={`object-contain object-bottom grayscale brightness-95 ${closeUp ? "scale-[1.06] origin-bottom" : ""}`} />
        </motion.div>
      </div>
    </div>
  );
}
