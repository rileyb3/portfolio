"use client";

import { useEffect, useRef, useState } from "react";

// A photo of a wall with one route traced over it, the line drawing
// itself bottom-to-top the way you'd actually climb it — so a viewer who
// can't read a wall full of holds can still see which route is the one
// being talked about.
//
// The draw is a stroke-dashoffset animation: the dash pattern is the
// whole path length, so the stroke starts fully "off the end" and slides
// into place. It fires on scroll-into-view rather than on mount, since a
// line that finishes drawing before you reach it has no effect at all.
export default function RouteTrace({
  src,
  alt,
  path,
  viewBox,
  caption,
  durationMs = 2600,
}: {
  src: string;
  alt: string;
  // SVG path data, in the coordinate space of `viewBox`, ordered from the
  // bottom of the wall to the top.
  path: string;
  viewBox: string;
  caption?: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (or reduced motion) — just show the finished
    // line rather than leaving the route invisible.
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setDrawn(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <figure ref={ref} className="my-10">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block w-full" />
        <svg
          viewBox={viewBox}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* Dark under-stroke so the line stays readable over pale
              concrete and bright holds alike. */}
          <path
            d={path}
            fill="none"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: drawn ? 0 : 1,
              transition: `stroke-dashoffset ${durationMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          />
          <path
            d={path}
            fill="none"
            stroke="#C8FF3D"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            // pathLength normalises the geometry to 1 unit, so the dash
            // maths is identical no matter how long the real path is.
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: drawn ? 0 : 1,
              transition: `stroke-dashoffset ${durationMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          />
        </svg>
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
