import { CONTACT } from "@/lib/constants";

export type FormStatus = "idle" | "sending" | "sent" | "failed";

export const HONEYPOT_FIELD = "website";

export const FORM_FAILURE_MESSAGE = `Something went wrong. Please call ${CONTACT.phone} or email ${CONTACT.email}.`;

export interface ContactFormPayload {
  kind: "trial" | "enquiry";
  name: string;
  email: string;
  phone?: string;
  experience?: string;
  message?: string;
  trialClass?: string;
  source: string;
  [HONEYPOT_FIELD]?: string;
}

/** Posts a form to /api/contact. Resolves true only when the server confirms the email was handled. */
export async function sendContactForm(payload: ContactFormPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
