import Link from "next/link";
import { profile, categories } from "@/data/projects";

// Rebuilt closer to the actual Akihiko/Palmer reference structure: normal
// document flow, no scroll-jacked sticky/parallax runway. That runway was
// exactly what was leaving a huge dead-blank stretch of screen between the
// photo block and the name — this version is only as tall as its content.
// White theme, scoped to this + Disciplines.tsx below; everything else
// (Header, About, Footer) stays on the original dark theme untouched.
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      {/* Small meta line, top right — a light echo of the reference's
          "Based in Tokyo, Art Director" corner. */}
      <div className="mx-auto max-w-6xl px-6 pt-8 text-right text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted sm:px-10 sm:pt-10 sm:text-xs">
        Portfolio — {profile.workYears}
      </div>

      {/* Headline + photo, side by side like the reference's statement
          block + corner photo — the discipline links sit in a bordered
          row under the headline (its "Art Direction / Branding /
          Strategy" beat), as real clickable nav rather than decoration. */}
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-10 sm:grid-cols-2 sm:gap-16 sm:pt-14">
        <div className="flex flex-col justify-between">
          <p className="max-w-md text-2xl italic leading-snug text-ink sm:text-3xl lg:text-4xl">
            {profile.tagline}
          </p>
          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-ink/10 py-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted sm:text-xs">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/${c.id}`} className="transition hover:text-ink">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Photo: bounded card with a soft blue/green glow behind it — an
            "ocean, not literal" feel rather than a flat cutout edge. */}
        <div className="relative">
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

      {/* Name band: a self-contained gradient from transparent (blending
          into the white section above) down to solid black, so the fixed
          white name reads cleanly against it without needing to animate
          color as anything scrolls past. */}
      <div
        className="mt-16 flex min-h-[46vh] items-center justify-center px-6 py-16 sm:mt-20 sm:min-h-[52vh]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0) 0%, #0a0a0a 35%, #0a0a0a 100%)",
        }}
      >
        <h1 className="w-fit whitespace-nowrap text-center font-sans text-5xl font-semibold leading-none tracking-tight text-paper sm:text-[10rem] lg:text-[13rem]">
          {profile.name}
        </h1>
      </div>
    </section>
  );
}
