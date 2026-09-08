"use client";

import { waveAngle, waveGradient, waves } from "./seaData";

// The sea. Each wave is Riley's own drawing used as a CSS mask over a
// gradient — see the note in seaData.ts for why mask rather than <img>:
// it's what lets one flat PNG be steel-blue at rest, its discipline's
// color when selected, and dimmed when some other discipline is.
//
// `focusId` is the discipline currently hovered or selected. Its waves
// light up and glow; the rest of the sea recedes, the same way the
// reference site's unselected districts drop back.
export default function Sea({
  focusId,
  focusColor,
  waveRefs,
}: {
  focusId: string | null;
  focusColor: string | null;
  waveRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[62vh] sm:h-[68vh]"
      aria-hidden="true"
    >
      {waves.map((w, i) => {
        const lit = focusId ? w.disciplineIds.includes(focusId) : false;
        const dimmed = focusId !== null && !lit;
        const angle = waveAngle(i);
        return (
          <div
            key={`${w.slug}-${i}`}
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
              backgroundImage: waveGradient(w, i, angle, lit ? focusColor : null),
              transform: w.flip ? "scaleX(-1)" : undefined,
              opacity: dimmed ? 0.22 : 1,
              filter: lit
                ? `drop-shadow(0 0 22px ${focusColor}66) drop-shadow(0 0 6px ${focusColor}99)`
                : undefined,
              transition:
                "opacity 550ms ease-out, background-image 450ms ease-out, filter 450ms ease-out",
            }}
            className="absolute"
          />
        );
      })}
    </div>
  );
}
