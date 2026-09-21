"use client";

import { useCart } from "@/context/CartContext";
import { choisirPrix, getDeviseForPays, formatMontant } from "@/lib/devise";

export default function OrderSummarySidebar({ pays }: { pays: string }) {
  const { items } = useCart();
  const devise = getDeviseForPays(pays);

  const subtotal = items.reduce(
    (sum, item) => sum + choisirPrix(item.price, item.priceMad, pays) * item.quantity,
    0
  );

  return (
    <>
      {items.map((item) => {
        const prixUnitaire = choisirPrix(item.price, item.priceMad, pays);
        return (
          <div key={item.id} className="flex gap-4 items-start mb-6">
            <div className="relative w-[70px] h-[70px] bg-boza-cream border border-boza-black flex items-center justify-center">
              <span className="absolute -top-2 -right-2 bg-boza-black text-boza-cream text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-boza-black">{item.name}</div>
              <div className="text-xs text-boza-taupe mt-0.5">{item.color} · Taille {item.size}</div>
            </div>
            <div className="text-sm font-medium whitespace-nowrap text-boza-black">
              {formatMontant(prixUnitaire * item.quantity, devise)}
            </div>
          </div>
        );
      })}

      <div className="border-t border-boza-black pt-4">
        <div className="flex justify-between text-sm mb-2.5 text-boza-black">
          <span>Sous-total</span>
          <span>{formatMontant(subtotal, devise)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2.5 text-boza-taupe">
          <span>Expédition</span>
          <span>Gratuite</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-boza-black pt-4 mt-1.5 text-boza-black">
          <span>Total</span>
          <span><span className="text-xs font-normal text-boza-taupe mr-1.5">{devise}</span>{formatMontant(subtotal, devise)}</span>
        </div>
      </div>
    </>
  );
}
