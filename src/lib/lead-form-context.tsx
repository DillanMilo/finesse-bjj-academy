"use client";

import { createContext, useContext } from "react";

const LeadFormContext = createContext<(() => void) | null>(null);

export const LeadFormProvider = LeadFormContext.Provider;

export function useOpenLeadForm() {
  const open = useContext(LeadFormContext);
  return open ?? (() => {});
}
