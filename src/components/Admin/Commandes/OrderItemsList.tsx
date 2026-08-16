import { OrderDetailItem } from "@/lib/commandes";

type OrderItemsListProps = {
  items: OrderDetailItem[];
  subtotal: number;
  total: number;
};

export default function OrderItemsList({ items, subtotal, total }: OrderItemsListProps) {
  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7">
      <h2 className="font-display text-lg font-black mb-5">Articles commandés</h2>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4 py-4 border-b border-boza-cream-alt last:border-b-0">
          <img src={item.image} alt={item.name} className="w-14 h-16 object-cover bg-boza-cream-alt" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-boza-black">{item.name}</div>
            <div className="text-xs text-boza-taupe mt-0.5">{item.variant}</div>
          </div>
          <div className="text-sm font-semibold text-boza-black whitespace-nowrap">
            {item.price.toFixed(2).replace(".", ",")} €
          </div>
        </div>
      ))}

      <div className="mt-4 pt-4 border-t border-boza-cream-alt">
        <div className="flex justify-between text-[13px] text-boza-taupe mb-2">
          <span>Sous-total</span>
          <span>{subtotal.toFixed(2).replace(".", ",")} €</span>
        </div>
        <div className="flex justify-between text-[13px] text-boza-taupe mb-2">
          <span>Livraison</span>
          <span>Gratuite</span>
        </div>
        <div className="flex justify-between text-base font-bold text-boza-black pt-2.5 border-t border-boza-cream-alt mt-2">
          <span>Total</span>
          <span>{total.toFixed(2).replace(".", ",")} €</span>
        </div>
      </div>
    </div>
  );
}