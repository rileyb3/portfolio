"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/projects";

export default function Hero() {
  // Photo drifts upward as you scroll, but slower than the page itself
  // (classic parallax) — computed from real scroll position rather than
  // pure CSS, since sticky alone can only pin something at a fixed rate
  // (1x or 0x), not partway between.
  const [photoOffset, setPhotoOffset] = useState(0);

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const maxDrift = window.innerHeight * 0.3;
        setPhotoOffset(-Math.min(window.scrollY * 0.3, maxDrift));
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // Outer section is taller than one screen — that extra height is the
    // runway the sticky photo holds, and separately the runway the name's
    // own wrapper (below) holds before it releases too. Whole sequence
    // shifted ~42vh earlier vs. the previous version, so the name is
    // already at (or essentially at) its locked position on landing
    // instead of requiring scroll to reveal it — the gaps between
    // "name locked" / "Disciplines arrives" / "Disciplines fully covers
    // it" are unchanged, just moved earlier together.
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

      {/* Name: wrapper's natural top is 66vh down the page — exactly
          matching the lock threshold below, so the name is already at
          (essentially) its locked position from scroll=0, mostly visible
          on landing rather than requiring scroll to appear. Plain live
          text in a simple, clean font, sized big enough that it runs off
          both edges of the screen. globals.css sets overflow-x:hidden so
          that doesn't create a horizontal scrollbar. It stays visible and
          untouched until Disciplines (below, -mt-[70vh], unchanged) starts
          arriving around scroll≈28vh, then fully occludes it shortly
          after — same relative relationship as before, just carried a
          bit lower. */}
      <div className="absolute inset-x-0 top-[66vh] z-10 h-[132vh]">
        <h1 className="pointer-events-none sticky top-[66%] mx-auto w-fit whitespace-nowrap font-sans text-9xl font-semibold leading-none tracking-tight text-paper sm:text-[12rem] lg:text-[15rem]">
          {profile.name}
        </h1>
      </div>
    </section>
  );
}
