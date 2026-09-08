"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Palette,
  Gamepad2,
  Microscope,
  PenTool,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Sea from "./sea/Sea";
import { disciplines, panelEntries, waves } from "./sea/seaData";

const iconMap: Record<string, LucideIcon> = {
  build: Code2,
  design: Palette,
  play: Gamepad2,
  discover: Microscope,
  write: PenTool,
};

// Scattered card positions, in % of the scene box — deliberately uneven
// heights (the reference site's districts sit at five different altitudes,
// which is most of what keeps it from looking like a nav bar). Only used
// at lg+; below that the cards fall back to a normal wrapped row, since
// absolute scatter has nowhere to go on a phone.
const CARD_POS: Record<string, { left: string; top: string }> = {
  build: { left: "1%", top: "6%" },
  design: { left: "23%", top: "17%" },
  play: { left: "42%", top: "27%" },
  discover: { left: "62%", top: "16%" },
  write: { left: "81%", top: "5%" },
};

export default function SeaScene() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  // Hover previews the connections; clicking locks them in and opens the
  // panel. Same feedback loop as the reference, one step earlier.
  const focusId = activeId ?? hoverId;
  const focus = disciplines.find((d) => d.id === focusId) ?? null;

  const sceneRef = useRef<HTMLDivElement>(null);
  const waveRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const [lines, setLines] = useState<string[]>([]);

  // Lines are measured in real DOM pixels rather than authored in any fixed
  // coordinate space: the cards are laid out by flow/absolute rules and the
  // waves are percentage-positioned masked divs, so the only way the two
  // reliably meet at every viewport size is to measure both after layout.
  // A wave's landing point is the crest of the drawing — `tip` is the
  // x-fraction of its topmost opaque pixel, measured off the PNG itself,
  // because the bounding-box center would leave lines hanging in open water
  // for the shapes whose curl sits far to one side.
  const measure = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene || !focusId) {
      setLines([]);
      return;
    }
    const card = cardRefs.current[focusId];
    if (!card) return;

    const sceneRect = scene.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const startX = cardRect.left + cardRect.width / 2 - sceneRect.left;
    const startY = cardRect.bottom - sceneRect.top;

    const next: string[] = [];
    for (const w of waves) {
      if (!w.disciplineIds.includes(focusId)) continue;
      const el = waveRefs.current[w.slug];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const endX = r.left + r.width * w.tip - sceneRect.left;
      // A hair below the very top edge so the line tucks into the crest
      // rather than floating just above it.
      const endY = r.top + r.height * 0.06 - sceneRect.top;
      // A long vertical-ish S: both control points sit on the line's own
      // vertical run, which makes the bundle fan out from the card and
      // arrive at each crest from above rather than cutting across at an
      // angle.
      const dy = endY - startY;
      next.push(
        `M ${startX} ${startY} C ${startX} ${startY + dy * 0.42} ${endX} ${startY + dy * 0.52} ${endX} ${endY}`
      );
    }
    setLines(next);
  }, [focusId]);

  useEffect(() => {
    measure();
    // rAF chase for one frame after state change — the sea's own opacity
    // transitions don't move geometry, but a fresh layout pass can, and
    // measuring on the next frame avoids reading a stale rect.
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [measure]);

  // Escape closes the panel, matching every other dismissible overlay here.
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  return (
    <section
      ref={sceneRef}
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink"
    >
      {/* Horizon wash — a faint colored glow above the waterline so the sea
          has a sky to sit under instead of flat black. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70vh] bg-[radial-gradient(120%_80%_at_50%_100%,rgba(125,211,252,0.16)_0%,rgba(200,255,61,0.07)_38%,transparent_72%)]"
        style={{
          // Focused, the horizon takes on that discipline's color — the
          // whole scene acknowledges the selection, not just the crests.
          background: focus
            ? `radial-gradient(120% 80% at 50% 100%, ${focus.color}22 0%, ${focus.color}0d 40%, transparent 74%)`
            : undefined,
          transition: "background 600ms ease-out",
        }}
      />

      <Sea
        focusId={focusId}
        focusColor={focus?.color ?? null}
        waveRefs={waveRefs}
      />

      {/* Connector lines. Sits above the sea, below the cards, so a line
          appears to run out from under its card and land on the water. */}
      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        aria-hidden="true"
      >
        {lines.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={focus?.color ?? "#fafafa"}
            strokeWidth={1.4}
            strokeOpacity={0.85}
            style={{
              filter: `drop-shadow(0 0 6px ${focus?.color ?? "#fafafa"})`,
              // Each line draws itself in, staggered — the bundle unfurls
              // rather than snapping into existence all at once.
              strokeDasharray: 2600,
              strokeDashoffset: 0,
              animation: `sea-draw 700ms ease-out ${i * 55}ms backwards`,
            }}
          />
        ))}
      </svg>

      {/* Intro line — the scene needs one plain sentence of orientation, the
          way the reference site uses its search bar as a "this is a place
          you move through" cue. */}
      <div className="pointer-events-none relative z-20 px-6 pt-10 text-center sm:pt-14">
        <p
          className={`mx-auto max-w-md text-sm leading-relaxed text-muted transition-opacity duration-500 sm:text-base ${
            activeId ? "opacity-0" : "opacity-100"
          }`}
        >
          Five disciplines, one sea. Pick one and watch which work belongs to
          it — some waves answer to more than one.
        </p>
      </div>

      {/* Cards. Wrapped row on small screens, scattered at five different
          altitudes on lg+. */}
      <div className="relative z-20 mx-auto flex min-h-[46vh] max-w-6xl flex-wrap items-start justify-center gap-3 px-4 pt-8 sm:gap-4 lg:block lg:max-w-none lg:px-0 lg:pt-0">
        {disciplines.map((d) => {
          const Icon = iconMap[d.id] ?? Code2;
          const isFocused = focusId === d.id;
          const dimmed = focusId !== null && !isFocused;
          const pos = CARD_POS[d.id];
          return (
            <button
              key={d.id}
              ref={(el) => {
                cardRefs.current[d.id] = el;
              }}
              type="button"
              onMouseEnter={() => setHoverId(d.id)}
              onMouseLeave={() => setHoverId(null)}
              onFocus={() => setHoverId(d.id)}
              onBlur={() => setHoverId(null)}
              onClick={() => setActiveId((cur) => (cur === d.id ? null : d.id))}
              aria-pressed={activeId === d.id}
              style={{
                borderColor: isFocused ? d.color : `${d.color}66`,
                background: isFocused ? `${d.color}1f` : `${d.color}0d`,
                boxShadow: isFocused
                  ? `0 0 0 1px ${d.color}66, 0 0 28px ${d.color}59, inset 0 0 22px ${d.color}1f`
                  : `0 0 14px ${d.color}1f`,
                left: pos?.left,
                top: pos?.top,
              }}
              className={`group flex w-[46%] max-w-[15rem] flex-col items-center gap-1 rounded-2xl border px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 sm:w-auto sm:min-w-[13rem] sm:px-6 sm:py-4 lg:absolute lg:w-[16rem] ${
                dimmed ? "opacity-40" : "opacity-100"
              } ${isFocused ? "-translate-y-1 scale-[1.03]" : "hover:-translate-y-0.5"}`}
            >
              <span className="flex items-center gap-2">
                <Icon
                  className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                  strokeWidth={1.5}
                  style={{ color: d.color }}
                />
                <span
                  className="text-base font-bold uppercase tracking-wide sm:text-lg"
                  style={{ color: d.color }}
                >
                  {d.label}
                </span>
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.18em] text-muted sm:text-xs">
                {d.blurb}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel. Slides in from the right on click; the crest lines stay
          visible to its left, which is the whole point of the layout —
          you can see the shape of a discipline and read its list at once. */}
      <aside
        aria-hidden={!activeId}
        className={`fixed right-0 top-0 z-40 flex h-[100svh] w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-surface/95 px-6 pb-16 pt-8 backdrop-blur-xl transition-transform duration-500 ease-out sm:px-8 ${
          activeId ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        {focus && (
          <>
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="self-start text-xs uppercase tracking-[0.2em] text-muted transition hover:text-paper"
            >
              ← Back to the sea
            </button>
            <h2
              className="mt-6 text-3xl font-bold uppercase tracking-wide sm:text-4xl"
              style={{ color: focus.color }}
            >
              {focus.label}
            </h2>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
              {focus.blurb}
            </p>

            <ul className="mt-8 space-y-6">
              {(panelEntries[focus.id] ?? []).map((entry) => (
                <li key={entry.key}>
                  <Link href={entry.href} className="group block">
                    <span
                      className="inline-flex items-center gap-2 text-lg font-semibold transition"
                      style={{ color: focus.color }}
                    >
                      {entry.title}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        strokeWidth={2}
                      />
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {entry.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={focus.href}
              className="mt-10 inline-block text-sm uppercase tracking-[0.15em] text-muted transition hover:text-paper"
            >
              See all {focus.label} →
            </Link>
          </>
        )}
      </aside>
    </section>
  );
}
