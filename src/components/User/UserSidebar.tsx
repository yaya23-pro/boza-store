"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type UserSidebarProps = {
  activeSection: string;
  userName: string;
  userEmail: string;
};

const navItems = [
  { key: "dashboard", label: "Vue d'ensemble", icon: "fa-th-large", href: "/user/dashboard" },
  { key: "commandes", label: "Mes commandes", icon: "fa-box", href: "/user/commandes" },
  { key: "favoris", label: "Mes favoris", icon: "fa-heart", href: "/user/favoris" },
  { key: "informations", label: "Mes informations", icon: "fa-user", href: "/user/informations" },
  { key: "adresses", label: "Mes adresses", icon: "fa-map-marker-alt", href: "/user/adresses" },
];

export default function UserSidebar({ activeSection, userName, userEmail }: UserSidebarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/catalogue");
    router.refresh();
  };

  const initial = userName.charAt(0).toUpperCase();

  return (
    <aside className="w-[260px] shrink-0 p-10 px-6 border-r border-boza-cream-alt max-[968px]:w-full max-[968px]:border-r-0 max-[968px]:border-b max-[968px]:p-4">
      <div className="flex items-center gap-3.5 mb-9 pb-6 border-b border-boza-cream-alt max-[968px]:mb-4 max-[968px]:pb-4">
        <div className="w-12 h-12 bg-boza-black text-boza-cream rounded-full flex items-center justify-center font-display text-lg font-black shrink-0 max-[968px]:w-10 max-[968px]:h-10 max-[968px]:text-base">
          {initial}
        </div>
        <div>
          <div className="text-[15px] font-semibold text-boza-black max-[968px]:text-sm">{userName}</div>
          <div className="text-xs text-boza-taupe mt-0.5">{userEmail}</div>
        </div>
      </div>

      <ul className="list-none max-[968px]:flex max-[968px]:gap-2 max-[968px]:overflow-x-auto max-[968px]:pb-2 max-[968px]:-mx-4 max-[968px]:px-4 max-[968px]:[scrollbar-width:none] max-[968px]:[&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => (
          <li key={item.key} className="mb-1 max-[968px]:mb-0 max-[968px]:shrink-0">
            <Link
              href={item.href}
              className={`flex items-center gap-3 py-3 px-3.5 no-underline text-sm font-medium transition-all duration-300 whitespace-nowrap max-[968px]:flex-col max-[968px]:gap-1.5 max-[968px]:py-2.5 max-[968px]:px-4 max-[968px]:text-[11px] ${
                activeSection === item.key
                  ? "bg-boza-black text-boza-cream"
                  : "text-boza-black hover:bg-boza-cream-alt"
              }`}
            >
              <i
                className={`fas ${item.icon} w-4 text-sm max-[968px]:w-auto max-[968px]:text-base ${
                  activeSection === item.key ? "text-boza-cream" : "text-boza-taupe"
                }`}
              ></i>
              {item.label}
            </Link>
          </li>
        ))}

        <div className="h-px bg-boza-cream-alt my-4 max-[968px]:hidden"></div>

        <li className="max-[968px]:shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-3 px-3.5 text-sm font-medium text-boza-brown bg-transparent border-0 cursor-pointer text-left whitespace-nowrap max-[968px]:flex-col max-[968px]:gap-1.5 max-[968px]:py-2.5 max-[968px]:px-4 max-[968px]:text-[11px]"
          >
            <i className="fas fa-sign-out-alt w-4 text-sm text-boza-brown max-[968px]:w-auto max-[968px]:text-base"></i>
            Déconnexion
          </button>
        </li>
      </ul>
    </aside>
  );
}