"use client";

import { useState } from "react";
import { submitReturnRequest, MOTIFS_RETOUR, ReturnRequestFormData } from "@/lib/retours";

export default function ReturnRequestForm() {
  const [formData, setFormData] = useState<ReturnRequestFormData>({
    numeroCommande: "",
    email: "",
    motif: MOTIFS_RETOUR[0],
    description: "",
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleChange<K extends keyof ReturnRequestFormData>(key: K, value: ReturnRequestFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult(null);

    const response = await submitReturnRequest(formData);

    setSending(false);

    if (response.success) {
      setResult({
        type: "success",
        text: "Ta demande a bien été envoyée. On revient vers toi par e-mail sous 48h avec la marche à suivre.",
      });
      setFormData({ numeroCommande: "", email: "", motif: MOTIFS_RETOUR[0], description: "" });
    } else {
      setResult({ type: "error", text: "Une erreur est survenue. Réessaie dans un instant." });
    }
  }

  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-9 max-[640px]:p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-[18px]">
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Numéro de commande</label>
          <input
            type="text"
            required
            value={formData.numeroCommande}
            onChange={(e) => handleChange("numeroCommande", e.target.value)}
            placeholder="Ex : #A1B2C3D4"
            className="w-full px-4 py-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
          />
          <p className="text-boza-taupe text-xs mt-1.5">
            Tu le trouves dans l&apos;e-mail de confirmation de ta commande.
          </p>
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
          <p className="text-boza-taupe text-xs mt-1.5">L&apos;adresse utilisée lors de la commande.</p>
        </div>

        <div className="mb-[18px]">
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Motif du retour</label>
          <select
            value={formData.motif}
            onChange={(e) => handleChange("motif", e.target.value)}
            className="w-full px-4 py-3.5 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
          >
            {MOTIFS_RETOUR.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-[18px]">
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Explique-nous le problème</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Décris le souci rencontré avec ta commande..."
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
          {sending ? "Envoi en cours..." : "Envoyer ma demande de retour"}
        </button>
      </form>
    </div>
  );
}
