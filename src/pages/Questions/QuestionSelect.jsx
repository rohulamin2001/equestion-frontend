import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Check,
  ChevronLeft,
  Eye,
  Info,
  Loader2,
  Search,
  Sliders,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import RichTextRender from "../../components/RichTextRender.jsx";
import { useQuestions } from "./hook/useQuestions";

export default function QuestionSelect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get("setId") || "";

  const {
    loadingSets,
    activeSetId,
    setActiveSetId,
    activeSet,
    bankQuestions,
    loadingBank,
    fetchNextBankPage,
    hasMoreBankQuestions,
    searchKeyword,
    setSearchKeyword,
    uniqueMode,
    setUniqueMode,
    selectedLevels,
    setSelectedLevels,
    selectedTags,
    setSelectedTags,
    updateQuestionSet,
  } = useQuestions();

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [initializedSetId, setInitializedSetId] = useState(null);

  // Set active set ID on load
  useEffect(() => {
    if (targetId && activeSetId !== targetId) {
      setActiveSetId(targetId);
    }
  }, [targetId, activeSetId, setActiveSetId]);

  // Sync selected questions with the set's existing questions once loaded
  if (activeSet && activeSet._id !== initializedSetId) {
    setInitializedSetId(activeSet._id);
    setSelectedQuestions(activeSet.questions || []);
  }

  const handleSaveQuestions = async () => {
    if (!activeSetId) return;
    try {
      const qIds = selectedQuestions.map((q) => q._id || q);
      await updateQuestionSet.mutateAsync({
        id: activeSetId,
        payload: { questions: qIds },
      });
      toast.success("প্রশ্নমালা সফলভাবে সংরক্ষণ করা হয়েছে!");

      // Redirect back to preview page with all setId parameters preserved
      const idsParam =
        searchParams.get("setId") || searchParams.get("setIds") || activeSetId;
      navigate(`/dashboard/questions?setId=${idsParam}`);
    } catch (err) {
      console.error("Error saving questions:", err);
      toast.error("প্রশ্ন সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleCancel = () => {
    const idsParam =
      searchParams.get("setId") ||
      searchParams.get("setIds") ||
      activeSetId ||
      "";
    navigate(`/dashboard/questions?setId=${idsParam}`);
  };

  // Toggle selection
  const handleToggleQuestion = (q) => {
    const isSelected = selectedQuestions.some((sq) => (sq._id || sq) === q._id);
    setSelectedQuestions((prev) =>
      isSelected ? prev.filter((sq) => (sq._id || sq) !== q._id) : [...prev, q],
    );
  };

  // Select all questions currently shown in bank questions
  const handleSelectAllShown = () => {
    const newQuestions = bankQuestions.filter(
      (q) => !selectedQuestions.some((sq) => (sq._id || sq) === q._id),
    );
    if (newQuestions.length === 0) {
      // If all are already selected, clear current page selection
      setSelectedQuestions((prev) =>
        prev.filter(
          (sq) => !bankQuestions.some((bq) => bq._id === (sq._id || sq)),
        ),
      );
    } else {
      setSelectedQuestions((prev) => [...prev, ...newQuestions]);
    }
  };

  const allShownSelected = useMemo(() => {
    if (bankQuestions.length === 0) return false;
    return bankQuestions.every((bq) =>
      selectedQuestions.some((sq) => (sq._id || sq) === bq._id),
    );
  }, [bankQuestions, selectedQuestions]);

  if (loadingSets || !activeSet) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-500 font-semibold">
          প্রশ্ন ডেটা লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-bengali text-left">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition rounded-lg"
            >
              <ChevronLeft className="size-5" />
            </button>
            <h1 className="text-lg font-black text-slate-800">
              {activeSet.examName} • {activeSet.subjectName}
            </h1>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            শ্রেণী: {activeSet.className} • মোট মার্কস: {activeSet.totalMarks} (
            {selectedQuestions.length} টি নির্বাচিত)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSelectAllShown}
            className={`px-4 py-2 border rounded-xl text-xs font-bold transition cursor-pointer select-none ${
              allShownSelected
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {allShownSelected ? "সব নির্বাচন বাতিল" : "সব নির্বাচন করুন"}
          </button>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <Eye className="size-4" />
            প্রিভিউ ({selectedQuestions.length})
          </button>

          <button
            onClick={handleSaveQuestions}
            disabled={updateQuestionSet.isPending}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {updateQuestionSet.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            সেভ করুন
          </button>
        </div>
      </div>

      {/* Main Grid: Left Questions area, Right sidebar filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Middle Area (8 cols): Questions List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-700 flex items-center gap-1">
              <BookOpen className="size-4 text-indigo-600" />
              প্রশ্নব্যাংক থেকে প্রশ্ন নির্বাচন করুন
            </h2>

            {loadingBank ? (
              <div className="h-60 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <p className="text-[11px] text-slate-400">
                  প্রশ্নসমূহ লোড হচ্ছে...
                </p>
              </div>
            ) : bankQuestions.length === 0 ? (
              <div className="border border-dashed border-slate-200 bg-slate-50/30 p-12 rounded-2xl text-center">
                <Info className="h-8 w-8 text-slate-350 mx-auto mb-2" />
                <p className="text-xs text-slate-400">
                  কোনো মেলানো প্রশ্ন পাওয়া যায়নি। দয়া করে অন্য ফিল্টার চেষ্টা
                  করুন।
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bankQuestions.map((q) => {
                  const isSelected = selectedQuestions.some(
                    (sq) => (sq._id || sq) === q._id,
                  );
                  return (
                    <div
                      key={q._id}
                      onClick={() => handleToggleQuestion(q)}
                      className={`border p-4 rounded-2xl transition cursor-pointer flex justify-between gap-4 text-left ${
                        isSelected
                          ? "bg-indigo-50/20 border-indigo-300 shadow-sm"
                          : "bg-white border-slate-150 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-2 text-[13px] text-slate-800 flex-1">
                        {/* MCQ Stem/Options */}
                        {q.category === "MCQ" && q.mcqData && (
                          <div className="space-y-1.5">
                            <div className="font-bold">
                              <RichTextRender html={q.mcqData.questionText} />
                            </div>
                            {q.mcqData.options && (
                              <div className="grid grid-cols-2 gap-1.5 text-slate-600 text-[13px]">
                                {q.mcqData.options.map((opt, oIdx) => (
                                  <div key={oIdx}>
                                    {["ক", "খ", "গ", "ঘ"][oIdx]}। {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* CQ Stem/Questions */}
                        {q.category === "Creative" && q.creativeData && (
                          <div className="space-y-1.5">
                            <div className="font-bold italic text-slate-500 bg-slate-50 p-2 border rounded-lg">
                              <RichTextRender html={q.creativeData.stem} />
                            </div>
                            {q.creativeData.subQuestions && (
                              <div className="space-y-1 pl-2 text-slate-600 text-[13px]">
                                {Object.entries(
                                  q.creativeData.subQuestions,
                                ).map(([key, sq], sqIdx) => (
                                  <div key={key}>
                                    {["ক", "খ", "গ", "ঘ"][sqIdx]}) {sq.text}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* General questions */}
                        {q.category !== "MCQ" &&
                          q.category !== "Creative" &&
                          q.generalData && (
                            <div className="font-bold">
                              <RichTextRender
                                html={q.generalData.questionText}
                              />
                            </div>
                          )}

                        {/* Badges footer */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[9px] font-bold text-slate-400 uppercase">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/50">
                            {q.level === "Knowledge"
                              ? "জ্ঞান"
                              : q.level === "Understanding"
                                ? "অনুধাবন"
                                : q.level === "Application"
                                  ? "প্রয়োগ"
                                  : "উচ্চতর দক্ষতা"}
                          </span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/50">
                            {q.difficulty === "Easy"
                              ? "সহজ"
                              : q.difficulty === "Medium"
                                ? "মধ্যম"
                                : "কঠিন"}
                          </span>
                        </div>
                      </div>

                      {/* Checkbox circle selector */}
                      <div className="shrink-0 flex items-center justify-center">
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white scale-110 shadow"
                              : "bg-white border-slate-250"
                          }`}
                        >
                          {isSelected && <Check className="size-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Infinite Load More button */}
                {hasMoreBankQuestions && (
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={fetchNextBankPage}
                      className="px-6 py-2.5 bg-slate-50 border text-slate-600 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition cursor-pointer"
                    >
                      আরও প্রশ্ন লোড করুন
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Area (4 cols): Filters Menu */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-glass-elevated border border-slate-200/50 p-5 rounded-2xl space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="size-3.5" />
              অ্যাডভান্সড ফিল্টার মেনু
            </h3>

            {/* Keyword Search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="কীওয়ার্ড সার্চ করুন"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 h-10 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-sans"
                />
              </div>
            </div>

            {/* Unique Mode Toggle */}
            <div className="border border-slate-100 bg-slate-50 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700">
                  ইউনিক মোড
                </span>
                <button
                  type="button"
                  onClick={() => setUniqueMode(!uniqueMode)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    uniqueMode ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                      uniqueMode ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                পূর্বে তৈরি করা প্রশ্ন বাদ দিয়ে নতুন প্রশ্ন তৈরি হবে, একটি
                পরীক্ষার সাথে অন্য পরীক্ষার প্রশ্ন মিল হবে না।
              </p>
            </div>

            {/* Cognitive Level Checklist */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                কগনিটিভ লেভেল
              </h4>
              {[
                { value: "Knowledge", label: "জ্ঞান" },
                { value: "Understanding", label: "অনুধাবন" },
                { value: "Application", label: "প্রয়োগ" },
                { value: "Higher Order", label: "উচ্চতর দক্ষতা" },
              ].map((lvl) => {
                const isChecked = selectedLevels.includes(lvl.value);
                return (
                  <label
                    key={lvl.value}
                    className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        setSelectedLevels((prev) =>
                          isChecked
                            ? prev.filter((l) => l !== lvl.value)
                            : [...prev, lvl.value],
                        )
                      }
                      className="size-3.5 accent-indigo-600 rounded border-slate-350"
                    />
                    <span>{lvl.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Special Search flags checkboxes */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                প্রশ্নব্যাংক স্পেশাল সার্চ
              </h4>
              {[
                { value: "Exercise", label: "অনুশীলনী" },
                { value: "HasImage", label: "চিত্রযুক্ত" },
                { value: "MultipleCompletion", label: "বহুপদী" },
                { value: "StimulusBased", label: "অভিন্ন তথ্যভিত্তিক" },
              ].map((tag) => {
                const isChecked = selectedTags.includes(tag.value);
                return (
                  <label
                    key={tag.value}
                    className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        setSelectedTags((prev) =>
                          isChecked
                            ? prev.filter((t) => t !== tag.value)
                            : [...prev, tag.value],
                        )
                      }
                      className="size-3.5 accent-indigo-600 rounded border-slate-350"
                    />
                    <span>{tag.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Questions Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-glass-elevated backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-800 font-bengali">
              নির্বাচিত প্রশ্ন প্রিভিউ ({selectedQuestions.length} টি)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              নির্বাচিত প্রশ্নগুলোর খসড়া তালিকা
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4 font-bengali text-xs">
            {selectedQuestions.length === 0 ? (
              <p className="text-center text-slate-400 py-6">
                কোনো প্রশ্ন নির্বাচিত নেই।
              </p>
            ) : (
              selectedQuestions.map((q, idx) => (
                <div key={q._id} className="border-b pb-3 flex gap-2">
                  <span className="font-extrabold text-slate-400">
                    {(idx + 1).toLocaleString("bn-BD")}।
                  </span>
                  <div className="flex-1 space-y-2">
                    {q.category === "MCQ" && q.mcqData && (
                      <div className="space-y-1">
                        <div className="font-bold">
                          <RichTextRender html={q.mcqData.questionText} />
                        </div>
                        {q.mcqData.options && (
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500">
                            {q.mcqData.options.map((opt, oIdx) => (
                              <div key={oIdx}>
                                {["ক", "খ", "গ", "ঘ"][oIdx]}। {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {q.category === "Creative" && q.creativeData && (
                      <div className="space-y-1">
                        <div className="font-bold bg-slate-50 p-1.5 border rounded">
                          <RichTextRender html={q.creativeData.stem} />
                        </div>
                        {q.creativeData.subQuestions && (
                          <div className="space-y-0.5 text-slate-600 pl-2">
                            {Object.entries(q.creativeData.subQuestions).map(
                              ([key, sq], sqIdx) => (
                                <div key={key}>
                                  {["ক", "খ", "গ", "ঘ"][sqIdx]}) {sq.text}
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {q.category !== "MCQ" &&
                      q.category !== "Creative" &&
                      q.generalData && (
                        <div className="font-bold">
                          <RichTextRender html={q.generalData.questionText} />
                        </div>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition font-bengali"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={handleSaveQuestions}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition font-bengali"
            >
              নিশ্চিত করুন ও সেভ দিন
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
