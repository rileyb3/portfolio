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

// Each tile gets an explicit (top%, left%) position within a tall relative
// canvas (see JSX below) instead of sitting in one horizontal row — that's
// what actually fills the empty space above/below a single centered row.
// Positions are staggered corner/center/corner/corner/corner-ish across the
// full canvas so the whole area reads as occupied. rotate feeds a single
// JS-computed transform (see render) rather than Tailwind's rotate-*
// utilities, since those and an inline `style.transform` would fight over
// the same CSS property — inline style always wins, silently no-op'ing the
// classes. Every tile also gets a real hover color shift on its icon/label
// (cross-mixed with the palette — green tile hovers orange, blue tile
// hovers green, etc.) instead of some tiles just staying put.
// Zigzagging x positions (12/30/50/68/86%) with alternating high/low y —
// rather than the previous "pair left, pair right, one lonely in the
// middle" layout, which read as three isolated clusters with huge dead
// gaps between them. Bigger tiles (see render) + this even stagger is what
// actually closes up the black space.
const blobStyle = [
  {
    top: "30%",
    left: "12%",
    rotate: -18,
    tint: "bg-accent hover:brightness-110",
    text: "text-ink",
    hoverText: "group-hover:text-[#FF7A1A]",
  },
  {
    top: "64%",
    left: "30%",
    rotate: 13,
    tint: "bg-surface2 hover:bg-white/10",
    text: "text-paper",
    hoverText: "group-hover:text-accent",
  },
  {
    top: "32%",
    left: "50%",
    rotate: -15,
    tint: "bg-accent2 hover:brightness-110",
    text: "text-ink",
    hoverText: "group-hover:text-accent",
  },
  {
    top: "66%",
    left: "70%",
    rotate: 20,
    tint: "hover:brightness-110",
    tintStyle: { backgroundColor: brightOrange },
    text: "text-ink",
    hoverText: "group-hover:text-accent2",
  },
  {
    top: "30%",
    left: "88%",
    rotate: -12,
    tint: "bg-paper hover:brightness-95",
    text: "text-ink",
    hoverText: "group-hover:text-[#FF7A1A]",
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
      // rides up over Hero via -mt-[70vh] and (at z-20, above Hero's z-10)
      // is what hides Hero's sticky name/photo once you scroll past it. The
      // canvas below (h-[60-70vh] depending on breakpoint) plus its own
      // padding/heading already clears the required 70vh on its own — this
      // floor only kicks in on unusually short viewports, so it shouldn't
      // add visible extra empty space beyond what the content needs.
      className="relative z-20 -mt-[70vh] min-h-[85vh] scroll-mt-6 rounded-t-[3rem] bg-ink px-6 pb-16 pt-10 text-center sm:pt-14"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-muted">
          Explore my work by discipline
        </h2>
        {/* Relative canvas the tiles are pinned into by (top%, left%) — this
            is what actually fills the empty space, versus a single row
            that only ever occupies one horizontal band no matter how much
            room it's given. Positions all stay well below 0% so nothing
            ever rises above this heading. */}
        <div className="relative mx-auto h-[60vh] w-full sm:h-[65vh] lg:h-[70vh]">
          {tiles.map((tile, i) => {
            const Icon = iconMap[tile.id] ?? Images;
            const { top, left, rotate, tint, tintStyle, text, hoverText } =
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
                  top,
                  left,
                  transitionDelay: visible ? `${i * 60}ms` : "0ms",
                  clipPath: starClipPath,
                  backgroundColor: outlineColor,
                  transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${
                    entranceScale * hoverScale
                  })`,
                }}
                className={`group absolute flex aspect-square w-48 shrink-0 p-[3px] transition-all duration-500 ease-out sm:w-64 lg:w-72 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  style={{ clipPath: starClipPath, ...tintStyle }}
                  className={`flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center transition-colors duration-300 ${tint} ${text}`}
                >
                  <Icon
                    className={`h-12 w-12 transition-colors duration-300 sm:h-14 sm:w-14 ${hoverText}`}
                    strokeWidth={1.5}
                  />
                  <span
                    className={`text-lg font-semibold leading-snug transition-colors duration-300 sm:text-xl ${hoverText}`}
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
