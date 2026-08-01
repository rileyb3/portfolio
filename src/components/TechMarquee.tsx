// Auto-scrolling row of every tool/software that shows up across the
// actual project tags in projects.ts (kept in sync with that data rather
// than a hand-typed list, so it can't drift out of date). Text wordmark
// cards rather than brand icons — no internet access in this build
// environment to fetch real logo files, and hand-drawing brand marks
// from memory risks getting them subtly wrong.
const tools = [
  "React Native",
  "Expo",
  "TypeScript",
  "JavaScript",
  "Next.js",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Mapbox",
  "Claude API",
  "RevenueCat",
  "Fusion 360",
  "Krita",
  "Unity",
  "C#",
  "A-Frame",
  "Blender",
  "Adobe Premiere",
  "R",
];

// Duplicated once so the track can loop seamlessly — animating from 0%
// to -50% lands back on an identical copy of the first set.
const track = [...tools, ...tools];

export default function TechMarquee() {
  return (
    <section className="mx-auto max-w-6xl overflow-hidden px-6 py-16">
      <h2 className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted">
        Tools &amp; software
      </h2>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee gap-4">
          {track.map((tool, i) => (
            <div
              key={`${tool}-${i}`}
              className={`flex shrink-0 items-center justify-center rounded-full px-8 py-5 text-base font-medium text-ink ${
                i % 2 === 0 ? "bg-accent" : "bg-paper"
              }`}
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
