import Link from "next/link";
import type { Project } from "@/data/projects";
import { projectHref } from "@/data/projects";

// The lead card(s) on a discipline page. Kept deliberately short: the
// stacked variant uses a 2:1 image band, a clamped three-line blurb and
// at most four tags, so one long description can't push the pair into a
// wall of card taller than the viewport. A single feature splits
// horizontally — big image on one side, the writeup on the other — so it
// reads as a different kind of object from the grid underneath rather
// than just a bigger tile. Two or more stack image-over-text side by
// side, still visibly outranking the grid.
export default function FeaturedProject({
  project,
  wide,
}: {
  project: Project;
  wide: boolean;
}) {
  // `heroLayout: "split"` already marks covers whose subject is a fixed
  // size — an app icon, a character, a chart. Those must not be
  // object-cover: cropping a square icon into a wide card shows a
  // meaningless magnified fragment of it.
  const containCover = project.heroLayout === "split";
  const eyebrow = [project.year, project.tagLabel ?? project.tags[0]]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={projectHref(project)}
      // The image column used to be `lg:h-full` inside an auto-sized grid
      // row, which is circular: the browser falls back to the image's
      // natural height, so a square icon made the card ~50rem tall and the
      // max-height below only clipped it. The column now has a definite
      // height instead, so the card is 22rem by construction.
      className={`group overflow-hidden rounded-3xl border border-white/10 bg-surface transition duration-300 hover:border-white/25 hover:bg-surface2 ${
        wide ? "lg:grid lg:grid-cols-5 lg:max-h-[22rem]" : "flex flex-col"
      }`}
    >
      {project.image && (
        <div
          className={`overflow-hidden bg-surface2 ${
            wide
              ? "aspect-[2/1] lg:col-span-3 lg:aspect-auto lg:h-[22rem]"
              : "aspect-[2/1]"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className={`h-full w-full transition duration-500 group-hover:scale-[1.03] ${
              containCover ? "object-contain p-8" : "object-cover"
            }`}
          />
        </div>
      )}

      <div
        className={`flex flex-col justify-center p-6 sm:p-7 ${
          wide ? "lg:col-span-2" : ""
        }`}
      >
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em]">
          <span className="font-semibold text-accent3">Featured</span>
          {eyebrow && <span className="text-muted">{eyebrow}</span>}
        </div>

        <h3
          className={`mt-4 font-bold leading-tight tracking-tight text-paper transition group-hover:text-accent ${
            wide ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
          }`}
        >
          {project.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-base leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          View project
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
