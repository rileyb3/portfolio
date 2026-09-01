import { profile } from "@/data/projects";

// A calm, mostly-empty breather section between the hero and the actual
// work. The tagline/intro copy + AccentBand that used to fill this space
// were removed per request — this section is now just the "Selected
// work" byline leading into the next section.
export default function Intro() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-24 pb-8 sm:pt-32 sm:pb-10">
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-medium uppercase tracking-widest text-muted">
          Selected work
        </span>
        <span className="text-sm text-muted">{profile.workYears}</span>
      </div>
    </section>
  );
}
