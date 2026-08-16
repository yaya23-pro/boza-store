import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PanierContent from "@/components/Panier/PanierContent";

export default function PanierPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <PanierContent />
      </Suspense>
      <Footer />
    </>
  );
}