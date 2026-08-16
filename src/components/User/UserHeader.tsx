"use client";

import { useCart } from "@/context/CartContext";

export default function UserHeader() {
  const { itemCount } = useCart();

  return (
    <header className="bg-boza-cream border-b border-boza-cream-alt sticky top-0 z-[1000]">
      <nav className="py-2.5">
        <div className="container mx-auto flex items-center justify-between px-6">
          <a href="/" className="font-display text-2xl font-black text-boza-black no-underline tracking-[-0.5px]">
            BOZA
          </a>
          <div className="flex items-center gap-2.5">
            <a href="/favoris-preview" aria-label="Favoris" className="p-[5px] text-boza-black inline-block">
              <i className="far fa-heart"></i>
            </a>
            <a href="/panier" aria-label="Panier" className="relative p-[5px] text-boza-black inline-block">
              <i className="fas fa-cart-shopping"></i>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-boza-black text-boza-cream min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] font-semibold">
                  {itemCount}
                </span>
              )}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}