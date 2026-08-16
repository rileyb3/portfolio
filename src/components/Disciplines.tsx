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

// Five distinct irregular, spiky, non-uniform star outlines — unlike the
// old single shared shape, each tile now gets its own hand-varied polygon
// (different point count, different spike lengths/angles) so the cluster
// reads as genuinely irregular rather than one stencil rotated five times.
const starShapes = [
  "polygon(48% 0%, 66% 28%, 100% 10%, 74% 44%, 96% 68%, 60% 58%, 82% 96%, 46% 70%, 40% 100%, 30% 62%, 4% 80%, 22% 42%, 0% 20%, 34% 30%)",
  "polygon(55% 2%, 70% 30%, 92% 4%, 68% 42%, 100% 55%, 62% 60%, 70% 92%, 42% 68%, 34% 100%, 28% 66%, 0% 70%, 24% 40%, 8% 8%, 40% 24%)",
  "polygon(40% 0%, 60% 24%, 88% 0%, 66% 38%, 100% 44%, 58% 56%, 92% 82%, 48% 64%, 52% 100%, 32% 60%, 10% 92%, 20% 46%, 0% 30%, 28% 34%)",
  "polygon(50% 4%, 64% 34%, 96% 20%, 70% 50%, 100% 74%, 56% 62%, 66% 100%, 40% 72%, 36% 100%, 26% 64%, 0% 58%, 20% 40%, 6% 6%, 38% 22%)",
  "polygon(46% 0%, 68% 26%, 94% 6%, 70% 40%, 100% 60%, 60% 54%, 78% 100%, 44% 66%, 42% 96%, 24% 58%, 2% 76%, 22% 38%, 0% 12%, 32% 28%)",
];

// A clip-path shape like this doesn't play well with a CSS border (the
// border box is rectangular and gets chopped at odd angles) — instead each
// tile is two nested elements sharing its own clip-path: an outer one
// filled solid white (the page background), and an inset inner one (via
// padding) filled with the tile's gradient, so wherever two tiles overlap,
// the opaque white ring shows through as a clean gap between them — the
// "gaps where they overlap" effect — rather than the colors muddying
// together.
const outlineColor = "#ffffff";

// Bright, non-uniform gradients per tile — genuinely different hues rather
// than tints of the same accent, per "bright colors" + "gradient". rotate
// feeds a single JS-computed transform (see render) rather than Tailwind's
// rotate-* utilities, since those and an inline `style.transform` would
// fight over the same CSS property — inline style always wins, silently
// no-op'ing the classes.
const blobStyle = [
  {
    top: "38%",
    left: "20%",
    rotate: -16,
    gradient: "linear-gradient(135deg, #C8FF3D 0%, #FFD23D 55%, #FF6EC7 100%)",
  },
  {
    top: "30%",
    left: "42%",
    rotate: 10,
    gradient: "linear-gradient(140deg, #FF6EC7 0%, #FF9A3D 60%, #FFD23D 100%)",
  },
  {
    top: "56%",
    left: "38%",
    rotate: -10,
    gradient: "linear-gradient(160deg, #3DFFE0 0%, #7DFFA3 100%)",
  },
  {
    top: "46%",
    left: "62%",
    rotate: 18,
    gradient: "linear-gradient(180deg, #3DD1FF 0%, #7DD3FC 55%, #8FA89B 100%)",
  },
  {
    top: "62%",
    left: "58%",
    rotate: -14,
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
      // rides up over Hero via -mt-[70vh] and (at z-20, above Hero's z-10)
      // is what hides Hero's sticky name/photo once you scroll past it. The
      // canvas below (h-[60-70vh] depending on breakpoint) plus its own
      // padding/heading already clears the required 70vh on its own — this
      // floor only kicks in on unusually short viewports, so it shouldn't
      // add visible extra empty space beyond what the content needs. bg-paper
      // matches Hero above it — this and Hero are a deliberate light
      // "opening chapter"; everything from AccentBand down stays on the
      // original dark theme, untouched.
      className="relative z-20 -mt-[70vh] min-h-[85vh] scroll-mt-6 rounded-t-[3rem] bg-paper px-6 pb-16 pt-10 text-center sm:pt-14"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-muted">
          Explore my work by discipline
        </h2>
        {/* Relative canvas the tiles are pinned into by (top%, left%) —
            positioned close enough together on purpose now that the stars
            overlap, so the white outline ring between them reads as
            deliberate gaps rather than a random scatter. */}
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
                className={`group absolute flex aspect-square w-40 shrink-0 p-[5px] transition-all duration-500 ease-out sm:w-52 lg:w-60 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  style={{ clipPath: shape, background: gradient }}
                  className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center text-ink"
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
