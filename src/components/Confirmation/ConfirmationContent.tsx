"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrderConfirmation, OrderConfirmation } from "@/lib/confirmation";
import SuccessBlock from "@/components/Confirmation/SuccessBlock";
import OrderSummaryConfirmed from "@/components/Confirmation/OrderSummaryConfirmed";
import DeliveryInfo from "@/components/Confirmation/DeliveryInfo";
import ConfirmationActions from "@/components/Confirmation/ConfirmationActions";
import CreateAccountPrompt from "@/components/Confirmation/CreateAccountPrompt";

export default function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const commandeId = searchParams.get("commande");

  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const accountPromptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      if (!commandeId) {
        setLoading(false);
        return;
      }
      const data = await getOrderConfirmation(commandeId);
      setOrder(data);
      setLoading(false);
    }
    load();
  }, [commandeId]);

  const handleTrackOrderClick = () => {
    if (!commandeId) return;

    if (order?.isGuest) {
      setShowAccountPrompt(true);
      setTimeout(() => {
        accountPromptRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else {
      router.push(`/user/commandes?id=${commandeId}`);
    }
  };

  if (loading) {
    return <div className="max-w-[700px] mx-auto px-6 pt-[60px] pb-10 text-center text-boza-taupe">Chargement...</div>;
  }

  if (!order) {
    return <div className="max-w-[700px] mx-auto px-6 pt-[60px] pb-10 text-center">Commande introuvable.</div>;
  }

  return (
    <div className="max-w-[700px] mx-auto px-6 pt-[60px] pb-10 text-center">
      <SuccessBlock orderNumber={order.orderNumber} />
      <OrderSummaryConfirmed items={order.items} total={order.total} />
      <DeliveryInfo address={order.address.ligne} paymentMode={order.paymentMode} />
      <ConfirmationActions onTrackOrderClick={handleTrackOrderClick} />
      {order.isGuest && order.guestEmail && showAccountPrompt && commandeId && (
        <div ref={accountPromptRef} className="text-left">
          <CreateAccountPrompt email={order.guestEmail} commandeId={commandeId} />
        </div>
      )}
    </div>
  );
}