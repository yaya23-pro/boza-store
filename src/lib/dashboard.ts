import { createClient } from "@/lib/supabase";

export type DashboardStats = {
  revenueThisMonth: number;
  revenueTrendPct: number | null;
  ordersThisMonth: number;
  ordersTrendPct: number | null;
  totalClients: number;
  newClientsThisMonth: number;
  lowStockCount: number;
};

export type RecentOrder = {
  id: string;
  numero: string;
  clientNom: string;
  statut: string;
  total: number;
};

export type LowStockItem = {
  id: string;
  nom: string;
  taille: string;
  couleur: string;
  quantite: number;
  image: string;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function getDashboardData(): Promise<{
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStock: LowStockItem[];
}> {
  const supabase = createClient();

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const prevMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));

  // Commandes de ce mois et du mois précédent
  const { data: commandesThisMonth } = await supabase
    .from("commandes")
    .select("montant_total")
    .gte("date_commande", thisMonthStart.toISOString());

  const { data: commandesPrevMonth } = await supabase
    .from("commandes")
    .select("montant_total")
    .gte("date_commande", prevMonthStart.toISOString())
    .lt("date_commande", thisMonthStart.toISOString());

  const revenueThisMonth = (commandesThisMonth ?? []).reduce((sum, c) => sum + Number(c.montant_total), 0);
  const revenuePrevMonth = (commandesPrevMonth ?? []).reduce((sum, c) => sum + Number(c.montant_total), 0);
  const ordersThisMonth = commandesThisMonth?.length ?? 0;
  const ordersPrevMonth = commandesPrevMonth?.length ?? 0;

  const revenueTrendPct = revenuePrevMonth > 0 ? Math.round(((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 100) : null;
  const ordersTrendPct = ordersPrevMonth > 0 ? Math.round(((ordersThisMonth - ordersPrevMonth) / ordersPrevMonth) * 100) : null;

  // Clients
  const { count: totalClients } = await supabase.from("clients").select("*", { count: "exact", head: true });
  const { count: newClientsThisMonth } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .gte("date_inscription", thisMonthStart.toISOString());

  // Stock faible (comparaison quantite <= seuil_alerte faite côté client)
  const { data: variantesData } = await supabase
    .from("variantes")
    .select("id, taille, couleur, quantite, seuil_alerte, produits ( nom_produit ), images ( url_image, ordre )");

  const lowStock: LowStockItem[] = (variantesData ?? [])
    .filter((v) => v.quantite <= (v.seuil_alerte ?? 5))
    .map((v) => {
      const produit = v.produits as unknown as { nom_produit: string } | null;
      const images = ((v.images as { url_image: string; ordre: number }[]) ?? []).sort((a, b) => a.ordre - b.ordre);
      return {
        id: v.id,
        nom: produit?.nom_produit ?? "",
        taille: v.taille ?? "",
        couleur: v.couleur ?? "",
        quantite: v.quantite,
        image: images[0]?.url_image ?? "/image/placeholder.png",
      };
    })
    .sort((a, b) => a.quantite - b.quantite)
    .slice(0, 5);

  // Commandes récentes
  const { data: recentData } = await supabase
    .from("commandes")
    .select("id, numero_facture, montant_total, statut, clients ( nom_prenom )")
    .order("date_commande", { ascending: false })
    .limit(5);

  const recentOrders: RecentOrder[] = (recentData ?? []).map((c) => {
    const client = c.clients as unknown as { nom_prenom: string } | null;
    return {
      id: c.id,
      numero: c.numero_facture ?? `#${c.id.slice(0, 8).toUpperCase()}`,
      clientNom: client?.nom_prenom ?? "—",
      statut: c.statut ?? "en_attente",
      total: Number(c.montant_total),
    };
  });

  return {
    stats: {
      revenueThisMonth,
      revenueTrendPct,
      ordersThisMonth,
      ordersTrendPct,
      totalClients: totalClients ?? 0,
      newClientsThisMonth: newClientsThisMonth ?? 0,
      lowStockCount: lowStock.length,
    },
    recentOrders,
    lowStock,
  };
}