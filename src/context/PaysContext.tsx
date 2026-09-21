"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Pays, PAYS_PAR_DEFAUT, NOM_COOKIE_PAYS, isPaysSupporte } from "@/lib/devise";

type PaysContextType = {
  pays: Pays;
  setPays: (pays: Pays) => void;
};

const PaysContext = createContext<PaysContextType | undefined>(undefined);

// La détection automatique (middleware, via l'IP Vercel) écrit déjà un cookie
// avant que la page ne s'affiche. `initialPays` vient de la lecture de ce
// cookie côté serveur (layout.tsx), pour éviter tout flash de la mauvaise devise.
export function PaysProvider({ children, initialPays }: { children: ReactNode; initialPays: Pays }) {
  const [pays, setPaysState] = useState<Pays>(initialPays);

  const setPays = (nouveauPays: Pays) => {
    setPaysState(nouveauPays);
    // Choix manuel (ex. sélecteur du footer) : on écrase le cookie de détection
    // automatique, avec une durée longue, pour que ce choix tienne sur les prochaines visites.
    const maxAge = 60 * 60 * 24 * 30; // 30 jours
    document.cookie = `${NOM_COOKIE_PAYS}=${nouveauPays}; path=/; max-age=${maxAge}; SameSite=Lax`;
  };

  return <PaysContext.Provider value={{ pays, setPays }}>{children}</PaysContext.Provider>;
}

export function usePays() {
  const context = useContext(PaysContext);
  if (!context) throw new Error("usePays doit être utilisé à l'intérieur d'un PaysProvider");
  return context;
}

export { isPaysSupporte, PAYS_PAR_DEFAUT };
