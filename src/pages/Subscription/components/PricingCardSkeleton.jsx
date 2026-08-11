export default function PricingCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col rounded-2xl border border-slate-200/60 bg-glass-elevated p-6 shadow-soft">
      <div className="mb-5 flex items-start gap-3">
        <div className="size-10 rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded-md bg-slate-100" />
          <div className="h-4 w-16 rounded-md bg-slate-100" />
        </div>
      </div>

      <div className="mb-5 space-y-2">
        <div className="h-10 w-1/2 rounded-md bg-slate-100" />
        <div className="h-5 w-24 rounded-full bg-slate-100" />
      </div>

      <div className="mb-5 h-px bg-slate-100" />

      <div className="mb-6 flex-1 space-y-2.5">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center gap-2.5">
            <div className="size-4 rounded-full bg-slate-100" />
            <div className="h-3 flex-1 rounded-md bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="h-11 w-full rounded-xl bg-slate-100" />
    </div>
  );
}
