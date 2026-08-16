import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-boza-cream-alt bg-boza-cream max-w-[1700px] mx-auto mt-10 pt-10 pb-5 px-6">
      <div className="max-w-[500px] mx-auto mb-[60px] grid grid-cols-3 gap-[30px] max-[640px]:grid-cols-2 max-[640px]:gap-x-6 max-[640px]:gap-y-10 max-[420px]:grid-cols-1 max-[420px]:gap-8">
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

        <div className="max-[420px]:col-span-1">
          <h3 className="font-display text-[13px] font-black text-boza-black mb-6">Réseaux sociaux</h3>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Tiktok"
              className="w-9 h-9 border border-boza-black flex items-center justify-center text-boza-black transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fab fa-tiktok text-sm"></i>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 border border-boza-black flex items-center justify-center text-boza-black transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fab fa-instagram text-sm"></i>
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 border border-boza-black flex items-center justify-center text-boza-black transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fab fa-facebook-f text-sm"></i>
            </a>
            <a
              href="#"
              aria-label="Pinterest"
              className="w-9 h-9 border border-boza-black flex items-center justify-center text-boza-black transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fab fa-pinterest-p text-sm"></i>
            </a>
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

        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <svg className="w-5 h-5 text-boza-black shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span className="text-boza-black text-sm font-medium">Morocco</span>
          <span className="text-boza-taupe mx-[5px]">|</span>
          <span className="text-boza-black text-sm font-medium">Français</span>
        </div>
      </div>
    </footer>
  );
}