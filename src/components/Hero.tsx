import Link from "next/link";
import { profile, categories } from "@/data/projects";

// Name leads — it's the first thing on the page, full stop, big and black
// on white with nothing above it but the (separate, dark) site header.
// Everything from the reference (photo, tagline, the bold bar of
// discipline links) comes after it as a secondary block, not before it.
// White theme, scoped to this + Disciplines.tsx below; everything else
// (Header, About, Footer) stays on the original dark theme untouched.
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      <div className="px-6 pt-10 sm:px-10 sm:pt-16">
        <h1 className="text-center font-sans text-6xl font-bold leading-none tracking-tight text-ink sm:text-[9rem] lg:text-[12rem]">
          {profile.name}
        </h1>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-6 sm:mt-20">
        <div className="grid items-end gap-10 sm:grid-cols-2 sm:gap-16">
          <p className="max-w-md text-xl italic leading-snug text-ink sm:text-2xl lg:text-3xl">
            {profile.tagline}
          </p>

          {/* Photo: bounded card with a soft blue/green glow behind it —
              an "ocean, not literal" feel rather than a flat cutout edge. */}
          <div className="relative sm:ml-auto">
            <div
              className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-accent2/50 via-accent/25 to-transparent blur-3xl"
              aria-hidden="true"
            />
            <div className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-ink/10 sm:ml-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photoSrc}
                alt={profile.name}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* The "crisp bar" from the reference — a solid, high-contrast
            band of discipline links, pulled up to overlap the photo/
            tagline row above it rather than sitting quietly underneath. */}
        <div className="relative z-10 -mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 bg-ink px-6 py-5 text-paper shadow-2xl sm:-mt-10 sm:justify-between sm:px-10 sm:py-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${c.id}`}
              className="text-sm font-bold uppercase tracking-[0.15em] transition hover:text-accent sm:text-base"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="h-16 sm:h-24" />
    </section>
  );
}
