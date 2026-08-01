import { profile } from "@/data/projects";
import NameWordmark from "./NameWordmark";

export default function Hero() {
  return (
    // Outer section is taller than one screen — that extra height is the
    // runway both the sticky photo and the sticky name hold before
    // releasing and scrolling away with the rest of the page.
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

      <div className="absolute left-8 top-8 z-10 sm:left-12 sm:top-10">
        <a
          href={profile.cvHref}
          download
          className="inline-flex w-fit items-center rounded-full bg-accent3 px-5 py-2.5 text-sm font-medium text-ink transition hover:opacity-80"
        >
          Download CV
        </a>
      </div>

      {/* Name: a separate absolutely-positioned block starting at 65vh down
          the section (so it's independent of the photo's own h-screen flow
          box — no negative margins, which caused the lock to fire, release,
          and re-trigger). The h1 inside is sticky top-1/2: visible at its
          natural lower position on load, then holds at vertical center
          once scrolled there, releasing only when this block's bottom
          (140vh) runs out — one clean stick, no double-float. Custom
          vector wordmark (see NameWordmark) instead of live text — keeps
          the accessible name via aria-label on this heading. */}
      <div className="absolute inset-x-0 top-[65vh] z-10 h-[75vh]">
        <h1
          aria-label={profile.name}
          className="pointer-events-none sticky top-1/2 w-fit -translate-y-1/2 pl-6 text-paper sm:pl-10"
        >
          <NameWordmark className="h-auto w-[420px] sm:w-[740px] lg:w-[930px]" />
        </h1>
      </div>
    </section>
  );
}
