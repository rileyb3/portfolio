import ExpandableImage from "./ExpandableImage";
import RevealOnScroll from "./RevealOnScroll";

// A single full-bleed row of same-shaped images, side by side at a size
// where each one is actually readable. Built for portrait posts and
// mockups: the `images` block puts them in a masonry inside the article's
// narrow text column, which shrinks a 4:5 poster to thumbnail size; and
// stacking them one per screen (full-image) turns three posters into
// three screens of scrolling.
//
// Two images sit in a narrower row than three or four so that a pair of
// posters doesn't get blown up to fill 1150px of width.
export default function ImageRow({
  images,
  ratio,
}: {
  images: string[];
  // Shared intrinsic width/height. Reserves the row's height before the
  // files land so nothing below jumps.
  ratio?: number;
}) {
  const n = images.length;
  const layout =
    n <= 2
      ? "max-w-4xl grid-cols-2"
      : n === 3
        ? "max-w-6xl grid-cols-2 sm:grid-cols-3"
        : "max-w-6xl grid-cols-2 lg:grid-cols-4";

  return (
    <RevealOnScroll className="relative left-1/2 w-screen -translate-x-1/2 px-6 py-8 sm:px-10 sm:py-12">
      <div className={`mx-auto grid gap-4 sm:gap-6 ${layout}`}>
        {images.map((src) => (
          <div
            key={src}
            className="overflow-hidden rounded-xl border border-white/10 bg-surface"
          >
            <ExpandableImage
              src={src}
              alt=""
              ratio={ratio}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </RevealOnScroll>
  );
}
