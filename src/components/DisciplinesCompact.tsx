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

// A slimmed-down version of the homepage's "Explore my work by
// discipline" tiles — small pills in a single row instead of big square
// cards, for use at the top of the Experience page (no hero photo behind
// it here, so none of the overlap/parallax mechanics from the homepage
// version apply).
export default function DisciplinesCompact() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-4 text-center">
      <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-muted">
        Explore my work by discipline
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((c) => {
          const Icon = iconMap[c.id] ?? Images;
          return (
            <Link
              key={c.id}
              href={`/${c.id}`}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-paper transition hover:border-white/25 hover:bg-white/10"
            >
              <Icon
                className="h-4 w-4 text-paper transition group-hover:text-accent"
                strokeWidth={1.5}
              />
              {c.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
