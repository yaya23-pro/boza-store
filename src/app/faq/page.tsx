import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";

type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    id: "commande-suivi",
    category: "Commandes",
    question: "Comment suivre ma commande ?",
    answer:
      "Dès que ta commande est expédiée, tu reçois un e-mail avec un lien de suivi. Tu peux aussi retrouver le statut de ta commande directement depuis ton compte.",
  },
  {
    id: "commande-annuler",
    category: "Commandes",
    question: "Puis-je modifier ou annuler ma commande ?",
    answer:
      "Tu peux modifier ou annuler ta commande dans les 2 heures suivant l'achat en nous contactant directement. Passé ce délai, la commande est déjà en préparation.",
  },
  {
    id: "livraison-delais",
    category: "Livraison",
    question: "Quels sont les délais de livraison ?",
    answer:
      "Comptez entre 3 et 5 jours ouvrés pour le Maroc, et 7 à 12 jours ouvrés pour l'international, selon la destination.",
  },
  {
    id: "livraison-international",
    category: "Livraison",
    question: "Livrez-vous en dehors du Maroc ?",
    answer:
      "Oui, nous livrons dans plusieurs pays. Les frais et délais de livraison varient selon la destination et sont calculés à l'étape du paiement.",
  },
  {
    id: "retour-comment",
    category: "Retours",
    question: "Comment retourner un article ?",
    answer:
      "Tu disposes de 30 jours après réception pour retourner un article non porté, avec son étiquette d'origine. Contacte notre support pour lancer la procédure de retour.",
  },
  {
    id: "retour-remboursement",
    category: "Retours",
    question: "Sous combien de temps suis-je remboursé ?",
    answer:
      "Une fois ton retour reçu et vérifié, le remboursement est effectué sous 5 à 7 jours ouvrés sur ton moyen de paiement initial.",
  },
  {
    id: "produit-taille",
    category: "Produits",
    question: "Comment choisir ma taille ?",
    answer:
      "Nos pièces sont conçues en coupe oversize. Si tu hésites entre deux tailles, nous recommandons de prendre la taille en dessous pour un fit plus ajusté.",
  },
  {
    id: "produit-entretien",
    category: "Produits",
    question: "Comment entretenir mes vêtements BOZA ?",
    answer:
      "Lavage à 30°C max, cycle délicat, séchage à l'air libre de préférence pour préserver la matière et les impressions.",
  },
];

export const metadata: Metadata = {
  title: "FAQ - Livraison, retours et tailles - BOZA",
  description:
    "Toutes les réponses à tes questions sur les commandes, la livraison, les retours et les tailles BOZA, boutique streetwear premium.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <div className="text-center w-full max-w-[1100px] mx-auto pt-5 px-6 pb-5">
        <h1 className="font-display text-[34px] font-black mb-3.5 max-[640px]:text-[26px]">
          Questions fréquentes
        </h1>
        <p className="text-boza-taupe text-[15px] leading-[1.6] mb-[30px]">
          Trouve rapidement une réponse à ta question. Sinon, contacte-nous directement.
        </p>
      </div>

      <FaqAccordion faqItems={faqItems} />

      <section className="bg-boza-cream-alt text-center py-[50px] px-6">
        <h2 className="font-display text-2xl font-black mb-2.5">Tu n&apos;as pas trouvé ta réponse ?</h2>
        <p className="text-boza-taupe text-sm mb-6">Notre équipe est là pour t&apos;aider.</p>
        <a
          href="/contact"
          className="inline-block py-3.5 px-8 border border-boza-black bg-boza-black text-boza-cream text-sm font-bold uppercase tracking-wide no-underline transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown"
        >
          Nous contacter
        </a>
      </section>

      <Footer />
    </>
  );
}