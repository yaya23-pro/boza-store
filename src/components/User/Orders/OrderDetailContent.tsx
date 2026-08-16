// components/User/Orders/OrderDetailContent.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import UserSidebar from "@/components/User/UserSidebar";
import { getOrderDetail, OrderDetail, orderStatusLabels, orderStatusClasses } from "@/lib/orders";

export default function OrderDetailContent({ orderId }: { orderId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/connexion");
        return;
      }

      setUserEmail(authData.user.email ?? "");

      const { data: clientData } = await supabase
        .from("clients")
        .select("nom_prenom")
        .eq("id", authData.user.id)
        .single();

      setUserName(clientData?.nom_prenom ?? authData.user.email ?? "Client BOZA");

      const detail = await getOrderDetail(orderId, authData.user.id);

      if (!detail) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setOrder(detail);
      setLoading(false);
    }

    load();
  }, [router, supabase, orderId]);

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  if (notFound || !order) {
    return (
      <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
        <UserSidebar activeSection="commandes" userName={userName} userEmail={userEmail} />
        <main className="flex-1 p-10 max-[640px]:p-6">
          <p className="text-boza-taupe">Cette commande est introuvable.</p>
          <Link href="/user/commandes" className="text-boza-brown font-semibold text-sm mt-4 inline-block">
            Retour à mes commandes
          </Link>
        </main>
      </div>
    );
  }

  const dateFormatted = new Date(order.dateCommande).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <UserSidebar activeSection="commandes" userName={userName} userEmail={userEmail} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <Link
          href="/user/commandes"
          className="inline-flex items-center gap-2 text-[13px] text-boza-taupe no-underline mb-5 hover:text-boza-black"
        >
          <i className="fas fa-arrow-left"></i> Retour à mes commandes
        </Link>

        <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
          <div>
            <div className="font-display text-[22px] font-black">
              {order.numeroFacture ?? `#${order.id.slice(0, 8).toUpperCase()}`}
            </div>
            <div className="text-[13px] text-boza-taupe mt-1">Commandée le {dateFormatted}</div>
            {order.numeroSuivi && (
              <div className="text-[13px] text-boza-taupe mt-1">
                Numéro de suivi : <span className="font-semibold text-boza-black">{order.numeroSuivi}</span>
              </div>
            )}
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wide py-1.5 px-3 ${orderStatusClasses[order.statut]}`}>
            {orderStatusLabels[order.statut]}
          </span>
        </div>

        <div className="grid grid-cols-[1.6fr_1fr] gap-6 max-[968px]:grid-cols-1">
          {/* Articles */}
          <div className="bg-boza-cream border border-boza-cream-alt p-7">
            <h2 className="font-display text-lg font-black mb-5">Articles</h2>

            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b border-boza-cream-alt last:border-b-0">
                <img src={item.image} alt={item.nomProduit} className="w-14 h-16 object-cover bg-boza-cream-alt shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-boza-black">{item.nomProduit}</div>
                  <div className="text-xs text-boza-taupe mt-1">
                    {item.taille} · {item.couleur} · Qté {item.quantite}
                  </div>
                </div>
                <div className="text-sm font-semibold text-boza-black">
                  {(item.prixUnitaire * item.quantite).toFixed(2).replace(".", ",")} €
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-5 mt-2 border-t border-boza-cream-alt">
              <span className="text-sm font-bold text-boza-black">Total</span>
              <span className="text-base font-bold text-boza-black">
                {order.montantTotal.toFixed(2).replace(".", ",")} €
              </span>
            </div>
          </div>

          {/* Livraison + paiement */}
          <div>
            {order.adresse && (
              <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
                <h2 className="font-display text-lg font-black mb-5">Adresse de livraison</h2>
                <div className="text-[13px] text-boza-black leading-relaxed">
                  {order.adresse.rue}
                  <br />
                  {order.adresse.ville}
                  {order.adresse.codePostal ? `, ${order.adresse.codePostal}` : ""}
                  <br />
                  {order.adresse.pays}
                </div>
              </div>
            )}

            {order.paiement && (
              <div className="bg-boza-cream border border-boza-cream-alt p-7">
                <h2 className="font-display text-lg font-black mb-5">Paiement</h2>
                <div className="text-[13px] text-boza-black">
                  Mode : <span className="font-semibold">{order.paiement.mode}</span>
                </div>
                <div className="text-[13px] text-boza-black mt-2">
                  Statut : <span className="font-semibold">{order.paiement.statut}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}