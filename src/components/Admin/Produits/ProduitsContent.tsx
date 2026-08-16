"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import AdminSidebar from "@/components/Admin/AdminSidebar";

type ProductRow = {
  id: string;
  nom_produit: string;
  categorie_nom: string;
  prix_min: number;
  stock_total: number;
  nb_ventes: number;
  image_url: string | null;
};

export default function ProduitsContent() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tous");

  // Suppression
  const [confirmDelete, setConfirmDelete] = useState<ProductRow | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadProducts() {
    const { data: produitsData } = await supabase
      .from("produits")
      .select(
        "id, nom_produit, categories(nom_categorie), variantes(prix, quantite, images(url_image), lignes_commande(commande_id))"
      );

    type RawVariant = {
      prix: number;
      quantite: number;
      images: { url_image: string }[] | null;
      lignes_commande: { commande_id: string }[] | null;
    };

    const formatted: ProductRow[] = (produitsData ?? []).map((p) => {
      const variantes = (p.variantes as RawVariant[]) ?? [];
      const prix_min = variantes.length > 0 ? Math.min(...variantes.map((v) => v.prix)) : 0;
      const stock_total = variantes.reduce((sum, v) => sum + v.quantite, 0);
      const categorie = p.categories as unknown as { nom_categorie: string } | null;

      const firstImage = variantes.find((v) => v.images && v.images.length > 0)?.images?.[0]?.url_image ?? null;

      const commandeIds = new Set<string>();
      variantes.forEach((v) => (v.lignes_commande ?? []).forEach((l) => commandeIds.add(l.commande_id)));

      return {
        id: p.id,
        nom_produit: p.nom_produit,
        categorie_nom: categorie?.nom_categorie ?? "—",
        prix_min,
        stock_total,
        nb_ventes: commandeIds.size,
        image_url: firstImage,
      };
    });

    const uniqueCategories = Array.from(new Set(formatted.map((p) => p.categorie_nom)));

    setProducts(formatted);
    setCategories(uniqueCategories);
  }

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/admin/connexion");
        return;
      }

      const { data: adminData } = await supabase
        .from("admins")
        .select("nom_prenom")
        .eq("id", authData.user.id)
        .single();

      if (!adminData) {
        await supabase.auth.signOut();
        router.push("/admin/connexion");
        return;
      }

      setAdminName(adminData.nom_prenom);
      await loadProducts();
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase]);

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    setDeleteError(null);

    const { data: variantesData } = await supabase
      .from("variantes")
      .select("id")
      .eq("produit_id", confirmDelete.id);

    const varianteIds = (variantesData ?? []).map((v) => v.id);

    if (varianteIds.length > 0) {
      const { data: lignesCommande } = await supabase
        .from("lignes_commande")
        .select("id")
        .in("variante_id", varianteIds)
        .limit(1);

      if (lignesCommande && lignesCommande.length > 0) {
        setDeleting(false);
        setDeleteError("Ce produit a déjà été commandé, impossible de le supprimer (historique conservé).");
        return;
      }

      const { data: retoursData } = await supabase
        .from("retours")
        .select("id")
        .in("variante_id", varianteIds)
        .limit(1);

      if (retoursData && retoursData.length > 0) {
        setDeleting(false);
        setDeleteError("Ce produit a un retour associé, impossible de le supprimer.");
        return;
      }

      await supabase.from("lignes_panier").delete().in("variante_id", varianteIds);
      await supabase.from("images").delete().in("variante_id", varianteIds);
      await supabase.from("variantes").delete().in("id", varianteIds);
    }

    const { error: produitDeleteError } = await supabase.from("produits").delete().eq("id", confirmDelete.id);

    setDeleting(false);

    if (produitDeleteError) {
      setDeleteError("Erreur lors de la suppression : " + produitDeleteError.message);
      return;
    }

    setConfirmDelete(null);
    await loadProducts();
  }

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  const filteredProducts =
    activeCategory === "Tous" ? products : products.filter((p) => p.categorie_nom === activeCategory);

  const countFor = (cat: string) =>
    cat === "Tous" ? products.length : products.filter((p) => p.categorie_nom === cat).length;

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <AdminSidebar activeSection="produits" adminName={adminName} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5">Produits</h1>
          <p className="text-boza-taupe text-sm">
            {products.length} produit{products.length > 1 ? "s" : ""} au catalogue
          </p>
        </div>

        <div className="flex justify-between items-center mb-6 flex-wrap gap-3.5">
          <div className="flex items-center border border-boza-black px-3.5 max-w-[320px] flex-1">
            <i className="fas fa-search text-boza-taupe text-[13px]"></i>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="flex-1 border-0 bg-transparent p-2.5 text-[13px] text-boza-black outline-none placeholder:text-boza-taupe"
            />
          </div>
          <Link
            href="/admin/produits/nouveau"
            className="py-3 px-6 bg-boza-black text-boza-cream border border-boza-black font-bold text-[13px] uppercase tracking-wide cursor-pointer transition-all duration-300 no-underline inline-block hover:bg-boza-brown hover:border-boza-brown"
          >
            <i className="fas fa-plus"></i> Ajouter un produit
          </Link>

          <Link
            href="/admin/produits/nouveauCat"
            className="py-3 px-6 bg-boza-black text-boza-cream border border-boza-black font-bold text-[13px] uppercase tracking-wide cursor-pointer transition-all duration-300 no-underline inline-block hover:bg-boza-brown hover:border-boza-brown"
          >
            <i className="fas fa-plus"></i> Ajouter une catégorie
          </Link>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          <button
            onClick={() => setActiveCategory("Tous")}
            className={`py-1.5 px-4 border border-boza-black font-body text-xs font-semibold cursor-pointer transition-all duration-300 ${
              activeCategory === "Tous" ? "bg-boza-black text-boza-cream" : "bg-boza-cream text-boza-black hover:bg-boza-cream-alt"
            }`}
          >
            Tous ({countFor("Tous")})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-1.5 px-4 border border-boza-black font-body text-xs font-semibold cursor-pointer transition-all duration-300 ${
                activeCategory === cat ? "bg-boza-black text-boza-cream" : "bg-boza-cream text-boza-black hover:bg-boza-cream-alt"
              }`}
            >
              {cat} ({countFor(cat)})
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-boza-cream border border-dashed border-boza-taupe p-10 text-center">
            <p className="text-boza-taupe mb-4">Aucun produit dans cette catégorie pour l&apos;instant.</p>
            <Link href="/admin/produits/nouveau" className="text-boza-black font-semibold underline">
              Ajouter un produit
            </Link>
          </div>
        ) : (
          <div className="bg-boza-cream border border-boza-cream-alt overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Produit</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Prix</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Ventes</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Stock</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url ?? "/image/BOZA1.png"}
                          alt={p.nom_produit}
                          className="w-11 h-[52px] object-cover bg-boza-cream-alt"
                        />
                        <div>
                          <div className="text-[13px] font-semibold text-boza-black">{p.nom_produit}</div>
                          <div className="text-[11px] text-boza-taupe mt-0.5">{p.categorie_nom}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">{p.prix_min.toFixed(2)} €</td>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">
                      {p.nb_ventes} commande{p.nb_ventes > 1 ? "s" : ""}
                    </td>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px]">
                      <span
                        className={`text-[11px] font-bold py-1 px-2.5 inline-block ${
                          p.stock_total <= 5 ? "bg-boza-brown text-boza-cream" : "bg-boza-cream-alt text-boza-black"
                        }`}
                      >
                        {p.stock_total} en stock
                      </span>
                    </td>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/produits?id=${p.id}`}
                          className="w-[30px] h-[30px] border border-boza-black bg-boza-cream text-boza-black flex items-center justify-center text-xs cursor-pointer transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
                        >
                          <i className="fas fa-pen"></i>
                        </Link>
                        <button
                          onClick={() => {
                            setDeleteError(null);
                            setConfirmDelete(p);
                          }}
                          className="w-[30px] h-[30px] border border-boza-black bg-boza-cream text-boza-black flex items-center justify-center text-xs cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown hover:text-boza-cream"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modale de confirmation de suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-5">
          <div className="bg-boza-cream border border-boza-black max-w-[420px] w-full p-7">
            <h3 className="font-display text-lg font-black mb-3">Supprimer ce produit ?</h3>
            <p className="text-sm text-boza-taupe mb-2">
              Tu es sur le point de supprimer <strong className="text-boza-black">{confirmDelete.nom_produit}</strong> et toutes ses variantes. Cette action est irréversible.
            </p>

            {deleteError && <p className="text-boza-brown text-sm mt-3">{deleteError}</p>}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="py-2.5 px-5 bg-boza-cream text-boza-black border border-boza-black font-bold text-[13px] uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="py-2.5 px-5 bg-boza-brown text-boza-cream border border-boza-brown font-bold text-[13px] uppercase tracking-wide cursor-pointer transition-all duration-300 hover:opacity-90 disabled:opacity-60"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}