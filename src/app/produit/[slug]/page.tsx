import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/FicheProduits/ProductDetail";
import { getProductDetailFromSupabase } from "@/lib/products";

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: produits } = await supabase.from("produits").select("slug");

  return (produits ?? []).map((produit) => ({
    slug: produit.slug.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetailFromSupabase(slug);

  if (!product) {
    return { title: "Produit introuvable - BOZA" };
  }

  const title = `${product.name} - BOZA`;
  const description = product.description || `Découvrez ${product.name} sur BOZA, boutique streetwear premium.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductDetailFromSupabase(slug);

  return (
    <>
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </>
  );
}