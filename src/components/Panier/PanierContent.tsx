"use client";

import { useCart } from "@/context/CartContext";
import CartItem from "@/components/Panier/CartItem";
import CouponBox from "@/components/Panier/CouponBox";
import OrderSummary from "@/components/Panier/OrderSummary";
import EmptyCart from "@/components/Panier/EmptyCart";
import RecommendedProducts from "@/components/Panier/RecommendedProducts";

export default function PanierContent() {
  const { items, incrementItem, decrementItem, removeItem } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const tax = (subtotal - discount) * 0.2;
  const total = subtotal - discount + tax;

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
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onIncrement={() => incrementItem(item.id)}
                    onDecrement={() => decrementItem(item.id)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
              <CouponBox />
            </div>

            <OrderSummary itemCount={items.length} subtotal={subtotal} discount={discount} tax={tax} total={total} />
          </div>
        )}
      </div>

      {items.length > 0 && <RecommendedProducts />}
    </section>
  );
}