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
        <ImageSection src="/image/paint.png" alt="Nouveautés" title="Nouveautés" />
        <ImageSection src="/image/2_DESKTOP.webp" alt="Capuchon" title="Capuchon" />
        <ImageSection src="/image/3_DESKTOP.webp" alt="T-shirts" title="T-shirts" />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}