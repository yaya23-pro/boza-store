// components/User/Dashboard/DashboardStats.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Stats = {
  ordersCount: number;
  totalSpent: number;
  favoritesCount: number;
};

export default function DashboardStats({ clientId }: { clientId: string }) {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function loadStats() {
      const [ordersResult, favoritesResult] = await Promise.all([
        supabase.from("commandes").select("montant_total").eq("client_id", clientId),
        supabase.from("favoris").select("id", { count: "exact", head: true }).eq("client_id", clientId),
      ]);

      const orders = ordersResult.data ?? [];
      const ordersCount = orders.length;
      const totalSpent = orders.reduce((sum, o) => sum + Number(o.montant_total), 0);
      const favoritesCount = favoritesResult.count ?? 0;

      setStats({ ordersCount, totalSpent, favoritesCount });
    }

    loadStats();
  }, [clientId, supabase]);

  if (!stats) return null;

  const cards = [
    { icon: "fa-box", value: stats.ordersCount.toString(), label: "Commandes" },
    { icon: "fa-coins", value: `${stats.totalSpent.toFixed(2).replace(".", ",")} €`, label: "Total dépensé" },
    { icon: "fa-heart", value: stats.favoritesCount.toString(), label: "Favoris" },
  ];

  return (
    <div className="flex gap-3 mb-8 flex-wrap">
      {cards.map((card) => (
        <div
          key={card.label}
          className="text-[13px] font-semibold px-4 py-2 bg-boza-cream-alt text-boza-black flex items-center gap-2"
        >
          <i className={`fas ${card.icon} text-xs`}></i>
          {card.label} ({card.value})
        </div>
      ))}
    </div>
  );
}