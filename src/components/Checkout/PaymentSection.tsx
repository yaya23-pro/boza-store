"use client";

import { useState, useEffect, useRef } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  PayPalHostedFieldsProvider,
  PayPalHostedField,
  usePayPalHostedFields,
} from "@paypal/react-paypal-js";

type CheckoutCartItem = {
  varianteId: string;
  quantity: number;
};

type PaymentSectionProps = {
  onSubmit: (method: "card" | "paypal" | "cod") => void;
  loading: boolean;
  error: string | null;
  items: CheckoutCartItem[];
  pays: string;
  onPaypalApprove: (paypalOrderId: string) => Promise<void>;
};

// Composant interne : n'existe que pour accéder au contexte Hosted Fields
// (usePayPalHostedFields ne fonctionne qu'à l'intérieur du Provider) et
// exposer submitCard() au parent via une ref.
function CardFieldsSubmit({
  cardholderName,
  onApprove,
  onError,
  registerSubmit,
}: {
  cardholderName: string;
  onApprove: (orderId: string) => Promise<void>;
  onError: (msg: string) => void;
  registerSubmit: (fn: () => Promise<void>) => void;
}) {
  const hostedFields = usePayPalHostedFields();

  useEffect(() => {
    registerSubmit(async () => {
      if (!hostedFields?.cardFields) {
        onError("Le formulaire carte n'est pas encore prêt.");
        return;
      }
      if (!cardholderName.trim()) {
        onError("Merci de renseigner le nom sur la carte.");
        return;
      }
      try {
        const { orderId } = await hostedFields.cardFields.submit({ cardholderName });

        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const captureData = await res.json();
        if (!res.ok) {
          onError(captureData.error ?? "Erreur lors de la capture du paiement.");
          return;
        }
        await onApprove(orderId);
      } catch (err) {
        console.error("Erreur soumission carte PayPal :", err);
        onError("Carte refusée ou informations invalides.");
      }
    });
  }, [hostedFields, cardholderName, onApprove, onError, registerSubmit]);

  return null;
}

export default function PaymentSection({ onSubmit, loading, error, items, pays, onPaypalApprove }: PaymentSectionProps) {
  const estMaroc = pays === "Maroc";

  const [method, setMethod] = useState<"card" | "paypal" | "cod">(estMaroc ? "cod" : "paypal");
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState("");
  const [cardSubmitting, setCardSubmitting] = useState(false);
  const submitCardRef = useRef<() => Promise<void>>(async () => {});

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  const panierPourApi = () =>
    items.map((item) => ({ varianteId: item.varianteId, quantite: item.quantity }));

  // Si le pays change (le client modifie le champ "Pays" du formulaire de
  // livraison), on force un mode de paiement cohérent avec les options
  // réellement affichées, plutôt que de laisser une sélection invisible.
  useEffect(() => {
    if (estMaroc && method !== "cod") setMethod("cod");
    if (!estMaroc && method === "cod") setMethod("paypal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estMaroc]);

  // Le jeton carte est chargé dès l'arrivée sur la page (pas seulement quand
  // on clique sur "carte") : un seul script PayPal est utilisé pour les deux
  // options (bouton PayPal + carte), donc il doit être prêt dans les deux cas.
  useEffect(() => {
    if (!estMaroc && !clientToken) {
      fetch("/api/paypal/generate-client-token")
        .then((res) => res.json())
        .then((data) => {
          if (data.clientToken) setClientToken(data.clientToken);
          else setPaypalError("Impossible de charger le paiement par carte.");
        })
        .catch(() => setPaypalError("Impossible de charger le paiement par carte."));
    }
  }, [estMaroc, clientToken]);

  const handleCardSubmit = async () => {
    setPaypalError(null);
    setCardSubmitting(true);
    try {
      await submitCardRef.current();
    } finally {
      setCardSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="font-display text-lg font-black uppercase tracking-wide text-boza-black my-8">Paiement</h2>
      <p className="text-xs text-boza-taupe -mt-2.5 mb-4">Toutes les transactions sont sécurisées et chiffrées.</p>

      <div className="border border-boza-black overflow-hidden mb-4">
        {!estMaroc && paypalClientId && clientToken && (
          // Un seul PayPalScriptProvider pour les deux options (carte + PayPal) :
          // charger le script deux fois avec des réglages différents selon
          // l'option choisie faisait planter l'une ou l'autre selon l'ordre de clic.
          <PayPalScriptProvider
            options={{
              clientId: paypalClientId,
              currency: "EUR",
              components: "buttons,hosted-fields",
              dataClientToken: clientToken,
            }}
          >
            <div className="flex items-center justify-between p-4 bg-boza-cream-alt border-b border-boza-black font-bold text-sm">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setMethod("card")}>
                <span className={`w-[18px] h-[18px] rounded-full border border-boza-black inline-flex items-center justify-center ${method === "card" ? "after:content-[''] after:w-2.5 after:h-2.5 after:rounded-full after:bg-boza-black" : ""}`}></span>
                <span>Carte de crédit</span>
              </div>
              <div className="flex gap-1">
                <span className="inline-flex items-center justify-center h-[22px] w-9 rounded-sm text-[9px] font-bold text-white ml-1" style={{ background: "#1a1f71" }}>VISA</span>
                <span className="inline-flex items-center justify-center h-[22px] w-9 rounded-sm text-[9px] font-bold text-white ml-1" style={{ background: "linear-gradient(90deg,#0099df 50%,#ed0006 50%)" }}></span>
                <span className="inline-flex items-center justify-center h-[22px] w-9 rounded-sm text-[9px] font-bold text-white ml-1 bg-boza-black">●●</span>
                <span className="inline-flex items-center justify-center h-[22px] w-9 rounded-sm text-[9px] font-bold ml-1 bg-boza-cream text-boza-taupe border border-boza-taupe">+2</span>
              </div>
            </div>

            {method === "card" && (
              <div className="p-4">
                {clientToken ? (
                  <PayPalHostedFieldsProvider
                    createOrder={async () => {
                      setPaypalError(null);
                      const res = await fetch("/api/paypal/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ items: panierPourApi(), pays }),
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        setPaypalError(data.error ?? "Erreur PayPal.");
                        throw new Error(data.error ?? "Erreur PayPal.");
                      }
                      return data.id;
                    }}
                    styles={{
                      input: { "font-size": "14px", "font-family": "inherit", color: "#1a1a1a" },
                      ".invalid": { color: "#b3261e" },
                    }}
                  >
                    <div className="relative mb-3">
                      <PayPalHostedField
                        id="card-number"
                        hostedFieldType="number"
                        options={{ selector: "#card-number", placeholder: "Numéro de carte" }}
                        className="w-full h-[46px] border border-boza-black px-3.5 bg-boza-cream flex items-center"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3 max-[640px]:grid-cols-1">
                      <PayPalHostedField
                        id="card-expiry"
                        hostedFieldType="expirationDate"
                        options={{ selector: "#card-expiry", placeholder: "MM/AA" }}
                        className="w-full h-[46px] border border-boza-black px-3.5 bg-boza-cream flex items-center"
                      />
                      <PayPalHostedField
                        id="card-cvv"
                        hostedFieldType="cvv"
                        options={{ selector: "#card-cvv", placeholder: "CVV" }}
                        className="w-full h-[46px] border border-boza-black px-3.5 bg-boza-cream flex items-center"
                      />
                    </div>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Nom sur la carte"
                      className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none placeholder:text-boza-taupe focus:border-boza-brown"
                    />

                    <CardFieldsSubmit
                      cardholderName={cardholderName}
                      onApprove={onPaypalApprove}
                      onError={setPaypalError}
                      registerSubmit={(fn) => (submitCardRef.current = fn)}
                    />
                  </PayPalHostedFieldsProvider>
                ) : (
                  <p className="text-boza-taupe text-sm">Chargement du paiement par carte...</p>
                )}
                {paypalError && <p className="text-boza-brown text-sm mt-3">{paypalError}</p>}
              </div>
            )}

            <div onClick={() => setMethod("paypal")} className="flex items-center justify-between p-4 font-bold text-sm border-t border-boza-black cursor-pointer">
              <div className="flex items-center gap-3">
                <span className={`w-[18px] h-[18px] rounded-full border border-boza-black inline-flex items-center justify-center ${method === "paypal" ? "after:content-[''] after:w-2.5 after:h-2.5 after:rounded-full after:bg-boza-black" : ""}`}></span>
                <span>PayPal</span>
              </div>
              <span className="font-bold italic text-boza-brown">PayPal</span>
            </div>

            {method === "paypal" && (
              <div className="p-4">
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  disabled={loading}
                  createOrder={async () => {
                    setPaypalError(null);
                    const res = await fetch("/api/paypal/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ items: panierPourApi(), pays }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setPaypalError(data.error ?? "Erreur PayPal.");
                      throw new Error(data.error ?? "Erreur PayPal.");
                    }
                    return data.id;
                  }}
                  onApprove={async (data) => {
                    try {
                      const res = await fetch("/api/paypal/capture-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderId: data.orderID }),
                      });
                      const captureData = await res.json();
                      if (!res.ok) {
                        setPaypalError(captureData.error ?? "Erreur lors de la capture du paiement.");
                        return;
                      }
                      await onPaypalApprove(data.orderID);
                    } catch (err) {
                      console.error("Erreur onApprove PayPal :", err);
                      setPaypalError("Une erreur est survenue lors du paiement.");
                    }
                  }}
                  onError={(err) => {
                    console.error("Erreur PayPal :", err);
                    setPaypalError("Une erreur est survenue avec PayPal.");
                  }}
                />
                {paypalError && <p className="text-boza-brown text-sm mt-3">{paypalError}</p>}
              </div>
            )}
          </PayPalScriptProvider>
        )}

        {estMaroc && (
          <div onClick={() => setMethod("cod")} className="flex items-center justify-between p-4 font-bold text-sm cursor-pointer">
            <div className="flex items-center gap-3">
              <span className={`w-[18px] h-[18px] rounded-full border border-boza-black inline-flex items-center justify-center ${method === "cod" ? "after:content-[''] after:w-2.5 after:h-2.5 after:rounded-full after:bg-boza-black" : ""}`}></span>
              <span>Paiement à la livraison</span>
            </div>
            <span className="text-boza-taupe text-xs">Espèces à la réception</span>
          </div>
        )}
      </div>

      {error && <p className="text-boza-brown text-sm mb-4">{error}</p>}

      {method !== "paypal" && (
        <button
          onClick={() => (method === "card" ? handleCardSubmit() : onSubmit(method))}
          disabled={loading || cardSubmitting}
          className="w-full h-[54px] bg-boza-black text-boza-cream border border-boza-black font-bold text-[15px] uppercase tracking-wide cursor-pointer mt-2.5 transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
        >
          {loading || cardSubmitting ? "Validation..." : "Payer maintenant"}
        </button>
      )}
    </>
  );
}