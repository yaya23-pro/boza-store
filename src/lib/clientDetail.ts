import { createClient } from "@/lib/supabase";

export type ClientAddress = {
  id: string;
  rue: string;
  ville: string;
  codePostal: string | null;
  pays: string;
  type: string;
  label: string;
};

export type ClientOrder = {
  id: string;
  numeroFacture: string | null;
  dateCommande: string;
  statut: string;
  montantTotal: number;
};

export type ClientDetail = {
  id: string;
  nom: string;
  initial: string;
  email: string;
  telephone: string | null;
  newsletter: boolean;
  dateInscription: string;
  addresses: ClientAddress[];
  orders: ClientOrder[];
  stats: {
    ordersCount: number;
    totalSpent: number;
    averageBasket: number;
  };
};

const addressTypeLabels: Record<string, string> = {
  livraison: "Adresse de livraison",
  facturation: "Adresse de facturation",
};

function addressLabel(type: string) {
  return addressTypeLabels[type] ?? "Adresse";
}

export const orderStatusLabels: Record<string, string> = {
  en_attente: "En attente",
  en_livraison: "En livraison",
  expedie: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export const orderStatusBadgeClass: Record<string, string> = {
  en_attente: "border border-boza-taupe text-boza-taupe bg-transparent",
  en_livraison: "bg-boza-brown text-boza-cream",
  expedie: "bg-boza-brown text-boza-cream",
  livree: "bg-boza-cream-alt text-boza-black",
  annulee: "border border-boza-taupe text-boza-taupe bg-transparent",
};

export async function getClientDetail(clientId: string): Promise<ClientDetail | null> {
  const supabase = createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .select(`
      id,
      nom_prenom,
      email,
      telephone,
      newsletter,
      date_inscription,
      adresses ( id, rue, ville, code_postal, pays, type ),
      commandes ( id, numero_facture, date_commande, statut, montant_total )
    `)
    .eq("id", clientId)
    .single();

  if (error || !client) {
    console.error("Erreur chargement détail client :", error);
    return null;
  }

  const addressesRaw = (client.adresses as {
    id: string;
    rue: string;
    ville: string;
    code_postal: string | null;
    pays: string;
    type: string;
  }[]) ?? [];

  const ordersRaw = (client.commandes as {
    id: string;
    numero_facture: string | null;
    date_commande: string;
    statut: string;
    montant_total: number;
  }[]) ?? [];

  const addresses: ClientAddress[] = addressesRaw.map((a) => ({
    id: a.id,
    rue: a.rue,
    ville: a.ville,
    codePostal: a.code_postal,
    pays: a.pays,
    type: a.type,
    label: addressLabel(a.type),
  }));

  const orders: ClientOrder[] = ordersRaw
    .map((c) => ({
      id: c.id,
      numeroFacture: c.numero_facture,
      dateCommande: c.date_commande,
      statut: c.statut,
      montantTotal: Number(c.montant_total),
    }))
    .sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime());

  const ordersCount = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.montantTotal, 0);
  const averageBasket = ordersCount > 0 ? totalSpent / ordersCount : 0;

  const nom = client.nom_prenom ?? "—";

  return {
    id: client.id,
    nom,
    initial: nom.charAt(0).toUpperCase(),
    email: client.email ?? "—",
    telephone: client.telephone,
    newsletter: client.newsletter ?? false,
    dateInscription: client.date_inscription,
    addresses,
    orders,
    stats: { ordersCount, totalSpent, averageBasket },
  };
}