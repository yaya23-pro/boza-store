"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type AdminSidebarProps = {
  activeSection: string;
  adminName: string;
};

const navItems = [
  { key: "dashboard", label: "Vue d'ensemble", icon: "fa-th-large", href: "/admin/dashboard" },
  { key: "produits", label: "Produits", icon: "fa-tshirt", href: "/admin/produits" },
  { key: "commandes", label: "Commandes", icon: "fa-box", href: "/admin/commandes" },
  { key: "clients", label: "Clients", icon: "fa-users", href: "/admin/clients" },
  { key: "parametres", label: "Paramètres", icon: "fa-cog", href: "/admin/parametres" },
];

export default function AdminSidebar({ activeSection, adminName }: AdminSidebarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/connexion");
    router.refresh();
  };

  const initial = adminName.charAt(0).toUpperCase();

  return (
    <aside className="w-[260px] shrink-0 p-10 px-6 border-r border-boza-cream-alt max-[968px]:w-full max-[968px]:border-r-0 max-[968px]:border-b">
      <div className="flex items-center gap-3.5 mb-9 pb-6 border-b border-boza-cream-alt">
        <div className="w-12 h-12 bg-boza-black text-boza-cream rounded-full flex items-center justify-center font-display text-lg font-black shrink-0">
          {initial}
        </div>
        <div>
          <div className="text-[15px] font-semibold text-boza-black">{adminName}</div>
          <div className="text-xs text-boza-taupe mt-0.5">Administrateur</div>
        </div>
      </div>

      <ul className="list-none">
        {navItems.map((item) => (
          <li key={item.key} className="mb-1">
            <a
              href={item.href}
              className={`flex items-center gap-3 py-3 px-3.5 no-underline text-sm font-medium transition-all duration-300 ${
                activeSection === item.key
                  ? "bg-boza-black text-boza-cream"
                  : "text-boza-black hover:bg-boza-cream-alt"
              }`}
            >
              <i className={`fas ${item.icon} w-4 text-sm ${activeSection === item.key ? "text-boza-cream" : "text-boza-taupe"}`}></i>
              {item.label}
            </a>
          </li>
        ))}

        <div className="h-px bg-boza-cream-alt my-4"></div>

        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-3 px-3.5 text-sm font-medium text-boza-brown bg-transparent border-0 cursor-pointer text-left"
          >
            <i className="fas fa-sign-out-alt w-4 text-sm text-boza-brown"></i>
            Déconnexion
          </button>
        </li>
      </ul>
    </aside>
  );
}