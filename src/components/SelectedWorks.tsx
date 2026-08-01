import Link from "next/link";
import { featuredProjects, projectHref } from "@/data/projects";

// A curated handful of pieces, not the whole archive — the point is to
// keep the homepage short and consistent. Full category pages hold
// everything else (linked below each card and from the discipline grid).
export default function SelectedWorks() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <div
            key={`${project.categoryId}-${project.title}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition hover:border-white/20 hover:bg-surface2"
          >
            {/* Stretched link: makes the whole card clickable to the project,
                while the category label below stays its own, higher, clickable link. */}
            <Link
              href={projectHref(project)}
              className="absolute inset-0 z-0"
              aria-label={project.title}
            />
            {project.image && (
              <div className="aspect-video w-full overflow-hidden border-b border-white/10 bg-surface2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-baseline justify-between gap-2">
                <Link
                  href={`/${project.categoryId}`}
                  className="relative z-10 text-xs uppercase tracking-widest text-muted transition hover:text-accent hover:underline"
                >
                  {project.categoryLabel}
                </Link>
                {project.year && (
                  <span className="relative z-10 shrink-0 text-xs text-muted">
                    {project.year}
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-semibold text-paper group-hover:text-accent">
                {project.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
