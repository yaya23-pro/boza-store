import Link from "next/link";

const recommended = [
  { id: "1", name: "T-Shirt BOZA Crème", image: "/image/BOZA1.png", price: 89.9 },
  { id: "3", name: "T-Shirt BOZA Brun", image: "/image/BOZA3.png", price: 89.9 },
  { id: "20", name: "Casquette BOZA", image: "/image/Kepi1.png", price: 45 },
  { id: "12", name: "Sweatshirt BOZA", image: "/image/sweatshirt2.png", price: 109 },
];

export default function RecommendedProducts() {
  return (
    <div className="mt-[60px] py-[50px] bg-boza-cream-alt">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-[26px] font-black text-boza-black mb-2.5">Tu pourrais aussi aimer</h2>
          <p className="text-boza-taupe text-[15px]">Complète ton look BOZA</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recommended.map((p) => (
            <Link key={p.id} href={`/produit/${p.id}`} className="bg-boza-cream border border-boza-cream-alt overflow-hidden transition-all duration-300 cursor-pointer block hover:border-boza-brown">
              <img src={p.image} alt={p.name} className="w-full h-[240px] object-cover" />
              <div className="p-[15px]">
                <div className="text-sm font-semibold text-boza-black mb-2">{p.name}</div>
                <div className="font-display text-base font-black text-boza-black">{p.price.toFixed(2).replace(".", ",")} €</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}