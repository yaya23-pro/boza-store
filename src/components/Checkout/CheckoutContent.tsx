"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { usePays } from "@/context/PaysContext";
import { isPaysSupporte, INDICATIFS_TELEPHONIQUES } from "@/lib/devise";
import ContactSection from "@/components/Checkout/ContactSection";
import ShippingSection from "@/components/Checkout/ShippingSection";
import PaymentSection from "@/components/Checkout/PaymentSection";
import OrderSummarySidebar from "@/components/Checkout/OrderSummarySidebar";

export default function CheckoutContent() {
  const router = useRouter();
  const supabase = createClient();
  const { items } = useCart();
  const { pays: paysDetecte, setPays: setPaysGlobal } = usePays();

  const [email, setEmail] = useState("");
  const [shipping, setShipping] = useState({
    pays: paysDetecte,
    prenom: "",
    nom: "",
    rue: "",
    ville: "",
    codePostal: "",
    telephone: INDICATIFS_TELEPHONIQUES[paysDetecte],
  });
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClient() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: client } = await supabase
        .from("clients")
        .select("nom_prenom, telephone, newsletter")
        .eq("id", user.id)
        .maybeSingle();

      if (client) {
        const [prenom, ...rest] = (client.nom_prenom ?? "").trim().split(" ");
        setShipping((prev) => ({
          ...prev,
          prenom: prenom ?? "",
          nom: rest.join(" "),
          telephone: client.telephone ?? INDICATIFS_TELEPHONIQUES[paysDetecte],
        }));
        setNewsletter(client.newsletter ?? false);
      }
    }
    loadClient();
  }, [supabase]);

  const handleChange = (field: string, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    // Si le client change le pays de livraison, on met aussi à jour le pays
    // global (cookie + contexte) : ça évite un décalage entre le pays choisi
    // ici et celui utilisé ailleurs sur le site (devise affichée, prochaine visite).
    if (field === "pays" && isPaysSupporte(value)) {
      setPaysGlobal(value);
    }
  };

  const validateForm = (): boolean => {
    if (!email) {
      setError("Merci de renseigner ton adresse e-mail.");
      return false;
    }
    if (!shipping.prenom || !shipping.nom || !shipping.rue || !shipping.ville) {
      setError("Merci de renseigner ton nom, prénom, l'adresse et la ville.");
      return false;
    }
    if (shipping.pays === "France" && !shipping.codePostal.trim()) {
      setError("Le code postal est obligatoire pour la France.");
      return false;
    }
    if (items.length === 0) {
      setError("Ton panier est vide.");
      return false;
    }
    return true;
  };

  const creerCommande = async (mode: "a_la_livraison" | "paypal", paypalOrderId?: string) => {
    const guestToken = document.cookie.match(/(^| )boza_guest_token=([^;]+)/)?.[2];

    const res = await fetch("/api/commande/creer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        shipping,
        items: items.map((item) => ({ varianteId: item.varianteId, quantite: item.quantity })),
        mode,
        paypalOrderId,
        guestToken,
        newsletter,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Erreur lors de la création de la commande.");

    router.push(`/confirmation?commande=${data.commandeId}${data.isGuest ? `&email=${encodeURIComponent(email)}` : ""}`);
  };

  const handleSubmit = async (method: "card" | "paypal" | "cod") => {
    setError(null);
    if (method === "card") {
      setError("Ce mode de paiement n'est pas encore disponible.");
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    try {
      await creerCommande("a_la_livraison");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaypalApprove = async (paypalOrderId: string) => {
    setError(null);
    if (!validateForm()) throw new Error("Formulaire incomplet.");

    setLoading(true);
    try {
      await creerCommande("paypal", paypalOrderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-70px)] items-start max-[968px]:flex-col">
      <div className="flex-1 max-w-[50%] mx-auto p-[50px_90px] bg-boza-cream max-[968px]:max-w-full max-[968px]:w-full max-[968px]:p-[30px_24px]">
        <ContactSection
          email={email}
          onEmailChange={setEmail}
          showNewsletterOffer={!newsletter}
          newsletter={newsletter}
          onNewsletterChange={setNewsletter}
        />
        <ShippingSection values={shipping} onChange={handleChange} />
        <PaymentSection
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          items={items}
          pays={shipping.pays}
          onPaypalApprove={handlePaypalApprove}
        />
      </div>

      <div className="w-1/2 mx-auto bg-boza-cream-alt p-[50px_90px] sticky top-0 h-fit max-[968px]:max-w-full max-[968px]:w-full max-[968px]:p-[30px_24px] max-[968px]:order-first max-[968px]:static">
        <OrderSummarySidebar pays={shipping.pays} />
      </div>
    </div>
  );
}