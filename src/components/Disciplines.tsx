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

// Gave up on the star/blob shape experiment — two rounds of hand-drawn
// clip-path polygons both landed badly (too sharp, illegible, overlaps
// that didn't read as intentional). Plain rounded squares in an evenly
// spaced grid, with the same bright gradients carrying the color/energy
// instead of the outline.
const gradients = [
  "linear-gradient(135deg, #C8FF3D 0%, #FFD23D 55%, #FF6EC7 100%)",
  "linear-gradient(140deg, #FF6EC7 0%, #FF9A3D 60%, #FFD23D 100%)",
  "linear-gradient(160deg, #3DFFE0 0%, #7DFFA3 100%)",
  "linear-gradient(180deg, #3DD1FF 0%, #7DD3FC 55%, #8FA89B 100%)",
  "linear-gradient(135deg, #3DD1FF 0%, #7DD3FC 50%, #7DFFA3 100%)",
];

export default function Disciplines() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
    // Normal flow now — no negative margin/overlap trick, since Hero no
    // longer has a sticky element that needs covering. bg-paper matches
    // Hero above and the rest of the landing page below.
    <section
      id="disciplines"
      ref={ref}
      className="scroll-mt-6 bg-paper px-6 py-20 text-center sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-sm font-medium uppercase tracking-widest text-muted">
          Explore my work by discipline
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
          {tiles.map((tile, i) => {
            const Icon = iconMap[tile.id] ?? Images;
            return (
              <Link
                key={tile.id}
                href={tile.href}
                style={{
                  background: gradients[i % gradients.length],
                  transitionDelay: visible ? `${i * 60}ms` : "0ms",
                }}
                className={`group flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl p-6 text-ink shadow-sm transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-lg ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <Icon
                  className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12"
                  strokeWidth={1.5}
                />
                <span className="text-base font-semibold sm:text-lg">
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
