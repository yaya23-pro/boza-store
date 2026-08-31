"use client";

import { useState } from "react";
import { createAccountAndLinkOrders } from "@/lib/guestAccount";

export default function CreateAccountPrompt({ email }: { email: string }) {
  const [password, setPassword] = useState("");
  const [nomPrenom, setNomPrenom] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);
    const result = await createAccountAndLinkOrders(email, password, nomPrenom);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Une erreur est survenue.");
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <div className="bg-boza-cream-alt border border-boza-cream-alt p-6 mt-8 text-center">
        <p className="text-boza-black text-sm font-semibold">
          Ton compte a été créé et cette commande y est déjà rattachée. Vérifie ta boîte mail pour confirmer ton adresse.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-boza-cream-alt border border-boza-cream-alt p-6 mt-8">
      <h2 className="font-display text-base font-black mb-2 text-boza-black">Crée ton compte</h2>
      <p className="text-boza-taupe text-sm mb-4">
        Pour suivre cette commande et les prochaines plus facilement.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            required
            value={nomPrenom}
            onChange={(e) => setNomPrenom(e.target.value)}
            placeholder="Nom complet"
            className="w-full h-[46px] border border-boza-black px-3.5 text-sm bg-boza-cream text-boza-black outline-none placeholder:text-boza-taupe focus:border-boza-brown"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choisis un mot de passe"
            className="w-full h-[46px] border border-boza-black px-3.5 text-sm bg-boza-cream text-boza-black outline-none placeholder:text-boza-taupe focus:border-boza-brown"
          />
        </div>

        {error && <p className="text-boza-brown text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}