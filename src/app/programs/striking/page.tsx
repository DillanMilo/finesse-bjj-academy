import type { Metadata } from "next";
import StrikingProgram from "@/components/sections/StrikingProgram";

export const metadata: Metadata = {
  title: "Striking",
  description: "Explore striking at Finesse BJJ in Spring, TX. View all-levels and kids class times and book a consultation.",
};

export default function StrikingPage() {
  return <StrikingProgram />;
}
