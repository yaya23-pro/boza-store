import Link from "next/link";
import { CatalogueProduct } from "@/lib/catalogue";

interface ProductCardProps {
  product: CatalogueProduct;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onQuickBuy: (productId: string) => void;
}

export default function ProductCard({ product, isFavorite, onToggleFavorite, onQuickBuy }: ProductCardProps) {
  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(product.id);
  };

  const handleQuickBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickBuy(product.id);
  };

  return (
    <Link
      href={`/produit/${product.id}`}
      className="group overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] h-full relative cursor-pointer"
    >
      <div className="relative overflow-hidden pt-[125%] bg-[#f7fafc]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-108"
        />
      </div>

      <div className="pt-[15px] max-[768px]:pt-2.5">
        <h3 className="text-sm font-normal text-black max-[480px]:text-[13px]">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <span className="text-lg font-normal text-black max-[480px]:text-base">{product.price}€</span>
            {product.oldPrice && (
              <span className="text-sm font-normal text-boza-taupe line-through max-[480px]:text-xs">
                {product.oldPrice}€
              </span>
            )}
          </div>
          <button
            onClick={handleHeartClick}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            className="w-[30px] h-[30px] bg-transparent border-0 text-black text-sm flex items-center justify-center transition-all duration-300 cursor-pointer mr-2.5 max-[480px]:mr-0"
          >
            <i className={isFavorite ? "fas fa-heart text-boza-brown" : "far fa-heart"}></i>
          </button>
        </div>

        <button
          onClick={handleQuickBuyClick}
          className="w-full mt-2.5 py-2.5 bg-boza-black text-boza-cream border border-boza-black font-semibold text-[13px] uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown"
        >
          Acheter maintenant
        </button>
      </div>
    </Link>
  );
}