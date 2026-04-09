"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";

const Programs = dynamic(() => import("@/components/sections/Programs"), { ssr: false });
const Trainers = dynamic(() => import("@/components/sections/Trainers"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"), { ssr: false });
const Schedule = dynamic(() => import("@/components/sections/Schedule"), { ssr: false });
const LatestNews = dynamic(() => import("@/components/sections/LatestNews"), { ssr: false });
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"), { ssr: false });

export default function Home() {
  return (
    <main>
      <Hero />
      <Programs />
      <Trainers />
      <Testimonials />
      <Schedule />
      <LatestNews />
      <FinalCTA />
    </main>
  );
}
