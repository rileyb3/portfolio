import Link from "next/link";
import type { Project } from "@/data/projects";
import { projectHref } from "@/data/projects";

// The lead card(s) on a discipline page. A single feature splits
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
  const eyebrow = [project.year, project.tagLabel ?? project.tags[0]]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={projectHref(project)}
      className={`group overflow-hidden rounded-3xl border border-white/10 bg-surface transition duration-300 hover:border-white/25 hover:bg-surface2 ${
        wide ? "lg:grid lg:grid-cols-5" : "flex flex-col"
      }`}
    >
      {project.image && (
        <div
          className={`overflow-hidden bg-surface2 ${
            wide
              ? "aspect-[16/10] lg:col-span-3 lg:aspect-auto lg:h-full"
              : "aspect-[16/10]"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div
        className={`flex flex-col justify-center p-7 sm:p-9 ${
          wide ? "lg:col-span-2" : ""
        }`}
      >
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em]">
          <span className="font-semibold text-accent3">Featured</span>
          {eyebrow && <span className="text-muted">{eyebrow}</span>}
        </div>

        <h3
          className={`mt-4 font-bold leading-tight tracking-tight text-paper transition group-hover:text-accent ${
            wide ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {project.title}
        </h3>

        <p className="mt-4 text-base leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.slice(0, 6).map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
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
