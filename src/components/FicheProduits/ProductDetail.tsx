"use client";

import { useState } from "react";
import ProductGallery from "@/components/FicheProduits/ProductGallery";
import ProductOptions from "@/components/FicheProduits/ProductOptions";
import ProductFeatures from "@/components/FicheProduits/ProductFeatures";
import { ProductDetail as ProductDetailType } from "@/lib/products";

export default function ProductDetail({ product }: { product: ProductDetailType | null }) {
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0]?.name ?? "");

  if (!product) {
    return <div className="container mx-auto px-6 py-20 text-center">Produit introuvable.</div>;
  }

  return (
    <div className="container mx-auto px-6 pt-2 pb-4">
      <div className="grid grid-cols-1 min-[992px]:grid-cols-2 gap-8">
        <ProductGallery
          images={product.images}
          imageColorMap={product.imageColorMap}
          imagesByColor={product.imagesByColor}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />

        <div className="mr-[60px] pl-8 max-[991px]:mr-0 max-[991px]:pl-0 max-[991px]:mt-8">
          <h1 className="font-display uppercase text-[22px] font-black text-boza-black mb-1 leading-tight max-[576px]:text-[28px]">
            {product.name}
          </h1>

          <div className="mb-1">
            <div className="flex items-center gap-4 mb-1">
              <span className="text-2xl font-semibold text-boza-black max-[576px]:text-[2rem]">
                {product.price.toFixed(2).replace(".", ",")} €
              </span>
              {product.oldPrice && (
                <span className="text-xl text-boza-taupe line-through">
                  {product.oldPrice.toFixed(2).replace(".", ",")} €
                </span>
              )}
            </div>
            <p className="text-boza-taupe text-[13px]">
              TVA incluse · Livraison calculée à l&apos;étape suivante
            </p>
          </div>

          <p className="text-boza-black mt-4 mb-4">{product.description}</p>

          <hr className="border-boza-cream-alt" />

          <ProductOptions
            productId={product.id}
            productName={product.name}
            productPrice={product.price}
            productImage={product.images[0]}
            colors={product.colors}
            sizes={product.sizes}
            variants={product.variants}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          <ProductFeatures />
        </div>
      </div>
    </div>
  );
}