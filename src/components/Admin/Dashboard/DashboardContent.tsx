"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import StatsGrid from "@/components/Admin/Dashboard/StatsGrid";
import RecentOrdersTable from "@/components/Admin/Dashboard/RecentOrdersTable";
import LowStockList from "@/components/Admin/Dashboard/LowStockList";
import { getDashboardData, DashboardStats, RecentOrder, LowStockItem } from "@/lib/dashboard";

const todayLabel = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function DashboardContent() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);

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

      const { stats, recentOrders, lowStock } = await getDashboardData();
      setStats(stats);
      setRecentOrders(recentOrders);
      setLowStock(lowStock);

      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase]);

  if (loading || !stats) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <AdminSidebar activeSection="dashboard" adminName={adminName} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5">Vue d&apos;ensemble</h1>
          <p className="text-boza-taupe text-sm">Aperçu de l&apos;activité BOZA · {todayLabel}</p>
        </div>

        <StatsGrid stats={stats} />

        <div className="grid grid-cols-[1.6fr_1fr] gap-6 max-[968px]:grid-cols-1">
          <RecentOrdersTable orders={recentOrders} />
          <LowStockList items={lowStock} />
        </div>
      </main>
    </div>
  );
}