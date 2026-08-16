"use client";

import { useEffect, useState } from "react";
import ProductGallery from "@/components/FicheProduits/ProductGallery";
import ProductOptions from "@/components/FicheProduits/ProductOptions";
import ProductFeatures from "@/components/FicheProduits/ProductFeatures";
import { getProductDetailFromSupabase, ProductDetail as ProductDetailType } from "@/lib/products";

export default function ProductDetail({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(true);
  const [productDetail, setProductDetail] = useState<ProductDetailType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    async function load() {
      const detail = await getProductDetailFromSupabase(productId);
      setProductDetail(detail);
      if (detail && detail.colors.length > 0) {
        setSelectedColor(detail.colors[0].name);
      }
      setLoading(false);
    }
    load();
  }, [productId]);

  if (loading) {
    return <div className="container mx-auto px-6 py-20 text-center text-boza-taupe">Chargement...</div>;
  }

  if (!productDetail) {
    return <div className="container mx-auto px-6 py-20 text-center">Produit introuvable.</div>;
  }

  return (
    <div className="container mx-auto px-6 pt-2 pb-4">
      <div className="grid grid-cols-1 min-[992px]:grid-cols-2 gap-8">
        <ProductGallery
          images={productDetail.images}
          imageColorMap={productDetail.imageColorMap}
          imagesByColor={productDetail.imagesByColor}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />

        <div className="mr-[60px] pl-8 max-[991px]:mr-0 max-[991px]:pl-0 max-[991px]:mt-8">
          <h1 className="font-display uppercase text-[22px] font-black text-boza-black mb-1 leading-tight max-[576px]:text-[28px]">
            {productDetail.name}
          </h1>

          <div className="mb-1">
            <div className="flex items-center gap-4 mb-1">
              <span className="text-2xl font-semibold text-boza-black max-[576px]:text-[2rem]">
                {productDetail.price.toFixed(2).replace(".", ",")} €
              </span>
              {productDetail.oldPrice && (
                <span className="text-xl text-boza-taupe line-through">
                  {productDetail.oldPrice.toFixed(2).replace(".", ",")} €
                </span>
              )}
            </div>
            <p className="text-boza-taupe text-[13px]">
              TVA incluse · Livraison calculée à l&apos;étape suivante
            </p>
          </div>

          <p className="text-boza-black mt-4 mb-4">{productDetail.description}</p>

          <hr className="border-boza-cream-alt" />

          <ProductOptions
            productId={productDetail.id}
            productName={productDetail.name}
            productPrice={productDetail.price}
            productImage={productDetail.images[0]}
            colors={productDetail.colors}
            sizes={productDetail.sizes}
            variants={productDetail.variants}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          <ProductFeatures />
        </div>
      </div>
    </div>
  );
}