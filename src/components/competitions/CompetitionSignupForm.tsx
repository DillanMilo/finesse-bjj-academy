"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import HoneypotField from "@/components/ui/HoneypotField";
import { Celebration, ChoiceCard, NextButton, StepShell, stepInputClass } from "@/components/ui/StepForm";
import { FormEvent, ReactNode, useState } from "react";
import { FORM_FAILURE_MESSAGE, HONEYPOT_FIELD, type FormStatus } from "@/lib/contact-form";
import { isPhoneOrEmail, sendSheetForm, type SheetEvent } from "@/lib/sheet-forms";
import { useFormStartedAt } from "@/lib/use-contact-form";
// FIN-SHEETS-1102: headings and helper text are placeholders for Quill to approve.
// One question per screen. Used on /competitions/sign-up (every upcoming competition) and on each
// competition's page (just that one, so the "which competition" step is skipped).
type Role = "competing" | "supporting";
type Step = "role" | "event" | "guests" | "details";
const MAX_GUESTS = 10;
function stepsFor(role: Role | null, eventCount: number): Step[] {
  return ["role", ...(eventCount > 1 ? ["event" as const] : []), ...(role === "supporting" ? ["guests" as const] : []), "details"];
}
export default function CompetitionSignupForm({ events }: { events: SheetEvent[] }) {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [eventSlug, setEventSlug] = useState(events.length === 1 ? events[0].slug : "");
  const [guests, setGuests] = useState(0);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  // Restarts the timer each time the form is shown again ("sign up someone else").
  const startedAt = useFormStartedAt(status !== "sent");
  const event = events.find(item => item.slug === eventSlug);
  const steps = stepsFor(role, events.length);
  const index = steps.indexOf(step);
  function goNext(nextRole = role) {
    const order = stepsFor(nextRole, events.length);
    setStep(order[order.indexOf(step) + 1]);
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!role || !event) return;
    if (!isPhoneOrEmail(contact.trim())) { setContactError(true); return; }
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    setStatus(await sendSheetForm("/api/competition-signup", { name, contact: contact.trim(), event: event.slug, role, guests: String(role === "supporting" ? guests : 0), startedAt: startedAt.current, [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? "") }));
  }
  function startAgain() {
    setStep("role"); setRole(null); setGuests(0); setName(""); setContact(""); setStatus("idle");
    if (events.length > 1) setEventSlug("");
  }
  if (events.length === 0) return <Card><p className="border-l-2 border-white pl-5 text-white/90">No upcoming competitions are listed right now. Ask your coach which competition the team is targeting next.</p></Card>;
  if (status === "sent" && role && event) {
    const competing = role === "competing";
    return <Card><Celebration
      title={competing ? "YOU’RE ON THE LIST." : "YOU’RE IN OUR CORNER."}
      message={competing ? "The coaches can see your sign-up now. Make sure you’re registered with the organizer too. Let’s get you ready." : "The coaches can see you’re coming. We’ll share the team meetup time and spot before the event. Wear your Finesse colors!"}
      event={event} calendarDetails={competing ? "Competing with Finesse BJJ." : "Cheering on the Finesse BJJ team."}
      summary={[["Competition", event.name], ["Date", event.date], [competing ? "You’re" : "Your crew", competing ? "Competing" : guests ? `You + ${guests}` : "Just you"], ["Name", name]]}
      onAgain={startAgain} againLabel="SIGN UP SOMEONE ELSE" /></Card>;
  }
  const back = index > 0 ? () => setStep(steps[index - 1]) : undefined;
  const screens: Record<Step, { title: string; hint?: string; body: ReactNode }> = {
    role: { title: "COMPETING OR CHEERING?", hint: events.length === 1 ? `${events[0].name} · ${events[0].date}` : "Either way, you’re with the team.", body:
      <div className="grid sm:grid-cols-2 gap-4">
        <ChoiceCard selected={role === "competing"} onClick={() => { setRole("competing"); goNext("competing"); }} title="I’M COMPETING" sub="Put me on the team list." />
        <ChoiceCard selected={role === "supporting"} onClick={() => { setRole("supporting"); goNext("supporting"); }} title="I’M CHEERING" sub="Count me in the stands." />
      </div> },
    event: { title: "WHICH COMPETITION?", body:
      <div className="grid gap-3">{events.map(item => <ChoiceCard key={item.slug} selected={eventSlug === item.slug} onClick={() => { setEventSlug(item.slug); goNext(); }} title={item.name} sub={[item.date, item.location].filter(Boolean).join(" · ")} />)}</div> },
    guests: { title: "WHO’S COMING WITH YOU?", hint: "Family and friends are welcome. The louder the better.", body: <>
      <div className="flex items-center justify-between gap-4 border-2 border-white/45 p-4">
        <button type="button" onClick={() => setGuests(n => Math.max(0, n - 1))} disabled={guests === 0} aria-label="One fewer guest" className="h-14 w-14 shrink-0 bg-black font-headline text-4xl disabled:opacity-40">−</button>
        <p className="text-center" aria-live="polite"><span className="block font-headline text-5xl leading-none">{guests === 0 ? "JUST ME" : `ME + ${guests}`}</span><span className="text-sm text-white/85">{guests === 0 ? "No guests" : `${guests} guest${guests === 1 ? "" : "s"}`}</span></p>
        <button type="button" onClick={() => setGuests(n => Math.min(MAX_GUESTS, n + 1))} disabled={guests === MAX_GUESTS} aria-label="One more guest" className="h-14 w-14 shrink-0 bg-black font-headline text-4xl disabled:opacity-40">+</button>
      </div>
      <div className="mt-5"><NextButton onClick={() => goNext()}>NEXT <ArrowIcon direction="right" /></NextButton></div></> },
    details: { title: "LAST THING: WHO ARE YOU?", hint: "So the coaches know who’s in. Phone or email, whichever you check most.", body: <>
      {role === "competing" && event && <div className="mb-5 border-l-2 border-white pl-4 text-sm text-white/90"><p className="font-bold">This tells the team you’re in. You still register with the organizer.</p>{event.registrationNote && <p className="mt-1">{event.registrationNote}</p>}{event.registerUrl && <a href={event.registerUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block underline underline-offset-4 font-bold">Register with the organizer <ArrowIcon /></a>}</div>}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm">Your name<input value={name} onChange={e => setName(e.target.value)} type="text" required maxLength={100} autoComplete="name" className={`${stepInputClass} mt-2`} /></label>
        <label className="block text-sm">Phone or email<input value={contact} onChange={e => { setContact(e.target.value); setContactError(false); }} type="text" required maxLength={254} autoComplete="email" aria-invalid={contactError} aria-describedby={contactError ? "competition-contact-error" : undefined} className={`${stepInputClass} mt-2`} /></label>
      </div>
      {contactError && <p id="competition-contact-error" role="alert" className="mt-3 text-sm font-bold">Please enter a phone number or an email address.</p>}
      <div className="mt-5"><NextButton type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING…" : <>COUNT ME IN <ArrowIcon direction="right" /></>}</NextButton></div>
      {status === "failed" && <p role="status" className="mt-4 border-l-2 border-white pl-4 text-sm">{FORM_FAILURE_MESSAGE}</p>}</> },
  };
  const screen = screens[step];
  return <Card>
    <form onSubmit={handleSubmit} className="relative"><HoneypotField />
      <StepShell stepKey={step} index={index} total={steps.length} title={screen.title} hint={screen.hint} onBack={back}>{screen.body}</StepShell>
    </form>
  </Card>;
}
function Card({ children }: { children: ReactNode }) {
  return <div className="bg-[#CC1122] text-white p-7 md:p-10"><p className="text-xs font-bold tracking-[.2em] mb-6">EVERY TEAMMATE COUNTS</p>{children}</div>;
}
