import type { Metadata } from "next";

export const SITE_URL = "https://finessebjj.com";
export const SITE_NAME = "Finesse BJJ Academy";
// Vercel previews and local builds must never become alternate search results.
export const IS_PRODUCTION = process.env.VERCEL_ENV === "production";
export const SHARE_IMAGE = { url: "/finesse-share-logo.png", width: 1200, height: 1200, alt: "Finesse BJJ Academy" };

export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url: path, type: "website", siteName: SITE_NAME, locale: "en_US", images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [SHARE_IMAGE.url] },
  };
}

export const staticPages = [
  ["/", "Brazilian Jiu-Jitsu in Spring, TX", "Adult and kids Brazilian Jiu-Jitsu, wrestling, and striking at Finesse BJJ Academy in Spring, TX. Explore the schedule and request a free trial."],
  ["/about", "About Our Academy", "Meet Finesse BJJ Academy and its coaches in Spring, TX. Learn about our training community and approach to Brazilian Jiu-Jitsu."],
  ["/schedule", "Class Schedule", "Find adult and kids BJJ, wrestling, and striking class times at Finesse BJJ Academy in Spring, TX. Request a free trial with the team."],
  ["/contact", "Contact and Directions", "Visit Finesse BJJ Academy at 18300 Strack Dr, Suite 300, Spring, TX 77379. Call (346) 418-2999 or send an enquiry about training."],
  ["/news", "Academy News and Training Guides", "Read academy updates, competition news, and Brazilian Jiu-Jitsu training guides from Finesse BJJ Academy in Spring, TX."],
  ["/competitions", "Competition Hub", "Explore upcoming competitions, support the team, and read event recaps with Finesse BJJ Academy."],
  ["/programs/adult-bjj", "Adult Brazilian Jiu-Jitsu", "Explore adult Brazilian Jiu-Jitsu at Finesse BJJ Academy in Spring, TX. Learn fundamentals, develop technique, and request a free trial."],
  ["/programs/kids-bjj", "Kids Brazilian Jiu-Jitsu", "Discover kids Brazilian Jiu-Jitsu at Finesse BJJ Academy in Spring, TX. Explore classes, meet the team, and request a free trial."],
  ["/programs/wrestling", "Wrestling", "Develop takedowns, clinch work, and wrestling fundamentals at Finesse BJJ Academy in Spring, TX. Explore class times and request a trial."],
  ["/programs/striking", "Striking", "Explore all-levels and kids striking classes at Finesse BJJ Academy in Spring, TX. View class times and request a free trial."],
  ["/programs/womens-program", "Women’s Program", "Explore women’s no-gi fundamentals at Finesse BJJ in Spring, TX. Learn technique, build confidence, and meet supportive training partners."],
  ["/programs/personalized-options", "Personalized Training Options", "Explore private coaching, nutrition guidance, and strength training at Finesse BJJ Academy in Spring, TX. Contact the team to discuss your goals."],
] as const;
