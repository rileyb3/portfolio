"use client";

import { useState } from "react";
import type { SlideImage } from "@/data/projects";

// Full-bleed band of artwork drifting continuously past, pausing when
// hovered so a piece can actually be looked at, and opening into a
// lightbox on click. Same looping technique as TechMarquee: the track is
// the set duplicated once, so translating exactly -50% lands back on an
// identical copy and the seam is invisible.
//
// Sits BELOW the projects on a discipline page — this is the "and there's
// also a body of work over here" beat, not the headline.
export default function ArtMarquee({
  title,
  caption,
  images,
  seconds = 90,
  reverse = false,
}: {
  title: string;
  caption?: string;
  images: SlideImage[];
  // Long by default: a gallery wall should drift, not scroll past. Scales
  // with how many pieces there are so a big set doesn't race.
  seconds?: number;
  reverse?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<SlideImage | null>(null);

  if (images.length === 0) return null;
  const track = [...images, ...images];

  return (
    <section className="mb-14">
      <div className="mb-5 px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-accent3" aria-hidden="true" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            {title}
          </h3>
        </div>
        {caption && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            {caption}
          </p>
        )}
      </div>

      <div
        className="group relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex w-max gap-4 animate-marquee"
          style={{
            animationDuration: `${seconds}s`,
            animationDirection: reverse ? "reverse" : "normal",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {track.map((img, i) => (
            <button
              key={`${img.src}-${i}`}
              type="button"
              onClick={() => setOpen(img)}
              // Only the first copy is announced; the duplicate is purely
              // visual filler for the loop.
              aria-hidden={i >= images.length}
              tabIndex={i >= images.length ? -1 : 0}
              className="relative h-56 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface2 transition duration-500 hover:border-white/30 sm:h-72"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.name ?? ""}
                className="block h-full w-auto max-w-none object-cover opacity-85 transition duration-500 hover:opacity-100"
              />
              {img.name && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 text-left text-xs font-semibold text-paper">
                  {img.name}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Soft edges so pieces enter and leave rather than being clipped
            hard against the viewport. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent sm:w-28"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent sm:w-28"
        />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-4 sm:p-10"
          onClick={() => setOpen(null)}
        >
          <button
            aria-label="Close"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 text-3xl leading-none text-white/80 hover:text-white"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={open.src}
            alt={open.name ?? ""}
            className="max-h-full max-w-full cursor-default rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
