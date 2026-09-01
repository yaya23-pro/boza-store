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

  const [email, setEmail] = useState("");
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

  const montantTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  const validateForm = (): boolean => {
    if (!email) {
      setError("Merci de renseigner ton adresse e-mail.");
      return false;
    }
    if (!shipping.prenom || !shipping.nom || !shipping.rue || !shipping.ville) {
      setError("Merci de renseigner ton nom, prénom, l'adresse et la ville.");
      return false;
    }
    if (items.length === 0) {
      setError("Ton panier est vide.");
      return false;
    }
    return true;
  };

  const createOrderRecord = async (paiementMode: "a_la_livraison" | "paypal", paiementStatut: "en_attente" | "paye") => {
    const { data: { user } } = await supabase.auth.getUser();
    const isGuest = !user;

    if (user) {
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
    }

    const { data: adresse, error: adresseError } = await supabase
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

    if (adresseError || !adresse) {
      console.error("Erreur adresse :", adresseError);
      throw new Error(adresseError?.message ?? "Erreur lors de l'enregistrement de l'adresse.");
    }

    const paiementId = crypto.randomUUID();

    const { error: paiementError } = await supabase
      .from("paiements")
      .insert({ id: paiementId, mode: paiementMode, statut: paiementStatut, montant: montantTotal });

    if (paiementError) {
      console.error("Erreur paiement :", paiementError);
      throw new Error(paiementError.message);
    }

    const { data: commande, error: commandeError } = await supabase
      .from("commandes")
      .insert({
        client_id: isGuest ? null : user!.id,
        guest_email: isGuest ? email : null,
        guest_nom_prenom: isGuest ? `${shipping.prenom} ${shipping.nom}` : null,
        guest_telephone: isGuest ? shipping.telephone : null,
        adresse_id: adresse.id,
        paiement_id: paiementId,
        montant_total: montantTotal,
        statut: "en_attente",
      })
      .select("id")
      .single();

    if (commandeError || !commande) {
      console.error("Erreur commande :", commandeError);
      throw new Error(commandeError?.message ?? "Erreur lors de la création de la commande.");
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
      throw new Error(lignesError.message);
    }

    if (user) {
      const { data: panier } = await supabase
        .from("paniers")
        .select("id")
        .eq("client_id", user.id)
        .maybeSingle();

      if (panier) {
        await supabase.from("lignes_panier").delete().eq("panier_id", panier.id);
      }
    } else {
      const guestToken = document.cookie.match(/(^| )boza_guest_token=([^;]+)/)?.[2];
      if (guestToken) {
        const { data: panier } = await supabase
          .from("paniers")
          .select("id")
          .eq("guest_token", guestToken)
          .maybeSingle();

        if (panier) {
          await supabase.from("lignes_panier").delete().eq("panier_id", panier.id);
        }
      }
    }

    router.push(`/confirmation?commande=${commande.id}${isGuest ? `&email=${encodeURIComponent(email)}` : ""}`);
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
      await createOrderRecord("a_la_livraison", "en_attente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaypalApprove = async () => {
    setError(null);

    if (!validateForm()) {
      throw new Error("Formulaire incomplet.");
    }

    setLoading(true);
    try {
      await createOrderRecord("paypal", "paye");
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
          total={montantTotal}
          onPaypalApprove={handlePaypalApprove}
        />
      </div>

      <div className="w-1/2 mx-auto bg-boza-cream-alt p-[50px_90px] sticky top-0 h-fit max-[968px]:max-w-full max-[968px]:w-full max-[968px]:p-[30px_24px] max-[968px]:order-first max-[968px]:static">
        <OrderSummarySidebar />
      </div>
    </div>
  );
}