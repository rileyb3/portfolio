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

// Organic "blob" outlines instead of square cards — asymmetric border-radius
// pairs (the classic CSS blob trick), pushed to more extreme swings (as low
// as ~20%, as high as ~80%) so each one reads as a distinctly weird,
// hand-drawn shape rather than a rounded square.
const blobShapes = [
  "78% 22% 65% 35% / 30% 25% 75% 70%",
  "22% 78% 45% 55% / 65% 20% 80% 35%",
  "70% 30% 20% 80% / 25% 65% 35% 75%",
  "30% 70% 75% 25% / 60% 35% 65% 40%",
  "55% 45% 25% 75% / 75% 25% 70% 30%",
];

// Rotation + x/y offset + size all vary per tile so the row reads as
// scattered/eccentric rather than perfectly aligned, and bigger/bolder so
// it feels iconic rather than a strip of icons — on-brand accent colors
// (chartreuse / light blue / orange) cycled in solid/bright, plus a couple
// dark/neutral ones for contrast, rather than an arbitrary rainbow.
// rotate/x/y feed a single JS-computed transform (see render) rather than
// Tailwind's rotate-*/translate-*  utilities, since those and an inline
// `style.transform` would fight over the same CSS property — inline style
// always wins, silently no-op'ing the classes.
const blobStyle = [
  {
    rotate: -14,
    x: -8,
    y: -12,
    size: "w-40 sm:w-52 lg:w-56",
    tint: "bg-accent hover:brightness-110 border-transparent",
    text: "text-ink",
    icon: "text-ink group-hover:text-ink",
  },
  {
    rotate: 10,
    x: 16,
    y: 44,
    size: "w-36 sm:w-44 lg:w-48",
    tint: "bg-surface2 hover:bg-white/10 border-white/10",
    text: "text-paper",
    icon: "text-paper group-hover:text-accent",
  },
  {
    rotate: -11,
    x: -20,
    y: -38,
    size: "w-44 sm:w-56 lg:w-64",
    tint: "bg-accent2 hover:brightness-110 border-transparent",
    text: "text-ink",
    icon: "text-ink group-hover:text-ink",
  },
  {
    rotate: 16,
    x: 22,
    y: 24,
    size: "w-40 sm:w-48 lg:w-52",
    tint: "bg-accent3 hover:brightness-110 border-transparent",
    text: "text-ink",
    icon: "text-ink group-hover:text-ink",
  },
  {
    rotate: -9,
    x: 6,
    y: -52,
    size: "w-36 sm:w-44 lg:w-48",
    tint: "bg-surface2 hover:bg-white/10 border-white/10",
    text: "text-paper",
    icon: "text-paper group-hover:text-accent",
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
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-8 sm:flex-nowrap sm:justify-between sm:gap-4">
          {tiles.map((tile, i) => {
            const Icon = iconMap[tile.id] ?? Images;
            const shape = blobShapes[i % blobShapes.length];
            const { rotate, x, y, size, tint, text, icon } =
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
                  borderRadius: shape,
                  transform: `translate(${x}px, ${
                    visible ? y : y + 16
                  }px) rotate(${rotate}deg) scale(${
                    entranceScale * hoverScale
                  })`,
                }}
                className={`group flex aspect-square ${size} shrink-0 flex-col items-center justify-center gap-3 border p-6 text-center transition-all duration-500 ease-out ${tint} ${text} ${
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
