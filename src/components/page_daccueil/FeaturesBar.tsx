const features = [
  { icon: "fas fa-truck-fast", title: "Livraison rapide", subtitle: "Partout dans le monde" },
  { icon: "fas fa-shield-halved", title: "Paiement sécurisé", subtitle: "100% fiable" },
  { icon: "fas fa-leaf", title: "Matières de qualité", subtitle: "Confort & durabilité" },
  { icon: "fas fa-globe", title: "Une marque africaine", subtitle: "Pour un avenir plus grand" },
];

export default function FeaturesBar() {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-10 py-10">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center text-center gap-3">
            <i className={`${feature.icon} text-xl text-boza-black`}></i>
            <div>
              <p className="text-xs md:text-sm font-semibold uppercase tracking-wide text-boza-black">
                {feature.title}
              </p>
              <p className="text-[11px] md:text-xs text-boza-taupe mt-1">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}