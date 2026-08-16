import { Suspense } from "react";
import UserHeader from "@/components/User/UserHeader";
import Footer from "@/components/Footer";
import OrderDetailContent from "@/components/User/Orders/OrderDetailContent";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <UserHeader />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <OrderDetailContent orderId={id} />
      </Suspense>
      <Footer />
    </>
  );
}