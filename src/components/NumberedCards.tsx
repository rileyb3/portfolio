import RevealOnScroll from "./RevealOnScroll";

export type NumberedCard = {
  title: string;
  // Small line between title and body — a count, a role, a price.
  // The reference pattern this follows ("30 Participants", "6
  // Participants") is what makes a method section read as measured.
  subtitle?: string;
  text: string;
};

// A full-bleed band of numbered cards — the case-study workhorse for
// "here are the three things we found" / "here are the four methods we
// used". Numbering them matters: it turns a list into a claim that the
// set is complete and was chosen.
export default function NumberedCards({
  label,
  items,
  columns,
}: {
  label?: string;
  items: NumberedCard[];
  // Defaults to one column per card up to 4, which is what the layout
  // wants almost every time — pass this only to override.
  columns?: 2 | 3 | 4;
}) {
  const cols = columns ?? (Math.min(items.length, 4) as 2 | 3 | 4);
  const colClass =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <RevealOnScroll className="relative left-1/2 w-screen -translate-x-1/2 bg-surface px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {label && (
          <h2 className="mb-8 text-lg font-bold tracking-tight text-paper sm:text-xl">
            {label}
          </h2>
        )}
        <div className={`grid grid-cols-1 gap-4 ${colClass}`}>
          {items.map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl bg-surface2 p-6 sm:p-7"
            >
              <p className="text-lg font-bold text-muted/60">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-paper">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="mt-1 text-sm text-muted">{item.subtitle}</p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
}
