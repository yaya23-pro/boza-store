// components/User/Orders/OrderCard.tsx
import Link from "next/link";
import { OrderListItem, orderStatusLabels, orderStatusClasses } from "@/lib/orders";

interface OrderCardProps {
  order: OrderListItem;
}

export default function OrderCard({ order }: OrderCardProps) {
  const dateFormatted = new Date(order.dateCommande).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const showTracking = (order.statut === "en_livraison" || order.statut === "expedie") && order.numeroSuivi;
  const detailHref = `/user/commandes?id=${order.id}`;

  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-7 mb-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <div className="text-sm font-semibold text-boza-black">
            {order.numeroFacture ?? `#${order.id.slice(0, 8).toUpperCase()}`}
          </div>
          <div className="text-xs text-boza-taupe mt-0.5">Commandée le {dateFormatted}</div>
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-wide py-1.5 px-3 ${orderStatusClasses[order.statut]}`}>
          {orderStatusLabels[order.statut]}
        </span>
      </div>

      {order.images.length > 0 && (
        <div className="flex gap-3 mb-5">
          {order.images.map((image, index) => (
            <img key={index} src={image} alt="" className="w-14 h-16 object-cover bg-boza-cream-alt" />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center flex-wrap gap-4 pt-4 border-t border-boza-cream-alt">
        <div className="text-sm text-boza-black">
          Total : <strong className="font-semibold">{order.montantTotal.toFixed(2).replace(".", ",")} €</strong> ·{" "}
          {order.itemsCount} article{order.itemsCount > 1 ? "s" : ""}
        </div>
        <div className="flex gap-3">
          <Link
            href={detailHref}
            className="text-xs font-semibold px-4 py-2 border border-boza-black text-boza-black transition hover:bg-boza-black hover:text-boza-cream"
          >
            Voir le détail
          </Link>
          {showTracking && (
            <Link
              href={detailHref}
              className="text-xs font-semibold px-4 py-2 bg-boza-black text-boza-cream transition hover:bg-boza-brown"
            >
              Suivre ma commande
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}