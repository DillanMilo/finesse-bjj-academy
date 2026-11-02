import Link from "next/link";
import ArrowIcon from "@/components/ui/ArrowIcon";
import CompetitionSignupForm from "@/components/competitions/CompetitionSignupForm";
import { competitions, isUpcoming, signupEvent } from "@/lib/competitions";
import { pageMetadata } from "@/lib/seo";
// FIN-SHEETS-1102: members' competition sign-ups go to a Google Sheet. Not linked or indexed until approved.
export const metadata = { ...pageMetadata("/competitions/sign-up", "Competition Sign-up", "Tell the Finesse BJJ team which competition you’re competing in or coming to support."), robots: { index: false, follow: false } };
// Re-render hourly so finished competitions drop out of the list.
export const revalidate = 3600;
export default function CompetitionSignupPage() {
  const events = competitions.filter(event => isUpcoming(event)).map(signupEvent);
  return <main className="competition-hub pt-16"><section className="hub-section"><div className="max-w-3xl"><Link href="/competitions" className="text-[#CC1122] text-sm"><ArrowIcon direction="left" className="h-4 w-4" /> BACK TO THE HUB</Link><p className="hub-eyebrow mt-10">COMPETITION SIGN-UP</p><h1 className="font-headline text-6xl md:text-8xl mb-10">STEP UP. TEAM UP.</h1><CompetitionSignupForm events={events} /></div></section></main>;
}
