import { profile } from "@/data/projects";
import NameWordmark from "./NameWordmark";

export default function Hero() {
  return (
    // Outer section is taller than one screen — that extra height is the
    // runway the sticky photo holds before releasing and scrolling away
    // with the rest of the page.
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

      {/* Name: plain absolute positioning, no sticky/lock — starts lower
          on the page than before (top-[55%] vs the old 38%) and scrolls
          away normally with the rest of the page, moving continuously
          past vertical center rather than pausing there. Custom vector
          wordmark (see NameWordmark) instead of live text — keeps the
          accessible name via aria-label on this heading. */}
      <div className="absolute inset-x-0 top-0 z-10 h-screen">
        <h1
          aria-label={profile.name}
          className="pointer-events-none absolute left-6 top-[55%] text-paper sm:left-10"
        >
          <NameWordmark className="h-auto w-[420px] sm:w-[740px] lg:w-[930px]" />
        </h1>
      </div>
    </section>
  );
}
