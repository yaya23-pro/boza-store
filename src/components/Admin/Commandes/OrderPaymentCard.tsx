"use client";

import { useState } from "react";

type OrderPaymentCardProps = {
  mode: string;
  statut: string;
  onUpdate: (newStatut: string) => Promise<void>;
  updating: boolean;
};

const paiementStatutLabels: Record<string, string> = {
  en_attente: "En attente",
  paye: "Payé",
};

export default function OrderPaymentCard({ mode, statut, onUpdate, updating }: OrderPaymentCardProps) {
  const [selected, setSelected] = useState(statut);

  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7">
      <h2 className="font-display text-lg font-black mb-5">Paiement</h2>

      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 bg-boza-cream-alt flex items-center justify-center text-boza-black text-[13px] shrink-0">
          <i className="fas fa-credit-card"></i>
        </div>
        <div>
          <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-0.5">Méthode</div>
          <div className="text-[13px] text-boza-black font-medium">{mode}</div>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="w-8 h-8 bg-boza-cream-alt flex items-center justify-center text-boza-black text-[13px] shrink-0">
          <i className="fas fa-check-circle"></i>
        </div>
        <div>
          <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-0.5">Statut du paiement</div>
          <div className="text-[13px] text-boza-black font-medium">{paiementStatutLabels[statut] ?? statut}</div>
        </div>
      </div>

      <div className="flex gap-2.5 items-center pt-4 border-t border-boza-cream-alt">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 py-2.5 px-3 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none"
        >
          <option value="en_attente">En attente</option>
          <option value="paye">Payé</option>
        </select>
        <button
          onClick={() => onUpdate(selected)}
          disabled={updating || selected === statut}
          className="py-2.5 px-[18px] bg-boza-black text-boza-cream border border-boza-black font-semibold text-sm cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60 whitespace-nowrap"
        >
          {updating ? "..." : "Mettre à jour"}
        </button>
      </div>
    </div>
  );
}