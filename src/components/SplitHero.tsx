import Link from "next/link";
import ExpandableImage from "./ExpandableImage";
import RevealOnScroll from "./RevealOnScroll";

// Opening for projects whose cover image has a fixed-size subject — an
// app icon, a character, a chart. The default full-bleed hero is
// `object-cover` at 88vh, which both crops those and inflates them: a
// square icon becomes a wall, and a chart loses its axes to the crop.
//
// Here the image is contained rather than cropped, capped in height, and
// set beside the title instead of above it — so the page opens on the
// work and the words together, at a size that matches what the image
// actually contains.
export default function SplitHero({
  title,
  image,
  categoryHref,
  categoryLabel,
  year,
  tags,
}: {
  title: string;
  image: string;
  categoryHref: string;
  categoryLabel: string;
  year?: string;
  tags: string[];
}) {
  return (
    <RevealOnScroll className="relative left-1/2 -mt-10 mb-2 w-screen -translate-x-1/2 border-b border-white/10 bg-surface/40">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:gap-14">
        {/* Image first in the DOM on small screens (where it stacks above
            the title, matching the old hero's rhythm), second on large. */}
        <div className="order-1 flex justify-center lg:order-2">
          <ExpandableImage
            src={image}
            alt={title}
            className="max-h-[46vh] w-auto max-w-full rounded-2xl object-contain"
          />
        </div>

        <div className="order-2 lg:order-1">
          <div className="flex items-baseline justify-between gap-2">
            <Link
              href={categoryHref}
              className="text-sm uppercase tracking-widest text-muted transition hover:text-accent hover:underline"
            >
              {categoryLabel}
            </Link>
            {year && <span className="text-sm text-muted">{year}</span>}
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            {title}
          </h1>
          {tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-white/5 px-3 py-1 text-sm text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </RevealOnScroll>
  );
}
