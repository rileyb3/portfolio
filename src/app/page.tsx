import SeaScene from "@/components/SeaScene";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Homepage rebuilt as a sea (see SeaScene.tsx) — five discipline cards
// floating over a wave field, with glowing lines drawn from a card down to
// the specific crests that belong to it. Replaces the old Hero + Disciplines
// pair entirely; Contact still closes the page out below the water.
export default function Home() {
  return (
    <>
      <main>
        <SeaScene />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
