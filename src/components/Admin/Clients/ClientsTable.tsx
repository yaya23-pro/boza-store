import Link from "next/link";
import { ClientListItem } from "@/lib/clients";

const statusBadgeClass: Record<string, string> = {
  recurrent: "bg-boza-cream-alt text-boza-black",
  nouveau: "bg-boza-brown text-boza-cream",
  inactif: "border border-boza-taupe text-boza-taupe bg-transparent",
};

const statusLabels: Record<string, string> = {
  recurrent: "Récurrent",
  nouveau: "Nouveau",
  inactif: "Inactif",
};

export default function ClientsTable({ clients }: { clients: ClientListItem[] }) {
  if (clients.length === 0) {
    return (
      <div className="bg-boza-cream border border-dashed border-boza-taupe p-10 text-center">
        <p className="text-boza-taupe">Aucun client dans cette catégorie.</p>
      </div>
    );
  }

  return (
    <div className="bg-boza-cream border border-boza-cream-alt overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Client</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Inscrit le</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Commandes</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Total dépensé</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Statut</th>
            <th className="text-left text-[11px] font-bold uppercase tracking-wide text-boza-taupe py-4 px-5 border-b border-boza-cream-alt whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-boza-black text-boza-cream rounded-full flex items-center justify-center font-display text-xs font-black shrink-0">
                    {c.initial}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-boza-black">{c.nom}</div>
                    <div className="text-xs text-boza-taupe mt-0.5">{c.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">{c.dateInscription}</td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">{c.ordersCount}</td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt text-[13px] text-boza-black">
                {c.totalSpent.toFixed(2).replace(".", ",")} €
              </td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt">
                <span className={`text-[11px] font-bold py-1 px-2.5 inline-block ${statusBadgeClass[c.statut]}`}>
                  {statusLabels[c.statut]}
                </span>
              </td>
              <td className="py-3.5 px-5 border-b border-boza-cream-alt">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/clients?id=${c.id}`}
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