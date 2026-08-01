import Footer from "@/components/Footer";
import { profile } from "@/data/projects";

// Placeholder — just enough so the nav link isn't dead. Worth designing
// properly once Experience is settled (photo, fuller bio, etc.).
export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-ink pb-24 pt-16 sm:pt-20">
        <section className="mx-auto max-w-2xl px-6">
          <h1 className="text-3xl font-bold tracking-tight text-paper sm:text-4xl">
            About
          </h1>
          <p className="mt-6 text-lg italic leading-snug text-paper/80">
            {profile.tagline}
          </p>
          <p className="mt-6 text-muted">{profile.intro}</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
