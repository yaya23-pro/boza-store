import SaleBanner from "@/components/SaleBanner";
import Header from "@/components/Header";
import ImageSection from "@/components/ImageSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SaleBanner />
      <Header />
      <main>
        <ImageSection src="/image/paint.png" alt="Nouveautés" title="Acheter" />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}