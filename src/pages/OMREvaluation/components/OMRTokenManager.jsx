import {
  BarChart3,
  BookOpen,
  ChevronDown,
  Copy,
  Edit,
  FileCheck,
  Hash,
  KeyRound,
  PlayCircle,
  Plus,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCreateOMRToken,
  useDeleteOMRToken,
  useOMRTemplates,
  useOMRTokens,
  useUpdateOMRToken,
} from "../hook/useOMREvaluation";

const STANDARD_TEMPLATES = [
  { totalQuestions: 20, title: "২০ প্রশ্নের স্ট্যান্ডার্ড OMR শিট (১ কলাম)", code: "OMR-20-V1" },
  { totalQuestions: 40, title: "৪০ প্রশ্নের স্ট্যান্ডার্ড OMR শিট (২ কলাম)", code: "OMR-40-V1" },
  { totalQuestions: 60, title: "৬০ প্রশ্নের স্ট্যান্ডার্ড OMR শিট (৩ কলাম)", code: "OMR-60-V1" },
  { totalQuestions: 80, title: "৮০ প্রশ্নের স্ট্যান্ডার্ড OMR শিট (৪ কলাম)", code: "OMR-80-V1" },
  { totalQuestions: 100, title: "১০০ প্রশ্নের স্ট্যান্ডার্ড OMR শিট (৪ কলাম)", code: "OMR-100-V1" },
];

const NEGATIVE_MARK_OPTIONS = [
  { value: 0, label: "০ (কোনো নেগেটিভ নেই)" },
  { value: 0.25, label: "০.২৫ (৪টি ভুলে ১ নম্বর কাটা)" },
  { value: 0.5, label: "০.৫০ (২টি ভুলে ১ নম্বর কাটা)" },
  { value: 1, label: "১.০০ (১টি ভুলে ১ নম্বর কাটা)" },
];

export default function OMRTokenManager({ onSelectTokenForEvaluation }) {
  const { data: tokens = [], isLoading: loadingTokens } = useOMRTokens();
  const { data: templates = [] } = useOMRTemplates();
  const createTokenMutation = useCreateOMRToken();
  const updateTokenMutation = useUpdateOMRToken();
  const deleteTokenMutation = useDeleteOMRToken();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingToken, setEditingToken] = useState(null);

  // Form State
  const [examTitle, setExamTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [negativeMarks, setNegativeMarks] = useState(0.25);
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [answerKey, setAnswerKey] = useState({});

  // Compute standard 20, 40, 60, 80, 100 templates merged with DB templates
  const templateOptions = STANDARD_TEMPLATES.map((st) => {
    const dbTpl = templates.find(
      (t) => t.totalQuestions === st.totalQuestions || t.layoutCode === st.code
    );
    return {
      _id: dbTpl?._id || st.code,
      title: st.title,
      totalQuestions: st.totalQuestions,
      code: st.code,
    };
  });

  const selectedTemplate =
    templateOptions.find((t) => t._id === selectedTemplateId) ||
    templates.find((t) => t._id === selectedTemplateId) ||
    templateOptions[1] ||
    templateOptions[0];

  const totalQuestions = selectedTemplate?.totalQuestions || 40;

  const initAnswers = (count) => {
    const obj = {};
    for (let i = 1; i <= count; i++) obj[i] = "A";
    setAnswerKey(obj);
  };

  const handleOpenCreateModal = () => {
    setEditingToken(null);
    setExamTitle("");
    setSubject("");
    setClassName("");
    setNegativeMarks(0.25);
    setMarksPerQuestion(1);

    const defaultTpl = templateOptions[1] || templateOptions[0]; // 40 questions default
    if (defaultTpl) {
      setSelectedTemplateId(defaultTpl._id);
      initAnswers(defaultTpl.totalQuestions);
    } else {
      setSelectedTemplateId("");
      setAnswerKey({});
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (token) => {
    setEditingToken(token);
    setExamTitle(token.examTitle || "");
    setSubject(token.subject || "");
    setClassName(token.className || "");
    setNegativeMarks(token.negativeMarks ?? 0.25);
    setMarksPerQuestion(token.marksPerQuestion ?? 1);
    
    const tplId = token.omrTemplate?._id || token.omrTemplate || "";
    setSelectedTemplateId(tplId);

    const keyObj = {};
    (token.answerKey || []).forEach((k) => {
      keyObj[k.questionNo] = k.correctAnswer;
    });
    setAnswerKey(keyObj);
    setIsModalOpen(true);
  };

  const handleTemplateChange = (tplId, count) => {
    setSelectedTemplateId(tplId);
    initAnswers(count);
  };

  const handleOptionSelect = (qNo, opt) => {
    setAnswerKey((prev) => ({ ...prev, [qNo]: opt }));
  };

  const quickFillAll = (opt) => {
    const obj = {};
    for (let i = 1; i <= totalQuestions; i++) obj[i] = opt;
    setAnswerKey(obj);
    toast.info(`সকল প্রশ্নের উত্তর '${opt}' সেট করা হয়েছে`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!examTitle.trim()) {
      toast.error("পরীক্ষার শিরোনাম লিখুন");
      return;
    }
    if (!selectedTemplateId) {
      toast.error("OMR টেমপ্লেট নির্বাচন করুন");
      return;
    }

    const formattedKey = [];
    for (let i = 1; i <= totalQuestions; i++) {
      formattedKey.push({ questionNo: i, correctAnswer: answerKey[i] || "A" });
    }

    // Resolve mongo template ID if available from database
    const dbTpl = templates.find(
      (t) =>
        t._id === selectedTemplateId ||
        t.layoutCode === selectedTemplateId ||
        t.totalQuestions === totalQuestions
    );
    const resolvedTemplateId = dbTpl?._id || selectedTemplateId;

    const payload = {
      examTitle,
      subject,
      className,
      totalQuestions,
      omrTemplateId: resolvedTemplateId,
      negativeMarks: Number(negativeMarks),
      marksPerQuestion: Number(marksPerQuestion),
      answerKey: formattedKey,
    };

    if (editingToken) {
      await updateTokenMutation.mutateAsync({ id: editingToken._id, payload });
    } else {
      await createTokenMutation.mutateAsync(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (token) => {
    if (
      window.confirm(
        `আপনি কি নিশ্চিত যে "${token.examTitle}" টোকেন ও এর সকল রেজাল্ট মুছে ফেলতে চান?`,
      )
    ) {
      await deleteTokenMutation.mutateAsync(token._id);
    }
  };

  const copyTokenId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success(`টোকেন আইডি "${id}" কপি করা হয়েছে!`);
  };

  return (
    <div className="space-y-5">
      {/* ── Top Banner ── */}
      <div
        className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl text-white"
        style={{
          background: "var(--q-header-gradient)",
          boxShadow: "var(--q-section-shadow)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{ background: "var(--q-glow-blob-1)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-15"
          style={{ background: "var(--q-glow-blob-2)" }}
        />

        <div className="relative space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold backdrop-blur-md border border-white/20">
            <Zap className="w-3 h-3" />
            <span>Step 2: Get OMR Token</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            OMR টোকেন ও উত্তরমালা তৈরি করুন
          </h2>
          <p className="text-xs text-white/75 max-w-xl leading-relaxed">
            একটি OMR Token তৈরি করুন যেখানে আপনার পরীক্ষার উত্তরপত্র, সিলেক্টেড
            OMR ও নেগেটিভ মার্কিং সংরক্ষিত থাকবে।
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="relative shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-white/95 hover:bg-white font-bold text-sm rounded-xl shadow-lg transition-modern hover-lift active:scale-95 focus-ring-modern"
          style={{ color: "var(--purple-700)" }}
        >
          <Plus className="w-4 h-4" />
          <span>নতুন টোকেন তৈরি করুন</span>
        </button>
      </div>

      {/* ── Token List Preloader Skeleton ── */}
      {loadingTokens ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-glass rounded-2xl shadow-soft p-5 pt-6 space-y-3.5 relative overflow-hidden"
              style={{ border: "1px solid var(--q-card-border)" }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-40"
                style={{ background: "var(--q-header-gradient)" }}
              />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-28 rounded-lg" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-3.5 w-24 rounded" />
              </div>
              <div
                className="grid grid-cols-2 gap-2 p-3 rounded-xl"
                style={{
                  backgroundColor: "var(--q-selected-bg)",
                  border: "1px solid var(--q-card-border)",
                }}
              >
                <div className="space-y-1.5 flex flex-col items-center">
                  <Skeleton className="h-6 w-10 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
                <div
                  className="space-y-1.5 flex flex-col items-center"
                  style={{ borderLeft: "1px solid var(--q-card-border)" }}
                >
                  <Skeleton className="h-6 w-10 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              </div>
              <div
                className="flex items-center gap-2 pt-2"
                style={{ borderTop: "1px solid var(--q-card-border)" }}
              >
                <Skeleton className="h-9 flex-1 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : tokens.length === 0 ? (
        /* ── Empty State ── */
        <div className="bg-glass rounded-2xl p-12 text-center shadow-soft space-y-4">
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
            style={{
              background: "var(--accent)",
              border: "1px solid var(--q-badge-border)",
            }}
          >
            <KeyRound
              className="w-7 h-7"
              style={{ color: "var(--purple-600)" }}
            />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
              কোনো OMR টোকেন পাওয়া যায়নি
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              OMR শিট মূল্যায়ন করার জন্য প্রথমে একটি টোকেন তৈরি করে সঠিক
              উত্তরপত্র সেট করুন।
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-modern hover-lift focus-ring-modern"
            style={{
              background: "var(--q-header-gradient)",
              boxShadow: "var(--q-print-btn-shadow)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            প্রথম টোকেন তৈরি করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token) => (
            <div
              key={token._id}
              className="group relative bg-glass rounded-2xl shadow-soft hover:shadow-soft-hover transition-modern flex flex-col justify-between overflow-hidden"
              style={{ border: "1px solid var(--q-card-border)" }}
            >
              {/* Top color accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                style={{ background: "var(--q-header-gradient)" }}
              />

              <div className="p-5 pt-6 space-y-3">
                {/* Token ID + Questions */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => copyTokenId(token.tokenId)}
                    className="group/copy inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-modern hover-lift"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--purple-700)",
                      border: "1px solid var(--q-badge-border)",
                    }}
                    title="কপি করতে ক্লিক করুন"
                  >
                    <KeyRound className="w-3 h-3 shrink-0" />
                    <span>{token.tokenId}</span>
                    <Copy className="w-3 h-3 opacity-50 group-hover/copy:opacity-100 transition-modern" />
                  </button>

                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--q-badge-bg)",
                      color: "var(--q-badge-text)",
                      border: "1px solid var(--q-badge-border)",
                    }}
                  >
                    <Hash className="w-3 h-3" />
                    {token.totalQuestions} প্রশ্ন
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug line-clamp-2">
                  {token.examTitle}
                </h3>

                {/* Meta info */}
                <div className="space-y-1">
                  {token.subject && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen
                        className="w-3 h-3 shrink-0"
                        style={{ color: "var(--purple-600)" }}
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {token.subject}
                      </span>
                      {token.className && (
                        <>
                          <span className="opacity-30">•</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {token.className}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                      <span className="opacity-60">নেগেটিভ:</span> -
                      {token.negativeMarks}
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <span className="opacity-60">প্রতি প্রশ্নে:</span> +
                      {token.marksPerQuestion}
                    </span>
                  </div>
                </div>

                {/* Stats pills */}
                <div
                  className="grid grid-cols-2 gap-2 p-3 rounded-xl text-xs"
                  style={{
                    backgroundColor: "var(--q-selected-bg)",
                    border: "1px solid var(--q-card-border)",
                  }}
                >
                  <div className="text-center">
                    <div
                      className="font-black text-base"
                      style={{ color: "var(--purple-600)" }}
                    >
                      {token.stats?.totalEvaluated || 0}
                    </div>
                    <div className="text-muted-foreground text-xs flex items-center justify-center gap-0.5 mt-0.5">
                      <BarChart3 className="w-2.5 h-2.5" />
                      মূল্যায়িত খাতা
                    </div>
                  </div>
                  <div
                    className="text-center"
                    style={{ borderLeft: "1px solid var(--q-card-border)" }}
                  >
                    <div className="font-black text-base text-emerald-600 dark:text-emerald-400">
                      {token.stats?.avgScore || 0}
                    </div>
                    <div className="text-muted-foreground text-xs flex items-center justify-center gap-0.5 mt-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      গড় নম্বর
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center gap-2 px-5 py-3"
                style={{ borderTop: "1px solid var(--q-card-border)" }}
              >
                <button
                  onClick={() =>
                    onSelectTokenForEvaluation &&
                    onSelectTokenForEvaluation(token.tokenId)
                  }
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-white rounded-xl text-sm font-medium transition-modern  focus-ring-modern"
                  style={{
                    background: "var(--q-header-gradient)",
                    boxShadow: "0 4px 12px rgba(144,14,176,0.25)",
                  }}
                >
                  <PlayCircle className="w-4 h-4" />
                  মূল্যায়ন শুরু
                </button>

                <button
                  onClick={() => handleOpenEditModal(token)}
                  className="p-2 rounded-xl transition-modern focus-ring-modern"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-foreground)",
                    border: "1px solid var(--q-badge-border)",
                  }}
                  title="উত্তরমালা ও সেটিংস সম্পাদনা"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(token)}
                  className="p-2 rounded-xl transition-modern focus-ring-modern text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  style={{
                    backgroundColor: "var(--accent)",
                    border: "1px solid var(--q-badge-border)",
                  }}
                  title="টোকেন ডিলিট করুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT TOKEN MODAL ── */}
      {/* ── CREATE / EDIT TOKEN MODAL (PORTAL WITH ANIMATION) ── */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              {/* Neutral Backdrop with blur - No purple tint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              />

              {/* Modal Container with Spring Show & Hide Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -16, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, y: -16, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden z-10"
                style={{ border: "1px solid var(--q-card-border-soft)" }}
              >
                {/* Modal Header */}
                <div
                  className="flex items-center justify-between p-5"
                  style={{ borderBottom: "1px solid var(--q-card-border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      style={{
                        background: "var(--q-header-gradient)",
                        boxShadow: "var(--sidebar-brand-shadow)",
                      }}
                    >
                      <KeyRound className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {editingToken
                          ? "OMR টোকেন ও উত্তরমালা সম্পাদনা"
                          : "নতুন OMR টোকেন তৈরি করুন"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        পরীক্ষার তথ্য ও সঠিক উত্তরমালা সিলেক্ট করুন
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-modern hover-lift focus-ring-modern text-muted-foreground hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer"
                    style={{
                      backgroundColor: "var(--accent)",
                      border: "1px solid var(--q-card-border)",
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <form
                  onSubmit={handleSubmit}
                  className="p-5 space-y-5 overflow-y-auto flex-1 text-xs"
                >
                  {/* Basic Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Exam Title */}
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                        পরীক্ষার শিরোনাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={examTitle}
                        onChange={(e) => setExamTitle(e.target.value)}
                        placeholder="যেমন: ১ম সাময়িক পরীক্ষা ২০২৬"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium text-xs transition-modern focus-ring-modern shadow-xs"
                        style={{ border: "1px solid var(--q-card-border-soft)" }}
                      />
                    </div>

                    {/* OMR Template (Ultra Modern DropdownMenu with 20, 40, 60, 80, 100) */}
                    <div>
                      <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                        OMR টেমপ্লেট *
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="w-full h-10 px-3.5 border border-black/[0.08] dark:border-white/10 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 hover:border-[#900EB0]/40 focus:outline-none focus:ring-2 focus:ring-[#900EB0]/20 transition-all rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex justify-between items-center shadow-xs backdrop-blur-sm cursor-pointer select-none"
                          >
                            <span className="truncate">
                              {selectedTemplate?.title || "টেমপ্লেট নির্বাচন করুন"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/[0.08] dark:border-slate-800 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[999999] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[240px] max-h-60 overflow-y-auto"
                        >
                          {templateOptions.map((tpl) => {
                            const isSelected =
                              selectedTemplate?._id === tpl._id ||
                              selectedTemplate?.totalQuestions === tpl.totalQuestions;
                            return (
                              <DropdownMenuItem
                                key={tpl.totalQuestions}
                                onSelect={() =>
                                  handleTemplateChange(tpl._id, tpl.totalQuestions)
                                }
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-[#900EB0]/10 focus:text-[#900EB0] hover:bg-purple-50/60 dark:hover:bg-slate-800 group ${
                                  isSelected
                                    ? "bg-[#900EB0]/10 text-[#900EB0] font-bold"
                                    : "text-slate-700 dark:text-slate-200"
                                }`}
                              >
                                <span>{tpl.title}</span>
                                {isSelected && (
                                  <span className="size-1.5 rounded-full bg-[#900EB0]" />
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                        বিষয় (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="যেমন: রসায়ন"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium text-xs transition-modern focus-ring-modern shadow-xs"
                        style={{ border: "1px solid var(--q-card-border-soft)" }}
                      />
                    </div>

                    {/* Negative Marks (Ultra Modern DropdownMenu) */}
                    <div>
                      <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                        নেগেটিভ মার্ক
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="w-full h-10 px-3.5 border border-black/[0.08] dark:border-white/10 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 hover:border-[#900EB0]/40 focus:outline-none focus:ring-2 focus:ring-[#900EB0]/20 transition-all rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex justify-between items-center shadow-xs backdrop-blur-sm cursor-pointer select-none"
                          >
                            <span className="truncate">
                              {NEGATIVE_MARK_OPTIONS.find(
                                (o) => o.value === negativeMarks,
                              )?.label || `${negativeMarks}`}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/[0.08] dark:border-slate-800 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[999999] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[220px] max-h-60 overflow-y-auto"
                        >
                          {NEGATIVE_MARK_OPTIONS.map((opt) => {
                            const isSelected = negativeMarks === opt.value;
                            return (
                              <DropdownMenuItem
                                key={opt.value}
                                onSelect={() => setNegativeMarks(opt.value)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-[#900EB0]/10 focus:text-[#900EB0] hover:bg-purple-50/60 dark:hover:bg-slate-800 group ${
                                  isSelected
                                    ? "bg-[#900EB0]/10 text-[#900EB0] font-bold"
                                    : "text-slate-700 dark:text-slate-200"
                                }`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && (
                                  <span className="size-1.5 rounded-full bg-[#900EB0]" />
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Marks Per Question */}
                    <div>
                      <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                        প্রতি সঠিক প্রশ্নের নম্বর
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={marksPerQuestion}
                        onChange={(e) =>
                          setMarksPerQuestion(Number(e.target.value))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium text-xs transition-modern focus-ring-modern shadow-xs"
                        style={{ border: "1px solid var(--q-card-border-soft)" }}
                      />
                    </div>
                  </div>

                  {/* Answer Key Matrix */}
                  <div
                    className="rounded-2xl p-4 space-y-3"
                    style={{
                      backgroundColor: "var(--q-selected-bg)",
                      border: "1px solid var(--q-card-border)",
                    }}
                  >
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2"
                      style={{ borderBottom: "1px solid var(--q-card-border)" }}
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <FileCheck
                          className="w-4 h-4"
                          style={{ color: "var(--purple-600)" }}
                        />
                        <span>
                          উত্তরমালা (Answer Key) সেট করুন{" "}
                          <span className="font-normal text-muted-foreground">
                            ({totalQuestions} টি প্রশ্ন)
                          </span>
                        </span>
                      </div>

                      {/* Quick Fill (No hover-lift translation jump) */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">
                          কুইক ফিল:
                        </span>
                        {["A", "B", "C", "D"].map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => quickFillAll(opt)}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer focus-ring-modern hover:opacity-85"
                            style={{
                              backgroundColor: "var(--accent)",
                              color: "var(--accent-foreground)",
                              border: "1px solid var(--q-badge-border)",
                            }}
                          >
                            সব {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bubble Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 max-h-64 overflow-y-auto p-1 custom-sidebar-scrollbar">
                      {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(
                        (qNo) => (
                          <div
                            key={qNo}
                            className="flex items-center justify-between p-1.5 rounded-xl"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.7)",
                              border: "1px solid var(--q-card-border)",
                            }}
                          >
                            <span className="font-mono font-bold text-[11px] text-muted-foreground w-7">
                              {qNo.toString().padStart(2, "0")}.
                            </span>
                            <div className="flex items-center gap-1">
                              {["A", "B", "C", "D"].map((opt) => {
                                const isSelected = (answerKey[qNo] || "A") === opt;
                                return (
                                  <button
                                    type="button"
                                    key={opt}
                                    onClick={() => handleOptionSelect(qNo, opt)}
                                    className={`w-6 h-6 rounded-full text-[10px] font-bold transition-modern flex items-center justify-center`}
                                    style={
                                      isSelected
                                        ? {
                                            background: "var(--q-header-gradient)",
                                            color: "#fff",
                                            boxShadow:
                                              "0 2px 6px rgba(144,14,176,0.35)",
                                          }
                                        : {
                                            backgroundColor: "var(--accent)",
                                            color: "var(--accent-foreground)",
                                            border:
                                              "1px solid var(--q-badge-border)",
                                          }
                                    }
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl transition-modern hover-lift focus-ring-modern cursor-pointer"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "var(--accent-foreground)",
                        border: "1px solid var(--q-badge-border)",
                      }}
                    >
                      বাতিল
                    </button>

                    <button
                      type="submit"
                      disabled={
                        createTokenMutation.isPending ||
                        updateTokenMutation.isPending
                      }
                      className="px-6 py-2 text-white text-xs font-bold rounded-xl transition-modern hover-lift focus-ring-modern disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        background: "var(--q-header-gradient)",
                        boxShadow: "var(--q-print-btn-shadow)",
                      }}
                    >
                      {createTokenMutation.isPending ||
                      updateTokenMutation.isPending
                        ? "সংরক্ষণ হচ্ছে..."
                        : editingToken
                          ? "আপডেট করুন"
                          : "টোকেন সংরক্ষণ করুন"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
