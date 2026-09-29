import ExpandableImage from "./ExpandableImage";
import RevealOnScroll from "./RevealOnScroll";

// A closing index of work that didn't earn its own section: everything
// else I've set, at full bleed rather than inside the article's text
// column. Masonry rather than a uniform tile grid — these are wall
// photos at wildly different crops, and forcing them into one aspect
// ratio would cut the top off a lead route to match a boulder.
//
// Deliberately quiet: smaller tiles, one label, no captions. The page
// has already made its argument by this point; this is the evidence
// drawer, and a caption on every tile would re-open an argument that's
// finished. Tiles expand on click for anyone who wants a closer look.
export default function SettingGallery({
  label,
  images,
}: {
  label?: string;
  images: string[];
}) {
  return (
    <RevealOnScroll className="relative left-1/2 w-screen -translate-x-1/2 px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        {label && (
          <div className="mb-6 flex items-center gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent3">
              {label}
            </h3>
            <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          </div>
        )}

        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {images.map((src) => (
            <div
              key={src}
              className="break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-surface"
            >
              <ExpandableImage src={src} alt="" className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
}
