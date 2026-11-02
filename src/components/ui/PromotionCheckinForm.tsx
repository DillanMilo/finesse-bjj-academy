"use client";
import ArrowIcon from "@/components/ui/ArrowIcon";
import HoneypotField from "@/components/ui/HoneypotField";
import { Celebration, ChoiceCard, NextButton, StepShell, stepInputClass } from "@/components/ui/StepForm";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, ReactNode, useState } from "react";
import { FORM_FAILURE_MESSAGE, HONEYPOT_FIELD, type FormStatus } from "@/lib/contact-form";
import { maxStripes, stripeLabel, type Belt } from "@/lib/promotions";
import { isPhoneOrEmail, sendSheetForm, type SheetEvent } from "@/lib/sheet-forms";
import { useFormStartedAt } from "@/lib/use-contact-form";
// FIN-SHEETS-1102: headings and helper text are placeholders for Quill to approve.
// One question per screen; the "which promotion" step is skipped when only one is scheduled.
type Attending = "yes" | "no";
type Step = "attending" | "event" | "belt" | "stripes" | "details";
const COLORS: Record<string, string> = {
  White: "#f4f4f5", Grey: "#8a8f98", Yellow: "#f5c518", Orange: "#f07a1a", Green: "#2f9e44",
  Blue: "#1f5fbf", Purple: "#6b2fa3", Brown: "#6b4226", Black: "#111111",
};
const ROW_OF_FOUR = "grid-cols-2 sm:grid-cols-4";
// Kids' belts start as the four solid colors. "Show all" opens the full set, three to a row,
// one color per row (with white, solid, with black).
const KIDS_SOLID: Belt[] = ["Grey", "Yellow", "Orange", "Green"];
const KIDS_ALL: Belt[] = ["Grey/White", "Grey", "Grey/Black", "Yellow/White", "Yellow", "Yellow/Black", "Orange/White", "Orange", "Orange/Black", "Green/White", "Green", "Green/Black"];
function stepsFor(eventCount: number): Step[] {
  return ["attending", ...(eventCount > 1 ? ["event" as const] : []), "belt", "stripes", "details"];
}
export default function PromotionCheckinForm({ events, onSent }: { events: SheetEvent[]; onSent?: (slug: string) => void }) {
  const [step, setStep] = useState<Step>("attending");
  const [attending, setAttending] = useState<Attending | null>(null);
  const [eventSlug, setEventSlug] = useState(events.length === 1 ? events[0].slug : "");
  const [belt, setBelt] = useState<Belt | null>(null);
  const [stripes, setStripes] = useState<number | null>(null);
  const [allKidsBelts, setAllKidsBelts] = useState(false);
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
    if (!attending || !event || !belt || stripes === null) return;
    if (!isPhoneOrEmail(contact.trim())) { setContactError(true); return; }
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    const result = await sendSheetForm("/api/promotion-checkin", { name, contact: contact.trim(), event: event.slug, belt, stripes: String(stripes), attending, startedAt: startedAt.current, [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? "") });
    if (result === "sent") onSent?.(event.slug);
    setStatus(result);
  }
  function startAgain() {
    setStep("attending"); setAttending(null); setBelt(null); setStripes(null); setAllKidsBelts(false); setName(""); setContact(""); setStatus("idle");
    if (events.length > 1) setEventSlug("");
  }
  if (events.length === 0) return <Card><p className="border-l-2 border-white pl-5 text-white/90">No promotions are scheduled right now. Your coach will let you know when the next one is.</p></Card>;
  if (status === "sent" && attending && event && belt && stripes !== null) {
    const coming = attending === "yes";
    return <Card><Celebration
      title={coming ? "SEE YOU ON THE MAT." : "THANKS FOR LETTING US KNOW."}
      message={coming ? "You’re checked in. The coaches can see it now. Get some rest, bring your gi and your family." : "The coaches can see you can’t make it. Keep training. There’s always a next one."}
      event={coming ? event : undefined} calendarNote="promotion"
      summary={[["Promotion", event.name], ["Date", [event.date, event.time].filter(Boolean).join(" · ")], ["Current belt", `${belt} · ${stripeLabel(belt, stripes).toLowerCase()}`], ["Attending", coming ? "Yes" : "No"]]}
      onAgain={startAgain} againLabel="CHECK IN SOMEONE ELSE" /></Card>;
  }
  const kidsExpanded = allKidsBelts || Boolean(belt?.includes("/"));
  const pickBelt = (item: Belt) => { if (item !== belt) setStripes(null); setBelt(item); goNext(); };
  const screens: Record<Step, { title: string; hint?: string; body: ReactNode }> = {
    attending: { title: "WILL YOU BE THERE?", hint: events.length === 1 ? [events[0].name, events[0].date, events[0].time].filter(Boolean).join(" · ") : undefined, body:
      <div className="grid sm:grid-cols-2 gap-4">
        <ChoiceCard selected={attending === "yes"} onClick={() => { setAttending("yes"); goNext(); }} title="I’LL BE THERE" sub="Save me a spot on the mat." />
        <ChoiceCard selected={attending === "no"} onClick={() => { setAttending("no"); goNext(); }} title="I CAN’T MAKE IT" sub="Let the coaches know." />
      </div> },
    event: { title: "WHICH PROMOTION?", body:
      <div className="grid gap-3">{events.map(item => <ChoiceCard key={item.slug} selected={eventSlug === item.slug} onClick={() => { setEventSlug(item.slug); goNext(); }} title={item.name} sub={[item.date, item.time].filter(Boolean).join(" · ")} />)}</div> },
    belt: { title: "WHAT BELT ARE YOU WEARING?", hint: "Your belt right now, before the promotion.", body:
      <div className="grid gap-5">
        <BeltGroup label="Everyone starts here" belts={["White"]} columns={ROW_OF_FOUR} selected={belt} onPick={pickBelt} />
        <div>
          {/* Opens by itself when coming back to a striped kids' belt, so the picked one stays in view. */}
          <BeltGroup label="Kids (under 16)" belts={kidsExpanded ? KIDS_ALL : KIDS_SOLID} columns={kidsExpanded ? "grid-cols-3" : ROW_OF_FOUR} selected={belt} onPick={pickBelt} />
          {!belt?.includes("/") && <button type="button" onClick={() => setAllKidsBelts(open => !open)} aria-expanded={kidsExpanded}
            className="mt-3 flex w-full items-center justify-center gap-2 border border-dashed border-white/50 py-2.5 text-sm font-bold tracking-[.12em] hover:border-white hover:bg-white/10">
            {kidsExpanded ? "SHOW FEWER" : "SHOW WHITE & BLACK STRIPE BELTS"}
            <motion.span animate={{ rotate: kidsExpanded ? 180 : 0 }} className="inline-flex"><ArrowIcon direction="down" className="h-3.5 w-3.5" /></motion.span>
          </button>}
        </div>
        <BeltGroup label="Teens & adults" belts={["Blue", "Purple", "Brown", "Black"]} columns={ROW_OF_FOUR} selected={belt} onPick={pickBelt} />
      </div> },
    stripes: { title: belt === "Black" ? "HOW MANY DEGREES?" : "HOW MANY STRIPES?", hint: belt ? `On your ${belt.toLowerCase()} belt right now.` : undefined, body: belt &&
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">{Array.from({ length: maxStripes(belt) + 1 }, (_, count) =>
        <motion.button key={count} type="button" aria-pressed={stripes === count} onClick={() => { setStripes(count); goNext(); }} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
          className={`flex flex-col justify-start p-3 border-2 text-left transition-colors ${stripes === count ? "bg-black border-black" : "border-white/45 hover:border-white hover:bg-white/10"}`}>
          <BeltSwatch belt={belt} stripes={count} />
          <span className="block mt-2 font-headline text-2xl leading-none">{stripeLabel(belt, count).toUpperCase()}</span>
        </motion.button>)}</div> },
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
/** A belt drawn as it looks: its color, a white or black line along the middle on kids' belts like
 * "Grey/White", and the rank bar at the tip (red on a black belt) with any stripes on it. */
function BeltSwatch({ belt, stripes = 0 }: { belt: Belt; stripes?: number }) {
  const [color, line] = belt.split("/");
  return <span aria-hidden="true" className="relative flex h-7 shadow-[0_2px_0_rgba(0,0,0,.35)]" style={{ background: COLORS[color] }}>
    {line && <span className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2" style={{ background: COLORS[line] }} />}
    <span className="relative ml-auto mr-2 sm:mr-3 flex w-1/3 min-w-fit items-stretch justify-end gap-[3px] px-1" style={{ background: belt === "Black" ? "#CC1122" : "#111111" }}>
      {Array.from({ length: stripes }, (_, n) => <span key={n} className="w-[3px] bg-white" />)}
    </span>
  </span>;
}
/** A labelled set of belts. Belts fade in and slide into place when the set changes. */
function BeltGroup({ label, belts, columns, selected, onPick }: { label: string; belts: Belt[]; columns: string; selected: Belt | null; onPick: (belt: Belt) => void }) {
  return <div><p className="text-xs font-bold tracking-[.2em] mb-2">{label.toUpperCase()}</p>
    <motion.div layout className={`grid ${columns} gap-2 sm:gap-3`}>
      <AnimatePresence initial={false}>{belts.map(item => <motion.div key={item} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid">
        <BeltButton belt={item} selected={selected === item} onClick={() => onPick(item)} />
      </motion.div>)}</AnimatePresence>
    </motion.div></div>;
}
/** A tappable belt. */
function BeltButton({ belt, selected, onClick }: { belt: Belt; selected: boolean; onClick: () => void }) {
  return <motion.button type="button" aria-pressed={selected} onClick={onClick} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
    className={`flex flex-col justify-start p-2 sm:p-3 border-2 text-left transition-colors ${selected ? "bg-black border-black" : "border-white/45 hover:border-white hover:bg-white/10"}`}>
    <BeltSwatch belt={belt} />
    <span className="block mt-2 font-headline text-xl sm:text-2xl leading-none">{belt.replace("/", " / ").toUpperCase()}</span>
  </motion.button>;
}
function Card({ children }: { children: ReactNode }) {
  return <div className="bg-[#CC1122] text-white p-7 md:p-10"><p className="text-xs font-bold tracking-[.2em] mb-6">PROMOTION CHECK-IN</p>{children}</div>;
}
