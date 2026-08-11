import { Check, ChevronRight, ShieldCheck } from "lucide-react";
import {
  formatBdt,
  getSavingsLabel,
  hasDiscount,
} from "../utils/formatPackagePrice";

export default function PricingCard({
  pkg,
  Icon,
  isSubscribed,
  isPurchasing,
  onSelect,
}) {
  const savingsLabel = getSavingsLabel(pkg);
  const isFree = pkg.price === 0;
  const showDiscount = hasDiscount(pkg);

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-glass-elevated p-6 shadow-soft backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-hover ${
        isSubscribed
          ? "border-emerald-200/80 bg-emerald-50/30 ring-2 ring-emerald-200/80"
          : "border-slate-200/50 hover:border-purple-200/80"
      }`}
    >
      {isSubscribed && (
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 shadow-sm">
          <ShieldCheck className="size-3.5" />
          <span>সক্রিয়</span>
        </div>
      )}

      {isFree && !isSubscribed && (
        <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-l from-amber-500 to-orange-500 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
          ফ্রি অফার
        </div>
      )}

      <header className={`mb-5 ${isSubscribed ? "mt-8" : ""}`}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-purple-200/60 bg-purple-50/80 text-[var(--purple-700)] shadow-sm">
                <Icon className="size-5" />
              </div>
            )}
            <div className="min-w-0 text-left">
              <h3 className="text-lg font-bold leading-snug text-slate-900">
                {pkg.title}
              </h3>
              <span className="mt-1 inline-flex rounded-md border border-slate-200/70 bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                {pkg.version}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
          {isFree ? (
            <>
              <span className="text-4xl font-black tracking-tight text-orange-600">
                ৳{formatBdt(0)}
              </span>
              {pkg.originalPrice > 0 && (
                <span className="text-sm text-slate-400 line-through">
                  ৳{formatBdt(pkg.originalPrice)}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-4xl font-black tracking-tight text-[var(--purple-800)]">
                ৳{formatBdt(pkg.price)}
              </span>
              {showDiscount && pkg.originalPrice > pkg.price && (
                <span className="text-sm text-slate-400 line-through">
                  ৳{formatBdt(pkg.originalPrice)}
                </span>
              )}
            </>
          )}

          {!isFree && (
            <span className="pb-1 text-xs font-medium text-slate-500">
              / {pkg.period}
            </span>
          )}
        </div>

        {savingsLabel && (
          <span className="mt-2 inline-flex rounded-full border border-purple-200/70 bg-purple-50 px-2.5 py-1 text-[10px] font-bold text-[var(--purple-800)]">
            {savingsLabel}
          </span>
        )}
      </header>

      <div className="mb-5 h-px bg-gradient-to-r from-transparent via-purple-200/70 to-transparent" />

      <ul
        className={`mb-6 flex-1 space-y-2.5 ${
          pkg.features?.length > 6 ? "max-h-48 overflow-y-auto pr-1" : ""
        }`}
      >
        {(pkg.features || []).map((feat, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-xs font-medium leading-relaxed text-slate-600"
          >
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="size-2.5 stroke-[3]" />
            </span>
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        disabled={isPurchasing || isSubscribed}
        className={`mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-semibold transition ${
          isSubscribed
            ? "cursor-default border border-emerald-200/80 bg-emerald-50 text-emerald-700"
            : "cursor-pointer bg-gradient-to-r from-[var(--purple-700)] to-[var(--purple-800)] text-white shadow-md shadow-purple-200/60 hover:from-[var(--purple-800)] hover:to-[var(--purple-900)]"
        } disabled:opacity-70`}
      >
        {isSubscribed ? (
          <>
            <Check className="size-4" />
            <span>সক্রিয় রয়েছে</span>
          </>
        ) : (
          <>
            <span>
              {isFree ? "বিনামূল্যে অ্যাক্টিভেট করুন" : "ক্রয় করুন"}
            </span>
            <ChevronRight className="size-3.5" />
          </>
        )}
      </button>
    </article>
  );
}
