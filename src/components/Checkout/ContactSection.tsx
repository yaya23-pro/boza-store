"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type ContactSectionProps = {
  showNewsletterOffer: boolean;
  newsletter: boolean;
  onNewsletterChange: (value: boolean) => void;
};

export default function ContactSection({ showNewsletterOffer, newsletter, onNewsletterChange }: ContactSectionProps) {
  const supabase = createClient();
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadEmail() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setEmail(user.email);
    }
    loadEmail();
  }, [supabase]);

  return (
    <>
      <p className="text-center text-boza-taupe mb-3.5 text-[13px] uppercase tracking-wide">Paiement express</p>
      <div className="flex gap-3 mb-5">
        <button className="flex-1 h-12 border border-boza-black bg-boza-black text-boza-cream font-bold text-[15px] cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown">
          shop
        </button>
        <button className="flex-1 h-12 border border-boza-black bg-boza-cream text-boza-black font-bold text-[15px] cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt">
          PayPal
        </button>
      </div>

      <div className="flex items-center text-center text-boza-taupe text-xs tracking-wide my-6 before:content-[''] before:flex-1 before:border-b before:border-boza-cream-alt before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-boza-cream-alt after:ml-3">
        OU
      </div>

      <h2 className="font-display text-lg font-black uppercase tracking-wide text-boza-black">Contact</h2>
      <div className="relative mb-3 mt-4">
        <input
          type="email"
          value={email}
          readOnly
          className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream-alt outline-none cursor-not-allowed"
        />
      </div>

      {showNewsletterOffer && (
        <div className="flex items-start gap-2.5 my-4 text-[13px] text-boza-black">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => onNewsletterChange(e.target.checked)}
            className="w-[18px] h-[18px] mt-0.5 accent-boza-black"
          />
          <span>Envoyez-moi des nouvelles et des offres par e-mail</span>
        </div>
      )}
    </>
  );
}