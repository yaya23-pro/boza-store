import { NextResponse } from "next/server";
import { generatePaypalClientToken } from "@/lib/paypal";

export async function GET() {
  try {
    const data = await generatePaypalClientToken();
    return NextResponse.json({ clientToken: data.client_token });
  } catch (error) {
    console.error("Erreur generate-client-token PayPal :", error);
    return NextResponse.json({ error: "Erreur lors de la génération du token." }, { status: 500 });
  }
}