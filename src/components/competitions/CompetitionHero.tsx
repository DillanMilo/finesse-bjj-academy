import ParallaxPhoto from "@/components/motion/ParallaxPhoto";
import Link from "next/link";

export default function CompetitionHero() {
  return (
    <section className="hub-hero relative min-h-[620px] flex items-end overflow-hidden">
      <div className="hub-hero-photo absolute inset-0">
        <ParallaxPhoto src="/photos/team.webp" alt="The Finesse BJJ academy team" priority sizes="100vw" className="absolute inset-0" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="relative w-full max-w-7xl mx-auto px-6 py-16 md:py-24">
        <p className="hub-eyebrow hub-hero-kicker">FINESSE BJJ / COMPETITION HUB</p>
        <h1 className="font-headline italic tracking-tight text-7xl sm:text-8xl md:text-[120px] leading-[.95] max-w-3xl">
          <span className="block overflow-hidden"><span className="hub-hero-step block">STEP UP.</span></span>
          <span className="hub-hero-team block text-[#CC1122]">TEAM UP.</span>
        </h1>
        <p className="hub-hero-copy max-w-lg text-lg text-zinc-300 mt-7 leading-relaxed">
          Your next challenge. Your team in your corner. From the first match to the final podium, we show up together.
        </p>
        <div className="hub-hero-actions flex flex-wrap gap-4 mt-8">
          <Link href="#events" className="hub-button">EXPLORE EVENTS ↗</Link>
          <Link href="#experience" className="hub-button-outline">NEW TO COMPETING?</Link>
        </div>
      </div>
      <span className="hub-hero-mark absolute right-8 bottom-8 hidden lg:block font-headline tracking-[.3em] text-sm text-white/60 [writing-mode:vertical-rl]">ONE TEAM. EVERY MATCH.</span>
    </section>
  );
}
