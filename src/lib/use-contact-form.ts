"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { hasRequestedTrial, TRIAL_REQUESTED_EVENT } from "@/lib/contact-form";

function subscribeTrialRequested(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(TRIAL_REQUESTED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(TRIAL_REQUESTED_EVENT, onChange);
  };
}

/** Whether this browser already sent a free trial request (always false during server render). */
export function useTrialRequested() {
  return useSyncExternalStore(subscribeTrialRequested, hasRequestedTrial, () => false);
}

/** Records when the form appeared (on mount, or each time `visible` turns true); sent to the server as startedAt. */
export function useFormStartedAt(visible = true) {
  const startedAt = useRef(0);
  useEffect(() => {
    if (visible) startedAt.current = Date.now();
  }, [visible]);
  return startedAt;
}
