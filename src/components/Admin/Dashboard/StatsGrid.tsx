import { DashboardStats } from "@/lib/dashboard";

export default function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-4 gap-5 mb-10 max-[968px]:grid-cols-2">
      <div className="bg-boza-cream-alt p-[22px]">
        <div className="flex justify-between items-start mb-4">
          <div className="w-9 h-9 bg-boza-black text-boza-cream flex items-center justify-center text-sm">
            <i className="fas fa-coins"></i>
          </div>
          {stats.revenueTrendPct !== null && (
            <span className={`text-xs font-bold ${stats.revenueTrendPct >= 0 ? "text-boza-brown" : "text-boza-taupe"}`}>
              {stats.revenueTrendPct >= 0 ? "+" : ""}{stats.revenueTrendPct}%
            </span>
          )}
        </div>
        <div className="font-display text-2xl font-black text-boza-black mb-1">
          {stats.revenueThisMonth.toFixed(2).replace(".", ",")} €
        </div>
        <div className="text-xs text-boza-taupe">Chiffre d&apos;affaires ce mois</div>
      </div>

      <div className="bg-boza-cream-alt p-[22px]">
        <div className="flex justify-between items-start mb-4">
          <div className="w-9 h-9 bg-boza-black text-boza-cream flex items-center justify-center text-sm">
            <i className="fas fa-box"></i>
          </div>
          {stats.ordersTrendPct !== null && (
            <span className={`text-xs font-bold ${stats.ordersTrendPct >= 0 ? "text-boza-brown" : "text-boza-taupe"}`}>
              {stats.ordersTrendPct >= 0 ? "+" : ""}{stats.ordersTrendPct}%
            </span>
          )}
        </div>
        <div className="font-display text-2xl font-black text-boza-black mb-1">{stats.ordersThisMonth}</div>
        <div className="text-xs text-boza-taupe">Commandes ce mois</div>
      </div>

      <div className="bg-boza-cream-alt p-[22px]">
        <div className="flex justify-between items-start mb-4">
          <div className="w-9 h-9 bg-boza-black text-boza-cream flex items-center justify-center text-sm">
            <i className="fas fa-users"></i>
          </div>
          <span className="text-xs font-bold text-boza-brown">+{stats.newClientsThisMonth}</span>
        </div>
        <div className="font-display text-2xl font-black text-boza-black mb-1">{stats.totalClients}</div>
        <div className="text-xs text-boza-taupe">Clients inscrits</div>
      </div>

      <div className="bg-boza-cream-alt p-[22px]">
        <div className="flex justify-between items-start mb-4">
          <div className="w-9 h-9 bg-boza-black text-boza-cream flex items-center justify-center text-sm">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <span className="text-xs font-bold text-boza-taupe">{stats.lowStockCount}</span>
        </div>
        <div className="font-display text-2xl font-black text-boza-black mb-1">{stats.lowStockCount}</div>
        <div className="text-xs text-boza-taupe">Produits en stock faible</div>
      </div>
    </div>
  );
}