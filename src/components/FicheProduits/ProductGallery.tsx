"use client";

import { useEffect, useRef, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  imageColorMap: Record<string, string>;
  imagesByColor: Record<string, string[]>;
  selectedColor: string;
  onColorChange: (color: string) => void;
};

export default function ProductGallery({
  images,
  imageColorMap,
  imagesByColor,
  selectedColor,
  onColorChange,
}: ProductGalleryProps) {
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
    <div className="sticky top-2.5 grid grid-cols-[80px_1fr] gap-4 items-start ml-[100px] max-[991px]:static max-[991px]:max-w-full max-[991px]:ml-0 max-[991px]:grid-cols-1">
      <div className="ml-5 flex flex-col gap-2.5 max-[991px]:order-2 max-[991px]:flex-row max-[991px]:overflow-x-auto max-[991px]:ml-0 max-[991px]:mt-3 max-[991px]:pb-1">
        {images.map((img) => (
          <div
            key={img}
            onClick={() => handleThumbnailClick(img)}
            className={`bg-boza-cream-alt rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 max-[991px]:w-16 max-[991px]:h-16 max-[991px]:shrink-0 ${
              activeImage === img ? "border-boza-brown" : "border-transparent"
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="bg-boza-cream-alt overflow-hidden mb-4 aspect-[3/4] h-[90vh] group max-[991px]:order-1 max-[991px]:w-full max-[991px]:h-[60vh] max-[576px]:h-[45vh]">
        <img
          src={activeImage}
          alt="T-Shirt BOZA"
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>
    </div>
  );
}