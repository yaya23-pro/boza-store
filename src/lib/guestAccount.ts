import { createClient } from "@/lib/supabase";

export async function createAccountAndLinkOrders(
  email: string,
  password: string,
  nomPrenom: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nom_prenom: nomPrenom },
    },
  });

  if (signUpError || !data.user) {
    return { success: false, error: signUpError?.message ?? "Erreur lors de la création du compte." };
  }

  // Rattacher toutes les commandes invité passées avec cet email
  const { error: updateError } = await supabase
    .from("commandes")
    .update({ client_id: data.user.id, guest_email: null, guest_nom_prenom: null, guest_telephone: null })
    .eq("guest_email", email);

  if (updateError) {
    console.error("Erreur rattachement commandes :", updateError);
  }

  return { success: true };
}