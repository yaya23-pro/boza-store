// components/User/Dashboard/RecentOrders.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

interface RecentOrder {
  id: string;
  numero_facture: string | null;
  date_commande: string;
  montant_total: number;
  statut: string;
  itemsCount: number;
}

const statusLabels: Record<string, string> = {
  en_attente: "En attente",
  en_traitement: "En traitement",
  expediee: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
};

export default function RecentOrders({ clientId }: { clientId: string }) {
  const supabase = createClient();
  const [orders, setOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const { data: commandes } = await supabase
        .from("commandes")
        .select("id, numero_facture, date_commande, montant_total, statut")
        .eq("client_id", clientId)
        .order("date_commande", { ascending: false })
        .limit(3);

      if (!commandes) return;

      const withCounts = await Promise.all(
        commandes.map(async (c) => {
          const { data: lignes } = await supabase
            .from("lignes_commande")
            .select("quantite")
            .eq("commande_id", c.id);

          const itemsCount = (lignes ?? []).reduce((sum, l) => sum + l.quantite, 0);

          return { ...c, itemsCount };
        })
      );

      setOrders(withCounts);
    }

    loadOrders();
  }, [clientId, supabase]);

  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-lg font-black">Commandes récentes</h2>
        <a href="/user/commandes" className="text-[13px] text-boza-brown font-semibold no-underline hover:underline">
          Voir tout
        </a>
      </div>

      {orders.map((order) => (
        <div key={order.id} className="flex items-center gap-4 py-3.5 border-b border-boza-cream-alt last:border-b-0">
          <div className="flex-1">
            <div className="text-sm font-semibold text-boza-black">
              {order.numero_facture ?? order.id.slice(0, 8)}
            </div>
            <div className="text-xs text-boza-taupe mt-0.5">
              {new Date(order.date_commande).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · {order.montant_total.toFixed(2)} €
            </div>
          </div>
          <span
            className={`text-[11px] font-bold uppercase tracking-wide py-1.5 px-3 ${
              order.statut === "expediee" ? "bg-boza-brown text-boza-cream" : "bg-boza-cream-alt text-boza-black"
            }`}
          >
            {statusLabels[order.statut] ?? order.statut}
          </span>
          <div className="text-sm font-semibold text-boza-black whitespace-nowrap">{order.itemsCount} article(s)</div>
        </div>
      ))}
    </div>
  );
}