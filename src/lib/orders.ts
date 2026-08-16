import { createClient } from "@/lib/supabase";

export type OrderStatus = "en_attente" | "en_livraison" | "expedie" | "livree" | "annulee";

export const orderStatusLabels: Record<OrderStatus, string> = {
  en_attente: "En attente",
  en_livraison: "En livraison",
  expedie: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export const orderStatusClasses: Record<OrderStatus, string> = {
  en_attente: "bg-transparent border border-boza-taupe text-boza-taupe",
  en_livraison: "bg-boza-brown text-boza-cream",
  expedie: "bg-boza-brown text-boza-cream",
  livree: "bg-boza-cream-alt text-boza-black",
  annulee: "bg-transparent border border-boza-taupe text-boza-taupe",
};

export type OrderListItem = {
  id: string;
  numeroFacture: string | null;
  numeroSuivi: string | null;
  dateCommande: string;
  statut: OrderStatus;
  montantTotal: number;
  images: string[];
  itemsCount: number;
};

export type OrderDetailItem = {
  id: string;
  nomProduit: string;
  taille: string;
  couleur: string;
  quantite: number;
  prixUnitaire: number;
  image: string;
};

export type OrderDetail = {
  id: string;
  numeroFacture: string | null;
  numeroSuivi: string | null;
  dateCommande: string;
  statut: OrderStatus;
  montantTotal: number;
  items: OrderDetailItem[];
  adresse: {
    rue: string;
    ville: string;
    codePostal: string | null;
    pays: string;
  } | null;
  paiement: {
    mode: string;
    statut: string;
  } | null;
};

export async function getClientOrders(clientId: string): Promise<OrderListItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("commandes")
    .select(`
      id,
      numero_facture,
      numero_suivi,
      date_commande,
      statut,
      montant_total,
      lignes_commande (
        quantite,
        variantes ( images ( url_image, ordre ) )
      )
    `)
    .eq("client_id", clientId)
    .order("date_commande", { ascending: false });

  if (error || !data) {
    console.error("Erreur chargement commandes :", error);
    return [];
  }

  return data.map((c: any) => {
    const lignes = c.lignes_commande ?? [];
    const itemsCount = lignes.reduce((sum: number, l: any) => sum + l.quantite, 0);

    const images: string[] = lignes
      .map((l: any) => {
        const imgs = (l.variantes?.images ?? []).sort((a: any, b: any) => a.ordre - b.ordre);
        return imgs[0]?.url_image ?? null;
      })
      .filter((url: string | null): url is string => !!url)
      .slice(0, 4);

    return {
      id: c.id,
      numeroFacture: c.numero_facture,
      numeroSuivi: c.numero_suivi,
      dateCommande: c.date_commande,
      statut: c.statut as OrderStatus,
      montantTotal: Number(c.montant_total),
      images,
      itemsCount,
    };
  });
}

export async function getOrderDetail(orderId: string, clientId: string): Promise<OrderDetail | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("commandes")
    .select(`
      id,
      numero_facture,
      numero_suivi,
      date_commande,
      statut,
      montant_total,
      adresses ( rue, ville, code_postal, pays ),
      paiements ( mode, statut ),
      lignes_commande (
        id,
        quantite,
        prix_unitaire,
        variantes (
          taille,
          couleur,
          produits ( nom_produit ),
          images ( url_image, ordre )
        )
      )
    `)
    .eq("id", orderId)
    .eq("client_id", clientId)
    .single();

  if (error || !data) {
    console.error("Erreur chargement détail commande :", error);
    return null;
  }

  const items: OrderDetailItem[] = (data.lignes_commande ?? []).map((l: any) => {
    const v = l.variantes;
    const imgs = (v?.images ?? []).sort((a: any, b: any) => a.ordre - b.ordre);
    return {
      id: l.id,
      nomProduit: v?.produits?.nom_produit ?? "",
      taille: v?.taille ?? "",
      couleur: v?.couleur ?? "",
      quantite: l.quantite,
      prixUnitaire: Number(l.prix_unitaire),
      image: imgs[0]?.url_image ?? "/image/placeholder.png",
    };
  });

  const adresse = data.adresses
    ? {
        rue: data.adresses.rue,
        ville: data.adresses.ville,
        codePostal: data.adresses.code_postal,
        pays: data.adresses.pays,
      }
    : null;

  const paiement = data.paiements
    ? { mode: data.paiements.mode, statut: data.paiements.statut }
    : null;

  return {
    id: data.id,
    numeroFacture: data.numero_facture,
    numeroSuivi: data.numero_suivi,
    dateCommande: data.date_commande,
    statut: data.statut as OrderStatus,
    montantTotal: Number(data.montant_total),
    items,
    adresse,
    paiement,
  };
}