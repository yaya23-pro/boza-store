import { RecentOrder } from "@/lib/dashboard";

const statusStyles: Record<string, string> = {
  en_attente: "border border-boza-taupe text-boza-taupe bg-transparent",
  en_livraison: "bg-boza-brown text-boza-cream",
  livree: "bg-boza-cream-alt text-boza-black",
};

const statusLabels: Record<string, string> = {
  en_attente: "En attente",
  en_livraison: "En livraison",
  livree: "Livrée",
};

export default function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-lg font-black">Commandes récentes</h2>
        <a href="/admin/commandes" className="text-[13px] text-boza-brown font-semibold no-underline hover:underline">
          Voir tout
        </a>
      </div>

      {orders.length === 0 ? (
        <p className="text-boza-taupe text-sm">Aucune commande pour l&apos;instant.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe pb-3 border-b border-boza-cream-alt">Commande</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe pb-3 border-b border-boza-cream-alt">Client</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe pb-3 border-b border-boza-cream-alt">Statut</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe pb-3 border-b border-boza-cream-alt">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="py-3.5 border-b border-boza-cream-alt text-[13px] font-bold text-boza-black">{o.numero}</td>
                <td className="py-3.5 border-b border-boza-cream-alt text-[13px] text-boza-black">{o.clientNom}</td>
                <td className="py-3.5 border-b border-boza-cream-alt text-[13px]">
                  <span className={`text-[11px] font-bold uppercase tracking-wide py-1 px-2.5 inline-block ${statusStyles[o.statut] ?? "bg-boza-cream-alt text-boza-black"}`}>
                    {statusLabels[o.statut] ?? o.statut}
                  </span>
                </td>
                <td className="py-3.5 border-b border-boza-cream-alt text-[13px] text-boza-black">
                  {o.total.toFixed(2).replace(".", ",")} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}