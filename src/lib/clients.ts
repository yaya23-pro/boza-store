import { createClient } from "@/lib/supabase";

export type ClientStats = {
  totalClients: number;
  newThisMonth: number;
  newTrendPct: number | null;
  recurringPct: number;
  averageBasket: number;
};

export type ClientListItem = {
  id: string;
  nom: string;
  initial: string;
  email: string;
  dateInscription: string;
  ordersCount: number;
  totalSpent: number;
  statut: "nouveau" | "recurrent" | "inactif";
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function getClientsData(): Promise<{ stats: ClientStats; clients: ClientListItem[] }> {
  const supabase = createClient();

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const prevMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const { data: clientsData, error } = await supabase
    .from("clients")
    .select(`
      id,
      nom_prenom,
      email,
      date_inscription,
      commandes ( id, montant_total, date_commande )
    `)
    .order("date_inscription", { ascending: false });

  if (error || !clientsData) {
    console.error("Erreur chargement clients :", error);
    return {
      stats: { totalClients: 0, newThisMonth: 0, newTrendPct: null, recurringPct: 0, averageBasket: 0 },
      clients: [],
    };
  }

  let totalOrdersCount = 0;
  let totalOrdersAmount = 0;

  const clients: ClientListItem[] = clientsData.map((c) => {
    const commandes = (c.commandes as { id: string; montant_total: number; date_commande: string }[]) ?? [];
    const ordersCount = commandes.length;
    const totalSpent = commandes.reduce((sum, cmd) => sum + Number(cmd.montant_total), 0);

    totalOrdersCount += ordersCount;
    totalOrdersAmount += totalSpent;

    const dateInscription = new Date(c.date_inscription);
    const lastOrderDate = commandes.length > 0
      ? new Date(Math.max(...commandes.map((cmd) => new Date(cmd.date_commande).getTime())))
      : null;

    let statut: ClientListItem["statut"];
    if (ordersCount >= 2) {
      statut = "recurrent";
    } else if (ordersCount === 0 && dateInscription < ninetyDaysAgo) {
      statut = "inactif";
    } else if (ordersCount === 1 && lastOrderDate && lastOrderDate < ninetyDaysAgo) {
      statut = "inactif";
    } else {
      statut = "nouveau";
    }

    const nom = c.nom_prenom ?? "—";

    return {
      id: c.id,
      nom,
      initial: nom.charAt(0).toUpperCase(),
      email: c.email ?? "—",
      dateInscription: dateInscription.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
      ordersCount,
      totalSpent,
      statut,
    };
  });

  const totalClients = clients.length;
  const newThisMonth = clients.filter((c) => new Date(c.dateInscription) >= thisMonthStart).length;

  // Nouveaux clients du mois précédent, recalculé depuis les données brutes (dates réelles, pas le format affiché)
  const newPrevMonth = clientsData.filter((c) => {
    const d = new Date(c.date_inscription);
    return d >= prevMonthStart && d < thisMonthStart;
  }).length;

  const newTrendPct = newPrevMonth > 0 ? Math.round(((newThisMonth - newPrevMonth) / newPrevMonth) * 100) : null;

  const recurringCount = clients.filter((c) => c.statut === "recurrent").length;
  const recurringPct = totalClients > 0 ? Math.round((recurringCount / totalClients) * 100) : 0;

  const averageBasket = totalOrdersCount > 0 ? totalOrdersAmount / totalOrdersCount : 0;

  return {
    stats: { totalClients, newThisMonth, newTrendPct, recurringPct, averageBasket },
    clients,
  };
}