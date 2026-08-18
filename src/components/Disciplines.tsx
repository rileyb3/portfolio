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
        {/* One row, five equal-width columns — grid (not flex) so the
            columns and the gaps between them both stay perfectly even
            regardless of tile count. */}
        <div className="mx-auto grid grid-cols-5 gap-3 sm:gap-6">
          {tiles.map((tile, i) => {
            const Icon = iconMap[tile.id] ?? Images;
            const { gradient } = blobStyle[i % blobStyle.length];
            const entranceScale = visible ? 1 : 0.85;
            const hoverScale = hoveredId === tile.id ? 1.05 : 1;
            return (
              <Link
                key={tile.id}
                href={tile.href}
                onMouseEnter={() => setHoveredId(tile.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: gradient,
                  transitionDelay: visible ? `${i * 60}ms` : "0ms",
                  transform: `scale(${entranceScale * hoverScale})`,
                }}
                className={`group flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl p-3 text-center text-ink transition-all duration-500 ease-out sm:gap-3 sm:rounded-3xl sm:p-6 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                <Icon
                  className="h-7 w-7 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12"
                  strokeWidth={1.5}
                />
                <span className="text-xs font-semibold leading-snug sm:text-lg">
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
