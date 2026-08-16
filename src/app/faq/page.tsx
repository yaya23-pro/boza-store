"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

const categories = ["Toutes", "Commandes", "Livraison", "Retours", "Produits"];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = faqItems.filter((item) => {
    const matchesCategory = activeCategory === "Toutes" || item.category === activeCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const groupedCategories = categories.filter(
    (cat) => cat !== "Toutes" && filtered.some((item) => item.category === cat)
  );

  return (
    <>
      <Header />

      {/* Intro */}
      <div className="text-center w-full max-w-[1100px] mx-auto pt-5 px-6 pb-5">
        <h1 className="font-display text-[34px] font-black mb-3.5 max-[640px]:text-[26px]">
          Questions fréquentes
        </h1>
        <p className="text-boza-taupe text-[15px] leading-[1.6] mb-[30px]">
          Trouve rapidement une réponse à ta question. Sinon, contacte-nous directement.
        </p>
        <div className="flex w-full border border-boza-black">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une question..."
            className="flex-1 px-4 py-3.5 border-0 bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe"
          />
          <button className="px-5 border-0 bg-boza-black text-boza-cream cursor-pointer transition-all duration-300 hover:bg-boza-brown">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="w-full max-w-[1100px] mx-auto flex justify-center gap-2.5 flex-wrap pt-[30px] px-6 pb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-[18px] py-2 border border-boza-black font-body text-[13px] font-semibold cursor-pointer transition-all duration-300 ${
              activeCategory === cat ? "bg-boza-black text-boza-cream" : "bg-boza-cream text-boza-black hover:bg-boza-black hover:text-boza-cream"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ list */}
      <div className="w-full max-w-[1100px] mx-auto px-6 pt-5 pb-20">
        {filtered.length === 0 ? (
          <p className="text-center text-boza-taupe py-10">Aucune question ne correspond à ta recherche.</p>
        ) : (
          groupedCategories.map((cat, catIndex) => (
            <div key={cat}>
              <h2 className={`font-display text-lg font-black mb-4 ${catIndex === 0 ? "mt-0" : "mt-9"}`}>{cat}</h2>

              {filtered
                .filter((item) => item.category === cat)
                .map((item) => {
                  const isOpen = openId === item.id;
                  return (
                    <div key={item.id} className="border border-boza-cream-alt mb-2.5 bg-boza-cream">
                      <button
                        onClick={() => setOpenId(isOpen ? null : item.id)}
                        className="w-full flex justify-between items-center px-5 py-[18px] cursor-pointer text-[15px] font-semibold text-boza-black text-left bg-transparent border-0"
                      >
                        <span>{item.question}</span>
                        <i
                          className={`fas fa-plus text-boza-taupe flex-shrink-0 ml-4 transition-transform duration-300 ${
                            isOpen ? "rotate-45" : ""
                          }`}
                        ></i>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-5 pb-5 text-boza-taupe text-sm leading-[1.7]">{item.answer}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))
        )}
      </div>

      {/* Contact teaser */}
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