import { createAdminClient } from "@/lib/supabase-admin";
import { getDeviseForPays, type Devise } from "@/lib/devise";

export type PanierItem = { varianteId: string; quantite: number };

export async function calculerTotalPanier(items: PanierItem[], pays: string) {
  if (!items?.length) throw new Error("Panier vide.");

  const devise: Devise = getDeviseForPays(pays);

  const supabase = createAdminClient();
  const varianteIds = items.map((i) => i.varianteId);

  const { data: variantes, error } = await supabase
    .from("variantes")
    .select("id, prix, prix_mad")
    .in("id", varianteIds);

  if (error || !variantes) {
    throw new Error("Impossible de vérifier les prix.");
  }

  const variantesTypees = variantes as { id: string; prix: number; prix_mad: number | null }[];

  // Le prix de référence est toujours calculé côté serveur, jamais transmis par le
  // navigateur. On choisit la colonne (prix ou prix_mad) selon le pays de livraison ;
  // si un produit n'a pas de prix MAD renseigné, on retombe sur son prix en euros
  // plutôt que de casser la commande.
  const prixParVariante = new Map<string, number>(
    variantesTypees.map((v) => [v.id, devise === "MAD" ? v.prix_mad ?? v.prix : v.prix])
  );

  let total = 0;
  const lignes = items.map((item) => {
    const prix = prixParVariante.get(item.varianteId);
    if (prix === undefined) throw new Error(`Produit introuvable (variante ${item.varianteId}).`);
    if (!item.quantite || item.quantite <= 0) throw new Error("Quantité invalide.");
    total += prix * item.quantite;
    return { varianteId: item.varianteId, quantite: item.quantite, prixUnitaire: prix };
  });

  return { total: Math.round(total * 100) / 100, lignes, devise };
}
