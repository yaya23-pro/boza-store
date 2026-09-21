"use client";

import Link from "next/link";
import { usePays } from "@/context/PaysContext";
import { PAYS_SUPPORTES, isPaysSupporte } from "@/lib/devise";

function TiktokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.66-4.79 1.32 0 2.46.1 2.79.14v3.24h-1.92c-1.5 0-1.79.71-1.79 1.76v2.31h3.58l-.47 3.62h-3.11V24h6.1c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z" />
    </svg>
  );
}

const RESEAUX_SOCIAUX = [
  { label: "Tiktok", href: "https://www.tiktok.com/@boza.store5", Icon: TiktokIcon },
  { label: "Instagram", href: "https://www.instagram.com/bozas.tore/", Icon: InstagramIcon },
  { label: "Facebook", href: "https://www.facebook.com/share/1FPCzNBtRE/", Icon: FacebookIcon },
];

export default function Footer() {
  const { pays, setPays } = usePays();

  return (
    <footer className="border-t border-boza-cream-alt bg-boza-cream max-w-[1700px] mx-auto mt-10 pt-10 pb-5 px-6">
      <div className="max-w-[500px] mx-auto mb-10 grid grid-cols-3 gap-[30px] max-[640px]:grid-cols-2 max-[640px]:gap-x-8 max-[640px]:gap-y-8 max-[640px]:text-center">
        <div>
          <h3 className="font-display text-[13px] font-black text-boza-black mb-6">Aide</h3>
          <ul className="list-none p-0 m-0">
            <li className="mb-4">
              <Link href="/faq" className="text-boza-taupe text-[13px] no-underline transition-colors duration-200 hover:text-boza-black">Questions fréquentes</Link>
            </li>
            <li className="mb-4">
              <a href="#" className="text-boza-taupe text-[13px] no-underline transition-colors duration-200 hover:text-boza-black">Effectuer un retour</a>
            </li>
            <li className="mb-4">
              <Link href="/contact" className="text-boza-taupe text-[13px] no-underline transition-colors duration-200 hover:text-boza-black">Nous contacter</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-[13px] font-black text-boza-black mb-6">Entreprise</h3>
          <ul className="list-none p-0 m-0">
            <li className="mb-4">
              <Link href="/a-propos" className="text-boza-taupe text-[13px] no-underline transition-colors duration-200 hover:text-boza-black">Qui sommes-nous ?</Link>
            </li>
            <li className="mb-4">
              <a href="#" className="text-boza-taupe text-[13px] no-underline transition-colors duration-200 hover:text-boza-black">Rejoignez notre équipe</a>
            </li>
          </ul>
        </div>

        <div className="max-[640px]:col-span-2">
          <h3 className="font-display text-[13px] font-black text-boza-black mb-6">Réseaux sociaux</h3>
          <div className="flex gap-3 max-[640px]:justify-center">
            {RESEAUX_SOCIAUX.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 border border-boza-black flex items-center justify-center text-boza-black transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-boza-cream-alt pt-[15px] flex justify-center items-center gap-x-[60px] gap-y-3 flex-wrap max-[640px]:flex-col max-[640px]:items-center max-[640px]:gap-y-4 max-[640px]:text-center">
        <div className="flex flex-wrap justify-center gap-x-[5px] gap-y-2 max-[640px]:flex-col max-[640px]:gap-y-3 max-[640px]:items-center">
          <a href="#" className="text-boza-taupe text-sm no-underline transition-colors duration-200 hover:text-boza-black">Préférences de cookies</a>
          <span className="text-boza-taupe mx-[5px] max-[640px]:hidden">|</span>
          <Link href="/politique-de-confidentialite" className="text-boza-taupe text-sm no-underline transition-colors duration-200 hover:text-boza-black">Politique de confidentialité</Link>
          <span className="text-boza-taupe mx-[5px] max-[640px]:hidden">|</span>
          <Link href="/conditions-de-vente" className="text-boza-taupe text-sm no-underline transition-colors duration-200 hover:text-boza-black">Conditions d&apos;achat</Link>
          <span className="text-boza-taupe mx-[5px] max-[640px]:hidden">|</span>
          <Link href="/politique-cookies" className="text-boza-taupe text-sm no-underline transition-colors duration-200 hover:text-boza-black">Politique en matière de cookies</Link>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <svg className="w-5 h-5 text-boza-black shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <select
            value={pays}
            onChange={(e) => {
              if (isPaysSupporte(e.target.value)) setPays(e.target.value);
            }}
            aria-label="Choisir le pays de livraison"
            className="text-boza-black text-sm font-medium bg-transparent border-0 cursor-pointer outline-none"
          >
            {PAYS_SUPPORTES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <span className="text-boza-taupe mx-[5px]">|</span>
          <span className="text-boza-black text-sm font-medium">Français</span>
        </div>
      </div>
    </footer>
  );
}
