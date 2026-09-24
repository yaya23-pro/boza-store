"use client";

import { useEffect, useState } from "react";

export const NOM_COOKIE_CONSENTEMENT = "boza_cookie_consentement";

type ConsentementCookies = {
  performance: boolean;
  preference: boolean;
  marketing: boolean;
};

const CONSENTEMENT_PAR_DEFAUT: ConsentementCookies = {
  performance: false,
  preference: false,
  marketing: false,
};

function lireConsentement(): ConsentementCookies {
  if (typeof document === "undefined") return CONSENTEMENT_PAR_DEFAUT;

  const match = document.cookie.match(new RegExp(`${NOM_COOKIE_CONSENTEMENT}=([^;]+)`));
  if (!match) return CONSENTEMENT_PAR_DEFAUT;

  try {
    return { ...CONSENTEMENT_PAR_DEFAUT, ...JSON.parse(decodeURIComponent(match[1])) };
  } catch {
    return CONSENTEMENT_PAR_DEFAUT;
  }
}

function ecrireConsentement(consentement: ConsentementCookies) {
  const maxAge = 60 * 60 * 24 * 180; // 6 mois
  document.cookie = `${NOM_COOKIE_CONSENTEMENT}=${encodeURIComponent(
    JSON.stringify(consentement)
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

type CookiePreferencesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CookiePreferencesModal({ isOpen, onClose }: CookiePreferencesModalProps) {
  const [consentement, setConsentement] = useState<ConsentementCookies>(CONSENTEMENT_PAR_DEFAUT);

  useEffect(() => {
    if (isOpen) setConsentement(lireConsentement());
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (cle: keyof ConsentementCookies) => {
    setConsentement((prev) => ({ ...prev, [cle]: !prev[cle] }));
  };

  const handleSave = (valeurs: ConsentementCookies) => {
    ecrireConsentement(valeurs);
    onClose();
  };

  const items: { cle: keyof ConsentementCookies; label: string; text: string }[] = [
    {
      cle: "performance",
      label: "Cookies de performance",
      text: "Nous aident à comprendre comment les visiteurs utilisent le site, afin de l'améliorer.",
    },
    {
      cle: "preference",
      label: "Cookies de préférence",
      text: "Mémorisent tes choix (langue, devise) pour t'offrir une expérience personnalisée.",
    },
    {
      cle: "marketing",
      label: "Cookies marketing",
      text: "Utilisés pour te proposer des publicités ou offres pertinentes, sur ce site ou ailleurs.",
    },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-boza-black/50" />

      <div className="relative bg-boza-cream border border-boza-black w-full max-w-[520px] max-h-[85vh] overflow-y-auto p-7 max-[640px]:p-5">
        <div className="flex justify-between items-start mb-5">
          <h2 className="font-display text-lg font-black text-boza-black">Préférences de cookies</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-1 border-0 bg-transparent text-boza-black cursor-pointer"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <p className="text-boza-taupe text-[13px] leading-[1.6] mb-6">
          On utilise des cookies pour faire fonctionner le site et, si tu l&apos;acceptes, pour mieux
          comprendre son usage et te proposer des offres pertinentes. Tu peux changer d&apos;avis à tout
          moment depuis le pied de page.
        </p>

        <div className="border-t border-boza-cream-alt">
          <div className="flex justify-between items-center py-4 border-b border-boza-cream-alt">
            <div>
              <div className="text-sm font-semibold text-boza-black">Cookies essentiels</div>
              <div className="text-xs text-boza-taupe mt-0.5">
                Nécessaires au bon fonctionnement du site (panier, connexion, sécurité). Toujours actifs.
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wide text-boza-taupe shrink-0 ml-4">
              Actif
            </span>
          </div>

          {items.map((item) => (
            <div
              key={item.cle}
              className="flex justify-between items-center py-4 border-b border-boza-cream-alt last:border-b-0"
            >
              <div className="pr-4">
                <div className="text-sm font-semibold text-boza-black">{item.label}</div>
                <div className="text-xs text-boza-taupe mt-0.5">{item.text}</div>
              </div>

              <label className="relative w-11 h-6 flex-shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentement[item.cle]}
                  onChange={() => toggle(item.cle)}
                  className="opacity-0 w-0 h-0 peer"
                />
                <span className="absolute inset-0 bg-boza-cream-alt border border-boza-black transition-colors peer-checked:bg-boza-black before:content-[''] before:absolute before:h-4 before:w-4 before:left-[3px] before:bottom-[3px] before:bg-boza-black before:transition-transform peer-checked:before:translate-x-5 peer-checked:before:bg-boza-cream" />
              </label>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-7 max-[480px]:flex-col">
          <button
            type="button"
            onClick={() => handleSave({ performance: false, preference: false, marketing: false })}
            className="flex-1 py-3 border border-boza-black bg-transparent text-boza-black font-semibold text-xs uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt"
          >
            Tout refuser
          </button>
          <button
            type="button"
            onClick={() => handleSave(consentement)}
            className="flex-1 py-3 border border-boza-black bg-transparent text-boza-black font-semibold text-xs uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-cream-alt"
          >
            Enregistrer mes choix
          </button>
          <button
            type="button"
            onClick={() => handleSave({ performance: true, preference: true, marketing: true })}
            className="flex-1 py-3 border border-boza-black bg-boza-black text-boza-cream font-semibold text-xs uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}