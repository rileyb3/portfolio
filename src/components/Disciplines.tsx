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
          {/* One row, fixed height. The active tile is as wide as it is
              tall (a square); every other tile collapses to a narrow
              rounded rectangle at the same height. Widths animate via
              `transition-all` on plain Tailwind width classes, which is
              just as animatable as an inline style here. */}
          <div className="flex h-56 items-stretch justify-center gap-3 sm:h-64 sm:justify-end sm:gap-4 lg:h-72">
            {tiles.map((tile, i) => {
              const Icon = iconMap[tile.id] ?? Images;
              const { gradient } = blobStyle[i % blobStyle.length];
              const isActive = hoveredId === tile.id;
              const entranceScale = visible ? 1 : 0.85;
              // Floats up from below into its resting spot on entrance —
              // combined with the per-tile stagger delay below, tiles
              // arrive one after another in sequence (build, design,
              // play...) so the reveal reads like a staircase rather than
              // everything fading in at once. Distance and duration are
              // both exaggerated (96px / 1100ms, vs. a plain 500ms
              // transition-all) specifically for transform+opacity, via
              // an explicit `transition` list rather than Tailwind's
              // `transition-all` — that keeps the hover expand/collapse
              // (width/padding/gap) snappy at its own 500ms instead of
              // also getting slowed down along with the entrance.
              const entranceY = visible ? 0 : 96;
              return (
                <Link
                  key={tile.id}
                  href={tile.href}
                  onMouseEnter={() => setHoveredId(tile.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: gradient,
                    transitionDelay: visible ? `${i * 120}ms` : "0ms",
                    transform: `translateY(${entranceY}px) scale(${entranceScale})`,
                    transition:
                      "transform 1100ms ease-out, opacity 1100ms ease-out, width 500ms ease-out, padding 500ms ease-out, gap 500ms ease-out",
                  }}
                  className={`group flex shrink-0 flex-col items-center justify-center gap-2 rounded-2xl p-3 text-center text-ink sm:rounded-3xl ${
                    isActive
                      ? "w-56 sm:w-64 sm:gap-3 sm:p-6 lg:w-72"
                      : "w-14 sm:w-20 lg:w-24"
                  } ${visible ? "opacity-100" : "opacity-0"}`}
                >
                  <Icon
                    className={`shrink-0 transition-all duration-300 ${
                      isActive ? "h-7 w-7 sm:h-12 sm:w-12" : "h-5 w-5 sm:h-6 sm:w-6"
                    }`}
                    strokeWidth={1.5}
                  />
                  <span
                    className={`font-semibold leading-snug transition-all duration-300 ${
                      isActive
                        ? "text-xs opacity-100 sm:text-lg"
                        : "hidden text-[10px] opacity-0 sm:block"
                    }`}
                  >
                    {tile.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
