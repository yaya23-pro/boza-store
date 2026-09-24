import AuthHeader from "@/components/Auth/AuthHeader";

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center py-[50px] px-6">
        <div className="w-full max-w-[420px] text-center">
          <h1 className="font-display text-2xl font-black mb-2">Lien invalide ou expiré</h1>
          <p className="text-boza-taupe text-sm mb-6">
            Le lien que tu as utilisé n&apos;est plus valable. Redemande un nouveau lien depuis la page de
            connexion.
          </p>
          <a
            href="/connexion"
            className="inline-block py-3.5 px-8 bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide no-underline transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown"
          >
            Retour à la connexion
          </a>
        </div>
      </main>
    </div>
  );
}