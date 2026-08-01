import { profile } from "@/data/projects";

export default function Hero() {
  return (
    // Outer section is taller than one screen — that extra height is the
    // runway the sticky photo holds for before releasing. Only the photo
    // is sticky; the name/CV button below are in normal flow, so they
    // scroll away at normal speed while the photo stays pinned — shorter
    // hold than before, so it releases sooner.
    <section id="top" className="relative h-[140vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        {/* Photo: full-bleed on the right. Hard cut to black on the left —
            no gradient, just a clean edge. */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-[62%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.photoSrc}
            alt={profile.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Text layer: NOT sticky, sits in the first screen of the section
          and scrolls away normally, separate from the pinned photo above. */}
      <div className="absolute inset-x-0 top-0 z-10 h-screen">
        <div className="absolute left-8 top-8 sm:left-12 sm:top-10">
          <a
            href={profile.cvHref}
            download
            className="inline-flex w-fit items-center rounded-full bg-accent3 px-5 py-2.5 text-sm font-medium text-ink transition hover:opacity-80"
          >
            Download CV
          </a>
        </div>

        {/* Name: overlaps the boundary between the dark panel and the photo.
            Solid color, no gradient — plain font choice only. Extra line-height
            and padding keep descenders (y, g) from clipping against the edge. */}
        <h1 className="pointer-events-none absolute left-6 top-[38%] whitespace-nowrap pb-4 font-display text-7xl font-medium leading-[1.15] tracking-normal text-paper sm:left-10 sm:text-9xl lg:text-[10rem]">
          {profile.name}
        </h1>
      </div>
    </section>
  );
}
