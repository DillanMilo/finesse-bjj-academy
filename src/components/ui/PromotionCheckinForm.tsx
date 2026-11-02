"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import HoneypotField from "@/components/ui/HoneypotField";
import { Celebration, ChoiceCard, NextButton, StepShell, stepInputClass } from "@/components/ui/StepForm";
import { motion } from "framer-motion";
import { FormEvent, ReactNode, useState } from "react";
import { FORM_FAILURE_MESSAGE, HONEYPOT_FIELD, type FormStatus } from "@/lib/contact-form";
import { BELTS } from "@/lib/promotions";
import { isPhoneOrEmail, sendSheetForm, type SheetEvent } from "@/lib/sheet-forms";
import { useFormStartedAt } from "@/lib/use-contact-form";
// FIN-SHEETS-1102: headings and helper text are placeholders for Quill to approve.
// One question per screen; the "which promotion" step is skipped when only one is scheduled.
type Attending = "yes" | "no";
type Belt = (typeof BELTS)[number];
type Step = "attending" | "event" | "belt" | "details";
// Belt color, and the color of the rank bar at its tip (black belts have a red bar).
const BELT_STYLE: Record<Belt, [belt: string, bar: string]> = {
  White: ["#f4f4f5", "#111111"], Grey: ["#8a8f98", "#111111"], Yellow: ["#f5c518", "#111111"], Orange: ["#f07a1a", "#111111"], Green: ["#2f9e44", "#111111"],
  Blue: ["#1f5fbf", "#111111"], Purple: ["#6b2fa3", "#111111"], Brown: ["#6b4226", "#111111"], Black: ["#111111", "#CC1122"],
};
const BELT_GROUPS: [string, Belt[]][] = [["Everyone starts here", ["White"]], ["Kids", ["Grey", "Yellow", "Orange", "Green"]], ["Teens & adults", ["Blue", "Purple", "Brown", "Black"]]];
function stepsFor(eventCount: number): Step[] {
  return ["attending", ...(eventCount > 1 ? ["event" as const] : []), "belt", "details"];
}
export default function PromotionCheckinForm({ events, onSent }: { events: SheetEvent[]; onSent?: (slug: string) => void }) {
  const [step, setStep] = useState<Step>("attending");
  const [attending, setAttending] = useState<Attending | null>(null);
  const [eventSlug, setEventSlug] = useState(events.length === 1 ? events[0].slug : "");
  const [belt, setBelt] = useState<Belt | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  // Restarts the timer each time the form is shown again ("sign up someone else").
  const startedAt = useFormStartedAt(status !== "sent");
  const event = events.find(item => item.slug === eventSlug);
  const steps = stepsFor(events.length);
  const index = steps.indexOf(step);
  const goNext = () => setStep(steps[index + 1]);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!attending || !event || !belt) return;
    if (!isPhoneOrEmail(contact.trim())) { setContactError(true); return; }
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    const result = await sendSheetForm("/api/promotion-checkin", { name, contact: contact.trim(), event: event.slug, belt, attending, startedAt: startedAt.current, [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? "") });
    if (result === "sent") onSent?.(event.slug);
    setStatus(result);
  }
  function startAgain() {
    setStep("attending"); setAttending(null); setBelt(null); setName(""); setContact(""); setStatus("idle");
    if (events.length > 1) setEventSlug("");
  }
  if (events.length === 0) return <Card><p className="border-l-2 border-white pl-5 text-white/90">No promotions are scheduled right now. Your coach will let you know when the next one is.</p></Card>;
  if (status === "sent" && attending && event && belt) {
    const coming = attending === "yes";
    return <Card><Celebration
      title={coming ? "SEE YOU ON THE MAT." : "THANKS FOR LETTING US KNOW."}
      message={coming ? "You’re checked in. The coaches can see it now. Get some rest, bring your gi and your family." : "The coaches can see you can’t make it. Keep training. There’s always a next one."}
      event={coming ? event : undefined} calendarDetails="Belt promotion at Finesse BJJ Academy."
      summary={[["Promotion", event.name], ["Date", [event.date, event.time].filter(Boolean).join(" · ")], ["Current belt", belt], ["Attending", coming ? "Yes" : "No"]]}
      onAgain={startAgain} againLabel="CHECK IN SOMEONE ELSE" /></Card>;
  }
  const screens: Record<Step, { title: string; hint?: string; body: ReactNode }> = {
    attending: { title: "WILL YOU BE THERE?", hint: events.length === 1 ? [events[0].name, events[0].date, events[0].time].filter(Boolean).join(" · ") : undefined, body:
      <div className="grid sm:grid-cols-2 gap-4">
        <ChoiceCard selected={attending === "yes"} onClick={() => { setAttending("yes"); goNext(); }} title="I’LL BE THERE" sub="Save me a spot on the mat." />
        <ChoiceCard selected={attending === "no"} onClick={() => { setAttending("no"); goNext(); }} title="I CAN’T MAKE IT" sub="Let the coaches know." />
      </div> },
    event: { title: "WHICH PROMOTION?", body:
      <div className="grid gap-3">{events.map(item => <ChoiceCard key={item.slug} selected={eventSlug === item.slug} onClick={() => { setEventSlug(item.slug); goNext(); }} title={item.name} sub={[item.date, item.time].filter(Boolean).join(" · ")} />)}</div> },
    belt: { title: "WHAT BELT ARE YOU WEARING?", hint: "Your belt right now, before the promotion.", body:
      <div className="grid gap-5">{BELT_GROUPS.map(([group, belts]) => <div key={group}><p className="text-xs font-bold tracking-[.2em] mb-2">{group.toUpperCase()}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{belts.map(item => <BeltButton key={item} belt={item} selected={belt === item} onClick={() => { setBelt(item); goNext(); }} />)}</div></div>)}</div> },
    details: { title: "LAST THING: WHO ARE YOU?", hint: "Phone or email, whichever you check most.", body: <>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm">Your name<input value={name} onChange={e => setName(e.target.value)} type="text" required maxLength={100} autoComplete="name" className={`${stepInputClass} mt-2`} /></label>
        <label className="block text-sm">Phone or email<input value={contact} onChange={e => { setContact(e.target.value); setContactError(false); }} type="text" required maxLength={254} autoComplete="email" aria-invalid={contactError} aria-describedby={contactError ? "promotion-contact-error" : undefined} className={`${stepInputClass} mt-2`} /></label>
      </div>
      {contactError && <p id="promotion-contact-error" role="alert" className="mt-3 text-sm font-bold">Please enter a phone number or an email address.</p>}
      <div className="mt-5"><NextButton type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING…" : <>CHECK IN <ArrowIcon direction="right" /></>}</NextButton></div>
      {status === "failed" && <p role="status" className="mt-4 border-l-2 border-white pl-4 text-sm">{FORM_FAILURE_MESSAGE}</p>}</> },
  };
  const screen = screens[step];
  return <Card>
    <form onSubmit={handleSubmit} className="relative"><HoneypotField />
      <StepShell stepKey={step} index={index} total={steps.length} title={screen.title} hint={screen.hint} onBack={index > 0 ? () => setStep(steps[index - 1]) : undefined}>{screen.body}</StepShell>
    </form>
  </Card>;
}
/** A tappable belt: the belt's color with the rank bar at its tip. */
function BeltButton({ belt, selected, onClick }: { belt: Belt; selected: boolean; onClick: () => void }) {
  const [color, bar] = BELT_STYLE[belt];
  return <motion.button type="button" aria-pressed={selected} onClick={onClick} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
    className={`p-3 border-2 text-left transition-colors ${selected ? "bg-black border-black" : "border-white/45 hover:border-white hover:bg-white/10"}`}>
    <span aria-hidden="true" className="flex h-7 shadow-[0_2px_0_rgba(0,0,0,.35)]" style={{ background: color }}><span className="ml-auto mr-3 w-1/4" style={{ background: bar }} /></span>
    <span className="block mt-2 font-headline text-2xl leading-none">{belt.toUpperCase()}</span>
  </motion.button>;
}
function Card({ children }: { children: ReactNode }) {
  return <div className="bg-[#CC1122] text-white p-7 md:p-10"><p className="text-xs font-bold tracking-[.2em] mb-6">PROMOTION CHECK-IN</p>{children}</div>;
}
