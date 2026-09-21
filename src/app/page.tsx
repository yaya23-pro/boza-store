import SaleBanner from "@/components/SaleBanner";
import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Hero from "@/components/page_daccueil/Hero";
import ProductsSection from "@/components/page_daccueil/ProductsSection";
import BrandStory from "@/components/page_daccueil/BrandStory";
import FeaturesBar from "@/components/page_daccueil/FeaturesBar";
import { getCatalogueProducts } from "@/lib/catalogue";

export default async function Home() {
  const products = await getCatalogueProducts();

  return (
    <>
      <SaleBanner />
      <Header />
      <main>
        <Hero />
        <FeaturesBar />
        <BrandStory />
        <ProductsSection products={products} />
        <Newsletter />
      </main>
      
      <Footer />
    </>
  );
}