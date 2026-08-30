import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const currentNomPrenom = user.user_metadata?.nom_prenom;

      // Si nom_prenom n'existe pas encore (ex: compte créé via Google),
      // on le remplit avec les infos renvoyées par Google
      if (!currentNomPrenom) {
        const fullNameFromGoogle =
          user.user_metadata?.full_name || user.user_metadata?.name || "";

        if (fullNameFromGoogle) {
          await supabase.auth.updateUser({
            data: { nom_prenom: fullNameFromGoogle },
          });
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-error`);
}