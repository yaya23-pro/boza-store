"use client";

import { useEffect, useRef, useState } from "react";

type ProductGalleryModalProps = {
  images: string[];
  imageColorMap: Record<string, string>;
  imagesByColor: Record<string, string[]>;
  selectedColor: string;
  onColorChange: (color: string) => void;
};

export default function ProductGalleryModal({
  images,
  imageColorMap,
  imagesByColor,
  selectedColor,
  onColorChange,
}: ProductGalleryModalProps) {
  const [activeImage, setActiveImage] = useState(images[0]);
  const internalChange = useRef(false);

  useEffect(() => {
    if (internalChange.current) {
      internalChange.current = false;
      return;
    }
    const firstOfColor = imagesByColor[selectedColor]?.[0];
    if (firstOfColor) {
      setActiveImage(firstOfColor);
    }
  }, [selectedColor, imagesByColor]);

  const handleThumbnailClick = (img: string) => {
    setActiveImage(img);
    const colorOfImage = imageColorMap[img];
    if (colorOfImage && colorOfImage !== selectedColor) {
      internalChange.current = true;
      onColorChange(colorOfImage);
    }
  };

  return (
    <div className="grid grid-cols-[90px_1fr] gap-2 items-start max-[768px]:grid-cols-1">
      <div className="flex flex-col gap-2 max-[768px]:order-2 max-[768px]:flex-row max-[768px]:overflow-x-auto max-[768px]:mt-3 max-[768px]:pb-1">
        {images.map((img) => (
          <div
            key={img}
            onClick={() => handleThumbnailClick(img)}
            className={`bg-boza-cream-alt rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 shrink-0 w-[70px] h-[70px] max-[768px]:w-14 max-[768px]:h-14 ${
              activeImage === img ? "border-boza-brown" : "border-transparent"
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="bg-boza-cream-alt overflow-hidden aspect-[3/4] max-h-[55vh] group max-[768px]:order-1 max-[768px]:w-full max-[768px]:max-h-[40vh]">
        <img
          src={activeImage}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>
    </div>
  );
}