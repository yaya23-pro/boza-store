import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de cookies - BOZA",
  description: "Découvre quels cookies BOZA utilise sur son site et comment gérer tes préférences de navigation.",
};
const tocItems = [
  { href: "#definition", label: "Qu'est-ce qu'un cookie ?" },
  { href: "#types", label: "Les types de cookies que nous utilisons" },
  { href: "#tiers", label: "Cookies tiers" },
  { href: "#consentement", label: "Ton consentement" },
  { href: "#gestion", label: "Comment gérer tes cookies" },
  { href: "#contact", label: "Nous contacter" },
];

export default function CookiePolicyPage() {
  return (
    <>
      <Header />

      <div className="max-w-[780px] mx-auto px-6 pt-[60px] pb-[90px] max-[640px]:pt-10 max-[640px]:pb-16">
        <h1 className="font-display text-[34px] font-black mb-2.5 max-[640px]:text-[26px]">
          Politique de cookies
        </h1>
        <p className="text-boza-taupe text-[13px] mb-10">Dernière mise à jour : 3 juillet 2026</p>

        <p className="text-[15px] leading-[1.8] text-boza-black mb-10 pb-10 border-b border-boza-cream-alt">
          Cette politique explique ce qu&apos;est un cookie, quels types de cookies nous utilisons sur le site
          BOZA, et comment tu peux gérer tes préférences à ce sujet.
        </p>

        <div className="bg-boza-cream-alt p-6 mb-[50px]">
          <div className="text-[13px] font-bold uppercase tracking-wide mb-3.5">Sommaire</div>
          <ol className="pl-5 text-boza-black list-decimal">
            {tocItems.map((item) => (
              <li key={item.href} className="mb-2 text-sm">
                <a href={item.href} className="text-boza-black no-underline hover:text-boza-brown hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div id="definition" className="mb-11 scroll-mt-6">
          <h2 className="font-display text-xl font-black mb-4">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
          <p className="text-[15px] leading-[1.8] text-boza-black">
            Un cookie est un petit fichier texte déposé sur ton appareil (ordinateur, smartphone, tablette)
            lorsque tu visites un site internet. Il permet au site de mémoriser des informations sur ta visite,
            comme tes préférences de navigation ou le contenu de ton panier.
          </p>
        </div>

        <div id="types" className="mb-11 scroll-mt-6">
          <h2 className="font-display text-xl font-black mb-4">2. Les types de cookies que nous utilisons</h2>
          <p className="text-[15px] leading-[1.8] text-boza-black mb-3.5">
            Notre site utilise plusieurs catégories de cookies :
          </p>
          <ul className="pl-5 list-disc">
            <li className="text-[15px] leading-[1.8] text-boza-black mb-1.5">
              <strong>Cookies essentiels</strong> — nécessaires au bon fonctionnement du site (panier, connexion
              à ton compte, sécurité). Ils ne peuvent pas être désactivés.
            </li>
            <li className="text-[15px] leading-[1.8] text-boza-black mb-1.5">
              <strong>Cookies de performance</strong> — nous aident à comprendre comment les visiteurs utilisent
              le site, afin de l&apos;améliorer.
            </li>
            <li className="text-[15px] leading-[1.8] text-boza-black mb-1.5">
              <strong>Cookies de préférence</strong> — mémorisent tes choix (langue, devise) pour t&apos;offrir
              une expérience personnalisée.
            </li>
            <li className="text-[15px] leading-[1.8] text-boza-black mb-1.5">
              <strong>Cookies marketing</strong> — utilisés pour te proposer des publicités ou offres
              pertinentes, sur notre site ou ailleurs.
            </li>
          </ul>
        </div>

        <div id="tiers" className="mb-11 scroll-mt-6">
          <h2 className="font-display text-xl font-black mb-4">3. Cookies tiers</h2>
          <p className="text-[15px] leading-[1.8] text-boza-black">
            Certains cookies proviennent de services tiers que nous utilisons (outils d&apos;analyse
            d&apos;audience, réseaux sociaux, prestataires de paiement). Ces tiers peuvent également déposer
            leurs propres cookies conformément à leurs propres politiques.
          </p>
        </div>

        <div id="consentement" className="mb-11 scroll-mt-6">
          <h2 className="font-display text-xl font-black mb-4">4. Ton consentement</h2>
          <p className="text-[15px] leading-[1.8] text-boza-black">
            Lors de ta première visite sur notre site, un bandeau te permet d&apos;accepter ou de refuser les
            cookies non essentiels. Tu peux modifier ton choix à tout moment via les préférences de cookies
            accessibles en bas de page.
          </p>
        </div>

        <div id="gestion" className="mb-11 scroll-mt-6">
          <h2 className="font-display text-xl font-black mb-4">5. Comment gérer tes cookies</h2>
          <p className="text-[15px] leading-[1.8] text-boza-black">
            En plus des préférences disponibles sur notre site, tu peux gérer ou bloquer les cookies directement
            depuis les paramètres de ton navigateur. Attention : désactiver certains cookies essentiels peut
            affecter le bon fonctionnement du site (panier, connexion, etc.).
          </p>
        </div>

        <div id="contact" className="mb-11 scroll-mt-6">
          <h2 className="font-display text-xl font-black mb-4">6. Nous contacter</h2>
          <div className="bg-boza-cream-alt p-6 text-sm leading-[1.8]">
            <strong className="block mb-2">BOZA</strong>
            E-mail : contact@boza-store.com
            <br />
            Adresse : salé, Maroc
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}