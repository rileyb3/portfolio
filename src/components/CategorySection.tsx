import type { Category } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ArtSlideshow from "./ArtSlideshow";

export default function CategorySection({ category }: { category: Category }) {
  // Roll up every tag used across this discipline's projects and
  // slideshows, in the order they first appear, with duplicates removed.
  const skills = Array.from(
    new Set([
      ...category.projects.flatMap((p) => p.tags),
      ...(category.slideshows ?? []).flatMap((s) => s.tags ?? []),
    ])
  );

  // Group projects by their optional `section` label, preserving the order
  // sections first appear in. Projects without a `section` land in one
  // unlabeled group, so categories that don't use sections render exactly
  // as before.
  const sectionOrder: (string | undefined)[] = [];
  const sectionGroups = new Map<string | undefined, typeof category.projects>();
  for (const project of category.projects) {
    const key = project.section;
    if (!sectionGroups.has(key)) {
      sectionGroups.set(key, []);
      sectionOrder.push(key);
    }
    sectionGroups.get(key)!.push(project);
  }

  return (
    <section id={category.id} className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-paper">
          {category.label}
        </h2>
        <p className="text-sm text-muted">{category.blurb}</p>
      </div>
      {category.tagline && (
        <p className="mb-8 text-lg italic text-paper/80">
          {category.tagline}
        </p>
      )}
      {skills.length > 0 && (
        <ul className="mb-8 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
      {category.slideshows && category.slideshows.length > 0 && (
        <div className="mb-10 flex flex-wrap items-start justify-center gap-10">
          {category.slideshows.map((slideshow) => (
            <ArtSlideshow
              key={slideshow.title}
              title={slideshow.title}
              caption={slideshow.caption}
              images={slideshow.images}
            />
          ))}
        </div>
      )}
      {sectionOrder.map((key) => (
        <div key={key ?? "_ungrouped"} className="mb-10 last:mb-0">
          {key && (
            <h3 className="mb-4 text-lg font-semibold text-paper/90">
              {key}
            </h3>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {sectionGroups.get(key)!.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
