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
    // own wrapper (below) holds before it releases too. Tall (240vh) on
    // purpose: the name needs ~42vh of scroll just to rise from off-screen
    // to its locked position, then a dwell stretch where it's fully
    // visible and NOT yet touched by Disciplines, then room for
    // Disciplines to rise and fully cover it, all before release.
    <section id="top" className="relative h-[240vh]">
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

      {/* Name: starts fully below the fold (invisible at rest — this
          wrapper's natural top is exactly 100vh down the page, i.e. right
          at the bottom edge of the first screen). As you scroll, it rises
          into view like normal content, reaching its locked position
          (top:58% of viewport) at scroll≈42vh — plain live text in a
          simple, clean font, sized big enough that it runs off both edges
          of the screen. globals.css sets overflow-x:hidden so that
          doesn't create a horizontal scrollbar. From there it stays fully
          visible and untouched until Disciplines (below, -mt-[70vh])
          starts arriving around scroll≈70vh, giving a clean dwell period
          with no overlap between "still rising" and "getting covered" —
          then fully occludes the name by scroll≈112vh, well before this
          wrapper's 140vh runway ends. */}
      <div className="absolute inset-x-0 top-[100vh] z-10 h-[140vh]">
        <h1 className="pointer-events-none sticky top-[58%] mx-auto w-fit whitespace-nowrap font-sans text-9xl font-semibold leading-none tracking-tight text-paper sm:text-[12rem] lg:text-[15rem]">
          {profile.name}
        </h1>
      </div>
    </section>
  );
}
