import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCategoryDisplayName } from "@/constants/categories";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  extractQuestionMetadata,
  getQuestionMarks,
  toBnNumber,
} from "../../utils/questionUtils";
import QuestionBodyContent from "./QuestionBodyContent";

/**
 * Rich save-confirmation preview dialog using MyQuestions-grade 15px typography,
 * inline reorder controls, answer visibility toggle, and question metadata badges.
 */
export default function QuestionPreviewModal({
  open,
  onOpenChange,
  activeSet,
  selectedQuestions,
  availableChapters,
  onReorderSelected,
  onRemoveSelected,
  onSave,
  saving,
}) {
  const [showAnswersInPreview, setShowAnswersInPreview] = useState(false);

  const selectedMarks = selectedQuestions.reduce(
    (sum, q) => sum + getQuestionMarks(q),
    0,
  );
  const targetMarks = Number(activeSet?.totalMarks) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[88vh] flex flex-col bg-white/95 backdrop-blur-xl border border-purple-200/80 shadow-2xl rounded-3xl p-0 overflow-hidden font-bengali">
        {/* Modal Header */}
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-purple-50/90 via-white to-purple-50/50 border-b border-purple-100 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6">
            <div>
              <DialogTitle className="text-lg font-bold text-slate-800">
                নির্বাচিত প্রশ্ন প্রিভিউ ও বিন্যাস ({toBnNumber(selectedQuestions.length)} টি)
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                {activeSet?.examName} • {activeSet?.subjectName} • অর্জিত নম্বর:{" "}
                <strong className="text-[#720A7B]">
                  {toBnNumber(selectedMarks)}
                </strong>
                {targetMarks > 0 ? ` / ${toBnNumber(targetMarks)}` : ""}
              </DialogDescription>
            </div>

            <button
              type="button"
              onClick={() => setShowAnswersInPreview((v) => !v)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition self-start sm:self-auto ${
                showAnswersInPreview
                  ? "bg-[#900EB0] text-white border-[#900EB0]"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-purple-50"
              }`}
            >
              {showAnswersInPreview ? (
                <EyeOff className="size-3.5" />
              ) : (
                <Eye className="size-3.5" />
              )}
              <span>
                {showAnswersInPreview ? "উত্তর লুকান" : "উত্তর ও বিশ্লেষণ দেখান"}
              </span>
            </button>
          </div>
        </DialogHeader>

        {/* Questions Scroll Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4">
          {selectedQuestions.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              কোনো প্রশ্ন নির্বাচিত নেই। প্রশ্নব্যাংক থেকে প্রশ্ন নির্বাচন করুন।
            </div>
          ) : (
            selectedQuestions.map((q, idx) => {
              const qId = q._id || q;
              const meta = extractQuestionMetadata(q, availableChapters);
              const catLabel =
                getCategoryDisplayName(q.category, q.subjectId?.subjectName) ||
                q.category;

              return (
                <div
                  key={qId}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-3"
                >
                  {/* Top Meta + Reorder Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                      {meta.uid && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                          #{meta.uid}
                        </span>
                      )}
                      {q.chapterNumber !== undefined &&
                        q.chapterNumber !== null && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60">
                            অধ্যায় {toBnNumber(q.chapterNumber)}
                          </span>
                        )}
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-[#720A7B] border border-purple-200/60">
                        {catLabel}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded border ${meta.difficultyMeta.className}`}
                      >
                        {meta.difficultyMeta.label}
                      </span>
                      {meta.boardYearPairs.slice(0, 2).map((by, bIdx) => (
                        <span
                          key={bIdx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                        >
                          {by}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onReorderSelected(idx, idx - 1)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-purple-50 text-slate-600 disabled:opacity-35 cursor-pointer"
                        title="উপরে তুলুন"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === selectedQuestions.length - 1}
                        onClick={() => onReorderSelected(idx, idx + 1)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-purple-50 text-slate-600 disabled:opacity-35 cursor-pointer"
                        title="নিচে নামান"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveSelected(qId)}
                        className="p-1.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        title="প্রশ্নটি বাদ দিন"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Full Rich Question Content (15px) */}
                  <QuestionBodyContent
                    question={q}
                    serialLabel={`${toBnNumber(idx + 1)}।`}
                    isAnswerVisible={showAnswersInPreview}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/80 shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer transition"
          >
            বন্ধ করুন
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            নিশ্চিত করুন ও সেভ দিন
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
