import Editor from "@/components/Editor";
import RichTextRender from "@/components/RichTextRender";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/ui/ripple-button";
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  HelpCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  CATEGORIES_MAP,
  CLASSES_MAP,
  DIFFICULTY_MAP,
  LEVEL_LABELS,
  TYPE_LABELS,
  useAddQuestion,
} from "./hook/useAddQuestion";

const stripHtml = (html) => {
  if (!html) return "";
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent || doc.body.innerText || "";
    return text.replace(/\u00a0/g, " ").trim();
  } catch {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  }
};

export default function AddQuestion() {
  const {
    qm,
    activeDropdown,
    setActiveDropdown,
    showStep2Error,
    formActiveTypes,
    formActiveLevels,
    formActiveClasses,
    handleFormTypeChange,
    handleFormLevelChange,
    isStep1Valid,
    handleNextStep,
    handlePrevStep,
    handleStepClick,
    handleChapterSelect,
    handleTopicToggle,
    activeSchools,
    activeBoards,
    activeYears,
    activeLevels,
    activeSpecialSearches,
    deleteConfirmId,
    setDeleteConfirmId,
  } = useAddQuestion();

  return (
    <div className="space-y-6 pb-12 w-full font-bengali">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-glass p-3.5 sm:p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-base sm:text-2xl font-bold text-slate-800 tracking-tight font-sans">
            নতুন প্রশ্ন যোগ করুন
          </h1>
          <p className="text-slate-500 text-[11px] sm:text-sm mt-0.5 sm:mt-1 leading-snug">
            NCTB কারিকুলাম ও স্তর অনুযায়ী নতুন MCQ বা সৃজনশীল প্রশ্ন তৈরি করুন।
          </p>
        </div>
        <Button
          variant="outline"
          onClick={qm.resetForm}
          className="border-black/[0.08] text-slate-600 hover:bg-black/[0.03] rounded-xl bg-white/[0.45] backdrop-blur-sm shadow-sm h-8 sm:h-9 text-xs font-semibold px-3 sm:px-4 shrink-0"
        >
          রিসেট ফর্ম
        </Button>
      </div>

      {/* Wizard Step Progress Bar */}
      <div className="bg-glass p-3.5 sm:px-8 sm:pt-8 sm:pb-14 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm overflow-hidden">
        {/* Step labels row */}
        <div className="flex items-start justify-between max-w-5xl mx-auto relative">
          {/* Background track line — from right edge of circle 1 to left edge of circle 3 */}
          <div
            className="absolute top-[18px] sm:top-[30px] h-[2px] sm:h-[3px] bg-slate-200/80 rounded-full transition-all duration-300"
            style={{
              left: "calc(16.667% + 18px)",
              right: "calc(16.667% + 18px)",
            }}
          />

          {/* Animated progress fill */}
          <motion.div
            className="absolute top-[18px] sm:top-[30px] h-[2px] sm:h-[3px] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full origin-left"
            initial={false}
            animate={{ scaleX: (qm.activeStep - 1) / 2 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            style={{
              left: "calc(16.667% + 18px)",
              right: "calc(16.667% + 18px)",
              transformOrigin: "left",
            }}
          />

          {[
            {
              step: 1,
              label: "ক্যাটাগরি ও মেটাডাটা",
              icon: <Database className="size-4 sm:size-5" />,
            },
            {
              step: 2,
              label: "প্রশ্ন এডিটর",
              icon: <FileText className="size-4 sm:size-5" />,
            },
            {
              step: 3,
              label: "প্রিভিউ ও সংরক্ষণ",
              icon: <Save className="size-4 sm:size-5" />,
            },
          ].map((item) => {
            const isCompleted = qm.activeStep > item.step;
            const isActive = qm.activeStep === item.step;

            return (
              <div
                key={item.step}
                className="flex flex-col items-center relative z-10 gap-1.5 sm:gap-3"
                style={{ flex: "1 1 0", maxWidth: "33.33%" }}
              >
                <motion.button
                  onClick={() => handleStepClick(item.step)}
                  disabled={item.step > 2 && !isStep1Valid()}
                  whileHover={{ scale: isCompleted || isActive ? 1.08 : 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  animate={
                    isActive
                      ? {
                          scale: 1.1,
                          boxShadow: "0 8px 25px rgba(79,70,229,0.35)",
                        }
                      : isCompleted
                        ? {
                            scale: 1,
                            boxShadow: "0 4px 14px rgba(79,70,229,0.22)",
                          }
                        : { scale: 1, boxShadow: "none" }
                  }
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className={`w-9 h-9 sm:w-[60px] sm:h-[60px] rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer outline-none ${
                    isCompleted
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0"
                      : isActive
                        ? "bg-white border-[2.5px] sm:border-[3px] border-indigo-500 text-indigo-600"
                        : "bg-white/60 border-2 border-slate-200 text-slate-400"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.3, ease: "backOut" }}
                      >
                        <CheckCircle2
                          className="size-4 sm:size-[26px] text-white"
                          strokeWidth={2.5}
                        />
                      </motion.span>
                    ) : (
                      <motion.span
                        key={`icon-${item.step}`}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center justify-center"
                      >
                        {item.icon}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="flex flex-col items-center gap-0.5 sm:gap-1 text-center px-0.5">
                  <motion.span
                    animate={{
                      color: isActive
                        ? "#4F46E5"
                        : isCompleted
                          ? "#6D28D9"
                          : "#94a3b8",
                      fontWeight: isActive ? 700 : 600,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-[10px] sm:text-[13px] font-sans leading-tight text-center break-words max-w-[85px] sm:max-w-none sm:whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                  <motion.span
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[9px] sm:text-[10px] font-sans text-indigo-400 font-medium"
                  >
                    চলমান
                  </motion.span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Steps Content Layout */}
      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          {/* STEP 1: Metadata Inputs */}
          {qm.activeStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative z-10"
            >
              {/* Left Column: Syllabus Fields */}
              <div className="md:col-span-2 bg-glass p-3.5 sm:p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-4 sm:space-y-5 relative z-20">
                <div className="border-b border-black/[0.05] pb-2 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-800 text-xs sm:text-[16px] flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <BookOpen className="size-3.5 sm:size-4 text-[#4F46E5]" />
                    সিলেবাস ও অধ্যায় লিঙ্ক করুন
                  </h3>
                  {(() => {
                    const selectedSub = qm.formSubjects.find(
                      (s) => s._id === qm.formSubjectId,
                    );
                    if (!selectedSub) return null;
                    return (
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-[10px] sm:text-xs font-bold">
                          <span className="text-indigo-400">পূর্ণমান:</span>
                          {selectedSub?.subjectId?.totalMarks || "—"}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-amber-700 text-[10px] sm:text-xs font-bold">
                          <span className="text-amber-500">সাল:</span>
                          {new Date().getFullYear()}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Type Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      প্রতিষ্ঠান এর ধরণ
                    </label>
                    <div
                      className={`relative ${activeDropdown === "type" ? "z-30" : "z-10"}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === "type" ? null : "type",
                          )
                        }
                        className="w-full px-4 border border-black/[0.08] rounded-xl text-sm bg-white/[0.45] hover:bg-white/[0.60] hover:border-[#4F46E5]/40 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm backdrop-blur-sm"
                      >
                        {TYPE_LABELS[qm.formType] || qm.formType}
                        <ChevronRight
                          className={`size-4 text-slate-400 transition-transform duration-200 ${activeDropdown === "type" ? "rotate-90" : ""}`}
                        />
                      </button>

                      {activeDropdown === "type" && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 shadow-2xl rounded-xl z-40 max-h-56 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            {formActiveTypes.map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  handleFormTypeChange(type);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition ${
                                  qm.formType === type
                                    ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {TYPE_LABELS[type] || type}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Level Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      শিক্ষার স্তর
                    </label>
                    <div
                      className={`relative ${activeDropdown === "level" ? "z-30" : "z-10"}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === "level" ? null : "level",
                          )
                        }
                        className="w-full px-4 border border-black/[0.08] rounded-xl text-sm bg-white/[0.45] hover:bg-white/[0.60] hover:border-[#4F46E5]/40 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm backdrop-blur-sm"
                      >
                        {LEVEL_LABELS[qm.formLevel] || qm.formLevel}
                        <ChevronRight
                          className={`size-4 text-slate-400 transition-transform duration-200 ${activeDropdown === "level" ? "rotate-90" : ""}`}
                        />
                      </button>

                      {activeDropdown === "level" && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 shadow-2xl rounded-xl z-40 max-h-56 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            {formActiveLevels.map((level) => (
                              <button
                                key={level}
                                type="button"
                                onClick={() => {
                                  handleFormLevelChange(level);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition ${
                                  qm.formLevel === level
                                    ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {LEVEL_LABELS[level] || level}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Class Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      শ্রেণী
                    </label>
                    <div
                      className={`relative ${activeDropdown === "class" ? "z-30" : "z-10"}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === "class" ? null : "class",
                          )
                        }
                        className="w-full px-4 border border-black/[0.08] rounded-xl text-sm bg-white/[0.45] hover:bg-white/[0.60] hover:border-[#4F46E5]/40 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm backdrop-blur-sm"
                      >
                        {formActiveClasses.find((c) => c.value === qm.formClass)
                          ?.label || qm.formClass}
                        <ChevronRight
                          className={`size-4 text-slate-400 transition-transform duration-200 ${activeDropdown === "class" ? "rotate-90" : ""}`}
                        />
                      </button>

                      {activeDropdown === "class" && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 shadow-2xl rounded-xl z-40 max-h-56 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            {formActiveClasses.map((cls) => (
                              <button
                                key={cls.value}
                                type="button"
                                onClick={() => {
                                  qm.setFormClass(cls.value);
                                  qm.setFormGroup("General");
                                  qm.setFormSubjectId("");
                                  qm.setFormChapterNumber("");
                                  qm.setFormTopics([]);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition ${
                                  qm.formClass === cls.value
                                    ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {cls.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Version Selection (Only shown if both Bangla and English versions are active in config) */}
                  {(!qm.config?.versions || qm.config.versions.length > 1) && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        ভার্সন
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "Bangla", label: "বাংলা" },
                          { value: "English", label: "ইংরেজি" },
                          { value: "Madrasah", label: "মাদ্রাসা" },
                        ].map((ver) => {
                          const isSelected = qm.formVersion === ver.value;
                          return (
                            <label
                              key={ver.value}
                              className={`flex items-center justify-center gap-1 py-2 px-1.5 sm:px-2.5 rounded-xl border text-xs font-bold select-none transition-all duration-200 h-11 ${
                                qm.formLoading
                                  ? "pointer-events-none"
                                  : "cursor-pointer"
                              } ${
                                isSelected
                                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                                  : "bg-white/[0.45] border-black/[0.08] text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white/[0.60]"
                              }`}
                            >
                              <input
                                type="radio"
                                name="formVersion"
                                checked={isSelected}
                                onChange={() => qm.changeFormVersion(ver.value)}
                                disabled={qm.formLoading}
                                className="sr-only"
                              />
                              {ver.label}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Group Selection (Only for Class 9-12) */}
                  {["Class 9", "Class 10", "Class 11", "Class 12"].includes(
                    qm.formClass,
                  ) && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        গ্রুপ / বিভাগ
                      </label>
                      <div
                        className={`relative ${activeDropdown === "group" ? "z-30" : "z-10"}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === "group" ? null : "group",
                            )
                          }
                          className="w-full px-4 border border-black/[0.08] rounded-xl text-sm bg-white/[0.45] hover:bg-white/[0.60] hover:border-[#4F46E5]/40 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm backdrop-blur-sm"
                        >
                          {qm.formGroup === "Science"
                            ? "বিজ্ঞান (Science)"
                            : qm.formGroup === "Humanities"
                              ? "মানবিক (Humanities)"
                              : qm.formGroup === "Commerce"
                                ? "ব্যবসায় শিক্ষা (Commerce)"
                                : "সাধারণ (General)"}
                          <ChevronRight
                            className={`size-4 text-slate-400 transition-transform duration-200 ${activeDropdown === "group" ? "rotate-90" : ""}`}
                          />
                        </button>

                        {activeDropdown === "group" && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveDropdown(null)}
                            />
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 shadow-2xl rounded-xl z-40 max-h-56 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                              {[
                                { value: "General", label: "সাধারণ (General)" },
                                {
                                  value: "Science",
                                  label: "বিজ্ঞান (Science)",
                                },
                                {
                                  value: "Humanities",
                                  label: "মানবিক (Humanities)",
                                },
                                {
                                  value: "Commerce",
                                  label: "ব্যবসায় শিক্ষা (Commerce)",
                                },
                              ].map((grp) => (
                                <button
                                  key={grp.value}
                                  type="button"
                                  onClick={() => {
                                    qm.setFormGroup(grp.value);
                                    qm.setFormSubjectId("");
                                    qm.setFormChapterNumber("");
                                    qm.setFormTopics([]);
                                    setActiveDropdown(null);
                                  }}
                                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition ${
                                    qm.formGroup === grp.value
                                      ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                                      : "text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  {grp.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Subject Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      বিষয় (Subject)
                    </label>
                    <div
                      className={`relative ${activeDropdown === "subject" ? "z-30" : "z-10"}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === "subject" ? null : "subject",
                          )
                        }
                        className="w-full px-4 border border-black/[0.08] rounded-xl text-sm bg-white/[0.45] hover:bg-white/[0.60] hover:border-[#4F46E5]/40 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm backdrop-blur-sm disabled:bg-slate-50/50 disabled:text-slate-400"
                        disabled={qm.formSubjects.length === 0}
                      >
                        {qm.formSubjects.find((s) => s._id === qm.formSubjectId)
                          ?.subjectName || "বিষয় নির্বাচন করুন"}
                        <ChevronRight
                          className={`size-4 text-slate-400 transition-transform duration-200 ${activeDropdown === "subject" ? "rotate-90" : ""}`}
                        />
                      </button>

                      {activeDropdown === "subject" && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 shadow-2xl rounded-xl z-40 max-h-56 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            {qm.formSubjects.map((sub) => (
                              <button
                                key={sub._id}
                                type="button"
                                onClick={() => {
                                  qm.setFormSubjectId(sub._id);
                                  qm.setFormChapterNumber("");
                                  qm.setFormTopics([]);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition ${
                                  qm.formSubjectId === sub._id
                                    ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {sub.subjectName}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Question Category Select */}
              <div className="bg-glass p-4 sm:p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-4 relative z-10">
                <h3 className="font-bold text-slate-800 text-[16px] border-b border-black/[0.05] pb-2 flex items-center gap-2">
                  <FileText className="size-4 text-[#4F46E5]" />
                  প্রশ্ন ক্যাটাগরি
                </h3>

                <div className="flex flex-col gap-2">
                  {(() => {
                    const subjectConfiguredCategories =
                      qm.selectedSyllabusObj?.subjectId?.categories;

                    const ALL_CATEGORIES = CATEGORIES_MAP;

                    if (!qm.formSubjectId || !qm.selectedSyllabusObj) {
                      return (
                        <p className="text-xs text-slate-500 italic text-center py-4 font-bengali">
                          প্রথমে বিষয় নির্বাচন করুন
                        </p>
                      );
                    }

                    let activeCategories = [];
                    if (
                      subjectConfiguredCategories &&
                      Array.isArray(subjectConfiguredCategories) &&
                      subjectConfiguredCategories.length > 0
                    ) {
                      activeCategories = subjectConfiguredCategories.map(
                        (catVal) => {
                          const matched = ALL_CATEGORIES.find(
                            (c) => c.value === catVal,
                          );
                          return matched || { value: catVal, label: catVal };
                        },
                      );
                    }

                    if (activeCategories.length === 0) {
                      return (
                        <p className="text-xs text-red-500 italic text-center py-4 font-bengali">
                          এই বিষয়ের জন্য কোনো প্রশ্ন ক্যাটাগরি সেট করা নেই
                        </p>
                      );
                    }

                    return activeCategories.map((cat) => {
                      const isSelected = qm.formCategory === cat.value;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => qm.setFormCategory(cat.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition cursor-pointer flex justify-between items-center ${
                            isSelected
                              ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#4F46E5] ring-4 ring-[#4F46E5]/10 font-bold"
                              : "bg-white/[0.45] border-black/[0.06] text-slate-600 hover:bg-white/[0.60] hover:border-black/[0.12] backdrop-blur-sm"
                          }`}
                        >
                          {cat.label}
                          {isSelected && (
                            <span className="size-2 rounded-full bg-[#4F46E5]" />
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>

                <div className="pt-4">
                  <RippleButton
                    onClick={handleNextStep}
                    disabled={!isStep1Valid()}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED] text-white font-semibold h-11 rounded-xl shadow-md shadow-purple-500/10 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    পরবর্তী ধাপ
                    <ChevronRight className="size-4" />
                    <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
                  </RippleButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Question Input Editor */}
          {qm.activeStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="bg-glass p-6 sm:p-8 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-6"
            >
              <div className="flex justify-between items-center border-b border-black/[0.05] pb-3.5">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <HelpCircle className="size-5 text-[#4F46E5]" />
                  <span>
                    প্রশ্ন এডিটর -{" "}
                    {
                      CATEGORIES_MAP.find((c) => c.value === qm.formCategory)
                        ?.label
                    }
                  </span>
                </h3>
                <span className="bg-white/[0.45] border border-black/[0.06] backdrop-blur-sm text-slate-600 font-bold text-xs px-3 py-1 rounded-full">
                  {CLASSES_MAP.find((c) => c.value === qm.formClass)?.label} •{" "}
                  {
                    qm.formSubjects.find((s) => s._id === qm.formSubjectId)
                      ?.subjectName
                  }
                </span>
              </div>

              {/* Chapter & Difficulty Selection at the top of Step 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/[0.01] p-4 rounded-xl border border-black/[0.03]">
                {/* Chapter Selection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center h-4">
                    <label
                      className={`text-xs font-bold uppercase tracking-wider block ${showStep2Error && !qm.formChapterNumber ? "text-red-500 animate-pulse" : "text-slate-500"}`}
                    >
                      অধ্যায় (Chapter)
                    </label>
                    {showStep2Error && !qm.formChapterNumber && (
                      <span className="text-[11px] font-bold text-red-500 animate-pulse font-sans">
                        অধ্যায় নির্বাচন করা আবশ্যক
                      </span>
                    )}
                  </div>
                  <div
                    className={`relative ${activeDropdown === "chapter" ? "z-30" : "z-10"}`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "chapter" ? null : "chapter",
                        )
                      }
                      className={`w-full px-4 rounded-xl text-sm font-semibold text-slate-700 flex justify-between items-center h-10 shadow-sm transition-all border ${
                        showStep2Error && !qm.formChapterNumber
                          ? "border-red-500 bg-red-50/10 focus:ring-red-500/10 focus:border-red-500 hover:bg-red-50/20"
                          : "border-black/[0.08] bg-white hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5]"
                      }`}
                    >
                      {qm.formChapters.find(
                        (c) =>
                          c.chapterNumber.toString() === qm.formChapterNumber,
                      )
                        ? `অধ্যায় ${qm.formChapterNumber}: ${qm.formChapters.find((c) => c.chapterNumber.toString() === qm.formChapterNumber).chapterName}`
                        : "অধ্যায় নির্বাচন করুন"}
                      <ChevronRight
                        className={`size-4 transition-transform duration-200 ${
                          showStep2Error && !qm.formChapterNumber
                            ? "text-red-500"
                            : "text-slate-400"
                        } ${activeDropdown === "chapter" ? "rotate-90" : ""}`}
                      />
                    </button>

                    {activeDropdown === "chapter" && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveDropdown(null)}
                        />
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 max-h-56 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                          {qm.formChapters.map((chap) => (
                            <button
                              key={chap.chapterNumber}
                              type="button"
                              onClick={() => {
                                handleChapterSelect(
                                  chap.chapterNumber.toString(),
                                );
                                setActiveDropdown(null);
                              }}
                              className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                                qm.formChapterNumber ===
                                chap.chapterNumber.toString()
                                  ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {chap.chapterNumber}. {chap.chapterName}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    কাঠিন্যের স্তর (Difficulty)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(DIFFICULTY_MAP).map((diffKey) => {
                      const isSelected = qm.formDifficulty === diffKey;
                      const config = DIFFICULTY_MAP[diffKey];
                      return (
                        <button
                          key={diffKey}
                          type="button"
                          onClick={() => qm.setFormDifficulty(diffKey)}
                          className={`px-3 py-2 rounded-xl border text-sm font-semibold transition cursor-pointer flex justify-center items-center h-10 ${
                            isSelected
                              ? config.color + " ring-4 ring-[#4F46E5]/10"
                              : "bg-white border-black/[0.08] text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Topics tags multi selection */}
                {qm.formChapterNumber && (
                  <div className="md:col-span-2 space-y-2 pt-2 border-t border-black/[0.03] animate-in fade-in duration-300">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      নির্দিষ্ট টপিক সিলেক্ট করুন (ঐচ্ছিক)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(
                        qm.formChapters.find(
                          (c) =>
                            c.chapterNumber.toString() === qm.formChapterNumber,
                        )?.topics || []
                      ).map((topic, index) => {
                        const isSelected = qm.formTopics.includes(topic);
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleTopicToggle(topic)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                              isSelected
                                ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#4F46E5] font-bold"
                                : "bg-white border-black/[0.06] text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {isSelected ? `✓ #${topic}` : `#${topic}`}
                          </button>
                        );
                      })}
                      {(
                        qm.formChapters.find(
                          (c) =>
                            c.chapterNumber.toString() === qm.formChapterNumber,
                        )?.topics || []
                      ).length === 0 && (
                        <p className="text-xs text-slate-400 italic">
                          এই অধ্যায়ের অধীনে কোনো নির্দিষ্ট টপিক যুক্ত করা হয়নি।
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* DYNAMIC FORMS BASED ON CATEGORY */}
              {qm.formCategory === "MCQ" && (
                <div className="space-y-6">
                  {/* MCQ Type Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      MCQ ধরণ
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: "Simple", label: "সাধারণ বহুনির্বাচনি" },
                        {
                          value: "MultipleCompletion",
                          label: "বহুপদী সমাপ্তিসূচক",
                        },
                        {
                          value: "Contextual",
                          label: "অভিন্ন তথ্যভিত্তিক (উদ্দীপকযুক্ত)",
                        },
                      ].map((item) => (
                        <label
                          key={item.value}
                          className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700"
                        >
                          <input
                            type="radio"
                            name="mcqType"
                            value={item.value}
                            checked={qm.mcqType === item.value}
                            onChange={(e) => qm.setMcqType(e.target.value)}
                            className="accent-[#4F46E5] size-4"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Stem input (only for Contextual MCQs) */}
                  {qm.mcqType === "Contextual" && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        উদ্দীপক (নরমাল ফন্ট সাইজ ১৬ পিক্সেল রাখতে হবে)
                      </label>
                      <Editor
                        value={qm.mcqStem}
                        onChange={qm.setMcqStem}
                        placeholder="যেমন: নিচের অনুচ্ছেদটি পড়ো এবং প্রশ্নের উত্তর দাও..."
                        height={200}
                      />
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      প্রশ্ন (Question){" "}
                      <span className="normal-case tracking-normal">
                        (নরমাল ফন্ট সাইজ ১৬ পিক্সেল রাখতে হবে)
                      </span>
                    </label>
                    <Editor
                      value={qm.mcqQuestionText}
                      onChange={qm.setMcqQuestionText}
                      placeholder="যেমন: নিচের কোনটি মৌলিক সংখ্যা?"
                      height={200}
                    />
                  </div>

                  {/* Statements inputs (only for Multiple Completion) */}
                  {qm.mcqType === "MultipleCompletion" && (
                    <div className="space-y-3 p-5 bg-black/[0.02] border border-black/[0.05] rounded-2xl animate-in fade-in duration-200">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        বিবৃতিসমূহ (Statements)
                      </label>
                      {qm.mcqStatements.map((statement, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="font-bold text-slate-400 text-sm w-6 text-center">
                            {idx === 0 ? "i." : idx === 1 ? "ii." : "iii."}
                          </span>
                          <Input
                            placeholder={`বিবৃতি লিখুন`}
                            value={statement}
                            onChange={(e) => {
                              const updated = [...qm.mcqStatements];
                              updated[idx] = e.target.value;
                              qm.setMcqStatements(updated);
                            }}
                            className="bg-white/[0.45] border-black/[0.08] backdrop-blur-sm focus-visible:ring-[#4F46E5]/20 focus-visible:border-[#4F46E5]"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Options Input */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      অপশনসমূহ ও সঠিক উত্তর নির্বাচন
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {qm.mcqOptions.map((opt, idx) => {
                        const isCorrect = qm.mcqCorrectAnswer === idx;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                              isCorrect
                                ? "bg-emerald-500/5 border-emerald-500/30 backdrop-blur-sm shadow-sm"
                                : "bg-white/[0.45] border-black/[0.06] backdrop-blur-sm"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => qm.setMcqCorrectAnswer(idx)}
                              className={`size-6 rounded-full border flex items-center justify-center shrink-0 transition-all font-bold text-xs ${
                                isCorrect
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-black/[0.15] hover:border-[#4F46E5] text-transparent"
                              }`}
                            >
                              ✓
                            </button>
                            <span className="font-bold text-slate-500 text-sm">
                              {idx === 0
                                ? "ক)"
                                : idx === 1
                                  ? "খ)"
                                  : idx === 2
                                    ? "গ)"
                                    : "ঘ)"}
                            </span>
                            <input
                              type="text"
                              required
                              placeholder={`অপশন লিখুন`}
                              value={opt}
                              onChange={(e) => {
                                const updated = [...qm.mcqOptions];
                                updated[idx] = e.target.value;
                                qm.setMcqOptions(updated);
                              }}
                              className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-sm font-semibold text-slate-700"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      উত্তর বিশ্লেষণ / ব্যাখ্যা (ঐচ্ছিক){" "}
                      <span className="normal-case tracking-normal">
                        (নরমাল ফন্ট সাইজ ১৬ পিক্সেল রাখতে হবে)
                      </span>
                    </label>
                    <Editor
                      value={qm.mcqExplanation}
                      onChange={qm.setMcqExplanation}
                      placeholder="সঠিক উত্তর কিভাবে আসলো তার সংক্ষিপ্ত ব্যাখ্যা..."
                      height={200}
                    />
                  </div>
                </div>
              )}

              {qm.formCategory === "Creative" && (
                <div className="space-y-6">
                  {/* Stem input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      উদ্দীপক (নরমাল ফন্ট সাইজ ১৬ পিক্সেল রাখতে হবে)
                    </label>
                    <Editor
                      value={qm.creativeStem}
                      onChange={qm.setCreativeStem}
                      placeholder="অনুচ্ছেদ/তথ্যচিত্র এখানে লিখুন যা পড়ে সৃজনশীল প্রশ্নগুলোর উত্তর দিতে হবে..."
                      height={250}
                    />
                  </div>

                  {/* Creative sub questions (ক, খ, গ, ঘ) */}
                  <div className="space-y-4 border-t border-black/[0.05] pt-5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      প্রশ্নসমূহ
                    </label>

                    {[
                      {
                        id: "A",
                        label: "ক) জ্ঞানমূলক (১ নম্বর)",
                        value: qm.creativeCognitiveA,
                        setter: qm.setCreativeCognitiveA,
                        placeholder: "যেমন: শব্দ কাকে বলে?",
                        answerValue: qm.creativeCognitiveA_Answer,
                        answerSetter: qm.setCreativeCognitiveA_Answer,
                        answerPlaceholder: "ক নং প্রশ্নের উত্তর...",
                      },
                      {
                        id: "B",
                        label: "খ) অনুধাবনমূলক (২ নম্বর)",
                        value: qm.creativeCognitiveB,
                        setter: qm.setCreativeCognitiveB,
                        placeholder: "যেমন: উদাহরণসহ ব্যাখ্যা করো...",
                        answerValue: qm.creativeCognitiveB_Answer,
                        answerSetter: qm.setCreativeCognitiveB_Answer,
                        answerPlaceholder: "খ নং প্রশ্নের উত্তর...",
                      },
                      {
                        id: "C",
                        label: "গ) প্রয়োগমূলক (৩ নম্বর)",
                        value: qm.creativeCognitiveC,
                        setter: qm.setCreativeCognitiveC,
                        placeholder:
                          "যেমন: উদ্দীপকের ঘটনার আলোকে প্রমাণ করো...",
                        answerValue: qm.creativeCognitiveC_Answer,
                        answerSetter: qm.setCreativeCognitiveC_Answer,
                        answerPlaceholder: "গ নং প্রশ্নের উত্তর...",
                      },
                      {
                        id: "D",
                        label: "ঘ) উচ্চতর চিন্তাদক্ষতা (৪ নম্বর)",
                        value: qm.creativeCognitiveD,
                        setter: qm.setCreativeCognitiveD,
                        placeholder:
                          "যেমন: উদ্দীপকের ঘটনাটির যৌক্তিক মূল্যায়ন করো...",
                        answerValue: qm.creativeCognitiveD_Answer,
                        answerSetter: qm.setCreativeCognitiveD_Answer,
                        answerPlaceholder: "ঘ নং প্রশ্নের উত্তর...",
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="space-y-4 p-4 border border-black/[0.04] bg-white/[0.30] rounded-2xl"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[12px] font-bold text-slate-600 block">
                            {item.label}
                          </label>
                          <Input
                            required
                            placeholder={item.placeholder}
                            value={item.value}
                            onChange={(e) => item.setter(e.target.value)}
                            className="bg-white/[0.45] border-black/[0.08] backdrop-blur-sm focus-visible:ring-[#4F46E5]/20 focus-visible:border-[#4F46E5] h-11"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[12px] font-bold text-slate-600 block">
                            {item.id === "A"
                              ? "ক"
                              : item.id === "B"
                                ? "খ"
                                : item.id === "C"
                                  ? "গ"
                                  : "ঘ"}{" "}
                            নং প্রশ্নের উত্তর{" "}
                            <span className="normal-case tracking-normal">
                              (নরমাল ফন্ট সাইজ ১৬ পিক্সেল রাখতে হবে)
                            </span>
                          </label>
                          <Editor
                            value={item.answerValue}
                            onChange={item.answerSetter}
                            placeholder={item.answerPlaceholder}
                            height={150}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!["MCQ", "Creative"].includes(qm.formCategory) && (
                <div className="space-y-5">
                  {/* Main Question Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      প্রশ্ন (Question){" "}
                      <span className="normal-case tracking-normal">
                        (নরমাল ফন্ট সাইজ ১৬ পিক্সেল রাখতে হবে)
                      </span>
                    </label>
                    <Editor
                      value={qm.generalQuestionText}
                      onChange={qm.setGeneralQuestionText}
                      placeholder="প্রশ্ন লিখুন..."
                      height={200}
                    />
                  </div>

                  {/* Suggested Answer */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      উত্তর (Answer) - ঐচ্ছিক{" "}
                      <span className="normal-case tracking-normal">
                        (নরমাল ফন্ট সাইজ ১৬ পিক্সেল রাখতে হবে)
                      </span>
                    </label>
                    <Editor
                      value={qm.generalSuggestedAnswer}
                      onChange={qm.setGeneralSuggestedAnswer}
                      placeholder="উত্তর লিখুন..."
                      height={200}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Marks weight */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        প্রশ্ন নম্বর (Marks)
                      </label>
                      <Input
                        type="number"
                        required
                        value={qm.generalMarks}
                        onChange={(e) =>
                          qm.setGeneralMarks(Number(e.target.value))
                        }
                        className="bg-white/[0.45] border-black/[0.08] backdrop-blur-sm focus-visible:ring-[#4F46E5]/20 focus-visible:border-[#4F46E5] h-11"
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Question Metadata Link Section (School, Board, Year, Level, Special Search) */}
              <div className="p-5 bg-black/[0.01] border border-black/[0.04] rounded-2xl space-y-4 pt-4">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-black/[0.04] pb-2">
                  <Database className="size-4 text-[#4F46E5]" />
                  <span>প্রশ্ন মেটাডাটা লিঙ্ক করুন (ঐচ্ছিক)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Year Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      সাল / শিক্ষাবর্ষ
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === "year" ? null : "year",
                          )
                        }
                        className="w-full px-4 border border-black/[0.08] rounded-xl text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] font-semibold text-slate-700 flex justify-between items-center h-10 shadow-sm truncate pr-8 relative"
                      >
                        <span className="truncate pr-1">
                          {qm.formYear && qm.formYear.length > 0
                            ? qm.formYear.join(", ")
                            : "সাল নির্বাচন করুন"}
                        </span>
                        <ChevronRight
                          className={`size-4 text-slate-400 absolute right-4 transition-transform duration-200 ${activeDropdown === "year" ? "rotate-90" : ""}`}
                        />
                      </button>

                      {activeDropdown === "year" && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-black/[0.08] rounded-xl shadow-xl z-20 max-h-52 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <button
                              type="button"
                              onClick={() => {
                                qm.setFormYear([]);
                              }}
                              className="w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50"
                            >
                              রিসেট / খালি করুন
                            </button>
                            {activeYears.map((yr) => {
                              const isSelected =
                                qm.formYear && qm.formYear.includes(yr.name);
                              return (
                                <button
                                  key={yr._id}
                                  type="button"
                                  onClick={() => {
                                    const nextYears = isSelected
                                      ? qm.formYear.filter((y) => y !== yr.name)
                                      : [...(qm.formYear || []), yr.name];
                                    qm.setFormYear(nextYears);
                                  }}
                                  className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition flex justify-between items-center ${
                                    isSelected
                                      ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                                      : "text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  <span>{yr.name}</span>
                                  {isSelected && (
                                    <Check className="size-4 shrink-0 text-[#4F46E5]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Board Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      বোর্ড (Board)
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === "board" ? null : "board",
                          )
                        }
                        className="w-full px-4 border border-black/[0.08] rounded-xl text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] font-semibold text-slate-700 flex justify-between items-center h-10 shadow-sm truncate pr-8 relative"
                      >
                        <span className="truncate pr-1">
                          {qm.formBoard && qm.formBoard.length > 0
                            ? qm.formBoard.join(", ")
                            : "বোর্ড নির্বাচন করুন"}
                        </span>
                        <ChevronRight
                          className={`size-4 text-slate-400 absolute right-4 transition-transform duration-200 ${activeDropdown === "board" ? "rotate-90" : ""}`}
                        />
                      </button>

                      {activeDropdown === "board" && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-black/[0.08] rounded-xl shadow-xl z-20 max-h-52 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <button
                              type="button"
                              onClick={() => {
                                qm.setFormBoard([]);
                              }}
                              className="w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50"
                            >
                              রিসেট / খালি করুন
                            </button>
                            {activeBoards.map((bd) => {
                              const isSelected =
                                qm.formBoard && qm.formBoard.includes(bd.name);
                              return (
                                <button
                                  key={bd._id}
                                  type="button"
                                  onClick={() => {
                                    const nextBoards = isSelected
                                      ? qm.formBoard.filter(
                                          (b) => b !== bd.name,
                                        )
                                      : [...(qm.formBoard || []), bd.name];
                                    qm.setFormBoard(nextBoards);
                                  }}
                                  className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition flex justify-between items-center ${
                                    isSelected
                                      ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                                      : "text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  <span>
                                    {bd.name}{" "}
                                    {bd.shortName && `(${bd.shortName})`}
                                  </span>
                                  {isSelected && (
                                    <Check className="size-4 shrink-0 text-[#4F46E5]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* School Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      শীর্ষস্থানীয় স্কুল
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === "school" ? null : "school",
                          )
                        }
                        className="w-full px-4 border border-black/[0.08] rounded-xl text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] font-semibold text-slate-700 flex justify-between items-center h-10 shadow-sm truncate pr-8 relative"
                      >
                        <span className="truncate pr-1">
                          {qm.formSchool && qm.formSchool.length > 0
                            ? qm.formSchool.join(", ")
                            : "স্কুল নির্বাচন করুন"}
                        </span>
                        <ChevronRight
                          className={`size-4 text-slate-400 absolute right-4 transition-transform duration-200 ${activeDropdown === "school" ? "rotate-90" : ""}`}
                        />
                      </button>

                      {activeDropdown === "school" && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-black/[0.08] rounded-xl shadow-xl z-20 max-h-52 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <button
                              type="button"
                              onClick={() => {
                                qm.setFormSchool([]);
                              }}
                              className="w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50"
                            >
                              রিসেট / খালি করুন
                            </button>
                            {activeSchools.map((sch) => {
                              const isSelected =
                                qm.formSchool &&
                                qm.formSchool.includes(sch.name);
                              return (
                                <button
                                  key={sch._id}
                                  type="button"
                                  onClick={() => {
                                    const nextSchools = isSelected
                                      ? qm.formSchool.filter(
                                          (s) => s !== sch.name,
                                        )
                                      : [...(qm.formSchool || []), sch.name];
                                    qm.setFormSchool(nextSchools);
                                  }}
                                  className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition flex justify-between items-center ${
                                    isSelected
                                      ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                                      : "text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  <span>{sch.name}</span>
                                  {isSelected && (
                                    <Check className="size-4 shrink-0 text-[#4F46E5]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Level Tag Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      লেভেল (Level)
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === "levelTag" ? null : "levelTag",
                          )
                        }
                        className="w-full px-4 border border-black/[0.08] rounded-xl text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] font-semibold text-slate-700 flex justify-between items-center h-10 shadow-sm"
                      >
                        {qm.formLevelTag || "লেভেল নির্বাচন করুন"}
                        <ChevronRight
                          className={`size-4 text-slate-400 transition-transform duration-200 ${activeDropdown === "levelTag" ? "rotate-90" : ""}`}
                        />
                      </button>

                      {activeDropdown === "levelTag" && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-black/[0.08] rounded-xl shadow-xl z-20 max-h-52 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <button
                              type="button"
                              onClick={() => {
                                qm.setFormLevelTag("");
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50"
                            >
                              রিসেট / খালি করুন
                            </button>
                            {activeLevels.map((lvl) => (
                              <button
                                key={lvl._id}
                                type="button"
                                onClick={() => {
                                  qm.setFormLevelTag(lvl.name);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                                  qm.formLevelTag === lvl.name
                                    ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {lvl.name}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Special Search Keywords Multi-Select Tags */}
                {activeSpecialSearches.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-black/[0.03] animate-in fade-in duration-300">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      স্পেশাল সার্চ কিওয়ার্ড লিঙ্ক করুন (ঐচ্ছিক)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeSpecialSearches.map((ss) => {
                        const isSelected = qm.formSpecialSearch.includes(
                          ss.name,
                        );
                        return (
                          <button
                            key={ss._id}
                            type="button"
                            onClick={() => {
                              qm.setFormSpecialSearch((prev) =>
                                prev.includes(ss.name)
                                  ? prev.filter((t) => t !== ss.name)
                                  : [...prev, ss.name],
                              );
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                              isSelected
                                ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6] font-bold"
                                : "bg-white border-black/[0.06] text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {isSelected ? `✓ #${ss.name}` : `#${ss.name}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Draft Questions list inside Step 2 */}
              {!qm.editingQuestion && qm.questionsList.length > 0 && (
                <div className="space-y-3 pt-5 border-t border-black/[0.05] animate-in fade-in duration-200">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Database className="size-4 text-[#4F46E5]" />
                    <span>
                      যুক্ত করা প্রশ্নসমূহ ({qm.questionsList.length})
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                    {qm.questionsList.map((q, idx) => {
                      const catLabel =
                        CATEGORIES_MAP.find((c) => c.value === q.category)
                          ?.label || q.category;
                      const isEditingThis = qm.editingDraftId === q.id;
                      return (
                        <div
                          key={q.id || idx}
                          className={`flex items-center justify-between p-3.5 border rounded-xl text-xs font-semibold text-slate-700 transition-all duration-200 ${
                            isEditingThis
                              ? "bg-[#4F46E5]/5 border-[#4F46E5]/30 ring-1 ring-[#4F46E5]/20 shadow-sm"
                              : "bg-white/[0.30] border-black/[0.05]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="bg-[#4F46E5]/10 text-[#4F46E5] font-bold size-5 rounded-full flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-[#4F46E5] mr-2 uppercase text-[9px] bg-[#4F46E5]/10 px-1.5 py-0.5 rounded">
                                {catLabel}
                              </span>
                              <span className="truncate block mt-1 font-serif">
                                {q.category === "MCQ" &&
                                  stripHtml(q.mcqData?.questionText)}
                                {q.category === "Creative" &&
                                  stripHtml(q.creativeData?.stem)}
                                {!["MCQ", "Creative"].includes(q.category) &&
                                  stripHtml(q.generalData?.questionText)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => qm.editDraftQuestion(q.id)}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isEditingThis
                                  ? "text-[#4F46E5] bg-[#4F46E5]/10"
                                  : "text-slate-400 hover:text-[#4F46E5] hover:bg-[#4F46E5]/10"
                              }`}
                              title="এডিট করুন"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(q.id)}
                              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2 Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-black/[0.05]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="border-black/[0.10] text-slate-600 hover:bg-black/[0.02] rounded-xl h-10 px-5 flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                  পেছনে যান
                </Button>

                <div className="flex gap-3">
                  {qm.editingDraftId ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={qm.cancelEditDraft}
                        className="border-rose-200 text-rose-650 hover:bg-rose-50 hover:border-rose-300 rounded-xl h-10 px-5 flex items-center gap-1.5 font-semibold cursor-pointer bg-white/[0.45] backdrop-blur-sm"
                      >
                        বাতিল করুন
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={qm.updateDraftQuestion}
                        className="border-emerald-200 text-emerald-650 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl h-10 px-5 flex items-center gap-1.5 font-semibold cursor-pointer bg-white/[0.45] backdrop-blur-sm"
                      >
                        <Save className="size-4" />
                        আপডেট করুন
                      </Button>
                    </>
                  ) : (
                    !qm.editingQuestion && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={qm.addQuestionToList}
                        className="border-[#4F46E5]/20 text-[#4F46E5] hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/40 rounded-xl h-10 px-5 flex items-center gap-1.5 font-semibold cursor-pointer bg-white/[0.45] backdrop-blur-sm"
                      >
                        <Plus className="size-4" />
                        প্রশ্ন যুক্ত করুন
                      </Button>
                    )
                  )}
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white rounded-xl h-10 px-6 flex items-center gap-1.5 font-semibold cursor-pointer shadow-md shadow-purple-500/10"
                  >
                    প্রিভিউ দেখুন
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Live Preview & Submit */}
          {qm.activeStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Live Preview Paper Card (Left 2 cols) */}
              <div className="lg:col-span-2 bg-white/[0.80] backdrop-blur-md rounded-2xl border border-black/[0.08] shadow-xl overflow-hidden flex flex-col">
                <div className="border-b border-black/[0.05] bg-white/[0.5] backdrop-blur-md px-6 py-4 flex justify-between items-center">
                  <h4 className="font-bold text-sm text-slate-800 tracking-wide uppercase font-sans">
                    NCTB Live Exam Preview Sheet
                  </h4>
                  <span className="bg-[#4F46E5]/10 text-[#4F46E5] text-[11px] font-bold px-3 py-1 rounded-full border border-[#4F46E5]/20 whitespace-nowrap">
                    শ্রেণী:{" "}
                    {CLASSES_MAP.find((c) => c.value === qm.formClass)?.label}
                  </span>
                </div>

                {/* Exam Sheet Mockup */}
                <div className="p-8 flex-1 bg-white/[0.70] backdrop-blur-sm text-slate-800 space-y-8 select-none font-serif leading-relaxed max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* Header details */}
                  <div className="text-center space-y-1.5 border-b border-black/[0.05] pb-4">
                    <div className="text-xs text-slate-500 flex justify-center gap-4 font-sans font-semibold">
                      <span>
                        বিষয়:{" "}
                        {
                          qm.formSubjects.find(
                            (s) => s._id === qm.formSubjectId,
                          )?.subjectName
                        }
                      </span>
                      <span>অধ্যায়: {qm.formChapterNumber}</span>
                    </div>
                  </div>

                  {qm.questionsList.length > 0 ? (
                    <div className="space-y-8 divide-y divide-black/[0.05]">
                      {qm.questionsList.map((q, idx) => {
                        const diffConfig =
                          DIFFICULTY_MAP[q.difficulty] || DIFFICULTY_MAP.Medium;
                        const catLabel =
                          CATEGORIES_MAP.find((c) => c.value === q.category)
                            ?.label || q.category;

                        return (
                          <div
                            key={q.id || idx}
                            className={`space-y-4 ${idx > 0 ? "pt-6" : ""}`}
                          >
                            {/* Header tags for this item if multiple */}
                            <div className="flex flex-wrap gap-2 items-center text-[10px] font-sans font-bold text-slate-400 mb-2">
                              <span>
                                প্রশ্ন {(idx + 1).toLocaleString("bn-BD")}
                              </span>
                              <span>•</span>
                              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                                {catLabel}
                              </span>
                              <span>•</span>
                              <span
                                className={`px-2 py-0.5 rounded border ${diffConfig.color}`}
                              >
                                {diffConfig.label}
                              </span>
                              {q.year &&
                                (Array.isArray(q.year)
                                  ? q.year.length > 0
                                  : q.year) && (
                                  <>
                                    <span>•</span>
                                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
                                      {Array.isArray(q.year)
                                        ? q.year.join(", ")
                                        : q.year}
                                    </span>
                                  </>
                                )}
                              {q.board &&
                                (Array.isArray(q.board)
                                  ? q.board.length > 0
                                  : q.board) && (
                                  <>
                                    <span>•</span>
                                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                                      {Array.isArray(q.board)
                                        ? q.board.join(", ")
                                        : q.board}
                                    </span>
                                  </>
                                )}
                              {q.school &&
                                (Array.isArray(q.school)
                                  ? q.school.length > 0
                                  : q.school) && (
                                  <>
                                    <span>•</span>
                                    <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded truncate max-w-[150px]">
                                      {Array.isArray(q.school)
                                        ? q.school.join(", ")
                                        : q.school}
                                    </span>
                                  </>
                                )}
                              {q.level && (
                                <>
                                  <span>•</span>
                                  <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                                    {q.level}
                                  </span>
                                </>
                              )}
                              {q.specialSearch &&
                                q.specialSearch.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                                      {q.specialSearch.join(", ")}
                                    </span>
                                  </>
                                )}
                            </div>

                            {/* MCQ */}
                            {q.category === "MCQ" && q.mcqData && (
                              <div className="space-y-3">
                                {q.mcqData.mcqType === "Contextual" &&
                                  q.mcqData.stem && (
                                    <div className="p-4 bg-white/[0.40] border border-black/[0.04] shadow-sm rounded-xl text-sm italic font-serif leading-relaxed">
                                      <strong>উদ্দীপক:</strong>
                                      <RichTextRender
                                        content={q.mcqData.stem}
                                        className="mt-1"
                                      />
                                    </div>
                                  )}

                                <div className="text-[15px] flex justify-between items-start gap-4 w-full text-slate-800">
                                  <div className="flex gap-2">
                                    <span className="font-bold shrink-0">
                                      {(idx + 1).toLocaleString("bn-BD")}.
                                    </span>
                                    <RichTextRender
                                      content={
                                        q.mcqData.questionText ||
                                        "প্রশ্ন বিবরণ..."
                                      }
                                      className="font-normal"
                                    />
                                  </div>
                                  <span className="text-slate-700 text-xs font-sans font-bold whitespace-nowrap pt-1">
                                    {(q.mcqData?.marks || 1).toLocaleString(
                                      "bn-BD",
                                    )}
                                  </span>
                                </div>
                                {q.mcqData.mcqType === "MultipleCompletion" &&
                                  q.mcqData.statements && (
                                    <div className="space-y-1 pl-8 mt-2 font-normal text-sm font-sans">
                                      {q.mcqData.statements.map(
                                        (st, sIdx) =>
                                          st && (
                                            <div
                                              key={sIdx}
                                              className="flex gap-1 items-start"
                                            >
                                              <span className="shrink-0">
                                                {sIdx === 0
                                                  ? "i. "
                                                  : sIdx === 1
                                                    ? "ii. "
                                                    : "iii. "}
                                              </span>
                                              <RichTextRender
                                                content={st}
                                                className="inline-block font-sans font-normal"
                                              />
                                            </div>
                                          ),
                                      )}
                                      <div className="mt-2 font-semibold">
                                        নিচের কোনটি সঠিক?
                                      </div>
                                    </div>
                                  )}

                                {/* Options Grid */}
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-6 text-sm font-sans text-slate-700">
                                  {q.mcqData.options &&
                                    q.mcqData.options.map((opt, oIdx) => (
                                      <div
                                        key={oIdx}
                                        className="flex gap-1.5 items-center"
                                      >
                                        <span className="text-slate-400 shrink-0 font-semibold">
                                          {oIdx === 0
                                            ? "ক)"
                                            : oIdx === 1
                                              ? "খ)"
                                              : oIdx === 2
                                                ? "গ)"
                                                : "ঘ)"}
                                        </span>
                                        <RichTextRender
                                          content={opt || "অপশন..."}
                                          className="inline-block font-sans [&_p]:inline [&_p]:m-0 font-normal"
                                        />
                                      </div>
                                    ))}
                                </div>

                                <div className="mt-4 text-xs font-sans text-emerald-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2 w-fit">
                                  <CheckCircle2 className="size-4 shrink-0" />
                                  <span>
                                    <strong>সঠিক উত্তর:</strong>{" "}
                                    {q.mcqData.correctAnswer === 0
                                      ? "ক"
                                      : q.mcqData.correctAnswer === 1
                                        ? "খ"
                                        : q.mcqData.correctAnswer === 2
                                          ? "গ"
                                          : "ঘ"}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Creative */}
                            {q.category === "Creative" && q.creativeData && (
                              <div className="space-y-5">
                                {q.creativeData.stem && (
                                  <div className="p-5 bg-white/[0.40] border border-black/[0.04] shadow-sm rounded-xl text-sm leading-relaxed font-serif">
                                    <RichTextRender
                                      content={q.creativeData.stem}
                                    />
                                  </div>
                                )}

                                <div className="pl-4 space-y-3.5 text-sm font-sans font-normal text-slate-700">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="w-6">ক.</span>
                                      <span className="flex-1 font-serif font-normal text-slate-800">
                                        {q.creativeData.subQuestions?.cognitiveA
                                          ?.text || "জ্ঞানমূলক প্রশ্ন..."}
                                      </span>
                                      <span className="text-slate-700 text-xs font-bold">
                                        {(
                                          q.creativeData.subQuestions
                                            ?.cognitiveA?.marks || 1
                                        ).toLocaleString("bn-BD")}
                                      </span>
                                    </div>
                                    {q.creativeData.subQuestions?.cognitiveA
                                      ?.answer && (
                                      <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[15px] text-green-800 font-serif">
                                        <span className="font-bold text-green-700 mr-1.5">
                                          উত্তর:
                                        </span>
                                        <RichTextRender
                                          content={
                                            q.creativeData.subQuestions
                                              .cognitiveA.answer
                                          }
                                          inline={true}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="w-6">খ.</span>
                                      <span className="flex-1 font-serif font-normal text-slate-800">
                                        {q.creativeData.subQuestions?.cognitiveB
                                          ?.text || "অনুধাবনমূলক প্রশ্ন..."}
                                      </span>
                                      <span className="text-slate-700 text-xs font-bold">
                                        {(
                                          q.creativeData.subQuestions
                                            ?.cognitiveB?.marks || 2
                                        ).toLocaleString("bn-BD")}
                                      </span>
                                    </div>
                                    {q.creativeData.subQuestions?.cognitiveB
                                      ?.answer && (
                                      <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[15px] text-green-800 font-serif">
                                        <span className="font-bold text-green-700 mr-1.5">
                                          উত্তর:
                                        </span>
                                        <RichTextRender
                                          content={
                                            q.creativeData.subQuestions
                                              .cognitiveB.answer
                                          }
                                          inline={true}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="w-6">গ.</span>
                                      <span className="flex-1 font-serif font-normal text-slate-800">
                                        {q.creativeData.subQuestions?.cognitiveC
                                          ?.text || "প্রয়োগমূলক প্রশ্ন..."}
                                      </span>
                                      <span className="text-slate-700 text-xs font-bold">
                                        {(
                                          q.creativeData.subQuestions
                                            ?.cognitiveC?.marks || 3
                                        ).toLocaleString("bn-BD")}
                                      </span>
                                    </div>
                                    {q.creativeData.subQuestions?.cognitiveC
                                      ?.answer && (
                                      <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[15px] text-green-800 font-serif">
                                        <span className="font-bold text-green-700 mr-1.5">
                                          উত্তর:
                                        </span>
                                        <RichTextRender
                                          content={
                                            q.creativeData.subQuestions
                                              .cognitiveC.answer
                                          }
                                          inline={true}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="w-6">ঘ.</span>
                                      <span className="flex-1 font-serif font-normal text-slate-800">
                                        {q.creativeData.subQuestions?.cognitiveD
                                          ?.text ||
                                          "উচ্চতর চিন্তাদক্ষতা প্রশ্ন..."}
                                      </span>
                                      <span className="text-slate-700 text-xs font-bold">
                                        {(
                                          q.creativeData.subQuestions
                                            ?.cognitiveD?.marks || 4
                                        ).toLocaleString("bn-BD")}
                                      </span>
                                    </div>
                                    {q.creativeData.subQuestions?.cognitiveD
                                      ?.answer && (
                                      <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[15px] text-green-800 font-serif">
                                        <span className="font-bold text-green-700 mr-1.5">
                                          উত্তর:
                                        </span>
                                        <RichTextRender
                                          content={
                                            q.creativeData.subQuestions
                                              .cognitiveD.answer
                                          }
                                          inline={true}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* General */}
                            {!["MCQ", "Creative"].includes(q.category) &&
                              q.generalData && (
                                <div className="space-y-4">
                                  {q.generalData.stem && (
                                    <div className="p-4 bg-white/[0.40] border border-black/[0.04] shadow-sm rounded-xl text-sm italic font-serif">
                                      <RichTextRender
                                        content={q.generalData.stem}
                                      />
                                    </div>
                                  )}

                                  <div className="text-[15px] flex justify-between items-start gap-4 w-full text-slate-800">
                                    <div className="flex gap-2">
                                      <span className="font-bold shrink-0">
                                        {(idx + 1).toLocaleString("bn-BD")}.
                                      </span>
                                      <RichTextRender
                                        content={
                                          q.generalData.questionText ||
                                          "প্রশ্ন বিবরণ..."
                                        }
                                        className="font-serif font-normal inline-block"
                                      />
                                    </div>
                                    <span className="text-slate-700 text-xs font-sans font-bold whitespace-nowrap pt-1">
                                      {(
                                        q.generalData.marks || 0
                                      ).toLocaleString("bn-BD")}
                                    </span>
                                  </div>

                                  {q.generalData.suggestedAnswer && (
                                    <div className="p-3 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-[15px] text-slate-700">
                                      <strong className="text-[16px]">
                                        উত্তর:{" "}
                                      </strong>
                                      <RichTextRender
                                        content={q.generalData.suggestedAnswer}
                                        inline
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Metadata Tags for Single Question Preview */}
                      {(qm.formYear.length > 0 ||
                        qm.formBoard.length > 0 ||
                        qm.formSchool.length > 0 ||
                        qm.formLevel ||
                        qm.formSpecialSearch.length > 0) && (
                        <div className="flex flex-wrap gap-2 items-center text-[10px] font-sans font-bold text-slate-400 mb-2 border-b border-black/[0.03] pb-2">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                            {CATEGORIES_MAP.find(
                              (c) => c.value === qm.formCategory,
                            )?.label || qm.formCategory}
                          </span>
                          <span>•</span>
                          <span
                            className={`px-2 py-0.5 rounded border ${(DIFFICULTY_MAP[qm.formDifficulty] || DIFFICULTY_MAP.Medium).color}`}
                          >
                            {
                              (
                                DIFFICULTY_MAP[qm.formDifficulty] ||
                                DIFFICULTY_MAP.Medium
                              ).label
                            }
                          </span>
                          {qm.formYear && qm.formYear.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
                                {qm.formYear.join(", ")}
                              </span>
                            </>
                          )}
                          {qm.formBoard && qm.formBoard.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                                {qm.formBoard.join(", ")}
                              </span>
                            </>
                          )}
                          {qm.formSchool && qm.formSchool.length > 0 && (
                            <>
                              <span>•</span>
                              <span
                                className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded truncate max-w-[150px]"
                                title={qm.formSchool.join(", ")}
                              >
                                {qm.formSchool.join(", ")}
                              </span>
                            </>
                          )}
                          {qm.formLevel && (
                            <>
                              <span>•</span>
                              <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                                {LEVEL_LABELS[qm.formLevel] || qm.formLevel}
                              </span>
                            </>
                          )}
                          {qm.formSpecialSearch &&
                            qm.formSpecialSearch.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                                  {qm.formSpecialSearch.join(", ")}
                                </span>
                              </>
                            )}
                        </div>
                      )}

                      {/* Current Single Question Preview */}
                      {qm.formCategory === "MCQ" && qm.mcqQuestionText && (
                        <div className="space-y-4">
                          {qm.mcqType === "Contextual" && qm.mcqStem && (
                            <div className="p-4 bg-white/[0.40] border border-black/[0.04] shadow-sm rounded-xl text-sm italic font-serif">
                              <strong>উদ্দীপক:</strong>
                              <RichTextRender
                                content={qm.mcqStem}
                                className="mt-1"
                              />
                            </div>
                          )}

                          <div className="space-y-2.5">
                            <div className="text-[15px] flex justify-between items-start gap-4 w-full">
                              <div className="flex gap-2">
                                <span className="font-bold shrink-0">১.</span>
                                <RichTextRender
                                  content={qm.mcqQuestionText || "প্রশ্ন বিবরণ"}
                                />
                              </div>
                              <span className="text-slate-400 text-xs font-sans font-bold whitespace-nowrap pt-1           font-serif">
                                1
                              </span>
                            </div>
                            {qm.mcqType === "MultipleCompletion" && (
                              <div className="space-y-1 pl-8 mt-2 font-normal text-sm font-sans">
                                {qm.mcqStatements.map(
                                  (st, idx) =>
                                    st && (
                                      <div
                                        key={idx}
                                        className="flex gap-1 items-start"
                                      >
                                        <span className="shrink-0">
                                          {idx === 0
                                            ? "i. "
                                            : idx === 1
                                              ? "ii. "
                                              : "iii. "}
                                        </span>
                                        <RichTextRender
                                          content={st}
                                          className="inline-block font-sans font-normal"
                                        />
                                      </div>
                                    ),
                                )}
                                <div className="mt-2 font-semibold">
                                  নিচের কোনটি সঠিক?
                                </div>
                              </div>
                            )}

                            {/* Options Grid */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-6 text-sm font-sans text-slate-700">
                              {qm.mcqOptions.map((opt, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-1.5 items-start"
                                >
                                  <span className="font-semibold text-slate-500 shrink-0">
                                    {idx === 0
                                      ? "ক)"
                                      : idx === 1
                                        ? "খ)"
                                        : idx === 2
                                          ? "গ)"
                                          : "ঘ)"}
                                  </span>
                                  <RichTextRender
                                    content={opt || "অপশন..."}
                                    className="inline-block font-sans [&_p]:inline [&_p]:m-0 font-normal text-slate-600"
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Correct Answer Badge */}
                            <div className="mt-6 pt-4 border-t border-black/[0.05] text-xs font-sans flex items-center gap-2 text-emerald-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                              <CheckCircle2 className="size-4 shrink-0" />
                              <span>
                                <strong>সঠিক উত্তর:</strong>{" "}
                                {qm.mcqCorrectAnswer === 0
                                  ? "ক"
                                  : qm.mcqCorrectAnswer === 1
                                    ? "খ"
                                    : qm.mcqCorrectAnswer === 2
                                      ? "গ"
                                      : "ঘ"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {qm.formCategory === "Creative" && qm.creativeStem && (
                        <div className="space-y-5">
                          {qm.creativeStem && (
                            <div className="p-5 bg-white/[0.40] border border-black/[0.04] shadow-sm rounded-xl text-sm leading-relaxed font-serif">
                              <RichTextRender content={qm.creativeStem} />
                            </div>
                          )}

                          <div className="pl-4 space-y-3.5 text-sm font-sans font-normal text-slate-700">
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start ">
                                <span className="w-6">ক.</span>
                                <span className="flex-1 font-serif font-normal text-slate-800">
                                  {qm.creativeCognitiveA ||
                                    "জ্ঞানমূলক প্রশ্ন..."}
                                </span>
                                <span className="text-slate-700 text-xs font-serif font-bold">
                                  ১
                                </span>
                              </div>
                              {qm.creativeCognitiveA_Answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={qm.creativeCognitiveA_Answer}
                                    inline={true}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <span className="w-6">খ.</span>
                                <span className="flex-1 font-serif font-normal text-slate-800">
                                  {qm.creativeCognitiveB ||
                                    "অনুধাবনমূলক প্রশ্ন..."}
                                </span>
                                <span className="text-slate-700 text-xs font-serif font-bold">
                                  ২
                                </span>
                              </div>
                              {qm.creativeCognitiveB_Answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={qm.creativeCognitiveB_Answer}
                                    inline={true}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <span className="w-6">গ.</span>
                                <span className="flex-1 font-serif font-normal text-slate-800">
                                  {qm.creativeCognitiveC ||
                                    "প্রয়োগমূলক প্রশ্ন..."}
                                </span>
                                <span className="text-slate-700 text-xs font-serif font-bold">
                                  ৩
                                </span>
                              </div>
                              {qm.creativeCognitiveC_Answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={qm.creativeCognitiveC_Answer}
                                    inline={true}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <span className="w-6">ঘ.</span>
                                <span className="flex-1 font-serif font-normal text-slate-800">
                                  {qm.creativeCognitiveD ||
                                    "উচ্চতর চিন্তাদক্ষতা প্রশ্ন..."}
                                </span>
                                <span className="text-slate-700 text-xs font-serif font-bold">
                                  ৪
                                </span>
                              </div>
                              {qm.creativeCognitiveD_Answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={qm.creativeCognitiveD_Answer}
                                    inline={true}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {!["MCQ", "Creative"].includes(qm.formCategory) &&
                        qm.generalQuestionText && (
                          <div className="space-y-4">
                            {qm.generalStem && (
                              <div className="p-4 bg-white/[0.40] border border-black/[0.04] shadow-sm rounded-xl text-sm italic font-serif">
                                <RichTextRender content={qm.generalStem} />
                              </div>
                            )}

                            <div className="text-[15px] flex justify-between items-start gap-4 w-full text-slate-800">
                              <div className="flex gap-2">
                                <span className="font-bold shrink-0">১.</span>
                                <RichTextRender
                                  content={
                                    qm.generalQuestionText || "প্রশ্ন বিবরণ"
                                  }
                                  className="font-serif font-normal inline-block"
                                />
                              </div>
                              <span className="text-slate-700 text-xs font-sans font-bold whitespace-nowrap pt-1 font-serif">
                                {qm.generalMarks}
                              </span>
                            </div>

                            {qm.generalSuggestedAnswer && (
                              <div className="p-3 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-[15px] text-slate-700">
                                <span className="font-semibold text-[16px]">
                                  উত্তর:{" "}
                                </span>
                                <RichTextRender
                                  content={qm.generalSuggestedAnswer}
                                  inline
                                />
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Sidebar (Right 1 col) */}
              <div className="bg-glass p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-4 h-fit">
                <h4 className="font-bold text-slate-800 text-[16px] border-b border-black/[0.05] pb-2 flex items-center gap-2">
                  <Database className="size-4 text-[#4F46E5]" />
                  সংরক্ষণ করুন
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed">
                  সব তথ্য পুনরায় যাচাই করে ডাটাবেজে সেভ করুন। প্রশ্ন সংরক্ষণের
                  পর আপনার "আমার তৈরি প্রশ্ন" মডিউলে দেখতে পাবেন।
                </p>

                <div className="space-y-2 pt-2">
                  <RippleButton
                    onClick={qm.handleSaveQuestion}
                    disabled={qm.formLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED] text-white font-semibold h-11 rounded-xl shadow-md shadow-purple-500/10"
                  >
                    <Save className="size-4" />
                    {qm.formLoading ? "সংরক্ষণ হচ্ছে..." : "ডাটাবেজে সেভ করুন"}
                    <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
                  </RippleButton>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={qm.formLoading}
                    className="w-full border-black/[0.10] text-slate-600 hover:bg-black/[0.02] rounded-xl h-10 px-5 flex items-center justify-center gap-1.5 font-semibold bg-white/[0.45] backdrop-blur-sm shadow-sm"
                  >
                    <ChevronLeft className="size-4" />
                    পেছনে যান
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent className="max-w-md border border-slate-200/50 bg-glass-elevated backdrop-blur-xl rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-650 font-bold">
              <AlertCircle
                className="size-5 animate-pulse text-red-500"
                strokeWidth={2.5}
              />
              প্রশ্নটি কি মুছে ফেলতে চান?
            </DialogTitle>
            <DialogDescription className="pt-2 text-slate-600 leading-relaxed font-semibold">
              প্রশ্নটি মুছে ফেললে তা তালিকা থেকে সম্পূর্ণভাবে চলে যাবে। আপনি কি
              নিশ্চিতভাবে এটি মুছে ফেলতে চান?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="border-black/[0.08] text-slate-600 hover:bg-black/[0.02] rounded-xl font-semibold cursor-pointer"
            >
              বাতিল করুন
            </Button>
            <Button
              onClick={() => {
                qm.removeQuestionFromList(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              className="bg-red-650 hover:bg-red-700 text-white rounded-xl font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm shadow-red-500/10"
            >
              <Trash2 className="size-4" />
              হ্যাঁ, মুছে ফেলুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
