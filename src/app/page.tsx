"use client";

import dynamic from "next/dynamic";
import CompetitionBanner from "@/components/competitions/CompetitionBanner";
import MerchStore from "@/components/sections/MerchStore";
import Hero from "@/components/sections/Hero";

// Temporarily disabled; keep the component for future refinement.
// const ScrollSnake = dynamic(() => import("@/components/motion/ScrollSnake"), { ssr: false });

const Programs = dynamic(() => import("@/components/sections/Programs"));
const Trainers = dynamic(() => import("@/components/sections/Trainers"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const Schedule = dynamic(() => import("@/components/sections/Schedule"));
const LatestNews = dynamic(() => import("@/components/sections/LatestNews"));
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

export default function Home() {
  return (
    <main>
      <Hero />
      <Programs />
      <CompetitionBanner />
      <Trainers />
      <Testimonials />
      <Schedule />
      <MerchStore />
      <LatestNews />
      <FinalCTA />
      {/* <ScrollSnake /> */}
    </main>
  );
}
