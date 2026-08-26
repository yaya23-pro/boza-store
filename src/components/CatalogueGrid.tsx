"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { getFavoriteProductIds, addToWishlist, removeFromWishlistByProduct } from "@/lib/wishlist";
import { createClient } from "@/lib/supabase";
import { CatalogueProduct } from "@/lib/catalogue";

export default function CatalogueGrid({ products }: { products: CatalogueProduct[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);

  useEffect(() => {
    async function loadFavorites() {
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        setUserId(authData.user.id);
        const ids = await getFavoriteProductIds(authData.user.id);
        setFavoriteIds(ids);
      }
    }
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggleFavorite(productId: string) {
    if (!userId) {
      router.push("/connexion");
      return;
    }

    const isCurrentlyFavorite = favoriteIds.has(productId);
    const previous = new Set(favoriteIds);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyFavorite) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    const result = isCurrentlyFavorite
      ? await removeFromWishlistByProduct(userId, productId)
      : await addToWishlist(userId, productId);

    if (!result.success) {
      setFavoriteIds(previous);
      window.alert("Impossible de mettre à jour les favoris.");
    }
  }

  if (products.length === 0) {
    return <p className="text-center text-boza-taupe py-20">Aucun produit dans cette catégorie.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-[480px]:gap-2.5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favoriteIds.has(product.id)}
            onToggleFavorite={handleToggleFavorite}
            onQuickBuy={setQuickViewSlug}
          />
        ))}
      </div>

      {quickViewSlug && <QuickViewModal productId={quickViewSlug} onClose={() => setQuickViewSlug(null)} />}
    </>
  );
}