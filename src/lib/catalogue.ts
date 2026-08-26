import { createClient } from "@/lib/supabase";

export type CatalogueProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
};

export type Category = {
  name: string;
  slug: string;
};

export async function getCatalogueProducts(categorySlug?: string): Promise<CatalogueProduct[]> {
  const supabase = createClient();

  let query = supabase
    .from("produits")
    .select(
      `
      id,
      nom_produit,
      slug,
      categories!inner ( nom_categorie, slug ),
      variantes (
        prix,
        prix_barre,
        quantite,
        images ( url_image, ordre )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Erreur chargement produits :", error);
    return [];
  }

  return data.map((p) => {
    const categorie = p.categories as unknown as { nom_categorie: string; slug: string } | null;
    const variantes =
      (p.variantes as { prix: number; prix_barre: number | null; quantite: number; images: { url_image: string; ordre: number }[] }[]) ?? [];

    const cheapest = variantes.reduce<typeof variantes[number] | null>((min, v) => {
      if (!min || v.prix < min.prix) return v;
      return min;
    }, null);

    const prix = cheapest?.prix ?? 0;
    const prixBarre = cheapest?.prix_barre ?? undefined;

    const allImages = variantes.flatMap((v) => v.images ?? []).sort((a, b) => a.ordre - b.ordre);
    const image = allImages[0]?.url_image ?? "/image/placeholder.png";

    return {
      id: p.id,
      slug: p.slug,
      name: p.nom_produit,
      category: categorie?.nom_categorie ?? "Autre",
      image,
      price: prix,
      oldPrice: prixBarre && prixBarre > prix ? prixBarre : undefined,
    };
  });
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("nom_categorie, slug")
    .order("nom_categorie");

  if (error || !data) return [];

  return data.map((c) => ({ name: c.nom_categorie, slug: c.slug }));
}