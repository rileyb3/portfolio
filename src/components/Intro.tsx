import { profile } from "@/data/projects";
import AccentBand from "@/components/AccentBand";

// A calm, mostly-empty breather section between the hero and the actual
// work. Both lines are your own approved copy — nothing invented here.
export default function Intro() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-24 pb-8 sm:pt-32 sm:pb-10">
      {/* AccentBand sits directly to the left of the copy — items-stretch
          (flex's default, but explicit here) is what lets its own
          self-stretch actually reach the full height of this row. */}
      <div className="flex items-stretch gap-6 sm:gap-10">
        <AccentBand />
        <div className="grid flex-1 gap-10 sm:grid-cols-2 sm:gap-16">
          <h2 className="max-w-md text-3xl italic leading-snug text-paper sm:text-4xl lg:text-5xl">
            {profile.tagline}
          </h2>
          <p className="max-w-sm text-muted sm:pt-2">{profile.intro}</p>
        </div>
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
