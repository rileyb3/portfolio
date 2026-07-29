import { notFound } from "next/navigation";
import SubpageHeader from "@/components/SubpageHeader";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import { categories } from "@/data/projects";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}

export default function DisciplinePage({
  params,
}: {
  params: { slug: string };
}) {
  const category = categories.find((c) => c.id === params.slug);
  if (!category) notFound();

  return (
    <>
      <main className="min-h-screen bg-ink pb-20">
        <SubpageHeader />
        <CategorySection category={category} />
      </main>
      <Footer />
    </>
  );
}
