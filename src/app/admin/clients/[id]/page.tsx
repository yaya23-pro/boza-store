"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminHeader from "@/components/Admin/AdminHeader";
import Footer from "@/components/Footer";
import ClientDetailContent from "@/components/Admin/Clients/ClientDetailContent";

function ClientDetailInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <div className="container mx-auto px-6 py-20 text-center">Client introuvable.</div>;
  }

  return <ClientDetailContent clientId={id} />;
}

export default function ClientDetailPage() {
  return (
    <>
      <AdminHeader />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <ClientDetailInner />
      </Suspense>
      <Footer />
    </>
  );
}