import { PackageOpen } from "lucide-react";
import { motion } from "motion/react";
import PricingCard from "./PricingCard";
import PricingCardSkeleton from "./PricingCardSkeleton";

export default function PricingCardGrid({
  packages,
  loading,
  selectedCategory,
  selectedVersion,
  activeSubs,
  categoryIcon: Icon,
  isPurchasing,
  onSelectPackage,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <PricingCardSkeleton key={n} />
        ))}
      </div>
    );
  }

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.category === selectedCategory &&
      (pkg.version || "Bangla") === selectedVersion,
  );

  if (filteredPackages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-glass-elevated px-6 py-14 text-center shadow-soft">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-purple-200/60 bg-purple-50/80 text-[var(--purple-700)]">
          <PackageOpen className="size-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          এই ক্যাটাগরিতে কোনো প্যাকেজ নেই
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          অন্য ভার্সন বা ক্যাটাগরি নির্বাচন করে দেখুন।
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {filteredPackages.map((pkg, idx) => {
        const isSubscribed = activeSubs.some(
          (s) => s.packageId === pkg.id && s.version === pkg.version,
        );

        return (
          <motion.div
            key={`${pkg.id}-${pkg.version}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.35 }}
            className="h-full"
          >
            <PricingCard
              pkg={pkg}
              Icon={Icon}
              isSubscribed={isSubscribed}
              isPurchasing={isPurchasing}
              onSelect={() => onSelectPackage(pkg)}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
