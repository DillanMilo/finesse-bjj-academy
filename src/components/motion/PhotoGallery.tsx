"use client";

import ParallaxPhoto from "./ParallaxPhoto";

interface Photo { src: string; alt: string; position?: string }

export default function PhotoGallery({ photos, label }: { photos: readonly Photo[]; label: string }) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-2 gap-3 sm:gap-4">
      {photos.map((photo, index) => (
        <ParallaxPhoto key={photo.src} src={photo.src} alt={photo.alt} position={photo.position}
          className={`${photos.length === 2 ? "aspect-[4/5]" : index === 0 ? "col-span-2 aspect-[4/3]" : index === 3 ? "col-span-2 aspect-[16/9]" : "aspect-[4/5]"} w-full clip-corner`}
          sizes={index === 0 || (photos.length === 4 && index === 3) ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} />
      ))}
    </div>
  );
}
