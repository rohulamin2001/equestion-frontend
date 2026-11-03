import { CATEGORIES_MAP } from "@/constants/categories";
import { Check, Layers3 } from "lucide-react";
import { motion } from "motion/react";

const getCategoryLabel = (cat) => {
  const found = CATEGORIES_MAP.find((c) => c.value === cat);
  return found ? found.label : cat;
};

export default function CategoryStatsBreakdown({
  categories = [],
  selectedCategory = null,
  onSelectCategory,
  chapterName = "",
}) {
  const totalInChapter = categories.reduce((sum, c) => sum + (c.count || 0), 0);

  return (
    <div className="space-y-2.5 sm:space-y-3 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-50/40 via-white to-slate-50 border border-purple-100/90 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 border-b border-purple-100/60 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-[var(--purple-100)] text-[var(--purple-700)] shrink-0">
            <Layers3 className="size-3.5 sm:size-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
              {chapterName
                ? `${chapterName} - ক্যাটাগরি বিশ্লেষণ`
                : "ক্যাটাগরি ভিত্তিক প্রশ্ন বণ্টন"}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate hidden xs:block">
              ক্যাটাগরির ওপর ক্লিক করে নিচে প্রশ্ন ফিল্টার করতে পারেন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start xs:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onSelectCategory({ category: "" })}
            className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-lg border transition-colors font-medium cursor-pointer ${
              !selectedCategory
                ? "bg-[var(--purple-700)] text-white border-transparent shadow-2xs"
                : "bg-white text-slate-600 border-slate-200 active:bg-slate-50"
            }`}
          >
            সব ({totalInChapter?.toLocaleString("bn-BD")})
          </button>
        </div>
      </div>

      {/* Categories Grid (Highly Responsive for Mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {categories.map((catItem) => {
          const isSelected = selectedCategory === catItem.category;
          const label = getCategoryLabel(catItem.category);

          return (
            <motion.button
              key={catItem.category}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(catItem)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-colors flex flex-col justify-between gap-1.5 sm:gap-2 cursor-pointer relative overflow-hidden min-h-[64px] sm:min-h-[72px] ${
                isSelected
                  ? "bg-white border-[var(--purple-600)] shadow-xs ring-2 ring-[var(--purple-600)]/20"
                  : "bg-white border-slate-200/90 active:bg-slate-50/90"
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 p-0.5 rounded-full bg-[var(--purple-600)] text-white">
                  <Check className="size-2.5 sm:size-3" />
                </div>
              )}

              <div className="space-y-0.5 pr-4">
                <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-purple-50 text-[var(--purple-700)] inline-block">
                  {catItem.category}
                </span>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-800 line-clamp-1">
                  {label}
                </p>
              </div>

              <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                <span className="text-[9px] sm:text-[10px] text-slate-400">
                  প্রশ্ন
                </span>
                <span className="text-xs sm:text-sm font-bold text-[var(--purple-700)]">
                  {catItem.count?.toLocaleString("bn-BD")}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
