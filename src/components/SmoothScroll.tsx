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
    // Root cause of "still feels the same" after every previous fix:
    // Lenis's wheel handler (onVirtualScroll) passes lerp, duration, AND
    // easing into every scrollTo() call it makes on your behalf. Its
    // internal Animate.advance() checks `if (duration && easing)` BEFORE
    // `else if (lerp)` — so as long as duration/easing are set at all
    // (even just for the anchor-link jumps below), they silently win for
    // EVERY wheel tick too, and lerp never actually runs. That duration/
    // easing animation also gets restarted from scratch on every new
    // wheel event (every ~16ms), and the expo-out easing rises so fast
    // early on that it barely lags behind native scroll — which is
    // exactly the "nothing changed" symptom. Confirmed by reading
    // node_modules/lenis/dist/lenis.mjs directly (Animate class + the
    // onVirtualScroll -> scrollTo call), not a guess.
    //
    // Fix: keep duration/easing OFF the instance options entirely, so
    // everyday wheel/trackpad scroll falls through to the lerp branch.
    // duration/easing are passed instead only at the specific scrollTo()
    // call for anchor-link jumps, further down in this file.
    const lenis = new Lenis({
      // Lower = slower catch-up = more visible lag/weight — same idea as
      // Hero's own photo-parallax lerp (0.08 there, for reference).
      lerp: 0.06,
      smoothWheel: true,
      // Lenis honors `prefers-reduced-motion` by default and silently
      // forces lerp to 1 (i.e. no smoothing at all) when it's set — which
      // is the right call for accessibility generally, but it's also
      // one of the earlier reasons this read as "nothing happening" for
      // users with that OS setting on. Overriding it here so the effect
      // always applies on this decorative, non-essential interaction —
      // worth reconsidering if accessibility feedback ever says
      // otherwise.
      respectReducedMotion: false,
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
      // duration/easing scoped to just this call (not the constructor
      // options above) — see the big comment above for why putting them
      // on the instance instead was silently breaking wheel-scroll lerp.
      lenis.scrollTo(target, {
        duration: 1.6,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
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
