import Header from "@/components/Header";
import Footer from "@/components/Footer";

const values = [
  {
    icon: "fa-heart",
    name: "Sincérité",
    text: "On construit une vraie connexion avec chaque client, pas juste une transaction.",
  },
  {
    icon: "fa-gem",
    name: "Qualité durable",
    text: "Des pièces pensées pour être portées longtemps, pas jetées après une saison.",
  },
  {
    icon: "fa-globe-africa",
    name: "Racines",
    text: "Une identité assumée, ancrée dans la diaspora africaine et fière de l'être.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="text-center max-w-[720px] mx-auto pt-[70px] px-6 pb-[50px]">
        <div className="text-[13px] font-semibold text-boza-brown uppercase tracking-wide mb-4">
          Notre histoire
        </div>
        <h1 className="font-display text-[42px] font-black leading-[1.2] mb-5 max-[640px]:text-[30px]">
          Une marque née de la diaspora, pensée pour durer
        </h1>
        <p className="text-boza-taupe text-base leading-[1.7]">
          BOZA n&apos;est pas juste des vêtements. C&apos;est une manière de porter nos racines, où que la vie
          nous mène.
        </p>
      </section>

      {/* Story */}
      <section className="max-w-[780px] mx-auto px-6 pb-[70px]">
        <p className="text-base leading-[1.8] text-boza-black mb-6">
          BOZA est née d&apos;une conviction simple : les jeunes de la diaspora africaine méritent une marque
          streetwear qui leur ressemble vraiment — pas une imitation de ce qui se fait ailleurs, mais quelque
          chose de sincère, taillé pour eux.
        </p>
        <p className="text-base leading-[1.8] text-boza-black mb-6">
          Chaque pièce BOZA est pensée pour durer, pas pour suivre une tendance qui disparaît dans six mois. On
          préfère prendre le temps de bien faire les choses : des matières solides, des coupes qui vieillissent
          bien, et une identité visuelle qu&apos;on ne va pas changer à chaque saison.
        </p>
        <p className="text-base leading-[1.8] text-boza-black">
          Nos vêtements sont fabriqués au Maroc, avec l&apos;ambition de construire une marque qui compte sur le
          long terme — pas un projet éphémère, mais quelque chose qui a vocation à durer des décennies.
        </p>
      </section>

      {/* Values */}
      <section className="bg-boza-cream-alt py-[70px] px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-display text-[28px] font-black text-center mb-[50px]">Ce qui nous guide</h2>
          <div className="grid grid-cols-3 gap-10 max-[968px]:grid-cols-1">
            {values.map((value) => (
              <div key={value.name} className="text-center">
                <div className="w-14 h-14 bg-boza-black text-boza-cream rounded-full flex items-center justify-center text-xl mx-auto mb-5">
                  <i className={`fas ${value.icon}`}></i>
                </div>
                <div className="font-display text-[17px] font-black mb-2.5">{value.name}</div>
                <div className="text-sm text-boza-taupe leading-[1.6]">{value.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin banner */}
      <section className="max-w-[900px] mx-auto my-[70px] px-6 text-center">
        <h2 className="font-display text-2xl font-black mb-[18px]">Made in Maroc, pensé pour le monde</h2>
        <p className="text-boza-taupe text-[15px] leading-[1.7] max-w-[620px] mx-auto">
          De Salé au reste du monde, BOZA porte l&apos;ambition de représenter une nouvelle génération : connectée
          à ses origines, tournée vers l&apos;avenir.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center pt-[10px] px-6 pb-[20px]">
        <a
          href="/catalogue"
          className="inline-block py-4 px-10 bg-boza-black text-boza-cream border border-boza-black font-body text-sm font-bold uppercase tracking-wide no-underline transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown"
        >
          Découvrir la collection
        </a>
      </section>

      <Footer />
    </>
  );
}