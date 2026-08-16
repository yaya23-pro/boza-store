import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardOverview from "@/components/User/Dashboard/DashboardOverview";

export default function UserDashboardPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <DashboardOverview />
      </Suspense>
      <Footer />
    </>
  );
}