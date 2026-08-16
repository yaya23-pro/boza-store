type ClientsStatusTabsProps = {
  active: string;
  onChange: (statut: string) => void;
  counts: Record<string, number>;
};

const tabs = [
  { key: "tous", label: "Tous" },
  { key: "nouveau", label: "Nouveaux" },
  { key: "recurrent", label: "Récurrents" },
  { key: "inactif", label: "Inactifs" },
];

export default function ClientsStatusTabs({ active, onChange, counts }: ClientsStatusTabsProps) {
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