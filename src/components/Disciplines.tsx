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

const cardStyle =
  "border border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10";

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
    <section
      id="disciplines"
      ref={ref}
      className="relative z-20 -mt-[15vh] scroll-mt-6 rounded-t-[3rem] bg-ink px-6 pb-24 pt-6 text-center sm:pb-32 sm:pt-8"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-sm font-medium uppercase tracking-widest text-muted">
          Explore my work by discipline
        </h2>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-3">
          {tiles.map((tile, i) => {
            const Icon = iconMap[tile.id] ?? Images;
            return (
              <Link
                key={tile.id}
                href={tile.href}
                style={{ transitionDelay: visible ? `${i * 60}ms` : "0ms" }}
                className={`group flex aspect-square flex-col items-center justify-center gap-4 rounded-2xl p-8 text-center text-paper transition duration-500 ease-out ${cardStyle} ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <Icon
                  className="h-12 w-12 text-paper transition group-hover:scale-110 group-hover:text-accent"
                  strokeWidth={1.5}
                />
                <span className="text-xl font-semibold leading-snug">
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
