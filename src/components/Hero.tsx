"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { profile, categories } from "@/data/projects";

// White-theme, Akihiko/Palmer-inspired redesign of the landing hero — this
// (plus Disciplines.tsx below it) is deliberately scoped as its own light
// "opening chapter": the rest of the site (Header, About, every other
// section from AccentBand down) stays on the original dark theme
// untouched, so this is a controlled experiment rather than a site-wide
// re-theme. Header renders as an opaque dark bar regardless of what's
// beneath it, so a light hero under a dark nav reads fine with no changes
// there either.
export default function Hero() {
  // Photo drifts upward as you scroll, but slower than the page itself
  // (classic parallax). Uses a continuous rAF loop that eases the
  // displayed offset toward the scroll-derived target every frame
  // (lerp), rather than jumping straight to a hard-clamped value on each
  // scroll event — that clamp-on-event approach was what caused the
  // abrupt "hits max drift and instantly freezes" stop.
  const [photoOffset, setPhotoOffset] = useState(0);

  useEffect(() => {
    let raf = 0;
    let current = 0;
    function frame() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const maxDrift = vh * 0.3;
      const target = -Math.min(scrollY * 0.3, maxDrift);
      current += (target - current) * 0.08; // lerp factor — lower = softer/laggier
      setPhotoOffset(current);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    // Outer section is taller than one screen — that extra height is the
    // runway the sticky photo holds, and separately the runway the name's
    // own wrapper (below) holds before it releases too.
    <section id="top" className="relative h-[208vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-paper">
        {/* Meta row — the "Quick Links / Based in Tokyo, Art Director"
            beat from the reference, adapted into real, clickable nav
            (each discipline links to its own page) rather than inert
            decoration. */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-8 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted sm:px-10 sm:pt-10 sm:text-xs">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {categories.map((c, i) => (
              <li key={c.id} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">·</span>}
                <Link href={`/${c.id}`} className="transition hover:text-ink">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
          <span className="hidden max-w-xs text-right sm:block">
            {profile.tagline}
          </span>
        </div>

        {/* Crisp black bar, true full viewport width, crossing the photo's
            vertical center (with a slight downward nudge). This lives as a
            direct child of the sticky panel — not inside the small photo
            wrapper below — because an absolutely positioned element's
            percentage/`inset` values resolve against its own containing
            block. Nested inside the narrow photo wrapper, `w-screen` +
            `left-1/2` centered on that small block's position, not the
            actual viewport, so the bar came out short and off-center.
            Sitting directly in the full-width sticky panel and using
            `inset-x-0` fixes that. z-0 keeps it below the photo (z-10) and
            above the plain background; it's static (no parallax) since a
            full-bleed bar shouldn't jitter with the photo's own drift. */}
        <div
          className="absolute inset-x-0 top-[225px] z-0 h-6 -translate-y-1/2 bg-ink sm:top-[312px] sm:h-8"
          aria-hidden="true"
        />

        {/* Photo: a bounded, framed card in the upper right, with a soft
            blue/green glow behind it for an "ocean, not literal" feel
            rather than a flat cutout edge. Card + glow move together with
            the same parallax drift the old full-bleed photo used. */}
        <div
          className="absolute right-6 top-24 z-10 aspect-[4/5] w-[46vw] max-w-[220px] will-change-transform sm:right-10 sm:top-28 sm:w-72 sm:max-w-none"
          style={{ transform: `translateY(${photoOffset}px)` }}
        >
          <div
            className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-accent2/50 via-accent/25 to-transparent blur-3xl"
            aria-hidden="true"
          />
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-ink/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photoSrc}
              alt={profile.name}
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* Name: wrapper's natural top is 70vh down the page, so a slice of
          it peeks up from the bottom edge at scroll=0. Scrolling moves it
          up in normal flow (1:1 with the page) until it hits the sticky
          threshold below (top-[60%] = 60vh) at scrollY≈10vh, where it
          locks. Plain live text, sized big enough that it runs off both
          edges of the screen — globals.css sets overflow-x:hidden so that
          doesn't create a horizontal scrollbar. Fixed black on the white
          panel, no color animation. */}
      <div className="absolute inset-x-0 top-[70vh] z-10 h-[138vh]">
        <h1 className="pointer-events-none sticky top-[60%] mx-auto w-fit whitespace-nowrap font-sans text-5xl font-semibold leading-none tracking-tight text-ink sm:text-[12rem] lg:text-[15rem]">
          {profile.name}
        </h1>
      </div>
    </section>
  );
}
