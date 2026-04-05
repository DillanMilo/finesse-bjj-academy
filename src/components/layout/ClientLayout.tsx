"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LeadPopup from "../ui/LeadPopup";
import { LeadFormProvider } from "@/lib/lead-form-context";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLeadPopupOpen, setIsLeadPopupOpen] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);

  useEffect(() => {
    if (hasAutoTriggered) return;
    const timer = setTimeout(() => {
      setIsLeadPopupOpen(true);
      setHasAutoTriggered(true);
    }, 12000);
    return () => clearTimeout(timer);
  }, [hasAutoTriggered]);

  const openLeadForm = () => setIsLeadPopupOpen(true);
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
