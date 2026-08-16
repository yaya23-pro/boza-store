import Link from "next/link";
import { OrderListItem } from "@/lib/commandes";

const statusBadgeClass: Record<string, string> = {
  en_attente: "border border-boza-taupe text-boza-taupe bg-transparent",
  confirmee: "border border-boza-taupe text-boza-taupe bg-transparent",
  en_livraison: "bg-boza-brown text-boza-cream",
  livree: "bg-boza-cream-alt text-boza-black",
  annulee: "bg-boza-brown text-boza-cream",
};

const statusLabels: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
};

export default function OrdersTable({ orders }: { orders: OrderListItem[] }) {
  if (orders.length === 0) {
    return (
      <div className="bg-boza-cream border border-dashed border-boza-taupe p-10 text-center">
        <p className="text-boza-taupe">Aucune commande dans cette catégorie.</p>
      </div>
    );
  }

  return (
    <div className="bg-boza-cream border border-boza-cream-alt overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Commande</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Client</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Date</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Articles</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Total</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Statut</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt font-semibold text-[13px] text-boza-black">{o.numero}</td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-boza-black text-boza-cream rounded-full flex items-center justify-center font-display text-xs font-black shrink-0">
                    {o.clientInitial}
                  </div>
                  <span className="text-[13px] text-boza-black">{o.clientNom}</span>
                </div>
              </td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">{o.date}</td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">{o.articlesCount}</td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">
                {o.total.toFixed(2).replace(".", ",")} €
              </td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt">
                <span className={`text-[11px] font-bold py-1 px-2.5 inline-block ${statusBadgeClass[o.statut] ?? "bg-boza-cream-alt text-boza-black"}`}>
                  {statusLabels[o.statut] ?? o.statut}
                </span>
              </td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/commandes?id=${o.id}`}
                    className="w-[30px] h-[30px] border border-boza-black bg-boza-cream text-boza-black flex items-center justify-center text-xs cursor-pointer transition-all duration-300 hover:bg-boza-black hover:text-boza-cream"
                  >
                    <i className="fas fa-eye"></i>
                  </Link>
                  
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}