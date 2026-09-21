import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase-admin";
import { calculerTotalPanier, type PanierItem } from "@/lib/commande";
import { isPaysSupporte } from "@/lib/devise";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, shipping, items, mode, paypalOrderId, guestToken, newsletter } = body as {
      email: string;
      shipping: { pays: string; prenom: string; nom: string; rue: string; ville: string; codePostal: string; telephone: string };
      items: PanierItem[];
      mode: "a_la_livraison" | "paypal";
      paypalOrderId?: string;
      guestToken?: string;
      newsletter?: boolean;
    };

    if (!email || !shipping?.prenom || !shipping?.nom || !shipping?.rue || !shipping?.ville) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }
    if (shipping.pays === "France" && !shipping.codePostal?.trim()) {
      return NextResponse.json({ error: "Le code postal est obligatoire pour la France." }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier vide." }, { status: 400 });
    }
    if (mode === "paypal" && !paypalOrderId) {
      return NextResponse.json({ error: "Transaction PayPal manquante." }, { status: 400 });
    }
    if (!isPaysSupporte(shipping.pays)) {
      return NextResponse.json({ error: "Pays de livraison non supporté." }, { status: 400 });
    }
    // Le mode de paiement autorisé dépend du pays — vérifié ici côté serveur,
    // pas seulement caché dans l'interface, pour ne pas dépendre de ce que le
    // navigateur du client veut bien envoyer.
    const estMaroc = shipping.pays === "Maroc";
    if (estMaroc && mode !== "a_la_livraison") {
      return NextResponse.json(
        { error: "Seul le paiement à la livraison est disponible pour le Maroc." },
        { status: 400 }
      );
    }
    if (!estMaroc && mode !== "paypal") {
      return NextResponse.json(
        { error: "Le paiement à la livraison n'est pas disponible pour ce pays." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const authClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );
    const { data: { user } } = await authClient.auth.getUser();
    const isGuest = !user;

    // Prix + total recalculés depuis la DB — jamais depuis le panier envoyé par le client
    const { total, lignes, devise } = await calculerTotalPanier(items, shipping.pays);

    const admin = createAdminClient();

    if (user) {
      await admin.from("clients").update(
        newsletter !== undefined ? { telephone: shipping.telephone, newsletter } : { telephone: shipping.telephone }
      ).eq("id", user.id);
    }

    const { data: adresse, error: adresseError } = await admin
      .from("adresses")
      .insert({
        client_id: user ? user.id : null,
        rue: shipping.rue,
        ville: shipping.ville,
        code_postal: shipping.codePostal || null,
        pays: shipping.pays,
        type: "livraison",
      })
      .select("id")
      .single();

    if (adresseError || !adresse) throw new Error(adresseError?.message ?? "Erreur adresse.");

    const paiementId = crypto.randomUUID();
    const statutPaiement = mode === "paypal" ? "paye" : "en_attente";

    const { error: paiementError } = await admin.from("paiements").insert({
      id: paiementId,
      mode,
      statut: statutPaiement,
      montant: total,
      devise,
      transaction_id: paypalOrderId ?? null,
      date_paiement: statutPaiement === "paye" ? new Date().toISOString() : null,
    });
    if (paiementError) throw new Error(paiementError.message);

    const { data: commande, error: commandeError } = await admin
      .from("commandes")
      .insert({
        client_id: isGuest ? null : user!.id,
        guest_email: isGuest ? email : null,
        guest_nom_prenom: isGuest ? `${shipping.prenom} ${shipping.nom}` : null,
        guest_telephone: isGuest ? shipping.telephone : null,
        adresse_id: adresse.id,
        paiement_id: paiementId,
        montant_total: total,
        devise,
        statut: "en_attente",
      })
      .select("id")
      .single();
    if (commandeError || !commande) throw new Error(commandeError?.message ?? "Erreur commande.");

    const lignesCommande = lignes.map((l) => ({
      commande_id: commande.id,
      variante_id: l.varianteId,
      quantite: l.quantite,
      prix_unitaire: l.prixUnitaire,
    }));
    const { error: lignesError } = await admin.from("lignes_commande").insert(lignesCommande);
    if (lignesError) throw new Error(lignesError.message);

    if (user) {
      const { data: panier } = await admin.from("paniers").select("id").eq("client_id", user.id).maybeSingle();
      if (panier) await admin.from("lignes_panier").delete().eq("panier_id", panier.id);
    } else if (guestToken) {
      const { data: panier } = await admin.from("paniers").select("id").eq("guest_token", guestToken).maybeSingle();
      if (panier) await admin.from("lignes_panier").delete().eq("panier_id", panier.id);
    }

    return NextResponse.json({ commandeId: commande.id, isGuest });
  } catch (error) {
    console.error("Erreur création commande :", error);
    const message = error instanceof Error ? error.message : "Une erreur est survenue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}