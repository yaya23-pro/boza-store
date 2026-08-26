import { Metadata } from "next";
import SaleBanner from "@/components/SaleBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductFilters from "@/components/ProductFilters";
import CatalogueGrid from "@/components/CatalogueGrid";
import { getCatalogueProducts, getCategories } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Catalogue - BOZA",
  description: "Découvrez toute la collection BOZA : bonnets, joggings, ensembles et tops streetwear premium.",
};

export default async function CataloguePage() {
  const [products, categories] = await Promise.all([getCatalogueProducts(), getCategories()]);

  return (
    <>
      <SaleBanner />
      <Header />
      <ProductFilters categories={categories} activeSlug={null} />

      <section className="pb-16">
        <div className="container mx-auto">
          <CatalogueGrid products={products} />
        </div>
      </section>

      <Footer />
    </>
  );
}