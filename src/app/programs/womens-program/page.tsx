import type { Metadata } from "next";
import ProgramDetail from "@/components/sections/ProgramDetail";

export const metadata: Metadata = {
  title: "Women’s Program | Finesse BJJ Academy",
  description: "Explore women’s no-gi fundamentals at Finesse BJJ in Spring, TX. Learn technique, build confidence, and meet supportive training partners.",
};

export default function WomensProgramPage() {
  return <ProgramDetail variant="women" />;
}
