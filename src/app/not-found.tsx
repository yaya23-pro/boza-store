import Link from "next/link";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <header className="bg-boza-cream border-b border-boza-cream-alt py-[18px] px-10 flex items-center justify-center">
        <Link
          href="/"
          className="font-display text-2xl font-black text-boza-black no-underline tracking-[-0.5px]"
        >
          BOZA
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-[60px]">
        <div className="text-center max-w-[460px]">
          <div className="font-display text-[110px] font-black text-boza-black leading-none mb-2 max-[640px]:text-[72px]">
            4<span className="text-boza-brown">0</span>4
          </div>
          <h1 className="font-display text-xl font-black mb-3">Cette page n&apos;existe pas</h1>
          <p className="text-boza-taupe text-[15px] leading-[1.6] mb-8">
            La page que tu cherches a peut-être été déplacée, supprimée, ou n&apos;a jamais existé. Retourne à
            l&apos;accueil ou continue ton shopping.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/"
              className="py-3.5 px-7 border border-boza-black bg-boza-black text-boza-cream font-body text-sm font-bold uppercase tracking-wide no-underline transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/catalogue"
              className="py-3.5 px-7 border border-boza-black bg-boza-cream text-boza-black font-body text-sm font-bold uppercase tracking-wide no-underline transition-all duration-300 hover:bg-boza-cream-alt"
            >
              Voir les produits
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}