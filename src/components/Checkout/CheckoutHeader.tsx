"use client";

import { useCart } from "@/context/CartContext";

export default function CheckoutHeader() {
  const { itemCount } = useCart();

  return (
    <header className="bg-boza-cream border-b border-boza-cream-alt py-[18px] px-10 flex items-center justify-between sticky top-0 z-[1000] max-[640px]:px-5">
      <a href="/" className="font-display text-[26px] font-black text-boza-black no-underline tracking-[-0.5px]">
        BOZA
      </a>
      <a href="/panier" aria-label="Panier" className="relative bg-transparent border-0 cursor-pointer text-boza-black text-lg p-[5px] inline-block">
        <i className="fas fa-cart-shopping"></i>
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-boza-black text-boza-cream min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] font-semibold">
            {itemCount}
          </span>
        )}
      </a>
    </header>
  );
}