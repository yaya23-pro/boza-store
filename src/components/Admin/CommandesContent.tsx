"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import OrdersToolbar from "@/components/Admin/Commandes/OrdersToolbar";
import OrdersStatusTabs from "@/components/Admin/Commandes/OrdersStatusTabs";
import OrdersTable from "@/components/Admin/Commandes/OrdersTable";
import { getOrdersList, OrderListItem } from "@/lib/commandes";

export default function CommandesContent() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("toutes");

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
      setOrders(await getOrdersList());
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase]);

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  const counts: Record<string, number> = { toutes: orders.length };
  orders.forEach((o) => {
    counts[o.statut] = (counts[o.statut] ?? 0) + 1;
  });

  const filtered = orders
    .filter((o) => activeStatus === "toutes" || o.statut === activeStatus)
    .filter((o) => {
      const q = search.toLowerCase();
      return !q || o.numero.toLowerCase().includes(q) || o.clientNom.toLowerCase().includes(q);
    });

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <AdminSidebar activeSection="commandes" adminName={adminName} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5">Commandes</h1>
          <p className="text-boza-taupe text-sm">{orders.length} commande{orders.length > 1 ? "s" : ""} au total</p>
        </div>

        <OrdersToolbar search={search} onSearchChange={setSearch} />
        <OrdersStatusTabs active={activeStatus} onChange={setActiveStatus} counts={counts} />
        <OrdersTable orders={filtered} />
      </main>
    </div>
  );
}