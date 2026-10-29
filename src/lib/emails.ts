import { CONTACT } from "@/lib/constants";

// Confirmation emails sent to visitors by /api/contact. Table layout and inline styles so they
// render the same in Gmail, Outlook and Apple Mail. Every visitor value passes through escapeHtml.

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const RED = "#CC1122";
const HEADLINE = "font-family:Impact,'Arial Narrow Bold','Helvetica Neue',Arial,sans-serif;font-style:italic;letter-spacing:-0.5px;";
const BODY = "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;";
const MAPS_URL = `https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}`;

export const TRIAL_CHECKLIST = [
  ["Water bottle", "You'll want it. Stay hydrated."],
  ["Towel", "For the sweat that's coming."],
  ["Comfortable athletic clothes", "Shorts or sweatpants and a T-shirt or rash guard, with no zippers or pockets."],
  ["Sandals or slides", "For walking off the mat. Shoes never go on it."],
  ["Trimmed nails & hair tied back", "Keeps you and your partners safe."],
  ["Mouthguard (optional)", "Bring one if you have it."],
  ["Your energy", "The most important thing on the list. Bring all of it."],
] as const;

export function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** First word of the visitor's name, kept short so the greeting can't carry a message of its own. */
export function greetingName(name: string) {
  const first = name.split(" ")[0].slice(0, 30);
  return /^[\p{L}\p{M}'’-]+$/u.test(first) ? first : "";
}

const DEFAULT_NOTE = "Questions or need to change something? Just reply to this email.";

/** `team` emails go to the academy inbox, so they skip the address block meant for visitors. */
function layout({ preheader, eyebrow, title, intro, content, note = DEFAULT_NOTE, team = false }: { preheader: string; eyebrow: string; title: string; intro: string; content: string; note?: string; team?: boolean }) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>${title.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}</title></head>
<body style="margin:0;padding:0;background:#0A0A0A;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#141012;border:1px solid #2a2023;">
<tr><td style="height:4px;background:${RED};font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:28px 32px 0;${HEADLINE}font-size:22px;color:#ffffff;">FINESSE <span style="color:${RED};">BJJ</span> ACADEMY</td></tr>
<tr><td style="padding:36px 32px 0;${BODY}font-size:11px;font-weight:700;letter-spacing:3px;color:${RED};">${eyebrow}</td></tr>
<tr><td style="padding:10px 32px 0;${HEADLINE}font-size:44px;line-height:46px;color:#ffffff;">${title}</td></tr>
<tr><td style="padding:18px 32px 0;${BODY}font-size:16px;line-height:25px;color:#d4d4d8;">${intro}</td></tr>
${content}
${team ? "" : `<tr><td style="padding:36px 32px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2a2023;"><tr><td style="padding-top:22px;${BODY}font-size:14px;line-height:22px;color:#a1a1aa;">
<strong style="color:#ffffff;">Finesse BJJ Academy</strong><br>
<a href="${MAPS_URL}" style="color:#a1a1aa;text-decoration:underline;">${CONTACT.address}</a><br>
<a href="tel:${CONTACT.phone.replace(/[^\d+]/g, "")}" style="color:#a1a1aa;text-decoration:none;">${CONTACT.phone}</a> · <a href="mailto:${CONTACT.email}" style="color:#a1a1aa;text-decoration:none;">${CONTACT.email}</a>
</td></tr></table></td></tr>`}
<tr><td style="padding:${team ? 30 : 22}px 32px 30px;${BODY}font-size:12px;line-height:18px;color:#71717a;">${note}</td></tr>
</table></td></tr></table></body></html>`;
}

function detailRow(label: string, value: string) {
  return `<tr><td style="padding:22px 32px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1A1014;border-left:3px solid ${RED};"><tr><td style="padding:16px 20px;">
<div style="${BODY}font-size:11px;font-weight:700;letter-spacing:2px;color:#E6BDB9;">${label}</div>
<div style="${HEADLINE}font-size:24px;line-height:28px;color:#ffffff;padding-top:4px;">${value}</div>
</td></tr></table></td></tr>`;
}

export function trialConfirmationEmail({ name, trialClass }: { name: string; trialClass: string }): EmailContent {
  const first = greetingName(name);
  const hello = first ? `${escapeHtml(first)}, you` : "You";
  const checklist = TRIAL_CHECKLIST.map(([item, note], i) => {
    const last = i === TRIAL_CHECKLIST.length - 1;
    return `<tr><td width="34" valign="top" style="padding:12px 0;border-bottom:1px solid #2a2023;${HEADLINE}font-size:20px;color:${RED};">${String(i + 1).padStart(2, "0")}</td><td style="padding:12px 0;border-bottom:1px solid #2a2023;${BODY}font-size:15px;line-height:22px;color:#d4d4d8;"><strong style="color:${last ? RED : "#ffffff"};">${item}</strong><br>${note}</td></tr>`;
  }).join("");
  const content = `${trialClass ? detailRow("YOUR TRIAL CLASS", escapeHtml(trialClass)) : ""}
<tr><td style="padding:22px 32px 0;${BODY}font-size:15px;line-height:24px;color:#d4d4d8;">Our team will be in touch to confirm your spot. Plan to arrive <strong style="color:#ffffff;">10 to 15 minutes early</strong> so we can say hello, show you around, and get you settled before class.</td></tr>
<tr><td style="padding:34px 32px 0;${HEADLINE}font-size:30px;color:#ffffff;">WHAT TO BRING</td></tr>
<tr><td style="padding:8px 32px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${checklist}</table></td></tr>
<tr><td style="padding:30px 32px 0;${BODY}font-size:15px;line-height:24px;color:#d4d4d8;">No experience needed. Every person on our mats, black belts included, had a first class just like yours. See you on the mat.</td></tr>`;
  const textChecklist = TRIAL_CHECKLIST.map(([item, note]) => `- ${item}: ${note}`).join("\n");
  return {
    subject: "Your free trial at Finesse BJJ: what to bring",
    html: layout({
      preheader: "Your free trial request is in. Here's what to bring to your first class.",
      eyebrow: "FREE TRIAL REQUEST RECEIVED",
      title: "WELCOME TO<br><span style=\"color:" + RED + ";\">THE MAT.</span>",
      intro: `${hello}'re in. Thanks for booking a free trial at Finesse BJJ Academy. Here's everything you need for your first class.`,
      content,
    }),
    text: `${first ? `${first}, you` : "You"}'re in. Thanks for booking a free trial at Finesse BJJ Academy.\n\n${trialClass ? `Your trial class: ${trialClass}\n\n` : ""}Our team will be in touch to confirm your spot. Plan to arrive 10 to 15 minutes early.\n\nWHAT TO BRING\n${textChecklist}\n\nNo experience needed. See you on the mat.\n\nFinesse BJJ Academy\n${CONTACT.address}\n${CONTACT.phone} · ${CONTACT.email}\n\nQuestions? Just reply to this email.`,
  };
}

export function supportConfirmationEmail({ name, event, date, location, guests }: { name: string; event: string; date: string; location: string; guests: number }): EmailContent {
  const first = greetingName(name);
  const party = guests > 0 ? `You + ${guests} guest${guests === 1 ? "" : "s"}` : "Just you";
  const content = `${detailRow("THE EVENT", `${escapeHtml(event)}<br><span style="${BODY}font-style:normal;font-size:15px;color:#d4d4d8;">${escapeHtml(date)} · ${escapeHtml(location)}</span>`)}
${detailRow("YOUR CREW", party)}
<tr><td style="padding:26px 32px 0;${BODY}font-size:15px;line-height:24px;color:#d4d4d8;">We'll share the team meetup time and spot before the event. Bring your voice, wear your Finesse colors, and stay for as many matches as you can. Our athletes hear every cheer.</td></tr>`;
  return {
    subject: `You're in our corner: ${event}`,
    html: layout({
      preheader: `Thanks for coming to support the team at ${event}.`,
      eyebrow: "TEAM SUPPORT CONFIRMED",
      title: "YOU'RE IN<br><span style=\"color:" + RED + ";\">OUR CORNER.</span>",
      intro: `${first ? `${escapeHtml(first)}, thank` : "Thank"} you for coming out to support the Finesse team. Every voice in the stands counts.`,
      content,
    }),
    text: `${first ? `${first}, thank` : "Thank"} you for coming out to support the Finesse team.\n\nThe event: ${event}\n${date} · ${location}\nYour crew: ${party}\n\nWe'll share the team meetup time and spot before the event. Bring your voice and wear your Finesse colors.\n\nFinesse BJJ Academy\n${CONTACT.address}\n${CONTACT.phone} · ${CONTACT.email}\n\nQuestions? Just reply to this email.`,
  };
}

export type NotificationKind = "trial" | "support" | "enquiry";

const NOTIFICATION_COPY: Record<NotificationKind, { eyebrow: string; intro: (first: string) => string }> = {
  trial: { eyebrow: "NEW FREE TRIAL REQUEST", intro: (first) => `${first} just booked a free trial on the website. Reach out to confirm their spot. They've already been emailed what to bring.` },
  support: { eyebrow: "NEW TEAM SUPPORTER", intro: (first) => `${first} is coming out to support the team. They've been emailed a confirmation and are waiting on meetup details.` },
  enquiry: { eyebrow: "NEW WEBSITE ENQUIRY", intro: (first) => `${first} sent a message through the website.` },
};

function button(href: string, label: string, primary: boolean) {
  return `<td style="padding:0 10px 10px 0;"><a href="${href}" style="display:inline-block;padding:13px 22px;${HEADLINE}font-size:17px;letter-spacing:0.5px;text-decoration:none;color:#ffffff;background:${primary ? RED : "transparent"};border:2px solid ${RED};">${label}</a></td>`;
}

/**
 * The email the academy gets for every website form. Every visitor value passes through escapeHtml.
 * `highlight` is the one thing to act on (trial class, event); `details` are the rest of the fields.
 */
export function academyNotificationEmail({ kind, subject, name, email, phone, highlight, details, message, source }: { kind: NotificationKind; subject: string; name: string; email: string; phone: string; highlight?: [string, string]; details: [string, string][]; message: string; source: string }): EmailContent {
  const copy = NOTIFICATION_COPY[kind];
  const first = escapeHtml(name.split(" ")[0]);
  const tel = phone.replace(/[^\d+]/g, "");
  const contactRows: [string, string][] = [
    ["EMAIL", `<a href="mailto:${escapeHtml(email)}" style="color:#ffffff;text-decoration:underline;">${escapeHtml(email)}</a>`],
    ...(phone ? [["PHONE", tel ? `<a href="tel:${tel}" style="color:#ffffff;text-decoration:none;">${escapeHtml(phone)}</a>` : escapeHtml(phone)] as [string, string]] : []),
    ...details.map(([label, value]) => [label.toUpperCase(), escapeHtml(value)] as [string, string]),
  ];
  const table = contactRows.map(([label, value]) => `<tr><td width="110" valign="top" style="padding:11px 0;border-bottom:1px solid #2a2023;${BODY}font-size:11px;font-weight:700;letter-spacing:2px;color:#E6BDB9;">${label}</td><td style="padding:11px 0;border-bottom:1px solid #2a2023;${BODY}font-size:15px;line-height:22px;color:#ffffff;">${value}</td></tr>`).join("");
  const content = `${highlight ? detailRow(highlight[0], escapeHtml(highlight[1])) : ""}
<tr><td style="padding:22px 32px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table}</table></td></tr>
${message ? `<tr><td style="padding:24px 32px 0;"><div style="${BODY}font-size:11px;font-weight:700;letter-spacing:2px;color:#E6BDB9;padding-bottom:8px;">MESSAGE</div><div style="${BODY}font-size:15px;line-height:24px;color:#d4d4d8;white-space:pre-wrap;background:#1A1014;padding:16px 20px;">${escapeHtml(message)}</div></td></tr>` : ""}
<tr><td style="padding:28px 32px 0;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>${button(`mailto:${escapeHtml(email)}`, `EMAIL ${first.toUpperCase()}`, true)}${tel ? button(`tel:${tel}`, "CALL", false) : ""}</tr></table></td></tr>`;
  const lines = [["Name", name], ["Email", email], ["Phone", phone], ...(highlight ? [highlight] : []), ...details, ["Message", message]].filter(([, value]) => value);
  return {
    subject,
    html: layout({
      preheader: escapeHtml(subject),
      eyebrow: copy.eyebrow,
      title: escapeHtml(name.toUpperCase()),
      intro: copy.intro(first),
      content,
      note: `Sent from the ${escapeHtml(source)} on the Finesse website. Hit Reply to answer ${first} directly.`,
      team: true,
    }),
    text: `${subject}\n\n${lines.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nSent from: ${source}\nReply to this email to answer ${name} directly.`,
  };
}
