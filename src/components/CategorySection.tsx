import type { Category } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function CategorySection({ category }: { category: Category }) {
  return (
    <section id={category.id} className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-paper">
          {category.label}
        </h2>
        <p className="text-sm text-muted">{category.blurb}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {category.projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
