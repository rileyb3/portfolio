"use client";

import { useEffect, useRef, useState } from "react";
import ExpandableImage from "./ExpandableImage";

// Reference images land in a loose, overlapping pile — like a handful of
// photos tossed onto a desk — instead of a tidy grid, for a "gathering
// research" moment. Every card is the same fixed CSS size regardless of
// each image's real dimensions (object-cover fill), which is what keeps
// this from ever reflowing as images load — the earlier "glitching" bug
// was images with no reserved size popping in one at a time mid-scroll.
//
// Tilt/lift are a hand-picked repeating pattern rather than random(), so
// the pile looks the same on every visit instead of reshuffling on each
// reload.
const TILT = [-6, 4, -8, 3, -4, 7, -3, 5, -7, 2, -5, 6];
const LIFT = [8, -6, 4, -10, 6, -4, 10, -8, 2, -6, 8, -3];

export default function ImagePile({ images }: { images: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-wrap items-center justify-center gap-x-1 gap-y-6 px-4 py-6 sm:gap-x-3"
    >
      {images.map((src, i) => {
        const tilt = TILT[i % TILT.length];
        const lift = LIFT[i % LIFT.length];
        const restTransform = `translateY(${lift}px) rotate(${tilt}deg) scale(1)`;
        const startTransform = "translateY(48px) rotate(0deg) scale(0.82)";
        return (
          <div
            key={src}
            style={{
              transitionDelay: visible ? `${i * 80}ms` : "0ms",
              transform: visible ? restTransform : startTransform,
            }}
            className={`h-36 w-28 shrink-0 overflow-hidden rounded-lg border-4 border-paper shadow-xl transition-all duration-700 ease-out will-change-transform hover:z-10 hover:!rotate-0 hover:!scale-110 sm:h-52 sm:w-40 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <ExpandableImage src={src} alt="" fill className="h-full w-full" />
          </div>
        );
      })}
    </div>
  );
}
