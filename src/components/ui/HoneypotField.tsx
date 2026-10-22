import { HONEYPOT_FIELD } from "@/lib/contact-form";

/** Spam trap: hidden from people and screen readers, but bots tend to fill it in. */
export default function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
