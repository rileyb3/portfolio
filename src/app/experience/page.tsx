import Link from "next/link";
import DisciplinesCompact from "@/components/DisciplinesCompact";
import Footer from "@/components/Footer";
import { chronologicalProjects, projectHref } from "@/data/projects";

export default function ExperiencePage() {
  return (
    <>
      <main className="min-h-screen bg-ink pb-24 pt-16 sm:pt-20">
        <DisciplinesCompact />

        <section className="mx-auto max-w-4xl px-6 pt-16">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-muted">
            Everything, in order
          </h2>
          <ul className="divide-y divide-white/10">
            {chronologicalProjects.map((project) => (
              <li key={`${project.categoryId}-${project.slug}`}>
                <Link
                  href={projectHref(project)}
                  className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest text-muted">
                        {project.categoryLabel}
                      </span>
                      {project.year && (
                        <span className="text-xs text-muted">
                          · {project.year}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-paper transition group-hover:text-accent">
                      {project.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
