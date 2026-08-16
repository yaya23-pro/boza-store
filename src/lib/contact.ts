import { createClient } from "@/lib/supabase";

export type ContactMessage = {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  statut: string;
  createdAt: string;
};

export type ContactFormData = {
  nom: string;
  email: string;
  sujet: string;
  message: string;
};

export async function submitContactMessage(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("messages_contact").insert({
    nom: data.nom,
    email: data.email,
    sujet: data.sujet,
    message: data.message,
  });

  if (error) {
    console.error("Erreur envoi message contact :", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages_contact")
    .select("id, nom, email, sujet, message, statut, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Erreur chargement messages contact :", error);
    return [];
  }

  return data.map((m) => ({
    id: m.id,
    nom: m.nom,
    email: m.email,
    sujet: m.sujet,
    message: m.message,
    statut: m.statut,
    createdAt: m.created_at,
  }));
}

export async function updateMessageStatus(
  id: string,
  statut: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("messages_contact").update({ statut }).eq("id", id);

  if (error) {
    console.error("Erreur mise à jour statut message :", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}