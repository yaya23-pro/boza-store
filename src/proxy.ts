import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { NOM_COOKIE_PAYS, paysDepuisCodeIso, isPaysSupporte } from "@/lib/devise";

// Cette route ne nécessite pas d'être connecté : c'est la page de connexion elle-même.
const PUBLIC_ADMIN_PATHS = ["/admin/connexion"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. Détection du pays (s'applique à tout le site) ---
  // Si le visiteur a déjà un cookie (détection précédente OU choix manuel via
  // le sélecteur du footer), on ne le touche pas : le choix manuel doit primer.
  const cookiePays = request.cookies.get(NOM_COOKIE_PAYS)?.value;

  if (!isPaysSupporte(cookiePays)) {
    // Header rempli automatiquement par Vercel avec le pays détecté via l'IP.
    // Absent en local/hors Vercel : on retombe alors sur le pays par défaut (France).
    const codePays = request.headers.get("x-vercel-ip-country");
    const paysDetecte = paysDepuisCodeIso(codePays);

    // Posé sur la requête ET la réponse : la requête pour que la page rendue
    // dans CE même chargement voie déjà le pays détecté, la réponse pour que
    // le navigateur le mémorise pour les visites suivantes.
    request.cookies.set(NOM_COOKIE_PAYS, paysDetecte);
  }

  let response = NextResponse.next({ request });

  if (!isPaysSupporte(cookiePays)) {
    const codePays = request.headers.get("x-vercel-ip-country");
    const paysDetecte = paysDepuisCodeIso(codePays);
    response.cookies.set(NOM_COOKIE_PAYS, paysDetecte, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      sameSite: "lax",
    });
  }

  // --- 2. Protection des routes /admin/* (inchangé) ---
  if (!pathname.startsWith("/admin")) {
    return response;
  }

  // La page de connexion admin reste accessible sans session
  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return response;
  }

  // Client Supabase côté serveur, capable de lire/rafraîchir les cookies de session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          const pays = response.cookies.get(NOM_COOKIE_PAYS);
          response = NextResponse.next({ request });
          if (pays) response.cookies.set(NOM_COOKIE_PAYS, pays.value, { path: "/", sameSite: "lax" });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. Vérifier qu'une session valide existe
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL("/admin/connexion", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Vérifier que cet utilisateur connecté est bien un administrateur
  const { data: adminData } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!adminData) {
    const redirectUrl = new URL("/admin/connexion", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Utilisateur connecté ET confirmé admin : on laisse passer
  return response;
}

export const config = {
  // S'applique à tout le site (pour la détection du pays), sauf les fichiers
  // statiques, les images Next.js et les routes API.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};