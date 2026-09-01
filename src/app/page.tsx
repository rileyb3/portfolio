import Hero from "@/components/Hero";
import Disciplines from "@/components/Disciplines";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Intro ("Selected work" byline), SelectedWorks (the project grid it led
// into), and TechMarquee ("Tools & software") all removed from the
// homepage per request — Disciplines now leads straight into Contact.
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Disciplines />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
