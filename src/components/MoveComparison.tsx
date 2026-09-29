"use client";

import { useRef } from "react";
import RevealOnScroll from "./RevealOnScroll";

export type MoveClip = {
  src: string;
  poster?: string;
  // What's being compared — the one thing that differs between clips.
  variable: string;
  // Optional second line: the detail that variable changes about the move.
  note?: string;
  // Precision/difficulty, 1 = least demanding. Shown as a dot meter.
  rank?: number;
};

// The same move attempted under different conditions, side by side and
// looping, so the variable is the only thing that changes between panes.
// Comparison is the whole point, so the clips restart together on demand:
// watching four loops drift out of phase makes them impossible to read
// against each other.
export default function MoveComparison({
  clips,
  label,
}: {
  clips: MoveClip[];
  label?: string;
}) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  // Hovering one clip pauses the rest, so a single setup can be watched
  // on its own without four loops competing for attention. Leaving the
  // row puts them all back in motion.
  const isolate = (index: number) => {
    refs.current.forEach((v, n) => {
      if (!v) return;
      if (n === index) void v.play().catch(() => {});
      else v.pause();
    });
  };

  const resumeAll = () => {
    refs.current.forEach((v) => {
      if (!v) return;
      void v.play().catch(() => {});
    });
  };

  const replayAll = () => {
    refs.current.forEach((v) => {
      if (!v) return;
      v.currentTime = 0;
      // play() rejects if the browser blocks it (low power mode, say) —
      // swallow it rather than throwing an unhandled rejection.
      void v.play().catch(() => {});
    });
  };

  return (
    <RevealOnScroll className="relative left-1/2 w-screen -translate-x-1/2 px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {label && (
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent3">
              {label}
              {/* Hover-to-isolate is invisible until you stumble on it,
                  and hidden on touch where there is no hover at all. */}
              <span className="ml-3 hidden font-normal normal-case tracking-normal text-muted sm:inline">
                hover a clip to isolate it
              </span>
            </h3>
          )}
          <button
            type="button"
            onClick={replayAll}
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-paper transition hover:border-white/40 hover:bg-white/5"
          >
            Replay all
          </button>
        </div>

        {/* Dimming the siblings is what makes the pause legible — without
            it a stopped clip just looks like it finished loading. */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 [&:hover>figure:not(:hover)]:opacity-40">
          {clips.map((clip, i) => (
            <figure
              key={clip.src}
              onMouseEnter={() => isolate(i)}
              onMouseLeave={resumeAll}
              className="transition-opacity duration-300"
            >
              <div className="overflow-hidden rounded-xl border border-white/10 bg-surface2">
                <video
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  src={clip.src}
                  poster={clip.poster}
                  // Muted + playsInline + loop is what lets these autoplay
                  // on iOS at all; without muted they simply never start.
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="block aspect-[9/16] w-full object-cover"
                />
              </div>
              <figcaption className="mt-3">
                <p className="text-sm font-semibold text-paper">
                  {clip.variable}
                </p>
                {typeof clip.rank === "number" && (
                  <p className="mt-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Precision
                    <span className="flex gap-1" aria-hidden="true">
                      {clips.map((_, n) => (
                        <span
                          key={n}
                          className={`h-1.5 w-1.5 rounded-full ${
                            n < clip.rank! ? "bg-accent3" : "bg-white/15"
                          }`}
                        />
                      ))}
                    </span>
                    <span className="sr-only">
                      {clip.rank} of {clips.length}
                    </span>
                  </p>
                )}
                {clip.note && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {clip.note}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
}
