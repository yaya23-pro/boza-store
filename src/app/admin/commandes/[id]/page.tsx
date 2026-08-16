import AdminHeader from "@/components/Admin/AdminHeader";
import Footer from "@/components/Footer";
import CommandeDetailContent from "@/components/Admin/CommandeDetailContent";

export default async function CommandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <AdminHeader />
      <CommandeDetailContent commandeId={id} />
      <Footer />
    </>
  );
}