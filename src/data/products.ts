export type Product = {
  id: string;
  name: string;
  category: "T-Shirts" | "Hoodies" | "SweatShirt" | "Jogging" | "Kepi" | "Bonnet";
  image: string;
  price: number;
  oldPrice?: number;
};

export const products: Product[] = [
  { id: "1", name: "Chemise Blanche Premium", category: "T-Shirts", image: "/image/BOZA1.png", price: 89, oldPrice: 129 },
  { id: "2", name: "T-Shirt Noir Basic", category: "T-Shirts", image: "/image/BOZA2.png", price: 35, oldPrice: 50 },
  { id: "3", name: "Pantalon Chino Beige", category: "T-Shirts", image: "/image/BOZA3.png", price: 79 },
  { id: "4", name: "Veste en Jean Classic", category: "T-Shirts", image: "/image/BOZA4.png", price: 119 },
  { id: "5", name: "Chemise Blanche Premium", category: "T-Shirts", image: "/image/BOZA5.png", price: 89, oldPrice: 129 },

  { id: "6", name: "Pull Col Roulé Noir", category: "Hoodies", image: "/image/BOZAP1.jpg", price: 59, oldPrice: 79 },
  { id: "7", name: "Costume Gris Élégant", category: "Hoodies", image: "/image/BOZAP2.jpg", price: 299 },
  { id: "8", name: "Polo Blanc Luxe", category: "Hoodies", image: "/image/BOZAP3.jpg", price: 65 },
  { id: "9", name: "Sneakers Blanches", category: "Hoodies", image: "/image/BOZAP4.jpg", price: 89, oldPrice: 149 },
  { id: "10", name: "Pantalon Chino Beige", category: "Hoodies", image: "/image/BOZAP5.jpg", price: 79 },

  { id: "11", name: "Sneakers Blanches", category: "SweatShirt", image: "/image/sweatshirt1.png", price: 89, oldPrice: 149 },
  { id: "12", name: "T-Shirt Noir Basic", category: "SweatShirt", image: "/image/sweatshirt2.png", price: 35, oldPrice: 50 },
  { id: "13", name: "Sneakers Blanches", category: "SweatShirt", image: "/image/sweatshirt3.png", price: 89, oldPrice: 149 },
  { id: "14", name: "Sneakers Blanches", category: "SweatShirt", image: "/image/sweatshirt4.png", price: 89, oldPrice: 149 },
  { id: "15", name: "T-Shirt Noir Basic", category: "SweatShirt", image: "/image/sweatshirt5.png", price: 35, oldPrice: 50 },

  { id: "16", name: "Sneakers Blanches", category: "Bonnet", image: "/image/Bonnet1.png", price: 89, oldPrice: 149 },
  { id: "17", name: "Sneakers Blanches", category: "Bonnet", image: "/image/Bonnet2.png", price: 89, oldPrice: 149 },
  { id: "18", name: "Sneakers Blanches", category: "Bonnet", image: "/image/Bonnet3.png", price: 89, oldPrice: 149 },
  { id: "19", name: "Veste en Jean Classic", category: "Bonnet", image: "/image/Bonnet5.png", price: 119 },

  { id: "20", name: "Veste en Jean Classic", category: "Kepi", image: "/image/Kepi1.png", price: 119 },

  // TODO: confirmer la vraie catégorie de ces 2 produits
  { id: "21", name: "Veste en Jean Classic", category: "T-Shirts", image: "/image/debardeurComplet1.png", price: 119 },
  { id: "22", name: "Veste en Jean Classic", category: "Jogging", image: "/image/Completculotte1.png", price: 119 },

  { id: "23", name: "Veste en Jean Classic", category: "Jogging", image: "/image/Completpantalon1.png", price: 119 },
];


export type ProductColor = {
  name: string;
  hex: string;
};
export function getProductDetail(id: string) {
  const product = products.find((p) => p.id === id);
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    oldPrice: product.oldPrice,
    description:
      "T-shirt à manches courtes, col rond et coupe décontractée. Confectionné dans un tissu épais 100 % coton offrant un toucher doux, une excellente tenue et un confort durable.",
    images: [product.image],
    colors: [
      { name: "Crème", hex: "#F7F5F0" },
      { name: "Noir", hex: "#0D0D0D" },
      { name: "Brun", hex: "#6B4226" },
      { name: "Taupe", hex: "#8C857D" },
      { name: "Beige", hex: "#E9E6E0" },
    ] as ProductColor[],
    sizes: [
      { label: "XS", available: false },
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "XXL", available: true },
    ],
  };
}