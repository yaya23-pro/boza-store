"use client";

import { useCart } from "@/context/CartContext";
import CartItem from "@/components/Panier/CartItem";
import OrderSummary from "@/components/Panier/OrderSummary";
import EmptyCart from "@/components/Panier/EmptyCart";
import RecommendedProducts from "@/components/Panier/RecommendedProducts";
import { usePays } from "@/context/PaysContext";
import { choisirPrix, getDeviseForPays } from "@/lib/devise";

export default function PanierContent() {
  const { items, incrementItem, decrementItem, removeItem } = useCart();
  const { pays } = usePays();
  const devise = getDeviseForPays(pays);

  // Le prix unitaire réel (€ ou MAD) dépend du pays courant : on le calcule
  // une fois ici, plutôt que de le laisser recalculer par chaque enfant.
  const itemsAvecPrix = items.map((item) => ({
    ...item,
    prixAffiche: choisirPrix(item.price, item.priceMad, pays),
  }));

  const subtotal = itemsAvecPrix.reduce((sum, item) => sum + item.prixAffiche * item.quantity, 0);

  return (
    <section className="py-2 overflow-x-hidden">
      <div className="container mx-auto">
        <h1 className="font-display text-[32px] font-black text-boza-black mb-2">Mon Panier</h1>
        <p className="text-boza-taupe text-[15px] mb-[30px]">
          {items.length} article{items.length > 1 ? "s" : ""} dans votre panier
        </p>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            <div>
              <div className="bg-boza-cream border border-boza-cream-alt p-[30px] mb-[30px] max-[480px]:p-4">
                {itemsAvecPrix.map((item) => (
                  <CartItem
                    key={item.id}
                    image={item.image}
                    name={item.name}
                    category={item.category}
                    size={item.size}
                    color={item.color}
                    price={item.prixAffiche}
                    devise={devise}
                    quantity={item.quantity}
                    onIncrement={() => incrementItem(item.id)}
                    onDecrement={() => decrementItem(item.id)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            </div>

            <OrderSummary itemCount={items.length} subtotal={subtotal} devise={devise} />
          </div>
        )}
      </div>

      {items.length > 0 && <RecommendedProducts />}
    </section>
  );
}
