import ExpandableImage from "./ExpandableImage";

// A named "beat" in a case-study writeup — a small-caps kicker ("THE
// PROBLEM", "THE SOLUTION", "THE RESEARCH"...) above a short, large-type
// statement, optionally with one supporting image. Modeled on
// angelechendesigns.com/bink's problem/solution sections: a deliberate
// pause in the scroll, legible at a glance without reading the body copy.
//
// Inverts to the light theme (bg-paper) rather than trying to go
// "darker" than the page's own near-black bg-ink — on this site the rest
// of the project page is already dark, so a light flip is what actually
// reads as a shift in rhythm, the same trick Disciplines uses on the
// homepage (a white section breaking up the dark Hero).
export default function StoryBeat({
  kicker,
  heading,
  text,
  image,
  imageRatio,
}: {
  kicker: string;
  heading: string;
  text?: string;
  image?: string;
  imageRatio?: number;
}) {
  return (
    <div className="bg-paper px-6 py-16 text-center text-ink sm:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50 sm:text-sm">
        {kicker}
      </p>
      <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-bold leading-snug tracking-tight sm:text-4xl">
        {heading}
      </h2>
      {text && (
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/70">
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
