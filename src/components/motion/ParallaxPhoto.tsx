"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface Props {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  position?: string;
}

/** Overscan keeps the photo inside its frame throughout the scroll. */
export default function ParallaxPhoto({ src, alt, className = "", sizes = "100vw", priority = false, position = "50% 50%" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className={`${className.includes("absolute") ? "absolute" : "relative"} overflow-hidden ${className}`}>
      <motion.div className="absolute inset-x-0 -inset-y-[8%]" style={{ y: reducedMotion ? 0 : y }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
      </motion.div>
    </div>
  );
}
