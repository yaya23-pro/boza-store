import { createClient } from "@/lib/supabase";

export type ShopSettings = {
  id: string;
  nomBoutique: string;
  emailContact: string;
  telephone: string;
  adresse: string;
  devise: string;
  langueDefaut: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
};

export async function getShopSettings(): Promise<ShopSettings | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("parametres_boutique")
    .select("*")
    .single();

  if (error || !data) {
    console.error("Erreur chargement paramètres boutique :", error);
    return null;
  }

  return {
    id: data.id,
    nomBoutique: data.nom_boutique ?? "",
    emailContact: data.email_contact ?? "",
    telephone: data.telephone ?? "",
    adresse: data.adresse ?? "",
    devise: data.devise ?? "EUR",
    langueDefaut: data.langue_defaut ?? "fr",
    instagram: data.instagram ?? "",
    tiktok: data.tiktok ?? "",
    whatsapp: data.whatsapp ?? "",
  };
}

export async function updateShopSettings(
  id: string,
  settings: Omit<ShopSettings, "id">
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("parametres_boutique")
    .update({
      nom_boutique: settings.nomBoutique,
      email_contact: settings.emailContact,
      telephone: settings.telephone,
      adresse: settings.adresse,
      devise: settings.devise,
      langue_defaut: settings.langueDefaut,
      instagram: settings.instagram,
      tiktok: settings.tiktok,
      whatsapp: settings.whatsapp,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Erreur mise à jour paramètres boutique :", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}