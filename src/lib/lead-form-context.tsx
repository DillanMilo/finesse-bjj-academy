"use client";

import { createContext, useContext } from "react";

const LeadFormContext = createContext<(() => void) | null>(null);

export const LeadFormProvider = LeadFormContext.Provider;

export function useOpenLeadForm() {
  const open = useContext(LeadFormContext);
  return open ?? (() => {});
}

const TrialFormContext = createContext<(() => void) | null>(null);
export const TrialFormProvider = TrialFormContext.Provider;
export function useOpenTrialForm() {
  return useContext(TrialFormContext) ?? (() => {});
}
