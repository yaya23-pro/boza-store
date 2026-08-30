"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function SocialLoginButtons() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setLoading(false);
      setError("Impossible de se connecter avec Google. Réessaie.");
    }
    // Pas besoin de setLoading(false) en cas de succès : la page redirige vers Google
  };

  return (
    <div className="flex flex-col gap-2.5 mb-6">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center justify-center gap-2.5 py-3.5 border border-boza-black bg-boza-cream text-boza-black font-semibold text-sm cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt disabled:opacity-60"
      >
        <i className="fab fa-google"></i>
        {loading ? "Redirection..." : "Continuer avec Google"}
      </button>

      {error && <p className="text-boza-brown text-sm text-center">{error}</p>}
    </div>
  );
}