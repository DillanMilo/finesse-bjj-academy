import Link from "next/link";
import ArrowIcon from "@/components/ui/ArrowIcon";
import PromotionCheckinForm from "@/components/ui/PromotionCheckinForm";
import { isUpcoming } from "@/lib/competitions";
import { checkinEvent, promotions } from "@/lib/promotions";
import { pageMetadata } from "@/lib/seo";
// FIN-SHEETS-1102: members' promotion check-ins go to a Google Sheet. Not linked or indexed until approved.
export const metadata = { ...pageMetadata("/promotion-check-in", "Promotion Check-in", "Check in for an upcoming Finesse BJJ belt promotion."), robots: { index: false, follow: false } };
// Re-render hourly so finished promotions drop out of the list.
export const revalidate = 3600;
export default function PromotionCheckinPage() {
  const events = promotions.filter(event => isUpcoming(event)).map(checkinEvent);
  return <main className="competition-hub pt-16"><section className="hub-section"><div className="max-w-3xl"><Link href="/" className="text-[#CC1122] text-sm"><ArrowIcon direction="left" className="h-4 w-4" /> BACK TO FINESSE BJJ</Link><p className="hub-eyebrow mt-10">BELT PROMOTION</p><h1 className="font-headline text-6xl md:text-8xl mb-10">EARN THE NEXT ONE.</h1><PromotionCheckinForm events={events} /></div></section></main>;
}
