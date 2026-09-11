"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LeadFormProvider } from "@/lib/lead-form-context";

const LeadPopup = dynamic(() => import("../ui/LeadPopup"), { ssr: false });
const POPUP_SEEN_KEY = "finesse:consultation-seen";
const VISIT_STARTED_KEY = "finesse:visit-started";
const POPUP_DELAY_MS = 12000;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLeadPopupOpen, setIsLeadPopupOpen] = useState(false);
  const popupSeen = useRef(false);

  useEffect(() => {
    let delay = POPUP_DELAY_MS;
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
      if (popupSeen.current) return;
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
  }, []);

  const openLeadForm = () => {
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
    <LeadFormProvider value={openLeadForm}>
      <Navbar onOpenLeadForm={openLeadForm} />
      {children}
      <Footer />
      <LeadPopup isOpen={isLeadPopupOpen} onClose={closeLeadForm} />
    </LeadFormProvider>
  );
}
