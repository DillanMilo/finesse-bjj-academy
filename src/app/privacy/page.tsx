import PolicyPage from "@/components/ui/PolicyPage";
import { CONTACT } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
export const metadata = { ...pageMetadata("/privacy", "Website Privacy Notice", "How the Finesse BJJ website handles enquiries, essential storage, and optional analytics."), robots: { index: false, follow: true } };
export default function PrivacyPage() {
  return <PolicyPage title="Website Privacy Notice">
    <p>This notice describes the Finesse BJJ Academy website. For privacy questions, contact <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
    <h2>Information you send us</h2>
    <p>Enquiry, trial, and team support forms send the details you enter to the academy so we can respond, arrange a trial, or coordinate an event. Depending on the form, this includes your name, email, optional phone number, training preferences, message, or guest count. Please do not include sensitive health information or payment details. A parent or guardian should contact us on behalf of a child.</p>
    <h2>Website services and essential storage</h2>
    <p>Vercel hosts this website. Resend processes form notification and confirmation emails. Cloudflare Turnstile helps prevent spam. Upstash stores rate limits and a hashed email identifier to prevent duplicate free trial requests for up to one year. These services may process technical information such as IP addresses and browser details. Our email provider handles messages received by the academy.</p>
    <p>Your browser remembers whether you have requested a trial, whether you have seen the trial prompt during this visit, and your analytics preference. This helps avoid repeated prompts and respects your cookie choice. Browser storage controls can remove these preferences.</p>
    <h2>Optional analytics</h2>
    <p>If you allow analytics, Google Analytics uses cookies and visit information to help us understand page visits and actions such as successful training enquiries, trial requests, team support responses, and phone or email link clicks. Our custom events send categories of actions; they do not include the names, email addresses, phone numbers, or messages entered into our forms. Advertising storage and advertising personalization are disabled in this website integration.</p>
    <p>You can allow or decline analytics and change your choice using Cookie preferences in the footer. Declining analytics does not prevent you from using the forms. See <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses information from partner sites</a>.</p>
    <h2>External websites</h2>
    <p>Social media, merchandise, maps, and event links open services operated by other organizations. Their own privacy notices apply when you use them.</p>
    <h2>Questions and requests</h2>
    <p>Contact <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> to ask about information you submitted or request a correction or deletion. This notice covers the website; ask the academy about separate membership, payment, or training records.</p>
  </PolicyPage>;
}
