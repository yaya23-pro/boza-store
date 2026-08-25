import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/FicheProduits/ProductDetail";

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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <Header />
      <ProductDetail productId={slug} />
      <Footer />
    </>
  );
}