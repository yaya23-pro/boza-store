"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type Categorie = {
  id: string;
  nom_categorie: string;
};

type VariantForm = {
  couleur: string;
  hex: string;
  taille: string;
  prix: string;
  prixBarre: string;
  quantite: string;
  imageFile: File | null;
  imagePreview: string;
};

const sizesList = ["XS", "S", "M", "L", "XL", "XXL"];

export default function AjouterProduitForm() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [nomProduit, setNomProduit] = useState("");
  const [descProduit, setDescProduit] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [composition, setComposition] = useState("");
  const [coupe, setCoupe] = useState("");
  const [origine, setOrigine] = useState("");

  const [variants, setVariants] = useState<VariantForm[]>([
    { couleur: "", hex: "#000000", taille: "M", prix: "", prixBarre: "", quantite: "", imageFile: null, imagePreview: "" },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from("categories").select("id, nom_categorie");
      setCategories(data ?? []);
      if (data && data.length > 0) setCategorieId(data[0].id);
    }
    loadCategories();
  }, [supabase]);

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { couleur: "", hex: "#000000", taille: "M", prix: "", prixBarre: "", quantite: "", imageFile: null, imagePreview: "" },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantForm, value: string) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, imageFile: file, imagePreview: preview } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nomProduit || !categorieId || variants.length === 0) {
      setError("Merci de remplir le nom du produit, la catégorie, et au moins une variante.");
      return;
    }

    for (const v of variants) {
      if (!v.couleur || !v.prix || !v.quantite) {
        setError("Chaque variante doit avoir une couleur, un prix et une quantité.");
        return;
      }
    }

    setSaving(true);

    // 1. Créer le produit
    const { data: produitData, error: produitError } = await supabase
      .from("produits")
      .insert({
        nom_produit: nomProduit,
        desc_produit: `${descProduit}${composition ? `\nComposition : ${composition}` : ""}${coupe ? `\nCoupe : ${coupe}` : ""}${origine ? `\nOrigine : ${origine}` : ""}`,
        categorie_id: categorieId,
      })
      .select("id")
      .single();

    if (produitError || !produitData) {
      setSaving(false);
      setError("Erreur lors de la création du produit : " + produitError?.message);
      return;
    }

    // 2. Pour chaque variante : créer la variante + uploader l'image + créer l'entrée image
    for (const v of variants) {
      const { data: variantData, error: variantError } = await supabase
        .from("variantes")
        .insert({
          produit_id: produitData.id,
          couleur: v.couleur,
          taille: v.taille,
          prix: parseFloat(v.prix),
          prix_barre: v.prixBarre ? parseFloat(v.prixBarre) : null,
          quantite: parseInt(v.quantite, 10),
        })
        .select("id")
        .single();

      if (variantError || !variantData) {
        setSaving(false);
        setError("Erreur lors de la création d'une variante : " + variantError?.message);
        return;
      }

      if (v.imageFile) {
        const fileExt = v.imageFile.name.split(".").pop();
        const fileName = `${variantData.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("produits-images")
          .upload(fileName, v.imageFile);

        if (uploadError) {
          setSaving(false);
          setError("Erreur lors de l'upload de l'image : " + uploadError.message);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("produits-images")
          .getPublicUrl(fileName);

        await supabase.from("images").insert({
          variante_id: variantData.id,
          url_image: publicUrlData.publicUrl,
          ordre: 0,
        });
      }
    }

    setSaving(false);
    router.push("/admin/produits");
    router.refresh();
  };

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
                placeholder="Ex: T-Shirt BOZA Oversize"
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Description</label>
              <textarea
                value={descProduit}
                onChange={(e) => setDescProduit(e.target.value)}
                placeholder="Décris le produit..."
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
                  <option key={c.id} value={c.id}>{c.nom_categorie}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-boza-cream border border-boza-cream-alt p-7">
            <h2 className="font-display text-lg font-black mb-5">Détails complémentaires</h2>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Composition</label>
              <input
                type="text"
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                placeholder="Ex: 80% Coton, 20% Polyester"
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Coupe</label>
              <input
                type="text"
                value={coupe}
                onChange={(e) => setCoupe(e.target.value)}
                placeholder="Ex: Oversize"
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Origine</label>
              <input
                type="text"
                value={origine}
                onChange={(e) => setOrigine(e.target.value)}
                placeholder="Ex: Made in Maroc"
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
              />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="bg-boza-cream border border-boza-cream-alt p-7">
            <h2 className="font-display text-lg font-black mb-5">Couleurs, tailles & stock</h2>

            {variants.map((variant, index) => (
              <div key={index} className="border-b border-boza-cream-alt py-4 last:border-b-0">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[13px] font-semibold text-boza-black">Variante {index + 1}</span>
                  {variants.length > 1 && (
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
                      placeholder="Ex: Noir"
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
                        <option key={s} value={s}>{s}</option>
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
                      placeholder="89.90"
                      className="w-full py-2.5 px-3 border border-boza-black bg-boza-cream text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-boza-taupe mb-1.5">Prix barré</label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.prixBarre}
                      onChange={(e) => updateVariant(index, "prixBarre", e.target.value)}
                      placeholder="119.90"
                      className="w-full py-2.5 px-3 border border-boza-black bg-boza-cream text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-boza-taupe mb-1.5">Stock</label>
                    <input
                      type="number"
                      value={variant.quantite}
                      onChange={(e) => updateVariant(index, "quantite", e.target.value)}
                      placeholder="24"
                      className="w-full py-2.5 px-3 border border-boza-black bg-boza-cream text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-boza-taupe mb-1.5">Image de la variante</label>
                  {variant.imagePreview ? (
                    <div className="relative w-24 aspect-[3/4] border border-boza-cream-alt overflow-hidden">
                      <img src={variant.imagePreview} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => updateVariant(index, "imagePreview", "")}
                        className="absolute top-1 right-1 w-5 h-5 bg-boza-black text-boza-cream flex items-center justify-center text-[10px]"
                      >
                        <i className="fas fa-times"></i>
                      </button>
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
            ))}

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
          {saving ? "Enregistrement..." : "Enregistrer le produit"}
        </button>
      </div>
    </form>
  );
}