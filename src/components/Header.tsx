import Link from "next/link";
import { profile } from "@/data/projects";

// Global nav — sticky across every page (wired into layout.tsx). Three
// pills: the name, About, and the CV download, which keeps its place on
// the right. The name is a plain link back to the sea — it's the one
// reliable way home from anywhere, so it does that and nothing else. The
// short intro card lives on the word "Riley" in the homepage's own
// "Sea of Riley" title instead (see SeaScene).
//
// navLinks stays exported because Hero.tsx still imports it for the white
// bar it draws; the homepage no longer renders Hero, but the file is still
// in the tree.
export const navLinks = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      {/* No bottom border — the pills already read as their own layer, and
          a rule under them just cut the scene in half. */}
      <nav className="flex items-center gap-3 bg-ink px-4 py-2 sm:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-full border border-white/15 px-4 py-1.5 text-sm font-semibold tracking-wide text-paper transition hover:border-accent/50 hover:text-accent"
        >
          {profile.name}
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/about"
            className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-paper transition hover:border-accent/50 hover:text-accent"
          >
            About
          </Link>
          <Link
            href={profile.cvHref}
            download
            className="rounded-full border border-accent3/60 bg-accent3/10 px-4 py-1.5 text-sm font-medium text-accent3 transition hover:bg-accent3/20"
          >
            Download CV
          </Link>
        </div>
      </nav>
    </header>
  );
}
