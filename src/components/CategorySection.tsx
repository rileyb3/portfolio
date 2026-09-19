import type { Category } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import FeaturedProject from "./FeaturedProject";
import ArtMarquee from "./ArtMarquee";
import RevealOnScroll from "./RevealOnScroll";

export default function CategorySection({ category }: { category: Category }) {
  // Roll up every tag used across this discipline's projects and
  // slideshows, in the order they first appear, with duplicates removed.
  const skills = Array.from(
    new Set([
      ...category.projects.flatMap((p) => p.tags),
      ...(category.slideshows ?? []).flatMap((s) => s.tags ?? []),
    ])
  );

  // `featured` marks the lead work for a discipline (and also drives the
  // homepage's Selected Works). A discipline with none falls back to its
  // first entry, so every page opens on something — the category arrays
  // are hand-ordered, so that lands sensibly.
  const flagged = category.projects.filter((p) => p.featured);
  const featured = flagged.length > 0 ? flagged : category.projects.slice(0, 1);
  const rest = category.projects.filter((p) => !featured.includes(p));

  // Group the remaining projects by their optional `section` label,
  // preserving the order sections first appear in (Play splits into Games
  // and Videos). A discipline with no sections gets one unlabeled grid.
  const sectionOrder: (string | undefined)[] = [];
  const sectionGroups = new Map<string | undefined, typeof rest>();
  for (const project of rest) {
    const key = project.section;
    if (!sectionGroups.has(key)) {
      sectionGroups.set(key, []);
      sectionOrder.push(key);
    }
    sectionGroups.get(key)!.push(project);
  }

  return (
    <section id={category.id} className="pb-10">
      {/* Masthead: the discipline name at poster scale, its tagline as the
          thesis, and the skill roll-up demoted to a hairline row. */}
      <RevealOnScroll className="px-6 pb-12 pt-6 sm:px-10 sm:pb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent3">
          {category.blurb}
        </p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-paper sm:text-7xl lg:text-8xl">
          {category.label}
        </h1>
        {category.tagline && (
          <p className="mt-6 max-w-3xl text-xl font-medium leading-snug text-paper/85 sm:text-3xl">
            {category.tagline}
          </p>
        )}
        {skills.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs uppercase tracking-wider text-muted">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        )}
      </RevealOnScroll>

      {featured.length > 0 && (
        <RevealOnScroll className="px-6 sm:px-10">
          <div
            className={`grid gap-6 ${
              featured.length > 1 ? "lg:grid-cols-2" : ""
            }`}
          >
            {featured.map((project) => (
              <FeaturedProject
                key={project.title}
                project={project}
                wide={featured.length === 1}
              />
            ))}
          </div>
        </RevealOnScroll>
      )}

      {sectionOrder.map((key) => (
        <RevealOnScroll
          key={key ?? "_ungrouped"}
          className="px-6 pt-12 sm:px-10 sm:pt-16"
        >
          {key ? (
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              {key}
            </h3>
          ) : (
            featured.length > 0 && (
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                More {category.label}
              </h3>
            )
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sectionGroups.get(key)!.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </RevealOnScroll>
      ))}

      {/* Artwork sits below the projects, not above them. */}
      {category.slideshows && category.slideshows.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-14">
          {category.slideshows.map((slideshow, i) => (
            <ArtMarquee
              key={slideshow.title}
              title={slideshow.title}
              caption={slideshow.caption}
              images={slideshow.images}
              // Alternate direction so two stacked bands read as separate
              // collections drifting independently rather than one block.
              reverse={i % 2 === 1}
              seconds={Math.max(60, slideshow.images.length * 7)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
