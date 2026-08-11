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

// One uniform pointed, irregular, star-like outline — same shape and size
// for every tile now. The chaos lives in each tile's position/rotation
// (below), not in shape or size variety. Hand-tweaked so the points land
// at uneven distances/angles rather than a clean 5-point star.
const starClipPath =
  "polygon(50% 0%, 63% 32%, 95% 15%, 72% 48%, 100% 62%, 65% 65%, 75% 100%, 50% 75%, 25% 100%, 35% 65%, 0% 62%, 28% 48%, 5% 15%, 37% 32%)";

// A clip-path shape like this doesn't play well with a CSS border (the
// border box is rectangular and gets chopped at odd angles), so color does
// the work of separating each tile instead: bright chartreuse/blue/orange,
// one dark charcoal, one white, no borders.
const brightOrange = "#FF7A1A";

// Rotation + x/y offset per tile so the row reads as scattered/eccentric
// in its placement, feeding a single JS-computed transform (see render)
// rather than Tailwind's rotate-*/translate-* utilities, since those and
// an inline `style.transform` would fight over the same CSS property —
// inline style always wins, silently no-op'ing the classes.
const blobStyle = [
  {
    rotate: -14,
    x: -8,
    y: -12,
    tint: "bg-accent hover:brightness-110",
    text: "text-ink",
    icon: "text-ink group-hover:text-ink",
  },
  {
    rotate: 10,
    x: 16,
    y: 44,
    tint: "bg-surface2 hover:bg-white/10",
    text: "text-paper",
    icon: "text-paper group-hover:text-accent",
  },
  {
    rotate: -11,
    x: -20,
    y: -38,
    tint: "bg-accent2 hover:brightness-110",
    text: "text-ink",
    icon: "text-ink group-hover:text-ink",
  },
  {
    rotate: 16,
    x: 22,
    y: 24,
    tint: "hover:brightness-110",
    tintStyle: { backgroundColor: brightOrange },
    text: "text-ink",
    icon: "text-ink group-hover:text-ink",
  },
  {
    rotate: -9,
    x: 6,
    y: -52,
    tint: "bg-paper hover:brightness-95",
    text: "text-ink",
    icon: "text-ink group-hover:text-accent",
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
      // min-h-[95vh] is load-bearing, not decorative: this section rides up
      // over Hero via -mt-[70vh] and (at z-20, above Hero's z-10) is what
      // hides Hero's sticky name/photo once you scroll past it. Bumped up
      // from 85vh to give the now-bigger, more-scattered blobs (some
      // offset ±50px vertically) enough headroom without shrinking the
      // margin below the required 70vh cover.
      className="relative z-20 -mt-[70vh] flex min-h-[95vh] scroll-mt-6 flex-col justify-center rounded-t-[3rem] bg-ink px-6 pb-24 pt-6 text-center sm:pb-32 sm:pt-8"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-14 text-sm font-medium uppercase tracking-widest text-muted">
          Explore my work by discipline
        </h2>
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-8">
          {tiles.map((tile, i) => {
            const Icon = iconMap[tile.id] ?? Images;
            const { rotate, x, y, tint, tintStyle, text, icon } =
              blobStyle[i % blobStyle.length];
            const entranceScale = visible ? 1 : 0.85;
            const hoverScale = hoveredId === tile.id ? 1.1 : 1;
            return (
              <Link
                key={tile.id}
                href={tile.href}
                onMouseEnter={() => setHoveredId(tile.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  transitionDelay: visible ? `${i * 60}ms` : "0ms",
                  clipPath: starClipPath,
                  ...tintStyle,
                  transform: `translate(${x}px, ${
                    visible ? y : y + 16
                  }px) rotate(${rotate}deg) scale(${
                    entranceScale * hoverScale
                  })`,
                }}
                className={`group flex aspect-square w-40 shrink-0 flex-col items-center justify-center gap-3 p-8 text-center transition-all duration-500 ease-out sm:w-48 lg:w-56 ${tint} ${text} ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                <Icon
                  className={`h-10 w-10 transition sm:h-12 sm:w-12 ${icon}`}
                  strokeWidth={1.5}
                />
                <span className="text-base font-semibold leading-snug sm:text-lg">
                  {tile.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
