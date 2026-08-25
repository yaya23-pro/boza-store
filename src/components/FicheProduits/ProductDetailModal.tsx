"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductGalleryModal from "@/components/FicheProduits/ProductGalleryModal";
import ProductOptions from "@/components/FicheProduits/ProductOptions";
import { getProductDetailFromSupabase, ProductDetail as ProductDetailType } from "@/lib/products";

type ProductDetailModalProps = {
  productId: string;
  onClose?: () => void;
};

export default function ProductDetailModal({ productId, onClose }: ProductDetailModalProps) {
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
    return <div className="px-6 py-16 text-center text-boza-taupe">Chargement...</div>;
  }

  if (!productDetail) {
    return <div className="px-6 py-16 text-center">Produit introuvable.</div>;
  }

  return (
    <div className="px-6 py-8 max-[640px]:px-4 max-[640px]:py-6">
      <div className="grid grid-cols-1 min-[768px]:grid-cols-2 gap-1">
        <ProductGalleryModal
          images={productDetail.images}
          imageColorMap={productDetail.imageColorMap}
          imagesByColor={productDetail.imagesByColor}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />

        <div className="max-[768px]:mt-4">
          <h1 className="font-display uppercase text-[20px] font-black text-boza-black mb-1 leading-tight">
            {productDetail.name}
          </h1>

          <div className="mb-1">
            <div className="flex items-center gap-4 mb-1">
              <span className="text-xl font-semibold text-boza-black">
                {productDetail.price.toFixed(2).replace(".", ",")} €
              </span>
              {productDetail.oldPrice && (
                <span className="text-base text-boza-taupe line-through">
                  {productDetail.oldPrice.toFixed(2).replace(".", ",")} €
                </span>
              )}
            </div>
            <p className="text-boza-taupe text-[13px]">
              TVA incluse · Livraison calculée à l&apos;étape suivante
            </p>
          </div>

          <p className="text-boza-black text-sm mt-4 mb-4">{productDetail.description}</p>

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

          <Link
            href={`/produit/${productDetail.slug}`}
            onClick={() => onClose?.()}
            className="text-boza-taupe text-xs font-semibold tracking-wide bg-transparent cursor-pointer transition-all duration-300 flex items-center gap-2 w-fit"
          >
            Voir la fiche complète
            <i className="fas fa-arrow-right text-[10px]"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}