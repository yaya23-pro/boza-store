import { createClient } from "@/lib/supabase";

export type ProductColor = { name: string; hex: string };
export type ProductSize = { label: string; available: boolean };
export type ProductVariant = { id: string; size: string; color: string; stock: number };

export type ProductDetail = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  images: string[];
  imagesByColor: Record<string, string[]>;
  imageColorMap: Record<string, string>;
  colors: ProductColor[];
  sizes: ProductSize[];
  variants: ProductVariant[];
};

const COLOR_HEX_MAP: Record<string, string> = {
  Crème: "#F7F5F0",
  Noir: "#0D0D0D",
  Brun: "#6B4226",
  Taupe: "#8C857D",
  Beige: "#E9E6E0",
  Blanc: "#FFFFFF",
  Gris: "#8C857D",
};

function colorToHex(name: string): string {
  return COLOR_HEX_MAP[name] ?? "#CCCCCC";
}

export async function getProductDetailFromSupabase(id: string): Promise<ProductDetail | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("produits")
    .select(
      `
      id,
      nom_produit,
      desc_produit,
      variantes (
        id,
        taille,
        couleur,
        prix,
        quantite,
        images ( url_image, ordre )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Erreur chargement produit :", error);
    return null;
  }

  const variantes =
    (data.variantes as {
      id: string;
      taille: string | null;
      couleur: string | null;
      prix: number;
      quantite: number;
      images: { url_image: string; ordre: number }[];
    }[]) ?? [];

  const prix = variantes.length > 0 ? Math.min(...variantes.map((v) => v.prix)) : 0;

  const allImages = variantes
    .flatMap((v) => v.images ?? [])
    .sort((a, b) => a.ordre - b.ordre)
    .map((img) => img.url_image);
  const images = Array.from(new Set(allImages));

  // Regroupe les images par couleur + associe chaque image à sa couleur
  const imagesByColor: Record<string, string[]> = {};
  const imageColorMap: Record<string, string> = {};

  for (const v of variantes) {
    if (!v.couleur) continue;
    const sortedImgs = (v.images ?? [])
      .sort((a, b) => a.ordre - b.ordre)
      .map((img) => img.url_image);

    if (!imagesByColor[v.couleur]) imagesByColor[v.couleur] = [];
    for (const img of sortedImgs) {
      if (!imagesByColor[v.couleur].includes(img)) {
        imagesByColor[v.couleur].push(img);
      }
      if (!imageColorMap[img]) {
        imageColorMap[img] = v.couleur;
      }
    }
  }

  const uniqueColors = Array.from(new Set(variantes.map((v) => v.couleur).filter((c): c is string => !!c)));
  const colors: ProductColor[] = uniqueColors.map((name) => ({ name, hex: colorToHex(name) }));

  const uniqueSizes = Array.from(new Set(variantes.map((v) => v.taille).filter((t): t is string => !!t)));
  const sizes: ProductSize[] = uniqueSizes.map((label) => ({
    label,
    available: variantes.some((v) => v.taille === label && v.quantite > 0),
  }));

  const variants: ProductVariant[] = variantes.map((v) => ({
    id: v.id,
    size: v.taille ?? "",
    color: v.couleur ?? "",
    stock: v.quantite,
  }));

  return {
    id: data.id,
    name: data.nom_produit,
    price: prix,
    description: data.desc_produit ?? "",
    images: images.length > 0 ? images : ["/image/placeholder.png"],
    imagesByColor,
    imageColorMap,
    colors: colors.length > 0 ? colors : [{ name: "Standard", hex: "#CCCCCC" }],
    sizes: sizes.length > 0 ? sizes : [{ label: "Unique", available: true }],
    variants,
  };
}