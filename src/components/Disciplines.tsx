"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Palette,
  Gamepad2,
  Microscope,
  PenTool,
  Images,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { categories } from "@/data/projects";

const iconMap: Record<string, LucideIcon> = {
  build: Code2,
  design: Palette,
  play: Gamepad2,
  discover: Microscope,
  write: PenTool,
};

// Each tile is its own page — /build, /design, etc.
const tiles = categories.map((c) => ({
  href: `/${c.id}`,
  label: c.label,
  id: c.id,
}));

// Five distinct blunt, rounded-point stars (5-6 points each, shallow
// notches) — a deliberate walk-back from an earlier 14-point version that
// was too sharp/spiky to hold an icon + word without clipping into the
// points. Each is generated as outer/inner radius pairs around a center
// so the interior stays a big, mostly-flat hexagon/pentagon rather than a
// thin hub between long spikes.
const starShapes = [
  "polygon(50% 2%, 67% 20.6%, 91.6% 26%, 84% 50%, 91.6% 74%, 67% 79.4%, 50% 98%, 33% 79.4%, 8.4% 74%, 16% 50%, 8.4% 26%, 33% 20.6%)",
  "polygon(50% 3%, 71.2% 20.9%, 94.7% 35.5%, 84.2% 61.1%, 77.6% 88%, 50% 86%, 22.4% 88%, 15.8% 61.1%, 5.3% 35.5%, 28.8% 20.9%)",
  "polygon(50% 6%, 68% 18.8%, 88.1% 28%, 86% 50%, 88.1% 72%, 68% 81.2%, 50% 94%, 32% 81.2%, 11.9% 72%, 14% 50%, 11.9% 28%, 32% 18.8%)",
  "polygon(57.8% 5.7%, 77.3% 23.6%, 94.6% 43.7%, 83.6% 67.8%, 69.7% 90.5%, 43.4% 87.4%, 17.6% 81.3%, 12.4% 55.3%, 10.3% 28.9%, 33.4% 15.8%)",
  "polygon(61.9% 5.6%, 76.9% 23.1%, 94.4% 38.1%, 86.7% 59.8%, 82.5% 82.5%, 59.8% 86.7%, 38.1% 94.4%, 23.1% 76.9%, 5.6% 61.9%, 13.3% 40.2%, 17.5% 17.5%, 40.2% 13.3%)",
];

// A clip-path shape like this doesn't play well with a CSS border (the
// border box is rectangular and gets chopped at odd angles) — instead each
// tile is two nested elements sharing its own clip-path: an outer one
// filled solid with the page background and, via padding, a thick visible
// margin, and an inset inner one filled with the tile's gradient. Wherever
// two tiles overlap, that opaque margin shows through as a clean gap
// between them rather than the colors muddying — the padding has to be
// chunky (not a hairline) for that gap to actually read at this scale.
// Matches the page background (dark again, per the inverse-color flip).
const outlineColor = "#0a0a0a";

// Bright, non-uniform gradients per tile — genuinely different hues rather
// than tints of the same accent, per "bright colors" + "gradient". rotate
// feeds a single JS-computed transform (see render) rather than Tailwind's
// rotate-* utilities, since those and an inline `style.transform` would
// fight over the same CSS property — inline style always wins, silently
// no-op'ing the classes. Positions are spaced for partial, not total,
// overlap — total overlap was swallowing whichever tile ended up behind.
const blobStyle = [
  {
    top: "36%",
    left: "14%",
    rotate: -12,
    gradient: "linear-gradient(135deg, #C8FF3D 0%, #FFD23D 55%, #FF6EC7 100%)",
  },
  {
    top: "22%",
    left: "40%",
    rotate: 8,
    gradient: "linear-gradient(140deg, #FF6EC7 0%, #FF9A3D 60%, #FFD23D 100%)",
  },
  {
    top: "62%",
    left: "26%",
    rotate: -8,
    gradient: "linear-gradient(160deg, #3DFFE0 0%, #7DFFA3 100%)",
  },
  {
    top: "42%",
    left: "58%",
    rotate: 14,
    gradient: "linear-gradient(180deg, #3DD1FF 0%, #7DD3FC 55%, #8FA89B 100%)",
  },
  {
    top: "66%",
    left: "68%",
    rotate: -10,
    gradient: "linear-gradient(135deg, #3DD1FF 0%, #7DD3FC 50%, #7DFFA3 100%)",
  },
];

export default function Disciplines() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="disciplines"
      ref={ref}
      // min-h-[85vh] is a safety floor, not the main mechanism: this section
      // rides up over Hero via -mt-[40vh] (kept in sync with Hero's own
      // wrapper offset — see the comment there) and (at z-20, above Hero's
      // z-10) is what hides Hero's sticky name/photo once you scroll past
      // it. bg-ink matches Hero above it — the whole landing page is back
      // to the original dark theme (inverse-color flip), consistent with
      // every other route.
      className="relative z-20 -mt-[40vh] min-h-[85vh] scroll-mt-6 rounded-t-[3rem] bg-ink px-6 pb-16 pt-10 text-center sm:pt-14"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-muted">
          Explore my work by discipline
        </h2>
        {/* Relative canvas the tiles are pinned into by (top%, left%) —
            spaced for partial overlap so the white gap ring reads as
            deliberate rather than the tiles fighting for the same spot. */}
        <div className="relative mx-auto h-[60vh] w-full sm:h-[65vh] lg:h-[70vh]">
          {tiles.map((tile, i) => {
            const Icon = iconMap[tile.id] ?? Images;
            const shape = starShapes[i % starShapes.length];
            const { top, left, rotate, gradient } =
              blobStyle[i % blobStyle.length];
            const entranceScale = visible ? 1 : 0.85;
            const hoverScale = hoveredId === tile.id ? 1.08 : 1;
            return (
              <Link
                key={tile.id}
                href={tile.href}
                onMouseEnter={() => setHoveredId(tile.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  top,
                  left,
                  zIndex: hoveredId === tile.id ? 10 : i,
                  transitionDelay: visible ? `${i * 60}ms` : "0ms",
                  clipPath: shape,
                  backgroundColor: outlineColor,
                  transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${
                    entranceScale * hoverScale
                  })`,
                }}
                className={`group absolute flex aspect-square w-44 shrink-0 p-[14px] transition-all duration-500 ease-out sm:w-56 sm:p-[18px] lg:w-64 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  style={{ clipPath: shape, background: gradient }}
                  className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-ink"
                >
                  <Icon
                    className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12"
                    strokeWidth={1.5}
                  />
                  <span className="text-base font-semibold leading-snug sm:text-lg">
                    {tile.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
