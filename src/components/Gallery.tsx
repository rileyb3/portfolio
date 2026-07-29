import { gallery } from "@/data/projects";

export default function Gallery() {
  return (
    <section id="gallery" className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-paper">
          Gallery
        </h2>
        <p className="mt-1 text-sm text-muted">
          Routesetting and other visual work
        </p>
      </div>
      <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
        {gallery.map((img) => (
          <figure
            key={img.src}
            className="break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.caption ?? ""} className="w-full" />
            {img.caption && (
              <figcaption className="px-3 py-2 text-xs text-muted">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
