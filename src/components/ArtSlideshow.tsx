"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SlideImage } from "@/data/projects";

export default function ArtSlideshow({
  title,
  caption,
  images,
}: {
  title: string;
  caption?: string;
  images: SlideImage[];
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const current = images[index];

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-paper">{title}</h2>
      {/* Fixed-size frame so the box (and the arrows on it) never move
          between slides, regardless of each image's own proportions. */}
      <div className="relative mx-auto h-[453px] w-[340px] max-w-full overflow-hidden rounded-2xl border border-white/10 bg-surface2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.name ?? `${title}, slide ${index + 1} of ${images.length}`}
          className="h-full w-full object-contain"
        />
        {current.name && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent px-4 pb-3 pt-8">
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              {current.name}
            </p>
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-ink/60 p-2 text-paper backdrop-blur transition hover:bg-ink/80"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-ink/60 p-2 text-paper backdrop-blur transition hover:bg-ink/80"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition ${
                i === index ? "bg-accent" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      )}
      {/* Caption sits below the frame, not above it, so it never throws off
          where the image itself starts (keeps Painting and Henna aligned). */}
      {caption && (
        <p className="mx-auto mt-3 max-w-[340px] text-xs text-muted">
          {caption}
        </p>
      )}
    </div>
  );
}
