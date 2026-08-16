import { Suspense } from "react";
import AuthHeader from "@/components/Auth/AuthHeader";
import AuthContent from "@/components/Auth/AuthContent";

export default function ConnexionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Chargement...</div>}>
        <AuthContent />
      </Suspense>
    </div>
  );
}