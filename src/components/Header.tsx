import Link from "next/link";
import { categories } from "@/data/projects";

// Global nav — sticky across every page (wired into layout.tsx). Dark
// theme + real category page links, replacing the unused light-themed
// version left over from the original starter (which pointed at stale
// #anchor sections instead of the actual /build, /design, etc. pages).
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-paper transition hover:text-accent"
        >
          Riley Byers
        </Link>
        <ul className="hidden gap-6 text-sm sm:flex">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/${c.id}`}
                className="text-muted transition hover:text-accent"
              >
                {c.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/#contact"
              className="text-muted transition hover:text-accent"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
