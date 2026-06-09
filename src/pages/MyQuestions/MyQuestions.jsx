import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";
import { useUserContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FolderOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Filter,
  Loader2,
  BookOpen,
  HelpCircle,
  Check,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const TYPE_LABELS = {
  School: "স্কুল (School)",
  College: "কলেজ (College)",
  Madrasah: "মাদ্রাসা (Madrasah)",
};

const LEVEL_LABELS = {
  Primary: "প্রাথমিক (Primary)",
  Secondary: "মাধ্যমিক (Secondary)",
  "Higher Secondary": "উচ্চমাধ্যমিক (Higher Secondary)",
  Ebtedayee: "ইবতেদায়ী (Ebtedayee)",
  Dakhil: "দাখিল (Dakhil)",
  Alim: "আলিম (Alim)",
};

const DIFFICULTY_MAP = {
  Easy: { label: "সহজ", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  Medium: { label: "মধ্যম", color: "bg-amber-50 text-amber-700 border-emerald-100" },
  Hard: { label: "কঠিন", color: "bg-red-50 text-red-700 border-red-100" },
};

const CATEGORIES_MAP = [
  { value: "MCQ", label: "বহুনির্বাচনি (MCQ)" },
  { value: "Creative", label: "সৃজনশীল প্রশ্ন (CQ)" },
  { value: "ShortAnswer", label: "সংক্ষিপ্ত উত্তর" },
  { value: "FillInBlanks", label: "শূন্যস্থান পূরণ" },
  { value: "Matching", label: "ডানবাম মিলকরণ" },
  { value: "BroadQuestion", label: "বর্ণনামূলক প্রশ্ন" },
];

export default function MyQuestions() {
  const navigate = useNavigate();
  const qm = useQuestionManagement();
  const { userProfile } = useUserContext();

  // Dialog State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch personal questions
  const { data: questions = [], isLoading, isError, refetch } = qm.fetchQuestionsQuery(true);

  // Cascading helpers
  const filterActiveTypes = Array.from(new Set(qm.allowedClasses.map(c => c.type)));
  const filterActiveLevels = Array.from(
    new Set(qm.allowedClasses.filter(c => c.type === qm.filterType).map(c => c.level))
  );
  const filterActiveClasses = qm.allowedClasses.filter(
    c => c.type === qm.filterType && c.level === qm.filterLevel
  );

  const handleFilterTypeChange = (type) => {
    qm.setFilterType(type);
    const levels = Array.from(new Set(qm.allowedClasses.filter(c => c.type === type).map(c => c.level)));
    if (levels.length > 0) {
      const firstLevel = levels[0];
      qm.setFilterLevel(firstLevel);
      const classes = qm.allowedClasses.filter(c => c.type === type && c.level === firstLevel);
      if (classes.length > 0) {
        qm.setFilterClass(classes[0].value);
        qm.setFilterSubjectId("");
        qm.setFilterChapter("");
      }
    }
  };

  const handleFilterLevelChange = (level) => {
    qm.setFilterLevel(level);
    const classes = qm.allowedClasses.filter(c => c.type === qm.filterType && c.level === level);
    if (classes.length > 0) {
      qm.setFilterClass(classes[0].value);
      qm.setFilterSubjectId("");
      qm.setFilterChapter("");
    }
  };

  // Active subjects & chapters for filters based on selected class
  const filterSubjects = qm.syllabusList.filter(
    (s) => s.className === qm.filterClass && s.institutionType === qm.filterType && s.academicLevel === qm.filterLevel
  );
  const selectedSyllabusObj = qm.syllabusList.find((s) => s._id === qm.filterSubjectId);
  const filterChapters = selectedSyllabusObj?.chapters || [];

  // Reset filters
  const handleResetFilters = () => {
    if (qm.allowedClasses && qm.allowedClasses.length > 0) {
      const first = qm.allowedClasses[0];
      qm.setFilterType(first.type);
      qm.setFilterLevel(first.level);
      qm.setFilterClass(first.value);
    } else {
      qm.setFilterType("School");
      qm.setFilterLevel("Secondary");
      qm.setFilterClass("Class 6");
    }
    qm.setFilterSubjectId("");
    qm.setFilterChapter("");
    qm.setFilterCategory("");
    qm.setFilterDifficulty("");
    qm.setFilterSearch("");
  };

  // Trigger edit question
  const handleEdit = (question) => {
    navigate("/dashboard/add-question", { state: { editQuestion: question } });
  };

  // Trigger delete question
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await qm.deleteQuestionMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Bengali Date helper
  const formatBengaliDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Count Statistics
  const totalCount = questions.length;
  const mcqCount = questions.filter((q) => q.category === "MCQ").length;
  const creativeCount = questions.filter((q) => q.category === "Creative").length;
  const otherCount = totalCount - mcqCount - creativeCount;

  return (
    <div className="space-y-6 pb-12 w-full font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">আমার তৈরি প্রশ্ন</h1>
          <p className="text-slate-500 text-sm mt-1">
            আপনার পূর্বে প্রস্তুতকৃত এবং সেভ করা সকল প্রশ্নপত্রসমূহ
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/add-question")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-5 flex items-center gap-2 font-semibold shadow-md shadow-indigo-100 cursor-pointer"
        >
          <Plus className="size-4" />
          নতুন প্রশ্ন যোগ করুন
        </Button>
      </div>

      {/* Statistics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "মোট প্রশ্ন", count: totalCount, color: "from-indigo-500 to-indigo-600", bgLight: "bg-indigo-50" },
          { label: "বহুনির্বাচনি (MCQ)", count: mcqCount, color: "from-emerald-500 to-emerald-600", bgLight: "bg-emerald-50" },
          { label: "সৃজনশীল (CQ)", count: creativeCount, color: "from-amber-500 to-amber-600", bgLight: "bg-amber-50" },
          { label: "সংক্ষিপ্ত ও অন্যান্য", count: otherCount, color: "from-violet-500 to-violet-600", bgLight: "bg-violet-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">{stat.label}</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                {stat.count.toLocaleString("bn-BD")}
              </span>
            </div>
            <div className={`size-10 rounded-full bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-100`}>
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      {/* Filters Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="প্রশ্ন বা উদ্দীপকের অংশবিশেষ খুঁজুন..."
              value={qm.filterSearch}
              onChange={(e) => qm.setFilterSearch(e.target.value)}
              className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-indigo-100 rounded-xl font-semibold text-slate-700"
            />
            {qm.filterSearch && (
              <button
                onClick={() => qm.setFilterSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-11 px-4 flex items-center gap-2 font-semibold ${
                showFilters ? "bg-slate-50 border-indigo-300 text-indigo-600" : ""
              }`}
            >
              <Filter className="size-4" />
              ফিল্টারসমূহ
              <ChevronDown className={`size-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
            </Button>

            {(qm.filterClass !== "Class 6" || qm.filterSubjectId || qm.filterChapter || qm.filterCategory || qm.filterDifficulty || qm.filterSearch) && (
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-11 px-3.5 font-semibold transition"
              >
                রিসেট
              </Button>
            )}
          </div>
        </div>

        {/* Dynamic Filters Grid */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-3 border-t border-slate-50 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Institution Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ধরণ</label>
              <select
                value={qm.filterType}
                onChange={(e) => handleFilterTypeChange(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
              >
                {filterActiveTypes.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_LABELS[type] || type}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Level */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">স্তর</label>
              <select
                value={qm.filterLevel}
                onChange={(e) => handleFilterLevelChange(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
              >
                {filterActiveLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {LEVEL_LABELS[lvl] || lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">শ্রেণী</label>
              <select
                value={qm.filterClass}
                onChange={(e) => {
                  qm.setFilterClass(e.target.value);
                  qm.setFilterSubjectId("");
                  qm.setFilterChapter("");
                }}
                className="w-full h-10 px-3 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
              >
                {filterActiveClasses.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">বিষয়</label>
              <select
                value={qm.filterSubjectId}
                onChange={(e) => {
                  qm.setFilterSubjectId(e.target.value);
                  qm.setFilterChapter("");
                }}
                className="w-full h-10 px-3 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
                disabled={filterSubjects.length === 0}
              >
                <option value="">সকল বিষয়</option>
                {filterSubjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectName}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">অধ্যায়</label>
              <select
                value={qm.filterChapter}
                onChange={(e) => qm.setFilterChapter(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
                disabled={!qm.filterSubjectId}
              >
                <option value="">সকল অধ্যায়</option>
                {filterChapters.map((ch) => (
                  <option key={ch.chapterNumber} value={ch.chapterNumber}>
                    অধ্যায় {ch.chapterNumber}: {ch.chapterName}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">প্রশ্ন ধরণ</label>
              <select
                value={qm.filterCategory}
                onChange={(e) => qm.setFilterCategory(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
              >
                <option value="">সকল ধরণ</option>
                {(() => {
                  const isPrimary = ["Primary", "Ebtedayee"].includes(qm.filterLevel);
                  const activeCategories = isPrimary
                    ? [
                        { value: "MCQ", label: "বহুনির্বাচনি (MCQ)" },
                        { value: "ShortAnswer", label: "সংক্ষিপ্ত উত্তর" },
                        { value: "FillInBlanks", label: "শূন্যস্থান পূরণ" },
                        { value: "Matching", label: "ডানবাম মিলকরণ" },
                        { value: "BroadQuestion", label: "কাঠামোবদ্ধ যোগ্যতাভিত্তিক" },
                      ]
                    : [
                        { value: "MCQ", label: "বহুনির্বাচনি (MCQ)" },
                        { value: "Creative", label: "সৃজনশীল প্রশ্ন (CQ)" },
                        { value: "ShortAnswer", label: "সংক্ষিপ্ত উত্তর" },
                        { value: "BroadQuestion", label: "বর্ণনামূলক প্রশ্ন" },
                      ];

                  return activeCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ));
                })()}
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">কাঠিন্য</label>
              <select
                value={qm.filterDifficulty}
                onChange={(e) => qm.setFilterDifficulty(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
              >
                <option value="">সকল কাঠিন্য</option>
                {Object.keys(DIFFICULTY_MAP).map((k) => (
                  <option key={k} value={k}>
                    {DIFFICULTY_MAP[k].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main List Area */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-slate-100 rounded-lg" />
                  <div className="h-6 w-24 bg-slate-100 rounded-lg" />
                  <div className="h-6 w-16 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-5 w-24 bg-slate-100 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-slate-100 rounded-md" />
                <div className="h-4 w-1/2 bg-slate-100 rounded-md" />
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-50">
                <div className="h-9 w-20 bg-slate-100 rounded-lg" />
                <div className="h-9 w-20 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-700 space-y-2">
          <AlertCircle className="size-8 mx-auto text-red-500 animate-bounce" />
          <h3 className="font-bold text-lg">কোয়েরি রিকোয়েস্ট ব্যর্থ হয়েছে</h3>
          <p className="text-sm">প্রশ্নাবলী লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।</p>
          <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs h-9 px-4 mt-2">
            পুনরায় চেষ্টা করুন
          </Button>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-16 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
            <FolderOpen className="size-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">কোনো সংরক্ষিত প্রশ্ন পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            আপনার নির্বাচিত ফিল্টার বা ক্যাটাগরির অধীনে কোনো প্রশ্ন খুঁজে পাওয়া যায়নি। নতুন প্রশ্ন তৈরি করতে নিচের বাটনে ক্লিক করুন।
          </p>
          <Button
            onClick={() => navigate("/dashboard/add-question")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-5 flex items-center gap-1.5 font-semibold shadow-md shadow-indigo-100 cursor-pointer"
          >
            <Plus className="size-4" />
            প্রথম প্রশ্ন তৈরি করুন
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const classLabel = CLASSES_MAP.find((c) => c.value === q.className)?.label || q.className;
            const diffConfig = DIFFICULTY_MAP[q.difficulty] || { label: q.difficulty, color: "bg-slate-50 border-slate-100 text-slate-600" };
            const catLabel = CATEGORIES_MAP.find((c) => c.value === q.category)?.label || q.category;

            return (
              <div
                key={q._id}
                className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col space-y-4 relative"
              >
                {/* Badge Header Row */}
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                      {classLabel}
                    </span>
                    <span className="text-[11px] font-extrabold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                      {q.subjectId?.subjectName || "বিষয়"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      অধ্যায় {q.chapterNumber}
                    </span>
                    {q.topics && q.topics.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        #{q.topics.join(", #")}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg border border-violet-100">
                      {catLabel}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${diffConfig.color}`}>
                      {diffConfig.label}
                    </span>
                  </div>
                </div>

                {/* Main Content Body */}
                <div className="text-slate-800 font-serif leading-relaxed flex-1 pt-1">
                  {/* MCQ */}
                  {q.category === "MCQ" && q.mcqData && (
                    <div className="space-y-3">
                      {q.mcqData.mcqType === "Contextual" && q.mcqData.stem && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm italic font-serif leading-relaxed text-slate-700">
                          <strong>উদ্দীপক:</strong> {q.mcqData.stem}
                        </div>
                      )}

                      <div className="font-bold text-[15px] flex gap-2">
                        <span>১.</span>
                        <div>
                          {q.mcqData.questionText}
                          {q.mcqData.mcqType === "MultipleCompletion" && q.mcqData.statements && (
                            <div className="space-y-1 pl-4 mt-2 font-normal text-sm font-sans">
                              {q.mcqData.statements.map((st, idx) => (
                                <div key={idx}>
                                  {idx === 0 ? "i. " : idx === 1 ? "ii. " : "iii. "}{st}
                                </div>
                              ))}
                              <div className="mt-2 font-semibold">নিচের কোনটি সঠিক?</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pl-6 text-sm font-sans font-semibold text-slate-600">
                        {q.mcqData.options &&
                          q.mcqData.options.map((opt, idx) => {
                            const isCorrect = q.mcqData.correctAnswer === idx;
                            return (
                              <div key={idx} className={`flex items-center gap-2 ${isCorrect ? "text-emerald-600 font-bold" : ""}`}>
                                <span className={isCorrect ? "text-emerald-500" : "text-slate-400"}>
                                  {idx === 0 ? "ক)" : idx === 1 ? "খ)" : idx === 2 ? "গ)" : "ঘ)"}
                                </span>
                                <span>{opt}</span>
                                {isCorrect && <Check className="size-3.5 inline text-emerald-500 ml-1" />}
                              </div>
                            );
                          })}
                      </div>

                      {q.mcqData.explanation && (
                        <div className="mt-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs font-sans text-slate-500">
                          <strong>উত্তর বিশ্লেষণ:</strong> {q.mcqData.explanation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Creative */}
                  {q.category === "Creative" && q.creativeData && (
                    <div className="space-y-4">
                      {q.creativeData.stem && (
                        <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] leading-relaxed text-slate-700 font-serif">
                          {q.creativeData.stem}
                        </div>
                      )}

                      <div className="pl-4 space-y-2.5 text-[14px] font-sans font-semibold text-slate-700">
                        <div className="flex justify-between items-start gap-2">
                          <span className="w-6">ক)</span>
                          <span className="flex-1 font-serif">{q.creativeData.subQuestions?.cognitiveA?.text}</span>
                          <span className="text-slate-400 text-xs font-serif font-bold">১</span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="w-6">খ)</span>
                          <span className="flex-1 font-serif">{q.creativeData.subQuestions?.cognitiveB?.text}</span>
                          <span className="text-slate-400 text-xs font-serif font-bold">২</span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="w-6">গ)</span>
                          <span className="flex-1 font-serif">{q.creativeData.subQuestions?.cognitiveC?.text}</span>
                          <span className="text-slate-400 text-xs font-serif font-bold">৩</span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="w-6">ঘ)</span>
                          <span className="flex-1 font-serif">{q.creativeData.subQuestions?.cognitiveD?.text}</span>
                          <span className="text-slate-400 text-xs font-serif font-bold">৪</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* General Questions */}
                  {!["MCQ", "Creative"].includes(q.category) && q.generalData && (
                    <div className="space-y-3">
                      {q.generalData.stem && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm italic font-serif leading-relaxed text-slate-700">
                          {q.generalData.stem}
                        </div>
                      )}

                      <div className="font-bold text-[15px] flex justify-between items-start gap-4">
                        <div className="flex gap-2">
                          <span>১.</span>
                          <div className="font-serif">{q.generalData.questionText}</div>
                        </div>
                        <span className="text-slate-500 text-xs font-sans font-bold shrink-0 bg-slate-100 px-2 py-0.5 rounded">
                          নম্বর: {q.generalData.marks}
                        </span>
                      </div>

                      {q.generalData.suggestedAnswer && (
                        <div className="p-3 bg-indigo-50/20 border border-indigo-55/50 rounded-xl text-xs font-sans text-indigo-900/80">
                          <strong>আদর্শ উত্তর:</strong> {q.generalData.suggestedAnswer}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Metadata & Action Buttons */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-[11px] font-sans text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Calendar className="size-3.5" />
                    <span>সংরক্ষণকাল: {formatBengaliDate(q.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleEdit(q)}
                      className="border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl h-8 px-3 text-xs flex items-center gap-1 font-bold cursor-pointer animate-ui"
                    >
                      <Edit3 className="size-3" />
                      সম্পাদন
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDeleteConfirmId(q._id)}
                      className="border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl h-8 px-3 text-xs flex items-center gap-1 font-bold cursor-pointer animate-ui"
                    >
                      <Trash2 className="size-3" />
                      মুছে ফেলুন
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 font-bold">
              <AlertCircle className="size-5" />
              প্রশ্নটি কি মুছে ফেলতে চান?
            </DialogTitle>
            <DialogDescription className="pt-2 text-slate-600 leading-relaxed font-semibold">
              প্রশ্নটি মুছে ফেললে তা স্থায়ীভাবে হারিয়ে যাবে এবং পরবর্তীতে আর উদ্ধার করা সম্ভব হবে না। আপনি কি নিশ্চিতভাবে এটি মুছে ফেলতে চান?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold cursor-pointer"
            >
              বাতিল করুন
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold cursor-pointer flex items-center gap-1.5"
              disabled={qm.deleteQuestionMutation.isPending}
            >
              {qm.deleteQuestionMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  মুছে ফেলা হচ্ছে...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  হ্যাঁ, মুছে ফেলুন
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
