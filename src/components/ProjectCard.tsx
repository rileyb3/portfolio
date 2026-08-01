import Link from "next/link";
import type { Project } from "@/data/projects";
import { projectHref } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const href = projectHref(project);
  // Every card now goes to its own dedicated project page (whatever
  // info exists is shown there), so this is always an internal link.

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition hover:border-white/20 hover:bg-surface2"
    >
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
          <h3 className="font-semibold text-paper group-hover:text-accent">
            {project.title}
          </h3>
          {project.year && (
            <span className="shrink-0 text-xs text-muted">{project.year}</span>
          )}
        </div>
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
      </div>
    </Link>
  );
}
