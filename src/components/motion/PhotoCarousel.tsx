"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface Photo { src: string; alt: string; position?: string }
interface Props {
  photos: readonly Photo[];
  className?: string;
  sizes?: string;
  priority?: boolean;
  label: string;
}

export default function PhotoCarousel({ photos, className = "", sizes = "100vw", priority = false, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  useEffect(() => {
    if (!visible || reducedMotion || photos.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setActive(current => {
        const next = (current + 1) % photos.length;
        return loaded.has(next) ? next : current;
      });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [visible, reducedMotion, photos.length, loaded]);

  return (
    <div ref={ref} role="region" aria-label={label} aria-roledescription="carousel"
      className={`${className.includes("absolute") ? "absolute" : "relative"} overflow-hidden ${className}`}>
      <motion.div className="absolute inset-x-0 -inset-y-[8%]" style={{ y: reducedMotion ? 0 : y }}>
        {photos.map((photo, index) => (
          <motion.div key={photo.src} className="absolute inset-0" initial={false}
            animate={{ opacity: index === active ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 1.4 }} aria-hidden={index !== active}>
            <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority && index === 0}
              loading={index > 0 && visible ? "eager" : undefined}
              className="object-cover" style={{ objectPosition: photo.position }}
              onLoad={() => setLoaded(previous => previous.has(index) ? previous : new Set(previous).add(index))} />
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
