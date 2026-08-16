import { LowStockItem } from "@/lib/dashboard";

export default function LowStockList({ items }: { items: LowStockItem[] }) {
  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-lg font-black">Stock faible</h2>
        <a href="/admin/produits" className="text-[13px] text-boza-brown font-semibold no-underline hover:underline">
          Gérer
        </a>
      </div>

      {items.length === 0 ? (
        <p className="text-boza-taupe text-sm">Aucun produit en stock faible.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3 border-b border-boza-cream-alt last:border-b-0">
            <img src={item.image} alt={item.nom} className="w-11 h-[52px] object-cover bg-boza-cream-alt" />
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-boza-black">
                {item.nom} {item.couleur && `· ${item.couleur}`} {item.taille && `· Taille ${item.taille}`}
              </div>
              <div className="text-xs text-boza-brown font-semibold mt-0.5">
                Plus que {item.quantite} en stock
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}