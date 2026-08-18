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
      <div className="sticky top-0 h-screen bg-ink">
        {/* Nav bar — the bar's the only in-flow content in this panel (the
            CV link and photo below are both absolute, out of flow), so its
            own margin-top is its full static offset: 213px / 296px, which
            is where the old absolutely-positioned bar crossed the photo.
            `sticky top-0` then takes it from there — at scroll=0 it
            renders at that static spot, and scrolling up by that same
            distance carries it to the viewport's top edge, where it
            catches and rides along with the screen for the rest of the
            panel's pin duration, rather than staying fixed mid-photo the
            whole time. This only works because the panel lost its
            `overflow-hidden` (that was clipping the sticky child's scroll
            reference down to the panel's own non-scrolling box, which
            never gave it anywhere to travel to). Staying a plain DOM child
            here — same stacking context as the photo — is also what keeps
            it simply behind the photo (z-0 vs the photo's z-10) wherever
            they cross, without needing any cross-context z-index games.
            Words are spread with justify-between plus a wide right padding
            sized to stop just shy of the photo, so the last link lands
            close to the image without sliding underneath it. */}
        <div className="sticky top-0 z-0 mt-[213px] flex h-6 items-center justify-between bg-paper pl-6 pr-6 text-xs sm:mt-[296px] sm:h-8 sm:pl-10 sm:pr-[21rem] sm:text-sm">
          <Link
            href="/"
            className="shrink-0 font-semibold tracking-wide text-ink transition hover:text-accent3"
          >
            Riley Byers
          </Link>
          <ul className="hidden items-center gap-10 sm:flex">
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
