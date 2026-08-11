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
  // Drives the name's color shift as Disciplines covers it — "Riley"
  // fades white -> accent green, "Byers" fades white -> ink black (see
  // the color mixing below), so the whole thing has settled into its
  // final colors before Disciplines' rise physically clips it.
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

      // The name now rises up from just below the fold before locking
      // (see the wrapper/h1 markup below) — it locks at scrollY≈20vh.
      // Disciplines arrives at ~48vh and fully occludes the name at
      // ~88vh (see comments below / in Disciplines.tsx) — coverEnd here
      // is deliberately set to the halfway point of that range (~68vh)
      // rather than 88vh, so the color has already finished fading to
      // black by the time occlusion is only half done.
      const coverStart = vh * 0.48;
      const coverEnd = vh * 0.68;
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

  // "Riley" fades from white to accent green, "Byers" fades from white
  // to ink black — same coverProgress driving both, just different
  // target colors.
  function mix(
    from: { r: number; g: number; b: number },
    to: { r: number; g: number; b: number },
    t: number
  ) {
    return `rgb(${Math.round(from.r + (to.r - from.r) * t)}, ${Math.round(
      from.g + (to.g - from.g) * t
    )}, ${Math.round(from.b + (to.b - from.b) * t)})`;
  }
  const white = { r: 0xfa, g: 0xfa, b: 0xfa };
  const green = { r: 0xc8, g: 0xff, b: 0x3d }; // accent
  const ink = { r: 0x0a, g: 0x0a, b: 0x0a };
  const firstColor = mix(white, green, coverProgress);
  const lastColor = mix(white, ink, coverProgress);
  const [firstName, lastName] = profile.name.split(" ");

  return (
    // Outer section is taller than one screen — that extra height is the
    // runway the sticky photo holds, and separately the runway the name's
    // own wrapper (below) holds before it releases too.
    <section id="top" className="relative h-[218vh]">
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

      {/* Name: wrapper's natural top is 80vh down the page, so at scroll=0
          more of the name is already peeking up from the bottom edge
          (previously 90vh — too little was visible on landing).
          Scrolling moves it up in normal flow (1:1 with the page) until
          it hits the sticky threshold below (top-[60%] = 60vh) at
          scrollY≈20vh, where it locks — same final resting position as
          before. Plain live text in a simple, clean font, sized big
          enough that it runs off both edges of the screen. globals.css
          sets overflow-x:hidden so that doesn't create a horizontal
          scrollbar. Stays locked and untouched until Disciplines (below,
          -mt-[70vh]) starts arriving around scroll≈48vh, then fully
          occludes it shortly after. */}
      <div className="absolute inset-x-0 top-[80vh] z-10 h-[138vh]">
        <h1 className="pointer-events-none sticky top-[60%] mx-auto w-fit whitespace-nowrap font-sans text-9xl font-semibold leading-none tracking-tight sm:text-[12rem] lg:text-[15rem]">
          <span style={{ color: firstColor }}>{firstName}</span>{" "}
          <span style={{ color: lastColor }}>{lastName}</span>
        </h1>
      </div>
    </section>
  );
}
