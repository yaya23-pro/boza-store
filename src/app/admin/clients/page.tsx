"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminHeader from "@/components/Admin/AdminHeader";
import Footer from "@/components/Footer";
import ClientsContent from "@/components/Admin/Clients/ClientsContent";
import ClientDetailContent from "@/components/Admin/Clients/ClientDetailContent";

function ClientsPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (id) {
    return <ClientDetailContent clientId={id} />;
  }

  return <ClientsContent />;
}

export default function ClientsPage() {
  return (
    <>
      <AdminHeader />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <ClientsPageInner />
      </Suspense>
      <Footer />
    </>
  );
}