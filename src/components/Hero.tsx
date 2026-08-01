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
        const maxDrift = window.innerHeight * 0.4;
        setPhotoOffset(-Math.min(window.scrollY * 0.4, maxDrift));
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
    // runway the sticky photo and sticky name both hold before releasing
    // and scrolling away with the rest of the page. The name stays put
    // (sticky, same as the photo) for that whole runway; Disciplines
    // (higher z-index, opaque background) rises up from below and
    // overlays it as you scroll, rather than the name scrolling away on
    // its own.
    <section id="top" className="relative grid h-[140vh] grid-cols-1">
      <div className="sticky top-0 col-start-1 row-start-1 h-screen overflow-hidden bg-ink">
        {/* Photo: full-bleed on the right. Hard cut to black on the left —
            no gradient, just a clean edge. Parallax drift applied here via
            transform, independent of the edge strip below. */}
        <div
          className="absolute inset-y-0 right-0 w-full will-change-transform sm:w-[62%]"
          style={{ transform: `translateY(${photoOffset}px)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.photoSrc}
            alt={profile.name}
            className="h-full w-full object-cover"
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
          className="absolute inset-y-0 left-[calc(38%-112px)] hidden w-16 bg-[url('/edge-strip-v2.jpg')] bg-[length:64px_auto] bg-repeat-y bg-left-top sm:block"
          aria-hidden="true"
        />
      </div>

      {/* Name: sticky (pinned), not scrolling on its own — plain live text
          in a simple, clean font, centered horizontally and sized big
          enough that it runs off both edges of the screen on purpose.
          globals.css sets overflow-x:hidden so that doesn't create a
          horizontal scrollbar. */}
      <div className="sticky top-0 z-10 col-start-1 row-start-1 h-screen">
        <h1 className="pointer-events-none absolute left-1/2 top-[68%] -translate-x-1/2 whitespace-nowrap font-sans text-9xl font-semibold leading-none tracking-tight text-paper sm:text-[12rem] lg:text-[15rem]">
          {profile.name}
        </h1>
      </div>
    </section>
  );
}
