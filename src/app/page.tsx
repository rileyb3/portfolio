import Hero from "@/components/Hero";
import Disciplines from "@/components/Disciplines";
import Intro from "@/components/Intro";
import SelectedWorks from "@/components/SelectedWorks";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Disciplines />
        {/* TODO: visuals go here, before the bio — Riley to figure out */}
        <Intro />
        <SelectedWorks />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
