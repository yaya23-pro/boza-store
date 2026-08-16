type OrdersToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function OrdersToolbar({ search, onSearchChange }: OrdersToolbarProps) {
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-3.5">
      <div className="flex items-center border border-boza-black px-3.5 max-w-[320px] flex-1">
        <i className="fas fa-search text-boza-taupe text-[13px]"></i>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher une commande, un client..."
          className="flex-1 border-0 bg-transparent p-2.5 text-[13px] text-boza-black outline-none placeholder:text-boza-taupe"
        />
      </div>
      <button className="py-3 px-6 bg-boza-black text-boza-cream border border-boza-black font-bold text-[13px] uppercase tracking-wide cursor-pointer transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown">
        <i className="fas fa-file-export"></i> Exporter
      </button>
    </div>
  );
}