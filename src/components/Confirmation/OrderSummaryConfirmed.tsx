type ConfirmedItem = {
  image: string;
  name: string;
  variant: string;
  price: string;
};

type OrderSummaryConfirmedProps = {
  items: ConfirmedItem[];
  total: string;
};

export default function OrderSummaryConfirmed({ items, total }: OrderSummaryConfirmedProps) {
  return (
    <div className="bg-boza-cream border border-boza-cream-alt text-left p-[30px] mb-6">
      <h2 className="font-display text-base font-black uppercase tracking-wide mb-5 pb-4 border-b border-boza-cream-alt">
        Récapitulatif
      </h2>

      {items.map((item, index) => (
        <div key={index} className="flex gap-4 items-center py-3.5 border-b border-boza-cream-alt last:border-b-0">
          <img src={item.image} alt={item.name} className="w-[60px] h-[70px] object-cover bg-boza-cream-alt" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-boza-black">{item.name}</div>
            <div className="text-xs text-boza-taupe mt-0.5">{item.variant}</div>
          </div>
          <div className="text-sm font-semibold text-boza-black whitespace-nowrap">{item.price}</div>
        </div>
      ))}

      <div className="flex justify-between mt-5 pt-5 border-t border-boza-black text-[17px] font-bold">
        <span>Total</span>
        <span>{total}</span>
      </div>
    </div>
  );
}