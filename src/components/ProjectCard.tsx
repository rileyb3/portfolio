import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const href = project.link ?? "#";

  return (
    <a
      href={href}
      target={project.link ? "_blank" : undefined}
      rel={project.link ? "noopener noreferrer" : undefined}
      className="group flex flex-col rounded-2xl border border-white/10 bg-surface p-6 transition hover:border-white/20 hover:bg-surface2"
    >
      <h3 className="font-semibold text-paper group-hover:text-accent">
        {project.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>
    </a>
  );
}
