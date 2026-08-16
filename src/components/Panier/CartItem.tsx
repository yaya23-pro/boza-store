type CartItemProps = {
  image: string;
  name: string;
  category: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

export default function CartItem({
  image,
  name,
  category,
  size,
  color,
  price,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-4 py-5 border-b border-boza-cream-alt last:border-b-0">
      <img
        src={image}
        alt={name}
        className="w-[80px] h-[80px] object-cover bg-boza-cream-alt flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-boza-black uppercase tracking-wide">
              {category}
            </div>
            <div className="text-[14px] text-boza-black mt-0.5 truncate">{name}</div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onRemove}
              className="w-7 h-7 flex items-center justify-center border border-boza-cream-alt text-boza-taupe hover:text-boza-black transition-colors"
            >
              <i className="fas fa-trash-alt text-xs"></i>
            </button>
          </div>
        </div>

        <div className="text-[13px] text-boza-taupe mt-2">
          Couleur : <span className="font-semibold text-boza-black">{color}</span>
          {"  "}Taille : <span className="font-semibold text-boza-black">{size}</span>
        </div>
        <div className="text-[13px] text-boza-taupe mt-1">
          Prix unitaire : <span className="font-semibold text-boza-black">{price.toFixed(2).replace(".", ",")} €</span>
        </div>

        <div className="flex justify-between items-end mt-3">
          <div>
            <div className="text-[11px] text-boza-taupe font-medium mb-1">Quantité</div>
            <div className="flex items-center gap-3 border border-boza-black px-3 py-1.5 w-fit">
              <button onClick={onDecrement} className="text-boza-black text-sm">
                <i className="fas fa-minus"></i>
              </button>
              <span className="text-sm font-semibold min-w-[16px] text-center">{quantity}</span>
              <button onClick={onIncrement} className="text-boza-black text-sm">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <div className="text-lg font-bold text-boza-black">
            {(price * quantity).toFixed(2).replace(".", ",")} €
          </div>
        </div>
      </div>
    </div>
  );
}