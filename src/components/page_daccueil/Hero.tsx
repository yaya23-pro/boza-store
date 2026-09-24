"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const TITLE = "Le streetwear qui porte tes racines";

export default function Hero() {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(TITLE.slice(0, i));
      if (i >= TITLE.length) clearInterval(interval);
    }, 80); // vitesse : ms entre chaque lettre

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[500px] md:h-[640px] overflow-hidden">
      <Image
        src="/image/paint.webp"
        alt="Nouveautés BOZA"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />

      <div className="relative z-10 h-full max-w-[1440px] mx-auto flex flex-col justify-center px-6 md:px-10">
        <div className="max-w-md">
          <h1 className="text-2xl md:text-4xl font-bold uppercase text-white leading-tight drop-shadow-md min-h-[3.5em] md:min-h-[3em]">
            {displayedText}
            <span className="animate-pulse">|</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/90 drop-shadow-sm">
            Des pièces pensées pour celles et ceux qui portent leur histoire.
          </p>
          <Link
            href="/catalogue"
            className="mt-8 inline-flex items-center gap-3 bg-transparent border border-white text-white px-6 py-3 text-xs font-semibold uppercase tracking-wide hover:bg-white hover:text-boza-black transition-all duration-300"
          >
            Découvrir la collection
            <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}