import { profile } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

// Reduced to just two links — LinkedIn and email, pinned to opposite
// bottom corners with a diagonal arrow — replacing the old "Let's work
// together" box (heading, blurb, Download CV, GitHub). Kept the
// id="contact" anchor since both the top bar and Hero's white bar still
// link to /#contact.
export default function Contact() {
  const linkedin = profile.socials.find((s) => s.label === "LinkedIn");

  return (
    <section
      id="contact"
      className="flex min-h-[160px] items-end justify-between px-6 py-12 sm:min-h-[220px] sm:px-10"
    >
      {linkedin && (
        <a
          href={linkedin.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-paper transition hover:text-accent"
        >
          LNKDN
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
        </a>
      )}
      <a
        href={`mailto:${profile.email}`}
        className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-paper transition hover:text-accent"
      >
        {profile.email}
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
      </a>
    </section>
  );
}
