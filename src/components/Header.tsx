import Link from "next/link";
import { categories, profile } from "@/data/projects";

// Global nav — sticky across every page (wired into layout.tsx). Kept
// deliberately plain: text-only links, no icons or per-item pill
// backgrounds — those were adding visual noise once the rest of the
// homepage got busier. One accent-colored CTA (Download CV) is the only
// strong visual element in the bar.
export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <nav className="flex items-center gap-8 border-b border-white/10 bg-surface/90 px-4 py-1 shadow-lg backdrop-blur sm:px-8">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-wide text-paper transition hover:text-accent"
        >
          Riley Byers
        </Link>

        <ul className="hidden items-center gap-1 text-sm sm:flex">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/${c.id}`}
                className="inline-block px-2.5 py-1 text-muted transition hover:bg-accent hover:text-ink"
              >
                {c.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/#contact"
              className="inline-block px-2.5 py-1 text-muted transition hover:bg-accent hover:text-ink"
            >
              Contact
            </Link>
          </li>
        </ul>

        <Link
          href={profile.cvHref}
          download
          className="ml-auto hidden shrink-0 items-center bg-accent px-4 py-1 text-sm font-medium text-ink transition hover:opacity-85 sm:inline-flex"
        >
          Download CV
        </Link>
      </nav>
    </header>
  );
}
