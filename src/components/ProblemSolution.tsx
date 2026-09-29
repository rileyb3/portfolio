import ExpandableImage from "./ExpandableImage";
import RevealOnScroll from "./RevealOnScroll";

export type PSImage = {
  src: string;
  // Intrinsic width/height, so the box is reserved before the file lands
  // and nothing below it jumps on load. Also decides the portrait cap
  // below — a tall screenshot stretched to 1200px is just blurry.
  ratio?: number;
  // Pixel height of a scroll window for a long page capture. Shrinking a
  // tall screenshot to fit makes its content unreadable; this shows it at
  // full width inside a fixed frame you scroll instead — the same motion
  // as scrolling the real page, which is the point when the argument is
  // "this section repeats further down".
  //
  // Only set this on a capture that is genuinely much taller than the
  // window once rendered at the full column width (~1150px). Setting it
  // on a near-square image produces a frame with nothing to scroll.
  scrollHeight?: number;
};

export type PSHalf = {
  // One line. The images are the argument; this says what to look at.
  text: string;
  images: PSImage[];
};

// One area of a redesign, stated as a matched pair: what was wrong, then
// what replaced it, each with its evidence at full width underneath.
// Breaks out of the article's max-w-3xl column — a cropped nav bar shown
// at 600px is unreadable, which defeats the point of showing it at all.
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

        <Half kind="Problem" half={problem} label={label} />

        {/* Screenshots of the same site stacked in one column read as one
            continuous page scrolling past. This arrow, the gap either
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

        <Half kind="Solution" half={solution} label={label} />
      </div>
    </RevealOnScroll>
  );
}

function Half({
  kind,
  half,
  label,
}: {
  kind: "Problem" | "Solution";
  half: PSHalf;
  label: string;
}) {
  const isProblem = kind === "Problem";
  return (
    <div className={isProblem ? "mt-8" : ""}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span
          className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] sm:text-sm ${
            isProblem
              ? "border-red-400/40 bg-red-500/15 text-red-300"
              : "border-accent/40 bg-accent/15 text-accent"
          }`}
        >
          {kind}
        </span>
        <p className="text-lg font-semibold leading-snug tracking-tight text-paper sm:text-2xl">
          {half.text}
        </p>
      </div>

      <div className="mt-4 space-y-4">
        {half.images.map((img) => {
          const portrait = img.ratio !== undefined && img.ratio < 1;
          const alt = `${isProblem ? "Before" : "After"} — ${label.toLowerCase()}`;
          // Different border colour per half, so even at a glance the
          // cards are visibly separate objects rather than one long page.
          // Portrait shots are capped rather than blown up to the full
          // column width.
          const frameBase = `overflow-hidden rounded-xl border bg-surface2 ${
            isProblem ? "border-white/10" : "border-accent/30"
          }`;
          const frame = `${frameBase} ${portrait ? "mx-auto max-w-md" : ""}`;

          if (img.scrollHeight) {
            // Deliberately NOT capped to max-w-md even when the capture is
            // nominally portrait. A scroll frame exists to show a long page
            // at READABLE width; narrowing it shrinks the rendered image
            // until it is shorter than the window, at which point there is
            // nothing to scroll and the caption below is a lie. Full width
            // is what makes the frame scroll at all.
            return (
              <figure key={img.src}>
                <div className={`relative ${frameBase}`}>
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: img.scrollHeight }}
                  >
                    {/* Not ExpandableImage here: its click-to-zoom would
                        fight the scroll gesture inside the frame. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={alt} className="block w-full" />
                  </div>
                  {/* Fade at the lower edge so it reads as a window onto
                      something longer rather than a cropped image. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/80 to-transparent"
                  />
                </div>
                <figcaption className="mt-2 text-center text-xs uppercase tracking-[0.18em] text-muted">
                  Scroll inside the frame
                </figcaption>
              </figure>
            );
          }

          return (
            <div key={img.src} className={frame}>
              <ExpandableImage
                src={img.src}
                alt={alt}
                ratio={img.ratio}
                className="w-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
