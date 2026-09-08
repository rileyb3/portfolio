"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  DISCIPLINE_COLOR,
  FADE_START,
  waveAngle,
  waveGradient,
  waves,
  wavesByZ,
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

  // Front to back, so the wave you can actually see wins — walking the
  // same z-order the sea is painted in.
  const pick = useCallback((clientX: number, clientY: number) => {
    for (let i = wavesByZ.length - 1; i >= 0; i--) {
      const w = wavesByZ[i];
      const el = waveRefs.current[w.slug];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const u = (clientX - r.left) / r.width;
      const v = (clientY - r.top) / r.height;
      if (u < 0 || u > 1 || v < 0 || v > 1) continue;
      // getBoundingClientRect is post-transform, so a mirrored wave needs
      // its sample flipped back into the drawing's own space. The fade
      // below stays in screen space, since that's where it's visible.
      const du = w.flip ? 1 - u : u;
      const dv = w.flipY ? 1 - v : v;
      const map = alpha.current.get(w.src);
      if (!map) continue;
      const px = Math.min(map.w - 1, Math.max(0, Math.floor(du * map.w)));
      const py = Math.min(map.h - 1, Math.max(0, Math.floor(dv * map.h)));
      // Fold in the same bottom fade the mask applies, so the faded-out
      // tail of a wave isn't a hover target you can't see.
      const start = FADE_START[w.depth] / 100;
      const fade = v <= start ? 1 : Math.max(0, 1 - (v - start) / (1 - start));
      if (map.data[py * map.w + px] * fade > 40) return w;
    }
    return null;
  }, [waveRefs]);

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
      {wavesByZ.map((w, i) => {
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
              zIndex: w.z,
              // Outer element carries the drawing's silhouette. The color
              // and the bottom fade live on the child below, so the two
              // masks nest instead of needing mask-composite — which
              // Chrome applied to only the first layer here, leaving the
              // second one to union in the element's whole rectangle.
              WebkitMaskImage: `url(${w.src})`,
              maskImage: `url(${w.src})`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              transform:
                w.flip || w.flipY
                  ? `scale(${w.flip ? -1 : 1}, ${w.flipY ? -1 : 1})`
                  : undefined,
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
          >
            {/* The water itself. Its own vertical mask dissolves the
                drawing's flat baseline into whatever sits behind it — the
                shapes all end on a hard horizontal cut, and 22 of those
                stacked up read as cut paper rather than sea. Distant waves
                start fading higher up, which is aerial perspective doing
                the depth work for free. */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: waveGradient(w, i, angle, lit ? colors : null),
                // A vertically mirrored parent flips this gradient too, so
                // the direction is inverted to keep the fade at the wave's
                // on-screen bottom either way.
                WebkitMaskImage: `linear-gradient(to ${w.flipY ? "top" : "bottom"}, #000 ${FADE_START[w.depth]}%, transparent 100%)`,
                maskImage: `linear-gradient(to ${w.flipY ? "top" : "bottom"}, #000 ${FADE_START[w.depth]}%, transparent 100%)`,
                transition: "background-image 350ms ease-out",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
