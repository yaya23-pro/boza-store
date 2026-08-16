"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import ContactSection from "@/components/Checkout/ContactSection";
import ShippingSection from "@/components/Checkout/ShippingSection";
import PaymentSection from "@/components/Checkout/PaymentSection";
import OrderSummarySidebar from "@/components/Checkout/OrderSummarySidebar";

export default function CheckoutContent() {
  const router = useRouter();
  const supabase = createClient();
  const { items } = useCart();

  const [shipping, setShipping] = useState({
    pays: "Maroc",
    prenom: "",
    nom: "",
    rue: "",
    ville: "",
    codePostal: "",
    telephone: "+212",
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
          telephone: client.telephone ?? "+212",
        }));
        setNewsletter(client.newsletter ?? false);
      }
    }
    loadClient();
  }, [supabase]);

  const handleChange = (field: string, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (method: "card" | "paypal" | "cod") => {
    setError(null);

    if (method !== "cod") {
      setError("Ce mode de paiement n'est pas encore disponible. Choisis 'Paiement à la livraison'.");
      return;
    }

    if (!shipping.rue || !shipping.ville) {
      setError("Merci de renseigner l'adresse et la ville.");
      return;
    }

    if (items.length === 0) {
      setError("Ton panier est vide.");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/connexion");
      return;
    }

    // Mise à jour téléphone (+ newsletter uniquement si le client vient de l'accepter)
    if (newsletter) {
      await supabase
        .from("clients")
        .update({ telephone: shipping.telephone, newsletter: true })
        .eq("id", user.id);
    } else {
      await supabase
        .from("clients")
        .update({ telephone: shipping.telephone })
        .eq("id", user.id);
    }

    const montantTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: adresse, error: adresseError } = await supabase
      .from("adresses")
      .insert({
        client_id: user.id,
        rue: shipping.rue,
        ville: shipping.ville,
        code_postal: shipping.codePostal || null,
        pays: shipping.pays,
        type: "livraison",
      })
      .select("id")
      .single();

    if (adresseError || !adresse) {
      console.error("Erreur adresse :", adresseError);
      setLoading(false);
      setError(adresseError?.message ?? "Erreur lors de l'enregistrement de l'adresse.");
      return;
    }

    const paiementId = crypto.randomUUID();

    const { error: paiementError } = await supabase
      .from("paiements")
      .insert({ id: paiementId, mode: "a_la_livraison", statut: "en_attente", montant: montantTotal });

    if (paiementError) {
      console.error("Erreur paiement :", paiementError);
      setLoading(false);
      setError(paiementError.message);
      return;
    }

    const { data: commande, error: commandeError } = await supabase
      .from("commandes")
      .insert({
        client_id: user.id,
        adresse_id: adresse.id,
        paiement_id: paiementId,
        montant_total: montantTotal,
        statut: "en_attente",
      })
      .select("id")
      .single();

    if (commandeError || !commande) {
      console.error("Erreur commande :", commandeError);
      setLoading(false);
      setError(commandeError?.message ?? "Erreur lors de la création de la commande.");
      return;
    }

    const lignes = items.map((item) => ({
      commande_id: commande.id,
      variante_id: item.varianteId,
      quantite: item.quantity,
      prix_unitaire: item.price,
    }));

    const { error: lignesError } = await supabase.from("lignes_commande").insert(lignes);

    if (lignesError) {
      console.error("Erreur lignes commande :", lignesError);
      setLoading(false);
      setError(lignesError.message);
      return;
    }

    const { data: panier } = await supabase
      .from("paniers")
      .select("id")
      .eq("client_id", user.id)
      .maybeSingle();

    if (panier) {
      await supabase.from("lignes_panier").delete().eq("panier_id", panier.id);
    }

    setLoading(false);
    router.push(`/confirmation?commande=${commande.id}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-70px)] items-start max-[968px]:flex-col">
      <div className="flex-1 max-w-[50%] mx-auto p-[50px_90px] bg-boza-cream max-[968px]:max-w-full max-[968px]:w-full max-[968px]:p-[30px_24px]">
        <ContactSection
          showNewsletterOffer={!newsletter}
          newsletter={newsletter}
          onNewsletterChange={setNewsletter}
        />
        <ShippingSection values={shipping} onChange={handleChange} />
        <PaymentSection onSubmit={handleSubmit} loading={loading} error={error} />
      </div>

      <div className="w-1/2 mx-auto bg-boza-cream-alt p-[50px_90px] sticky top-0 h-fit max-[968px]:max-w-full max-[968px]:w-full max-[968px]:p-[30px_24px] max-[968px]:order-first max-[968px]:static">
        <OrderSummarySidebar />
      </div>
    </div>
  );
}