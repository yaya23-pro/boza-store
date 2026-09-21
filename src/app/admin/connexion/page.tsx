import AdminLoginForm from "@/components/Admin/Connexion/AdminLoginForm";
import Link from "next/link";
export default function AdminConnexionPage() {
  return (
    <div className="min-h-screen bg-boza-black flex items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-2">
          <Link href="/" className="font-display text-[32px] font-black text-boza-cream no-underline tracking-[-0.5px]">
            BOZA
          </Link>
        </div>
        <div className="text-center text-xs text-boza-taupe uppercase tracking-widest mb-10">
          Espace administrateur
        </div>

        <AdminLoginForm />

        <div className="text-center mt-[30px] text-xs text-boza-taupe">
          <Link href="/" className="text-boza-cream underline">Retour au site BOZA</Link>
        </div>
      </div>
    </div>
  );
}