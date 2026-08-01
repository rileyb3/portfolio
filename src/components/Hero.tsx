import { profile } from "@/data/projects";

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

      {/* Name: back to plain live text in a simple, clean font (no custom
          wordmark) — sized big enough that it runs off the right edge of
          the screen on purpose, as a visual cue that there's more to
          scroll through. globals.css sets overflow-x:hidden so this
          doesn't create a horizontal scrollbar. */}
      <div className="absolute inset-x-0 top-0 z-10 h-screen">
        <h1
          className="pointer-events-none absolute left-6 top-[55%] whitespace-nowrap font-sans text-8xl font-semibold leading-none tracking-tight text-paper sm:left-10 sm:text-9xl lg:text-[11rem]"
        >
          {profile.name}
        </h1>
      </div>
    </section>
  );
}
