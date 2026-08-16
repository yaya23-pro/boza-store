"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import OrderStatusTimeline from "@/components/Admin/Commandes/OrderStatusTimeline";
import OrderItemsList from "@/components/Admin/Commandes/OrderItemsList";
import OrderCustomerCard from "@/components/Admin/Commandes/OrderCustomerCard";
import OrderShippingCard from "@/components/Admin/Commandes/OrderShippingCard";
import OrderPaymentCard from "@/components/Admin/Commandes/OrderPaymentCard";
import { getOrderDetail, updateOrderStatus, updatePaymentStatus, OrderDetail } from "@/lib/commandes";

export default function CommandeDetailContent({ commandeId }: { commandeId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

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
      setOrder(await getOrderDetail(commandeId));
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandeId, router, supabase]);

  const handleUpdateStatus = async (newStatut: string) => {
    setUpdating(true);
    const { error } = await updateOrderStatus(commandeId, newStatut);
    if (!error) {
      setOrder((prev) => (prev ? { ...prev, statut: newStatut } : prev));
    } else {
      console.error("Erreur mise à jour statut :", error);
    }
    setUpdating(false);
  };

  const handleUpdatePaymentStatus = async (newStatut: string) => {
    if (!order) return;
    setUpdatingPayment(true);
    const { error } = await updatePaymentStatus(order.paiement.id, newStatut);
    if (!error) {
      setOrder((prev) => (prev ? { ...prev, paiement: { ...prev.paiement, statut: newStatut } } : prev));
    } else {
      console.error("Erreur mise à jour paiement :", error);
    }
    setUpdatingPayment(false);
  };

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  if (!order) {
    return <div className="container mx-auto py-20 text-center">Commande introuvable.</div>;
  }

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <AdminSidebar activeSection="commandes" adminName={adminName} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <a href="/admin/commandes" className="inline-flex items-center gap-2 text-[13px] text-boza-taupe no-underline mb-3 hover:text-boza-black">
          <i className="fas fa-arrow-left"></i> Retour aux commandes
        </a>

        <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display text-[28px] font-black mb-1.5">Commande {order.numero}</h1>
            <p className="text-boza-taupe text-sm">Passée le {order.dateCommande}</p>
          </div>
        </div>

        <OrderStatusTimeline statut={order.statut} onUpdate={handleUpdateStatus} updating={updating} />

        <div className="grid grid-cols-[1.6fr_1fr] gap-6 max-[968px]:grid-cols-1">
          <OrderItemsList items={order.items} subtotal={order.subtotal} total={order.total} />

          <div>
            <OrderCustomerCard nom={order.client.nom} email={order.client.email} telephone={order.client.telephone} />
            <OrderShippingCard ligne1={order.adresse.ligne1} ligne2={order.adresse.ligne2} />
            <OrderPaymentCard
              mode={order.paiement.mode}
              statut={order.paiement.statut}
              onUpdate={handleUpdatePaymentStatus}
              updating={updatingPayment}
            />
          </div>
        </div>
      </main>
    </div>
  );
}