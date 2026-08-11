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
// pairs (the classic CSS blob trick) so each tile reads as a distinct,
// hand-drawn shape rather than a grid of identical tiles.
const blobShapes = [
  "63% 37% 54% 46% / 43% 37% 63% 57%",
  "37% 63% 56% 44% / 49% 39% 61% 51%",
  "58% 42% 39% 61% / 43% 51% 49% 57%",
  "41% 59% 63% 37% / 51% 47% 53% 49%",
  "49% 51% 48% 52% / 57% 44% 56% 43%",
];

// A slight rotation + vertical offset per tile so the row reads as
// scattered/eccentric rather than perfectly aligned — on-brand accent
// colors (chartreuse / light blue / orange) cycled in solid/bright, plus
// a couple dark/neutral ones for contrast, rather than an arbitrary
// rainbow. rotate/y feed a single JS-computed transform (see render)
// rather than Tailwind's rotate-*/translate-y-* utilities, since those
// and an inline `style.transform` would fight over the same CSS property
// — inline style always wins, silently no-op'ing the classes.
const blobStyle = [
  {
    rotate: -6,
    y: 0,
    tint: "bg-accent hover:brightness-110 border-transparent",
    text: "text-ink",
    icon: "text-ink group-hover:text-ink",
  },
  {
    rotate: 4,
    y: 24,
    tint: "bg-surface2 hover:bg-white/10 border-white/10",
    text: "text-paper",
    icon: "text-paper group-hover:text-accent",
  },
  {
    rotate: -3,
    y: -16,
    tint: "bg-accent2 hover:brightness-110 border-transparent",
    text: "text-ink",
    icon: "text-ink group-hover:text-ink",
  },
  {
    rotate: 7,
    y: 12,
    tint: "bg-accent3 hover:brightness-110 border-transparent",
    text: "text-ink",
    icon: "text-ink group-hover:text-ink",
  },
  {
    rotate: -5,
    y: -8,
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
      // min-h-[85vh] is load-bearing, not decorative: this section rides up
      // over Hero via -mt-[70vh] and (at z-20, above Hero's z-10) is what
      // hides Hero's sticky name/photo once you scroll past it. The old
      // multi-row grid of cards was tall enough on its own to cover that
      // 70vh; the single-row blob layout is much shorter, so without an
      // explicit min-height Hero's name/photo were peeking out below this
      // section into whatever comes next. Keep this >= 70vh with margin.
      className="relative z-20 -mt-[70vh] flex min-h-[85vh] scroll-mt-6 flex-col justify-center rounded-t-[3rem] bg-ink px-6 pb-24 pt-6 text-center sm:pb-32 sm:pt-8"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-sm font-medium uppercase tracking-widest text-muted">
          Explore my work by discipline
        </h2>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 sm:flex-nowrap sm:gap-3">
          {tiles.map((tile, i) => {
            const Icon = iconMap[tile.id] ?? Images;
            const shape = blobShapes[i % blobShapes.length];
            const { rotate, y, tint, text, icon } =
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
                  transitionDelay: visible ? `${i * 60}ms` : "0ms",
                  borderRadius: shape,
                  transform: `rotate(${rotate}deg) translateY(${
                    visible ? y : y + 16
                  }px) scale(${entranceScale * hoverScale})`,
                }}
                className={`group flex aspect-square w-36 shrink-0 flex-col items-center justify-center gap-3 border p-6 text-center transition-all duration-500 ease-out sm:w-40 ${tint} ${text} ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                <Icon className={`h-9 w-9 transition ${icon}`} strokeWidth={1.5} />
                <span className="text-base font-semibold leading-snug">
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
