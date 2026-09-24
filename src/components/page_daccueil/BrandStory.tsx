import Link from "next/link";
import Image from "next/image";

export default function BrandStory() {
  return (
    <section className="bg-[#f7f7f5]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-[380px] md:h-[560px]">
          <Image
            src="/image/paint.webp"
            alt="Culture BOZA"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        <div className="flex flex-col justify-center px-6 md:px-16 py-12 md:py-0">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-boza-brown mb-3">
            Boza
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-boza-black leading-snug mb-5">
            Plus qu&apos;une marque, une culture.
          </h2>
          <p className="text-sm md:text-base text-boza-black/80 leading-relaxed mb-8">
            BOZA est né en hommage à tous ceux qui ont osé rêver plus grand que 
            leur peur — peu importe où le chemin les a menés.
            Le courage ne se mesure pas à l&apos;arrivée. 
            Il se mesure à l'instant où on a choisi d&apos;y aller quand même.
          </p>
          <Link
            href="/a-propos"
            className="inline-flex items-center gap-3 self-start bg-boza-black text-boza-cream px-6 py-3 text-xs font-semibold uppercase tracking-wide hover:bg-boza-brown transition-all duration-300"
          >
            Notre histoire
            <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}