// components/User/Security/PasswordForm.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function PasswordForm() {
  const supabase = createClient();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      setMessage({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 8 caractères, avec au moins 1 chiffre." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Les deux mots de passe ne correspondent pas." });
      return;
    }

    setSaving(true);

    const { data: authData } = await supabase.auth.getUser();
    const email = authData.user?.email;

    if (!email) {
      setSaving(false);
      setMessage({ type: "error", text: "Session invalide. Reconnecte-toi et réessaie." });
      return;
    }

    // Vérifie le mot de passe actuel en tentant une reconnexion
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      setSaving(false);
      setMessage({ type: "error", text: "Mot de passe actuel incorrect." });
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    setSaving(false);

    if (updateError) {
      console.error("Erreur mise à jour mot de passe :", updateError);
      setMessage({ type: "error", text: "Erreur lors de la mise à jour. Réessaie." });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage({ type: "success", text: "Mot de passe mis à jour avec succès." });
  }

  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-lg font-black">Changer le mot de passe</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-[18px]">
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Mot de passe actuel</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-[13px] border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
          />
        </div>

        <div className="grid grid-cols-2 gap-[18px] mb-[18px] max-[640px]:grid-cols-1">
          <div>
            <label className="block text-[13px] font-semibold text-boza-black mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-[13px] border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
            />
            <div className="text-xs text-boza-taupe mt-1.5">8 caractères minimum, avec au moins 1 chiffre</div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-boza-black mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-[13px] border border-boza-black bg-boza-cream text-boza-black text-sm outline-none focus:border-boza-brown"
            />
          </div>
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

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-[14px] bg-boza-black text-boza-cream border border-boza-black text-sm font-bold uppercase tracking-wide transition hover:bg-boza-brown hover:border-boza-brown disabled:opacity-50"
          >
            {saving ? "Mise à jour..." : "Modifier"}
          </button>
        </div>
      </form>
    </div>
  );
}