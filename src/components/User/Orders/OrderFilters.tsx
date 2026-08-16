// components/User/Orders/OrderFilters.tsx
export type OrderFilterKey = "toutes" | "en_cours" | "livrees" | "annulees";

interface OrderFiltersProps {
  active: OrderFilterKey;
  onChange: (key: OrderFilterKey) => void;
  counts: Record<OrderFilterKey, number>;
}

const filters: { key: OrderFilterKey; label: string }[] = [
  { key: "toutes", label: "Toutes" },
  { key: "en_cours", label: "En cours" },
  { key: "livrees", label: "Livrées" },
  { key: "annulees", label: "Annulées" },
];

export default function OrderFilters({ active, onChange, counts }: OrderFiltersProps) {
  return (
    <div className="flex gap-3 mb-8 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onChange(filter.key)}
          className={`text-[13px] font-semibold px-4 py-2 transition ${
            active === filter.key
              ? "bg-boza-black text-boza-cream"
              : "bg-boza-cream-alt text-boza-black hover:bg-boza-black hover:text-boza-cream"
          }`}
        >
          {filter.label} ({counts[filter.key] ?? 0})
        </button>
      ))}
    </div>
  );
}