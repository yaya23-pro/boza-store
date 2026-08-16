"use client";

import { useState } from "react";

type PaymentSectionProps = {
  onSubmit: (method: "card" | "paypal" | "cod") => void;
  loading: boolean;
  error: string | null;
};

export default function PaymentSection({ onSubmit, loading, error }: PaymentSectionProps) {
  const [method, setMethod] = useState<"card" | "paypal" | "cod">("cod");

  return (
    <>
      <h2 className="font-display text-lg font-black uppercase tracking-wide text-boza-black my-8">Paiement</h2>
      <p className="text-xs text-boza-taupe -mt-2.5 mb-4">Toutes les transactions sont sécurisées et chiffrées.</p>

      <div className="border border-boza-black overflow-hidden mb-4">
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
            <div className="relative mb-3">
              <input type="text" placeholder="Numéro de carte" className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none placeholder:text-boza-taupe focus:border-boza-brown" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-boza-taupe text-[13px]">🔒</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3 max-[640px]:grid-cols-1">
              <input type="text" placeholder="Date d'expiration (MM/AA)" className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none placeholder:text-boza-taupe focus:border-boza-brown" />
              <div className="relative">
                <input type="text" placeholder="Code de sécurité" className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none placeholder:text-boza-taupe focus:border-boza-brown" />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-boza-taupe text-[13px]">?</span>
              </div>
            </div>
            <input type="text" placeholder="Nom sur la carte" className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none placeholder:text-boza-taupe focus:border-boza-brown" />
          </div>
        )}

        <div
          onClick={() => setMethod("paypal")}
          className="flex items-center justify-between p-4 font-bold text-sm border-t border-boza-black cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className={`w-[18px] h-[18px] rounded-full border border-boza-black inline-flex items-center justify-center ${method === "paypal" ? "after:content-[''] after:w-2.5 after:h-2.5 after:rounded-full after:bg-boza-black" : ""}`}></span>
            <span>PayPal</span>
          </div>
          <span className="font-bold italic text-boza-brown">PayPal</span>
        </div>

        <div
          onClick={() => setMethod("cod")}
          className="flex items-center justify-between p-4 font-bold text-sm border-t border-boza-black cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className={`w-[18px] h-[18px] rounded-full border border-boza-black inline-flex items-center justify-center ${method === "cod" ? "after:content-[''] after:w-2.5 after:h-2.5 after:rounded-full after:bg-boza-black" : ""}`}></span>
            <span>Paiement à la livraison</span>
          </div>
          <span className="text-boza-taupe text-xs">Espèces à la réception</span>
        </div>
      </div>

      {method === "card" && (
        <div className="flex items-center gap-2.5 text-[13px] px-1 pb-2 text-boza-black">
          <input type="checkbox" defaultChecked className="w-[18px] h-[18px] accent-boza-black" />
          <span>Utiliser l&apos;adresse d&apos;expédition comme adresse de facturation</span>
        </div>
      )}

      {error && <p className="text-boza-brown text-sm mb-4">{error}</p>}

      <button
        onClick={() => onSubmit(method)}
        disabled={loading}
        className="w-full h-[54px] bg-boza-black text-boza-cream border border-boza-black font-bold text-[15px] uppercase tracking-wide cursor-pointer mt-2.5 transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
      >
        {loading ? "Validation..." : "Payer maintenant"}
      </button>
    </>
  );
}