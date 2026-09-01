import Link from "next/link";
import { notFound } from "next/navigation";
import SubpageHeader from "@/components/SubpageHeader";
import Footer from "@/components/Footer";
import ExpandableImage from "@/components/ExpandableImage";
import { slugProjects, getProjectBySlug } from "@/data/projects";

export function generateStaticParams() {
  return slugProjects.map((p) => ({ slug: p.slug as string }));
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  // `body` (ordered text/image blocks) takes priority when set, so an
  // image group can sit inline right after the paragraph introducing it.
  // Otherwise fall back to the plain paragraph split used everywhere else.
  const paragraphs = (project.details ?? project.description).split("\n\n");

  return (
    <>
      <main className="min-h-screen bg-ink pb-20">
        <SubpageHeader
          backHref={`/${project.categoryId}`}
          backLabel={`Back to ${project.categoryLabel}`}
        />
        <article className="mx-auto max-w-3xl px-6 py-10">
          <div className="flex items-baseline justify-between gap-2">
            <Link
              href={`/${project.categoryId}`}
              className="text-xs uppercase tracking-widest text-muted transition hover:text-accent hover:underline"
            >
              {project.tagLabel ?? project.categoryLabel}
            </Link>
            {project.year && (
              <span className="text-xs text-muted">{project.year}</span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-paper">
            {project.title}
          </h1>

          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>

          {project.meta && project.meta.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-white/10 py-5 sm:grid-cols-4">
              {project.meta.map((m) => (
                <div key={m.label}>
                  <h2 className="text-xs uppercase tracking-widest text-muted">
                    {m.label}
                  </h2>
                  <div className="mt-1.5 space-y-0.5">
                    {m.values.map((v) => (
                      <p key={v} className="text-sm text-paper">
                        {v}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {project.palette && project.palette.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs uppercase tracking-widest text-muted">
                Palette
              </h2>
              <div className="mt-2 flex h-14 overflow-hidden rounded-full border border-white/10">
                {project.palette.map((hex) => (
                  <div
                    key={hex}
                    className="flex-1"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          )}

          {project.video ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface2">
              <video
                src={project.video}
                poster={project.image}
                controls
                playsInline
                className="w-full"
              />
            </div>
          ) : (
            project.image && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface2">
                <ExpandableImage
                  src={project.image}
                  alt={project.title}
                  className="w-full"
                />
              </div>
            )
          )}

          {project.body ? (
            <div className="mt-6 space-y-6">
              {project.body.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={i}
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "text") {
                  return (
                    <div
                      key={i}
                      className="space-y-4 text-sm leading-relaxed text-muted"
                    >
                      {block.text.split("\n\n").map((para, j) => (
                        <p key={j}>{para}</p>
                      ))}
                    </div>
                  );
                }
                if (block.type === "text-with-image") {
                  return (
                    <div
                      key={i}
                      className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6"
                    >
                      <div className="space-y-4 text-sm leading-relaxed text-muted sm:flex-1">
                        {block.text.split("\n\n").map((para, j) => (
                          <p key={j}>{para}</p>
                        ))}
                      </div>
                      <div className="w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-surface sm:w-56">
                        <ExpandableImage
                          src={block.image}
                          alt=""
                          className="w-full"
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4"
                  >
                    {block.images.map((src) => (
                      <div
                        key={src}
                        className="break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-surface"
                      >
                        <ExpandableImage src={src} alt="" className="w-full" />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {project.reflection && (
            <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-surface p-6 sm:grid-cols-3">
              {project.reflection.proudOf && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-muted">
                    Most proud of
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-paper">
                    {project.reflection.proudOf}
                  </p>
                </div>
              )}
              {project.reflection.learned && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-muted">
                    What I learned
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-paper">
                    {project.reflection.learned}
                  </p>
                </div>
              )}
              {project.reflection.redo && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-muted">
                    If I redid it
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-paper">
                    {project.reflection.redo}
                  </p>
                </div>
              )}
            </div>
          )}

          {project.link && project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm text-accent hover:underline"
            >
              {project.linkLabel ?? "View project"} →
            </a>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold text-paper">
                More from this project
              </h2>
              <div className="mt-4 columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
                {project.gallery.map((src) => (
                  <div
                    key={src}
                    className="break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-surface"
                  >
                    <ExpandableImage src={src} alt="" className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.codeSnippet && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold text-paper">
                {project.codeSnippet.label}
              </h2>
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-surface2 p-4 text-xs leading-relaxed text-muted">
                <code>{project.codeSnippet.code}</code>
              </pre>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
