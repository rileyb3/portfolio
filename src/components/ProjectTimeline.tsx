import RevealOnScroll from "./RevealOnScroll";

export type TimelinePhase = {
  label: string;
  // How many grid columns this phase covers. The column count for the
  // whole chart is the sum of these, so phases and tasks share one grid.
  span: number;
  // Secondary line under the phase name — a month, a date range.
  note?: string;
};

export type TimelineTask = {
  label: string;
  // 1-indexed starting column, and how many columns the bar covers.
  start: number;
  span: number;
};

// A Gantt-style project timeline: named phases across the top, staggered
// task bars underneath. This is the element that makes a case study read
// as planned work rather than a list of screenshots — it shows the shape
// of the process, including the overlaps, at a glance.
//
// Deliberately rendered light on an otherwise dark page. A chart this
// fine-grained (hairline dividers, small labels) is much easier to read
// on paper-white, and one flip is a rhythm break rather than the
// flickering StoryBeat.tsx warns about — that warning is about a RUN of
// alternating sections, not a single inverted one.
export default function ProjectTimeline({
  kicker = "Project Timeline",
  heading,
  phases,
  tasks,
}: {
  kicker?: string;
  heading?: string;
  phases: TimelinePhase[];
  tasks: TimelineTask[];
}) {
  const columns = phases.reduce((sum, p) => sum + p.span, 0);

  return (
    <RevealOnScroll className="relative left-1/2 w-screen -translate-x-1/2 bg-paper px-6 py-14 text-ink sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/40 sm:text-sm">
          {kicker}
        </p>
        {heading && (
          <h2 className="mt-4 max-w-4xl text-xl font-bold leading-snug tracking-tight sm:text-3xl">
            {heading}
          </h2>
        )}

        {/* A Gantt squeezed into ~400px is unreadable, so the chart keeps a
            floor width and scrolls sideways inside its own container
            instead — the page body itself never scrolls horizontally. */}
        <div className="mt-12 overflow-x-auto pb-2">
          <div className="min-w-[720px]">
            {/* Phase headers */}
            <div
              className="grid gap-x-0"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {phases.map((phase, i) => {
                const start =
                  phases.slice(0, i).reduce((s, p) => s + p.span, 0) + 1;
                return (
                  <div
                    key={phase.label}
                    className="border-l-2 border-accent3 pl-2"
                    style={{ gridColumn: `${start} / span ${phase.span}` }}
                  >
                    <p className="text-[10px] font-bold text-accent3">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase leading-tight tracking-wide text-accent3">
                      {phase.label}
                    </p>
                    {phase.note && (
                      <p className="mt-0.5 text-[10px] text-ink/40">
                        {phase.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Task bars, one grid row each, over the phase dividers */}
            <div
              className="relative mt-5 grid gap-y-1.5"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {/* Dashed phase boundaries running the full height, drawn
                  behind the bars so they read as guides, not dividers. */}
              <div
                className="pointer-events-none absolute inset-0 grid"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
                aria-hidden="true"
              >
                {Array.from({ length: columns }).map((_, i) => (
                  <div
                    key={i}
                    className="border-l border-dashed border-accent3/30"
                  />
                ))}
              </div>

              {tasks.map((task, i) => (
                <div
                  key={`${task.label}-${i}`}
                  className="relative z-10 rounded-md bg-accent/30 px-2 py-1.5 text-center text-[11px] font-semibold leading-tight text-ink"
                  style={{
                    gridColumn: `${task.start} / span ${task.span}`,
                    gridRow: i + 1,
                  }}
                >
                  {task.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
