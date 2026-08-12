import {
  Building2,
  CheckCircle2,
  GraduationCap,
  MessageSquareQuote,
  School,
  Users,
} from "lucide-react";
import { TARGET_USERS } from "../data/landingContent";

const ICONS = { GraduationCap, School, Building2, Users };

const COLOR_CONFIG = {
  violet: {
    glow: "rgba(139, 92, 246, 0.12)",
    border:
      "border-violet-200/80 hover:border-violet-400/80 hover:shadow-violet-500/10",
    badge: "bg-violet-100 text-violet-700 border-violet-200/80",
    accent: "#7c3aed",
    bg: "bg-gradient-to-br from-violet-50/70 via-purple-50/20 to-white",
    quoteBg: "bg-violet-50/50 border-violet-200/50",
  },
  purple: {
    glow: "rgba(168, 85, 247, 0.12)",
    border:
      "border-purple-200/80 hover:border-purple-400/80 hover:shadow-purple-500/10",
    badge: "bg-purple-100 text-purple-700 border-purple-200/80",
    accent: "#9333ea",
    bg: "bg-gradient-to-br from-purple-50/70 via-indigo-50/20 to-white",
    quoteBg: "bg-purple-50/50 border-purple-200/50",
  },
  blue: {
    glow: "rgba(59, 130, 246, 0.12)",
    border:
      "border-blue-200/80 hover:border-blue-400/80 hover:shadow-blue-500/10",
    badge: "bg-blue-100 text-blue-700 border-blue-200/80",
    accent: "#2563eb",
    bg: "bg-gradient-to-br from-blue-50/70 via-indigo-50/20 to-white",
    quoteBg: "bg-blue-50/50 border-blue-200/50",
  },
  emerald: {
    glow: "rgba(16, 185, 129, 0.12)",
    border:
      "border-emerald-200/80 hover:border-emerald-400/80 hover:shadow-emerald-500/10",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200/80",
    accent: "#10b981",
    bg: "bg-gradient-to-br from-emerald-50/70 via-teal-50/20 to-white",
    quoteBg: "bg-emerald-50/50 border-emerald-200/50",
  },
};

export default function TargetUsers() {
  return (
    <section
      id="users"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/20 via-white to-slate-50/40 pointer-events-none" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[750px] rounded-full blur-[140px] opacity-20"
        style={{ background: "rgba(139, 92, 246, 0.25)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-14 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-purple-50 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-purple-800 font-bengali">
            <Users className="size-3.5" />
            সকলের জন্য তৈরি
          </span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight leading-snug text-foreground font-bengali">
            কার জন্য স্মার্ট প্রশ্নব্যাংক?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-bengali max-w-xl mx-auto">
            শিক্ষক, শিক্ষা প্রতিষ্ঠান, কোচিং সেন্টার ও শিক্ষার্থীদের জন্য তৈরি
            সুনির্দিষ্ট ফিচারসমূহ।
          </p>
        </div>

        {/* 2x2 Grid Layout (Top 2, Bottom 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 font-bengali">
          {TARGET_USERS.map((user) => {
            const cfg = COLOR_CONFIG[user.color] || COLOR_CONFIG.violet;
            const Icon = ICONS[user.icon] || Users;

            return (
              <article
                key={user.title}
                className={`relative rounded-2xl sm:rounded-3xl border ${cfg.border} ${cfg.bg} p-4 sm:p-6 lg:p-7 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between`}
                style={{
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* Header: Icon, Title & Stat Badge */}
                  <div className="flex items-start justify-between gap-2.5 sm:gap-4">
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                      <div
                        className="flex size-10 xs:size-11 sm:size-13 md:size-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl text-white shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}bb)`,
                          boxShadow: `0 4px 14px ${cfg.accent}25`,
                        }}
                      >
                        <Icon className="size-5 sm:size-6 md:size-7 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base xs:text-lg sm:text-xl font-extrabold text-foreground leading-snug truncate">
                          {user.title}
                        </h3>
                        <p className="text-[11px] xs:text-xs sm:text-sm text-muted-foreground mt-0.5 leading-snug">
                          {user.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold shrink-0 shadow-xs ${cfg.badge}`}
                    >
                      {user.stat} {user.statLabel}
                    </span>
                  </div>

                  {/* Highlights List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-1 sm:pt-2">
                    {user.highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-white/80 bg-white/70 p-2 sm:p-2.5 text-[11px] xs:text-xs sm:text-sm font-semibold text-foreground shadow-xs"
                      >
                        <CheckCircle2
                          className="size-3.5 sm:size-4 shrink-0 mt-0.5"
                          style={{ color: cfg.accent }}
                        />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quote Box Footer */}
                <blockquote
                  className={`mt-3.5 sm:mt-5 rounded-xl sm:rounded-2xl border ${cfg.quoteBg} p-2.5 sm:p-3.5 text-[11px] xs:text-xs sm:text-sm font-medium italic text-foreground flex items-center gap-2 sm:gap-3`}
                >
                  <MessageSquareQuote
                    className="size-3.5 sm:size-4 shrink-0 opacity-40"
                    style={{ color: cfg.accent }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium leading-tight">"{user.quote}"</p>
                  </div>
                </blockquote>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
