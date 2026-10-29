"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LeadFormProvider, TrialFormProvider } from "@/lib/lead-form-context";
import { hasRequestedTrial } from "@/lib/contact-form";

const LeadPopup = dynamic(() => import("../ui/LeadPopup"), { ssr: false });
const POPUP_SEEN_KEY = "finesse:consultation-seen";
const VISIT_STARTED_KEY = "finesse:visit-started";
const POPUP_DELAY_MS = 12000;
// Pages about adult training open the trial picker on teen & adult classes; everything else starts on kids.
const ADULT_PAGES = /adult|wrestling|striking|womens|personalized/;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLeadPopupOpen, setIsLeadPopupOpen] = useState(false);
  const popupSeen = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    let delay = POPUP_DELAY_MS;
    // Visitors who already requested a trial only see the pop-up when they open it themselves.
    if (hasRequestedTrial()) return;
    try {
      if (sessionStorage.getItem(POPUP_SEEN_KEY)) {
        popupSeen.current = true;
        return;
      }
      const storedStart = Number(sessionStorage.getItem(VISIT_STARTED_KEY));
      const started = storedStart > 0 && Number.isFinite(storedStart) ? storedStart : Date.now();
      sessionStorage.setItem(VISIT_STARTED_KEY, String(started));
      delay = Math.max(0, POPUP_DELAY_MS - (Date.now() - started));
    } catch {
      // Without session storage, keep booking user-initiated to avoid repeat prompts.
      return;
    }
    const timer = setTimeout(() => {
      if (popupSeen.current || hasRequestedTrial()) return;
      try {
        if (sessionStorage.getItem(POPUP_SEEN_KEY)) return;
        sessionStorage.setItem(POPUP_SEEN_KEY, "1");
      } catch {
        return;
      }
      popupSeen.current = true;
      setIsLeadPopupOpen(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [pathname]);

  const openForm = () => {
    popupSeen.current = true;
    try {
      sessionStorage.setItem(POPUP_SEEN_KEY, "1");
    } catch {
      // Manual booking remains available when browser storage is disabled.
    }
    setIsLeadPopupOpen(true);
  };
  const closeLeadForm = () => setIsLeadPopupOpen(false);

  return (
    <LeadFormProvider value={openForm}>
      <TrialFormProvider value={openForm}>
      <Navbar onOpenLeadForm={openForm} />
      {children}
      <Footer />
      <LeadPopup isOpen={isLeadPopupOpen} onClose={closeLeadForm} audience={ADULT_PAGES.test(pathname) ? "adults" : "kids"} />
      </TrialFormProvider>
    </LeadFormProvider>
  );
}
