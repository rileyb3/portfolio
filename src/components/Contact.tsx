import { profile } from "@/data/projects";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-20">
      <div className="rounded-2xl border border-white/10 bg-surface p-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-paper">
          Let&apos;s work together
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Open to roles across software, design, games, research, and
          writing. Reach out any time.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-accent3 px-5 py-2.5 text-sm font-medium text-ink transition hover:opacity-80"
          >
            {profile.email}
          </a>
          <a
            href={profile.cvHref}
            download
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-paper transition hover:border-white/40"
          >
            Download CV
          </a>
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-paper transition hover:border-white/40"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
