"use client";
import Image from "next/image";
import ParallaxPhoto from "@/components/motion/ParallaxPhoto";
import { useState } from "react";
const photos = ["/photos/team.webp", "/photos/adult-training.webp", "/photos/kids-class.webp"];
export default function EventGallery() {
  const [selected, setSelected] = useState<string | null>(null);
  return <><div className="grid sm:grid-cols-3 gap-4">{photos.map((src,i) => <button key={src} aria-label={`Enlarge sample gallery photo ${i + 1}`} onClick={() => setSelected(src)} className="relative aspect-[4/3] overflow-hidden"><ParallaxPhoto src={src} alt="Finesse academy training — gallery placeholder" sizes="(min-width: 640px) 33vw, 100vw" className="absolute inset-0"/></button>)}</div>{selected && <div role="dialog" aria-modal="true" aria-label="Sample gallery photo" className="fixed inset-0 bg-black/95 z-[60] flex flex-col items-center justify-center p-6" onKeyDown={e => {if(e.key === "Escape") setSelected(null);}}><button autoFocus onClick={() => setSelected(null)} className="px-5 py-3 border border-white/30 mb-4">Close photo ×</button><div className="relative w-full max-w-5xl h-[70dvh]"><Image src={selected} alt="Enlarged sample academy photo" fill sizes="100vw" className="object-contain"/></div></div>}</>;
}
