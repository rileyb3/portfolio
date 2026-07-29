import Link from "next/link";
import { featuredProjects } from "@/data/projects";

// A curated handful of pieces, not the whole archive — the point is to
// keep the homepage short and consistent. Full category pages hold
// everything else (linked below each card and from the discipline grid).
export default function SelectedWorks() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <Link
            key={`${project.categoryId}-${project.title}`}
            href={`/${project.categoryId}`}
            className="group flex flex-col rounded-2xl border border-white/10 bg-surface p-6 transition hover:border-white/20 hover:bg-surface2"
          >
            <span className="text-xs uppercase tracking-widest text-muted">
              {project.categoryLabel}
            </span>
            <h3 className="mt-2 font-semibold text-paper group-hover:text-accent">
              {project.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {project.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
