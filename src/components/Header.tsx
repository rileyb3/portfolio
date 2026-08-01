import Link from "next/link";
import {
  Home,
  Code2,
  Palette,
  Gamepad2,
  Microscope,
  PenTool,
  Mail,
  Download,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { categories, profile } from "@/data/projects";

// Same icon-per-discipline mapping used on the homepage discipline tiles
// (Disciplines.tsx) — kept in sync so the nav and the tiles read as one
// system rather than two different icon sets.
const iconMap: Record<string, LucideIcon> = {
  build: Code2,
  design: Palette,
  play: Gamepad2,
  discover: Microscope,
  write: PenTool,
};

// Global nav — sticky across every page (wired into layout.tsx). Floating
// rounded pill bar with icon + label nav links and a filled CV button,
// modeled on a reference layout the user shared.
export default function Header() {
  return (
    <header className="sticky top-4 z-50 px-4 sm:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-full border border-white/10 bg-surface/90 px-5 py-3 shadow-lg backdrop-blur">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-wide text-paper transition hover:text-accent"
        >
          Riley Byers
        </Link>

        <ul className="hidden items-center gap-1.5 text-sm sm:flex">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5 text-muted transition hover:bg-white/10 hover:text-paper"
            >
              <Home className="h-4 w-4" strokeWidth={1.5} />
              Home
            </Link>
          </li>
          {categories.map((c) => {
            const Icon = iconMap[c.id];
            return (
              <li key={c.id}>
                <Link
                  href={`/${c.id}`}
                  className="flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5 text-muted transition hover:bg-white/10 hover:text-paper"
                >
                  {Icon && <Icon className="h-4 w-4" strokeWidth={1.5} />}
                  {c.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/#contact"
              className="flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5 text-muted transition hover:bg-white/10 hover:text-paper"
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              Contact
            </Link>
          </li>
        </ul>

        <Link
          href={profile.cvHref}
          download
          className="hidden shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:opacity-85 sm:inline-flex"
        >
          <Download className="h-4 w-4" strokeWidth={2} />
          Download CV
        </Link>
      </nav>
    </header>
  );
}
