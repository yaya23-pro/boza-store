import { NextResponse } from "next/server";
import { capturePaypalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId manquant." }, { status: 400 });
    }

    const capture = await capturePaypalOrder(orderId);
    return NextResponse.json(capture);
  } catch (error) {
    console.error("Erreur capture-order PayPal :", error);
    return NextResponse.json({ error: "Erreur lors de la capture du paiement." }, { status: 500 });
  }
}