"use client";

import { useEffect, useState } from "react";

// A thumbnail that opens into a full-screen lightbox on click — used
// anywhere a project image might be too small/detailed to read at
// thumbnail size (charts, graphs, screenshots with fine text).
export default function ExpandableImage({
  src,
  alt,
  className,
  ratio,
  fill,
}: {
  src: string;
  alt: string;
  className?: string;
  // Optional intrinsic width/height ratio (e.g. 1834/1356). When given,
  // reserves the image's real footprint before it loads — plain <img>
  // has no width/height here, so without this the box is 0-tall until
  // the file arrives, then snaps open and shoves everything below it
  // down. That's the "glitching" images: in a masonry/pile group where
  // several load out of order, each pop-in reflows the whole group
  // mid-scroll. Cheap to supply since these are fixed local files —
  // see the ratios already measured for VMM's images.
  ratio?: number;
  // When the parent already has a fixed size (e.g. a uniform card in
  // ImagePile), fill it and crop with object-cover instead of sizing off
  // `ratio`. Independent of `ratio` — a fixed-size card still benefits
  // from `ratio` doing nothing here, since the parent's own size is what
  // prevents layout shift in that case.
  fill?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={ratio && !fill ? { aspectRatio: ratio } : undefined}
        // `block` matters here, not just decorative: img is inline by
        // default, which leaves a few px gap below it (baseline spacing
        // for descenders like "g"/"y") inside its rounded/bordered
        // container — read as a sliver of the container's dark
        // background peeking out under every image on the site.
        // Fades in on load instead of popping in — softer even when no
        // `ratio` is set (nothing to reserve, but at least no hard snap).
        className={`block cursor-zoom-in transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${fill ? "h-full w-full object-cover" : ""} ${className ?? ""}`}
        onLoad={() => setLoaded(true)}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-4 sm:p-10"
          onClick={() => setOpen(false)}
        >
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 text-3xl leading-none text-white/80 hover:text-white"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-full max-w-full cursor-default rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
