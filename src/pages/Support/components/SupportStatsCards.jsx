import { CheckCircle2, Clock3, FileText, Star } from "lucide-react";

export function SupportStatsCards({ stats, isStatsLoading }) {
  const cards = [
    {
      label: "মোট টিকেট",
      count: stats?.total || 0,
      color: "text-purple-700",
      bg: "bg-purple-50 border border-purple-200/60",
      icon: FileText,
    },
    {
      label: "ওপেন/প্রক্রিয়াধীন",
      count: (stats?.open || 0) + (stats?.inProgress || 0),
      color: "text-rose-600",
      bg: "bg-rose-50 border border-rose-200/60",
      icon: Clock3,
    },
    {
      label: "সমাধানকৃত",
      count: (stats?.resolved || 0) + (stats?.closed || 0),
      color: "text-emerald-600",
      bg: "bg-emerald-50 border border-emerald-200/60",
      icon: CheckCircle2,
    },
    {
      label: "গড় সন্তুষ্টি (CSAT)",
      count: `${stats?.avgRating || "5.0"} ★`,
      color: "text-amber-600",
      bg: "bg-amber-50 border border-amber-200/60",
      icon: Star,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((stat, i) => {
        const IconComp = stat.icon;
        return (
          <div
            key={i}
            className="bg-white/[0.45] hover:bg-white/[0.65] p-4 rounded-2xl border border-black/[0.04] backdrop-blur-md shadow-soft transition flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block uppercase tracking-wider font-sans">
                {stat.label}
              </span>
              <span className="text-lg sm:text-2xl font-bold text-slate-800 block font-sans">
                {isStatsLoading ? "..." : stat.count}
              </span>
            </div>
            <div
              className={`size-10 sm:size-11 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 shadow-2xs`}
            >
              <IconComp className="size-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
