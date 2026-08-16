"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SaleBanner from "@/components/SaleBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { getCatalogueProducts, getCategories, CatalogueProduct } from "@/lib/catalogue";
import { getFavoriteProductIds, addToWishlist, removeFromWishlistByProduct } from "@/lib/wishlist";
import { createClient } from "@/lib/supabase";

export default function CataloguePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [userId, setUserId] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [productsData, categoriesData] = await Promise.all([getCatalogueProducts(), getCategories()]);
      setProducts(productsData);
      setCategories(categoriesData);

      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        setUserId(authData.user.id);
        const ids = await getFavoriteProductIds(authData.user.id);
        setFavoriteIds(ids);
      }

      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = activeCategory === "Tous" ? products : products.filter((p) => p.category === activeCategory);

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

  return (
    <>
      <SaleBanner />
      <Header />
      <ProductFilters categories={categories} active={activeCategory} onChange={setActiveCategory} />

      <section className="pb-16">
        <div className="container mx-auto">
          {loading ? (
            <p className="text-center text-boza-taupe py-20">Chargement des produits...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-boza-taupe py-20">Aucun produit dans cette catégorie.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-[480px]:gap-2.5">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favoriteIds.has(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onQuickBuy={setQuickViewId}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center mt-[60px]">
            <nav>
              <ul className="flex gap-2.5">
                <li>
                  <a href="#" className="border-2 border-[#e2e8f0] text-black py-[5px] px-[18px] font-normal transition-all duration-300 inline-block opacity-50 pointer-events-none">
                    <i className="fas fa-chevron-left"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="border-2 border-transparent bg-black text-white py-[5px] px-[18px] font-normal inline-block">1</a>
                </li>
                <li>
                  <a href="#" className="border-2 border-[#e2e8f0] text-black py-[5px] px-[18px] font-normal transition-all duration-300 inline-block hover:bg-black hover:text-white hover:border-transparent">2</a>
                </li>
                <li>
                  <a href="#" className="border-2 border-[#e2e8f0] text-black py-[5px] px-[18px] font-normal transition-all duration-300 inline-block hover:bg-black hover:text-white hover:border-transparent">3</a>
                </li>
                <li>
                  <a href="#" className="border-2 border-[#e2e8f0] text-black py-[5px] px-[18px] font-normal transition-all duration-300 inline-block hover:bg-black hover:text-white hover:border-transparent">
                    <i className="fas fa-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <Footer />

      {quickViewId && <QuickViewModal productId={quickViewId} onClose={() => setQuickViewId(null)} />}
    </>
  );
}