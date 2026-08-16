import { createClient } from "@/lib/supabase";

export type WishlistItem = {
  id: string; // id de la ligne favoris (utilisé pour le retrait)
  produitId: string;
  image: string;
  alt: string;
  category: string;
  name: string;
  price: string;
};

export async function getWishlist(clientId: string): Promise<WishlistItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("favoris")
    .select(`
      id,
      produit_id,
      produits (
        nom_produit,
        categories ( nom_categorie ),
        variantes ( prix, images ( url_image, ordre ) )
      )
    `)
    .eq("client_id", clientId)
    .order("date_ajout", { ascending: false });

  if (error || !data) {
    console.error("Erreur chargement favoris :", error);
    return [];
  }

  return data.map((f: any) => {
    const produit = f.produits;
    const variantes = produit?.variantes ?? [];

    // Variante la moins chère pour représenter le produit sur la carte
    const cheapest = variantes.reduce(
      (min: any, v: any) => (min === null || Number(v.prix) < Number(min.prix) ? v : min),
      null
    );

    const images = (cheapest?.images ?? []).sort((a: any, b: any) => a.ordre - b.ordre);

    return {
      id: f.id,
      produitId: f.produit_id,
      image: images[0]?.url_image ?? "/image/placeholder.png",
      alt: produit?.nom_produit ?? "",
      category: produit?.categories?.nom_categorie ?? "",
      name: produit?.nom_produit ?? "",
      price: cheapest ? `${Number(cheapest.prix).toFixed(2).replace(".", ",")} €` : "—",
    };
  });
}

export async function removeFromWishlist(favoriId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("favoris").delete().eq("id", favoriId);

  if (error) {
    console.error("Erreur suppression favori :", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getFavoriteProductIds(clientId: string): Promise<Set<string>> {
  const supabase = createClient();

  const { data, error } = await supabase.from("favoris").select("produit_id").eq("client_id", clientId);

  if (error || !data) {
    console.error("Erreur chargement IDs favoris :", error);
    return new Set();
  }

  return new Set(data.map((f) => f.produit_id));
}

export async function removeFromWishlistByProduct(
  clientId: string,
  produitId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("favoris")
    .delete()
    .eq("client_id", clientId)
    .eq("produit_id", produitId);

  if (error) {
    console.error("Erreur suppression favori :", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function addToWishlist(
  clientId: string,
  produitId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("favoris").insert({ client_id: clientId, produit_id: produitId });

  if (error) {
    console.error("Erreur ajout favori :", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}