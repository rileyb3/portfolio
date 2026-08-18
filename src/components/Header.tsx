"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/data/projects";

// Global nav — sticky across every page except the homepage. On the
// homepage the nav lives inside Hero's white bar instead (and Download CV
// floats free at the top right), so this bar renders null there rather
// than stacking a second bar on top of that treatment.
export const navLinks = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50">
      <nav className="flex items-center gap-8 border-b border-white/10 bg-ink px-4 py-1 shadow-lg sm:px-8">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-wide text-paper transition hover:text-accent"
        >
          Riley Byers
        </Link>

        <ul className="hidden items-center gap-1 text-sm sm:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-block px-2.5 py-1 text-muted transition hover:bg-accent hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={profile.cvHref}
          download
          className="ml-auto hidden shrink-0 items-center text-sm font-medium text-accent transition hover:opacity-80 sm:inline-flex"
        >
          Download CV
        </Link>
      </nav>
    </header>
  );
}
