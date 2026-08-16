"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import AjouterCategorieForm from "@/components/Admin/Produits/AjouterCategorieForm";

export default function AjouterCategorieContent() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    async function checkAdmin() {
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
      setLoading(false);
    }

    checkAdmin();
  }, [router, supabase]);

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <AdminSidebar activeSection="produits" adminName={adminName} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <a href="/admin/produits" className="inline-flex items-center gap-2 text-[13px] text-boza-taupe no-underline mb-3 hover:text-boza-black">
          <i className="fas fa-arrow-left"></i> Retour aux produits
        </a>

        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5">Ajouter une catégorie</h1>
          <p className="text-boza-taupe text-sm">Renseigne les informations de la nouvelle catégorie BOZA</p>
        </div>

        <AjouterCategorieForm />
      </main>
    </div>
  );
}