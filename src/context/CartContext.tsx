"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { getOrCreateGuestToken, getGuestToken, clearGuestToken } from "@/lib/guestCart";

export type CartLine = {
  id: string;
  varianteId: string;
  image: string;
  name: string;
  category: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartLine[];
  loading: boolean;
  addItem: (varianteId: string, quantity: number) => Promise<void>;
  incrementItem: (id: string) => Promise<void>;
  decrementItem: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [items, setItems] = useState<CartLine[]>([]);
  const [panierId, setPanierId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const mergeGuestCart = useCallback(async (userId: string) => {
    const guestToken = getGuestToken();
    if (!guestToken) return;

    const { data: guestPanier } = await supabase
      .from("paniers")
      .select("id")
      .eq("guest_token", guestToken)
      .maybeSingle();

    if (!guestPanier) {
      clearGuestToken();
      return;
    }

    const { data: guestLignes } = await supabase
      .from("lignes_panier")
      .select("id, variante_id, quantite")
      .eq("panier_id", guestPanier.id);

    if (!guestLignes || guestLignes.length === 0) {
      await supabase.from("paniers").delete().eq("id", guestPanier.id);
      clearGuestToken();
      return;
    }

    let { data: userPanier } = await supabase
      .from("paniers")
      .select("id")
      .eq("client_id", userId)
      .maybeSingle();

    if (!userPanier) {
      const { data: newPanier, error } = await supabase
        .from("paniers")
        .insert({ client_id: userId })
        .select("id")
        .single();

      if (error) {
        console.error("Erreur création panier lors de la fusion :", error);
        return;
      }
      userPanier = newPanier;
    }

    const { data: userLignes } = await supabase
      .from("lignes_panier")
      .select("id, variante_id, quantite")
      .eq("panier_id", userPanier.id);

    for (const guestLigne of guestLignes) {
      const existingUserLigne = (userLignes ?? []).find((l) => l.variante_id === guestLigne.variante_id);

      if (existingUserLigne) {
        await supabase
          .from("lignes_panier")
          .update({ quantite: existingUserLigne.quantite + guestLigne.quantite })
          .eq("id", existingUserLigne.id);
      } else {
        await supabase
          .from("lignes_panier")
          .insert({
            panier_id: userPanier.id,
            variante_id: guestLigne.variante_id,
            quantite: guestLigne.quantite,
          });
      }
    }

    await supabase.from("lignes_panier").delete().eq("panier_id", guestPanier.id);
    await supabase.from("paniers").delete().eq("id", guestPanier.id);
    clearGuestToken();
  }, [supabase]);

  const loadCart = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: adminCheck } = await supabase
        .from("admins")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (adminCheck) {
        setItems([]);
        setPanierId(null);
        setLoading(false);
        return;
      }
    }

    let panier = null;

    if (user) {
      const { data: existingPanier } = await supabase
        .from("paniers")
        .select("id")
        .eq("client_id", user.id)
        .maybeSingle();

      panier = existingPanier;

      if (!panier) {
        const { data: newPanier, error } = await supabase
          .from("paniers")
          .insert({ client_id: user.id })
          .select("id")
          .single();

        if (error) {
          if (error.code === "23503") {
            console.warn("Utilisateur sans profil client, panier ignoré.");
            setItems([]);
            setPanierId(null);
            setLoading(false);
            return;
          }
          console.error("Erreur création panier :", error);
          setLoading(false);
          return;
        }
        panier = newPanier;
      }
    } else {
      const guestToken = getOrCreateGuestToken();

      const { data: existingPanier } = await supabase
        .from("paniers")
        .select("id")
        .eq("guest_token", guestToken)
        .maybeSingle();

      panier = existingPanier;

      if (!panier) {
        const { data: newPanier, error } = await supabase
          .from("paniers")
          .insert({ guest_token: guestToken })
          .select("id")
          .single();

        if (error) {
          console.error("Erreur création panier invité :", error);
          setLoading(false);
          return;
        }
        panier = newPanier;
      }
    }

    setPanierId(panier.id);

    const { data: lignes, error: lignesError } = await supabase
      .from("lignes_panier")
      .select(`
        id,
        quantite,
        variante_id,
        variantes (
          taille,
          couleur,
          prix,
          produits ( nom_produit ),
          images ( url_image, ordre )
        )
      `)
      .eq("panier_id", panier.id);

    if (lignesError) {
      console.error("Erreur chargement panier :", lignesError);
      setLoading(false);
      return;
    }

    const mapped: CartLine[] = (lignes ?? []).map((l: any) => {
      const v = l.variantes;
      const images = (v?.images ?? []).sort((a: any, b: any) => a.ordre - b.ordre);
      return {
        id: l.id,
        varianteId: l.variante_id,
        image: images[0]?.url_image ?? "/image/placeholder.png",
        name: v?.produits?.nom_produit ?? "",
        category: "",
        size: v?.taille ?? "",
        color: v?.couleur ?? "",
        price: v?.prix ?? 0,
        quantity: l.quantite,
      };
    });

    setItems(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await mergeGuestCart(session.user.id);
        await loadCart();
      } else if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        await loadCart();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, loadCart, mergeGuestCart]);

  const addItem = async (varianteId: string, quantity: number) => {
    if (!panierId) return;

    const { data: existing } = await supabase
      .from("lignes_panier")
      .select("id, quantite")
      .eq("panier_id", panierId)
      .eq("variante_id", varianteId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("lignes_panier")
        .update({ quantite: existing.quantite + quantity })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("lignes_panier")
        .insert({ panier_id: panierId, variante_id: varianteId, quantite: quantity });
    }

    await loadCart();
  };

  const incrementItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await supabase.from("lignes_panier").update({ quantite: item.quantity + 1 }).eq("id", id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
  };

  const decrementItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity - 1);
    await supabase.from("lignes_panier").update({ quantite: newQty }).eq("id", id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)));
  };

  const removeItem = async (id: string) => {
    await supabase.from("lignes_panier").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addItem, incrementItem, decrementItem, removeItem, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  return context;
}