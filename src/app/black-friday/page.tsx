import { notFound } from "next/navigation";
import SpecialPage from "@/components/specials/SpecialPage";
import { pageMetadata } from "@/lib/seo";
import { specials } from "@/lib/specials";

// FIN-SPECIAL-1103: the Black Friday membership special (src/lib/specials.ts). The page checks the end date in
// the browser and shows "this special has ended" once it's over.
const special = specials.find(item => item.slug === "black-friday");

export const metadata = pageMetadata("/black-friday", "Black Friday Special", "Black Friday membership pricing at Finesse BJJ Academy in Spring, TX, all November: Jiu-Jitsu for adults and kids, and adult Striking.");

export default function BlackFridayPage() {
  if (!special) notFound();
  return <SpecialPage special={special} />;
}
