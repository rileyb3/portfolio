import Link from "next/link";
import { profile } from "@/data/projects";

// Global nav — sticky across every page (wired into layout.tsx). The
// About/Experience/Contact links used to render here too; now they only
// live in Hero's white bar on the homepage, so this bar is just the
// brand + CTA. navLinks stays exported/defined here since Hero still
// imports it for that bar.
export const navLinks = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <nav className="flex items-center gap-8 border-b border-white/10 bg-ink px-4 py-1 shadow-lg sm:px-8">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-wide text-paper transition hover:text-accent"
        >
          Riley Byers
        </Link>

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
