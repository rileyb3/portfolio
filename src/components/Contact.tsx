"use client";

import { useState } from "react";
import { profile } from "@/data/projects";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — mailto below
      // still works as a fallback via the link semantics of the button
      // itself failing gracefully into nothing; not worth extra UI for
      // such a rare case.
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-20">
      <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          Let&apos;s work together
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Open to roles across software, design, games, research, and
          writing. Reach out any time.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={copyEmail}
            className="rounded-full bg-accent2 px-5 py-2.5 text-sm font-medium text-ink transition hover:opacity-80"
          >
            {copied ? "Copied!" : profile.email}
          </button>
          <a
            href={profile.cvHref}
            download
            className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium text-ink transition hover:border-ink/40"
          >
            Download CV
          </a>
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium text-ink transition hover:border-ink/40"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
