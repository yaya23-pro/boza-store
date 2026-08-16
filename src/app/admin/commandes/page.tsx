"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import UserHeader from "@/components/User/UserHeader";
import Footer from "@/components/Footer";
import OrdersOverview from "@/components/User/Orders/OrdersOverview";
import OrderDetailContent from "@/components/User/Orders/OrderDetailContent";

function CommandesPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (id) {
    return <OrderDetailContent orderId={id} />;
  }

  return <OrdersOverview />;
}

export default function UserCommandesPage() {
  return (
    <>
      <UserHeader />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <CommandesPageInner />
      </Suspense>
      <Footer />
    </>
  );
}