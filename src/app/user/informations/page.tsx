import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountInfoOverview from "@/components/User/Account/AccountInfoOverview";

export default function UserAccountInfoPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <AccountInfoOverview />
      </Suspense>
      <Footer />
    </>
  );
}