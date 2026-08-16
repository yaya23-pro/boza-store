export type WishlistItem = {
  id: string;
  image: string;
  alt: string;
  category: string;
  name: string;
  price: string;
};

type WishlistGridProps = {
  items: WishlistItem[];
  onRemove: (id: string) => void;
};

export default function WishlistGrid({ items, onRemove }: WishlistGridProps) {
  return (
    <div className="grid grid-cols-4 gap-6 max-[968px]:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="bg-boza-cream border border-boza-cream-alt overflow-hidden group">
          <div className="relative overflow-hidden pt-[125%] bg-boza-cream-alt">
            <img
              src={item.image}
              alt={item.alt}
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
            <button
              onClick={() => onRemove(item.id)}
              aria-label="Retirer des favoris"
              className="absolute top-2.5 right-2.5 w-[34px] h-[34px] bg-boza-cream border-0 flex items-center justify-center text-boza-black cursor-pointer transition-all duration-300 z-[2] hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="p-4">
            <div className="text-[11px] text-boza-taupe uppercase tracking-wide mb-1">{item.category}</div>
            <div className="text-sm font-semibold text-boza-black mb-2">{item.name}</div>
            <div className="font-display text-base font-black text-boza-black mb-3.5">{item.price}</div>
            <button className="w-full py-3 bg-boza-black text-boza-cream border border-boza-black font-body text-[13px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown">
              Ajouter au panier
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}