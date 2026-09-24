import { createClient } from "@/lib/supabase";

export type StatutRetour = "nouveau" | "en_cours" | "traite";

export const MOTIFS_RETOUR = [
  "La taille ne correspond pas",
  "Le produit est défectueux / endommagé",
  "Le produit reçu est différent de la description",
  "Changement d'avis",
  "Autre",
] as const;

export type ReturnRequest = {
  id: string;
  numeroCommande: string;
  email: string;
  motif: string;
  description: string;
  statut: StatutRetour;
  createdAt: string;
};

export type ReturnRequestFormData = {
  numeroCommande: string;
  email: string;
  motif: string;
  description: string;
};

export async function submitReturnRequest(
  data: ReturnRequestFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("demandes_retour").insert({
    numero_commande: data.numeroCommande,
    email: data.email,
    motif: data.motif,
    description: data.description,
  });

  if (error) {
    console.error("Erreur envoi demande de retour :", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Réservé à l'admin (protégé par RLS côté Supabase : seuls les comptes
// présents dans la table `admins` peuvent lire cette table).
export async function getReturnRequests(): Promise<ReturnRequest[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("demandes_retour")
    .select("id, numero_commande, email, motif, description, statut, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Erreur chargement demandes de retour :", error);
    return [];
  }

  return data.map((r) => ({
    id: r.id,
    numeroCommande: r.numero_commande,
    email: r.email,
    motif: r.motif,
    description: r.description,
    statut: r.statut as StatutRetour,
    createdAt: r.created_at,
  }));
}

export async function updateReturnRequestStatus(
  id: string,
  statut: StatutRetour
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("demandes_retour").update({ statut }).eq("id", id);

  if (error) {
    console.error("Erreur mise à jour statut demande de retour :", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
