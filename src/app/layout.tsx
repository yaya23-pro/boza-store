import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { PaysProvider } from "@/context/PaysContext";
import { NOM_COOKIE_PAYS, isPaysSupporte, PAYS_PAR_DEFAUT } from "@/lib/devise";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "900"],
});

export const metadata: Metadata = {
  title: "BOZA - Boutique streetwear premium",
  description: "BOZA, marque streetwear premium pour la diaspora africaine.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Le pays a déjà été détecté (ou choisi manuellement) par le middleware,
  // qui a posé le cookie avant même que cette page ne s'affiche.
  const cookieStore = await cookies();
  const paysCookie = cookieStore.get(NOM_COOKIE_PAYS)?.value;
  const paysInitial = isPaysSupporte(paysCookie) ? paysCookie : PAYS_PAR_DEFAUT;

  return (
    <html lang="fr" className={`${fraunces.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-boza-cream text-boza-black">
        <PaysProvider initialPays={paysInitial}>
          <CartProvider>{children}</CartProvider>
        </PaysProvider>
      </body>
    </html>
  );
}