import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  UserPlus,
  Users,
} from "lucide-react";
import { formatCurrencyBDT } from "../constants/subscriberConstants";

export default function SubscriberStatsCards({
  stats,
  statusFilter,
  onSelectStatus,
}) {
  const cards = [
    {
      id: "all",
      label: "মোট সাবস্ক্রাইবার",
      value: (stats.totalSubscribers || 0).toLocaleString("bn-BD"),
      subtext: `মোট আয়: ${formatCurrencyBDT(stats.totalRevenue || 0)}`,
      icon: Users,
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-200/70",
      activeRing: "ring-2 ring-indigo-500 border-indigo-300 bg-indigo-50/30",
    },
    {
      id: "active",
      label: "অ্যাক্টিভ পেইড",
      value: (stats.activePaidCount || 0).toLocaleString("bn-BD"),
      subtext: "চলমান সাবস্ক্রিপশন",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
      activeRing: "ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/30",
    },
    {
      id: "expiring_soon",
      label: "৭ দিনে মেয়াদ শেষ",
      value: (stats.expiringSoonCount || 0).toLocaleString("bn-BD"),
      subtext: "রিনিউয়াল রিমাইন্ডার দিন",
      icon: AlertTriangle,
      iconBg: "bg-amber-50 text-amber-600 border-amber-200/70",
      activeRing: "ring-2 ring-amber-500 border-amber-300 bg-amber-50/30",
    },
    {
      id: "free",
      label: "ফ্রি / প্ল্যান নেই",
      value: (stats.freeLeadCount || 0).toLocaleString("bn-BD"),
      subtext: "সম্ভাব্য ক্রেতা (Leads)",
      icon: UserPlus,
      iconBg: "bg-slate-100 text-slate-600 border-slate-200",
      activeRing: "ring-2 ring-slate-500 border-slate-300 bg-slate-50",
    },
    {
      id: "suspended",
      label: "স্থগিত / ব্লকড",
      value: (stats.suspendedCount || 0).toLocaleString("bn-BD"),
      subtext: `মেয়াদোত্তীর্ণ: ${(stats.expiredCount || 0).toLocaleString("bn-BD")}`,
      icon: Ban,
      iconBg: "bg-rose-50 text-rose-600 border-rose-200/70",
      activeRing: "ring-2 ring-rose-500 border-rose-300 bg-rose-50/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = statusFilter === card.id;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={`text-left rounded-2xl border p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
              isActive
                ? card.activeRing
                : "bg-white border-slate-100 hover:border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-500 font-bengali truncate">
                  {card.label}
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1 tracking-tight">
                  {card.value}
                </p>
              </div>
              <div
                className={`p-2 rounded-xl border shrink-0 ${card.iconBg}`}
              >
                <Icon className="size-4" />
              </div>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-2 truncate font-bengali">
              {card.subtext}
            </p>
          </button>
        );
      })}
    </div>
  );
}
