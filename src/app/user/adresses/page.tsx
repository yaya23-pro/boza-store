import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddressesOverview from "@/components/User/Address/AddressesOverview";

export default function UserAddressesPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <AddressesOverview />
      </Suspense>
      <Footer />
    </>
  );
}