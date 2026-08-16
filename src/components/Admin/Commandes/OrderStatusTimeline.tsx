"use client";

import { useState } from "react";

const steps = [
  { key: "en_attente", label: "Commandée", icon: "fa-check" },
  { key: "confirmee", label: "Confirmée", icon: "fa-check" },
  { key: "en_livraison", label: "En livraison", icon: "fa-truck" },
  { key: "livree", label: "Livrée", icon: "fa-box-open" },
];

const statusOrder = ["en_attente", "confirmee", "en_livraison", "livree"];

type OrderStatusTimelineProps = {
  statut: string;
  onUpdate: (newStatut: string) => Promise<void>;
  updating: boolean;
};

export default function OrderStatusTimeline({ statut, onUpdate, updating }: OrderStatusTimelineProps) {
  const [selected, setSelected] = useState(statut);
  const currentIndex = statusOrder.indexOf(statut);

  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
      <h2 className="font-display text-lg font-black mb-5">Statut de la commande</h2>

      {statut === "annulee" ? (
        <p className="text-boza-brown font-semibold text-sm mb-4">Cette commande a été annulée.</p>
      ) : (
        <div className="flex justify-between relative mb-1.5 max-[968px]:flex-col max-[968px]:gap-5 max-[968px]:items-start">
          <div className="absolute top-3 left-0 right-0 h-px bg-boza-cream-alt z-0 max-[968px]:hidden"></div>
          {steps.map((step, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            return (
              <div key={step.key} className="relative z-10 text-center flex-1 max-[968px]:flex max-[968px]:items-center max-[968px]:gap-3 max-[968px]:text-left">
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] mx-auto mb-2.5 max-[968px]:mx-0 ${
                    done
                      ? "bg-boza-black border-boza-black text-boza-cream"
                      : current
                      ? "bg-boza-brown border-boza-brown text-boza-cream"
                      : "bg-boza-cream border-boza-cream-alt text-boza-taupe"
                  }`}
                >
                  <i className={`fas ${step.icon}`}></i>
                </div>
                <div className="text-xs font-semibold text-boza-black">{step.label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2.5 items-center mt-4">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 py-2.5 px-3 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none"
        >
          <option value="en_attente">En attente</option>
          <option value="confirmee">Confirmée</option>
          <option value="en_livraison">En livraison</option>
          <option value="livree">Livrée</option>
          <option value="annulee">Annulée</option>
        </select>
        <button
          onClick={() => onUpdate(selected)}
          disabled={updating || selected === statut}
          className="py-2.5 px-[18px] bg-boza-black text-boza-cream border border-boza-black font-semibold text-sm cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60 whitespace-nowrap"
        >
          {updating ? "Mise à jour..." : "Mettre à jour le statut"}
        </button>
      </div>
    </div>
  );
}