"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const posts = [
  {
    title: "Building Confidence in Kids through Jiu Jitsu Training",
    category: "Kids",
    excerpt:
      "Discover how Brazilian Jiu-Jitsu helps children develop unshakeable confidence, resilience, and self-esteem both on and off the mats.",
  },
  {
    title: "Enhance Your Child's Focus and Attention with Martial Arts",
    category: "Kids",
    excerpt:
      "Learn how martial arts training can improve your child's concentration, academic performance, and ability to focus under pressure.",
  },
  {
    title: "Boost Your Child's Grades with Kids Jiu Jitsu",
    category: "Kids",
    excerpt:
      "Studies show that kids who train martial arts perform better in school. Find out why Jiu-Jitsu is the ultimate academic booster.",
  },
];

function NewsCard({
  post,
  index,
}: {
  post: (typeof posts)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.12 }}
      className="group flex flex-col bg-[#1A1014] border border-white/5 rounded-sm overflow-hidden transition-all hover:border-[#CC1122]/30 hover:shadow-[0_0_30px_rgba(204,17,34,0.08)]"
    >
      {/* Red top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#CC1122] to-transparent" />

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Category badge */}
        <span className="inline-block self-start px-3 py-1 text-[11px] font-headline uppercase tracking-widest text-[#CC1122] border border-[#CC1122]/30 bg-[#CC1122]/5 rounded-sm">
          {post.category}
        </span>

        {/* Title */}
        <h3 className="mt-4 font-headline text-lg sm:text-xl italic tracking-tighter text-white leading-tight group-hover:text-red-500 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-3 font-body text-sm leading-relaxed text-zinc-500 flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Read more link */}
        <Link
          href="#"
          className="mt-5 inline-flex items-center gap-2 font-headline text-xs tracking-widest text-[#CC1122] transition-all group-hover:gap-3"
        >
          READ MORE
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

export default function LatestNews() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0A0A0A] py-20 sm:py-28 px-4 sm:px-6 md:px-8 overflow-hidden"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#CC1122]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block font-headline text-xs tracking-[0.3em] text-[#CC1122] uppercase"
          >
            From the Mats
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic tracking-tighter text-white"
          >
            LATEST NEWS
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 h-px max-w-xs origin-center"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #CC1122 50%, transparent 100%)",
            }}
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post, i) => (
            <NewsCard key={post.title} post={post} index={i} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Link
            href="/news"
            className="inline-flex items-center gap-3 -skew-x-12 bg-[#CC1122] px-8 py-3 transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(204,17,34,0.4)]"
          >
            <span className="skew-x-12 inline-block font-headline text-sm tracking-wider text-white">
              VIEW ALL POSTS
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
