"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type Categorie = {
  id: string;
  nom_categorie: string;
};

type VariantForm = {
  id: string | null; // null = nouvelle variante
  couleur: string;
  hex: string;
  taille: string;
  prix: string;
  prixBarre: string;
  quantite: string;
  imageId: string | null;
  imageFile: File | null;
  imagePreview: string;
  toDelete: boolean;
};

const sizesList = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ModifierProduitForm({ produitId }: { produitId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [nomProduit, setNomProduit] = useState("");
  const [descProduit, setDescProduit] = useState("");
  const [categorieId, setCategorieId] = useState("");

  const [variants, setVariants] = useState<VariantForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: categoriesData } = await supabase.from("categories").select("id, nom_categorie");
      setCategories(categoriesData ?? []);

      const { data: produitData } = await supabase
        .from("produits")
        .select("nom_produit, desc_produit, categorie_id")
        .eq("id", produitId)
        .single();

      if (!produitData) {
        setError("Produit introuvable.");
        setLoading(false);
        return;
      }

      setNomProduit(produitData.nom_produit);
      setDescProduit(produitData.desc_produit ?? "");
      setCategorieId(produitData.categorie_id);

      const { data: variantesData } = await supabase
        .from("variantes")
        .select("id, couleur, couleur_hex, taille, prix, prix_barre, quantite, images(id, url_image)")
        .eq("produit_id", produitId);

      const formattedVariants: VariantForm[] = (variantesData ?? []).map((v) => {
        const images = (v.images as { id: string; url_image: string }[]) ?? [];
        return {
          id: v.id,
          couleur: v.couleur ?? "",
          hex: v.couleur_hex ?? "#000000",
          taille: v.taille ?? "M",
          prix: String(v.prix),
          prixBarre: v.prix_barre != null ? String(v.prix_barre) : "",
          quantite: String(v.quantite),
          imageId: images[0]?.id ?? null,
          imageFile: null,
          imagePreview: images[0]?.url_image ?? "",
          toDelete: false,
        };
      });

      setVariants(
        formattedVariants.length > 0
          ? formattedVariants
          : [{ id: null, couleur: "", hex: "#000000", taille: "M", prix: "", prixBarre: "", quantite: "", imageId: null, imageFile: null, imagePreview: "", toDelete: false }]
      );

      setLoading(false);
    }

    load();
  }, [produitId, supabase]);

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: null, couleur: "", hex: "#000000", taille: "M", prix: "", prixBarre: "", quantite: "", imageId: null, imageFile: null, imagePreview: "", toDelete: false },
    ]);
  };

  const removeVariant = async (index: number) => {
    const variant = variants[index];

    // Nouvelle variante jamais enregistrée : on la retire simplement du formulaire
    if (!variant.id) {
      setVariants((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    // Variante existante : on vérifie qu'elle n'a pas déjà été commandée
    const { data: lignesCommande } = await supabase
      .from("lignes_commande")
      .select("id")
      .eq("variante_id", variant.id)
      .limit(1);

    if (lignesCommande && lignesCommande.length > 0) {
      setError("Cette variante a déjà été commandée, elle ne peut pas être supprimée.");
      return;
    }

    setError(null);
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, toDelete: true } : v)));
  };

  const updateVariant = (index: number, field: keyof VariantForm, value: string) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, imageFile: file, imagePreview: preview } : v)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const activeVariants = variants.filter((v) => !v.toDelete);

    if (!nomProduit || !categorieId || activeVariants.length === 0) {
      setError("Merci de remplir le nom du produit, la catégorie, et au moins une variante.");
      return;
    }

    for (const v of activeVariants) {
      if (!v.couleur || !v.prix || !v.quantite) {
        setError("Chaque variante doit avoir une couleur, un prix et une quantité.");
        return;
      }
    }

    setSaving(true);

    // 1. Mettre à jour le produit
    const { error: produitError } = await supabase
      .from("produits")
      .update({
        nom_produit: nomProduit,
        desc_produit: descProduit,
        categorie_id: categorieId,
      })
      .eq("id", produitId);

    if (produitError) {
      setSaving(false);
      setError("Erreur lors de la mise à jour du produit : " + produitError.message);
      return;
    }

    // 2. Supprimer les variantes marquées à supprimer
    const variantsToDelete = variants.filter((v) => v.toDelete && v.id);
    for (const v of variantsToDelete) {
      await supabase.from("images").delete().eq("variante_id", v.id!);
      await supabase.from("lignes_panier").delete().eq("variante_id", v.id!);
      await supabase.from("variantes").delete().eq("id", v.id!);
    }

    // 3. Créer / mettre à jour les variantes actives
    for (const v of activeVariants) {
      let varianteId = v.id;

      if (varianteId) {
        const { error: updateError } = await supabase
          .from("variantes")
          .update({
            couleur: v.couleur,
            couleur_hex: v.hex,
            taille: v.taille,
            prix: parseFloat(v.prix),
            prix_barre: v.prixBarre ? parseFloat(v.prixBarre) : null,
            quantite: parseInt(v.quantite, 10),
          })
          .eq("id", varianteId);

        if (updateError) {
          setSaving(false);
          setError("Erreur lors de la mise à jour d'une variante : " + updateError.message);
          return;
        }
      } else {
        const { data: newVariant, error: insertError } = await supabase
          .from("variantes")
          .insert({
            produit_id: produitId,
            couleur: v.couleur,
            couleur_hex: v.hex,
            taille: v.taille,
            prix_barre: v.prixBarre ? parseFloat(v.prixBarre) : null,
            prix: parseFloat(v.prix),
            quantite: parseInt(v.quantite, 10),
          })
          .select("id")
          .single();

        if (insertError || !newVariant) {
          setSaving(false);
          setError("Erreur lors de la création d'une variante : " + insertError?.message);
          return;
        }

        varianteId = newVariant.id;
      }

      // Nouvelle image uploadée pour cette variante
      if (v.imageFile && varianteId) {
        const fileExt = v.imageFile.name.split(".").pop();
        const fileName = `${varianteId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from("produits-images").upload(fileName, v.imageFile);

        if (uploadError) {
          setSaving(false);
          setError("Erreur lors de l'upload de l'image : " + uploadError.message);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from("produits-images").getPublicUrl(fileName);

        if (v.imageId) {
          await supabase.from("images").update({ url_image: publicUrlData.publicUrl }).eq("id", v.imageId);
        } else {
          await supabase.from("images").insert({ variante_id: varianteId, url_image: publicUrlData.publicUrl, ordre: 0 });
        }
      }
    }

    setSaving(false);
    router.push("/admin/produits");
    router.refresh();
  };

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  const visibleVariants = variants.filter((v) => !v.toDelete);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
            <h2 className="font-display text-lg font-black mb-5">Informations générales</h2>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Nom du produit</label>
              <input
                type="text"
                value={nomProduit}
                onChange={(e) => setNomProduit(e.target.value)}
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Description</label>
              <textarea
                value={descProduit}
                onChange={(e) => setDescProduit(e.target.value)}
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none resize-y min-h-[100px] placeholder:text-boza-taupe focus:border-boza-brown"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Catégorie</label>
              <select
                value={categorieId}
                onChange={(e) => setCategorieId(e.target.value)}
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom_categorie}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="bg-boza-cream border border-boza-cream-alt p-7">
            <h2 className="font-display text-lg font-black mb-5">Couleurs, tailles & stock</h2>

            {visibleVariants.map((variant) => {
              const index = variants.indexOf(variant);
              return (
                <div key={index} className="border-b border-boza-cream-alt py-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] font-semibold text-boza-black">
                      Variante {index + 1} {variant.id && <span className="text-boza-taupe font-normal">(existante)</span>}
                    </span>
                    {visibleVariants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="w-7 h-7 border border-boza-brown text-boza-brown flex items-center justify-center hover:bg-boza-brown hover:text-boza-cream transition-all duration-300"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-boza-taupe mb-1.5">Nom couleur</label>
                      <input
                        type="text"
                        value={variant.couleur}
                        onChange={(e) => updateVariant(index, "couleur", e.target.value)}
                        className="w-full py-2.5 px-3 border border-boza-black bg-boza-cream text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-boza-taupe mb-1.5">Couleur (hex)</label>
                      <input
                        type="color"
                        value={variant.hex}
                        onChange={(e) => updateVariant(index, "hex", e.target.value)}
                        className="w-full h-[42px] border border-boza-black cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-boza-taupe mb-1.5">Taille</label>
                      <select
                        value={variant.taille}
                        onChange={(e) => updateVariant(index, "taille", e.target.value)}
                        className="w-full py-2.5 px-3 border border-boza-black bg-boza-cream text-sm outline-none"
                      >
                        {sizesList.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-boza-taupe mb-1.5">Prix (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.prix}
                        onChange={(e) => updateVariant(index, "prix", e.target.value)}
                        className="w-full py-2.5 px-3 border border-boza-black bg-boza-cream text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-boza-taupe mb-1.5">Prix barré (optionnel)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.prixBarre}
                        onChange={(e) => updateVariant(index, "prixBarre", e.target.value)}
                        className="w-full py-2.5 px-3 border border-boza-black bg-boza-cream text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-boza-taupe mb-1.5">Stock</label>
                      <input
                        type="number"
                        value={variant.quantite}
                        onChange={(e) => updateVariant(index, "quantite", e.target.value)}
                        className="w-full py-2.5 px-3 border border-boza-black bg-boza-cream text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-boza-taupe mb-1.5">Image de la variante</label>
                    {variant.imagePreview ? (
                      <div className="relative w-24 aspect-[3/4] border border-boza-cream-alt overflow-hidden">
                        <img src={variant.imagePreview} alt="" className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-boza-cream text-xs cursor-pointer transition-all duration-300">
                          Changer
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={(e) => handleImageChange(index, e.target.files?.[0] ?? null)}
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="w-24 aspect-[3/4] border border-dashed border-boza-taupe flex flex-col items-center justify-center gap-1.5 cursor-pointer text-boza-taupe text-xs hover:border-boza-black hover:bg-boza-cream-alt transition-all duration-300">
                        <i className="fas fa-plus"></i>
                        <span>Ajouter</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => handleImageChange(index, e.target.files?.[0] ?? null)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addVariant}
              className="mt-3 py-2.5 px-4 border border-dashed border-boza-taupe bg-transparent text-boza-black text-[13px] font-semibold cursor-pointer transition-all duration-300 hover:border-boza-black hover:bg-boza-cream-alt"
            >
              <i className="fas fa-plus"></i> Ajouter une couleur
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-boza-brown text-sm mt-5">{error}</p>}

      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={() => router.push("/admin/produits")}
          className="py-3.5 px-7 bg-boza-cream text-boza-black border border-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="py-3.5 px-8 bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}