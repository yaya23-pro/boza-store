import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["900"],
});

export const metadata: Metadata = {
  title: "BOZA - Boutique streetwear premium",
  description: "BOZA, marque streetwear premium pour la diaspora africaine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-boza-cream text-boza-black">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}