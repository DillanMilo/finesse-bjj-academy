// Blog posts for /news and the homepage Latest News section. Newest first.
// Body blocks: plain paragraphs, "## " headings, and "- " bullet lists (one item per line).

export interface Post {
  slug: string;
  title: string;
  category: "Kids" | "Adult";
  excerpt: string;
  /** ISO date, used for display and structured data. */
  date: string;
  readMinutes: number;
  image: string;
  imageAlt: string;
  body: string[];
}

export const posts: Post[] = [
  {
    slug: "what-your-child-learns-on-the-mat",
    title: "More Than Takedowns: What Your Child Really Learns on the Mat",
    category: "Kids",
    excerpt:
      "Confidence they earn, respect they practice, and focus that follows them to school. Here's what kids' jiu-jitsu at Finesse is really building.",
    date: "2026-10-29",
    readMinutes: 5,
    image: "/photos/kids-coaching-1427.webp",
    imageAlt: "A Finesse coach guiding a young student through a technique on the mat",
    body: [
      "Most kids walk into their first jiu-jitsu class a little unsure. They stay close to Mom or Dad, watch the older kids warm up, and wonder what they've gotten themselves into. A few weeks later the same kid is bowing onto the mat, shaking hands with a partner, and asking when the next class is.",
      "That change doesn't come from learning a cool move. It comes from what happens around the moves, every single class.",
      "## Confidence they earn, not confidence they're handed",
      "In Brazilian Jiu-Jitsu, nobody gets a trophy for showing up. Kids learn a technique, drill it with a partner, then try it against someone who is trying it right back. Sometimes it works. Often it doesn't, at first.",
      "That's the point. When a child finally escapes a position they've been stuck in for weeks, they know they did it. Nobody gave it to them. That kind of confidence holds up at school, on the field, and anywhere else they're asked to try something hard.",
      "## Respect is built into every round",
      "Every round at Finesse starts with a handshake and ends with one. Partners take turns. When someone taps, you let go right away, because your partner just trusted you with their safety.",
      "Kids learn quickly that the mat only works when everyone looks out for each other. They pick up the habits of good training partners: listening when a coach is talking, helping a newer student, and winning or losing with the same good attitude.",
      "## Focus that follows them home",
      "A jiu-jitsu class asks kids to listen to a set of steps, remember them, and put them together while someone is moving against them. It's problem-solving with their whole body, and it rewards kids who slow down and pay attention.",
      "Parents often tell us that the patience their child practices on the mat starts showing up at the kitchen table during homework, too.",
      "## A calm answer to conflict",
      "Jiu-jitsu is about control, not striking. Kids learn to stay calm when someone is pushing on them, keep their space, and get to a safe position without hurting anyone.",
      "That matters if a child ever faces a bully. A kid who knows they can handle themselves rarely needs to prove it. They stand taller, speak up sooner, and walk away from trouble with confidence instead of fear.",
      "## Iron sharpens iron",
      "\"As iron sharpens iron, so one person sharpens another.\" Proverbs 27:17 sums up our kids' program better than anything we could write. Every partner your child trains with makes them a little better, and they do the same for someone else.",
      "Over time, your child stops seeing the other kids as competition and starts seeing them as teammates. That's the culture we work hard to build at Finesse.",
      "## What the first class looks like",
      "Our beginner-friendly kids' classes for ages 8 to 14 run Monday and Friday in the Gi and Wednesday in NoGi at 5:30 PM. We also run Tiny Dragons for ages 4 to 5 and a class for ages 6 to 7. Your child will warm up with the group, learn a simple technique with a coach close by, and practice it with a partner at a safe pace.",
      "Here's what to bring:",
      "- A water bottle\n- Comfortable athletic clothes with no zippers or pockets\n- Sandals or slides for walking off the mat\n- Trimmed fingernails and toenails\n- Long hair tied back",
      "No experience needed. Just bring your child, a good attitude, and plenty of energy. We'll take care of the rest.",
    ],
  },
  {
    slug: "first-adult-bjj-class",
    title: "Never Trained Before? What Your First Adult BJJ Class Actually Looks Like",
    category: "Adult",
    excerpt:
      "Not in shape yet? Never thrown a punch? Good. Here's exactly what happens in your first adult Brazilian Jiu-Jitsu class at Finesse, and why you'll be fine.",
    date: "2026-10-29",
    readMinutes: 6,
    image: "/photos/adult-1414.webp",
    imageAlt: "Adult students training Brazilian Jiu-Jitsu at Finesse BJJ Academy in Spring, Texas",
    body: [
      "Walking into a jiu-jitsu gym for the first time can feel like walking into someone else's family dinner. Everyone seems to know each other, the warm-up looks complicated, and you're not sure where to stand.",
      "Every person on the mat at Finesse, including our black belts, had a first class just like yours. Here's what to expect, so the only surprise is how much fun it is.",
      "## \"I need to get in shape first\"",
      "This is the most common reason adults put off starting, and it's backwards. You don't get in shape to train jiu-jitsu. Jiu-jitsu gets you in shape.",
      "Our all-levels classes are built for every fitness level. Our coaches would much rather you take a breather than push through something that doesn't feel right. Your first goal is simply to show up, learn, and come back.",
      "## How a class runs",
      "Most adult classes at Finesse follow the same rhythm:",
      "- Warm-up: movement drills that teach you how to move on the ground, like shrimping, bridging, and rolling\n- Technique: a coach demonstrates a move step by step, usually two or three connected moves\n- Drilling: you practice those moves with a partner who lets you work at your own pace\n- Live rounds: timed rounds of sparring, called rolling, often starting from a specific position",
      "On your first day, live rounds are completely optional. Plenty of new students watch, or roll lightly with a coach or an experienced partner who keeps it calm and helpful. You will never be thrown in with someone looking to prove a point.",
      "## Tapping is how you learn",
      "When you're caught in a submission, you tap your partner or the mat, and they let go immediately. No shame, no ego. Everyone taps, every day, from white belt to black belt.",
      "Tapping is what lets us train hard and still go to work the next morning. It's also the fastest way to learn, because every tap shows you something to fix.",
      "## Gi or NoGi?",
      "Gi classes use the traditional uniform, and the grips on the jacket and pants add a layer of strategy. NoGi is trained in a rash guard and shorts and moves a little faster. Both are great places to start, and we run all-levels classes in each throughout the week.",
      "## What to bring",
      "- A water bottle\n- A towel\n- Athletic shorts or sweatpants with no zippers or pockets, plus a T-shirt or rash guard\n- Sandals or slides for walking off the mat\n- Trimmed nails and long hair tied back\n- A mouthguard if you have one",
      "Try to arrive 10 to 15 minutes early so we can say hello, show you around, and get you settled before class starts.",
      "## The people are the best part",
      "The hardest part of jiu-jitsu is walking through the door. After that, you'll find a room full of teachers, nurses, engineers, parents, and students who all started exactly where you are. Your training partners become the people who push you, look out for you, and celebrate every stripe with you.",
      "## Ready for your first class?",
      "We run all-levels adult classes early in the morning, mid-morning, and in the evening, so there's a time that fits around work and family. Our academy is at 17711 Kuykendahl Rd in Spring, Texas.",
      "Book your free trial, pick a class, and bring your water bottle, your towel, and your energy. We'll see you on the mat.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function formatPostDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
