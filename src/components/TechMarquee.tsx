// Auto-scrolling row of every tool/software that shows up across the
// actual project tags in projects.ts, plus a few real logo files Riley
// sent directly (kept in sync with that data rather than a hand-typed
// list, so it can't drift out of date). Each entry's `logo` points at
// public/logos/<slug>.png.
const tools = [
  { name: "React Native", logo: "react-native" },
  { name: "Expo", logo: "expo" },
  { name: "TypeScript", logo: "typescript" },
  { name: "JavaScript", logo: "javascript" },
  { name: "Next.js", logo: "nextjs" },
  { name: "Tailwind CSS", logo: "tailwind" },
  { name: "Supabase", logo: "supabase" },
  { name: "PostgreSQL", logo: "postgresql" },
  { name: "Mapbox", logo: "mapbox" },
  { name: "Claude API", logo: "claude" },
  { name: "RevenueCat", logo: "revenuecat" },
  { name: "Fusion 360", logo: "fusion360" },
  { name: "Krita", logo: "krita" },
  { name: "Unity", logo: "unity" },
  { name: "C#", logo: "csharp" },
  { name: "A-Frame", logo: "aframe" },
  { name: "Blender", logo: "blender" },
  { name: "Adobe Premiere", logo: "premiere" },
  { name: "Adobe Audition", logo: "audition" },
  { name: "R", logo: "r" },
  { name: "Raven Pro", logo: "raven-pro" },
  { name: "VS Code", logo: "vscode" },
  { name: "Excel", logo: "excel" },
  { name: "Eclipse", logo: "eclipse" },
  { name: "GitHub", logo: "github" },
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
              key={`${tool.name}-${i}`}
              className="flex shrink-0 items-center gap-3 rounded-full bg-accent px-6 py-4 text-base font-medium text-ink"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/${tool.logo}.png`}
                alt=""
                aria-hidden="true"
                className="h-7 w-auto max-w-[2rem] object-contain"
              />
              {tool.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
