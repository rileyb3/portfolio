"use client";

import { useEffect, useRef, useState } from "react";

// One image at a time, holds for a few seconds, then swipes horizontally
// to the next — loops back to the first after the last. Auto-plays on its
// own; no controls, this is meant as a passive "here's the process" beat
// in a writeup, not a gallery someone drives.
export default function ImageSlideshow({
  images,
  intervalMs = 3000,
}: {
  images: string[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length, intervalMs]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface2 sm:aspect-video">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          width: `${images.length * 100}%`,
          transform: `translateX(-${index * (100 / images.length)}%)`,
        }}
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="h-full"
            style={{ width: `${100 / images.length}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="block h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((src, i) => (
            <span
              key={src}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
