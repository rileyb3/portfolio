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
import { useRouter } from "next/navigation";
import Sea from "./sea/Sea";
import {
  DISCIPLINE_COLOR,
  disciplines,
  panelEntries,
  waves,
  type Wave,
} from "./sea/seaData";
import { profile } from "@/data/projects";

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
  // The short introduction hanging off "Riley" in the title.
  const [nameOpen, setNameOpen] = useState(false);
  // Hover previews the connections; clicking locks them in and opens the
  // panel. Same feedback loop as the reference, one step earlier.
  const focusId = activeId ?? hoverId;
  const focus = disciplines.find((d) => d.id === focusId) ?? null;

  const sceneRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const waveRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const [lines, setLines] = useState<string[]>([]);
  const router = useRouter();
  // Pointing at a single wave: every wave is one project, so the sea can
  // be browsed directly rather than only through the discipline cards.
  const [hoverWave, setHoverWave] = useState<{
    wave: Wave;
    x: number;
    y: number;
  } | null>(null);

  const handleWaveHover = useCallback(
    (wave: Wave | null, clientX: number, clientY: number) => {
      const scene = sceneRef.current;
      if (!wave || !scene) {
        setHoverWave(null);
        return;
      }
      const r = scene.getBoundingClientRect();
      setHoverWave({ wave, x: clientX - r.left, y: clientY - r.top });
    },
    []
  );

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

  // Clicking anywhere outside the panel closes it. Done with a document
  // listener rather than a full-screen backdrop on purpose: a backdrop
  // would swallow clicks on the discipline cards, and clicking straight
  // from one discipline to another is the main way you move around here.
  // Cards opt out via data-discipline-card so they keep switching instead
  // of closing.
  useEffect(() => {
    if (!activeId) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (target.closest("[data-discipline-card]")) return;
      setActiveId(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[85vh]"
        style={{
          // Focused, the horizon takes on that discipline's color — the
          // whole scene acknowledges the selection, not just the waves.
          // Without this the band between the cards and the waterline is
          // flat black, and the scene reads as two unrelated halves.
          background: focus
            ? `radial-gradient(125% 78% at 50% 100%, ${focus.color}2e 0%, ${focus.color}14 34%, transparent 72%)`
            : "radial-gradient(125% 78% at 50% 100%, rgba(96,178,224,0.22) 0%, rgba(104,205,158,0.10) 36%, transparent 72%)",
          transition: "background 600ms ease-out",
        }}
      />

      <Sea
        focusId={focusId}
        focusColor={focus?.color ?? null}
        hoverSlug={hoverWave?.wave.slug ?? null}
        onWaveHover={handleWaveHover}
        onWaveClick={(w) => router.push(w.href)}
        waveRefs={waveRefs}
      />

      {/* Hover card for a single wave. Follows the pointer, offset so it
          never sits under the cursor, and flips to the left of the cursor
          near the right edge so it can't run off-screen. */}
      {hoverWave && (
        <div
          className="pointer-events-none absolute z-30 w-64 rounded-xl border bg-surface/95 p-4 backdrop-blur-md"
          style={{
            left: hoverWave.x,
            top: hoverWave.y,
            transform: `translate(${hoverWave.x > (sceneRef.current?.clientWidth ?? 0) - 300 ? "-105%" : "16px"}, -110%)`,
            borderColor: `${DISCIPLINE_COLOR[hoverWave.wave.disciplineIds[0]]}66`,
            // A shared project's card glows in both of its colors, matching
            // the ombre on the wave itself.
            boxShadow: hoverWave.wave.disciplineIds
              .map((d) => `0 0 24px ${DISCIPLINE_COLOR[d]}33`)
              .join(", "),
          }}
        >
          <p
            className="text-sm font-bold uppercase tracking-wide"
            style={
              hoverWave.wave.disciplineIds.length > 1
                ? {
                    // Title reads as the same ombre — two disciplines, one
                    // piece of work.
                    backgroundImage: `linear-gradient(100deg, ${hoverWave.wave.disciplineIds
                      .map((d) => DISCIPLINE_COLOR[d])
                      .join(", ")})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }
                : { color: DISCIPLINE_COLOR[hoverWave.wave.disciplineIds[0]] }
            }
          >
            {hoverWave.wave.title}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            {hoverWave.wave.description}
          </p>
          <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted/70">
            {hoverWave.wave.disciplineIds
              .map((d) => disciplines.find((x) => x.id === d)?.label ?? d)
              .join(" · ")}{" "}
            — click to open
          </p>
        </div>
      )}

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

      {/* The place's name, the way the reference site puts KATE CITY at the
          top of its own scene. Doubles as the page's h1 — the old homepage
          had none once the oversized name block came out. */}
      <div className="pointer-events-none relative z-30 px-6 pt-10 text-center sm:pt-14">
        <h1
          className={`font-display text-3xl font-semibold tracking-wide text-paper transition-opacity duration-500 sm:text-4xl ${
            activeId ? "opacity-0" : "opacity-100"
          }`}
        >
          Sea of{" "}
          {/* "Riley" is the one word here that's a person rather than a
              place, so it's what carries the short introduction. The
              wrapper above is pointer-events-none (it sits over the water
              and must not eat wave hovers), so this opts itself back in. */}
          {/* Hover lives on this wrapper, not the word: the card is a
              sibling of the button, so leaving the word to reach the card
              was closing the card out from under the cursor. */}
          <span
            className="pointer-events-auto relative inline-block"
            onMouseEnter={() => setNameOpen(true)}
            onMouseLeave={() => setNameOpen(false)}
          >
            <button
              type="button"
              // Same escalation the discipline cards use: the card opens
              // first, then clicking goes to the full page. On a desktop
              // the hover has already opened it, so one click travels.
              onClick={() => {
                if (nameOpen) router.push("/about");
                else setNameOpen(true);
              }}
              aria-expanded={nameOpen}
              // No underline: the glow is the affordance. It blooms once on
              // arrival and then holds steady, brightening to accent on
              // hover (see .name-glow / .name-glow-active in globals.css).
              className={`transition-colors ${
                nameOpen ? "name-glow-active text-accent" : "name-glow"
              }`}
            >
              Riley
            </button>

            {/* The gap between word and card is padding on this outer
                wrapper rather than a margin on the card, so the cursor
                crosses a continuous hover surface instead of a dead zone
                that closes it mid-journey. */}
            <span
              aria-hidden={!nameOpen}
              className={`absolute left-1/2 top-full z-50 block w-72 -translate-x-1/2 pt-3 transition ${
                nameOpen
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <span className="block rounded-2xl border border-white/10 bg-surface/95 p-4 text-left font-sans shadow-2xl backdrop-blur-md">
                <span className="block text-sm font-normal leading-relaxed text-paper">
                  {profile.tagline}
                </span>
                <span className="mt-2 block text-xs font-normal uppercase tracking-[0.18em] text-muted">
                  {profile.workYears}
                </span>
                <span className="mt-3 block text-sm font-normal text-accent">
                  Click again to learn more about me →
                </span>
              </span>
            </span>
          </span>
        </h1>
      </div>

      {/* Cards. Wrapped row on small screens, scattered at five different
          altitudes on lg+. */}
      <div className="relative z-20 mx-auto flex min-h-[46vh] max-w-6xl flex-wrap items-start justify-center gap-3 px-4 pt-8 sm:gap-4 lg:block lg:max-w-none lg:px-0 lg:pt-0">
        {disciplines.map((d) => {
          const Icon = iconMap[d.id] ?? Code2;
          // A card also lights when you point at a wave it owns — which is
          // how a shared project shows that it belongs to two disciplines
          // at once, without needing to click anything.
          const ownsHovered =
            hoverWave?.wave.disciplineIds.includes(d.id) ?? false;
          const isFocused = focusId === d.id || ownsHovered;
          const dimmed = focusId !== null && focusId !== d.id && !ownsHovered;
          const pos = CARD_POS[d.id];
          return (
            <button
              key={d.id}
              ref={(el) => {
                cardRefs.current[d.id] = el;
              }}
              type="button"
              data-discipline-card
              onMouseEnter={() => setHoverId(d.id)}
              onMouseLeave={() => setHoverId(null)}
              onFocus={() => setHoverId(d.id)}
              onBlur={() => setHoverId(null)}
              // Click escalates rather than toggles: the first click opens
              // the panel, a second click on the same card goes to that
              // discipline's own page. The page was previously only
              // reachable from a quiet text link at the bottom of the
              // panel, which is a long way to travel for the main
              // destination. Closing is still Escape or "back to the sea".
              onClick={() => {
                if (activeId === d.id) router.push(d.href);
                else setActiveId(d.id);
              }}
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
              {/* The subtitle becomes the affordance once the panel is
                  open — otherwise the second-click-to-open behavior is
                  invisible and nobody would ever find it. */}
              <span
                className="text-[0.6rem] uppercase tracking-[0.18em] transition-colors sm:text-xs"
                style={{ color: activeId === d.id ? d.color : undefined }}
              >
                <span className={activeId === d.id ? "" : "text-muted"}>
                  {activeId === d.id ? "click again to open →" : d.blurb}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel. Slides in from the right on click; the crest lines stay
          visible to its left, which is the whole point of the layout —
          you can see the shape of a discipline and read its list at once. */}
      <aside
        ref={panelRef}
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
            {/* The discipline's own page is the panel's main destination,
                so the title is the link to it — not a quiet "see all" line
                buried under a list of eight projects. */}
            <Link href={focus.href} className="group mt-6 inline-flex items-center gap-3">
              <h2
                className="text-3xl font-bold uppercase tracking-wide sm:text-4xl"
                style={{ color: focus.color }}
              >
                {focus.label}
              </h2>
              <ArrowRight
                className="h-6 w-6 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
                style={{ color: focus.color }}
              />
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
              {focus.blurb}
            </p>

            <Link
              href={focus.href}
              className="mt-5 inline-block rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition hover:brightness-125"
              style={{
                borderColor: `${focus.color}80`,
                background: `${focus.color}1a`,
                color: focus.color,
              }}
            >
              See everything in {focus.label} →
            </Link>

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

          </>
        )}
      </aside>
    </section>
  );
}
