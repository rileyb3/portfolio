import ExpandableImage from "./ExpandableImage";
import RevealOnScroll from "./RevealOnScroll";

export type PSHalf = {
  // One line. The image is the argument; this just says what to look at.
  text: string;
  image: string;
  // Intrinsic width/height, so the box is reserved before the file lands
  // and nothing below it jumps on load.
  ratio?: number;
};

// One area of a redesign, stated as a matched pair: what was wrong, then
// what replaced it, each with its evidence at full width directly
// underneath. Breaks out of the article's max-w-3xl column — a cropped
// nav bar shown at 600px is unreadable, which defeats the point of
// showing it at all.
export default function ProblemSolution({
  label,
  problem,
  solution,
}: {
  label: string;
  problem: PSHalf;
  solution: PSHalf;
}) {
  return (
    <RevealOnScroll className="relative left-1/2 w-screen -translate-x-1/2 px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent3">
            {label}
          </h2>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
        </div>

        <Half
          kind="Problem"
          half={problem}
          alt={`Before — ${label.toLowerCase()}`}
        />

        {/* Two screenshots of the same site stacked in one column read as
            one continuous page scrolling past. This arrow, the gap either
            side of it, and the different border colour on each card are
            what say "separate artifact, later version" rather than "keep
            scrolling, same site". */}
        <div
          className="flex items-center gap-4 py-8 sm:py-10"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-white/10" />
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 text-accent">
            ↓
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <Half
          kind="Solution"
          half={solution}
          alt={`After — ${label.toLowerCase()}`}
        />
      </div>
    </RevealOnScroll>
  );
}

function Half({
  kind,
  half,
  alt,
}: {
  kind: "Problem" | "Solution";
  half: PSHalf;
  alt: string;
}) {
  const isProblem = kind === "Problem";
  return (
    <div className={isProblem ? "mt-8" : ""}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            isProblem ? "bg-white/10 text-muted" : "bg-accent/15 text-accent"
          }`}
        >
          {kind}
        </span>
        <p className="text-lg font-semibold leading-snug tracking-tight text-paper sm:text-2xl">
          {half.text}
        </p>
      </div>
      {/* Different border colour per half, so even at a glance the two
          cards are visibly separate objects rather than one long page. */}
      <div
        className={`mt-4 overflow-hidden rounded-xl border bg-surface2 ${
          isProblem ? "border-white/10" : "border-accent/30"
        }`}
      >
        <ExpandableImage
          src={half.image}
          alt={alt}
          ratio={half.ratio}
          className="w-full"
        />
      </div>
    </div>
  );
}
