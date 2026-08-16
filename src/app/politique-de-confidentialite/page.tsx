import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    id: "donnees-collectees",
    title: "1. Données que nous collectons",
    intro: "Lorsque tu utilises notre site ou passes une commande, nous pouvons collecter les informations suivantes :",
    items: [
      "Nom, prénom, adresse e-mail, numéro de téléphone",
      "Adresse de livraison et de facturation",
      "Informations de paiement (traitées de façon sécurisée par notre prestataire de paiement, jamais stockées directement par nos soins)",
      "Historique de commandes et préférences d'achat",
      "Données de navigation (pages visitées, appareil utilisé, adresse IP)",
    ],
  },
  {
    id: "utilisation",
    title: "2. Comment nous utilisons tes données",
    intro: "Tes données nous servent à :",
    items: [
      "Traiter et livrer tes commandes",
      "Te contacter concernant ta commande ou une demande de support",
      "Améliorer notre site et l'expérience d'achat",
      "T'envoyer des offres ou nouveautés, uniquement si tu y as consenti",
      "Prévenir la fraude et assurer la sécurité de nos services",
    ],
  },
  {
    id: "cookies",
    title: "3. Cookies et technologies similaires",
    paragraphs: [
      "Notre site utilise des cookies pour mémoriser ton panier, tes préférences de navigation, et analyser l'usage du site afin de l'améliorer. Tu peux à tout moment gérer ou désactiver les cookies depuis les paramètres de ton navigateur.",
    ],
  },
  {
    id: "partage",
    title: "4. Partage de tes données",
    intro: "Nous ne vendons jamais tes données personnelles. Elles peuvent être partagées uniquement avec :",
    items: [
      "Nos prestataires de livraison, pour acheminer ta commande",
      "Notre prestataire de paiement, pour traiter la transaction en toute sécurité",
      "Les autorités compétentes, si la loi l'exige",
    ],
  },
  {
    id: "securite",
    title: "5. Sécurité de tes données",
    paragraphs: [
      "Nous mettons en place des mesures techniques et organisationnelles raisonnables pour protéger tes données contre l'accès non autorisé, la perte ou la divulgation. Cependant, aucune méthode de transmission sur internet n'est totalement sécurisée à 100%.",
    ],
  },
  {
    id: "conservation",
    title: "6. Durée de conservation",
    paragraphs: [
      "Nous conservons tes données personnelles aussi longtemps que nécessaire pour les finalités décrites dans cette politique, ou pour respecter nos obligations légales et comptables.",
    ],
  },
  {
    id: "droits",
    title: "7. Tes droits",
    intro: "Tu disposes des droits suivants concernant tes données personnelles :",
    items: [
      "Droit d'accès à tes données",
      "Droit de rectification en cas d'information inexacte",
      "Droit de suppression de tes données",
      "Droit de retirer ton consentement à tout moment (par exemple pour la newsletter)",
    ],
    outro: "Pour exercer l'un de ces droits, contacte-nous via les coordonnées ci-dessous.",
  },
  {
    id: "modifications",
    title: "8. Modifications de cette politique",
    paragraphs: [
      "Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Toute modification importante te sera communiquée via notre site ou par e-mail.",
    ],
  },
];

const tocItems = [
  { href: "#donnees-collectees", label: "Données que nous collectons" },
  { href: "#utilisation", label: "Comment nous utilisons tes données" },
  { href: "#cookies", label: "Cookies et technologies similaires" },
  { href: "#partage", label: "Partage de tes données" },
  { href: "#securite", label: "Sécurité de tes données" },
  { href: "#conservation", label: "Durée de conservation" },
  { href: "#droits", label: "Tes droits" },
  { href: "#modifications", label: "Modifications de cette politique" },
  { href: "#contact", label: "Nous contacter" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <div className="max-w-[780px] mx-auto px-6 pt-[20px] pb-[60px] max-[640px]:pt-10 max-[640px]:pb-16">
        <h1 className="font-display text-[34px] font-black mb-2.5 max-[640px]:text-[26px]">
          Politique de confidentialité
        </h1>
        <p className="text-boza-taupe text-[13px] mb-10">Dernière mise à jour : 3 juillet 2026</p>

        <p className="text-[15px] leading-[1.8] text-boza-black mb-10 pb-10 border-b border-boza-cream-alt">
          Chez BOZA, on prend la protection de tes données personnelles au sérieux. Cette politique explique
          quelles informations on collecte, pourquoi, comment on les utilise, et quels sont tes droits. En
          utilisant notre site, tu acceptes les pratiques décrites ici.
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

        {sections.map((section) => (
          <div key={section.id} id={section.id} className="mb-11 scroll-mt-6">
            <h2 className="font-display text-xl font-black mb-4">{section.title}</h2>

            {section.intro && <p className="text-[15px] leading-[1.8] text-boza-black mb-3.5">{section.intro}</p>}

            {section.items && (
              <ul className="pl-5 mb-3.5 list-disc">
                {section.items.map((item, i) => (
                  <li key={i} className="text-[15px] leading-[1.8] text-boza-black mb-1.5">
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {section.outro && <p className="text-[15px] leading-[1.8] text-boza-black">{section.outro}</p>}

            {section.paragraphs?.map((p, i) => (
              <p key={i} className="text-[15px] leading-[1.8] text-boza-black">
                {p}
              </p>
            ))}
          </div>
        ))}

        <div id="contact" className="mb-11 scroll-mt-6">
          <h2 className="font-display text-xl font-black mb-4">9. Nous contacter</h2>
          <div className="bg-boza-cream-alt p-6 text-sm leading-[1.8]">
            <strong className="block mb-2">BOZA</strong>
            E-mail : contact@boza-store.com
            <br />
            Adresse : Salé, Maroc
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}