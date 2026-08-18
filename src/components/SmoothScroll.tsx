"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Site-wide inertial scroll — the same "chase the target" idea as Hero's
// own photo-parallax lerp (`current += (target - current) * 0.08` in a
// rAF loop), just applied to the page's real scroll position instead of
// one element's transform. Lenis intercepts wheel/touch/keyboard scroll
// input and replaces the instant jump with this eased motion, which is
// the mechanism behind the "luxurious" scroll feel on sites like the
// Norell Framer template — Framer's own built-in "Smooth Scroll" toggle
// does the same thing under the hood. Renders nothing; it just runs the
// effect for as long as it's mounted (once, in the root layout).
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // `duration`/`easing` mainly govern the programmatic `scrollTo()`
      // jumps (the anchor-link handler below) — the feel of everyday
      // wheel/trackpad scrolling is actually driven by `lerp`, which
      // defaults to 0.1 (a fairly tight, quick catch-up) if left unset.
      // That default is subtle enough to be nearly invisible layered on
      // top of macOS's own already-smooth trackpad momentum, which is
      // exactly why this felt like "nothing changed" at first. Lower
      // lerp = slower catch-up = more visible lag/weight — same idea as
      // Hero's own photo-parallax lerp (0.08 there, for reference).
      lerp: 0.045,
      duration: 1.2, // higher = slower, heavier settle for scrollTo jumps
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Internal hash links (Header's "/#contact", SubpageHeader's
    // "/#disciplines", etc.) normally jump the browser straight there.
    // Routing same-page hash clicks through Lenis's own scrollTo keeps
    // those eased too, instead of feeling jarring next to everything
    // else. Cross-page hash links (navigating to another route that ends
    // in a hash) still fall through to Next's own handling.
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;
      const path = href.slice(0, hashIndex);
      const hash = href.slice(hashIndex + 1);
      if (!hash || (path && path !== window.location.pathname)) return;
      const target = document.getElementById(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target);
    }
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
