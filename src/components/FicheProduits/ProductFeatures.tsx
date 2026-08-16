const features = [
  { icon: "fa-shipping-fast", title: "Livraison gratuite", desc: "Dès 50€ d'achat" },
  { icon: "fa-undo", title: "Retours gratuits", desc: "30 jours pour changer d'avis" },
  { icon: "fa-lock", title: "Paiement sécurisé", desc: "Transactions cryptées" },
  { icon: "fa-award", title: "Garantie qualité", desc: "2 ans de garantie" },
];

export default function ProductFeatures() {
  return (
    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-boza-cream-alt max-[576px]:grid-cols-1">
      {features.map((f) => (
        <div key={f.title} className="flex items-start gap-3">
          <i className={`fas ${f.icon} text-boza-brown text-lg mt-0.5`}></i>
          <div>
            <div className="text-sm font-semibold text-boza-black">{f.title}</div>
            <div className="text-xs text-boza-taupe">{f.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}