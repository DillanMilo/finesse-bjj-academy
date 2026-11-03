"use client";

import type { Special } from "@/lib/specials";
import { useNowSeconds } from "@/lib/use-special";

/** Days, hours, minutes and seconds until the special ends. Shows dashes until the browser takes over. */
export default function SpecialCountdown({ special, compact = false }: { special: Special; compact?: boolean }) {
  const now = useNowSeconds();
  const left = now === null ? null : Math.max(0, Math.floor(Date.parse(special.endsAt) / 1000) - now);
  const units: [string, number | null][] = [
    ["Days", left === null ? null : Math.floor(left / 86_400)],
    ["Hours", left === null ? null : Math.floor(left / 3600) % 24],
    ["Min", left === null ? null : Math.floor(left / 60) % 60],
    ["Sec", left === null ? null : left % 60],
  ];
  return <div role="timer" aria-label={`Time left on the ${special.name}`} className={`grid grid-cols-4 ${compact ? "gap-1.5" : "gap-2 sm:gap-3"}`}>
    {units.map(([label, value]) => <div key={label} className={`border border-white/15 bg-black/60 text-center backdrop-blur-sm ${compact ? "px-2 py-2" : "px-2 py-3 sm:px-4 sm:py-4"}`}>
      <span className={`block font-headline leading-none tabular-nums ${compact ? "text-3xl" : "text-4xl sm:text-6xl"}`}>{value === null ? "--" : String(value).padStart(2, "0")}</span>
      <span className="mt-1 block text-[10px] font-bold tracking-[.22em] text-white/60 sm:text-[11px]">{label.toUpperCase()}</span>
    </div>)}
  </div>;
}
