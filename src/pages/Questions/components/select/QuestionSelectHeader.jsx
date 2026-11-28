import { getCategoryDisplayName } from "@/constants/categories";
import { CLASSES_MAP } from "@/constants/classes";
import { Check, ChevronLeft, Eye, EyeOff, Loader2, Save } from "lucide-react";
import {
  getChapterNames,
  getQuestionMarks,
  toBnNumber,
} from "../../utils/questionUtils";

/**
 * Sticky glassmorphic top header bar displaying exam metadata, live marks progress,
 * global answer visibility toggle, select-all, preview trigger, and Save button.
 */
export default function QuestionSelectHeader({
  activeSet,
  syllabusList,
  selectedQuestions,
  allShownSelected,
  hasVisibleQuestions,
  globalShowAnswers,
  onToggleGlobalAnswers,
  onToggleSelectAll,
  onOpenPreview,
  onSave,
  onCancel,
  saving,
}) {
  const targetMarks = Number(activeSet?.totalMarks) || 0;
  const selectedMarks = selectedQuestions.reduce(
    (sum, q) => sum + getQuestionMarks(q),
    0,
  );
  const progressPct =
    targetMarks > 0
      ? Math.min(100, Math.round((selectedMarks / targetMarks) * 100))
      : 0;
  const isOverLimit = targetMarks > 0 && selectedMarks > targetMarks;
  const isExactMatch = targetMarks > 0 && selectedMarks === targetMarks;

  const classLabel =
    CLASSES_MAP.find((c) => c.value === activeSet?.className)?.label ||
    activeSet?.className ||
    "";
  const categoryLabel =
    activeSet?.category === "Combined"
      ? "সমন্বিত প্রশ্নপত্র"
      : getCategoryDisplayName(activeSet?.category, activeSet?.subjectName) ||
        activeSet?.category ||
        "";
  const chapterText = activeSet ? getChapterNames(activeSet, syllabusList) : "";

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-purple-200/70 rounded-2xl p-3.5 sm:px-4 sm:py-3.5 shadow-sm space-y-2.5 font-bengali">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Left: Back Button + Compact Exam Metadata */}
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={onCancel}
            className="size-8 mt-0.5 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-[#900EB0] border border-slate-200/80 transition rounded-xl flex items-center justify-center cursor-pointer shrink-0"
            title="প্রশ্ন সেট তালিকায় ফিরে যান"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[14px] sm:text-[15px] font-bold text-slate-800 tracking-tight truncate">
                {activeSet?.examName} • {activeSet?.subjectName}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#900EB0]/10 text-[#720A7B] border border-[#900EB0]/20 text-[10px] font-bold shrink-0">
                {categoryLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-500 leading-snug">
              <span className="shrink-0">
                শ্রেণী: <strong className="text-slate-700">{classLabel}</strong>
              </span>
              {chapterText && (
                <span className="truncate max-w-full sm:max-w-lg" title={chapterText}>
                  <span className="text-slate-300 mr-2">•</span>
                  অধ্যায়: <strong className="text-slate-700">{chapterText}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Single-Row Sleek Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0 pl-10 xl:pl-0">
          <button
            type="button"
            onClick={onToggleGlobalAnswers}
            className={`h-8 px-2.5 border rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              globalShowAnswers
                ? "bg-[#900EB0]/10 border-[#900EB0]/30 text-[#720A7B]"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {globalShowAnswers ? (
              <EyeOff className="size-3.5" />
            ) : (
              <Eye className="size-3.5" />
            )}
            <span>{globalShowAnswers ? "উত্তর লুকান" : "সব উত্তর"}</span>
          </button>

          <button
            type="button"
            disabled={!hasVisibleQuestions}
            onClick={onToggleSelectAll}
            className={`h-8 px-2.5 border rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer select-none whitespace-nowrap disabled:opacity-45 ${
              allShownSelected
                ? "bg-purple-50 border-purple-300 text-[#720A7B]"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Check className="size-3.5" />
            <span>{allShownSelected ? "সব বাতিল" : "সব বাছুন"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPreview}
            className="h-8 px-3 bg-purple-50 hover:bg-purple-100 text-[#720A7B] border border-purple-200/80 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
          >
            <Eye className="size-3.5" />
            <span>প্রিভিউ ({toBnNumber(selectedQuestions.length)})</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-sm shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>সেভ করুন</span>
          </button>
        </div>
      </div>

      {/* Bottom Compact Marks & Target Progress Bar */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-purple-50/80 text-slate-600 font-semibold border border-purple-100">
            নির্বাচিত:{" "}
            <strong className="text-[#900EB0]">
              {toBnNumber(selectedQuestions.length)} টি
            </strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 font-semibold border border-slate-200/70">
            নম্বর:{" "}
            <strong
              className={
                isOverLimit
                  ? "text-rose-600"
                  : isExactMatch
                    ? "text-emerald-600"
                    : "text-slate-800"
              }
            >
              {toBnNumber(selectedMarks)}
            </strong>
            {targetMarks > 0 && (
              <span className="text-slate-400">
                {" "}
                / {toBnNumber(targetMarks)}
              </span>
            )}
          </span>
          {targetMarks > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isOverLimit
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : isExactMatch
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {isOverLimit
                ? `${toBnNumber(selectedMarks - targetMarks)} নম্বর অতিরিক্ত`
                : isExactMatch
                  ? "পূর্ণমান সম্পন্ন!"
                  : `আরও ${toBnNumber(targetMarks - selectedMarks)} বাকি`}
            </span>
          )}
        </div>

        {targetMarks > 0 && (
          <div className="w-full sm:w-44 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPct}%` }}
              className={`h-full rounded-full transition-all duration-300 ${
                isOverLimit
                  ? "bg-rose-500"
                  : isExactMatch
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-[#900EB0] to-[#B010CA]"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
