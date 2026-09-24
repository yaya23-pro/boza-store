"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { ReturnRequest, StatutRetour, getReturnRequests, updateReturnRequestStatus } from "@/lib/retours";

const STATUT_LABELS: Record<StatutRetour, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  traite: "Traité",
};

const STATUT_BADGE_CLASSES: Record<StatutRetour, string> = {
  nouveau: "border border-boza-taupe text-boza-taupe bg-transparent",
  en_cours: "bg-boza-brown text-boza-cream",
  traite: "bg-boza-cream-alt text-boza-black",
};

export default function RetoursContent() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [demandes, setDemandes] = useState<ReturnRequest[]>([]);
  const [search, setSearch] = useState("");
  const [activeStatut, setActiveStatut] = useState<StatutRetour | "toutes">("toutes");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      setDemandes(await getReturnRequests());
      setLoading(false);
    }

    load();
  }, [router, supabase]);

  async function handleStatutChange(id: string, statut: StatutRetour) {
    setDemandes((prev) => prev.map((d) => (d.id === id ? { ...d, statut } : d)));
    const response = await updateReturnRequestStatus(id, statut);
    if (!response.success) {
      // En cas d'échec, on recharge la vraie liste plutôt que de garder un état incohérent.
      setDemandes(await getReturnRequests());
    }
  }

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  const counts = {
    toutes: demandes.length,
    nouveau: demandes.filter((d) => d.statut === "nouveau").length,
    en_cours: demandes.filter((d) => d.statut === "en_cours").length,
    traite: demandes.filter((d) => d.statut === "traite").length,
  };

  const filteredDemandes = demandes.filter((d) => {
    const matchStatut = activeStatut === "toutes" || d.statut === activeStatut;
    const q = search.trim().toLowerCase();
    const matchSearch =
      q === "" || d.numeroCommande.toLowerCase().includes(q) || d.email.toLowerCase().includes(q);
    return matchStatut && matchSearch;
  });

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <AdminSidebar activeSection="retours" adminName={adminName} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5">Retours</h1>
          <p className="text-boza-taupe text-sm">
            {demandes.length} demande{demandes.length > 1 ? "s" : ""} au total
          </p>
        </div>

        <div className="flex justify-between items-center mb-6 flex-wrap gap-3.5">
          <div className="flex items-center border border-boza-black px-3.5 max-w-[320px] flex-1">
            <i className="fas fa-search text-boza-taupe text-[13px]"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un n° de commande, un email..."
              className="flex-1 border-0 bg-transparent p-2.5 text-[13px] text-boza-black outline-none placeholder:text-boza-taupe"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {(
            [
              ["toutes", `Toutes (${counts.toutes})`],
              ["nouveau", `Nouveau (${counts.nouveau})`],
              ["en_cours", `En cours (${counts.en_cours})`],
              ["traite", `Traité (${counts.traite})`],
            ] as [StatutRetour | "toutes", string][]
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

        {filteredDemandes.length === 0 ? (
          <div className="bg-boza-cream border border-dashed border-boza-taupe p-10 text-center">
            <p className="text-boza-taupe">Aucune demande de retour ne correspond.</p>
          </div>
        ) : (
          <div className="bg-boza-cream border border-boza-cream-alt overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Commande</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Email</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Motif</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Reçu le</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Statut</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Détail</th>
                </tr>
              </thead>
              <tbody>
                {filteredDemandes.map((d) => (
                  <Fragment key={d.id}>
                    <tr>
                      <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black font-bold">
                        {d.numeroCommande}
                      </td>
                      <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">
                        {d.email}
                      </td>
                      <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">
                        {d.motif}
                      </td>
                      <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">
                        {new Date(d.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px]">
                        <select
                          value={d.statut}
                          onChange={(e) => handleStatutChange(d.id, e.target.value as StatutRetour)}
                          className={`text-xs font-semibold py-1 px-2.5 border-0 outline-none cursor-pointer ${STATUT_BADGE_CLASSES[d.statut]}`}
                        >
                          {(Object.keys(STATUT_LABELS) as StatutRetour[]).map((s) => (
                            <option key={s} value={s}>
                              {STATUT_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px]">
                        <button
                          onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                          className="text-boza-brown font-semibold cursor-pointer bg-transparent border-0 text-[13px]"
                        >
                          {expandedId === d.id ? "Masquer" : "Voir"}
                        </button>
                      </td>
                    </tr>
                    {expandedId === d.id && (
                      <tr>
                        <td colSpan={6} className="py-4 px-5 border-b border-boza-cream-alt bg-boza-cream-alt text-[13px] text-boza-black">
                          {d.description}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
