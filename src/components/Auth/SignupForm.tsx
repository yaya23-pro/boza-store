"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import SocialLoginButtons from "@/components/Auth/SocialLoginButtons";
type SignupFormProps = {
  onSwitchToLogin: () => void;
};

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Merci d'accepter les conditions d'achat et la politique de confidentialité.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom_prenom: `${firstName} ${lastName}`, newsletter },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    setLoading(false);

    if (!data.session) {
      setNeedsConfirmation(true);
      return;
    }

    const next = searchParams.get("next") || "/";
    router.push(next);
    router.refresh();
  };

  if (needsConfirmation) {
    return (
      <div className="text-center py-10">
        <h1 className="font-display text-2xl font-black mb-3">Vérifie ta boîte mail</h1>
        <p className="text-boza-taupe text-sm">
          Un e-mail de confirmation t&apos;a été envoyé à <strong className="text-boza-black">{email}</strong>. Clique sur le lien pour activer ton compte.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-black mb-2 text-center">Rejoins BOZA</h1>
      <p className="text-boza-taupe text-sm mb-[30px] text-center">
        Crée ton compte pour commander et suivre tes achats
      </p>

      <SocialLoginButtons />

      <div className="flex items-center text-center text-boza-taupe text-xs tracking-wide my-6 before:content-[''] before:flex-1 before:border-b before:border-boza-cream-alt before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-boza-cream-alt after:ml-3">
        OU
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 mb-4 max-[480px]:grid-cols-1">
          <div>
            <label className="block text-[13px] font-semibold text-boza-black mb-2">Prénom</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
              className="w-full py-3.5 px-4 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-boza-black mb-2">Nom</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
              className="w-full py-3.5 px-4 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Adresse e-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.com"
            className="w-full py-3.5 px-4 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Mot de passe</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            className="w-full py-3.5 px-4 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
          />
        </div>

        <div className="flex items-start gap-2.5 my-[18px] text-[13px] text-boza-taupe leading-relaxed">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-boza-black shrink-0"
          />
          <span>
            J&apos;accepte les <a href="/conditions-de-vente" className="text-boza-black font-semibold">Conditions d&apos;achat</a> et la{" "}
            <a href="/politique-de-confidentialite" className="text-boza-black font-semibold">Politique de confidentialité</a> de BOZA
          </span>
        </div>

        <div className="flex items-start gap-2.5 mb-[18px] text-[13px] text-boza-taupe leading-relaxed">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-boza-black shrink-0"
          />
          <span>Je souhaite recevoir les actualités et offres BOZA</span>
        </div>

        {error && <p className="text-boza-brown text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-[15px] bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="text-center text-[13px] text-boza-taupe mt-[22px]">
        Déjà un compte ?{" "}
        <button onClick={onSwitchToLogin} className="text-boza-black font-semibold underline cursor-pointer bg-transparent border-0">
          Se connecter
        </button>
      </p>
    </div>
  );
}