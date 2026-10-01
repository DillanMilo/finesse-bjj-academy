"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export default function CompetitionBanner() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reducedMotion = useReducedMotion();
  const shouldPlay = inView && !reducedMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) void video.play().catch(() => {});
    else video.pause();
  }, [shouldPlay]);

  return (
    <section ref={ref} id="team-banner" className="relative isolate overflow-hidden bg-[#CC1122] text-white px-6 py-14 md:py-20">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: "url('/videos/finesse-team-rolling-poster.jpg')" }}>
        <video ref={videoRef} src={inView && !reducedMotion ? "/videos/finesse-team-rolling-10s.mp4" : undefined} poster="/videos/finesse-team-rolling-poster.jpg" muted loop playsInline preload="none" onCanPlay={() => { if (shouldPlay) void videoRef.current?.play().catch(() => {}); }} className="h-full w-full object-cover" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#CC1122]/70" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/35 via-transparent to-black/20" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div><p className="text-xs font-bold tracking-[.25em] mb-3">ON THE MATS. IN YOUR CORNER.</p><h2 className="font-headline text-5xl md:text-7xl">ONE TEAM. EVERY MATCH.</h2><p className="mt-3 max-w-xl text-white/90">Upcoming competitions, team results, and the moments we share. Find your next event or come cheer on Finesse.</p></div>
        <Link href="/competitions" className="bg-black text-white px-7 py-4 font-headline text-xl tracking-wider self-start md:self-center">EXPLORE THE COMPETITION HUB ↗</Link>
      </div>
    </section>
  );
}
