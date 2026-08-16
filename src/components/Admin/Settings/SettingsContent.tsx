"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { getShopSettings, updateShopSettings, ShopSettings } from "@/lib/settings";

const currencies = [
  { value: "EUR", label: "EUR (€)" },
  { value: "MAD", label: "MAD (DH)" },
  { value: "USD", label: "USD ($)" },
];

const languages = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
];

const tabs = [
  { key: "general", label: "Général" },
  { key: "payment", label: "Paiement" },
  { key: "shipping", label: "Livraison" },
  { key: "notifications", label: "Notifications" },
];

export default function SettingsContent() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

      const shopSettings = await getShopSettings();
      setSettings(shopSettings);
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase]);

  const handleChange = (field: keyof ShopSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
    setMessage(null);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage(null);

    const { id, ...rest } = settings;
    const result = await updateShopSettings(id, rest);

    setSaving(false);

    if (result.success) {
      setMessage({ type: "success", text: "Modifications enregistrées." });
    } else {
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement. Réessaie." });
    }
  };

  if (loading || !settings) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <AdminSidebar activeSection="parametres" adminName={adminName} />

      <main className="flex-1 p-10 px-10 pb-[60px] max-[640px]:p-6 max-[640px]:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5">Paramètres</h1>
          <p className="text-boza-taupe text-sm">Gère les informations et la configuration de ta boutique</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-7 border-b border-boza-cream-alt flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              disabled={tab.key !== "general"}
              className={`py-3 px-1 mr-6 mb-[-1px] bg-transparent border-0 border-b-2 font-body text-sm font-semibold transition-all duration-300 ${
                tab.key === "general"
                  ? "text-boza-black border-boza-black cursor-pointer"
                  : "text-boza-taupe/50 border-transparent cursor-not-allowed"
              }`}
            >
              {tab.label}
              {tab.key !== "general" && (
                <span className="ml-1.5 text-[10px] font-normal">(bientôt)</span>
              )}
            </button>
          ))}
        </div>

        {/* Général panel */}
        <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
          <h2 className="font-display text-lg font-black mb-5">Informations de la boutique</h2>

          <div className="mb-[18px]">
            <label className="block text-[13px] font-semibold text-boza-black mb-2">Nom de la boutique</label>
            <input
              type="text"
              value={settings.nomBoutique}
              onChange={(e) => handleChange("nomBoutique", e.target.value)}
              className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
            />
          </div>

          <div className="grid grid-cols-2 gap-[18px] mb-[18px] max-[640px]:grid-cols-1">
            <div>
              <label className="block text-[13px] font-semibold text-boza-black mb-2">E-mail de contact</label>
              <input
                type="email"
                value={settings.emailContact}
                onChange={(e) => handleChange("emailContact", e.target.value)}
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Téléphone</label>
              <input
                type="tel"
                value={settings.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
              />
            </div>
          </div>

          <div className="mb-[18px]">
            <label className="block text-[13px] font-semibold text-boza-black mb-2">Adresse</label>
            <input
              type="text"
              value={settings.adresse}
              onChange={(e) => handleChange("adresse", e.target.value)}
              className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
            />
          </div>

          <div className="grid grid-cols-2 gap-[18px] max-[640px]:grid-cols-1">
            <div>
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Devise</label>
              <select
                value={settings.devise}
                onChange={(e) => handleChange("devise", e.target.value)}
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
              >
                {currencies.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Langue par défaut</label>
              <select
                value={settings.langueDefaut}
                onChange={(e) => handleChange("langueDefaut", e.target.value)}
                className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
          <h2 className="font-display text-lg font-black mb-5">Réseaux sociaux</h2>

          <div className="mb-[18px]">
            <label className="block text-[13px] font-semibold text-boza-black mb-2">Instagram</label>
            <input
              type="text"
              value={settings.instagram}
              onChange={(e) => handleChange("instagram", e.target.value)}
              placeholder="@boza.store"
              className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
            />
          </div>
          <div className="mb-[18px]">
            <label className="block text-[13px] font-semibold text-boza-black mb-2">TikTok</label>
            <input
              type="text"
              value={settings.tiktok}
              onChange={(e) => handleChange("tiktok", e.target.value)}
              placeholder="@boza.store"
              className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-boza-black mb-2">WhatsApp Business</label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              placeholder="+212 6 00 00 00 00"
              className="w-full py-3 px-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
            />
          </div>
        </div>

        {message && (
          <p className={`text-sm mb-4 ${message.type === "success" ? "text-boza-black" : "text-boza-brown"}`}>
            {message.text}
          </p>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="py-3.5 px-8 bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </main>
    </div>
  );
}