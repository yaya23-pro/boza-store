"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import {
  getClientDetail,
  ClientDetail,
  orderStatusLabels,
  orderStatusBadgeClass,
} from "@/lib/clientDetail";

export default function ClientDetailContent({ clientId }: { clientId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

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

      const detail = await getClientDetail(clientId);

      if (!detail) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setClient(detail);
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase, clientId]);

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  if (notFound || !client) {
    return (
      <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
        <AdminSidebar activeSection="clients" adminName={adminName} />
        <main className="flex-1 p-10 max-[640px]:p-6">
          <p className="text-boza-taupe">Ce client est introuvable.</p>
          <Link href="/admin/clients" className="text-boza-brown font-semibold text-sm mt-4 inline-block">
            Retour aux clients
          </Link>
        </main>
      </div>
    );
  }

  const dateInscriptionFormatted = new Date(client.dateInscription).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <AdminSidebar activeSection="clients" adminName={adminName} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 text-[13px] text-boza-taupe no-underline mb-3 hover:text-boza-black"
        >
          <i className="fas fa-arrow-left"></i> Retour aux clients
        </Link>

        <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-boza-black text-boza-cream rounded-full flex items-center justify-center font-display text-2xl font-black shrink-0">
              {client.initial}
            </div>
            <div>
              <div className="font-display text-[22px] font-black">{client.nom}</div>
              <div className="text-[13px] text-boza-taupe mt-1">
                Client depuis le {dateInscriptionFormatted}
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <a
              href={`mailto:${client.email}`}
              className="py-[11px] px-5 border border-boza-black bg-boza-cream text-boza-black text-[13px] font-semibold cursor-pointer transition-all duration-300 hover:bg-boza-black hover:text-boza-cream inline-flex items-center gap-2 no-underline"
            >
              <i className="fas fa-envelope"></i> Envoyer un e-mail
            </a>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-4 mb-7 max-[640px]:grid-cols-1">
          <div className="bg-boza-cream-alt p-[18px] text-center">
            <div className="font-display text-xl font-black mb-1">{client.stats.ordersCount}</div>
            <div className="text-[11px] text-boza-taupe uppercase tracking-wide">Commandes</div>
          </div>
          <div className="bg-boza-cream-alt p-[18px] text-center">
            <div className="font-display text-xl font-black mb-1">
              {client.stats.totalSpent.toFixed(2).replace(".", ",")} €
            </div>
            <div className="text-[11px] text-boza-taupe uppercase tracking-wide">Total dépensé</div>
          </div>
          <div className="bg-boza-cream-alt p-[18px] text-center">
            <div className="font-display text-xl font-black mb-1">
              {client.stats.averageBasket.toFixed(2).replace(".", ",")} €
            </div>
            <div className="text-[11px] text-boza-taupe uppercase tracking-wide">Panier moyen</div>
          </div>
        </div>

        <div className="grid grid-cols-[1.6fr_1fr] gap-6 max-[968px]:grid-cols-1">
          {/* Historique des commandes */}
          <div className="bg-boza-cream border border-boza-cream-alt p-7">
            <h2 className="font-display text-lg font-black mb-5">Historique des commandes</h2>

            {client.orders.length === 0 ? (
              <p className="text-boza-taupe text-sm">Aucune commande pour ce client.</p>
            ) : (
              client.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center py-3.5 border-b border-boza-cream-alt last:border-b-0 gap-2.5 flex-wrap"
                >
                  <div>
                    <div className="text-[13px] font-bold">
                      {order.numeroFacture ?? `#${order.id.slice(0, 8).toUpperCase()}`}
                    </div>
                    <div className="text-xs text-boza-taupe mt-0.5">
                      {new Date(order.dateCommande).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold py-1 px-2.5 inline-block ${
                      orderStatusBadgeClass[order.statut] ??
                      "border border-boza-taupe text-boza-taupe bg-transparent"
                    }`}
                  >
                    {orderStatusLabels[order.statut] ?? order.statut}
                  </span>
                  <div className="text-[13px] font-semibold">
                    {order.montantTotal.toFixed(2).replace(".", ",")} €
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Contact, adresses, préférences */}
          <div>
            <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
              <h2 className="font-display text-lg font-black mb-5">Contact</h2>

              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-boza-cream-alt flex items-center justify-center text-boza-black text-[13px] shrink-0">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-0.5">E-mail</div>
                  <div className="text-[13px] font-medium">{client.email}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-boza-cream-alt flex items-center justify-center text-boza-black text-[13px] shrink-0">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-0.5">Téléphone</div>
                  <div className="text-[13px] font-medium">{client.telephone ?? "Non renseigné"}</div>
                </div>
              </div>
            </div>

            <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
              <h2 className="font-display text-lg font-black mb-5">Adresses enregistrées</h2>

              {client.addresses.length === 0 ? (
                <p className="text-boza-taupe text-sm">Aucune adresse enregistrée.</p>
              ) : (
                client.addresses.map((address, i) => (
                  <div className={`flex gap-3 ${i < client.addresses.length - 1 ? "mb-4" : ""}`} key={address.id}>
                    <div className="w-8 h-8 bg-boza-cream-alt flex items-center justify-center text-boza-black text-[13px] shrink-0">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-0.5">
                        {address.label}
                      </div>
                      <div className="text-[13px] font-medium leading-relaxed">
                        {address.rue}
                        <br />
                        {address.ville}
                        {address.codePostal ? `, ${address.codePostal}` : ""}, {address.pays}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-boza-cream border border-boza-cream-alt p-7">
              <h2 className="font-display text-lg font-black mb-5">Préférences</h2>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-boza-cream-alt flex items-center justify-center text-boza-black text-[13px] shrink-0">
                  <i className="fas fa-envelope-open-text"></i>
                </div>
                <div>
                  <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-0.5">Newsletter</div>
                  <div className="text-[13px] font-medium">
                    {client.newsletter ? "Abonné" : "Non abonné"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}