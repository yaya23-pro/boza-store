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

const FALLBACK_HEX = "#CCCCCC";

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
        couleur_hex,
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
      couleur_hex: string | null;
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

  // Construit la liste des couleurs à partir du hex stocké en base (plus de mapping codé en dur)
  const colorMap = new Map<string, string>();
  for (const v of variantes) {
    if (!v.couleur) continue;
    if (!colorMap.has(v.couleur)) {
      if (!v.couleur_hex) {
        console.warn(`Couleur "${v.couleur}" sans couleur_hex renseignée en base — fallback gris utilisé`);
      }
      colorMap.set(v.couleur, v.couleur_hex ?? FALLBACK_HEX);
    }
  }
  const colors: ProductColor[] = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));

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
    colors: colors.length > 0 ? colors : [{ name: "Standard", hex: FALLBACK_HEX }],
    sizes: sizes.length > 0 ? sizes : [{ label: "Unique", available: true }],
    variants,
  };
}