import { profile } from "@/data/projects";

// A calm, mostly-empty breather section between the hero and the actual
// work. Both lines are your own approved copy — nothing invented here.
export default function Intro() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-24 pb-8 sm:pt-32 sm:pb-10">
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
        <h2 className="max-w-md text-3xl italic leading-snug text-ink sm:text-4xl lg:text-5xl">
          {profile.tagline}
        </h2>
        <p className="max-w-sm text-muted sm:pt-2">{profile.intro}</p>
      </div>

      <div className="mt-32 flex items-baseline gap-3 sm:mt-40">
        <span className="text-sm font-medium uppercase tracking-widest text-muted">
          Selected work
        </span>
        <span className="text-sm text-muted">{profile.workYears}</span>
      </div>
    </section>
  );
}
