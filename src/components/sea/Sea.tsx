"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  DISCIPLINE_COLOR,
  waveAngle,
  waveGradient,
  waves,
  type Wave,
} from "./seaData";

// The sea. Each wave is one project, drawn from Riley's own art used as a
// CSS mask over a gradient — see the note in seaData.ts for why mask
// rather than <img>: it's what lets one flat PNG be steel-blue at rest,
// its discipline's color when that card is picked, and its own color when
// you point straight at it.
//
// Hit-testing samples the PNG's alpha channel rather than trusting the
// element box. Every wave is a wide rectangle with a thin diagonal shape
// inside it, and they overlap heavily — box hit-testing would mean
// pointing at open water (or at the wave behind) and getting a hit on
// whichever rectangle happened to be on top.
export default function Sea({
  focusId,
  focusColor,
  hoverSlug,
  onWaveHover,
  onWaveClick,
  waveRefs,
}: {
  focusId: string | null;
  focusColor: string | null;
  hoverSlug: string | null;
  onWaveHover: (wave: Wave | null, clientX: number, clientY: number) => void;
  onWaveClick: (wave: Wave) => void;
  waveRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}) {
  const alpha = useRef<
    Map<string, { w: number; h: number; data: Uint8ClampedArray }>
  >(new Map());

  // Decode each drawing once into a small alpha map. Downscaled hard —
  // hit-testing doesn't need the full 833×612, and a coarse mask is
  // actually kinder here since it forgives a pixel of imprecision at the
  // feathered edges.
  useEffect(() => {
    let cancelled = false;
    const srcs = Array.from(new Set(waves.map((w) => w.src)));
    for (const src of srcs) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        const scale = Math.min(1, 260 / img.naturalWidth);
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const rgba = ctx.getImageData(0, 0, w, h).data;
        const a = new Uint8ClampedArray(w * h);
        for (let i = 0; i < w * h; i++) a[i] = rgba[i * 4 + 3];
        alpha.current.set(src, { w, h, data: a });
      };
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Front to back, so the wave you can actually see wins.
  const pick = useCallback((clientX: number, clientY: number) => {
    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i];
      const el = waveRefs.current[w.slug];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      let u = (clientX - r.left) / r.width;
      const v = (clientY - r.top) / r.height;
      if (u < 0 || u > 1 || v < 0 || v > 1) continue;
      // getBoundingClientRect is post-transform, so a mirrored wave needs
      // its sample flipped back into the drawing's own space.
      if (w.flip) u = 1 - u;
      const map = alpha.current.get(w.src);
      if (!map) continue;
      const px = Math.min(map.w - 1, Math.max(0, Math.floor(u * map.w)));
      const py = Math.min(map.h - 1, Math.max(0, Math.floor(v * map.h)));
      if (map.data[py * map.w + px] > 40) return w;
    }
    return null;
  }, [waveRefs]);

  // Waves are sorted back-to-front for painting, so a later sibling sits
  // in front; z-index by depth keeps that true across the three rows.
  const ordered = [...waves].sort((a, b) => a.depth - b.depth);

  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[72vh] sm:h-[78vh]"
      style={{ cursor: hoverSlug ? "pointer" : "default" }}
      onPointerMove={(e) => {
        const hit = pick(e.clientX, e.clientY);
        onWaveHover(hit, e.clientX, e.clientY);
      }}
      onPointerLeave={() => onWaveHover(null, 0, 0)}
      onClick={(e) => {
        const hit = pick(e.clientX, e.clientY);
        if (hit) onWaveClick(hit);
      }}
    >
      {ordered.map((w, i) => {
        const litByCard = focusId ? w.disciplineIds.includes(focusId) : false;
        const litByHover = hoverSlug === w.slug;
        const lit = litByCard || litByHover;
        // Pointing straight at a wave lights it in *all* of its
        // disciplines' colors — a shared project reads as an ombre of both
        // (Pete the Snail: Play blue into Design orange). Lighting it from
        // a card is a filter answering "what belongs to Build", so there
        // it takes that one discipline's color instead.
        const colors = litByHover
          ? w.disciplineIds.map((d) => DISCIPLINE_COLOR[d] ?? "#C7CCD4")
          : focusColor
            ? [focusColor]
            : null;
        // Picking a discipline is a deliberate filter, so the rest of the
        // sea drops right back. Brushing past a single wave is much
        // lighter-weight — dimming that hard on mere pointer movement made
        // the whole scene flicker dark as the cursor crossed the water.
        const dimmed = (focusId !== null || hoverSlug !== null) && !lit;
        const dimAmount = focusId !== null ? 0.22 : 0.55;
        const angle = waveAngle(i);
        return (
          <div
            key={w.slug}
            data-wave={w.slug}
            ref={(el) => {
              waveRefs.current[w.slug] = el;
            }}
            style={{
              left: `${w.left}%`,
              bottom: `${w.bottom}%`,
              width: `${w.width}%`,
              aspectRatio: `${w.aspect}`,
              zIndex: w.depth,
              // The drawing contributes silhouette only; all color comes
              // from this gradient showing through the mask.
              WebkitMaskImage: `url(${w.src})`,
              maskImage: `url(${w.src})`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              backgroundImage: waveGradient(w, i, angle, lit ? colors : null),
              transform: w.flip ? "scaleX(-1)" : undefined,
              opacity: dimmed ? dimAmount : 1,
              // One glow per discipline, so a shared wave throws both
              // colors into the water around it too.
              filter:
                lit && colors
                  ? colors
                      .map(
                        (c) =>
                          `drop-shadow(0 0 20px ${c}59) drop-shadow(0 0 6px ${c}8c)`
                      )
                      .join(" ")
                  : undefined,
              transition:
                "opacity 400ms ease-out, background-image 350ms ease-out, filter 350ms ease-out",
            }}
            className="pointer-events-none absolute"
          />
        );
      })}
    </div>
  );
}
