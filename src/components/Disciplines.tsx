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

// Each tile gets one clear, unique primary color that holds the first ~60%
// of the tile solid (so the tile reads as "the green one" / "the pink one"
// at a glance), then eases into a second accent hue for the last stretch —
// the gradient flourish from before, just dialed back so it's a corner
// accent rather than an even three-way blend that made it hard to say what
// color any given tile actually was.
const blobStyle = [
  { gradient: "linear-gradient(135deg, #C8FF3D 0%, #C8FF3D 60%, #FFD23D 100%)" }, // build — chartreuse
  { gradient: "linear-gradient(135deg, #FB923C 0%, #FB923C 60%, #FFD23D 100%)" }, // design — orange
  { gradient: "linear-gradient(160deg, #7DD3FC 0%, #7DD3FC 60%, #2DD4BF 100%)" }, // play — cool blue, teal ombre
  { gradient: "linear-gradient(180deg, #9CA3AF 0%, #9CA3AF 60%, #E5E7EB 100%)" }, // discover — grey
  { gradient: "linear-gradient(140deg, #FF8FD8 0%, #FF8FD8 60%, #FB923C 100%)" }, // write — bright light pink, orange ombre
];

export default function Disciplines() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Accordion-style: all tiles sit collapsed as narrow rounded rectangles
  // by default. Hovering one expands it to full square size; moving the
  // mouse off collapses it back, so nothing stays expanded once you're
  // not actively hovering a tile.
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
      className="relative z-20 -mt-[40vh] min-h-[85vh] scroll-mt-6 rounded-t-[3rem] bg-ink px-6 pb-16 pt-10 text-center sm:pl-12 sm:pr-24 sm:pt-14 lg:pl-20 lg:pr-40 xl:pl-28 xl:pr-56"
    >
      <div className="mx-auto w-full">
        {/* Heading + tile row share one flex row on larger screens — label
            on the left, tiles pushed to the right via justify-between —
            so together they stretch edge to edge instead of sitting in a
            narrow centered column. Stays stacked (label above, tiles
            centered below) below sm, since there's no room for that on an
            iOS-width screen. */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <h2 className="max-w-[11ch] text-4xl font-bold uppercase leading-tight tracking-wide text-paper sm:shrink-0 sm:text-left sm:text-5xl lg:text-6xl">
            Explore my work by discipline
          </h2>
          {/* One row, fixed height, fixed per-tile layout width — nothing
              ever actually reflows on hover; every bit of motion here is a
              transform, on one of three stacked layers per tile, each with
              its own independent transition so they don't have to share a
              single duration:
              1. This outer div — entrance only (translateY + scale, 1100ms).
              2. The middle div below — the symmetric "shove" (translateX,
                 500ms): every tile on the far side of the hovered one
                 slides away by exactly half the hovered tile's growth, so
                 neighbors genuinely get pushed apart instead of just
                 sitting there while the hovered tile overlaps them.
              3. The Link itself — the hovered tile's own growth (scaleX,
                 500ms), centered via `origin-center` so it grows evenly in
                 both directions from its own middle — which is exactly
                 the amount of clearance the shove on layer 2 is making.
              A transform-based shove like this (rather than a real width
              change rippling through the row) is what makes the growth
              symmetric in the first place — a real width change's growth
              direction depends on the row's own alignment, not the tile's
              center, which was the original "grows left then right" bug. */}
          <div className="flex h-56 items-stretch justify-center gap-3 sm:h-64 sm:justify-end sm:gap-4 lg:h-72">
            {tiles.map((tile, i) => {
              const Icon = iconMap[tile.id] ?? Images;
              const { gradient } = blobStyle[i % blobStyle.length];
              const hoveredIndex = tiles.findIndex((t) => t.id === hoveredId);
              const isActive = i === hoveredIndex;
              const isHovering = hoveredIndex !== -1;
              const entranceScale = visible ? 1 : 0.85;
              // Floats up from below into its resting spot on entrance —
              // combined with the per-tile stagger delay below, tiles
              // arrive one after another in sequence (build, design,
              // play...) so the reveal reads like a staircase rather than
              // everything fading in at once.
              const entranceY = visible ? 0 : 180;
              // Shove direction relative to whichever tile is hovered:
              // half of the hovered tile's own growth (84px / 88px / 96px
              // at base/sm/lg — half of 224-56, 256-80, 288-96), in
              // whichever direction clears space for it.
              const shoveClass = !isHovering || isActive
                ? "translate-x-0"
                : i < hoveredIndex
                  ? "-translate-x-[84px] sm:-translate-x-[88px] lg:-translate-x-[96px]"
                  : "translate-x-[84px] sm:translate-x-[88px] lg:translate-x-[96px]";
              return (
                <div
                  key={tile.id}
                  style={{
                    transitionDelay: visible ? `${i * 120}ms` : "0ms",
                    transform: `translateY(${entranceY}px) scale(${entranceScale})`,
                  }}
                  className={`shrink-0 transition duration-[1100ms] ease-out ${
                    visible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div
                    className={`transform-gpu transition-transform duration-500 ease-out ${shoveClass}`}
                  >
                    <Link
                      href={tile.href}
                      onMouseEnter={() => setHoveredId(tile.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ background: gradient }}
                      className={`group relative flex h-56 w-14 origin-center transform-gpu flex-col items-center justify-center rounded-2xl p-3 text-center text-ink transition-transform duration-500 ease-out sm:h-64 sm:w-20 sm:rounded-3xl lg:h-72 lg:w-24 ${
                        isActive
                          ? "z-30 scale-x-[4] sm:scale-x-[3.2] lg:scale-x-[3]"
                          : "z-0 scale-x-100"
                      }`}
                    >
                      <div
                        className={`flex origin-center transform-gpu flex-col items-center justify-center gap-2 transition-transform duration-500 ease-out sm:gap-3 ${
                          isActive
                            ? "scale-x-[0.25] sm:scale-x-[0.3125] lg:scale-x-[0.3333]"
                            : "scale-x-100"
                        }`}
                      >
                        <Icon
                          className={`shrink-0 transition-all duration-300 ${
                            isActive ? "h-7 w-7 sm:h-12 sm:w-12" : "h-5 w-5 sm:h-6 sm:w-6"
                          }`}
                          strokeWidth={1.5}
                        />
                        <span
                          className={`whitespace-nowrap font-semibold leading-snug transition-all duration-300 ${
                            isActive
                              ? "text-xs opacity-100 sm:text-lg"
                              : "hidden text-[10px] opacity-0 sm:block"
                          }`}
                        >
                          {tile.label}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
