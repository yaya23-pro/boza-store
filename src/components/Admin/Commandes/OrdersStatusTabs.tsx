type OrdersStatusTabsProps = {
  active: string;
  onChange: (statut: string) => void;
  counts: Record<string, number>;
};

const tabs = [
  { key: "toutes", label: "Toutes" },
  { key: "en_attente", label: "En attente" },
  { key: "en_livraison", label: "En livraison" },
  { key: "livree", label: "Livrées" },
  { key: "annulee", label: "Annulées" },
];

export default function OrdersStatusTabs({ active, onChange, counts }: OrdersStatusTabsProps) {
  return (
    <div className="flex gap-2 mb-5 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`py-[7px] px-4 border border-boza-black font-body text-xs font-semibold cursor-pointer transition-all duration-300 ${
            active === tab.key ? "bg-boza-black text-boza-cream" : "bg-boza-cream text-boza-black hover:bg-boza-cream-alt"
          }`}
        >
          {tab.label} ({counts[tab.key] ?? 0})
        </button>
      ))}
    </div>
  );
}