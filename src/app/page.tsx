"use client";

import Hero from "@/components/sections/Hero";
import Programs from "@/components/sections/Programs";
import Trainers from "@/components/sections/Trainers";
import Testimonials from "@/components/sections/Testimonials";
import Schedule from "@/components/sections/Schedule";
import LatestNews from "@/components/sections/LatestNews";
import FinalCTA from "@/components/sections/FinalCTA";

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
