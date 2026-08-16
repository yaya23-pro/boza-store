"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import ClientsStatsGrid from "@/components/Admin/Clients/ClientsStatsGrid";
import ClientsToolbar from "@/components/Admin/Clients/ClientsToolbar";
import ClientsStatusTabs from "@/components/Admin/Clients/ClientsStatusTabs";
import ClientsTable from "@/components/Admin/Clients/ClientsTable";
import { getClientsData, ClientStats, ClientListItem } from "@/lib/clients";

export default function ClientsContent() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("tous");

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

      const { stats, clients } = await getClientsData();
      setStats(stats);
      setClients(clients);

      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase]);

  if (loading || !stats) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  const counts: Record<string, number> = { tous: clients.length };
  clients.forEach((c) => {
    counts[c.statut] = (counts[c.statut] ?? 0) + 1;
  });

  const filtered = clients
    .filter((c) => activeStatus === "tous" || c.statut === activeStatus)
    .filter((c) => {
      const q = search.toLowerCase();
      return !q || c.nom.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    });

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <AdminSidebar activeSection="clients" adminName={adminName} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5">Clients</h1>
          <p className="text-boza-taupe text-sm">{stats.totalClients} clients inscrits</p>
        </div>

        <ClientsStatsGrid stats={stats} />
        <ClientsToolbar search={search} onSearchChange={setSearch} />
        <ClientsStatusTabs active={activeStatus} onChange={setActiveStatus} counts={counts} />
        <ClientsTable clients={filtered} />
      </main>
    </div>
  );
}