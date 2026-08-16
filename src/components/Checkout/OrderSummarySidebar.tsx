"use client";

import { useCart } from "@/context/CartContext";

export default function OrderSummarySidebar() {
  const { items } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {items.map((item) => (
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
            {(item.price * item.quantity).toFixed(2).replace(".", ",")} €
          </div>
        </div>
      ))}

      <div className="flex gap-2.5 mb-6">
        <input type="text" placeholder="Code de réduction ou carte-cadeau" className="flex-1 h-[46px] border border-boza-black px-3.5 bg-boza-cream text-sm placeholder:text-boza-taupe outline-none" />
        <button className="px-6 border border-boza-black bg-boza-cream-alt text-boza-taupe font-bold cursor-not-allowed">
          Valider
        </button>
      </div>

      <div className="border-t border-boza-black pt-4">
        <div className="flex justify-between text-sm mb-2.5 text-boza-black">
          <span>Sous-total</span>
          <span>{subtotal.toFixed(2).replace(".", ",")} €</span>
        </div>
        <div className="flex justify-between text-sm mb-2.5 text-boza-taupe">
          <span>Expédition <span className="text-[11px] text-boza-taupe border border-boza-taupe rounded-full w-3.5 h-3.5 inline-flex items-center justify-center ml-1">?</span></span>
          <span>Saisir une adresse d&apos;expédition</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-boza-black pt-4 mt-1.5 text-boza-black">
          <span>Total</span>
          <span><span className="text-xs font-normal text-boza-taupe mr-1.5">EUR</span>{subtotal.toFixed(2).replace(".", ",")} €</span>
        </div>
      </div>
    </>
  );
}