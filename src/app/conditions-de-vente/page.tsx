import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    id: "objet",
    title: "1. Objet",
    paragraphs: [
      "Les présentes CGV définissent les droits et obligations de BOZA et de ses clients dans le cadre de la vente de vêtements et accessoires proposés sur notre site.",
    ],
  },
  {
    id: "produits",
    title: "2. Produits et disponibilité",
    paragraphs: [
      "Nos produits sont proposés dans la limite des stocks disponibles. En cas d'indisponibilité après passation de commande, nous t'en informerons dans les meilleurs délais et procéderons, selon le cas, au remboursement ou au remplacement de l'article concerné.",
      "Les photos et descriptions des produits sont fournies à titre indicatif. De légères variations (couleur, texture) peuvent exister, notamment liées à l'affichage sur ton écran.",
    ],
  },
  {
    id: "prix",
    title: "3. Prix",
    paragraphs: [
      "Les prix sont indiqués en euros (€), toutes taxes comprises. BOZA se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est celui en vigueur au moment de la validation de la commande.",
      "Les frais de livraison sont indiqués avant la validation finale de la commande et s'ajoutent au prix des produits.",
    ],
  },
  {
    id: "commande",
    title: "4. Commande",
    paragraphs: [
      "Toute commande passée sur le site implique l'acceptation pleine et entière des présentes CGV. Une confirmation de commande te sera envoyée par e-mail après validation du paiement.",
      "BOZA se réserve le droit d'annuler ou de refuser toute commande en cas de litige existant, de non-paiement, ou de suspicion de fraude.",
    ],
  },
  {
    id: "paiement",
    title: "5. Paiement",
    paragraphs: [
      "Le paiement s'effectue en ligne au moment de la commande, par carte bancaire ou tout autre moyen de paiement proposé sur le site. Les transactions sont sécurisées et chiffrées via notre prestataire de paiement.",
      "La commande n'est considérée comme définitive qu'à réception de la confirmation du paiement.",
    ],
  },
  {
    id: "livraison",
    title: "6. Livraison",
    paragraphs: [
      "Les délais de livraison sont indiqués à titre indicatif au moment de la commande et peuvent varier selon la destination. BOZA ne saurait être tenue responsable des retards liés au transporteur ou à des cas de force majeure.",
      "Il t'appartient de vérifier l'état du colis à réception et de signaler toute anomalie dans les meilleurs délais.",
    ],
  },
  {
    id: "retractation",
    title: "7. Droit de rétractation",
    paragraphs: [
      "Tu disposes d'un délai de 14 jours à compter de la réception de ta commande pour exercer ton droit de rétractation, sans avoir à justifier de motif. L'article doit être retourné non porté, non lavé, avec son étiquette d'origine.",
      "Les frais de retour restent à ta charge, sauf en cas d'article défectueux ou d'erreur de notre part.",
    ],
  },
  {
    id: "retours",
    title: "8. Retours et échanges",
    paragraphs: [
      "Tu disposes de 30 jours après réception pour retourner ou échanger un article, sous réserve qu'il soit dans son état d'origine. Le remboursement est effectué sous 5 à 7 jours ouvrés après réception et vérification du retour, sur le moyen de paiement utilisé lors de l'achat.",
    ],
  },
  {
    id: "garanties",
    title: "9. Garanties",
    paragraphs: [
      "Nos produits bénéficient des garanties légales de conformité et des vices cachés prévues par la réglementation en vigueur. En cas de défaut avéré, contacte-nous pour organiser un échange, une réparation, ou un remboursement.",
    ],
  },
  {
    id: "responsabilite",
    title: "10. Responsabilité",
    paragraphs: [
      "BOZA ne saurait être tenue responsable des dommages indirects résultant de l'utilisation du site ou des produits achetés, ni des interruptions temporaires du site liées à la maintenance ou à des causes techniques indépendantes de notre volonté.",
    ],
  },
  {
    id: "propriete",
    title: "11. Propriété intellectuelle",
    paragraphs: [
      "L'ensemble des éléments du site (logo, textes, visuels, designs) est la propriété exclusive de BOZA. Toute reproduction ou utilisation non autorisée est interdite.",
    ],
  },
  {
    id: "droit-applicable",
    title: "12. Droit applicable",
    paragraphs: [
      "Les présentes CGV sont soumises au droit marocain. En cas de litige, une solution amiable sera recherchée en priorité avant toute action judiciaire.",
    ],
  },
];

const tocItems = [
  { href: "#objet", label: "Objet" },
  { href: "#produits", label: "Produits et disponibilité" },
  { href: "#prix", label: "Prix" },
  { href: "#commande", label: "Commande" },
  { href: "#paiement", label: "Paiement" },
  { href: "#livraison", label: "Livraison" },
  { href: "#retractation", label: "Droit de rétractation" },
  { href: "#retours", label: "Retours et échanges" },
  { href: "#garanties", label: "Garanties" },
  { href: "#responsabilite", label: "Responsabilité" },
  { href: "#propriete", label: "Propriété intellectuelle" },
  { href: "#droit-applicable", label: "Droit applicable" },
  { href: "#contact", label: "Nous contacter" },
];

export default function TermsOfSalePage() {
  return (
    <>
      <Header />

      <div className="max-w-[780px] mx-auto px-6 pt-[60px] pb-[30px] max-[640px]:pt-10 max-[640px]:pb-5">
        <h1 className="font-display text-[34px] font-black mb-2.5 max-[640px]:text-[26px]">
          Conditions générales de vente
        </h1>
        <p className="text-boza-taupe text-[13px] mb-10">Dernière mise à jour : 3 juillet 2026</p>

        <p className="text-[15px] leading-[1.8] text-boza-black mb-10 pb-10 border-b border-boza-cream-alt">
          Les présentes conditions générales de vente (CGV) régissent les ventes effectuées sur le site BOZA. En
          passant commande, tu acceptes sans réserve l&apos;ensemble des dispositions décrites ci-dessous.
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
            {section.paragraphs.map((p, i) => (
              <p key={i} className="text-[15px] leading-[1.8] text-boza-black mb-3.5 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        ))}

        <div id="contact" className="mb-11 scroll-mt-6">
          <h2 className="font-display text-xl font-black mb-4">13. Nous contacter</h2>
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