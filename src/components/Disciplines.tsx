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
// border box is rectangular and gets chopped at odd angles) — instead each
// tile is two nested elements sharing the same clip-path: an outer one
// filled with the outline color, and an inset inner one (via padding)
// filled with the tile's real color, so the outline color shows through
// as a thin uniform ring around the star.
const brightOrange = "#FF7A1A";
const outlineColor = "rgba(250, 250, 250, 0.35)";

// Rotation + x/y offset per tile so the row reads as scattered/eccentric
// in its placement, feeding a single JS-computed transform (see render)
// rather than Tailwind's rotate-*/translate-* utilities, since those and
// an inline `style.transform` would fight over the same CSS property —
// inline style always wins, silently no-op'ing the classes. Every tile
// also gets a real hover color shift on its icon/label now (cross-mixed
// with the palette — green tile hovers orange, blue tile hovers green,
// etc.) instead of some tiles just staying put.
const blobStyle = [
  {
    rotate: -18,
    x: -30,
    y: -20,
    tint: "bg-accent hover:brightness-110",
    text: "text-ink",
    hoverText: "group-hover:text-[#FF7A1A]",
  },
  {
    rotate: 13,
    x: 34,
    y: 60,
    tint: "bg-surface2 hover:bg-white/10",
    text: "text-paper",
    hoverText: "group-hover:text-accent",
  },
  {
    rotate: -15,
    x: -42,
    y: -56,
    tint: "bg-accent2 hover:brightness-110",
    text: "text-ink",
    hoverText: "group-hover:text-accent",
  },
  {
    rotate: 20,
    x: 44,
    y: 34,
    tint: "hover:brightness-110",
    tintStyle: { backgroundColor: brightOrange },
    text: "text-ink",
    hoverText: "group-hover:text-accent2",
  },
  {
    rotate: -12,
    x: 10,
    y: -72,
    tint: "bg-paper hover:brightness-95",
    text: "text-ink",
    hoverText: "group-hover:text-accent",
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
      // min-h-[110vh] is load-bearing, not decorative: this section rides up
      // over Hero via -mt-[70vh] and (at z-20, above Hero's z-10) is what
      // hides Hero's sticky name/photo once you scroll past it. Bumped up
      // again alongside the bigger, more-widely-scattered shapes (now
      // offset up to ±72px vertically) so there's still headroom above the
      // required 70vh cover.
      className="relative z-20 -mt-[70vh] flex min-h-[110vh] scroll-mt-6 flex-col justify-center rounded-t-[3rem] bg-ink px-6 pb-24 pt-6 text-center sm:pb-32 sm:pt-8"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 text-sm font-medium uppercase tracking-widest text-muted">
          Explore my work by discipline
        </h2>
        <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-x-16 gap-y-20 sm:gap-x-10 lg:justify-between">
          {tiles.map((tile, i) => {
            const Icon = iconMap[tile.id] ?? Images;
            const { rotate, x, y, tint, tintStyle, text, hoverText } =
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
                  backgroundColor: outlineColor,
                  transform: `translate(${x}px, ${
                    visible ? y : y + 16
                  }px) rotate(${rotate}deg) scale(${
                    entranceScale * hoverScale
                  })`,
                }}
                className={`group flex aspect-square w-48 shrink-0 p-[3px] transition-all duration-500 ease-out sm:w-56 lg:w-64 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  style={{ clipPath: starClipPath, ...tintStyle }}
                  className={`flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center transition-colors duration-300 ${tint} ${text}`}
                >
                  <Icon
                    className={`h-10 w-10 transition-colors duration-300 sm:h-12 sm:w-12 ${hoverText}`}
                    strokeWidth={1.5}
                  />
                  <span
                    className={`text-base font-semibold leading-snug transition-colors duration-300 sm:text-lg ${hoverText}`}
                  >
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
