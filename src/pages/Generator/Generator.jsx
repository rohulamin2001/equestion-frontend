import {
  BookOpen,
  ChevronDown,
  CreditCard,
  FileText,
  Layers,
  Loader2,
  Lock,
  School,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { CATEGORIES_MAP } from "../../constants/categories";
import { useGenerator } from "./hook/useGenerator";

const SHORT_CATEGORY_LABELS = {
  MCQ: "বহু",
  Creative: "সৃজনশীল",
  ShortAnswer: "সংক্ষিপ্ত",
  BroadQuestion: "রচনামূলক",
  FillInBlanks: "শূন্যস্থান",
  Matching: "মিলকরণ",
  Poem: "কবিতা",
  SentenceFormation: "বাক্য গঠন",
  ConjunctLetters: "যুক্তবর্ণ",
  WordMeaning: "শব্দার্থ",
  Punctuation: "বিরামচিহ্ন",
  GenderChange: "লিঙ্গান্তর",
  Antonym: "বিপরীত শব্দ",
  FormFilling: "ফরম পূরণ",
  Paragraph: "অনুচ্ছেদ",
  Essay: "রচনা",
};

export default function Generator() {
  const navigate = useNavigate();

  const {
    examName,
    setExamName,
    selectedClass,
    setSelectedClass,
    selectedSubjects,
    setSelectedSubjects,
    tempSelectedSubjects,
    setTempSelectedSubjects,
    selectedChapters,
    setSelectedChapters,
    questionType,
    setQuestionType,
    activeCategories,
    totalMarks,
    setTotalMarks,
    showSubjectModal,
    setShowSubjectModal,
    showChapterModal,
    setShowChapterModal,
    subjectFilter,
    setSubjectFilter,

    classes,
    filteredSyllabusList,

    loadingSubs,
    fetchingSyllabus,
    generating,

    hasLockedSubject,
    hasSubjectAccess,

    handleOpenSubjectModal,
    handleGenerate,
  } = useGenerator();

  const getCombinedLabel = () => {
    if (!activeCategories || activeCategories.length === 0) return "সমন্বিত";
    const shortNames = activeCategories
      .map((cat) => SHORT_CATEGORY_LABELS[cat] || cat)
      .filter(Boolean);
    return `সমন্বিত (${shortNames.join(", ")})`;
  };

  const getSelectedTypeLabel = () => {
    if (activeCategories.length === 0) {
      return "প্রথমে বিষয় সিলেক্ট করুন";
    }
    if (!questionType) {
      return "টাইপ নির্বাচন করুন";
    }
    if (questionType === "Combined") {
      return getCombinedLabel();
    }
    const catObj = CATEGORIES_MAP.find((c) => c.value === questionType);
    return catObj ? catObj.label : questionType;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 font-sans relative">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-purple-950 text-white rounded-2xl p-8 text-center relative overflow-hidden shadow-lg shadow-purple-900/10">
        <div className="absolute top-3 right-4 text-xs opacity-40 font-semibold tracking-widest">
          ৪.৩.৩
        </div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
          <span>১ ক্লিকে প্রশ্ন তৈরির সফটওয়্যার</span>
          <Sparkles className="size-5 text-yellow-300 animate-pulse" />
        </h1>
        <p className="text-xs text-purple-200 mt-2 flex items-center justify-center gap-1 font-medium">
          শিক্ষা এবং সফটওয়্যার, একসাথে এগিয়ে চলা! 🌱
        </p>

        {/* Subscribe Banner if any selected subject is locked */}
        {hasLockedSubject && (
          <div className="mt-5 flex justify-center">
            <button
              onClick={() => navigate("/dashboard/subscription")}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 transition text-white px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-red-500/20 cursor-pointer"
            >
              <CreditCard className="size-4" />
              <span>Subscribe Now!</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Generator Form Card */}
      <div className="bg-glass rounded-2xl border shadow-sm p-8 space-y-5">
        {loadingSubs ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3 font-sans">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-xs text-slate-500 font-medium">
              সাবস্ক্রিপশন চেক করা হচ্ছে...
            </p>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="p-3 bg-amber-50 rounded-full border border-amber-200/60">
              <Lock className="size-6 text-amber-600" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-sm font-semibold text-slate-800">
                কোনো সক্রিয় সাবস্ক্রিপশন নেই
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                ১ ক্লিকে প্রশ্ন তৈরি করতে আপনার সক্রিয় সাবস্ক্রিপশন থাকা আবশ্যক।
                অনুগ্রহ করে আপনার পছন্দের ক্লাস বা বিষয়ের সাবস্ক্রিপশন সচল করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/subscription")}
              className="bg-primary hover:bg-purple-700 transition text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-purple-200 cursor-pointer"
            >
              সাবস্ক্রিপশন কিনুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Exam Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="size-4 text-primary" />
                <span>প্রোগ্রাম/পরীক্ষার নাম লিখুন</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="যেমন: অর্ধ-বার্ষিক পরীক্ষা ২০২৬"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus-visible:ring-purple-100 focus-visible:border-primary text-sm font-medium text-slate-800 bg-white/70 shadow-sm"
              />
              {examName === "" && (
                <p className="text-[10px] text-red-500 font-medium">
                  প্রোগ্রাম/পরীক্ষার নাম লিখুন
                </p>
              )}
            </div>

            {/* Class Select Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <School className="size-4 text-primary" />
                <span>শ্রেণি</span>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-left text-sm flex items-center justify-between hover:border-purple-300 focus-visible:ring-purple-100 focus-visible:border-primary transition bg-white/70 cursor-pointer select-none font-medium text-slate-800 shadow-sm"
                  >
                    <span>
                      {classes.find((cls) => cls.value === selectedClass)
                        ?.label || "শ্রেণি সিলেক্ট করুন"}
                    </span>
                    <ChevronDown className="size-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto font-sans">
                  {classes.map((cls) => {
                    const isSelected = selectedClass === cls.value;
                    return (
                      <DropdownMenuItem
                        key={cls.value}
                        onSelect={() => setSelectedClass(cls.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-primary ${
                          isSelected
                            ? "bg-purple-50 text-primary"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{cls.label}</span>
                        {isSelected && (
                          <span className="size-1.5 rounded-full bg-primary" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Subject Trigger Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="size-4 text-primary" />
                <span>বিষয়</span>
              </label>
              <button
                type="button"
                onClick={handleOpenSubjectModal}
                className="w-full min-h-11 py-2 px-3.5 rounded-xl border border-slate-200 text-left text-sm flex items-center justify-between hover:border-purple-300 focus-visible:ring-purple-100 focus-visible:border-primary transition bg-white/70 cursor-pointer select-none text-slate-800 shadow-sm"
              >
                <div className="flex-1 flex flex-wrap gap-1.5 items-center min-h-[26px]">
                  {selectedSubjects.length > 0 ? (
                    selectedSubjects.map((s) => {
                      const itemId = s.subjectId?._id || s.subjectId;
                      return (
                        <span
                          key={itemId}
                          className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/60 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs"
                        >
                          <span>
                            {s.subjectName} (
                            {s.version === "Bangla"
                              ? "বাংলা"
                              : s.version === "Madrasah"
                                ? "মাদ্রাসা"
                                : "ইংরেজি"}
                            )
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubjects((prev) =>
                                prev.filter(
                                  (item) =>
                                    (item.subjectId?._id || item.subjectId) !==
                                    itemId,
                                ),
                              );
                              setSelectedChapters((prev) =>
                                prev.filter(
                                  (key) => key.split("_")[0] !== itemId,
                                ),
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                setSelectedSubjects((prev) =>
                                  prev.filter(
                                    (item) =>
                                      (item.subjectId?._id ||
                                        item.subjectId) !== itemId,
                                  ),
                                );
                                setSelectedChapters((prev) =>
                                  prev.filter(
                                    (key) => key.split("_")[0] !== itemId,
                                  ),
                                );
                              }
                            }}
                            className="hover:bg-purple-100/80 p-0.5 rounded-md transition text-purple-500 hover:text-purple-700 cursor-pointer ml-0.5 flex items-center justify-center size-4"
                          >
                            <X className="size-3" />
                          </span>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-slate-400">বিষয় সিলেক্ট করুন</span>
                  )}
                </div>
                <ChevronDown className="size-4 text-slate-400 shrink-0 ml-2" />
              </button>
            </div>

            {/* Chapter Trigger Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="size-4 text-primary" />
                <span>অধ্যায়</span>
              </label>
              <button
                type="button"
                disabled={selectedSubjects.length === 0}
                onClick={() => setShowChapterModal(true)}
                className={`w-full h-11 px-4 rounded-xl border border-slate-200 text-left text-sm flex items-center justify-between transition shadow-sm ${
                  selectedSubjects.length === 0
                    ? "bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100"
                    : "bg-white/70 hover:border-purple-300 focus-visible:ring-purple-100 focus-visible:border-primary cursor-pointer text-slate-800"
                }`}
              >
                <span
                  className={
                    selectedChapters.length > 0
                      ? "text-slate-800 font-semibold"
                      : "text-slate-400"
                  }
                >
                  {selectedChapters.length > 0
                    ? `${selectedChapters.length} টি অধ্যায় সিলেক্ট করা হয়েছে`
                    : "অধ্যায় সিলেক্ট করুন"}
                </span>
                <ChevronDown className="size-4 text-slate-400" />
              </button>
            </div>

            {/* Type Select & Total Marks inline inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  টাইপ
                </label>
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      disabled={activeCategories.length === 0}
                    >
                      <button
                        disabled={activeCategories.length === 0}
                        type="button"
                        className="w-full h-11 px-4 border border-slate-200 bg-white/70 hover:border-purple-300 disabled:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-800 flex justify-between items-center shadow-sm cursor-pointer select-none"
                      >
                        <span>{getSelectedTypeLabel()}</span>
                        <ChevronDown className="size-4 text-slate-400 pointer-events-none" />
                      </button>
                    </DropdownMenuTrigger>
                    {activeCategories.length > 0 && (
                      <DropdownMenuContent className="bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)] font-sans">
                        {activeCategories.map((catValue) => {
                          const catObj = CATEGORIES_MAP.find(
                            (c) => c.value === catValue,
                          );
                          const isSelected = questionType === catValue;
                          return (
                            <DropdownMenuItem
                              key={catValue}
                              onSelect={() => setQuestionType(catValue)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-primary ${
                                isSelected
                                  ? "bg-purple-50 text-primary"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>{catObj ? catObj.label : catValue}</span>
                              {isSelected && (
                                <span className="size-1.5 rounded-full bg-primary" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                        <DropdownMenuItem
                          onSelect={() => setQuestionType("Combined")}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-primary ${
                            questionType === "Combined"
                              ? "bg-purple-50 text-primary"
                              : "text-slate-700"
                          }`}
                        >
                          <span>{getCombinedLabel()}</span>
                          {questionType === "Combined" && (
                            <span className="size-1.5 rounded-full bg-primary" />
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    )}
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  মোট নম্বর
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  placeholder="100"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 focus-visible:ring-purple-100 focus-visible:border-primary text-sm font-semibold text-slate-800 bg-white/70 shadow-sm"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={generating || fetchingSyllabus}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-purple-200 cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 className="size-5 animate-spin text-white" />
                  <span>প্রশ্ন তৈরি করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-5 text-yellow-300" />
                  <span>প্রশ্ন তৈরি করুন</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Modal 1: Subject Selection Popup */}
      <Dialog
        open={showSubjectModal}
        onOpenChange={(open) => {
          if (open) {
            setTempSelectedSubjects(selectedSubjects);
          }
          setShowSubjectModal(open);
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={true}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans"
        >
          {/* Header */}
          <DialogHeader className="p-5 border-b border-slate-100/50 mb-0 flex flex-col justify-start items-start">
            <DialogTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              <span>বিষয় সিলেক্ট করুন</span>
            </DialogTitle>
          </DialogHeader>

          {/* Filters (centered badges) */}
          <div className="p-4 bg-slate-50/50 flex justify-center gap-2 flex-wrap border-b border-slate-100/50">
            {[
              { id: "all", label: "সবগুলো" },
              { id: "bangla", label: "বাংলা ভার্সন" },
              { id: "english", label: "English Version" },
              { id: "madrasah", label: "মাদ্রাসা" },
            ].map((f) => {
              const isActive = subjectFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSubjectFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer select-none ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* List */}
          <div className="max-h-[280px] overflow-y-auto p-5 space-y-2">
            {fetchingSyllabus ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-7 animate-spin text-primary" />
              </div>
            ) : filteredSyllabusList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8 font-medium italic">
                কোনো বিষয় পাওয়া যায়নি।
              </p>
            ) : (
              filteredSyllabusList.map((item) => {
                const itemId = item.subjectId?._id || item.subjectId;
                const isSelected = tempSelectedSubjects.some(
                  (s) => (s.subjectId?._id || s.subjectId) === itemId,
                );
                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      if (isSelected) {
                        setTempSelectedSubjects((prev) =>
                          prev.filter(
                            (s) => (s.subjectId?._id || s.subjectId) !== itemId,
                          ),
                        );
                      } else {
                        setTempSelectedSubjects((prev) => [...prev, item]);
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                      isSelected
                        ? "border-purple-300 bg-purple-50/60 text-purple-800 shadow-sm"
                        : "border-slate-200 bg-white/70 hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="size-4 rounded text-primary border-slate-300 focus:ring-purple-100 accent-purple-600 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        {item.subjectName}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-2 py-0.5 bg-slate-100 border border-slate-200/60 rounded-md">
                      {item.version === "Bangla"
                        ? "বাংলা"
                        : item.version === "Madrasah"
                          ? "মাদ্রাসা"
                          : "ইংরেজি"}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Select & Close Buttons */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100/50 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedSubjects(tempSelectedSubjects);
                const selectedIds = tempSelectedSubjects.map(
                  (s) => s.subjectId?._id || s.subjectId,
                );
                setSelectedChapters((prev) =>
                  prev.filter((key) => selectedIds.includes(key.split("_")[0])),
                );
                setShowSubjectModal(false);
              }}
              className="flex-1 h-10 bg-primary hover:bg-purple-700 transition rounded-xl text-xs font-semibold text-white shadow-md shadow-purple-200 cursor-pointer"
            >
              সিলেক্ট করুন
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSubjectModal(false);
              }}
              className="flex-1 h-10 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-xl text-xs font-semibold text-slate-600 cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Chapter Selection Popup */}
      <Dialog open={showChapterModal} onOpenChange={setShowChapterModal}>
        <DialogContent
          from="top"
          showCloseButton={true}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans"
        >
          {/* Header */}
          <DialogHeader className="p-5 border-b border-slate-100/50 mb-0 flex flex-col justify-start items-start">
            <DialogTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span>অধ্যায় সিলেক্ট করুন</span>
            </DialogTitle>
          </DialogHeader>

          {/* List */}
          <div className="max-h-[350px] overflow-y-auto p-5 space-y-4">
            {selectedSubjects.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6 italic">
                কোনো বিষয় সিলেক্ট করা নেই।
              </p>
            ) : (
              selectedSubjects.map((sub) => {
                const subId = sub.subjectId?._id || sub.subjectId;
                const isSubscribed = hasSubjectAccess(sub);

                return (
                  <div key={subId} className="space-y-2">
                    <h4 className="text-xs font-semibold text-primary bg-purple-50/60 px-2.5 py-1.5 rounded-lg border border-purple-100">
                      {sub.subjectName} (
                      {sub.version === "Bangla"
                        ? "বাংলা"
                        : sub.version === "Madrasah"
                          ? "মাদ্রাসা"
                          : "ইংরেজি"}
                      )
                    </h4>
                    {!sub.chapters || sub.chapters.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic pl-2">
                        কোনো অধ্যায় পাওয়া যায়নি।
                      </p>
                    ) : (
                      <div className="space-y-1.5 pl-1">
                        {sub.chapters.map((ch, idx) => {
                          const isLocked = !isSubscribed && idx > 0;
                          const key = `${subId}_${ch.chapterNumber}`;
                          const isChecked = selectedChapters.includes(key);

                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                if (isLocked) {
                                  toast.error(
                                    "বাকি অধ্যায়সমূহ আনলক করতে অনুগ্রহ করে সাবস্ক্রাইব করুন।",
                                  );
                                  return;
                                }
                                setSelectedChapters((prev) =>
                                  prev.includes(key)
                                    ? prev.filter((k) => k !== key)
                                    : [...prev, key],
                                );
                              }}
                              className={`p-3 border rounded-xl flex items-center justify-between transition select-none ${
                                isLocked
                                  ? "border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-60"
                                  : isChecked
                                    ? "border-purple-300 bg-purple-50/60 cursor-pointer shadow-sm text-purple-800"
                                    : "border-slate-200 bg-white/70 hover:border-purple-200 cursor-pointer text-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {isLocked ? (
                                  <Lock className="size-4 text-slate-400 shrink-0" />
                                ) : (
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="size-4 rounded text-primary border-slate-300 focus:ring-purple-100 accent-purple-600 cursor-pointer shrink-0"
                                  />
                                )}
                                <span
                                  className={`text-xs font-semibold ${isLocked ? "text-slate-400" : "text-slate-800"}`}
                                >
                                  {ch.chapterName}
                                </span>
                              </div>
                              {isLocked && (
                                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60">
                                  Locked
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100/50 flex gap-3">
            <button
              type="button"
              onClick={() => setShowChapterModal(false)}
              className="w-full h-10 bg-primary hover:bg-purple-700 transition rounded-xl text-xs font-semibold text-white shadow-md shadow-purple-200 cursor-pointer text-center"
            >
              ঠিক আছে
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
