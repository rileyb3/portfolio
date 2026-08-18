"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { profile } from "@/data/projects";
import { navLinks } from "@/components/Header";

// Akihiko/Palmer-inspired redesign of the landing hero — inverse color
// scheme again: dark panel, light name/text, white bar for contrast (the
// white-theme experiment this started as has been flipped back to dark).
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
    <section id="top" className="relative h-[178vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        {/* Crisp bar, true full viewport width, crossing the photo's
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
            full-bleed bar shouldn't jitter with the photo's own drift.
            White fill — the panel is dark now, so the bar needs to be the
            light color to still read against it.

            Now doubles as the site nav (moved here from the old top
            Header bar, which stays hidden on the homepage — see
            Header.tsx). Text is dark since it sits on the light bg-paper
            fill, not the dark panel; kept at the bar's original thin
            height, so nav text is sized down to fit. Hover states are
            color/weight only — no background chip — to match the bar's
            plain aesthetic and stay behind the photo (z-0) like before. */}
        <div className="absolute inset-x-0 top-[225px] z-0 flex h-6 -translate-y-1/2 items-center gap-5 bg-paper px-6 text-xs sm:top-[312px] sm:h-8 sm:px-10 sm:text-sm">
          <Link
            href="/"
            className="shrink-0 font-semibold tracking-wide text-ink transition hover:text-accent3"
          >
            Riley Byers
          </Link>
          <ul className="hidden items-center gap-5 sm:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink/70 transition hover:font-semibold hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Download CV — kept at the top right like before, but now
            floating free on the dark panel rather than living inside a
            bar. Sits above the photo (which starts lower, at top-24/28),
            so nothing overlaps it. */}
        <Link
          href={profile.cvHref}
          download
          className="absolute right-6 top-6 z-20 hidden text-sm font-medium text-accent transition hover:opacity-80 sm:right-10 sm:top-8 sm:inline-flex"
        >
          Download CV
        </Link>

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
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photoSrc}
              alt={profile.name}
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* Name: wrapper's natural top is 40vh down the page (tightened from
          70vh — the bigger number was leaving a dead blank stretch between
          the photo/bar and the name on first load), so a slice of it peeks
          up from the bottom edge at scroll=0. Scrolling moves it up in
          normal flow (1:1 with the page) until it hits the sticky
          threshold below (top-[60%], resolved against this wrapper's own
          138vh height), where it locks. Plain live text, sized big enough
          that it runs off both edges of the screen — globals.css sets
          overflow-x:hidden so that doesn't create a horizontal scrollbar.
          Fixed white on the dark panel, no color animation. */}
      <div className="absolute inset-x-0 top-[40vh] z-10 h-[138vh]">
        <h1 className="pointer-events-none sticky top-[60%] mx-auto w-fit whitespace-nowrap font-sans text-5xl font-semibold leading-none tracking-tight text-paper sm:text-[12rem] lg:text-[15rem]">
          {profile.name}
        </h1>
      </div>
    </section>
  );
}
