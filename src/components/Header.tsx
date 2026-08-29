"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, User, ShoppingCart, Home, Store, Info, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase";

export default function Header() {
  const { itemCount } = useCart();
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    }
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleAccountClick = async () => {
    setIsMenuOpen(false);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      router.push("/user/dashboard");
    } else {
      router.push("/connexion");
    }
  };

  return (
    <header className="bg-boza-cream sticky top-0 z-[1000]">
      <nav className="py-6 max-md:py-5">
        <div className="container mx-auto grid grid-cols-3 items-center w-full px-6 gap-3">
          {/* Gauche : bouton menu */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="flex items-center justify-center p-2 border-0 bg-transparent text-boza-black cursor-pointer"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Centre : logo */}
          <a href="/" className="flex justify-center">
            <Image
              src="/Boza.png"
              alt="BOZA STORE"
              width={160}
              height={56}
              className="h-11 w-auto max-md:h-20"
              style={{ width: "auto" }}
              priority
            />
          </a>

          {/* Droite : compte + panier */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleAccountClick}
              aria-label="Compte"
              className="relative p-[5px] border-0 bg-transparent text-boza-black cursor-pointer inline-flex items-center justify-center"
            >
              <User size={18} />
            </button>

            <a href="/panier" aria-label="Panier" className="relative p-[5px] border-0 bg-transparent text-boza-black cursor-pointer inline-flex items-center justify-center">
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-boza-black text-boza-cream min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] font-semibold">
                  {itemCount}
                </span>
              )}
            </a>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 bg-boza-black/50 z-[1100] transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[340px] max-w-[85vw] bg-boza-cream z-[1200] shadow-[8px_0_30px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-7 py-6 border-b border-boza-cream-alt">
          <span className="font-display text-2xl font-black text-boza-black">Menu</span>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Fermer le menu"
            className="p-2 border-0 bg-transparent text-boza-black cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="list-none p-0 m-0 py-3">
          <li>
            <a
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 px-7 py-5 text-boza-black no-underline text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:bg-boza-cream-alt"
            >
              <Home size={18} className="text-boza-taupe" />
              Accueil
            </a>
          </li>

          <li>
            <a
              href="/catalogue"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 px-7 py-5 text-boza-black no-underline text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:bg-boza-cream-alt"
            >
              <Store size={18} className="text-boza-taupe" />
              Catalogue
            </a>
          </li>

          <li>
            <a
              href="/a-propos"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 px-7 py-5 text-boza-black no-underline text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:bg-boza-cream-alt"
            >
              <Info size={18} className="text-boza-taupe" />
              À propos de nous
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}