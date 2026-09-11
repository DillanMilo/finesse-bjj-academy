import type { Metadata } from "next";
import ProgramDetail from "@/components/sections/ProgramDetail";

export const metadata: Metadata = {
  title: "Personalized Options | Finesse BJJ Academy",
  description: "Explore a personalized mix of private coaching, nutrition guidance, and strength training at Finesse BJJ in Spring, TX. Start with a consultation.",
};

export default function PersonalizedOptionsPage() {
  return <ProgramDetail variant="personalized" />;
}
