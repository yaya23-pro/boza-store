import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact - BOZA",
  description:
    "Une question sur ta commande, une taille ou une collaboration ? Contacte l'équipe BOZA, boutique streetwear premium basée à Salé, Maroc.",
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BOZA",
    email: "contact@boza-store.com",
    telephone: "+212600000000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Salé",
      addressCountry: "MA",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <div className="text-center max-w-[600px] mx-auto pt-[20px] px-6 pb-10">
        <h1 className="font-display text-[34px] font-black mb-3.5 max-[640px]:text-[26px]">Contacte-nous</h1>
        <p className="text-boza-taupe text-[15px] leading-[1.6]">
          Une question sur ta commande, une taille, une collaboration ? On te répond rapidement.
        </p>
      </div>

      <div className="w-full max-w-[1100px] mx-auto px-6 pb-20 grid grid-cols-[1fr_1.3fr] gap-[50px] max-[968px]:grid-cols-1">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 items-start p-5 bg-boza-cream-alt">
            <div className="w-10 h-10 bg-boza-black text-boza-cream flex items-center justify-center text-base shrink-0">
              <i className="fas fa-envelope"></i>
            </div>
            <div>
              <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">E-mail</div>
              <div className="text-[15px] text-boza-black font-semibold leading-relaxed">bozastore02@gmail.com</div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-5 bg-boza-cream-alt">
            <div className="w-10 h-10 bg-boza-black text-boza-cream flex items-center justify-center text-base shrink-0">
              <i className="fas fa-phone"></i>
            </div>
            <div>
              <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">Téléphone</div>
              <div className="text-[15px] text-boza-black font-semibold leading-relaxed">+212 778 696 396</div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-5 bg-boza-cream-alt">
            <div className="w-10 h-10 bg-boza-black text-boza-cream flex items-center justify-center text-base shrink-0">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">Localisation</div>
              <div className="text-[15px] text-boza-black font-semibold leading-relaxed">temara, Maroc</div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-5 bg-boza-cream-alt">
            <div className="w-10 h-10 bg-boza-black text-boza-cream flex items-center justify-center text-base shrink-0">
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">Disponibilité</div>
              <div className="text-[15px] text-boza-black font-semibold leading-relaxed">Lun - Sam, 9h - 18h</div>
            </div>
          </div>

          <div className="flex gap-3 mt-2.5">
            <a
              href="#"
              aria-label="Instagram"
              className="w-10 h-10 border border-boza-black flex items-center justify-center text-boza-black no-underline transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              aria-label="Tiktok"
              className="w-10 h-10 border border-boza-black flex items-center justify-center text-boza-black no-underline transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fab fa-tiktok"></i>
            </a>
            <a
              href="#"
              aria-label="Whatsapp"
              className="w-10 h-10 border border-boza-black flex items-center justify-center text-boza-black no-underline transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <ContactForm />
      </div>

      <section className="bg-boza-cream-alt text-center py-[50px] px-6">
        <h2 className="font-display text-2xl font-black mb-2.5">Une question fréquente ?</h2>
        <p className="text-boza-taupe text-sm mb-6">Trouve peut-être ta réponse directement dans notre FAQ.</p>
        <a
          href="/faq"
          className="inline-block py-3.5 px-8 border border-boza-black bg-boza-cream text-boza-black text-sm font-bold uppercase tracking-wide no-underline transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
        >
          Voir la FAQ
        </a>
      </section>

      <Footer />
    </>
  );
}