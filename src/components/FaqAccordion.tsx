"use client";

import { useState } from "react";

type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

const categories = ["Toutes", "Commandes", "Livraison", "Retours", "Produits"];

export default function FaqAccordion({ faqItems }: { faqItems: FaqItem[] }) {
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
      <div className="text-center w-full max-w-[1100px] mx-auto pt-5 px-6 pb-5">
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
    </>
  );
}