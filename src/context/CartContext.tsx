"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { createClient } from "@/lib/supabase";

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

  const loadCart = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setItems([]);
      setPanierId(null);
      setLoading(false);
      return;
    }

    // Ne pas gérer de panier pour les comptes admin
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

    let { data: panier } = await supabase
      .from("paniers")
      .select("id")
      .eq("client_id", user.id)
      .maybeSingle();

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
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        loadCart();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, loadCart]);

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