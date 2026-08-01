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

        {/* Edge strip: a wider (~2/3in), taller repeating sliver of the
            photo's own leftmost, person-free edge (rocks/ocean — cropped
            right before any clothing enters frame at this width) —
            floats in the black panel with at least a half-inch gap of
            solid black on both sides. Desktop only, since the photo is
            full-width (no black panel) on mobile. */}
        <div
          className="absolute inset-y-0 left-[calc(38%-112px)] hidden w-16 bg-[url('/edge-strip-v2.jpg')] bg-[length:64px_auto] bg-repeat-y bg-left-top sm:block"
          aria-hidden="true"
        />
      </div>

      {/* Name: back to plain live text in a simple, clean font (no custom
          wordmark) — centered horizontally and sized big enough that it
          runs off both edges of the screen on purpose, as a visual cue
          that there's more to scroll through. globals.css sets
          overflow-x:hidden so this doesn't create a horizontal
          scrollbar. */}
      <div className="absolute inset-x-0 top-0 z-10 h-screen">
        <h1 className="pointer-events-none absolute left-1/2 top-[68%] -translate-x-1/2 whitespace-nowrap font-sans text-9xl font-semibold leading-none tracking-tight text-paper sm:text-[12rem] lg:text-[15rem]">
          {profile.name}
        </h1>
      </div>
    </section>
  );
}
