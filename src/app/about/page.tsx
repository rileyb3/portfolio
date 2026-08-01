"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Github, Linkedin } from "lucide-react";
import Footer from "@/components/Footer";
import { profile } from "@/data/projects";

// Icon-only social row — extend this map if a social gets added to
// profile.socials that isn't GitHub/LinkedIn.
const socialIcons: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
};

export default function AboutPage() {
  // Once the second text block ("Am seeking...") is centered in view,
  // the sticky photo crossfades to the second image.
  const secondRef = useRef<HTMLDivElement>(null);
  const [onSecond, setOnSecond] = useState(false);

  useEffect(() => {
    const el = secondRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnSecond(entry.isIntersecting),
      // A band around the vertical center of the viewport — the crossfade
      // fires once the text is roughly centered on screen, not the
      // instant it first peeks into view.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function scrollToSecond() {
    secondRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <main className="bg-ink pb-24">
        <section className="mx-auto grid max-w-5xl gap-16 px-6 lg:grid-cols-2">
          {/* Text column — two stacked screens' worth of content, each
              vertically centered in its own viewport-height slot. */}
          <div>
            <div className="flex min-h-[calc(100vh-6rem)] flex-col justify-center pt-16 sm:pt-24">
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

              {/* Mobile-only: the main portrait, shown inline since there's
                  no sticky column to hold it (grid collapses to one
                  column below lg). */}
              <div className="mt-10 aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-surface lg:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.aboutPhotoSrc}
                  alt={profile.name}
                  className="h-full w-full object-cover object-[50%_28%]"
                />
              </div>

              <button
                type="button"
                onClick={scrollToSecond}
                className="mt-16 inline-flex w-fit animate-bounce items-center gap-2 text-xs uppercase tracking-widest text-muted transition hover:text-paper"
              >
                Scroll
                <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div
              ref={secondRef}
              className="flex min-h-screen flex-col justify-center"
            >
              <p className="max-w-md text-2xl font-semibold leading-snug text-paper sm:text-3xl">
                Am seeking: the flow state, a good team/mentor, play,
                challenge, skill &amp; personal growth.
              </p>

              {/* Mobile-only: second photo, inline beneath this block. */}
              <div className="mt-10 aspect-[4/3] w-full max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-surface lg:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.aboutPhotoSrc2}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Photo column — sticky so it stays in view while both text
              blocks scroll past, crossfading between the two photos based
              on which block is centered. */}
          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div className="sticky top-24">
              <span
                className="absolute -left-8 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-accent"
                aria-hidden="true"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.aboutPhotoSrc}
                  alt={profile.name}
                  className={`absolute inset-0 h-full w-full object-cover object-[50%_28%] transition-opacity duration-700 ${
                    onSecond ? "opacity-0" : "opacity-100"
                  }`}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.aboutPhotoSrc2}
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    onSecond ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
