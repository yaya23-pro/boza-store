import { createClient } from "@/lib/supabase";

export type ConfirmedItem = {
  image: string;
  name: string;
  variant: string;
  price: string;
};

export type OrderConfirmation = {
  orderNumber: string;
  items: ConfirmedItem[];
  total: string;
  address: { nomPrenom: string; ligne: string };
  paymentMode: string;
  isGuest: boolean;
  guestEmail: string | null;
};

export async function getOrderConfirmation(commandeId: string): Promise<OrderConfirmation | null> {
  const supabase = createClient();

  const { data: commande, error } = await supabase
    .from("commandes")
    .select(`
      id,
      numero_facture,
      montant_total,
      client_id,
      guest_email,
      adresses ( rue, ville, code_postal, pays ),
      paiements ( mode ),
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

  const items: ConfirmedItem[] = (commande.lignes_commande as any[]).map((ligne) => {
    const v = ligne.variantes;
    const images = (v?.images ?? []).sort((a: any, b: any) => a.ordre - b.ordre);
    return {
      image: images[0]?.url_image ?? "/image/placeholder.png",
      name: v?.produits?.nom_produit ?? "",
      variant: `${v?.couleur ?? ""} · Taille ${v?.taille ?? ""} · Qté ${ligne.quantite}`,
      price: `${(ligne.prix_unitaire * ligne.quantite).toFixed(2).replace(".", ",")} €`,
    };
  });

  const adresse = commande.adresses as any;
  const paiement = commande.paiements as any;

  const paymentLabels: Record<string, string> = {
    a_la_livraison: "Paiement à la livraison",
  };

  return {
    orderNumber: commande.numero_facture ?? `#${commande.id.slice(0, 8).toUpperCase()}`,
    items,
    total: `${commande.montant_total.toFixed(2).replace(".", ",")} €`,
    address: {
      nomPrenom: "",
      ligne: `${adresse?.rue ?? ""}, ${adresse?.ville ?? ""}${adresse?.code_postal ? " " + adresse.code_postal : ""}, ${adresse?.pays ?? ""}`,
    },
    paymentMode: paymentLabels[paiement?.mode] ?? paiement?.mode ?? "",
    isGuest: !commande.client_id,
    guestEmail: commande.guest_email,
  };
}