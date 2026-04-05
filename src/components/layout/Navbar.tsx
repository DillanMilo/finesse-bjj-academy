"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "PROGRAMS", href: "/#programs" },
  { label: "TRAINERS", href: "/#trainers" },
  { label: "SCHEDULE", href: "/schedule" },
  { label: "ABOUT", href: "/about" },
  { label: "NEWS", href: "/news" },
  { label: "CONTACT", href: "/contact" },
];

interface NavbarProps {
  onOpenLeadForm?: () => void;
}

export default function Navbar({ onOpenLeadForm }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href;
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-md transition-colors duration-300 ${
          scrolled
            ? "bg-black/80 shadow-[0_2px_24px_rgba(204,17,34,0.12)]"
            : "bg-black/60 shadow-[0_2px_16px_rgba(204,17,34,0.06)]"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 overflow-hidden">
          <Link
            href="/"
            className="flex items-center gap-2 min-w-0 shrink-0"
          >
            <Image
              src="/logo.png"
              alt="Finesse BJJ Academy"
              width={120}
              height={40}
              className="h-7 w-auto min-[375px]:h-8 sm:h-10"
              priority
            />
            <span className="hidden min-[375px]:inline sm:inline font-headline text-xl italic tracking-tighter text-red-600 sm:text-2xl lg:text-3xl">
              FINESSE BJJ
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-4 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-headline uppercase transition-all hover:text-red-500 hover:brightness-125 ${
                    isActive(link.href)
                      ? "text-red-600 border-b-2 border-red-600 pb-1"
                      : "text-zinc-400"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenLeadForm}
              className="hidden lg:block -skew-x-12 bg-[#CC1122] px-4 py-2 xl:px-5 transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(204,17,34,0.4)]"
            >
              <span className="skew-x-12 inline-block font-headline text-sm tracking-wider text-white">
                FREE CONSULT
              </span>
            </button>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative z-50 flex flex-col items-center justify-center gap-[5px] lg:hidden h-11 w-11"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-[2px] w-6 bg-[#E5E2E1] transition-all duration-300 ${
                  mobileOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-[#E5E2E1] transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-[#E5E2E1] transition-all duration-300 ${
                  mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 overflow-y-auto py-20 bg-black/95 backdrop-blur-lg lg:hidden"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-headline text-2xl sm:text-3xl uppercase text-zinc-400 transition-colors hover:text-red-500 min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.button
              onClick={() => {
                setMobileOpen(false);
                onOpenLeadForm?.();
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="-skew-x-12 bg-[#CC1122] px-8 py-3 mt-4 transition-all hover:brightness-110"
            >
              <span className="skew-x-12 inline-block font-headline text-lg tracking-wider text-white">
                FREE CONSULT
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
