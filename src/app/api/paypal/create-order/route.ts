import { NextResponse } from "next/server";
import { createPaypalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
    }

    const order = await createPaypalOrder(amount);
    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error("Erreur create-order PayPal :", error);
    return NextResponse.json({ error: "Erreur lors de la création de la commande PayPal." }, { status: 500 });
  }
}