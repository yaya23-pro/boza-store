// Logique centrale : quel pays entraîne quelle devise, et comment afficher un prix.
// Un seul endroit à modifier si un jour la liste des pays ou la règle change.

export const PAYS_SUPPORTES = ["Maroc", "France", "Espagne", "Italie", "Allemagne"] as const;
export type Pays = (typeof PAYS_SUPPORTES)[number];

export const PAYS_PAR_DEFAUT: Pays = "France";

export type Devise = "MAD" | "EUR";

export function isPaysSupporte(value: string | null | undefined): value is Pays {
  return !!value && (PAYS_SUPPORTES as readonly string[]).includes(value);
}

export function getDeviseForPays(pays: string): Devise {
  return pays === "Maroc" ? "MAD" : "EUR";
}

// Correspondance code pays (ISO 3166-1 alpha-2, fourni par Vercel) -> nom utilisé dans le site.
// Toute détection hors de cette liste retombe sur PAYS_PAR_DEFAUT (Europe/EUR).
const CODE_PAYS_VERS_NOM: Record<string, Pays> = {
  MA: "Maroc",
  FR: "France",
  ES: "Espagne",
  IT: "Italie",
  DE: "Allemagne",
};

export function paysDepuisCodeIso(code: string | null | undefined): Pays {
  if (!code) return PAYS_PAR_DEFAUT;
  return CODE_PAYS_VERS_NOM[code.toUpperCase()] ?? PAYS_PAR_DEFAUT;
}

export const INDICATIFS_TELEPHONIQUES: Record<Pays, string> = {
  Maroc: "+212",
  France: "+33",
  Espagne: "+34",
  Italie: "+39",
  Allemagne: "+49",
};

// Sélectionne le bon prix (EUR ou MAD) selon le pays, avec repli sur l'EUR
// si jamais le prix MAD n'a pas été renseigné pour ce produit.
export function choisirPrix(
  prixEur: number,
  prixMad: number | null | undefined,
  pays: string
): number {
  if (getDeviseForPays(pays) === "MAD") {
    return prixMad ?? prixEur;
  }
  return prixEur;
}

export function formatMontant(montant: number, devise: Devise): string {
  const valeur = montant.toFixed(2).replace(".", ",");
  return devise === "MAD" ? `${valeur} MAD` : `${valeur} €`;
}

// Raccourci le plus utilisé dans les composants d'affichage.
export function formatPrix(prixEur: number, prixMad: number | null | undefined, pays: string): string {
  const devise = getDeviseForPays(pays);
  const montant = choisirPrix(prixEur, prixMad, pays);
  return formatMontant(montant, devise);
}

export const NOM_COOKIE_PAYS = "boza_pays";
