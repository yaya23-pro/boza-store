import { Metadata } from "next";
import { notFound } from "next/navigation";
import SaleBanner from "@/components/SaleBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductFilters from "@/components/ProductFilters";
import CatalogueGrid from "@/components/CatalogueGrid";
import { getCatalogueProducts, getCategories } from "@/lib/catalogue";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ categorie: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie } = await params;
  const categories = await getCategories();
  const match = categories.find((c) => c.slug === categorie);

  if (!match) {
    return { title: "Catégorie introuvable - BOZA" };
  }

  return {
    title: `${match.name} - BOZA`,
    description: `Découvrez la collection ${match.name} chez BOZA, boutique streetwear premium.`,
    alternates: {
      canonical: `https://boza-store.vercel.app/catalogue/${categorie}`,
    },
  };
}

export default async function CategoriePage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const categories = await getCategories();
  const match = categories.find((c) => c.slug === categorie);

  if (!match) {
    notFound();
  }

  const products = await getCatalogueProducts(categorie);

  return (
    <>
      <SaleBanner />
      <Header />
      <ProductFilters categories={categories} activeSlug={categorie} />

      <section className="pb-16">
        <div className="container mx-auto">
          <CatalogueGrid products={products} />
        </div>
      </section>

      <Footer />
    </>
  );
}