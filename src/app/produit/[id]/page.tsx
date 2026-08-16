import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/FicheProduits/ProductDetail";

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: produits } = await supabase.from("produits").select("id");

  return (produits ?? []).map((produit) => ({
    id: produit.id.toString(),
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <ProductDetail productId={id} />
      <Footer />
    </>
  );
}