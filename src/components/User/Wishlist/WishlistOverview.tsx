"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import UserSidebar from "@/components/User/UserSidebar";
import WishlistGrid from "@/components/User/Wishlist/WishlistGrid";
import WishlistEmpty from "@/components/User/Wishlist/WishlistEmpty";
import { getWishlist, removeFromWishlist, WishlistItem } from "@/lib/wishlist";

export default function WishlistOverview() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/connexion");
        return;
      }

      setUserEmail(authData.user.email ?? "");

      const { data: clientData } = await supabase
        .from("clients")
        .select("nom_prenom")
        .eq("id", authData.user.id)
        .single();

      setUserName(clientData?.nom_prenom ?? authData.user.email ?? "Client BOZA");

      const items = await getWishlist(authData.user.id);
      setWishlist(items);

      setLoading(false);
    }

    loadData();
  }, [router, supabase]);

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  const handleRemove = async (id: string) => {
    const previous = wishlist;
    setWishlist((prev) => prev.filter((item) => item.id !== id));

    const result = await removeFromWishlist(id);

    if (!result.success) {
      setWishlist(previous);
      window.alert("Impossible de retirer cet article des favoris.");
    }
  };

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-[calc(100vh-70px)] max-[968px]:flex-col">
      <UserSidebar activeSection="favoris" userName={userName} userEmail={userEmail} />

<main className="flex-1 p-10 px-10 pb-[60px] max-[968px]:px-6 max-[968px]:pt-6 max-[640px]:p-5 max-[640px]:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-black mb-1.5 max-[640px]:text-[22px]">Mes favoris</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="text-boza-taupe text-xs font-semibold tracking-wide bg-transparent cursor-pointer transition-all duration-300 flex items-center gap-2 hover:bg-boza-cream-alt"
            >
              <i className="fas fa-arrow-left text-[10px]"></i>
              Retour
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-boza-taupe text-xs font-semibold tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt"
            >
              Accueil
            </button>
          </div>
        </div>

        {wishlist.length === 0 ? <WishlistEmpty /> : <WishlistGrid items={wishlist} onRemove={handleRemove} />}
      </main>
    </div>
  );
}