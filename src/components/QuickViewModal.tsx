"use client";

import { useEffect } from "react";
import ProductDetailModal from "@/components/FicheProduits/ProductDetailModal";

type QuickViewModalProps = {
  productId: string;
  onClose: () => void;
};

export default function QuickViewModal({ productId, onClose }: QuickViewModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
className="fixed left-0 right-0 bottom-0 top-[110px] z-[900] bg-black/60 flex items-center justify-center px-4 py-6 max-[640px]:top-[160px] max-[640px]:px-0 max-[640px]:py-0"
      onClick={onClose}
    >
      <div
        className="bg-boza-cream w-full max-w-[900px] max-h-[80vh] overflow-y-auto relative max-[640px]:max-h-full max-[640px]:h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
className="absolute top-3 right-3 z-10 w-8 h-8 bg-transparent text-boza-taupe border border-boza-black text-sm flex items-center justify-center transition-all duration-300 hover:text-boza-black"        >
          <i className="fas fa-times"></i>
        </button>

        <ProductDetailModal productId={productId} onClose={onClose} />
      </div>
    </div>
  );
}