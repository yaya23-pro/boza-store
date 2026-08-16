"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminHeader from "@/components/Admin/AdminHeader";
import Footer from "@/components/Footer";
import ProduitsContent from "@/components/Admin/Produits/ProduitsContent";
import ModifierProduitForm from "@/components/Admin/Produits/ModifierProduitForm";

function ProduitsPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (id) {
    return (
      <main className="max-w-[1300px] mx-auto px-10 py-10 max-[640px]:px-6">
        <h1 className="font-display text-[28px] font-black mb-6">Modifier le produit</h1>
        <ModifierProduitForm produitId={id} />
      </main>
    );
  }

  return <ProduitsContent />;
}

export default function AdminProduitsPage() {
  return (
    <>
      <AdminHeader />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <ProduitsPageInner />
      </Suspense>
      <Footer />
    </>
  );
}