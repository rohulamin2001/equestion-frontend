import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileCheck2,
  FolderTree,
  GraduationCap,
  Loader2,
  Lock,
  PencilLine,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { CATEGORIES_MAP } from "../../constants/categories";
import { ChapterSelectModal } from "./components/ChapterSelectModal";
import { GeneratorHeader } from "./components/GeneratorHeader";
import { StepIndicators } from "./components/StepIndicators";
import { SubjectSelectModal } from "./components/SubjectSelectModal";
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

const MARK_PRESETS = [25, 50, 75, 100];

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
      return "প্রথমে বিষয় সিলেক্ট করুন";
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

  // Determine active step based on form state
  const getActiveStep = () => {
    if (!examName || !selectedClass) return 0;
    if (selectedSubjects.length === 0) return 1;
    if (!questionType || !totalMarks) return 2;
    return 3; // all done — all steps complete
  };
  const activeStep = getActiveStep();

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-12 font-sans relative">
      {/* ── Hero Header Component ── */}
      <GeneratorHeader hasLockedSubject={hasLockedSubject} />

      {/* ── Step Indicators Component ── */}
      <StepIndicators activeStep={activeStep} />

      {/* ── Main Form Card ── */}
      <div className="bg-glass rounded-2xl border border-black/[0.05] shadow-sm p-4 sm:p-7 space-y-4 sm:space-y-5">
        {loadingSubs ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <Loader2 className="size-6 animate-spin text-purple-600" />
            </div>
            <p className="text-xs text-slate-500 font-normal">
              সাবস্ক্রিপশন চেক করা হচ্ছে...
            </p>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3.5">
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100">
              <Lock className="size-6 text-amber-500" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-sm sm:text-base font-semibold text-slate-800">
                কোনো সক্রিয় সাবস্ক্রিপশন নেই
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                ১ ক্লিকে প্রশ্ন তৈরি করতে আপনার সক্রিয় সাবস্ক্রিপশন থাকা
                আবশ্যক। অনুগ্রহ করে আপনার পছন্দের ক্লাস বা বিষয়ের সাবস্ক্রিপশন
                সচল করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/subscription")}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-md shadow-purple-200 cursor-pointer flex items-center gap-2"
            >
              <CreditCard className="size-4" />
              সাবস্ক্রিপশন কিনুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-5">
            {/* ─ Step 1 divider ─ */}
            <div className="flex items-center gap-2 pb-0.5">
              <span className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-purple-600 text-white text-[10px] sm:text-xs font-semibold flex items-center justify-center shrink-0 aspect-square leading-none">
                ১
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                তথ্য ও শ্রেণি
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Exam Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5 sm:gap-2">
                <PencilLine className="size-3.5 sm:size-4 text-purple-600" />
                <span>প্রোগ্রাম/পরীক্ষার নাম</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="যেমন: অর্ধ-বার্ষিক পরীক্ষা ২০২৬"
                className="w-full h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-xs sm:text-sm font-normal text-slate-800 bg-white/80 shadow-2xs transition placeholder:text-slate-300"
              />
            </div>

            {/* Class Select Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5 sm:gap-2">
                <GraduationCap className="size-3.5 sm:size-4 text-purple-600" />
                <span>শ্রেণি</span>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl border border-slate-200 text-left text-xs sm:text-sm flex items-center justify-between hover:border-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition bg-white/80 cursor-pointer select-none font-normal text-slate-800 shadow-2xs"
                  >
                    <span
                      className={
                        classes.find((cls) => cls.value === selectedClass)
                          ? "text-slate-800"
                          : "text-slate-300"
                      }
                    >
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
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-purple-700 ${
                          isSelected
                            ? "bg-purple-50 text-purple-700"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{cls.label}</span>
                        {isSelected && (
                          <CheckCircle2 className="size-3.5 text-purple-600" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ─ Step 2 divider ─ */}
            <div className="flex items-center gap-2 pb-0.5 pt-1">
              <span
                className={`w-5 h-5 min-w-[20px] min-h-[20px] rounded-full text-[10px] sm:text-xs font-semibold flex items-center justify-center shrink-0 aspect-square leading-none transition-all ${
                  activeStep >= 1
                    ? "bg-purple-600 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                ২
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                বিষয় ও অধ্যায়
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Subject Trigger Button */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5 sm:gap-2">
                <BookOpenCheck className="size-3.5 sm:size-4 text-purple-600" />
                <span>বিষয়</span>
                {selectedSubjects.length > 0 && (
                  <span className="ml-auto text-[10px] sm:text-xs font-medium bg-purple-600 text-white px-2.5 py-0.5 rounded-full">
                    {selectedSubjects.length} টি নির্বাচিত
                  </span>
                )}
              </label>
              <button
                type="button"
                onClick={handleOpenSubjectModal}
                className="w-full min-h-10 sm:min-h-11 py-1.5 px-3 sm:px-3.5 rounded-xl border border-slate-200 text-left text-xs sm:text-sm flex items-center justify-between hover:border-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition bg-white/80 cursor-pointer select-none text-slate-800 shadow-2xs"
              >
                <div className="flex-1 flex flex-wrap gap-1.5 items-center min-h-[24px]">
                  {selectedSubjects.length > 0 ? (
                    selectedSubjects.map((s) => {
                      const itemId = s.subjectId?._id || s.subjectId;
                      return (
                        <span
                          key={itemId}
                          className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/60 px-2.5 py-0.5 rounded-lg text-xs font-medium"
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
                            className="hover:bg-purple-100/80 p-0.5 rounded-md transition text-purple-400 hover:text-purple-700 cursor-pointer ml-0.5 flex items-center justify-center size-3.5"
                          >
                            <X className="size-3" />
                          </span>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-slate-300 text-xs sm:text-sm">
                      বিষয় সিলেক্ট করুন
                    </span>
                  )}
                </div>
                <ChevronDown className="size-4 text-slate-400 shrink-0 ml-2" />
              </button>
            </div>

            {/* Chapter Trigger Button */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5 sm:gap-2">
                <FolderTree className="size-3.5 sm:size-4 text-purple-600" />
                <span>অধ্যায়</span>
                {selectedChapters.length > 0 && (
                  <span className="ml-auto text-[10px] sm:text-xs font-medium bg-purple-600 text-white px-2.5 py-0.5 rounded-full">
                    {selectedChapters.length} টি নির্বাচিত
                  </span>
                )}
              </label>
              <button
                type="button"
                disabled={selectedSubjects.length === 0}
                onClick={() => setShowChapterModal(true)}
                className={`w-full h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition shadow-2xs ${
                  selectedSubjects.length === 0
                    ? "bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100"
                    : "bg-white/80 border-slate-200 hover:border-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 cursor-pointer text-slate-800"
                }`}
              >
                <span
                  className={
                    selectedChapters.length > 0
                      ? "text-slate-800 font-medium"
                      : "text-slate-300"
                  }
                >
                  {selectedChapters.length > 0
                    ? `${selectedChapters.length} টি অধ্যায় সিলেক্ট করা হয়েছে`
                    : "অধ্যায় সিলেক্ট করুন"}
                </span>
                <ChevronDown className="size-4 text-slate-400" />
              </button>
            </div>

            {/* ─ Step 3 divider ─ */}
            <div className="flex items-center gap-2 pb-0.5 pt-1">
              <span
                className={`w-5 h-5 min-w-[20px] min-h-[20px] rounded-full text-[10px] sm:text-xs font-semibold flex items-center justify-center shrink-0 aspect-square leading-none transition-all ${
                  activeStep >= 2
                    ? "bg-purple-600 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                ৩
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                টাইপ ও নম্বর
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Type Select & Total Marks */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Type Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5 sm:gap-2">
                  <FileCheck2 className="size-3.5 sm:size-4 text-purple-600" />
                  <span>প্রশ্নের টাইপ</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    disabled={activeCategories.length === 0}
                  >
                    <button
                      disabled={activeCategories.length === 0}
                      type="button"
                      className="w-full h-10 sm:h-11 px-3.5 sm:px-4 border border-slate-200 bg-white/80 hover:border-purple-300 disabled:bg-slate-50 disabled:border-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all rounded-xl text-xs sm:text-sm font-normal text-slate-800 flex justify-between items-center shadow-2xs cursor-pointer select-none"
                    >
                      <span className="truncate">{getSelectedTypeLabel()}</span>
                      <ChevronDown className="size-4 text-slate-400 pointer-events-none shrink-0 ml-1" />
                    </button>
                  </DropdownMenuTrigger>
                  {activeCategories.length > 0 && (
                    <DropdownMenuContent className="bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)] font-sans max-h-52 overflow-y-auto">
                      {activeCategories.map((catValue) => {
                        const catObj = CATEGORIES_MAP.find(
                          (c) => c.value === catValue,
                        );
                        const isSelected = questionType === catValue;
                        return (
                          <DropdownMenuItem
                            key={catValue}
                            onSelect={() => setQuestionType(catValue)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-purple-700 ${
                              isSelected
                                ? "bg-purple-50 text-purple-700"
                                : "text-slate-700"
                            }`}
                          >
                            <span>{catObj ? catObj.label : catValue}</span>
                            {isSelected && (
                              <CheckCircle2 className="size-3.5 text-purple-600" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                      <DropdownMenuItem
                        onSelect={() => setQuestionType("Combined")}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-purple-700 ${
                          questionType === "Combined"
                            ? "bg-purple-50 text-purple-700"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{getCombinedLabel()}</span>
                        {questionType === "Combined" && (
                          <CheckCircle2 className="size-3.5 text-purple-600" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              </div>

              {/* Total Marks */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5 sm:gap-2">
                  <Award className="size-3.5 sm:size-4 text-purple-600" />
                  <span>মোট নম্বর</span>
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  placeholder="100"
                  className="w-full h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-xs sm:text-sm font-semibold text-slate-800 bg-white/80 shadow-2xs transition"
                />
              </div>
            </div>

            {/* Quick Mark Presets */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs font-medium text-slate-400">
                দ্রুত:
              </span>
              {MARK_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTotalMarks(String(preset))}
                  className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                    String(totalMarks) === String(preset)
                      ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-700"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={generating || fetchingSyllabus}
              className="w-full h-11 sm:h-12 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 className="size-4 sm:size-5 animate-spin text-white" />
                  <span>প্রশ্ন তৈরি করা হচ্ছে...</span>
                </>
              ) : (
                <span>প্রশ্ন তৈরি করুন</span>
              )}
            </button>
          </form>
        )}
      </div>

      {/* ── Subject Selection Modal Component ── */}
      <SubjectSelectModal
        showSubjectModal={showSubjectModal}
        setShowSubjectModal={setShowSubjectModal}
        selectedSubjects={selectedSubjects}
        setSelectedSubjects={setSelectedSubjects}
        tempSelectedSubjects={tempSelectedSubjects}
        setTempSelectedSubjects={setTempSelectedSubjects}
        setSelectedChapters={setSelectedChapters}
        filteredSyllabusList={filteredSyllabusList}
        fetchingSyllabus={fetchingSyllabus}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
      />

      {/* ── Chapter Selection Modal Component ── */}
      <ChapterSelectModal
        showChapterModal={showChapterModal}
        setShowChapterModal={setShowChapterModal}
        selectedSubjects={selectedSubjects}
        selectedChapters={selectedChapters}
        setSelectedChapters={setSelectedChapters}
        hasSubjectAccess={hasSubjectAccess}
      />
    </div>
  );
}
