import Link from "next/link";
import PolicyPage from "@/components/ui/PolicyPage";
import { CONTACT } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
export const metadata = { ...pageMetadata("/terms", "Website Terms and Information", "Information about website enquiries, trial requests, schedules, and external links at Finesse BJJ Academy."), robots: { index: false, follow: true } };
export default function TermsPage() {
  return <PolicyPage title="Website Terms and Information">
    <h2>Training information</h2>
    <p>This website provides information about Finesse BJJ Academy and ways to contact the team. Class times, coach availability, and event details may change. Contact the academy to confirm arrangements before visiting.</p>
    <h2>Requests and confirmations</h2>
    <p>Submitting a trial form requests a session. An automated email acknowledges your request; the academy will confirm availability and any preparation you need. A team support response helps coordinate attendance and does not purchase an event ticket or register an athlete.</p>
    <h2>Membership and participation</h2>
    <p>Membership, payment, cancellation, safety, and participation arrangements are handled separately with the academy. Website forms do not replace the academy’s enrolment documents or participation requirements. Ask the team about these before training.</p>
    <h2>Third-party services</h2>
    <p>Merchandise stores, event organizers, and social platforms operate independently. Check their current prices, registration details, and terms directly. Contact the academy if a link appears incorrect.</p>
    <h2>Contact</h2>
    <p>Finesse BJJ Academy, {CONTACT.address}. Email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or call <a href="tel:+13464182999">{CONTACT.phone}</a>. Read our <Link href="/privacy">website privacy notice</Link> for information about forms and analytics.</p>
  </PolicyPage>;
}
