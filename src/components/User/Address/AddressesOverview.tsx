// components/User/Address/AddressesOverview.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import UserSidebar from "@/components/User/UserSidebar";
import AddressCard, { Address } from "@/components/User/Address/AddressCard";
import AddAddressCard from "@/components/User/Address/AddAddressCard";

export default function AddressesOverview() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/connexion");
        return;
      }

      setUserId(authData.user.id);
      setUserEmail(authData.user.email ?? "");

      const { data: clientData } = await supabase
        .from("clients")
        .select("nom_prenom, telephone")
        .eq("id", authData.user.id)
        .single();

      setUserName(clientData?.nom_prenom ?? authData.user.email ?? "Client BOZA");
      setUserPhone(clientData?.telephone ?? "");

      const { data: addressData } = await supabase
        .from("adresses")
        .select("id, type, rue, ville, code_postal, pays, est_defaut")
        .eq("client_id", authData.user.id)
        .order("est_defaut", { ascending: false });

      setAddresses(
        (addressData ?? []).map((a) => ({
          id: a.id,
          type: a.type,
          street: a.rue,
          city: a.ville,
          postalCode: a.code_postal,
          country: a.pays,
          isDefault: a.est_defaut,
        }))
      );

      setLoading(false);
    }

    loadData();
  }, [router, supabase]);

  async function handleSetDefault(id: string) {
    const { error: clearError } = await supabase
      .from("adresses")
      .update({ est_defaut: false })
      .eq("client_id", userId);

    if (clearError) {
      console.error("Erreur réinitialisation adresse par défaut :", clearError);
      window.alert("Erreur : " + clearError.message);
      return;
    }

    const { error: setError } = await supabase.from("adresses").update({ est_defaut: true }).eq("id", id);

    if (setError) {
      console.error("Erreur définition adresse par défaut :", setError);
      window.alert("Erreur : " + setError.message);
      return;
    }

    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Supprimer cette adresse ?");
    if (!confirmed) return;

    const { error } = await supabase.from("adresses").delete().eq("id", id);

    if (error) {
      console.error("Erreur suppression adresse :", error);
      if (error.code === "23503") {
        window.alert(
          "Cette adresse ne peut pas être supprimée car elle est associée à une ou plusieurs commandes passées."
        );
      } else {
        window.alert("Impossible de supprimer cette adresse : " + error.message);
      }
      return;
    }

    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  function handleAdd() {
    // à brancher sur ton formulaire / modale d'ajout
  }

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <UserSidebar activeSection="adresses" userName={userName} userEmail={userEmail} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5 max-[640px]:text-[22px]">Mes adresses</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="text-boza-taupe text-xs font-semibold tracking-wide bg-transparent cursor-pointer transition-all duration-300 flex items-center gap-2 hover:bg-boza-cream-alt"
            >
              <i className="fas fa-arrow-left text-[10px]"></i>
              Retour
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-boza-taupe text-xs font-semibold tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt"
            >
              Accueil
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5 max-[968px]:grid-cols-1">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              fullName={userName}
              phone={userPhone}
              onSetDefault={handleSetDefault}
              onDelete={handleDelete}
            />
          ))}
          <AddAddressCard onClick={handleAdd} />
        </div>
      </main>
    </div>
  );
}