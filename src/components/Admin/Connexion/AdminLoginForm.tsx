"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AdminLoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !data.user) {
      setLoading(false);
      setError("E-mail ou mot de passe incorrect.");
      return;
    }

const { data: adminData, error: adminError } = await supabase
  .from("admins")
  .select("id")
  .eq("id", data.user.id)
  .single();

console.log("adminData:", adminData, "adminError:", adminError);

if (!adminData) {
  await supabase.auth.signOut();
  setLoading(false);
  setError("Ce compte n'a pas les droits administrateur.");
  return;
}

    setLoading(false);
    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="admin-login-card bg-boza-cream text-boza-black p-10 px-9 max-[480px]:p-6">
      <h1 className="font-display text-2xl font-black mb-1.5">Connexion</h1>
      <p className="text-boza-taupe text-[13px] mb-[30px]">Accède au tableau de bord BOZA</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-[18px]">
          <label className="block text-[13px] font-semibold text-boza-black mb-2">Adresse e-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@boza-store.com"
            className="w-full py-3.5 px-4 border border-boza-black bg-boza-cream text-boza-black text-sm outline-none placeholder:text-boza-taupe focus:border-boza-brown"
          />
        </div>

        <div className="mb-[18px]">
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

        <div className="flex justify-between items-center mb-6 text-[13px]">
          <label className="flex items-center gap-2 text-boza-black">
            <input type="checkbox" className="w-4 h-4 accent-boza-black" />
            Se souvenir de moi
          </label>
          <a href="#" className="text-boza-brown font-semibold no-underline hover:underline">Mot de passe oublié ?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-[15px] bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div className="flex items-start gap-2.5 mt-[26px] pt-[22px] border-t border-boza-cream-alt text-xs text-boza-taupe leading-relaxed">
        <i className="fas fa-lock mt-0.5 shrink-0"></i>
        <span>Cet espace est réservé à l&apos;équipe BOZA. Toute tentative d&apos;accès non autorisée est enregistrée.</span>
      </div>
    </div>
  );
}