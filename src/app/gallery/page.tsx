import SubpageHeader from "@/components/SubpageHeader";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function GalleryPage() {
  return (
    <>
      <main className="min-h-screen bg-ink pb-20">
        <SubpageHeader />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
