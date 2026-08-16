"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { submitContactMessage, ContactFormData } from "@/lib/contact";

const sujets = [
  "Question sur une commande",
  "Question sur un produit",
  "Retour / Échange",
  "Collaboration / Partenariat",
  "Autre",
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    nom: "",
    email: "",
    sujet: sujets[0],
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleChange<K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult(null);

    const response = await submitContactMessage(formData);

    setSending(false);

    if (response.success) {
      setResult({ type: "success", text: "Ton message a bien été envoyé. On te répond rapidement !" });
      setFormData({ nom: "", email: "", sujet: sujets[0], message: "" });
    } else {
      setResult({ type: "error", text: "Une erreur est survenue. Réessaie dans un instant." });
    }
  }

  return (
    <>
      <Header />

      {/* Intro */}
      <div className="text-center max-w-[600px] mx-auto pt-[20px] px-6 pb-10">
        <h1 className="font-display text-[34px] font-black mb-3.5 max-[640px]:text-[26px]">Contacte-nous</h1>
        <p className="text-boza-taupe text-[15px] leading-[1.6]">
          Une question sur ta commande, une taille, une collaboration ? On te répond rapidement.
        </p>
      </div>

      {/* Layout */}
      <div className=" w-full max-w-[1100px] mx-auto px-6 pb-20 grid grid-cols-[1fr_1.3fr] gap-[50px] max-[968px]:grid-cols-1">
        {/* Contact info */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 items-start p-5 bg-boza-cream-alt">
            <div className="w-10 h-10 bg-boza-black text-boza-cream flex items-center justify-center text-base shrink-0">
              <i className="fas fa-envelope"></i>
            </div>
            <div>
              <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">E-mail</div>
              <div className="text-[15px] text-boza-black font-semibold leading-relaxed">contact@boza-store.com</div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-5 bg-boza-cream-alt">
            <div className="w-10 h-10 bg-boza-black text-boza-cream flex items-center justify-center text-base shrink-0">
              <i className="fas fa-phone"></i>
            </div>
            <div>
              <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">Téléphone</div>
              <div className="text-[15px] text-boza-black font-semibold leading-relaxed">+212 6 00 00 00 00</div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-5 bg-boza-cream-alt">
            <div className="w-10 h-10 bg-boza-black text-boza-cream flex items-center justify-center text-base shrink-0">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">Localisation</div>
              <div className="text-[15px] text-boza-black font-semibold leading-relaxed">Salé, Maroc</div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-5 bg-boza-cream-alt">
            <div className="w-10 h-10 bg-boza-black text-boza-cream flex items-center justify-center text-base shrink-0">
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">Disponibilité</div>
              <div className="text-[15px] text-boza-black font-semibold leading-relaxed">Lun - Sam, 9h - 18h</div>
            </div>
          </div>

          <div className="flex gap-3 mt-2.5">
            <a
              href="#"
              aria-label="Instagram"
              className="w-10 h-10 border border-boza-black flex items-center justify-center text-boza-black no-underline transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              aria-label="Tiktok"
              className="w-10 h-10 border border-boza-black flex items-center justify-center text-boza-black no-underline transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fab fa-tiktok"></i>
            </a>
            <a
              href="#"
              aria-label="Whatsapp"
              className="w-10 h-10 border border-boza-black flex items-center justify-center text-boza-black no-underline transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-boza-cream border border-boza-cream-alt p-9 max-[640px]:p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-[18px]">
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Nom complet</label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                placeholder="Ton nom"
                className="w-full px-4 py-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
              />
            </div>

            <div className="mb-[18px]">
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Adresse e-mail</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="ton@email.com"
                className="w-full px-4 py-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
              />
            </div>

            <div className="mb-[18px]">
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Sujet</label>
              <select
                value={formData.sujet}
                onChange={(e) => handleChange("sujet", e.target.value)}
                className="w-full px-4 py-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
              >
                {sujets.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mb-[18px]">
              <label className="block text-[13px] font-semibold text-boza-black mb-2">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Écris ton message ici..."
                className="w-full px-4 py-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown resize-y min-h-[140px]"
              />
            </div>

            {result && (
              <div
                className={`flex items-center gap-3 mb-[18px] px-5 py-4 text-sm font-semibold border ${
                  result.type === "success"
                    ? "bg-boza-cream-alt border-boza-black text-boza-black"
                    : "bg-boza-brown/10 border-boza-brown text-boza-brown"
                }`}
              >
                <i className={`fas ${result.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
                {result.text}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 bg-boza-black text-boza-cream border border-boza-black font-body text-sm font-bold uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-50 mt-2"
            >
              {sending ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
        </div>
      </div>

      {/* FAQ teaser */}
      <section className="bg-boza-cream-alt text-center py-[50px] px-6">
        <h2 className="font-display text-2xl font-black mb-2.5">Une question fréquente ?</h2>
        <p className="text-boza-taupe text-sm mb-6">Trouve peut-être ta réponse directement dans notre FAQ.</p>
        <a
          href="/faq"
          className="inline-block py-3.5 px-8 border border-boza-black bg-boza-cream text-boza-black text-sm font-bold uppercase tracking-wide no-underline transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
        >
          Voir la FAQ
        </a>
      </section>

      <Footer />
    </>
  );
}