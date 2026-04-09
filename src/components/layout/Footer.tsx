"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const programLinks = [
  { label: "Adult BJJ", href: "/programs/adult-bjj" },
  { label: "Kids BJJ", href: "/programs/kids-bjj" },
  { label: "Wrestling", href: "/programs/wrestling" },
  { label: "Private Lessons", href: "/contact" },
];

const academyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Schedule", href: "/schedule" },
  { label: "Contact", href: "/contact" },
  { label: "News", href: "/news" },
  { label: "Terms of Service", href: "#terms" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  return (
    <footer ref={footerRef} className="bg-[#0A0A0A] pt-12 sm:pt-20 pb-10 overflow-hidden">
      {/* Gradient divider */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto mb-10 sm:mb-16 h-px max-w-6xl"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #CC1122 50%, transparent 100%)",
        }}
      />

      {/* Columns */}
      <div className="mx-auto grid max-w-7xl gap-10 sm:gap-12 px-4 sm:px-6 lg:px-8 grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {/* Column 1 — Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0 * 0.1 }}
        >
          <Image
            src="/logo.png"
            alt="Finesse BJJ Academy Logo"
            width={112}
            height={56}
            className="h-14 w-auto"
          />
          <span className="mt-3 block font-headline text-xl min-[375px]:text-2xl sm:text-3xl lg:text-4xl text-red-600">FINESSE BJJ</span>
          <p className="mt-4 font-body text-sm leading-relaxed text-zinc-500">
            Sharpening technique, forging discipline, and building champions on
            and off the mats. Train with Houston&apos;s premier jiu-jitsu academy.
          </p>
          {/* Social icons */}
          <div className="mt-6 flex items-center gap-1 min-[375px]:gap-2 sm:gap-3">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/finessejiujitsu/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] text-zinc-500 transition-colors hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="https://www.facebook.com/finessebjj"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] text-zinc-500 transition-colors hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://www.youtube.com/@finessejiujitsuTX"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] text-zinc-500 transition-colors hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.386.52A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.112 2.12c1.881.52 9.386.52 9.386.52s7.505 0 9.386-.52a2.994 2.994 0 0 0 2.112-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.546 15.568V8.432L15.818 12 9.546 15.568z" />
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] text-zinc-500 transition-colors hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.84 2.84 0 0 1 .82.12V9.01a6.27 6.27 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.27 6.34 6.34 0 0 0 9.31 21.6a6.34 6.34 0 0 0 6.34-6.33V9.38a8.16 8.16 0 0 0 4.78 1.53V7.48a4.85 4.85 0 0 1-.84-.79z" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Column 2 — Programs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1 * 0.1 }}
        >
          <h3 className="font-headline text-xl sm:text-2xl tracking-widest text-white">PROGRAMS</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {programLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-zinc-500 transition-colors hover:text-red-500 inline-block py-2 sm:py-1"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 3 — Academy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 2 * 0.1 }}
        >
          <h3 className="font-headline text-xl sm:text-2xl tracking-widest text-white">ACADEMY</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {academyLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-zinc-500 transition-colors hover:text-red-500 inline-block py-2 sm:py-1"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 4 — Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 3 * 0.1 }}
        >
          <h3 className="font-headline text-xl sm:text-2xl tracking-widest text-white">CONTACT INFO</h3>
          <ul className="mt-4 flex flex-col gap-4 font-body text-sm text-zinc-500">
            <li className="flex items-start gap-3">
              {/* Map pin */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-4 w-4 shrink-0 text-red-600">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
              </svg>
              <span>
                17711 Kuykendahl Rd, Unit A,
                <br />
                Spring, TX 77379
              </span>
            </li>
            <li className="flex items-start gap-3">
              {/* Phone */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0 text-red-600 mt-1">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div className="flex flex-col gap-1">
                <a href="tel:+13464182999" className="transition-colors hover:text-red-500">
                  (346) 418-2999
                </a>
                <a href="tel:+12815428008" className="transition-colors hover:text-red-500">
                  (281) 542-8008
                </a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              {/* Mail */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0 text-red-600">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <a href="mailto:info@finessebjj.com" className="transition-colors hover:text-red-500 break-all">
                info@finessebjj.com
              </a>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        className="mx-auto mt-16 max-w-7xl border-t border-white/5 px-4 pt-6 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-body text-xs text-zinc-600">
            &copy; 2026 FINESSE BJJ ACADEMY. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 font-body text-xs text-zinc-600">
            <a href="#privacy" className="transition-colors hover:text-red-500 py-2 sm:py-0">
              Privacy Policy
            </a>
            <a href="#terms" className="transition-colors hover:text-red-500 py-2 sm:py-0">
              Terms
            </a>
          </div>
        </div>
        <p className="mt-4 text-center font-body text-[11px] text-zinc-700">
          Designed by Creative Currents LLC
        </p>
      </motion.div>
    </footer>
  );
}
