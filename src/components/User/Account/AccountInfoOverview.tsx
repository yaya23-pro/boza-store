// components/User/Account/AccountInfoOverview.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import UserSidebar from "@/components/User/UserSidebar";
import AccountInfoForm, { AccountInfoData } from "@/components/User/Account/AccountInfoForm";
import PasswordForm from "@/components/User/Security/PasswordForm";
import CommunicationPreferences, { PreferenceItem } from "@/components/User/Account/CommunicationPreferences";
import DangerZone from "@/components/User/Account/DangerZone";

export default function AccountInfoOverview() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState<AccountInfoData>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [preferences, setPreferences] = useState<PreferenceItem[]>([
    {
      key: "newsletter",
      label: "Newsletter par e-mail",
      text: "Nouveautés, lancements et offres exclusives BOZA",
      checked: true,
    },
  ]);

  useEffect(() => {
    async function loadUser() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/connexion");
        return;
      }

      setUserId(authData.user.id);
      setUserEmail(authData.user.email ?? "");

      const { data: clientData } = await supabase
        .from("clients")
        .select("nom_prenom, telephone, newsletter")
        .eq("id", authData.user.id)
        .single();

      setUserName(clientData?.nom_prenom ?? authData.user.email ?? "Client BOZA");

      setFormData({
        fullName: clientData?.nom_prenom ?? "",
        email: authData.user.email ?? "",
        phone: clientData?.telephone ?? "",
      });

      setPreferences((prev) =>
        prev.map((pref) =>
          pref.key === "newsletter" ? { ...pref, checked: clientData?.newsletter ?? pref.checked } : pref
        )
      );

      setLoading(false);
    }

    loadUser();
  }, [router, supabase]);

  async function handleSave(data: AccountInfoData) {
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("clients")
      .update({
        nom_prenom: data.fullName,
        telephone: data.phone,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      console.error("Erreur mise à jour informations client :", error);
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement. Réessaie." });
      return;
    }

    setFormData(data);
    setUserName(data.fullName);
    setMessage({ type: "success", text: "Modifications enregistrées." });
  }

  async function handleTogglePreference(key: string) {
    const previous = preferences;
    const updated = preferences.map((pref) => (pref.key === key ? { ...pref, checked: !pref.checked } : pref));
    setPreferences(updated);

    const toggled = updated.find((pref) => pref.key === key);
    if (toggled && toggled.key === "newsletter") {
      const { error } = await supabase.from("clients").update({ newsletter: toggled.checked }).eq("id", userId);

      if (error) {
        console.error("Erreur mise à jour newsletter :", error);
        setPreferences(previous);
        window.alert("Impossible de mettre à jour cette préférence.");
      }
    }
  }

  function handleDeleteAccount() {
    window.alert("La suppression de compte n'est pas encore disponible. Contacte le support si besoin.");
  }

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <UserSidebar activeSection="informations" userName={userName} userEmail={userEmail} />

        <main className="flex-1 p-10 px-10 pb-[60px] max-[968px]:px-6 max-[968px]:pt-6 max-[640px]:p-5 max-[640px]:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5 max-[640px]:text-[22px]">Mes informations</h1>
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


        <AccountInfoForm initialData={formData} onSave={handleSave} saving={saving} />

        {message && (
          <div
            className={`flex items-center gap-3 -mt-4 mb-6 px-5 py-4 text-sm font-semibold border ${
              message.type === "success"
                ? "bg-boza-cream-alt border-boza-black text-boza-black"
                : "bg-boza-brown/10 border-boza-brown text-boza-brown"
            }`}
          >
            <i className={`fas ${message.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
            {message.text}
          </div>
        )}

        <PasswordForm />

        <CommunicationPreferences preferences={preferences} onToggle={handleTogglePreference} />
        <DangerZone onDeleteAccount={handleDeleteAccount} />
      </main>
    </div>
  );
}