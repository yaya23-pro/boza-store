type ShippingSectionProps = {
  values: { pays: string; prenom: string; nom: string; rue: string; ville: string; codePostal: string; telephone: string };
  onChange: (field: string, value: string) => void;
};

export default function ShippingSection({ values, onChange }: ShippingSectionProps) {
  return (
    <>
      <h2 className="font-display text-lg font-black uppercase tracking-wide text-boza-black my-8">Livraison</h2>

      <div className="mb-3">
        <select
          value={values.pays}
          onChange={(e) => onChange("pays", e.target.value)}
          className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none cursor-pointer appearance-none bg-no-repeat bg-[right_14px_center] focus:border-boza-brown"
          style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%230D0D0D' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>\")" }}
        >
          <option>Maroc</option>
          <option>France</option>
          <option>Suisse</option>
          <option>Canada</option>
          <option>Guinée</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 max-[640px]:grid-cols-1">
        <input
          type="text"
          placeholder="Prénom"
          value={values.prenom}
          onChange={(e) => onChange("prenom", e.target.value)}
          className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none placeholder:text-boza-taupe focus:border-boza-brown"
        />
        <input
          type="text"
          placeholder="Nom"
          value={values.nom}
          onChange={(e) => onChange("nom", e.target.value)}
          className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none placeholder:text-boza-taupe focus:border-boza-brown"
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Adresse"
          value={values.rue}
          onChange={(e) => onChange("rue", e.target.value)}
          className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none placeholder:text-boza-taupe focus:border-boza-brown"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 max-[640px]:grid-cols-1">
        <input
          type="text"
          placeholder="Code postal (facultatif)"
          value={values.codePostal}
          onChange={(e) => onChange("codePostal", e.target.value)}
          className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none placeholder:text-boza-taupe focus:border-boza-brown"
        />
        <input
          type="text"
          placeholder="Ville"
          value={values.ville}
          onChange={(e) => onChange("ville", e.target.value)}
          className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none placeholder:text-boza-taupe focus:border-boza-brown"
        />
      </div>

      <div className="relative mb-3">
        <input
          type="tel"
          value={values.telephone}
          onChange={(e) => onChange("telephone", e.target.value)}
          className="w-full h-[46px] border border-boza-black px-3.5 text-sm font-body text-boza-black bg-boza-cream outline-none focus:border-boza-brown"
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-boza-taupe text-[13px]">?</span>
      </div>
    </>
  );
}