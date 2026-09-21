"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { CatalogueProduct } from "@/lib/catalogue";

interface ProductsSectionProps {
  products: CatalogueProduct[];
}

export default function ProductsSection({ products }: ProductsSectionProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleQuickBuy = (slug: string) => {
    console.log("Achat rapide :", slug);
    // TODO: brancher la logique panier
  };

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-14">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-semibold uppercase text-boza-black tracking-wide">
          Nos Essentiels
        </h2>
        <Link
          href="/collections"
          className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-boza-black hover:text-boza-brown transition-colors"
        >
          Voir toute la collection
          <i className="fas fa-arrow-right text-xs"></i>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={handleToggleFavorite}
            onQuickBuy={handleQuickBuy}
          />
        ))}
      </div>
    </section>
  );
}