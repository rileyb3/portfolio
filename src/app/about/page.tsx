import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import Footer from "@/components/Footer";
import { profile } from "@/data/projects";

// Icon-only social row — extend this map if a social gets added to
// profile.socials that isn't GitHub/LinkedIn.
const socialIcons: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
};

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-ink pb-24 pt-16 sm:pt-24">
        <section className="mx-auto grid max-w-5xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <h1 className="text-6xl font-black uppercase leading-[0.9] tracking-tight text-paper sm:text-7xl">
              About Me
            </h1>

            <h2 className="mt-8 text-lg font-bold uppercase tracking-wide text-paper">
              {profile.name}
            </h2>
            <p className="mt-3 max-w-md text-muted">{profile.tagline}</p>
            <p className="mt-4 max-w-md text-muted">{profile.intro}</p>

            <ul className="mt-8 flex items-center gap-3">
              {profile.socials.map((social) => {
                const Icon = socialIcons[social.label];
                return (
                  <li key={social.label}>
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-paper transition hover:bg-accent hover:text-ink"
                    >
                      {Icon ? (
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <span className="text-xs font-semibold">
                          {social.label[0]}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            {/* Decorative accent dot, floating over the gap between the
                text column and the photo — placeholder photo is the
                homepage hero shot until Riley's about-page portrait is
                dropped into public/. */}
            <span
              className="absolute -left-8 top-1/2 hidden h-4 w-4 -translate-y-1/2 rounded-full bg-accent lg:block"
              aria-hidden="true"
            />
            <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photoSrc}
                alt={profile.name}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
