"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AdminSidebar from "@/components/Admin/AdminSidebar";

type StatutCommande = "en_attente" | "en_livraison" | "livree" | "annulee";

type OrderRow = {
  id: string;
  numero_facture: string | null;
  client_nom: string;
  date_commande: string;
  nb_articles: number;
  montant_total: number;
  statut: StatutCommande;
};

const STATUT_LABELS: Record<StatutCommande, string> = {
  en_attente: "En attente",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
};

const STATUT_BADGE_CLASSES: Record<StatutCommande, string> = {
  en_attente: "border border-boza-taupe text-boza-taupe bg-transparent",
  en_livraison: "bg-boza-brown text-boza-cream",
  livree: "bg-boza-cream-alt text-boza-black",
  annulee: "bg-boza-brown text-boza-cream",
};

export default function CommandesContent() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [search, setSearch] = useState("");
  const [activeStatut, setActiveStatut] = useState<StatutCommande | "toutes">("toutes");

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/admin/connexion");
        return;
      }

      const { data: adminData } = await supabase
        .from("admins")
        .select("nom_prenom")
        .eq("id", authData.user.id)
        .single();

      if (!adminData) {
        await supabase.auth.signOut();
        router.push("/admin/connexion");
        return;
      }

      setAdminName(adminData.nom_prenom);

      const { data: commandesData } = await supabase
        .from("commandes")
        .select(
          "id, numero_facture, montant_total, statut, date_commande, clients(nom_prenom), lignes_commande(id)"
        )
        .order("date_commande", { ascending: false });

      const formatted: OrderRow[] = (commandesData ?? []).map((c) => {
        const client = c.clients as unknown as { nom_prenom: string } | null;
        const lignes = (c.lignes_commande as { id: string }[]) ?? [];

        return {
          id: c.id,
          numero_facture: c.numero_facture,
          client_nom: client?.nom_prenom ?? "—",
          date_commande: c.date_commande,
          nb_articles: lignes.length,
          montant_total: c.montant_total,
          statut: (c.statut as StatutCommande) ?? "en_attente",
        };
      });

      setOrders(formatted);
      setLoading(false);
    }

    load();
  }, [router, supabase]);

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  const counts = {
    toutes: orders.length,
    en_attente: orders.filter((o) => o.statut === "en_attente").length,
    en_livraison: orders.filter((o) => o.statut === "en_livraison").length,
    livree: orders.filter((o) => o.statut === "livree").length,
    annulee: orders.filter((o) => o.statut === "annulee").length,
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatut = activeStatut === "toutes" || o.statut === activeStatut;
    const q = search.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      o.client_nom.toLowerCase().includes(q) ||
      (o.numero_facture ?? "").toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q);
    return matchStatut && matchSearch;
  });

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <AdminSidebar activeSection="commandes" adminName={adminName} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5">Commandes</h1>
          <p className="text-boza-taupe text-sm">
            {orders.length} commande{orders.length > 1 ? "s" : ""} au total
          </p>
        </div>

        <div className="flex justify-between items-center mb-6 flex-wrap gap-3.5">
          <div className="flex items-center border border-boza-black px-3.5 max-w-[320px] flex-1">
            <i className="fas fa-search text-boza-taupe text-[13px]"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une commande, un client..."
              className="flex-1 border-0 bg-transparent p-2.5 text-[13px] text-boza-black outline-none placeholder:text-boza-taupe"
            />
          </div>
          <button className="py-3 px-6 bg-boza-black text-boza-cream border border-boza-black font-bold text-[13px] uppercase tracking-wide cursor-pointer transition-all duration-300 inline-block hover:bg-boza-brown hover:border-boza-brown">
            <i className="fas fa-file-export"></i> Exporter
          </button>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {(
            [
              ["toutes", `Toutes (${counts.toutes})`],
              ["en_attente", `En attente (${counts.en_attente})`],
              ["en_livraison", `En livraison (${counts.en_livraison})`],
              ["livree", `Livrées (${counts.livree})`],
              ["annulee", `Annulées (${counts.annulee})`],
            ] as [StatutCommande | "toutes", string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveStatut(key)}
              className={`py-1.5 px-4 border border-boza-black font-semibold text-xs cursor-pointer transition-all duration-300 ${
                activeStatut === key
                  ? "bg-boza-black text-boza-cream"
                  : "bg-boza-cream text-boza-black hover:bg-boza-black hover:text-boza-cream"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-boza-cream border border-dashed border-boza-taupe p-10 text-center">
            <p className="text-boza-taupe">Aucune commande ne correspond.</p>
          </div>
        ) : (
          <div className="bg-boza-cream border border-boza-cream-alt overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Commande</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Client</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Date</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Articles</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Total</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Statut</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black font-bold">
                      {o.numero_facture ?? `#${o.id.slice(0, 8)}`}
                    </td>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-boza-black text-boza-cream rounded-full flex items-center justify-center font-display text-xs font-black flex-shrink-0">
                          {o.client_nom.charAt(0).toUpperCase()}
                        </div>
                        {o.client_nom}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">
                      {new Date(o.date_commande).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">{o.nb_articles}</td>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">
                      {o.montant_total.toFixed(2)} €
                    </td>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px]">
                      <span className={`text-[11px] font-bold py-1 px-2.5 inline-block ${STATUT_BADGE_CLASSES[o.statut]}`}>
                        {STATUT_LABELS[o.statut]}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px]">
                      <div className="flex gap-2">
                        <a
                          href={`/admin/commandes/${o.id}`}
                          className="w-[30px] h-[30px] border border-boza-black bg-boza-cream text-boza-black flex items-center justify-center text-xs cursor-pointer transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
                        >
                          <i className="fas fa-eye"></i>
                        </a>
                        <a
                          href={`/admin/commandes/${o.id}?edit=1`}
                          className="w-[30px] h-[30px] border border-boza-black bg-boza-cream text-boza-black flex items-center justify-center text-xs cursor-pointer transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
                        >
                          <i className="fas fa-pen"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}