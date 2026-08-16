import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WishlistOverview from "@/components/User/Wishlist/WishlistOverview";

export default function UserWishlistPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <WishlistOverview />
      </Suspense>
      <Footer />
    </>
  );
}