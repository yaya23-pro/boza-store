import { createClient } from "@/lib/supabase";

export type OrderListItem = {
  id: string;
  numero: string;
  clientNom: string;
  clientInitial: string;
  date: string;
  articlesCount: number;
  total: number;
  statut: string;
};

export async function getOrdersList(): Promise<OrderListItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("commandes")
    .select(`
      id,
      numero_facture,
      montant_total,
      statut,
      date_commande,
      clients ( nom_prenom ),
      lignes_commande ( quantite )
    `)
    .order("date_commande", { ascending: false });

  if (error || !data) {
    console.error("Erreur chargement commandes :", error);
    return [];
  }

  return data.map((c) => {
    const client = c.clients as unknown as { nom_prenom: string } | null;
    const lignes = (c.lignes_commande as { quantite: number }[]) ?? [];
    const articlesCount = lignes.reduce((sum, l) => sum + l.quantite, 0);
    const nom = client?.nom_prenom ?? "—";

    return {
      id: c.id,
      numero: c.numero_facture ?? `#${c.id.slice(0, 8).toUpperCase()}`,
      clientNom: nom,
      clientInitial: nom.charAt(0).toUpperCase(),
      date: new Date(c.date_commande).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
      articlesCount,
      total: Number(c.montant_total),
      statut: c.statut ?? "en_attente",
    };
  });
}

export type OrderDetailItem = {
  image: string;
  name: string;
  variant: string;
  price: number;
};

export type OrderDetail = {
  id: string;
  numero: string;
  statut: string;
  dateCommande: string;
  items: OrderDetailItem[];
  subtotal: number;
  total: number;
  client: { nom: string; email: string; telephone: string };
  adresse: { ligne1: string; ligne2: string };
  paiement: { id: string; mode: string; statut: string };
};

export async function getOrderDetail(commandeId: string): Promise<OrderDetail | null> {
  const supabase = createClient();

  const { data: commande, error } = await supabase
    .from("commandes")
    .select(`
      id,
      numero_facture,
      montant_total,
      statut,
      date_commande,
      clients ( nom_prenom, email, telephone ),
      adresses ( rue, ville, code_postal, pays ),
      paiements ( id, mode, statut ),
      lignes_commande (
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
    .eq("id", commandeId)
    .single();

  if (error || !commande) {
    console.error("Erreur chargement commande :", error);
    return null;
  }

  const client = commande.clients as unknown as { nom_prenom: string; email: string; telephone: string | null } | null;
  const adresse = commande.adresses as unknown as { rue: string; ville: string; code_postal: string | null; pays: string } | null;
  const paiement = commande.paiements as unknown as { id: string; mode: string; statut: string } | null;

  const items: OrderDetailItem[] = ((commande.lignes_commande as any[]) ?? []).map((ligne) => {
    const v = ligne.variantes;
    const images = (v?.images ?? []).sort((a: any, b: any) => a.ordre - b.ordre);
    return {
      image: images[0]?.url_image ?? "/image/placeholder.png",
      name: v?.produits?.nom_produit ?? "",
      variant: `${v?.couleur ?? ""} · Taille ${v?.taille ?? ""} · Qté ${ligne.quantite}`,
      price: Number(ligne.prix_unitaire) * ligne.quantite,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);

  const paymentLabels: Record<string, string> = {
    a_la_livraison: "Paiement à la livraison",
  };

  return {
    id: commande.id,
    numero: commande.numero_facture ?? `#${commande.id.slice(0, 8).toUpperCase()}`,
    statut: commande.statut ?? "en_attente",
    dateCommande: new Date(commande.date_commande).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    items,
    subtotal,
    total: Number(commande.montant_total),
    client: {
      nom: client?.nom_prenom ?? "—",
      email: client?.email ?? "—",
      telephone: client?.telephone ?? "—",
    },
    adresse: {
      ligne1: adresse?.rue ?? "",
      ligne2: `${adresse?.ville ?? ""}${adresse?.code_postal ? ", " + adresse.code_postal : ""}, ${adresse?.pays ?? ""}`,
    },
    paiement: {
      id: paiement?.id ?? "",
      mode: paymentLabels[paiement?.mode ?? ""] ?? paiement?.mode ?? "—",
      statut: paiement?.statut ?? "—",
    },
  };
}

export async function updateOrderStatus(commandeId: string, statut: string) {
  const supabase = createClient();
  return supabase.from("commandes").update({ statut }).eq("id", commandeId);
}

export async function updatePaymentStatus(paiementId: string, statut: string) {
  const supabase = createClient();
  return supabase
    .from("paiements")
    .update({ statut, date_paiement: statut === "paye" ? new Date().toISOString() : null })
    .eq("id", paiementId);
}