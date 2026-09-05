import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";
import SubpageHeader from "@/components/SubpageHeader";
import Footer from "@/components/Footer";
import ExpandableImage from "@/components/ExpandableImage";
import RevealOnScroll from "@/components/RevealOnScroll";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ImageSlideshow from "@/components/ImageSlideshow";
import StoryBeat from "@/components/StoryBeat";
import ImagePile from "@/components/ImagePile";
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
        <SubpageHeader backHref={`/${project.categoryId}`} />
        <article className="mx-auto max-w-3xl px-6 py-10">
          {/* Opt-in "big picture first" opening (see `heroImageFirst` on
              Project) — one full-bleed, near-full-screen image/video with
              no text on it at all, before the title even shows up. Pulled
              up over the article's own top padding so it sits right under
              SubpageHeader's back-link row instead of leaving a gap. */}
          {project.heroImageFirst && (project.video || project.image) && (
            <RevealOnScroll className="relative left-1/2 -mt-10 mb-8 w-screen -translate-x-1/2 overflow-hidden bg-surface2">
              {project.video ? (
                <video
                  src={project.video}
                  poster={project.image}
                  controls
                  playsInline
                  className="max-h-[88vh] w-full object-cover"
                />
              ) : (
                <ExpandableImage
                  src={project.image!}
                  alt={project.title}
                  className="max-h-[88vh] w-full object-cover"
                />
              )}
              {/* Nothing on this opening image says "keep scrolling" on
                  its own, so a small bouncing chevron does that job —
                  the only text-free way to signal there's more below. */}
              <ChevronDown
                className="pointer-events-none absolute bottom-5 left-1/2 h-8 w-8 -translate-x-1/2 animate-bounce text-paper drop-shadow-lg"
                strokeWidth={2}
                aria-hidden="true"
              />
            </RevealOnScroll>
          )}
          <div className="flex items-baseline justify-between gap-2">
            <Link
              href={`/${project.categoryId}`}
              className="text-sm uppercase tracking-widest text-muted transition hover:text-accent hover:underline"
            >
              {project.tagLabel ?? project.categoryLabel}
            </Link>
            {project.year && (
              <span className="text-sm text-muted">{project.year}</span>
            )}
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-paper sm:text-5xl">
            {project.title}
          </h1>

          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-white/5 px-3 py-1 text-sm text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>

          {project.meta && project.meta.length > 0 && (
            <RevealOnScroll className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-white/10 py-5 sm:grid-cols-4">
              {project.meta.map((m) => (
                <div key={m.label}>
                  <h2 className="text-sm uppercase tracking-widest text-muted">
                    {m.label}
                  </h2>
                  <div className="mt-1.5 space-y-0.5">
                    {m.values.map((v) => (
                      <p key={v} className="text-base text-paper">
                        {v}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </RevealOnScroll>
          )}

          {/* Body-driven projects place the palette explicitly via a
              `{ type: "palette" }` block wherever the writeup actually
              talks about it; only the legacy flat-paragraph path (no
              `body`) falls back to always showing it up here. */}
          {!project.body && project.palette && project.palette.length > 0 && (
            <RevealOnScroll className="mt-6">
              <h2 className="text-sm uppercase tracking-widest text-muted">
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
            </RevealOnScroll>
          )}

          {!project.heroImageFirst &&
            (project.video ? (
              <RevealOnScroll className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface2">
                <video
                  src={project.video}
                  poster={project.image}
                  controls
                  playsInline
                  className="w-full"
                />
              </RevealOnScroll>
            ) : (
              project.image && (
                <RevealOnScroll className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface2">
                  <ExpandableImage
                    src={project.image}
                    alt={project.title}
                    className="w-full"
                  />
                </RevealOnScroll>
              )
            ))}

          {project.body ? (
            <div className="mt-6 space-y-6">
              {project.body.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <RevealOnScroll key={i}>
                      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        {block.text}
                      </h2>
                    </RevealOnScroll>
                  );
                }
                if (block.type === "text") {
                  return (
                    <RevealOnScroll
                      key={i}
                      className="space-y-4 text-base leading-relaxed text-muted"
                    >
                      {block.text.split("\n\n").map((para, j) => (
                        <p key={j}>{para}</p>
                      ))}
                    </RevealOnScroll>
                  );
                }
                if (block.type === "full-image") {
                  return (
                    <RevealOnScroll
                      key={i}
                      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-surface2 sm:max-h-[85vh]"
                    >
                      <ExpandableImage
                        src={block.image}
                        alt=""
                        className="w-full sm:max-h-[85vh] sm:object-contain"
                      />
                    </RevealOnScroll>
                  );
                }
                if (block.type === "slideshow") {
                  return (
                    <RevealOnScroll
                      key={i}
                      className="relative left-1/2 w-screen -translate-x-1/2"
                    >
                      <ImageSlideshow images={block.images} />
                    </RevealOnScroll>
                  );
                }
                if (block.type === "beat") {
                  return (
                    <RevealOnScroll
                      key={i}
                      className="relative left-1/2 w-screen -translate-x-1/2"
                    >
                      <StoryBeat
                        kicker={block.kicker}
                        heading={block.heading}
                        text={block.text}
                        image={block.image}
                        imageRatio={block.imageRatio}
                        invert={block.invert}
                      />
                    </RevealOnScroll>
                  );
                }
                if (block.type === "image-pile") {
                  return (
                    <RevealOnScroll
                      key={i}
                      className="relative left-1/2 w-screen -translate-x-1/2"
                    >
                      <ImagePile images={block.images} />
                    </RevealOnScroll>
                  );
                }
                if (block.type === "video") {
                  return (
                    <RevealOnScroll
                      key={i}
                      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-surface2"
                    >
                      <video
                        src={block.src}
                        poster={block.poster}
                        controls
                        playsInline
                        className="max-h-[85vh] w-full"
                      />
                    </RevealOnScroll>
                  );
                }
                if (block.type === "palette") {
                  if (!project.palette || project.palette.length === 0)
                    return null;
                  return (
                    <RevealOnScroll key={i}>
                      <div className="flex h-14 overflow-hidden rounded-full border border-white/10">
                        {project.palette.map((hex) => (
                          <div
                            key={hex}
                            className="flex-1"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </RevealOnScroll>
                  );
                }
                if (block.type === "pills") {
                  return (
                    <RevealOnScroll
                      key={i}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <span className="text-sm uppercase tracking-widest text-muted">
                        {block.label}:
                      </span>
                      {block.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-paper"
                        >
                          {item}
                        </span>
                      ))}
                    </RevealOnScroll>
                  );
                }
                if (block.type === "before-after") {
                  return (
                    <RevealOnScroll
                      key={i}
                      className="relative left-1/2 w-screen -translate-x-1/2"
                    >
                      <BeforeAfterSlider
                        before={block.before}
                        after={block.after}
                      />
                    </RevealOnScroll>
                  );
                }
                if (block.type === "text-with-image") {
                  return (
                    <RevealOnScroll
                      key={i}
                      className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6"
                    >
                      <div className="space-y-4 text-base leading-relaxed text-muted sm:flex-1">
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
                    </RevealOnScroll>
                  );
                }
                return (
                  <RevealOnScroll
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
                  </RevealOnScroll>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {project.reflection && (
            <RevealOnScroll className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-surface p-6 sm:grid-cols-3">
              {project.reflection.proudOf && (
                <div>
                  <h2 className="text-sm uppercase tracking-widest text-muted">
                    Most proud of
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-paper">
                    {project.reflection.proudOf}
                  </p>
                </div>
              )}
              {project.reflection.learned && (
                <div>
                  <h2 className="text-sm uppercase tracking-widest text-muted">
                    What I learned
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-paper">
                    {project.reflection.learned}
                  </p>
                </div>
              )}
              {project.reflection.redo && (
                <div>
                  <h2 className="text-sm uppercase tracking-widest text-muted">
                    If I redid it
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-paper">
                    {project.reflection.redo}
                  </p>
                </div>
              )}
            </RevealOnScroll>
          )}

          {project.link && project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-base text-accent hover:underline"
            >
              {project.linkLabel ?? "View project"} →
            </a>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <RevealOnScroll className="mt-10">
              <h2 className="text-base font-semibold text-paper">
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
            </RevealOnScroll>
          )}

          {project.codeSnippet && (
            <RevealOnScroll className="mt-10">
              <h2 className="text-base font-semibold text-paper">
                {project.codeSnippet.label}
              </h2>
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-surface2 p-4 text-sm leading-relaxed text-muted">
                <code>{project.codeSnippet.code}</code>
              </pre>
            </RevealOnScroll>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
