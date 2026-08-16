import { Suspense } from "react";
import ConfirmationHeader from "@/components/Confirmation/ConfirmationHeader";
import Footer from "@/components/Footer";
import ConfirmationContent from "@/components/Confirmation/ConfirmationContent";

export default function ConfirmationPage() {
  return (
    <>
      <ConfirmationHeader />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <ConfirmationContent />
      </Suspense>
      <Footer />
    </>
  );
}