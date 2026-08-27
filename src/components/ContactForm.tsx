"use client";

import { useState } from "react";
import { submitContactMessage, ContactFormData } from "@/lib/contact";

const sujets = [
  "Question sur une commande",
  "Question sur un produit",
  "Retour / Échange",
  "Collaboration / Partenariat",
  "Autre",
];

export default function ContactForm() {
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
  );
}