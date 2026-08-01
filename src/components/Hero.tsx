"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/projects";

export default function Hero() {
  // Photo drifts upward as you scroll, but slower than the page itself
  // (classic parallax). Uses a continuous rAF loop that eases the
  // displayed offset toward the scroll-derived target every frame
  // (lerp), rather than jumping straight to a hard-clamped value on each
  // scroll event — that clamp-on-event approach was what caused the
  // abrupt "hits max drift and instantly freezes" stop.
  const [photoOffset, setPhotoOffset] = useState(0);
  // Soft one-time entrance for the name, instead of it just snapping
  // into its sticky position the instant the page paints.
  const [nameIn, setNameIn] = useState(false);
  // White -> near-black as Disciplines covers the name, so the letters
  // blend into its background instead of just getting clipped. 0 = white
  // (#fafafa, matches text-paper), 1 = ink (#0a0a0a, matches bg-ink).
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

      // Same scroll range Disciplines uses to arrive (~28vh) and fully
      // occlude the name (~65vh) — see the comments below on the name
      // wrapper and in Disciplines.tsx for how those numbers come out.
      const coverStart = vh * 0.28;
      const coverEnd = vh * 0.65;
      const progress = Math.min(
        Math.max((scrollY - coverStart) / (coverEnd - coverStart), 0),
        1
      );
      setCoverProgress(progress);

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    const t = setTimeout(() => setNameIn(true), 50);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  // Interpolate #fafafa -> #0a0a0a by coverProgress.
  const from = { r: 0xfa, g: 0xfa, b: 0xfa };
  const to = { r: 0x0a, g: 0x0a, b: 0x0a };
  const nameColor = `rgb(${Math.round(from.r + (to.r - from.r) * coverProgress)}, ${Math.round(
    from.g + (to.g - from.g) * coverProgress
  )}, ${Math.round(from.b + (to.b - from.b) * coverProgress)})`;

  return (
    // Outer section is taller than one screen — that extra height is the
    // runway the sticky photo holds, and separately the runway the name's
    // own wrapper (below) holds before it releases too.
    <section id="top" className="relative h-[198vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        {/* Photo: full-bleed on the right. Hard cut to black on the left —
            no gradient, just a clean edge. Deliberately oversized (145% of
            container height) so the upward parallax drift below always has
            extra image material to reveal — without this, translating a
            100%-height image upward exposes empty black space at the
            bottom. */}
        <div
          className="absolute right-0 top-0 h-[145%] w-full will-change-transform sm:w-[62%]"
          style={{ transform: `translateY(${photoOffset}px)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.photoSrc}
            alt={profile.name}
            className="h-full w-full object-cover object-top"
          />
        </div>

        {/* Edge strip: a wider (~2/3in), taller repeating sliver of the
            photo's own leftmost, person-free edge (rocks/ocean — cropped
            right before any clothing enters frame at this width) —
            floats in the black panel with at least a half-inch gap of
            solid black on both sides. Desktop only, since the photo is
            full-width (no black panel) on mobile. Stays static (no
            parallax) so it doesn't drift out of alignment with the panel
            edge it's meant to echo. */}
        <div
          className="absolute inset-y-0 left-[calc(38%-112px)] hidden w-16 bg-[url('/edge-strip-v3.jpg')] bg-[length:64px_auto] bg-repeat-y bg-left-top sm:block"
          aria-hidden="true"
        />
      </div>

      {/* Name: wrapper's natural top is 63vh down the page — matching the
          lock threshold below (a smidge higher than the previous 66%),
          so the name is already at (essentially) its locked position
          from scroll=0. A one-time soft fade/rise transition on mount
          (nameIn) replaces the previous instant snap-into-place. Plain
          live text in a simple, clean font, sized big enough that it
          runs off both edges of the screen. globals.css sets
          overflow-x:hidden so that doesn't create a horizontal
          scrollbar. Stays visible and untouched until Disciplines
          (below, -mt-[70vh]) starts arriving around scroll≈28vh, then
          fully occludes it shortly after. */}
      <div className="absolute inset-x-0 top-[63vh] z-10 h-[135vh]">
        <h1
          className={`pointer-events-none sticky top-[63%] mx-auto w-fit whitespace-nowrap font-sans text-9xl font-semibold leading-none tracking-tight transition-[transform,opacity] duration-700 ease-out sm:text-[12rem] lg:text-[15rem] ${
            nameIn ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ color: nameColor }}
        >
          {profile.name}
        </h1>
      </div>
    </section>
  );
}
