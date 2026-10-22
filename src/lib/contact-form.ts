import { CONTACT } from "@/lib/constants";

export type FormStatus = "idle" | "sending" | "sent" | "failed";

export const HONEYPOT_FIELD = "website";

export const FORM_FAILURE_MESSAGE = `Something went wrong. Please call ${CONTACT.phone} or email ${CONTACT.email}.`;

export const TRIAL_ALREADY_REQUESTED_MESSAGE = `We already have your free trial request. To change it or follow up, call us at ${CONTACT.phone}.`;

const TRIAL_REQUESTED_KEY = "finesse-trial-requested";
export const TRIAL_REQUESTED_EVENT = "finesse-trial-requested";

export interface ContactFormPayload {
  kind: "trial" | "enquiry";
  name: string;
  email: string;
  phone?: string;
  experience?: string;
  message?: string;
  trialClass?: string;
  source: string;
  /** Date.now() when the form mounted; the server rejects sends that come too fast. */
  startedAt: number;
  [HONEYPOT_FIELD]?: string;
}

/** True once this browser has successfully sent a free trial request. */
export function hasRequestedTrial(): boolean {
  try {
    return Boolean(localStorage.getItem(TRIAL_REQUESTED_KEY));
  } catch {
    return false;
  }
}

function markTrialRequested() {
  try {
    localStorage.setItem(TRIAL_REQUESTED_KEY, new Date().toISOString());
    window.dispatchEvent(new Event(TRIAL_REQUESTED_EVENT));
  } catch {
    // Storage disabled: the trial forms simply stay available.
  }
}

/** Posts a form to /api/contact. Resolves true only when the server confirms the email was handled. */
export async function sendContactForm(payload: ContactFormPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok && payload.kind === "trial") markTrialRequested();
    return res.ok;
  } catch {
    return false;
  }
}
