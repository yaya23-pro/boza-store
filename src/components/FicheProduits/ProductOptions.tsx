"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase";
import { ProductColor, ProductVariant } from "@/lib/products";

type SizeOption = { label: string; available: boolean };

type ProductOptionsProps = {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  colors: ProductColor[];
  sizes: SizeOption[];
  variants: ProductVariant[];
  selectedColor: string;
  onColorChange: (color: string) => void;
};

export default function ProductOptions({
  colors,
  sizes,
  variants,
  selectedColor,
  onColorChange,
}: ProductOptionsProps) {
  const router = useRouter();
  const supabase = createClient();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(sizes.find((s) => s.available)?.label ?? sizes[0]?.label ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);

  const resolveVariant = async (): Promise<{ id: string } | null> => {
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/connexion?next=${encodeURIComponent(window.location.pathname)}`);
      return null;
    }

    const variant = variants.find((v) => v.size === selectedSize && v.color === selectedColor);
    if (!variant) {
      setError("Cette combinaison taille/couleur n'est pas disponible.");
      return null;
    }

    return variant;
  };

  const handleAddToCart = async () => {
    const variant = await resolveVariant();
    if (!variant) return;

    await addItem(variant.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    setBuying(true);
    const variant = await resolveVariant();
    if (!variant) {
      setBuying(false);
      return;
    }

    await addItem(variant.id, quantity);
    router.push("/checkout");
  };

  return (
    <>
      {/* Color Selection */}
      <div className="mb-3">
        <div className="font-normal text-boza-black mb-3 flex justify-between items-center">
          <span>
            Couleur: <strong className="font-semibold">{selectedColor}</strong>
          </span>
        </div>
        <div className="flex gap-3 mb-6">
          {colors.map((color) => (
            <div
              key={color.name}
              onClick={() => onColorChange(color.name)}
              style={{ background: color.hex }}
              className={`relative w-[30px] h-[30px] border cursor-pointer transition-all duration-300 ${
                selectedColor === color.name
                  ? "border-boza-brown shadow-[0_0_0_3px_rgba(107,66,38,0.2)]"
                  : "border-boza-black"
              }`}
            >
              {selectedColor === color.name && (
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-boza-cream font-bold text-lg [text-shadow:0_0_2px_rgba(0,0,0,0.5)]">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="border-boza-cream-alt" />

      {/* Size Selection */}
      <div className="my-3">
        <div className="font-normal text-boza-black mb-3 flex justify-between items-center">
          <span>
            Taille: <strong className="font-semibold">{selectedSize}</strong>
          </span>
        </div>
        <div className="flex gap-3 flex-wrap mb-[1.2rem]">
          {sizes.map((size) => (
            <div
              key={size.label}
              onClick={() => size.available && setSelectedSize(size.label)}
              className={`relative w-10 h-10 border border-boza-black flex items-center justify-center font-normal transition-all duration-300 text-boza-black ${
                size.available ? "cursor-pointer" : "cursor-not-allowed opacity-30"
              } ${
                selectedSize === size.label
                  ? "bg-boza-black text-boza-cream border-boza-brown"
                  : "bg-boza-cream"
              }`}
            >
              {size.label}
              {!size.available && (
                <span className="absolute top-1/2 left-0 right-0 h-0.5 bg-boza-taupe -rotate-45"></span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4 mb-4">
        <span className="font-normal text-boza-black">Quantité:</span>
        <div className="flex items-center border border-boza-cream-alt overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="bg-transparent border-0 cursor-pointer text-base text-boza-black px-3 py-2 hover:bg-boza-cream-alt"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            readOnly
            className="border-0 bg-transparent w-[60px] text-center font-normal text-base py-3 text-boza-black"
          />
          <button
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="bg-transparent border-0 cursor-pointer text-base text-boza-black px-3 py-2 hover:bg-boza-cream-alt"
          >
            +
          </button>
        </div>
      </div>

      {error && <p className="text-boza-brown text-sm mb-4">{error}</p>}

      {/* CTA Buttons */}
      <div className="flex gap-4 mb-8 max-[991px]:flex-col">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 border border-boza-black bg-transparent text-boza-black font-semibold text-sm cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wide hover:bg-boza-cream-alt"
        >
          <i className="fas fa-shopping-cart"></i>
          {added ? "Ajouté !" : "Ajouter au panier"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={buying}
          className="flex-1 py-3 border border-boza-black bg-boza-black text-boza-cream font-semibold text-sm cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wide hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
        >
          <i className="fas fa-bolt"></i>
          {buying ? "..." : "Acheter"}
        </button>
      </div>
    </>
  );
}