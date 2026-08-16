import AdminHeader from "@/components/Admin/AdminHeader";
import Footer from "@/components/Footer";
import ModifierProduitForm from "@/components/Admin/Produits/ModifierProduitForm";

export default async function ModifierProduitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <AdminHeader />
      <main className="max-w-[1300px] mx-auto px-10 py-10 max-[640px]:px-6">
        <h1 className="font-display text-[28px] font-black mb-6">Modifier le produit</h1>
        <ModifierProduitForm produitId={id} />
      </main>
      <Footer />
    </>
  );
}