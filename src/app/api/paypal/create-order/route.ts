import { NextResponse } from "next/server";
import { createPaypalOrder } from "@/lib/paypal";
import { calculerTotalPanier } from "@/lib/commande";
import { isPaysSupporte } from "@/lib/devise";

export async function POST(request: Request) {
  try {
    const { items, pays } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier vide ou invalide." }, { status: 400 });
    }
    if (!isPaysSupporte(pays)) {
      return NextResponse.json({ error: "Pays de livraison non supporté." }, { status: 400 });
    }
    // PayPal ne traite pas le MAD — le Maroc ne doit de toute façon jamais
    // atteindre cette route (paiement à la livraison uniquement), mais on le
    // revérifie ici plutôt que de faire confiance à ce que l'interface cache.
    if (pays === "Maroc") {
      return NextResponse.json(
        { error: "PayPal n'est pas disponible pour ce pays." },
        { status: 400 }
      );
    }

    const { total, devise } = await calculerTotalPanier(items, pays);
    const order = await createPaypalOrder(total, devise);
    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error("Erreur create-order PayPal :", error);
    const message = error instanceof Error ? error.message : "Erreur lors de la création de la commande PayPal.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
