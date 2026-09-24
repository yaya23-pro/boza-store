"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionValide, setSessionValide] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // Une fois le lien de l'email suivi, Supabase a déjà créé une session
    // "recovery" via la route /auth/callback. On vérifie juste qu'elle existe.
    supabase.auth.getUser().then(({ data }) => {
      setSessionValide(!!data.user);
      setCheckingSession(false);
    });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      setMessage({ type: "error", text: "Le mot de passe doit contenir au moins 8 caractères, avec au moins 1 chiffre." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Les deux mots de passe ne correspondent pas." });
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) {
      console.error("Erreur réinitialisation mot de passe :", error);
      setMessage({ type: "error", text: "Erreur lors de la mise à jour. Redemande un lien et réessaie." });
      return;
    }

    setMessage({ type: "success", text: "Mot de passe mis à jour. Redirection..." });
    setTimeout(() => router.push("/user/dashboard"), 1500);
  }

  if (checkingSession) {
    return <p className="text-center text-boza-taupe text-sm">Vérification du lien...</p>;
  }

  if (!sessionValide) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl font-black mb-2">Lien invalide ou expiré</h1>
        <p className="text-boza-taupe text-sm mb-6">
          Ce lien de réinitialisation n&apos;est plus valable. Redemande un nouveau lien depuis la page de
          connexion.
        </p>
        <a
          href="/connexion"
          className="inline-block py-3.5 px-8 bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide no-underline transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown"
        >
          Retour à la connexion
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-black mb-2 text-center">Nouveau mot de passe</h1>
      <p className="text-boza-taupe text-sm mb-[30px] text-center">Choisis un nouveau mot de passe pour ton compte.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Nouveau mot de passe</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full py-3.5 px-4 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
          />
          <div className="text-xs text-boza-taupe mt-1.5">8 caractères minimum, avec au moins 1 chiffre</div>
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Confirmer le mot de passe</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full py-3.5 px-4 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
          />
        </div>

        {message && (
          <div
            className={`flex items-center gap-3 mb-4 px-5 py-4 text-sm font-semibold border ${
              message.type === "success"
                ? "bg-boza-cream-alt border-boza-black text-boza-black"
                : "bg-boza-brown/10 border-boza-brown text-boza-brown"
            }`}
          >
            <i className={`fas ${message.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-[15px] bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
        >
          {saving ? "Mise à jour..." : "Valider le nouveau mot de passe"}
        </button>
      </form>
    </div>
  );
}