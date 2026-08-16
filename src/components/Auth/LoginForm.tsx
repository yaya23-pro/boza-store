"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import SocialLoginButtons from "@/components/Auth/SocialLoginButtons";

type LoginFormProps = {
  onSwitchToSignup: () => void;
};

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("E-mail ou mot de passe incorrect.");
      return;
    }

    const next = searchParams.get("next") || "/";
    router.push(next);
    router.refresh();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-black mb-2 text-center">Bon retour</h1>
      <p className="text-boza-taupe text-sm mb-[30px] text-center">Connecte-toi à ton compte BOZA</p>

      <SocialLoginButtons />

      <div className="flex items-center text-center text-boza-taupe text-xs tracking-wide my-6 before:content-[''] before:flex-1 before:border-b before:border-boza-cream-alt before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-boza-cream-alt after:ml-3">
        OU
      </div>

      <form onSubmit={handleSubmit}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full py-3.5 px-4 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
          />
        </div>

        {error && <p className="text-boza-brown text-sm mb-4">{error}</p>}

        <div className="flex justify-between items-center mb-[22px] text-[13px]">
          <label className="flex items-center gap-2 text-boza-black">
            <input type="checkbox" className="w-4 h-4 accent-boza-black" />
            Se souvenir de moi
          </label>
          <a href="#" className="text-boza-brown font-semibold no-underline hover:underline">
            Mot de passe oublié ?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-[15px] bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-[13px] text-boza-taupe mt-[22px]">
        Pas encore de compte ?{" "}
        <button onClick={onSwitchToSignup} className="text-boza-black font-semibold underline cursor-pointer bg-transparent border-0">
          Créer un compte
        </button>
      </p>
    </div>
  );
}