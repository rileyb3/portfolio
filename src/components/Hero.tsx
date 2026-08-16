"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/projects";

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
  // Drives the name's color shift as Disciplines covers it — "Riley"
  // fades ink -> accent green (stays a color pop), "Byers" fades ink ->
  // paper (dissolves into the incoming white section), so the whole thing
  // has settled into its final state before Disciplines' rise physically
  // clips it. Same mechanic as the old dark version, just inverted: there
  // it faded white->green / white->ink to hide against an ink section;
  // here it fades ink->green / ink->paper to hide against a paper one.
  const [coverProgress, setCoverProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let current = 0;
    function frame() {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      const maxDrift = vh * 0.3;
      const target = -Math.min(scrollY * 0.3, maxDrift);
      current += (target - current) * 0.08; // lerp factor — lower = softer/laggier
      setPhotoOffset(current);

      // The name rises up from just below the fold before locking (see
      // the wrapper/h1 markup below) — it locks at scrollY≈10vh.
      // Disciplines arrives at ~38vh and fully occludes the name at
      // ~78vh (see comments below / in Disciplines.tsx) — coverEnd here
      // is deliberately set to the halfway point of that range (~58vh)
      // rather than 78vh, so the color has already finished fading by
      // the time occlusion is only half done.
      const coverStart = vh * 0.38;
      const coverEnd = vh * 0.58;
      const progress = Math.min(
        Math.max((scrollY - coverStart) / (coverEnd - coverStart), 0),
        1
      );
      setCoverProgress(progress);

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  function mix(
    from: { r: number; g: number; b: number },
    to: { r: number; g: number; b: number },
    t: number
  ) {
    return `rgb(${Math.round(from.r + (to.r - from.r) * t)}, ${Math.round(
      from.g + (to.g - from.g) * t
    )}, ${Math.round(from.b + (to.b - from.b) * t)})`;
  }
  const ink = { r: 0x0a, g: 0x0a, b: 0x0a };
  const green = { r: 0xc8, g: 0xff, b: 0x3d }; // accent
  const paper = { r: 0xfa, g: 0xfa, b: 0xfa };
  const firstColor = mix(ink, green, coverProgress);
  const lastColor = mix(ink, paper, coverProgress);
  const [firstName, lastName] = profile.name.split(" ");

  return (
    // Outer section is taller than one screen — that extra height is the
    // runway the sticky photo holds, and separately the runway the name's
    // own wrapper (below) holds before it releases too.
    <section id="top" className="relative h-[208vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-paper">
        {/* Meta row — the "Quick Links / Based in Tokyo, Art Director"
            beat from the reference, adapted: disciplines on the left,
            tagline on the right. Header already provides real nav, so
            this row is atmosphere, not navigation. */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-8 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted sm:px-10 sm:pt-10 sm:text-xs">
          <span>Build · Design · Play · Discover · Write</span>
          <span className="hidden max-w-xs text-right sm:block">
            {profile.tagline}
          </span>
        </div>

        {/* Photo: a bounded, framed card in the upper right — replacing
            the old full-bleed panel — with a soft blue/green glow behind
            it for an "ocean, not literal" feel rather than a flat cutout
            edge. Card + glow move together with the same parallax drift
            the old full-bleed photo used. */}
        <div
          className="absolute right-6 top-24 z-10 will-change-transform sm:right-10 sm:top-28"
          style={{ transform: `translateY(${photoOffset}px)` }}
        >
          <div
            className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-accent2/50 via-accent/25 to-transparent blur-3xl"
            aria-hidden="true"
          />
          <div className="aspect-[4/5] w-[46vw] max-w-[220px] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-ink/10 sm:w-72 sm:max-w-none">
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
          doesn't create a horizontal scrollbar. Stays locked and
          untouched until Disciplines (below, -mt-[70vh]) starts arriving
          around scroll≈38vh, then fully occludes it shortly after. */}
      <div className="absolute inset-x-0 top-[70vh] z-10 h-[138vh]">
        <h1 className="pointer-events-none sticky top-[60%] mx-auto w-fit whitespace-nowrap font-sans text-5xl font-semibold leading-none tracking-tight sm:text-[12rem] lg:text-[15rem]">
          <span style={{ color: firstColor }}>{firstName}</span>{" "}
          <span style={{ color: lastColor }}>{lastName}</span>
        </h1>
      </div>
    </section>
  );
}
