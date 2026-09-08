"use client";

import { SEA_VIEWBOX, bands, curlPath } from "./seaData";

// The sea: five overlapping swells, back to front, each lit from its own
// angle so the water has dimension rather than one flat gradient wash.
// Every project owns one crest peak, marked by a small breaking curl that
// lights up when its discipline is picked.
//
// `focusId` is the discipline currently hovered or selected — its peaks
// take on its color and everything else recedes, the same way the
// reference site's unselected districts drop back when you choose one.
export default function Sea({
  focusId,
  focusColor,
  svgRef,
}: {
  focusId: string | null;
  focusColor: string | null;
  svgRef: React.Ref<SVGSVGElement>;
}) {
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SEA_VIEWBOX.w} ${SEA_VIEWBOX.h}`}
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[68vh] w-full sm:h-[72vh]"
      aria-hidden="true"
    >
      <defs>
        {bands.map((b) => {
          const rad = (b.angle * Math.PI) / 180;
          return (
            <linearGradient
              key={b.index}
              id={`sea-band-${b.index}`}
              x1={`${50 + Math.cos(rad) * 50}%`}
              y1={`${50 + Math.sin(rad) * 50}%`}
              x2={`${50 - Math.cos(rad) * 50}%`}
              y2={`${50 - Math.sin(rad) * 50}%`}
            >
              <stop offset="0%" stopColor={b.color} stopOpacity={0.34} />
              <stop offset="42%" stopColor={b.color2} stopOpacity={0.14} />
              {/* Fading to the page's own base at the trough is what makes
                  overlapping bands read as depth instead of flat cutouts. */}
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity={0.97} />
            </linearGradient>
          );
        })}
      </defs>

      {bands.map((b) => {
        // A band dims only when the focused discipline has no peaks in it.
        const hasFocus = focusId
          ? b.peaks.some((p) => p.disciplineIds.includes(focusId))
          : true;
        return (
          <g
            key={b.index}
            style={{
              opacity: focusId && !hasFocus ? b.opacity * 0.35 : b.opacity,
              transition: "opacity 600ms ease-out",
            }}
          >
            <path d={b.body} fill={`url(#sea-band-${b.index})`} />
            <path
              d={b.edge}
              fill="none"
              stroke={b.color}
              strokeOpacity={0.75}
              strokeWidth={b.strokeWidth}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* Per-project markers, drawn above every band so a front swell never
          buries the marker for a project behind it. At rest each project is
          just a faint nub on the water; picking its discipline breaks that
          crest into a lit curl. */}
      {bands.flatMap((b) =>
        b.peaks.map((p) => {
          const lit = focusId ? p.disciplineIds.includes(focusId) : false;
          return (
            <g key={p.slug}>
              <circle
                cx={p.x}
                cy={p.y}
                r={lit ? 0 : 2.6}
                fill="#fafafa"
                opacity={focusId ? 0.08 : 0.3}
                style={{ transition: "opacity 400ms ease-out, r 400ms ease-out" }}
              />
              <path
                d={curlPath(p)}
                fill="none"
                stroke={focusColor ?? "#fafafa"}
                strokeOpacity={lit ? 0.95 : 0}
                strokeWidth={2.4}
                strokeLinecap="round"
                style={{
                  filter: lit
                    ? `drop-shadow(0 0 7px ${focusColor ?? "#fafafa"})`
                    : undefined,
                  transition: "stroke-opacity 450ms ease-out, stroke 450ms ease-out",
                }}
              />
            </g>
          );
        })
      )}
    </svg>
  );
}
