import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReturnRequestForm from "@/components/ReturnRequest/ReturnRequestForm";

export const metadata: Metadata = {
  title: "Effectuer un retour - BOZA",
  description: "Demande un retour ou un échange pour ta commande BOZA en quelques clics.",
};

export default function RetourPage() {
  return (
    <>
      <Header />

      <div className="text-center max-w-[600px] mx-auto pt-[20px] px-6 pb-10">
        <h1 className="font-display text-[34px] font-black mb-3.5 max-[640px]:text-[26px]">
          Effectuer un retour
        </h1>
        <p className="text-boza-taupe text-[15px] leading-[1.6]">
          Un souci avec ta commande ? Remplis ce formulaire, on te répond par e-mail sous 48h avec la marche
          à suivre. Pas besoin de créer de compte.
        </p>
      </div>

      <div className="w-full max-w-[600px] mx-auto px-6 pb-20">
        <ReturnRequestForm />
      </div>

      <Footer />
    </>
  );
}
