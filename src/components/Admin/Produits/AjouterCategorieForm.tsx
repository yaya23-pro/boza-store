"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AjouterCategorieForm() {
  const router = useRouter();
  const supabase = createClient();

  const [nomCategorie, setNomCategorie] = useState("");
  const [descCategorie, setDescCategorie] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nomCategorie) {
      setError("Merci de renseigner le nom de la catégorie.");
      return;
    }

    setSaving(true);

    const { error: catError } = await supabase.from("categories").insert({
      nom_categorie: nomCategorie,
      desc_categorie: descCategorie || null,
    });

    if (catError) {
      setSaving(false);
      setError("Erreur lors de la création de la catégorie : " + catError.message);
      return;
    }

    setSaving(false);
    alert("Catégorie ajoutée avec succès !");
    router.push("/admin/produits/nouveauCat");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-boza-cream border border-boza-cream-alt p-7 max-w-xl">
        <h2 className="font-display text-lg font-black mb-5">Informations de la catégorie</h2>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Nom de la catégorie</label>
          <input
            type="text"
            value={nomCategorie}
            onChange={(e) => setNomCategorie(e.target.value)}
            placeholder="Ex: Bonnet"
            className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Description</label>
          <textarea
            value={descCategorie}
            onChange={(e) => setDescCategorie(e.target.value)}
            placeholder="Ex: Bonnets BOZA"
            className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none resize-y min-h-[100px] placeholder:text-boza-taupe focus:border-boza-brown"
          />
        </div>
      </div>

      {error && <p className="text-boza-brown text-sm mt-5">{error}</p>}

      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={() => router.push("/admin/produits/nouveauCat")}
          className="py-3.5 px-7 bg-boza-cream text-boza-black border border-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="py-3.5 px-8 bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer la catégorie"}
        </button>
      </div>
    </form>
  );
}