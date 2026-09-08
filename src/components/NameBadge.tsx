"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { profile } from "@/data/projects";

// The name in the top bar, with a short "who is this" card on hover or
// click. The homepage's own h1 is "Sea of Riley", so the full name needs a
// home of its own — and it's a natural place to hang a one-line
// introduction without spending a whole section on it.
//
// Click toggles as well as hover so it works on touch, where there is no
// hover; the card carries the links (Home, About) that the wordmark used
// to carry by itself.
export default function NameBadge() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`rounded-full border px-4 py-1.5 text-sm font-semibold tracking-wide transition ${
          open
            ? "border-accent/60 bg-accent/10 text-accent"
            : "border-white/15 text-paper hover:border-accent/50 hover:text-accent"
        }`}
      >
        {profile.name}
      </button>

      <div
        className={`absolute left-0 top-full z-50 w-72 origin-top-left rounded-2xl border border-white/10 bg-surface/95 p-4 shadow-2xl backdrop-blur-md transition ${
          open
            ? "pointer-events-auto translate-y-2 opacity-100"
            : "pointer-events-none translate-y-0 opacity-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-paper">{profile.tagline}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
          {profile.workYears}
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <Link href="/" className="text-muted transition hover:text-accent">
            Home
          </Link>
          <Link href="/about" className="text-accent transition hover:underline">
            More about me →
          </Link>
        </div>
      </div>
    </div>
  );
}
