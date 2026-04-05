"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FormEvent, useState } from "react";

/* ──────────────────────────── helpers ──────────────────────────── */

function useReveal(margin: string = "-100px") {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: margin as `${number}px` });
  return { ref, isInView };
}

const socials = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/finessejiujitsu/" },
  { label: "FACEBOOK", href: "https://www.facebook.com/finessebjj" },
  { label: "YOUTUBE", href: "https://www.youtube.com/@finessejiujitsuTX" },
  { label: "TIKTOK", href: "https://tiktok.com" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
    message: "",
  });

  /* ── scroll refs ── */
  const heroLeftRef = useRef<HTMLDivElement>(null);
  const heroLeftInView = useInView(heroLeftRef, { once: true, margin: "-100px" });
  const heroRightRef = useRef<HTMLDivElement>(null);
  const heroRightInView = useInView(heroRightRef, { once: true, margin: "-100px" });
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { once: true, margin: "-100px" });
  const socialRef = useRef<HTMLDivElement>(null);
  const socialInView = useInView(socialRef, { once: true, margin: "-100px" });

  /* ── parallax ── */
  const mapParallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mapScrollY } = useScroll({
    target: mapParallaxRef,
    offset: ["start end", "end start"],
  });
  const mapY = useTransform(mapScrollY, [0, 1], ["-15%", "15%"]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  const contactItems = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-[#CC1122]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
      title: "LOCATION",
      content: (
        <p className="font-body text-[#E6BDB9] text-sm tracking-wide leading-relaxed">
          17711 Kuykendahl Rd, Unit A,
          <br />
          Spring, TX 77379
        </p>
      ),
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-[#CC1122]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
          />
        </svg>
      ),
      title: "PHONE",
      content: (
        <div className="flex flex-col gap-1">
          <a
            href="tel:+13464182999"
            className="font-body text-[#E6BDB9] text-sm tracking-wide hover:text-[#CC1122] transition-colors duration-300"
          >
            (346) 418-2999
          </a>
          <a
            href="tel:+12815428008"
            className="font-body text-[#E6BDB9] text-sm tracking-wide hover:text-[#CC1122] transition-colors duration-300"
          >
            (281) 542-8008
          </a>
        </div>
      ),
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-[#CC1122]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M4 4h16v16H4z"
          />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      title: "EMAIL",
      content: (
        <a
          href="mailto:info@finessebjj.com"
          className="font-body text-[#E6BDB9] text-sm tracking-wide hover:text-[#CC1122] transition-colors duration-300"
        >
          info@finessebjj.com
        </a>
      ),
    },
  ];

  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      {/* ── Hero: Two-Column Layout ── */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Left Column */}
          <div ref={heroLeftRef}>
            <motion.h1
              className="font-headline text-4xl sm:text-6xl md:text-7xl lg:text-[10rem] leading-[0.85] tracking-tighter italic mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={heroLeftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-white">CONTACT </span>
              <span className="text-[#CC1122]">US</span>
            </motion.h1>

            <motion.p
              className="font-serif text-xl md:text-2xl text-[#E6BDB9] italic mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={heroLeftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            >
              &ldquo;Finesse is the ultimate expression of mechanical
              advantage.&rdquo;
            </motion.p>

            <div className="space-y-12">
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="flex gap-5"
                  initial={{ opacity: 0, y: 40 }}
                  animate={heroLeftInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                    delay: 0.3 + index * 0.1,
                  }}
                >
                  <div className="flex-shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-headline text-2xl tracking-widest text-white mb-2">
                      {item.title}
                    </h3>
                    {item.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <div ref={heroRightRef}>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={heroRightInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              {/* Red glow behind form */}
              <div className="absolute -inset-8 bg-[#CC1122]/8 blur-3xl rounded-full pointer-events-none" />

              <div className="relative clip-corner bg-[#2A2A2A] p-5 sm:p-8 md:p-12 border border-[#5C3F3D]/15">
                <motion.h2
                  className="font-headline text-2xl sm:text-3xl md:text-5xl text-white mb-6 md:mb-8 tracking-wider"
                  initial={{ opacity: 0, y: 40 }}
                  animate={heroRightInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                >
                  GET IN TOUCH
                </motion.h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name + Email row */}
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
                    initial={{ opacity: 0, y: 40 }}
                    animate={heroRightInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                  >
                    <input
                      type="text"
                      placeholder="NAME"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-transparent border-0 border-b border-[#5C3F3D] py-4 focus:border-[#CC1122] font-headline tracking-widest placeholder:text-zinc-600 text-white outline-none transition-colors duration-300"
                    />
                    <input
                      type="email"
                      placeholder="EMAIL"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-transparent border-0 border-b border-[#5C3F3D] py-4 focus:border-[#CC1122] font-headline tracking-widest placeholder:text-zinc-600 text-white outline-none transition-colors duration-300"
                    />
                  </motion.div>

                  {/* Experience select */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={heroRightInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  >
                    <select
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="w-full bg-transparent border-0 border-b border-[#5C3F3D] py-4 focus:border-[#CC1122] font-headline tracking-widest text-zinc-600 outline-none transition-colors duration-300 appearance-none cursor-pointer [&:has(option:checked:not([value=''']))]:text-white"
                      style={{
                        color: formData.experience ? "#fff" : undefined,
                      }}
                    >
                      <option value="" disabled hidden>
                        SELECT EXPERIENCE LEVEL
                      </option>
                      <option
                        value="white"
                        className="bg-[#2A2A2A] text-white"
                      >
                        WHITE BELT / NOVICE
                      </option>
                      <option
                        value="blue-purple"
                        className="bg-[#2A2A2A] text-white"
                      >
                        BLUE / PURPLE BELT
                      </option>
                      <option
                        value="brown-black"
                        className="bg-[#2A2A2A] text-white"
                      >
                        BROWN / BLACK BELT
                      </option>
                    </select>
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={heroRightInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                  >
                    <textarea
                      placeholder="MESSAGE / INTENT"
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-transparent border-0 border-b border-[#5C3F3D] py-4 focus:border-[#CC1122] font-headline tracking-widest placeholder:text-zinc-600 text-white outline-none resize-none transition-colors duration-300"
                    />
                  </motion.div>

                  {/* Submit */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={heroRightInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                  >
                    <button
                      type="submit"
                      className="w-full -skew-x-12 bg-[#CC1122] py-5 shadow-[0_0_30px_rgba(204,17,34,0.4)] hover:shadow-[0_0_40px_rgba(204,17,34,0.6)] transition-all duration-300 hover:bg-[#E8222E]"
                    >
                      <span className="skew-x-12 inline-block font-headline text-xl md:text-2xl tracking-widest text-white">
                        SEND MESSAGE
                      </span>
                    </button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Gradient Divider ── */}
      <div className="gradient-divider mx-4 sm:mx-6 md:mx-8" />

      {/* ── Map Section ── */}
      <section className="w-full px-4 sm:px-6 md:px-8 max-w-[1920px] mx-auto py-16 md:py-24">
        <motion.div
          ref={(node) => {
            (mapRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            (mapParallaxRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className="relative h-[400px] md:h-[600px] clip-corner border border-[#5C3F3D]/10 overflow-hidden shadow-[0_0_60px_rgba(204,17,34,0.15)]"
          initial={{ opacity: 0, y: 40 }}
          animate={mapInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Placeholder dark gradient background */}
          <motion.div style={{ y: mapY }} className="absolute inset-0 scale-[1.3] bg-gradient-to-br from-[#1A1014] via-[#0A0A0A] to-[#1A1014]" />

          {/* Pulsing location pin */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                className="w-16 h-16 text-[#CC1122] drop-shadow-[0_0_20px_rgba(204,17,34,0.6)]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
              </svg>
            </motion.div>
          </div>

          {/* Grid overlay for visual texture */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(#5C3F3D 1px, transparent 1px), linear-gradient(90deg, #5C3F3D 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Bottom-left info overlay */}
          <motion.div
            className="absolute bottom-0 left-0 bg-black/80 backdrop-blur-xl p-6 border-l-4 border-[#CC1122]"
            initial={{ opacity: 0, y: 40 }}
            animate={mapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          >
            <h3 className="font-headline text-2xl tracking-widest text-white mb-1">
              FINESSE BJJ ACADEMY
            </h3>
            <p className="font-body text-xs text-[#E6BDB9]/60 tracking-widest">
              30.0799&deg; N, 95.4431&deg; W
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Gradient Divider ── */}
      <div className="gradient-divider mx-4 sm:mx-6 md:mx-8" />

      {/* ── Social Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
        <div ref={socialRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socials.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square bg-zinc-800 border border-[#5C3F3D]/20 hover:border-[#CC1122] group overflow-hidden transition-colors duration-300"
              initial={{ opacity: 0, y: 40 }}
              animate={socialInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1,
              }}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#CC1122]/0 group-hover:bg-[#CC1122]/15 transition-colors duration-300" />

              {/* Social icon placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-headline text-3xl md:text-4xl text-zinc-700 group-hover:text-[#CC1122]/40 tracking-widest transition-colors duration-300">
                  {social.label.charAt(0)}
                </span>
              </div>

              {/* Label at bottom-left */}
              <div className="absolute bottom-0 left-0 p-4 md:p-6">
                <span className="font-headline text-sm md:text-base tracking-widest text-zinc-500 group-hover:text-white transition-colors duration-300">
                  {social.label}
                </span>
              </div>

              {/* Corner accent on hover */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-transparent group-hover:border-t-[#CC1122]/30 border-l-[40px] border-l-transparent transition-colors duration-300" />
            </motion.a>
          ))}
        </div>
      </section>
    </main>
  );
}
