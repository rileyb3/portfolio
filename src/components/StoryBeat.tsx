import ExpandableImage from "./ExpandableImage";

// A named "beat" in a case-study writeup — a small-caps kicker ("THE
// APPROACH", "THE RESEARCH", "THE RESULT"...) above a short, large-type
// statement, optionally with one supporting image. Modeled on
// angelechendesigns.com/bink's problem/solution sections: a deliberate
// pause in the scroll, legible at a glance without reading the body copy.
//
// Every section title on a story-page uses this same component — even
// ones with no image of their own (Research, Iterations) — specifically
// so the page never mixes this look with the older small-caps accent
// `heading` block type mid-page. That mixing was the actual bug in the
// first VMM pass: two different heading styles appearing back to back
// read as broken, not just inconsistent.
//
// Stays on the page's own dark theme (bg-ink, via `text-paper`/`muted`)
// by default rather than flipping light, so a run of several beats in a
// row (Approach, Research, Iterations, Result) never flickers between
// two background colors. Pass `invert` for the rare moment you actually
// want a light flip as a one-off shock (unused for now).
export default function StoryBeat({
  kicker,
  heading,
  text,
  image,
  imageRatio,
  invert = false,
}: {
  kicker: string;
  heading: string;
  text?: string;
  image?: string;
  imageRatio?: number;
  invert?: boolean;
}) {
  return (
    <div
      className={`px-6 py-14 text-center sm:py-20 ${
        invert ? "bg-paper text-ink" : "bg-ink text-paper"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.3em] sm:text-sm ${
          invert ? "text-ink/50" : "text-accent"
        }`}
      >
        {kicker}
      </p>
      <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-bold leading-snug tracking-tight sm:text-4xl">
        {heading}
      </h2>
      {text && (
        <p
          className={`mx-auto mt-5 max-w-xl text-base leading-relaxed ${
            invert ? "text-ink/70" : "text-muted"
          }`}
        >
          {text}
        </p>
      )}
      {image && (
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl shadow-2xl">
          <ExpandableImage
            src={image}
            alt={heading}
            ratio={imageRatio}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
