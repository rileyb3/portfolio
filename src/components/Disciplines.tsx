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
  { gradient: "linear-gradient(140deg, #E8A5C7 0%, #E8A5C7 60%, #FB923C 100%)" }, // design — muted pink, orange ombre
  { gradient: "linear-gradient(160deg, #2DD4BF 0%, #2DD4BF 60%, #7DD3FC 100%)" }, // play — teal
  { gradient: "linear-gradient(180deg, #9CA3AF 0%, #9CA3AF 60%, #E5E7EB 100%)" }, // discover — grey
  { gradient: "linear-gradient(135deg, #FB923C 0%, #FB923C 60%, #FFD23D 100%)" }, // write — orange
];

export default function Disciplines() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Accordion-style: one tile is expanded to full square size at a time,
  // the rest sit collapsed as narrow rounded rectangles. Hovering a
  // collapsed tile makes it the expanded one; it stays expanded (rather
  // than snapping back on mouse-leave) until another tile is hovered.
  const [activeId, setActiveId] = useState(tiles[0].id);

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
        {/* One row, fixed height. The active tile is as wide as it is
            tall (a square); every other tile collapses to a narrow
            rounded rectangle at the same height. Widths animate via
            `transition-all` on plain Tailwind width classes, which is
            just as animatable as an inline style here. */}
        <div className="mx-auto flex h-56 items-stretch justify-center gap-3 sm:h-64 sm:gap-4 lg:h-72">
          {tiles.map((tile, i) => {
            const Icon = iconMap[tile.id] ?? Images;
            const { gradient } = blobStyle[i % blobStyle.length];
            const isActive = activeId === tile.id;
            const entranceScale = visible ? 1 : 0.85;
            return (
              <Link
                key={tile.id}
                href={tile.href}
                onMouseEnter={() => setActiveId(tile.id)}
                style={{
                  background: gradient,
                  transitionDelay: visible ? `${i * 60}ms` : "0ms",
                  transform: `scale(${entranceScale})`,
                }}
                className={`group flex shrink-0 flex-col items-center justify-center gap-2 rounded-2xl p-3 text-center text-ink transition-all duration-500 ease-out sm:rounded-3xl ${
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
    </section>
  );
}
