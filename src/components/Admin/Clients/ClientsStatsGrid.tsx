import { ClientStats } from "@/lib/clients";

export default function ClientsStatsGrid({ stats }: { stats: ClientStats }) {
  return (
    <div className="grid grid-cols-4 gap-5 mb-10 max-[968px]:grid-cols-2">
      <div className="bg-boza-cream-alt p-[22px]">
        <div className="flex justify-between items-start mb-4">
          <div className="w-9 h-9 bg-boza-black text-boza-cream flex items-center justify-center text-sm">
            <i className="fas fa-users"></i>
          </div>
        </div>
        <div className="font-display text-2xl font-black text-boza-black mb-1">{stats.totalClients}</div>
        <div className="text-xs text-boza-taupe">Clients au total</div>
      </div>

      <div className="bg-boza-cream-alt p-[22px]">
        <div className="flex justify-between items-start mb-4">
          <div className="w-9 h-9 bg-boza-black text-boza-cream flex items-center justify-center text-sm">
            <i className="fas fa-user-plus"></i>
          </div>
          {stats.newTrendPct !== null && (
            <span className={`text-xs font-bold ${stats.newTrendPct >= 0 ? "text-boza-brown" : "text-boza-taupe"}`}>
              {stats.newTrendPct >= 0 ? "+" : ""}{stats.newTrendPct}%
            </span>
          )}
        </div>
        <div className="font-display text-2xl font-black text-boza-black mb-1">{stats.newThisMonth}</div>
        <div className="text-xs text-boza-taupe">Nouveaux ce mois</div>
      </div>

      <div className="bg-boza-cream-alt p-[22px]">
        <div className="flex justify-between items-start mb-4">
          <div className="w-9 h-9 bg-boza-black text-boza-cream flex items-center justify-center text-sm">
            <i className="fas fa-redo"></i>
          </div>
        </div>
        <div className="font-display text-2xl font-black text-boza-black mb-1">{stats.recurringPct}%</div>
        <div className="text-xs text-boza-taupe">Clients récurrents</div>
      </div>

      <div className="bg-boza-cream-alt p-[22px]">
        <div className="flex justify-between items-start mb-4">
          <div className="w-9 h-9 bg-boza-black text-boza-cream flex items-center justify-center text-sm">
            <i className="fas fa-coins"></i>
          </div>
        </div>
        <div className="font-display text-2xl font-black text-boza-black mb-1">
          {stats.averageBasket.toFixed(2).replace(".", ",")} €
        </div>
        <div className="text-xs text-boza-taupe">Panier moyen</div>
      </div>
    </div>
  );
}