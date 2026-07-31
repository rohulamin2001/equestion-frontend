import Editor from "@/components/Editor";
import RichTextRender from "@/components/RichTextRender";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/ui/ripple-button";
import { validateCategoryQuestionsJson } from "@/lib/jsonQuestionValidator";
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardPaste,
  Database,
  FileText,
  HelpCircle,
  Layers3,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import BulkImportModal from "./components/BulkImportModal";
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

const getFormattedTagValue = (val) => {
  if (!val) return "";
  if (Array.isArray(val)) {
    return val
      .map((item) => (item != null ? String(item).trim() : ""))
      .filter(Boolean)
      .join(", ");
  }
  return String(val).trim();
};

const getJsonPlaceholder = (category, subType = "All") => {
  if (category === "MCQ") {
    if (subType === "Simple") {
      return `[\n  {\n    "difficulty": "Easy",\n    "topics": ["সততার পুরস্কার"],\n    "examHistory": [{ "board": "ঢাকা বোর্ড", "years": ["2026", "2025"] }],\n    "school": ["মতিঝিল আইডিয়াল স্কুল ও কলেজ"],\n    "level": "জ্ঞান",\n    "specialSearch": ["অনুশীলনি"],\n    "mcqData": {\n      "mcqType": "Simple",\n      "questionText": "<p>'সততার পুরস্কার' গল্পে প্রথম লোকটির শরীরে কী রোগ ছিল?</p>",\n      "options": ["<p>ধবল রোগ</p>", "<p>টাকপড়া</p>", "<p>অন্ধত্ব</p>", "<p>জ্বর</p>"],\n      "correctAnswer": 0,\n      "explanation": "<p>গল্প অনুযায়ী প্রথম লোকটির শরীর ধবল রোগে আক্রান্ত ছিল।</p>"\n    }\n  }\n]`;
    }
    if (subType === "MultipleCompletion") {
      return `[\n  {\n    "difficulty": "Medium",\n    "topics": ["সততার পুরস্কার"],\n    "examHistory": [{ "board": "ঢাকা বোর্ড", "years": ["2026"] }],\n    "school": ["ভিকারুননিসা নূন স্কুল ও কলেজ"],\n    "level": "অনুধাবন",\n    "specialSearch": ["রিপিটেড স্কুল"],\n    "mcqData": {\n      "mcqType": "MultipleCompletion",\n      "questionText": "<p>'সততার পুরস্কার' গল্পের মূল শিক্ষা হলো—</p>",\n      "statements": [\n        "সততা ও ঈমানদারী",\n        "আল্লাহর প্রতি কৃতজ্ঞতা প্রকাশ",\n        "অকৃতজ্ঞতার কুফল"\n      ],\n      "options": ["i ও ii", "ii ও iii", "i ও iii", "i, ii ও iii"],\n      "correctAnswer": 3,\n      "explanation": "<p>তিনটি বাক্যই সততার পুরস্কার গল্পের মূল শিক্ষার অন্তর্ভুক্ত।</p>"\n    }\n  }\n]`;
    }
    if (subType === "Contextual") {
      return `[\n  {\n    "difficulty": "Hard",\n    "topics": ["সততার পুরস্কার"],\n    "examHistory": [{ "board": "ঢাকা বোর্ড", "years": ["2026"] }],\n    "school": ["গভ. ল্যাবরেটরি হাই স্কুল"],\n    "level": "প্রয়োগ",\n    "specialSearch": ["অভিন্ন তথ্যভিত্তিক"],\n    "mcqData": {\n      "mcqType": "Contextual",\n      "stem": "<p>রাফিজ একজন গরিব লোককে সাধ্যমতো সাহায্য করল, কিন্তু তার ভাই কালাম তাকে তাড়িয়ে দিল।</p>",\n      "questionText": "<p>উদ্দীপকের রাফিজের আচরণের সাথে 'সততার পুরস্কার' গল্পের কোন চরিত্রের মিল রয়েছে?</p>",\n      "options": ["<p>তৃতীয় ইহুদি</p>", "<p>প্রথম ইহুদি</p>", "<p>দ্বিতীয় ইহুদি</p>", "<p>ফেরেশতা</p>"],\n      "correctAnswer": 0,\n      "explanation": "<p>তৃতীয় ইহুদি অন্ধত্ব দূর হওয়ার পর আল্লাহর প্রতি কৃতজ্ঞ ছিল।</p>"\n    }\n  }\n]`;
    }
    if (subType === "Grouped") {
      return `[\n  {\n    "isGroup": true,\n    "passageStem": "<p>রফিক সাহেব তার জমিতে রাসায়নিক সারের পরিবর্তে জৈব ও সবুজ সার ব্যবহার করায় জমির উর্বরতা বজায় রইল...</p>",\n    "questions": [\n      {\n        "difficulty": "Medium",\n        "topics": ["উদ্ভিদবিজ্ঞান"],\n        "mcqData": {\n          "mcqType": "Simple",\n          "questionText": "<p>উদ্দীপকে রফিক সাহেবের ব্যবহৃত সার কোনটি?</p>",\n          "options": ["কম্পোস্ট সার", "ইউরিয়া", "টিএসপি", "ডিএপি"],\n          "correctAnswer": 0\n        }\n      },\n      {\n        "difficulty": "Hard",\n        "mcqData": {\n          "mcqType": "MultipleCompletion",\n          "questionText": "<p>সবুজ সার ব্যবহারের সুবিধা হলো—</p>",\n          "statements": ["মাটির উর্বরতা বাড়ে", "পরিবেশবান্ধব", "অনুজীব ধ্বংস হয়"],\n          "options": ["i ও ii", "ii ও iii", "i ও iii", "i, ii ও iii"],\n          "correctAnswer": 0\n        }\n      }\n    ]\n  }\n]`;
    }
    return `[\n  {\n    "difficulty": "Easy",\n    "topics": ["সততার পুরস্কার"],\n    "examHistory": [{ "board": "ঢাকা বোর্ড", "years": ["2026"] }],\n    "mcqData": {\n      "mcqType": "Simple",\n      "questionText": "<p>সাধারণ বহুনির্বাচনি প্রশ্ন...</p>",\n      "options": ["অপশন ১", "অপশন ২", "অপশন ৩", "অপশন ৪"],\n      "correctAnswer": 0\n    }\n  },\n  {\n    "difficulty": "Medium",\n    "mcqData": {\n      "mcqType": "MultipleCompletion",\n      "questionText": "<p>বহুপদী সমাপ্তিসূচক প্রশ্ন...</p>",\n      "statements": ["প্রথম তথ্য", "দ্বিতীয় তথ্য", "তৃতীয় তথ্য"],\n      "options": ["i ও ii", "ii ও iii", "i ও iii", "i, ii ও iii"],\n      "correctAnswer": 3\n    }\n  },\n  {\n    "difficulty": "Hard",\n    "mcqData": {\n      "mcqType": "Contextual",\n      "stem": "<p>উদ্দীপক/অনুচ্ছেদ...</p>",\n      "questionText": "<p>উদ্দীপকভিত্তিক প্রশ্ন...</p>",\n      "options": ["অপশন ১", "অপশন ২", "অপশন ৩", "অপশন ৪"],\n      "correctAnswer": 0\n    }\n  }\n]`;
  }
  if (category === "Creative") {
    return `[\n  {\n    "difficulty": "Medium",\n    "topics": ["উদ্ভিদের শারীরতত্ত্ব"],\n    "examHistory": [{ "board": "ঢাকা বোর্ড", "years": ["2026"] }],\n    "school": ["ঢাকা রেসিডেনসিয়াল মডেল কলেজ"],\n    "level": "Famous School",\n    "specialSearch": ["পরীক্ষায় আসার মতো"],\n    "creativeData": {\n      "stem": "<p>এখানে মূল উদ্দীপক বা অনুচ্ছেদটি লিখুন...</p>",\n      "subQuestions": {\n        "cognitiveA": { "text": "<p>'ক' (জ্ঞানমূলক) প্রশ্ন...</p>", "answer": "<p>'ক' প্রশ্নের উত্তর...</p>", "marks": 1 },\n        "cognitiveB": { "text": "<p>'খ' (অনুধাবনমূলক) প্রশ্ন...</p>", "answer": "<p>'খ' প্রশ্নের উত্তর...</p>", "marks": 2 },\n        "cognitiveC": { "text": "<p>'গ' (প্রয়োগমূলক) প্রশ্ন...</p>", "answer": "<p>'গ' প্রশ্নের উত্তর...</p>", "marks": 3 },\n        "cognitiveD": { "text": "<p>'ঘ' (উচ্চতর দক্ষতা) প্রশ্ন...</p>", "answer": "<p>'ঘ' প্রশ্নের উত্তর...</p>", "marks": 4 }\n      }\n    }\n  }\n]`;
  }
  return `[\n  {\n    "difficulty": "Easy",\n    "topics": ["সাধারণ জ্ঞান"],\n    "examHistory": [{ "board": "ঢাকা বোর্ড", "years": ["2026"] }],\n    "school": ["গভ. ল্যাবরেটরি হাই স্কুল"],\n    "level": "Top School",\n    "specialSearch": ["সংক্ষিপ্ত প্রশ্ন"],\n    "generalData": {\n      "questionText": "<p>এখানে প্রশ্নটি লিখুন...</p>",\n      "suggestedAnswer": "<p>এখানে উত্তর লিখুন...</p>",\n      "marks": 2\n    }\n  }\n]`;
};

export default function AddQuestion() {
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [jsonMcqSubType, setJsonMcqSubType] = useState("All");

  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        toast.error(
          "আপনার ব্রাউজারে অটো-পেস্ট সাপোর্ট করে না। দয়া করে ম্যানুয়ালি (Ctrl+V) পেস্ট করুন।",
        );
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        toast.error("ক্লিপবোর্ডে কোনো টেক্সট পাওয়া যায়নি!");
        return;
      }
      qm.setRawPastedJsonText(text);
      toast.success("ক্লিপবোর্ড থেকে JSON পেস্ট করা হয়েছে! 📋");
    } catch (err) {
      console.error("Clipboard read error:", err);
      toast.error(
        "ক্লিপবোর্ড পারমিশন মেলেনি। দয়া করে ম্যানুয়ালি (Ctrl+V) পেস্ট করুন।",
      );
    }
  };
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
      {/* Bulk Import Modal */}
      <BulkImportModal
        open={showBulkModal}
        onOpenChange={setShowBulkModal}
        onSuccess={() => qm.refetchQuestions?.()}
      />

      {/* Page Header */}
      <div className="bg-glass p-3.5 sm:p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-1 sm:space-y-1.5">
        <div className="flex items-center justify-between gap-3 w-full">
          <h1 className="text-base sm:text-2xl font-bold text-slate-800 tracking-tight font-sans">
            নতুন প্রশ্ন যোগ করুন
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowBulkModal(true)}
              className="bg-purple-600 hover:bg-purple-800 text-white rounded-xl h-7 sm:h-9 text-[11px] sm:text-xs  px-3 sm:px-4 flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer shrink-0 accent-glow-purple"
            >
              <UploadCloud className="size-3.5 sm:size-4" />
              ইমপোর্ট
            </Button>
            <Button
              variant="outline"
              onClick={qm.resetForm}
              className="border-black/[0.08] text-slate-600 hover:bg-black/[0.03] rounded-xl bg-white/[0.45] backdrop-blur-sm shadow-sm h-7 sm:h-9 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-4 shrink-0"
            >
              রিসেট ফর্ম
            </Button>
          </div>
        </div>
        <p className="text-slate-500 text-[11px] sm:text-sm leading-snug">
          NCTB কারিকুলাম ও স্তর অনুযায়ী নতুন MCQ বা সৃজনশীল প্রশ্ন তৈরি করুন।
        </p>
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
            className="absolute top-[18px] sm:top-[30px] h-[2px] sm:h-[3px] bg-gradient-to-r from-purple-600 to-purple-500 rounded-full origin-left"
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
                          boxShadow:
                            "0 8px 25px var(--purple-accent-shadow, rgba(144,14,176,0.35))",
                        }
                      : isCompleted
                        ? {
                            scale: 1,
                            boxShadow:
                              "0 4px 14px var(--purple-accent-shadow, rgba(144,14,176,0.22))",
                          }
                        : { scale: 1, boxShadow: "none" }
                  }
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className={`w-9 h-9 sm:w-[60px] sm:h-[60px] rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer outline-none ${
                    isCompleted
                      ? "bg-gradient-to-br from-purple-600 to-purple-500 text-white border-0"
                      : isActive
                        ? "bg-white border-[2.5px] sm:border-[3px] border-purple-600 text-purple-600"
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
                        ? "var(--purple-600)"
                        : isCompleted
                          ? "var(--purple-800)"
                          : "#94a3b8",
                      fontWeight: isActive ? 700 : 600,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-[9.5px] sm:text-[13px] font-sans leading-tight text-center whitespace-nowrap tracking-tight"
                  >
                    {item.label}
                  </motion.span>
                  <motion.span
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[9px] sm:text-[10px] font-sans text-purple-600/70 font-medium"
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
                    <BookOpen className="size-3.5 sm:size-4 text-purple-600" />
                    সিলেবাস ও অধ্যায় লিঙ্ক করুন
                  </h3>
                  {(() => {
                    const selectedSub = qm.formSubjects.find(
                      (s) => s._id === qm.formSubjectId,
                    );
                    if (!selectedSub) return null;
                    return (
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-600/10 border border-purple-600/20 text-purple-600 text-[10px] sm:text-xs font-bold">
                          <span className="text-purple-600/70">পূর্ণমান:</span>
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
                        className={`w-full px-4 border rounded-xl text-sm font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm backdrop-blur-sm transition-all ${
                          activeDropdown === "type"
                            ? "border-purple-600 ring-4 ring-purple-600/10 bg-white"
                            : qm.formType
                              ? "border-purple-600/50 bg-white hover:bg-white/[0.60]"
                              : "border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.60] hover:border-purple-600/40"
                        }`}
                      >
                        {TYPE_LABELS[qm.formType] || qm.formType}
                        <ChevronRight
                          className={`size-4 transition-transform duration-200 ${activeDropdown === "type" ? "rotate-90 text-purple-600" : "text-slate-400"}`}
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
                                    ? "bg-purple-50 text-purple-700 font-bold"
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
                        className={`w-full px-4 border rounded-xl text-sm font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm backdrop-blur-sm transition-all ${
                          activeDropdown === "level"
                            ? "border-purple-600 ring-4 ring-purple-600/10 bg-white"
                            : qm.formLevel
                              ? "border-purple-600/50 bg-white hover:bg-white/[0.60]"
                              : "border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.60] hover:border-purple-600/40"
                        }`}
                      >
                        {LEVEL_LABELS[qm.formLevel] || qm.formLevel}
                        <ChevronRight
                          className={`size-4 transition-transform duration-200 ${activeDropdown === "level" ? "rotate-90 text-purple-600" : "text-slate-400"}`}
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
                                    ? "bg-purple-50 text-purple-700 font-bold"
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
                        className={`w-full px-4 border rounded-xl text-sm font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm backdrop-blur-sm transition-all ${
                          activeDropdown === "class"
                            ? "border-purple-600 ring-4 ring-purple-600/10 bg-white"
                            : qm.formClass
                              ? "border-purple-600/50 bg-white hover:bg-white/[0.60]"
                              : "border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.60] hover:border-purple-600/40"
                        }`}
                      >
                        {formActiveClasses.find((c) => c.value === qm.formClass)
                          ?.label || qm.formClass}
                        <ChevronRight
                          className={`size-4 transition-transform duration-200 ${activeDropdown === "class" ? "rotate-90 text-purple-600" : "text-slate-400"}`}
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
                                    ? "bg-purple-50 text-purple-700 font-bold"
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
                                  ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/20"
                                  : "bg-white/[0.45] border-black/[0.08] text-slate-600 hover:border-purple-600/40 hover:text-purple-600 hover:bg-white/[0.60]"
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
                          className={`w-full px-4 border rounded-xl text-sm font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm backdrop-blur-sm transition-all ${
                            activeDropdown === "group"
                              ? "border-purple-600 ring-4 ring-purple-600/10 bg-white"
                              : qm.formGroup
                                ? "border-purple-600/50 bg-white hover:bg-white/[0.60]"
                                : "border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.60] hover:border-purple-600/40"
                          }`}
                        >
                          {qm.formGroup === "Science"
                            ? "বিজ্ঞান (Science)"
                            : qm.formGroup === "Humanities"
                              ? "মানবিক (Humanities)"
                              : qm.formGroup === "Commerce"
                                ? "ব্যবসায় শিক্ষা (Commerce)"
                                : "সাধারণ (General)"}
                          <ChevronRight
                            className={`size-4 transition-transform duration-200 ${activeDropdown === "group" ? "rotate-90 text-purple-600" : "text-slate-400"}`}
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
                                      ? "bg-purple-50 text-purple-700 font-bold"
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
                        className={`w-full px-4 border rounded-xl text-sm font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm backdrop-blur-sm transition-all disabled:bg-slate-50/50 disabled:text-slate-400 ${
                          activeDropdown === "subject"
                            ? "border-purple-600 ring-4 ring-purple-600/10 bg-white"
                            : qm.formSubjectId
                              ? "border-purple-600/50 bg-white hover:bg-white/[0.60]"
                              : "border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.60] hover:border-purple-600/40"
                        }`}
                        disabled={qm.formSubjects.length === 0}
                      >
                        <span className="truncate pr-2 text-left">
                          {qm.formSubjects.find(
                            (s) => s._id === qm.formSubjectId,
                          )?.subjectName || "বিষয় নির্বাচন করুন"}
                        </span>
                        <ChevronRight
                          className={`size-4 shrink-0 transition-transform duration-200 ${activeDropdown === "subject" ? "rotate-90 text-purple-600" : "text-slate-400"}`}
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
                                    ? "bg-purple-50 text-purple-700 font-bold"
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
                  <FileText className="size-4 text-purple-600" />
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
                              ? "bg-purple-600/10 border-purple-600/30 text-purple-600 ring-4 ring-purple-600/10 font-bold"
                              : "bg-white/[0.45] border-black/[0.06] text-slate-600 hover:bg-white/[0.60] hover:border-black/[0.12] backdrop-blur-sm"
                          }`}
                        >
                          {cat.label}
                          {isSelected && (
                            <span className="size-2 rounded-full bg-purple-600" />
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
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white font-semibold h-11 rounded-xl shadow-md shadow-purple-600/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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
              className="bg-glass p-3.5 sm:p-8 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-4 sm:space-y-6"
            >
              <div className="flex flex-row justify-between items-center gap-2 border-b border-black/[0.05] pb-2.5 sm:pb-3.5">
                <h3 className="font-bold text-slate-800 text-sm sm:text-lg flex items-center gap-1.5 sm:gap-2">
                  <HelpCircle className="size-4 sm:size-5 text-purple-600" />
                  <span>
                    প্রশ্ন এডিটর -{" "}
                    {
                      CATEGORIES_MAP.find((c) => c.value === qm.formCategory)
                        ?.label
                    }
                  </span>
                </h3>
                {(() => {
                  const selectedClass = CLASSES_MAP.find(
                    (c) => c.value === qm.formClass,
                  )?.label;
                  const selectedSubject = qm.formSubjects.find(
                    (s) => s._id === qm.formSubjectId,
                  )?.subjectName;
                  const selectedChapterObj = qm.formChapters?.find(
                    (ch) =>
                      String(ch.chapterNumber) === String(qm.formChapterNumber),
                  );
                  const chapterText = qm.formChapterNumber
                    ? selectedChapterObj?.chapterName
                      ? `অধ্যায় ${qm.formChapterNumber}: ${selectedChapterObj.chapterName}`
                      : `অধ্যায় ${qm.formChapterNumber}`
                    : "অধ্যায় সিলেক্ট করা নেই";

                  return (
                    <span className="bg-white/80 border border-black/[0.08] backdrop-blur-sm text-slate-700 font-bold text-[11px] sm:text-xs px-3 py-1 rounded-full shrink-0 shadow-2xs">
                      {selectedClass} • {selectedSubject} • {chapterText}
                    </span>
                  );
                })()}
              </div>

              {/* Step 2 Editor Mode Switcher Tab (Form vs JSON Paste) */}
              <div className="flex items-center justify-center sm:justify-start gap-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 w-fit mx-auto sm:mx-0">
                <button
                  type="button"
                  onClick={() => qm.setStep2EditorMode("form")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    qm.step2EditorMode === "form"
                      ? "bg-white text-purple-700 shadow-sm border border-purple-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                  }`}
                >
                  <Pencil className="size-3.5" />
                  <span>ম্যানুয়াল এডিটর</span>
                </button>
                <button
                  type="button"
                  onClick={() => qm.setStep2EditorMode("json")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    qm.step2EditorMode === "json"
                      ? "bg-white text-purple-700 shadow-sm border border-purple-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                  }`}
                >
                  <UploadCloud className="size-3.5" />
                  <span>স্মার্ট JSON</span>
                </button>
              </div>

              {qm.step2EditorMode === "json" ? (
                <div className="space-y-4 animate-in fade-in duration-200 pt-2">
                  {/* Selected Class, Subject & Chapter Info Pill for Smart JSON */}
                  {(() => {
                    const selectedClass = CLASSES_MAP.find(
                      (c) => c.value === qm.formClass,
                    )?.label;
                    const selectedSubject = qm.formSubjects.find(
                      (s) => s._id === qm.formSubjectId,
                    )?.subjectName;
                    const selectedChapterObj = qm.formChapters?.find(
                      (ch) =>
                        String(ch.chapterNumber) ===
                        String(qm.formChapterNumber),
                    );
                    const chapterText = qm.formChapterNumber
                      ? selectedChapterObj?.chapterName
                        ? `অধ্যায় ${qm.formChapterNumber}: ${selectedChapterObj.chapterName}`
                        : `অধ্যায় ${qm.formChapterNumber}`
                      : "অধ্যায় সিলেক্ট করা নেই";

                    return (
                      <div className="w-full bg-purple-50/90 border border-purple-200/90 backdrop-blur-sm text-purple-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-2xs flex items-center gap-2 flex-wrap">
                        <span className="size-2 rounded-full bg-purple-600 animate-pulse shrink-0" />
                        {selectedClass && <span>{selectedClass}</span>}
                        {selectedSubject && (
                          <>
                            <span>•</span>
                            <span>{selectedSubject}</span>
                          </>
                        )}
                        <span>•</span>
                        <span
                          className={
                            !qm.formChapterNumber
                              ? "text-amber-700 font-semibold"
                              : ""
                          }
                        >
                          {chapterText}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Info Notice */}
                  <div className="p-3.5 sm:p-4 bg-purple-50/80 border border-purple-200/80 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="size-5 text-purple-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs text-purple-900 leading-relaxed">
                      <p className="font-bold text-sm text-purple-950">
                        স্মার্ট JSON পেস্ট নির্দেশিকা:
                      </p>
                      <p>
                        আপনাকে বারবার{" "}
                        <span className="font-bold">
                          শ্রেণী, বিষয়, ক্যাটাগরি, প্রতিষ্ঠানের ধরন, একাডেমিক
                          লেভেল
                        </span>{" "}
                        (Step 1) এবং <span className="font-bold">অধ্যায়</span>{" "}
                        (Step 2) মেটাডাটা লিখতে হবে না। সিস্টেম এগুলো ফর্ম থেকে
                        স্বয়ংক্রিয়ভাবে ইনজেক্ট করে নেবে।
                      </p>
                      <p className="text-purple-700 font-semibold">
                        শুধু প্রশ্নভিত্তিক তথ্য (যেমন: difficulty, topics,
                        mcqData / creativeData / generalData, examHistory) পেস্ট
                        করুন।
                      </p>
                    </div>
                  </div>

                  {/* Header & Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      {
                        CATEGORIES_MAP.find((c) => c.value === qm.formCategory)
                          ?.label
                      }{" "}
                      প্রশ্নের JSON টেক্সট পেস্ট করুন
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        qm.handleInsertSampleCategoryJson(jsonMcqSubType)
                      }
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 bg-purple-100/70 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition cursor-pointer shadow-sm"
                    >
                      <FileText className="size-3.5" />
                      <span>নমুনা JSON ইনসার্ট করুন</span>
                    </button>
                  </div>

                  {/* Sub-type 4-Button Grid for MCQ */}
                  {qm.formCategory === "MCQ" && (
                    <div className="space-y-2 p-2 bg-gradient-to-r from-purple-50/80 via-slate-50 to-indigo-50/80 rounded-2xl border border-purple-200/60 shadow-sm animate-in fade-in duration-200">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                          <Sparkles className="size-3.5 text-purple-600 animate-pulse" />
                          <span>নমুনা MCQ টাইপ ফিল্টার ও স্ট্রাকচার:</span>
                        </span>
                        <span className="hidden lg:inline-block text-[10px] font-bold text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-full border border-purple-200/80">
                          5-Type Grid
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        {[
                          {
                            value: "All",
                            label: "সবকটি টাইপ",
                            sub: "All Types",
                            icon: Layers3,
                          },
                          {
                            value: "Simple",
                            label: "সাধারণ MCQ",
                            sub: "Simple MCQ",
                            icon: CheckCircle2,
                          },
                          {
                            value: "MultipleCompletion",
                            label: "বহুপদী সমাপ্তিসূচক",
                            sub: "Multiple",
                            icon: FileText,
                          },
                          {
                            value: "Contextual",
                            label: "অভিন্ন তথ্যভিত্তিক",
                            sub: "Contextual",
                            icon: BookOpen,
                          },
                          {
                            value: "Grouped",
                            label: "উদ্দীপকভিত্তিক ",
                            sub: "Grouped MCQ",
                            icon: Database,
                          },
                        ].map((tab) => {
                          const IconComponent = tab.icon;
                          const isActive = jsonMcqSubType === tab.value;
                          return (
                            <button
                              key={tab.value}
                              type="button"
                              onClick={() => setJsonMcqSubType(tab.value)}
                              className={`flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 cursor-pointer border ${
                                tab.value === "All"
                                  ? "col-span-2 sm:col-span-1 lg:col-span-1"
                                  : ""
                              } ${
                                isActive
                                  ? "bg-purple-700 text-white shadow-md shadow-purple-600/20 border-purple-700 ring-2 ring-purple-600/20"
                                  : "bg-white text-slate-700 hover:bg-purple-50/80 hover:text-purple-900 border-slate-200/80 hover:border-purple-300 shadow-sm"
                              }`}
                            >
                              <IconComponent
                                className={`size-3.5 sm:size-4 shrink-0 ${isActive ? "text-white" : "text-purple-600"}`}
                              />
                              <div className="flex flex-col text-left leading-tight min-w-0">
                                <span className="leading-tight text-left break-words">
                                  {tab.label}
                                </span>
                                <span
                                  className={`text-[8px] sm:text-[9px] md:text-[10px] font-semibold opacity-80 ${
                                    isActive
                                      ? "text-purple-100"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {tab.sub}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Textarea */}
                  <div className="relative group">
                    <textarea
                      rows={14}
                      value={qm.rawPastedJsonText}
                      onChange={(e) => qm.setRawPastedJsonText(e.target.value)}
                      placeholder={getJsonPlaceholder(
                        qm.formCategory,
                        jsonMcqSubType,
                      )}
                      className="w-full p-4 pt-11 font-mono text-xs bg-slate-900 text-slate-100 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-inner resize-y leading-relaxed"
                    />
                    <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-10">
                      <button
                        type="button"
                        onClick={handlePasteFromClipboard}
                        className="text-[11px] font-bold text-emerald-300 hover:text-white bg-slate-800/90 hover:bg-emerald-700 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-emerald-500 transition shadow-md flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
                        title="ক্লিপবোর্ড থেকে অটো-পেস্ট করুন"
                      >
                        <ClipboardPaste className="size-3.5 text-emerald-400" />
                        <span>অটো-পেস্ট</span>
                      </button>
                      {qm.rawPastedJsonText && (
                        <button
                          type="button"
                          onClick={() => qm.setRawPastedJsonText("")}
                          className="text-[11px] font-bold text-rose-300 hover:text-white bg-slate-800/90 hover:bg-rose-700 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-rose-500 transition shadow-md flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
                          title="লেখা ক্লিয়ার করুন"
                        >
                          <Trash2 className="size-3.5 text-rose-400" />
                          <span>ক্লিয়ার</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Live Validation Box */}
                  {(() => {
                    const val = validateCategoryQuestionsJson(
                      qm.rawPastedJsonText,
                      qm.formCategory,
                    );
                    if (!qm.rawPastedJsonText.trim()) {
                      return (
                        <div className="p-2.5 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] sm:text-xs text-slate-500 font-semibold flex  gap-2">
                          <HelpCircle className="size-3.5 sm:size-4 text-slate-400 shrink-0" />
                          <span>
                            উপরে আপনার JSON টেক্সট পেস্ট করুন। সিনট্যাক্স ও
                            ফরম্যাট রিয়েল-টাইমে যাচাই করা হবে।
                          </span>
                        </div>
                      );
                    }
                    if (val.isValid && val.validCount > 0) {
                      return (
                        <div className="p-3 sm:p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-[11px] sm:text-xs font-semibold text-emerald-800 space-y-1 animate-in fade-in duration-150">
                          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-emerald-900">
                            <CheckCircle2 className="size-4 sm:size-5 text-emerald-600 shrink-0" />
                            <span>
                              {val.validCount} টি সম্পূর্ণ সঠিক{" "}
                              {qm.formCategory} প্রশ্ন পাওয়া গেছে!
                            </span>
                          </div>
                          <p className="text-emerald-700 text-[10px] sm:text-xs">
                            সংরক্ষণ বাটনে ক্লিক করলে স্টেপ ১ ও স্টেপ ২-এর
                            সিলেক্টকৃত মেটাডাটা মার্জ করে ডাটাবেসে সেভ হয়ে যাবে।
                          </p>
                        </div>
                      );
                    }
                    return (
                      <div className="p-3 sm:p-4 bg-rose-50 border border-rose-200/80 rounded-2xl text-[11px] sm:text-xs font-semibold text-rose-800 space-y-2 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-rose-900">
                          <AlertCircle className="size-4 sm:size-5 text-rose-600 shrink-0" />
                          <span>JSON ভ্যালিডেশন ত্রুটি পাওয়া গেছে:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-rose-700 font-mono text-[10px] sm:text-[11px] pl-2 max-h-36 overflow-y-auto">
                          {val.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}

                  {/* Action Buttons for JSON Mode */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={qm.savePastedJsonQuestions}
                      disabled={
                        qm.isSavingPasted ||
                        qm.formLoading ||
                        !qm.rawPastedJsonText.trim() ||
                        !validateCategoryQuestionsJson(
                          qm.rawPastedJsonText,
                          qm.formCategory,
                        ).isValid
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                    >
                      {qm.isSavingPasted ? (
                        <>
                          <Loader2 className="size-4 animate-spin text-white" />
                          <span>সেভ করা হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Save className="size-4" />
                          <span>বাল্ক প্রশ্নসমূহ সেভ করুন</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chapter & Difficulty Selection at the top of Step 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 bg-black/[0.01] p-3 sm:p-4 rounded-xl border border-black/[0.03]">
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
                              : activeDropdown === "chapter"
                                ? "border-purple-600 ring-4 ring-purple-600/10 bg-white"
                                : qm.formChapterNumber
                                  ? "border-purple-600/50 bg-white hover:bg-slate-50"
                                  : "border-black/[0.08] bg-white hover:bg-slate-50 hover:border-purple-600/40"
                          }`}
                        >
                          <span className="truncate pr-2 text-left">
                            {qm.formChapters.find(
                              (c) =>
                                c.chapterNumber.toString() ===
                                qm.formChapterNumber,
                            )
                              ? `অধ্যায় ${qm.formChapterNumber}: ${qm.formChapters.find((c) => c.chapterNumber.toString() === qm.formChapterNumber).chapterName}`
                              : "অধ্যায় নির্বাচন করুন"}
                          </span>
                          <ChevronRight
                            className={`size-4 shrink-0 transition-transform duration-200 ${
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
                                      ? "bg-purple-50 text-purple-700 font-bold"
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
                                  ? config.color + " ring-4 ring-purple-600/10"
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
                                c.chapterNumber.toString() ===
                                qm.formChapterNumber,
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
                                    ? "bg-purple-600/10 border-purple-600/30 text-purple-600 font-bold"
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
                                c.chapterNumber.toString() ===
                                qm.formChapterNumber,
                            )?.topics || []
                          ).length === 0 && (
                            <p className="text-xs text-slate-400 italic">
                              এই অধ্যায়ের অধীনে কোনো নির্দিষ্ট টপিক যুক্ত করা
                              হয়নি।
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DYNAMIC FORMS BASED ON CATEGORY */}
                  {qm.formCategory === "MCQ" && (
                    <div className="space-y-6">
                      {/* MCQ Group Toggle */}
                      <div className="flex items-center gap-4 mb-2 p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                          <input
                            type="radio"
                            checked={!qm.isGroupedMcq}
                            onChange={() => qm.setIsGroupedMcq(false)}
                            className="accent-purple-600 size-4 shrink-0 cursor-pointer"
                          />
                          <span>একক MCQ</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                          <input
                            type="radio"
                            checked={qm.isGroupedMcq}
                            onChange={() => qm.setIsGroupedMcq(true)}
                            className="accent-[#900EB0] size-4 shrink-0 cursor-pointer"
                          />
                          <span>উদ্দীপকভিত্তিক প্রশ্নগুচ্ছ</span>
                        </label>
                      </div>

                      {!qm.isGroupedMcq ? (
                        <>
                          {/* MCQ Type Selector */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                              MCQ ধরণ
                            </label>
                            <div className="flex flex-col lg:flex-row gap-2.5 lg:gap-6">
                              {[
                                {
                                  value: "Simple",
                                  label: "সাধারণ বহুনির্বাচনি",
                                },
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
                                  className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#900EB0] transition-colors w-fit"
                                >
                                  <input
                                    type="radio"
                                    name="mcqType"
                                    value={item.value}
                                    checked={qm.mcqType === item.value}
                                    onChange={(e) =>
                                      qm.setMcqType(e.target.value)
                                    }
                                    className="accent-[#900EB0] size-4 shrink-0 cursor-pointer"
                                  />
                                  <span>{item.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Stem input (only for Contextual MCQs) */}
                          {qm.mcqType === "Contextual" && (
                            <div className="space-y-2 animate-in fade-in duration-200">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
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
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
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
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <span className="font-bold text-slate-400 text-sm w-6 text-center">
                                    {idx === 0
                                      ? "i."
                                      : idx === 1
                                        ? "ii."
                                        : "iii."}
                                  </span>
                                  <Input
                                    placeholder={`বিবৃতি লিখুন`}
                                    value={statement}
                                    onChange={(e) => {
                                      const updated = [...qm.mcqStatements];
                                      updated[idx] = e.target.value;
                                      qm.setMcqStatements(updated);
                                    }}
                                    className="bg-white/[0.45] border-black/[0.08] backdrop-blur-sm focus-visible:ring-purple-600/20 focus-visible:border-purple-600"
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
                                      onClick={() =>
                                        qm.setMcqCorrectAnswer(idx)
                                      }
                                      className={`size-6 rounded-full border flex items-center justify-center shrink-0 transition-all font-bold text-xs ${
                                        isCorrect
                                          ? "bg-emerald-500 border-emerald-500 text-white"
                                          : "border-black/[0.15] hover:border-purple-600 text-transparent"
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
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
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
                        </>
                      ) : (
                        <div className="space-y-8 animate-in fade-in duration-300">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              উদ্দীপক / অনুচ্ছেদ (নরমাল ফন্ট সাইজ ১৬ পিক্সেল
                              রাখতে হবে)
                            </label>
                            <Editor
                              value={qm.mcqStem}
                              onChange={qm.setMcqStem}
                              placeholder="যেমন: নিচের অনুচ্ছেদটি পড়ো এবং প্রশ্নের উত্তর দাও..."
                              height={200}
                            />
                          </div>

                          <div className="space-y-6">
                            {qm.mcqGroupQuestions.map((q, qIndex) => (
                              <div
                                key={qIndex}
                                className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-5"
                              >
                                <div className="flex justify-between items-center">
                                  <h4 className="font-bold text-slate-700">
                                    প্রশ্ন {qIndex + 1}
                                  </h4>
                                  {qm.mcqGroupQuestions.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = [...qm.mcqGroupQuestions];
                                        next.splice(qIndex, 1);
                                        qm.setMcqGroupQuestions(next);
                                      }}
                                      className="text-red-500 hover:text-red-600 text-sm font-semibold transition-colors"
                                    >
                                      মুছে ফেলুন
                                    </button>
                                  )}
                                </div>

                                {/* Type Selector */}
                                <div className="flex gap-4">
                                  {[
                                    {
                                      value: "Simple",
                                      label: "সাধারণ বহুনির্বাচনি",
                                    },
                                    {
                                      value: "MultipleCompletion",
                                      label: "বহুপদী সমাপ্তিসূচক",
                                    },
                                  ].map((item) => (
                                    <label
                                      key={item.value}
                                      className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        name={`mcqType-${qIndex}`}
                                        value={item.value}
                                        checked={q.mcqType === item.value}
                                        onChange={(e) => {
                                          const next = [
                                            ...qm.mcqGroupQuestions,
                                          ];
                                          next[qIndex] = {
                                            ...next[qIndex],
                                            mcqType: e.target.value,
                                          };
                                          qm.setMcqGroupQuestions(next);
                                        }}
                                        className="accent-[#4F46E5] size-4 shrink-0"
                                      />
                                      <span>{item.label}</span>
                                    </label>
                                  ))}
                                </div>

                                {/* Question Text */}
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                                    প্রশ্ন
                                  </label>
                                  <Editor
                                    value={q.mcqQuestionText}
                                    onChange={(val) => {
                                      const next = [...qm.mcqGroupQuestions];
                                      next[qIndex] = {
                                        ...next[qIndex],
                                        mcqQuestionText: val,
                                      };
                                      qm.setMcqGroupQuestions(next);
                                    }}
                                    height={150}
                                  />
                                </div>

                                {/* Statements */}
                                {q.mcqType === "MultipleCompletion" && (
                                  <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <label className="text-xs font-bold text-slate-500 uppercase block">
                                      বিবৃতিসমূহ (Statements)
                                    </label>
                                    {q.mcqStatements.map((stmt, sIdx) => (
                                      <div
                                        key={sIdx}
                                        className="flex items-center gap-2"
                                      >
                                        <span className="font-bold text-slate-400 text-sm w-6 text-center">
                                          {sIdx === 0
                                            ? "i."
                                            : sIdx === 1
                                              ? "ii."
                                              : "iii."}
                                        </span>
                                        <Input
                                          value={stmt}
                                          onChange={(e) => {
                                            const next = [
                                              ...qm.mcqGroupQuestions,
                                            ];
                                            const stmts = [
                                              ...next[qIndex].mcqStatements,
                                            ];
                                            stmts[sIdx] = e.target.value;
                                            next[qIndex] = {
                                              ...next[qIndex],
                                              mcqStatements: stmts,
                                            };
                                            qm.setMcqGroupQuestions(next);
                                          }}
                                          className="bg-white"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Options Input */}
                                <div className="space-y-3">
                                  <label className="text-xs font-bold text-slate-500 uppercase block">
                                    অপশনসমূহ ও সঠিক উত্তর নির্বাচন
                                  </label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {q.mcqOptions.map((opt, oIdx) => {
                                      const isCorrect =
                                        q.mcqCorrectAnswer === oIdx;
                                      return (
                                        <div
                                          key={oIdx}
                                          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isCorrect ? "bg-emerald-50 border-emerald-500/40 shadow-sm" : "bg-slate-50/50 border-slate-200"}`}
                                        >
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const next = [
                                                ...qm.mcqGroupQuestions,
                                              ];
                                              next[qIndex] = {
                                                ...next[qIndex],
                                                mcqCorrectAnswer: oIdx,
                                              };
                                              qm.setMcqGroupQuestions(next);
                                            }}
                                            className={`size-6 rounded-full border flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${isCorrect ? "bg-emerald-500 text-white border-emerald-500" : "border-slate-300 text-transparent hover:border-purple-600"}`}
                                          >
                                            ✓
                                          </button>
                                          <span className="font-bold text-slate-500 text-sm">
                                            {oIdx === 0
                                              ? "ক)"
                                              : oIdx === 1
                                                ? "খ)"
                                                : oIdx === 2
                                                  ? "গ)"
                                                  : "ঘ)"}
                                          </span>
                                          <input
                                            type="text"
                                            required
                                            value={opt}
                                            onChange={(e) => {
                                              const next = [
                                                ...qm.mcqGroupQuestions,
                                              ];
                                              const opts = [
                                                ...next[qIndex].mcqOptions,
                                              ];
                                              opts[oIdx] = e.target.value;
                                              next[qIndex] = {
                                                ...next[qIndex],
                                                mcqOptions: opts,
                                              };
                                              qm.setMcqGroupQuestions(next);
                                            }}
                                            className="w-full bg-transparent border-0 focus:outline-none text-sm font-semibold text-slate-700"
                                            placeholder="অপশন লিখুন"
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Explanation Input */}
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                                    ব্যাখ্যা (ঐচ্ছিক)
                                  </label>
                                  <Editor
                                    value={q.mcqExplanation}
                                    onChange={(val) => {
                                      const next = [...qm.mcqGroupQuestions];
                                      next[qIndex] = {
                                        ...next[qIndex],
                                        mcqExplanation: val,
                                      };
                                      qm.setMcqGroupQuestions(next);
                                    }}
                                    height={150}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              qm.setMcqGroupQuestions([
                                ...qm.mcqGroupQuestions,
                                {
                                  mcqType: "Simple",
                                  mcqQuestionText: "",
                                  mcqStatements: ["", "", ""],
                                  mcqOptions: ["", "", "", ""],
                                  mcqCorrectAnswer: 0,
                                  mcqExplanation: "",
                                },
                              ]);
                            }}
                            className="w-full py-3.5 border-2 border-dashed border-purple-600/40 text-purple-600 hover:bg-purple-600/5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                          >
                            <Plus className="size-4" />
                            <span>নতুন উপ-প্রশ্ন যোগ করুন</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {qm.formCategory === "Creative" && (
                    <div className="space-y-6">
                      {/* Stem input */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
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
                                className="bg-white/[0.45] border-black/[0.08] backdrop-blur-sm focus-visible:ring-purple-600/20 focus-visible:border-purple-600 h-11"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-600 block">
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
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
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
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
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
                            className="bg-white/[0.45] border-black/[0.08] backdrop-blur-sm focus-visible:ring-purple-600/20 focus-visible:border-purple-600 h-11"
                            min={1}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Question Metadata Link Section (School, Board, Year, Level, Special Search) */}
                  <div className="p-5 bg-black/[0.01] border border-black/[0.04] rounded-2xl space-y-4 pt-4">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-black/[0.04] pb-2">
                      <Database className="size-4 text-purple-600" />
                      <span>প্রশ্ন মেটাডাটা লিঙ্ক করুন (ঐচ্ছিক)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Dynamic Exam History Builder (Board & Year Pairs) */}
                      <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white/70 p-4 border border-black/[0.06] rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            পরীক্ষার বোর্ড ও সাল
                          </label>
                          <button
                            type="button"
                            onClick={qm.addExamHistoryRow}
                            className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200/60 transition cursor-pointer"
                          >
                            <Plus className="size-3.5" />
                            <span>যোগ করুন</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(qm.formExamHistory || []).map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-2.5 relative"
                            >
                              <div className="flex items-center justify-between gap-2">
                                {/* Board Dropdown Selector */}
                                <div className="w-full sm:w-1/2 relative">
                                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                    বোর্ড #{idx + 1}
                                  </label>
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setActiveDropdown(
                                          activeDropdown === `eh-board-${idx}`
                                            ? null
                                            : `eh-board-${idx}`,
                                        )
                                      }
                                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex justify-between items-center shadow-xs hover:border-purple-600/40 transition cursor-pointer"
                                    >
                                      <span className="truncate">
                                        {item.board || "বোর্ড নির্বাচন করুন"}
                                      </span>
                                      <ChevronRight
                                        className={`size-3.5 text-slate-400 shrink-0 transition-transform ${activeDropdown === `eh-board-${idx}` ? "rotate-90 text-purple-600" : ""}`}
                                      />
                                    </button>
                                    {activeDropdown === `eh-board-${idx}` && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-10"
                                          onClick={() =>
                                            setActiveDropdown(null)
                                          }
                                        />
                                        <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto p-1 space-y-0.5 animate-in fade-in duration-150">
                                          {activeBoards.map((bd) => (
                                            <button
                                              key={bd._id}
                                              type="button"
                                              onClick={() => {
                                                qm.updateExamHistoryBoard(
                                                  idx,
                                                  bd.name,
                                                );
                                                setActiveDropdown(null);
                                              }}
                                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                                item.board === bd.name
                                                  ? "bg-purple-50 text-purple-700 font-bold"
                                                  : "text-slate-700 hover:bg-slate-50"
                                              }`}
                                            >
                                              {bd.name}
                                            </button>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Delete Row Button */}
                                {qm.formExamHistory.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => qm.removeExamHistoryRow(idx)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg border border-red-200/80 transition cursor-pointer self-end mb-0.5"
                                    title="এই সারিটি মুছুন"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                )}
                              </div>

                              {/* Year Chips / Badges */}
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                  পরীক্ষার সালসমূহ (
                                  {item.years && item.years.length
                                    ? item.years.join(", ")
                                    : "কোনো সাল সিলেক্ট করা হয়নি"}
                                  )
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                  {activeYears.map((yr) => {
                                    const isSelected =
                                      item.years &&
                                      item.years.includes(yr.name);
                                    return (
                                      <button
                                        key={yr._id}
                                        type="button"
                                        onClick={() =>
                                          qm.toggleExamHistoryYear(idx, yr.name)
                                        }
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                                          isSelected
                                            ? "bg-purple-600 text-white border-purple-600 font-bold shadow-xs"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-purple-600/30"
                                        }`}
                                      >
                                        {isSelected ? `✓ ${yr.name}` : yr.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
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
                            className={`w-full px-4 border rounded-xl text-sm font-semibold text-slate-700 flex justify-between items-center h-10 shadow-sm truncate pr-8 relative transition-all ${
                              activeDropdown === "school"
                                ? "border-purple-600 ring-4 ring-purple-600/10 bg-white"
                                : qm.formSchool && qm.formSchool.length > 0
                                  ? "border-purple-600/50 bg-white hover:bg-slate-50"
                                  : "border-black/[0.08] bg-white hover:bg-slate-50 hover:border-purple-600/40"
                            }`}
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
                                onClick={() => {
                                  setActiveDropdown(null);
                                  setSchoolSearchQuery("");
                                }}
                              />
                              <div className="absolute left-0 right-0 mt-1 bg-white border border-black/[0.08] rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto p-1.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Sticky Search Input */}
                                <div className="sticky top-0 bg-white pt-0.5 pb-1 px-0.5 border-b border-slate-100 z-10">
                                  <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                                    <input
                                      type="text"
                                      value={schoolSearchQuery}
                                      onChange={(e) =>
                                        setSchoolSearchQuery(e.target.value)
                                      }
                                      placeholder="স্কুল নাম লিখে খুঁজুন..."
                                      className="w-full pl-8 pr-7 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-purple-600 bg-slate-50/50"
                                      autoFocus
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    {schoolSearchQuery && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSchoolSearchQuery("");
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold transition p-0.5"
                                        title="ক্লিয়ার করুন"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    qm.setFormSchool([]);
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50"
                                >
                                  রিসেট / খালি করুন
                                </button>

                                {activeSchools.filter((sch) =>
                                  !schoolSearchQuery.trim()
                                    ? true
                                    : sch.name
                                        ?.toLowerCase()
                                        .includes(
                                          schoolSearchQuery
                                            .toLowerCase()
                                            .trim(),
                                        ),
                                ).length === 0 ? (
                                  <div className="px-3 py-3 text-xs text-slate-400 text-center italic">
                                    &ldquo;{schoolSearchQuery}&rdquo; দিয়ে কোনো
                                    স্কুল পাওয়া যায়নি
                                  </div>
                                ) : (
                                  activeSchools
                                    .filter((sch) =>
                                      !schoolSearchQuery.trim()
                                        ? true
                                        : sch.name
                                            ?.toLowerCase()
                                            .includes(
                                              schoolSearchQuery
                                                .toLowerCase()
                                                .trim(),
                                            ),
                                    )
                                    .map((sch) => {
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
                                              : [
                                                  ...(qm.formSchool || []),
                                                  sch.name,
                                                ];
                                            qm.setFormSchool(nextSchools);
                                          }}
                                          className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition flex justify-between items-center ${
                                            isSelected
                                              ? "bg-purple-50 text-purple-700 font-bold"
                                              : "text-slate-700 hover:bg-slate-50"
                                          }`}
                                        >
                                          <span>{sch.name}</span>
                                          {isSelected && (
                                            <Check className="size-4 shrink-0 text-purple-600" />
                                          )}
                                        </button>
                                      );
                                    })
                                )}
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
                                activeDropdown === "levelTag"
                                  ? null
                                  : "levelTag",
                              )
                            }
                            className={`w-full px-4 border rounded-xl text-sm font-semibold text-slate-700 flex justify-between items-center h-10 shadow-sm transition-all ${
                              activeDropdown === "levelTag"
                                ? "border-purple-600 ring-4 ring-purple-600/10 bg-white"
                                : qm.formLevelTag
                                  ? "border-purple-600/50 bg-white hover:bg-slate-50"
                                  : "border-black/[0.08] bg-white hover:bg-slate-50 hover:border-purple-600/40"
                            }`}
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
                                        ? "bg-purple-50 text-purple-700 font-bold"
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
                                    ? "bg-purple-600/10 border-purple-600/30 text-purple-600 font-bold"
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
                        <Database className="size-4 text-purple-600" />
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
                                  ? "bg-purple-600/5 border-purple-600/30 ring-1 ring-purple-600/20 shadow-sm"
                                  : "bg-white/[0.30] border-black/[0.05]"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="bg-purple-600/10 text-purple-600 font-bold size-5 rounded-full flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <span className="font-bold text-purple-600 mr-2 uppercase text-[9px] bg-purple-600/10 px-1.5 py-0.5 rounded">
                                    {catLabel}
                                  </span>
                                  <span className="truncate block mt-1 font-serif">
                                    {q.category === "MCQ" &&
                                      stripHtml(q.mcqData?.questionText)}
                                    {q.category === "Creative" &&
                                      stripHtml(q.creativeData?.stem)}
                                    {!["MCQ", "Creative"].includes(
                                      q.category,
                                    ) && stripHtml(q.generalData?.questionText)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => qm.editDraftQuestion(q.id)}
                                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    isEditingThis
                                      ? "text-purple-600 bg-purple-600/10"
                                      : "text-slate-400 hover:text-purple-600 hover:bg-purple-600/10"
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
                  <div className="flex justify-between items-center gap-2 pt-4 sm:pt-6 border-t border-black/[0.05]">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="border-black/[0.10] text-slate-600 hover:bg-black/[0.02] rounded-xl h-8 sm:h-10 px-2.5 sm:px-5 flex items-center gap-1 font-semibold cursor-pointer text-xs sm:text-sm shrink-0"
                    >
                      <ChevronLeft className="size-3.5 sm:size-4" />
                      পেছনে
                    </Button>

                    <div className="flex gap-2 sm:gap-3 flex-wrap justify-end">
                      {qm.editingDraftId ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={qm.cancelEditDraft}
                            className="border-rose-200 text-rose-650 hover:bg-rose-50 hover:border-rose-300 rounded-xl h-8 sm:h-10 px-2.5 sm:px-5 flex items-center gap-1 font-semibold cursor-pointer bg-white/[0.45] backdrop-blur-sm text-xs sm:text-sm shrink-0"
                          >
                            বাতিল
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={qm.updateDraftQuestion}
                            className="border-emerald-200 text-emerald-650 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl h-8 sm:h-10 px-2.5 sm:px-5 flex items-center gap-1 font-semibold cursor-pointer bg-white/[0.45] backdrop-blur-sm text-xs sm:text-sm shrink-0"
                          >
                            <Save className="size-3.5 sm:size-4" />
                            আপডেট
                          </Button>
                        </>
                      ) : (
                        !qm.editingQuestion && (
                          <Button
                            type="button"
                            onClick={qm.addQuestionToList}
                            className="border-[#900EB0]/20 text-[#900EB0] hover:bg-[#900EB0]/10 hover:border-[#900EB0]/40 rounded-xl h-8 sm:h-10 px-2.5 sm:px-5 flex items-center gap-1 font-semibold cursor-pointer bg-white/[0.45] backdrop-blur-sm text-xs sm:text-sm shrink-0"
                          >
                            <Plus className="size-3.5 sm:size-4" />
                            যোগ করুন
                          </Button>
                        )
                      )}
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-[#900EB0] hover:bg-[#720A7B] text-white rounded-xl h-8 sm:h-10 px-3 sm:px-6 flex items-center gap-1 font-semibold cursor-pointer shadow-md shadow-[#900EB0]/20 text-xs sm:text-sm shrink-0"
                      >
                        প্রিভিউ
                        <ChevronRight className="size-3.5 sm:size-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
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
                <div className="border-b border-black/[0.05] bg-white/[0.5] backdrop-blur-md px-3.5 sm:px-6 py-2.5 sm:py-4 flex justify-between items-center gap-2">
                  <h4 className="font-bold text-[10px] sm:text-sm text-slate-800 tracking-wide uppercase font-sans">
                    NCTB Live Exam Preview Sheet
                  </h4>
                  <span className="bg-purple-600/10 text-purple-600 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-purple-600/20 whitespace-nowrap">
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
                              {(() => {
                                const formattedYear = getFormattedTagValue(
                                  q.year,
                                );
                                return formattedYear ? (
                                  <>
                                    <span>•</span>
                                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
                                      {formattedYear}
                                    </span>
                                  </>
                                ) : null;
                              })()}
                              {(() => {
                                const formattedBoard = getFormattedTagValue(
                                  q.board,
                                );
                                return formattedBoard ? (
                                  <>
                                    <span>•</span>
                                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                                      {formattedBoard}
                                    </span>
                                  </>
                                ) : null;
                              })()}
                              {(() => {
                                const formattedSchool = getFormattedTagValue(
                                  q.school,
                                );
                                return formattedSchool ? (
                                  <>
                                    <span>•</span>
                                    <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded truncate max-w-[150px]">
                                      {formattedSchool}
                                    </span>
                                  </>
                                ) : null;
                              })()}
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
                                    <div className="text-[14px] leading-relaxed font-serif text-slate-800">
                                      <strong className="font-bold text-slate-900 mr-1.5">
                                        উদ্দীপক:
                                      </strong>
                                      <RichTextRender
                                        content={q.mcqData.stem}
                                        inline={true}
                                        className="inline text-[14px] leading-relaxed font-serif text-slate-800"
                                      />
                                    </div>
                                  )}

                                <div className="text-[15px] flex justify-between items-start gap-4 w-full text-slate-800">
                                  <div className="flex gap-2">
                                    <span className="font-normal text-black shrink-0">
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
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-6 text-sm font-sans text-black">
                                  {q.mcqData.options &&
                                    q.mcqData.options.map((opt, oIdx) => (
                                      <div
                                        key={oIdx}
                                        className="flex gap-1.5 items-center"
                                      >
                                        <span className="text-black shrink-0 font-normal">
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
                                          className="inline-block font-sans [&_p]:inline [&_p]:m-0 font-normal text-[14px]"
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
                                  <div className="text-[14px] leading-relaxed font-serif text-slate-800">
                                    <strong className="font-bold text-slate-900 mr-1.5">
                                      উদ্দীপক:
                                    </strong>
                                    <RichTextRender
                                      content={q.creativeData.stem}
                                      inline={true}
                                      className="inline text-[14px] leading-relaxed font-serif text-slate-800"
                                    />
                                  </div>
                                )}

                                <div className="pl-2 space-y-3.5 text-[14px] font-sans font-normal text-slate-800">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="w-6 font-normal text-black">
                                        ক.
                                      </span>
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
                                      <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[14px] text-green-800 font-serif">
                                        <span className="font-bold text-green-700 mr-1.5 text-[14px]">
                                          উত্তর:
                                        </span>
                                        <RichTextRender
                                          content={
                                            q.creativeData.subQuestions
                                              .cognitiveA.answer
                                          }
                                          inline={true}
                                          className="inline text-[14px] font-serif [&_*]:!text-[14px] [&_p]:inline [&_p]:m-0"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="w-6 font-normal text-black">
                                        খ.
                                      </span>
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
                                      <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[14px] text-green-800 font-serif">
                                        <span className="font-bold text-green-700 mr-1.5 text-[14px]">
                                          উত্তর:
                                        </span>
                                        <RichTextRender
                                          content={
                                            q.creativeData.subQuestions
                                              .cognitiveB.answer
                                          }
                                          inline={true}
                                          className="inline text-[14px] font-serif [&_*]:!text-[14px] [&_p]:inline [&_p]:m-0"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="w-6 font-normal text-black">
                                        গ.
                                      </span>
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
                                      <span className="w-6 font-normal text-black">
                                        ঘ.
                                      </span>
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
                                      <span className="font-normal text-black shrink-0">
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
                      {qm.formCategory === "MCQ" &&
                      qm.isGroupedMcq &&
                      qm.mcqGroupQuestions?.length > 0 ? (
                        <div className="space-y-6">
                          <div className="text-[14px] leading-relaxed font-serif text-slate-800">
                            <RichTextRender
                              content={qm.mcqStem || ""}
                              inline={true}
                              className="inline text-[14px] leading-relaxed font-serif text-slate-800"
                            />
                          </div>

                          <div className="space-y-6 divide-y divide-black/[0.05]">
                            {qm.mcqGroupQuestions.map((q, qIdx) => (
                              <div
                                key={qIdx}
                                className={`space-y-2.5 ${qIdx > 0 ? "pt-6" : ""}`}
                              >
                                <div className="text-[15px] flex justify-between items-start gap-4 w-full">
                                  <div className="flex gap-2">
                                    <span className="font-normal text-black shrink-0">
                                      {(qIdx + 1).toLocaleString("bn-BD")}.
                                    </span>
                                    <RichTextRender
                                      content={
                                        q.mcqQuestionText || "প্রশ্ন বিবরণ"
                                      }
                                    />
                                  </div>
                                  <span className="text-slate-700 text-xs font-sans font-bold whitespace-nowrap pt-1">
                                    ১
                                  </span>
                                </div>
                                {q.mcqType === "MultipleCompletion" &&
                                  q.mcqStatements && (
                                    <div className="space-y-1 pl-6 mt-2 font-normal text-sm font-sans">
                                      {q.mcqStatements.map(
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
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-6 text-[14px] font-sans text-black">
                                  {q.mcqOptions &&
                                    q.mcqOptions.map((opt, optIdx) => (
                                      <div
                                        key={optIdx}
                                        className="flex gap-1.5 items-start"
                                      >
                                        <span className="font-normal text-black shrink-0">
                                          {optIdx === 0
                                            ? "ক)"
                                            : optIdx === 1
                                              ? "খ)"
                                              : optIdx === 2
                                                ? "গ)"
                                                : "ঘ)"}
                                        </span>
                                        <RichTextRender
                                          content={opt || "অপশন..."}
                                          className="inline-block font-sans [&_p]:inline [&_p]:m-0 font-normal text-black"
                                        />
                                      </div>
                                    ))}
                                </div>
                                {/* Correct Answer Badge */}
                                <div className="mt-4 pt-3 border-t border-black/[0.02] text-xs font-sans flex items-center gap-2 text-emerald-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                                  <CheckCircle2 className="size-4 shrink-0" />
                                  <span>
                                    <strong>সঠিক উত্তর:</strong>{" "}
                                    {q.mcqCorrectAnswer === 0
                                      ? "ক"
                                      : q.mcqCorrectAnswer === 1
                                        ? "খ"
                                        : q.mcqCorrectAnswer === 2
                                          ? "গ"
                                          : "ঘ"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : qm.formCategory === "MCQ" &&
                        qm.mcqQuestionText &&
                        !qm.isGroupedMcq ? (
                        <div className="space-y-4">
                          {qm.mcqType === "Contextual" && qm.mcqStem && (
                            <div className="text-[14px] leading-relaxed font-serif text-slate-800">
                              <strong className="font-bold text-slate-900 mr-1.5">
                                উদ্দীপক:
                              </strong>
                              <RichTextRender
                                content={qm.mcqStem}
                                inline={true}
                                className="inline text-[14px] leading-relaxed font-serif text-slate-800"
                              />
                            </div>
                          )}

                          <div className="space-y-2.5">
                            <div className="text-[15px] flex justify-between items-start gap-4 w-full">
                              <div className="flex gap-2">
                                <span className="font-normal text-black shrink-0">
                                  ১.
                                </span>
                                <RichTextRender
                                  content={qm.mcqQuestionText || "প্রশ্ন বিবরণ"}
                                />
                              </div>
                              <span className="text-slate-700 text-xs font-sans font-bold whitespace-nowrap pt-1 ">
                                ১
                              </span>
                            </div>
                            {qm.mcqType === "MultipleCompletion" && (
                              <div className="space-y-1 pl-6 mt-2 font-normal text-sm font-sans">
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
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-6 text-[14px] font-sans text-black">
                              {qm.mcqOptions.map((opt, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-1.5 items-start"
                                >
                                  <span className="font-normal text-black shrink-0">
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
                                    className="inline-block font-sans [&_p]:inline [&_p]:m-0 font-normal text-black"
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
                      ) : null}

                      {qm.formCategory === "Creative" && qm.creativeStem && (
                        <div className="space-y-4">
                          {qm.creativeStem && (
                            <div className="text-[14px] leading-relaxed font-serif text-slate-800">
                              <strong className="font-bold text-slate-900 mr-1.5">
                                উদ্দীপক:
                              </strong>
                              <RichTextRender
                                content={qm.creativeStem}
                                inline={true}
                                className="inline text-[14px] leading-relaxed font-serif text-slate-800"
                              />
                            </div>
                          )}

                          <div className="pl-2 space-y-3.5 text-[14px] font-sans font-normal text-slate-800">
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start gap-2">
                                <span className="w-6 font-normal text-black">
                                  ক.
                                </span>
                                <span className="flex-1 font-serif font-normal text-slate-800 text-[14px]">
                                  {qm.creativeCognitiveA ||
                                    "জ্ঞানমূলক প্রশ্ন..."}
                                </span>
                                <span className="text-slate-700 text-xs font-serif font-bold">
                                  ১
                                </span>
                              </div>
                              {qm.creativeCognitiveA_Answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[14px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5 text-[14px]">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={qm.creativeCognitiveA_Answer}
                                    inline={true}
                                    className="inline text-[14px] font-serif [&_*]:!text-[14px] [&_p]:inline [&_p]:m-0"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start gap-2">
                                <span className="w-6 font-normal text-black">
                                  খ.
                                </span>
                                <span className="flex-1 font-serif font-normal text-slate-800 text-[14px]">
                                  {qm.creativeCognitiveB ||
                                    "অনুধাবনমূলক প্রশ্ন..."}
                                </span>
                                <span className="text-slate-700 text-xs font-serif font-bold">
                                  ২
                                </span>
                              </div>
                              {qm.creativeCognitiveB_Answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[14px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5 text-[14px]">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={qm.creativeCognitiveB_Answer}
                                    inline={true}
                                    className="inline text-[14px] font-serif [&_*]:!text-[14px] [&_p]:inline [&_p]:m-0"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start gap-2">
                                <span className="w-6 font-normal text-black">
                                  গ.
                                </span>
                                <span className="flex-1 font-serif font-normal text-slate-800 text-[14px]">
                                  {qm.creativeCognitiveC ||
                                    "প্রয়োগমূলক প্রশ্ন..."}
                                </span>
                                <span className="text-slate-700 text-xs font-serif font-bold">
                                  ৩
                                </span>
                              </div>
                              {qm.creativeCognitiveC_Answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[14px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5 text-[14px]">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={qm.creativeCognitiveC_Answer}
                                    inline={true}
                                    className="inline text-[14px] font-serif [&_*]:!text-[14px] [&_p]:inline [&_p]:m-0"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start gap-2">
                                <span className="w-6 font-normal text-black">
                                  ঘ.
                                </span>
                                <span className="flex-1 font-serif font-normal text-slate-800 text-[14px]">
                                  {qm.creativeCognitiveD ||
                                    "উচ্চতর চিন্তাদক্ষতা প্রশ্ন..."}
                                </span>
                                <span className="text-slate-700 text-xs font-serif font-bold">
                                  ৪
                                </span>
                              </div>
                              {qm.creativeCognitiveD_Answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[14px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5 text-[14px]">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={qm.creativeCognitiveD_Answer}
                                    inline={true}
                                    className="inline text-[14px] font-serif [&_*]:!text-[14px] [&_p]:inline [&_p]:m-0"
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
              <div className="bg-glass p-3.5 sm:p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-3 sm:space-y-4 h-fit">
                <h4 className="font-bold text-slate-800 text-sm sm:text-[16px] border-b border-black/[0.05] pb-2 flex items-center gap-1.5 sm:gap-2">
                  <Database className="size-3.5 sm:size-4 text-[#900EB0]" />
                  সংরক্ষণ করুন
                </h4>

                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                  সব তথ্য পুনরায় যাচাই করে ডাটাবেজে সেভ করুন। প্রশ্ন সংরক্ষণের
                  পর আপনার "আমার তৈরি প্রশ্ন" মডিউলে দেখতে পাবেন।
                </p>

                <div className="space-y-2 pt-2">
                  <RippleButton
                    onClick={qm.handleSaveQuestion}
                    disabled={qm.formLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#900EB0] to-[#B010CA] hover:from-[#720A7B] hover:to-[#900EB0] text-white font-semibold h-9 sm:h-11 rounded-xl shadow-md shadow-[#900EB0]/20 text-xs sm:text-base cursor-pointer"
                  >
                    <Save className="size-3.5 sm:size-4" />
                    {qm.formLoading ? "সংরক্ষণ হচ্ছে..." : "ডাটাবেজে সেভ করুন"}
                    <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
                  </RippleButton>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={qm.formLoading}
                    className="w-full border-black/[0.10] text-slate-600 hover:bg-black/[0.02] rounded-xl h-8 sm:h-10 px-3 sm:px-5 flex items-center justify-center gap-1 font-semibold bg-white/[0.45] backdrop-blur-sm shadow-sm text-xs sm:text-sm"
                  >
                    <ChevronLeft className="size-3.5 sm:size-4" />
                    পেছনে
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
        <DialogContent className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-bengali">
          <div className="p-6 space-y-4">
            <DialogHeader className="space-y-3 text-left">
              <div className="size-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                <AlertCircle
                  className="size-6 text-rose-600 animate-pulse"
                  strokeWidth={2.5}
                />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
                প্রশ্নটি কি মুছে ফেলতে চান?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 leading-relaxed font-medium">
                প্রশ্নটি মুছে ফেললে তা তালিকা থেকে সম্পূর্ণভাবে চলে যাবে। আপনি
                কি নিশ্চিতভাবে এটি মুছে ফেলতে চান?
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs transition cursor-pointer shadow-sm h-10"
              >
                বাতিল করুন
              </Button>
              <Button
                type="button"
                onClick={() => {
                  qm.removeQuestionFromList(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition flex items-center gap-2 cursor-pointer h-10"
              >
                <Trash2 className="size-4 text-white" />
                হ্যাঁ, মুছে ফেলুন
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
