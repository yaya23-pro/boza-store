// components/User/Dashboard/WishlistPreview.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWishlist, WishlistItem } from "@/lib/wishlist";

export default function WishlistPreview({ clientId }: { clientId: string }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const wishlist = await getWishlist(clientId);
      setItems(wishlist.slice(0, 4));
      setLoading(false);
    }
    load();
  }, [clientId]);

  if (loading) return null;

  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-lg font-black">Mes favoris</h2>
        <a href="/user/favoris" className="text-[13px] text-boza-brown font-semibold no-underline hover:underline">
          Voir tout
        </a>
      </div>

      {items.length === 0 ? (
        <p className="text-boza-taupe text-sm">Aucun favori pour l&apos;instant.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4 max-[968px]:grid-cols-2">
          {items.map((item) => (
            <Link key={item.id} href={`/produit/${item.produitId}`} className="no-underline block group">
              <img
                src={item.image}
                alt={item.alt}
                className="w-full aspect-[3/4] object-cover bg-boza-cream-alt mb-2 transition-opacity duration-300 group-hover:opacity-80"
              />
              <div className="text-[13px] font-semibold text-boza-black">{item.name}</div>
              <div className="text-[13px] text-boza-taupe">{item.price}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}