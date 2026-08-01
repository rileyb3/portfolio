import Hero from "@/components/Hero";
import Disciplines from "@/components/Disciplines";
import AccentBand from "@/components/AccentBand";
import Intro from "@/components/Intro";
import SelectedWorks from "@/components/SelectedWorks";
import TechMarquee from "@/components/TechMarquee";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Disciplines />
        <AccentBand />
        <Intro />
        <SelectedWorks />
        <TechMarquee />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
