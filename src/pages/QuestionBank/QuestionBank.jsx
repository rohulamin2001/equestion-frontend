import { CLASSES_MAP } from "@/constants/classes";
import { CATEGORIES_MAP } from "@/constants/categories";
import { useQuestionBank } from "./hook/useQuestionBank";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Database,
  Plus,
  Search,
  Edit3,
  Trash2,
  Filter,
  Loader2,
  Check,
  AlertCircle,
  Calendar,
  ChevronDown,
  X,
  Eye,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  Easy: { label: "সহজ", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  Medium: { label: "মধ্যম", color: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20" },
  Hard: { label: "কঠিন", color: "bg-rose-500/10 text-rose-700 border-rose-500/20" },
};



export default function QuestionBank() {
  const {
    navigate,
    qm,
    role,
    questions,
    isLoading,
    isError,
    refetch,
    selectedPreviewQuestion,
    setSelectedPreviewQuestion,
    deleteConfirmId,
    setDeleteConfirmId,
    showFilters,
    setShowFilters,
    filterActiveTypes,
    filterActiveLevels,
    filterActiveClasses,
    handleFilterTypeChange,
    handleFilterLevelChange,
    filterSubjects,
    filterChapters,
    handleResetFilters,
    handleEdit,
    handleDeleteConfirm,
    canManageQuestion,
    formatBengaliDate,
    totalCount,
    mcqCount,
    creativeCount,
    otherCount,
  } = useQuestionBank();

  return (
    <div className="space-y-6 pb-12 w-full font-bengali">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-glass p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">প্রশ্নব্যাংক</h1>
          <p className="text-slate-500 text-sm mt-1">
            ক্লাস ৩ থেকে ১২ পর্যন্ত সকল বিষয়ের অধ্যায়ভিত্তিক সৃজনশীল ও MCQ প্রশ্নভাণ্ডার
          </p>
        </div>
        {/* Only Question Creator role is allowed to add questions based on App.jsx guard, 
            but administrators can too or we can just redirect them to page and guard handles it */}
        {role === "Question Creator" && (
          <Button
            onClick={() => navigate("/dashboard/add-question")}
            className="bg-[#4F46E5] hover:bg-[#4E3FB4] text-white rounded-xl h-11 px-5 flex items-center gap-2 font-semibold shadow-md shadow-purple-500/10 cursor-pointer"
          >
            <Plus className="size-4" />
            প্রশ্ন তৈরি করুন
          </Button>
        )}
      </div>

      {/* Statistics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "মোট প্রশ্ন", count: totalCount, color: "from-[#4F46E5] to-[#8B5CF6]" },
          { label: "MCQ প্রশ্ন", count: mcqCount, color: "from-emerald-500 to-teal-600" },
          { label: "সৃজনশীল (CQ)", count: creativeCount, color: "from-[#F97316] to-orange-600" },
          { label: "সংক্ষিপ্ত ও অন্যান্য", count: otherCount, color: "from-[#8B5CF6] to-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-glass p-5 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider font-sans">{stat.label}</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block font-sans">
                {stat.count.toLocaleString("bn-BD")}
              </span>
            </div>
            <div className={`size-10 rounded-full bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-[#4F46E5]/10 font-sans`}>
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      {/* Filters Panel */}
      <div className="bg-glass p-5 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="প্রশ্ন, উদ্দীপক বা কীওয়ার্ড খুঁজুন..."
              value={qm.filterSearch}
              onChange={(e) => qm.setFilterSearch(e.target.value)}
              className="pl-10 h-11 bg-white/[0.45] border-black/[0.08] focus-visible:ring-[#4F46E5]/15 focus-visible:border-[#4F46E5] rounded-xl font-semibold text-slate-700 backdrop-blur-sm"
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
              className={`border-black/[0.08] text-slate-600 hover:bg-black/[0.02] bg-white/[0.45] rounded-xl h-11 px-4 flex items-center gap-2 font-semibold ${
                showFilters ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#4F46E5]" : ""
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-3 border-t border-black/[0.05] animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Institution Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">ধরণ</label>
              <select
                value={qm.filterType}
                onChange={(e) => handleFilterTypeChange(e.target.value)}
                className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 focus:border-[#4F46E5] cursor-pointer backdrop-blur-sm"
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
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">স্তর</label>
              <select
                value={qm.filterLevel}
                onChange={(e) => handleFilterLevelChange(e.target.value)}
                className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 focus:border-[#4F46E5] cursor-pointer backdrop-blur-sm"
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
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">শ্রেণী</label>
              <select
                value={qm.filterClass}
                onChange={(e) => {
                  qm.setFilterClass(e.target.value);
                  qm.setFilterSubjectId("");
                  qm.setFilterChapter("");
                }}
                className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 focus:border-[#4F46E5] cursor-pointer backdrop-blur-sm"
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
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">বিষয়</label>
              <select
                value={qm.filterSubjectId}
                onChange={(e) => {
                  qm.setFilterSubjectId(e.target.value);
                  qm.setFilterChapter("");
                }}
                className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 focus:border-[#4F46E5] cursor-pointer backdrop-blur-sm disabled:bg-slate-100/50 disabled:text-slate-400"
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
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">অধ্যায়</label>
              <select
                value={qm.filterChapter}
                onChange={(e) => qm.setFilterChapter(e.target.value)}
                className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 focus:border-[#4F46E5] cursor-pointer backdrop-blur-sm disabled:bg-slate-100/50 disabled:text-slate-400"
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
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">প্রশ্ন ধরণ</label>
              <select
                value={qm.filterCategory}
                onChange={(e) => qm.setFilterCategory(e.target.value)}
                className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 focus:border-[#4F46E5] cursor-pointer backdrop-blur-sm"
              >
                <option value="">সকল ধরণ</option>
                {(() => {
                  const isPrimary = ["Primary", "Ebtedayee"].includes(qm.filterLevel);
                  const activeCategories = isPrimary
                    ? [
                        { value: "MCQ", label: "বহুনির্বাচনি (MCQ)" },
                        { value: "ShortAnswer", label: "সংক্ষিপ্ত প্রশ্ন" },
                        { value: "FillInBlanks", label: "শূন্যস্থান পূরণ" },
                        { value: "Matching", label: "ডানবাম মিলকরণ" },
                        { value: "BroadQuestion", label: "কাঠামোবদ্ধ যোগ্যতাভিত্তিক" },
                      ]
                    : [
                        { value: "MCQ", label: "বহুনির্বাচনি (MCQ)" },
                        { value: "Creative", label: "সৃজনশীল প্রশ্ন (CQ)" },
                        { value: "ShortAnswer", label: "সংক্ষিপ্ত প্রশ্ন" },
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
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">কাঠিন্য</label>
              <select
                value={qm.filterDifficulty}
                onChange={(e) => qm.setFilterDifficulty(e.target.value)}
                className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 focus:border-[#4F46E5] cursor-pointer backdrop-blur-sm"
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
            <div key={n} className="bg-glass p-6 rounded-2xl border border-black/[0.06] shadow-sm animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-black/[0.04] rounded-lg" />
                  <div className="h-6 w-24 bg-black/[0.04] rounded-lg" />
                </div>
                <div className="h-5 w-24 bg-black/[0.04] rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-black/[0.04] rounded-md" />
                <div className="h-4 w-1/2 bg-black/[0.04] rounded-md" />
              </div>
              <div className="flex gap-2 pt-2 border-t border-black/[0.04]">
                <div className="h-9 w-24 bg-black/[0.04] rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center text-red-700 space-y-2">
          <AlertCircle className="size-8 mx-auto text-red-500 animate-bounce" />
          <h3 className="font-bold text-lg">কোয়েরি রিকোয়েস্ট ব্যর্থ হয়েছে</h3>
          <p className="text-sm">প্রশ্নব্যাংক লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।</p>
          <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs h-9 px-4 mt-2">
            পুনরায় চেষ্টা করুন
          </Button>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-glass border border-black/[0.06] rounded-2xl shadow-sm p-16 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full">
            <Database className="size-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">প্রশ্নব্যাংকে কোনো প্রশ্ন পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            নির্বাচিত ক্যাটাগরি ও ফিল্টারের অধীনে কোনো প্রশ্ন পাওয়া যায়নি। অন্য কোনো শ্রেণী বা বিষয় সিলেক্ট করে অনুসন্ধান করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const classLabel = CLASSES_MAP.find((c) => c.value === q.className)?.label || q.className;
            const diffConfig = DIFFICULTY_MAP[q.difficulty] || { label: q.difficulty, color: "bg-slate-50 border-slate-100 text-slate-600" };
            const catLabel = CATEGORIES_MAP.find((c) => c.value === q.category)?.label || q.category;
            const userCanManage = canManageQuestion(q);

            return (
              <div
                key={q._id}
                className="bg-glass p-6 rounded-2xl border border-black/[0.06] hover:border-black/[0.12] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col space-y-4 relative cursor-pointer"
                onClick={() => setSelectedPreviewQuestion(q)}
              >
                {/* Badge Header Row */}
                <div className="flex flex-wrap justify-between items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 bg-black/[0.04] text-slate-600 rounded-lg border border-black/[0.05]">
                      {classLabel}
                    </span>
                    <span className="text-[11px] font-extrabold px-2.5 py-1 bg-[#4F46E5]/10 text-[#4F46E5] rounded-lg border border-[#4F46E5]/15">
                      {q.subjectId?.subjectName || "বিষয়"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      অধ্যায় {q.chapterNumber}
                    </span>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg border border-[#8B5CF6]/15">
                      {catLabel}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${diffConfig.color}`}>
                      {diffConfig.label}
                    </span>
                  </div>
                </div>

                {/* Main Content Body */}
                <div className="text-slate-800 font-serif leading-relaxed flex-1 pt-1 pointer-events-none">
                  {/* MCQ */}
                  {q.category === "MCQ" && q.mcqData && (
                    <div className="space-y-3">
                      {q.mcqData.mcqType === "Contextual" && q.mcqData.stem && (
                        <div className="p-4 bg-black/[0.02] border border-black/[0.05] rounded-xl text-sm italic font-serif leading-relaxed text-slate-700 backdrop-blur-sm">
                          <strong>উদ্দীপক:</strong> {q.mcqData.stem}
                        </div>
                      )}

                      <div className="font-bold text-[15px] flex gap-2">
                        <span>১.</span>
                        <div>
                          {q.mcqData.questionText}
                        </div>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pl-6 text-sm font-sans font-semibold text-slate-600">
                        {q.mcqData.options &&
                          q.mcqData.options.slice(0, 4).map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-slate-500">
                                {idx === 0 ? "ক)" : idx === 1 ? "খ)" : idx === 2 ? "গ)" : "ঘ)"}
                              </span>
                              <span>{opt}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Creative */}
                  {q.category === "Creative" && q.creativeData && (
                    <div className="space-y-4">
                      {q.creativeData.stem && (
                        <div className="p-5 bg-black/[0.02] border border-black/[0.05] rounded-xl text-[14px] leading-relaxed text-slate-700 font-serif line-clamp-3 backdrop-blur-sm">
                          {q.creativeData.stem}
                        </div>
                      )}

                      <div className="pl-4 text-xs font-sans text-slate-500 italic">
                        * ৪টি সৃজনশীল উপ-প্রশ্ন (ক, খ, গ, ঘ) সংবলিত প্রশ্নপত্র। দেখতে এখানে ক্লিক করুন।
                      </div>
                    </div>
                  )}

                  {/* General Questions */}
                  {!["MCQ", "Creative"].includes(q.category) && q.generalData && (
                    <div className="space-y-3">
                      {q.generalData.stem && (
                        <div className="p-4 bg-black/[0.02] border border-black/[0.05] rounded-xl text-sm italic font-serif leading-relaxed text-slate-700 line-clamp-2 backdrop-blur-sm">
                          {q.generalData.stem}
                        </div>
                      )}

                      <div className="font-bold text-[15px] flex gap-2">
                        <span>১.</span>
                        <div className="font-serif">{q.generalData.questionText}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Metadata & Action Buttons */}
                <div
                  className="flex justify-between items-center border-t border-black/[0.05] pt-3 text-[11px] font-sans text-slate-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-4 font-medium">
                    <div className="flex items-center gap-1">
                      <User className="size-3.5 text-slate-400" />
                      <span>তৈরি করেছেন: {q.creatorId?.fullName || "Content Creator"}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                      <Calendar className="size-3.5 text-slate-400" />
                      <span>তারিখ: {formatBengaliDate(q.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedPreviewQuestion(q)}
                      className="border-black/[0.08] text-slate-600 hover:text-[#4F46E5] hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/20 rounded-xl h-8 px-3 text-xs flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Eye className="size-3" />
                      বিস্তারিত
                    </Button>

                    {userCanManage && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleEdit(q)}
                          className="border-black/[0.08] text-slate-600 hover:text-[#4F46E5] hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/20 rounded-xl h-8 px-3 text-xs flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Edit3 className="size-3" />
                          সম্পাদন
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setDeleteConfirmId(q._id)}
                          className="border-black/[0.08] text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl h-8 px-3 text-xs flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Trash2 className="size-3" />
                          মুছে ফেলুন
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NCTB Full Preview Modal/Sheet */}
      <Dialog open={!!selectedPreviewQuestion} onOpenChange={(open) => !open && setSelectedPreviewQuestion(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0 rounded-2xl border border-black/[0.08] shadow-2xl bg-white/[0.90] backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          {selectedPreviewQuestion && (
            <>
              {/* Header */}
              <div className="border-b border-black/[0.05] bg-white/[0.5] backdrop-blur-md px-6 py-4 flex justify-between items-center">
                <h4 className="font-bold text-sm text-slate-800 tracking-wide uppercase font-sans">NCTB Exam Question Sheet</h4>
                <div className="flex gap-2">
                  <span className="bg-[#4F46E5]/10 text-[#4F46E5] text-[11px] font-bold px-3 py-1 rounded-full border border-[#4F46E5]/20">
                    {CLASSES_MAP.find((c) => c.value === selectedPreviewQuestion.className)?.label || selectedPreviewQuestion.className}
                  </span>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${DIFFICULTY_MAP[selectedPreviewQuestion.difficulty]?.color}`}>
                    {DIFFICULTY_MAP[selectedPreviewQuestion.difficulty]?.label}
                  </span>
                </div>
              </div>

              {/* Exam Paper Sheet */}
              <div className="p-8 flex-1 bg-transparent text-slate-800 space-y-6 font-serif leading-relaxed max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="text-center space-y-1.5 border-b pb-4">
                  <h5 className="font-bold text-lg font-sans">সাময়িক/চূড়ান্ত মূল্যায়ন পরীক্ষা</h5>
                  <div className="text-xs text-slate-500 flex justify-center gap-4 font-sans font-semibold">
                    <span>বিষয়: {selectedPreviewQuestion.subjectId?.subjectName}</span>
                    <span>অধ্যায়: {selectedPreviewQuestion.chapterNumber}</span>
                    <span>পূর্ণমান: {selectedPreviewQuestion.category === "MCQ" ? "১" : selectedPreviewQuestion.category === "Creative" ? "১০" : selectedPreviewQuestion.generalData?.marks || "১"}</span>
                  </div>
                  {/* Metadata Tags */}
                  {(selectedPreviewQuestion.year || selectedPreviewQuestion.board || selectedPreviewQuestion.school || selectedPreviewQuestion.level || (selectedPreviewQuestion.specialSearch && selectedPreviewQuestion.specialSearch.length > 0)) && (
                    <div className="flex flex-wrap gap-2 justify-center items-center text-[10px] font-sans font-bold text-slate-400 mt-2">
                      {selectedPreviewQuestion.year && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">{selectedPreviewQuestion.year}</span>
                      )}
                      {selectedPreviewQuestion.board && (
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">{selectedPreviewQuestion.board}</span>
                      )}
                      {selectedPreviewQuestion.school && (
                        <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded truncate max-w-[200px]">{selectedPreviewQuestion.school}</span>
                      )}
                      {selectedPreviewQuestion.level && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">{selectedPreviewQuestion.level}</span>
                      )}
                      {selectedPreviewQuestion.specialSearch && selectedPreviewQuestion.specialSearch.length > 0 && (
                        <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">{selectedPreviewQuestion.specialSearch.join(", ")}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* MCQ Mode */}
                {selectedPreviewQuestion.category === "MCQ" && selectedPreviewQuestion.mcqData && (
                  <div className="space-y-4">
                    {selectedPreviewQuestion.mcqData.mcqType === "Contextual" && selectedPreviewQuestion.mcqData.stem && (
                      <div className="p-4 bg-black/[0.02] border border-black/[0.05] rounded-xl text-sm italic font-serif leading-relaxed backdrop-blur-sm">
                        <strong>উদ্দীপক:</strong> {selectedPreviewQuestion.mcqData.stem}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="font-bold text-[15px] flex gap-2">
                        <span>১.</span>
                        <div>
                          {selectedPreviewQuestion.mcqData.questionText}
                          {selectedPreviewQuestion.mcqData.mcqType === "MultipleCompletion" && selectedPreviewQuestion.mcqData.statements && (
                            <div className="space-y-1 pl-4 mt-2 font-normal text-sm font-sans">
                              {selectedPreviewQuestion.mcqData.statements.map((st, idx) => (
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
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 pl-6 text-sm font-sans font-semibold text-slate-700">
                        {selectedPreviewQuestion.mcqData.options &&
                          selectedPreviewQuestion.mcqData.options.map((opt, idx) => {
                            const isCorrect = selectedPreviewQuestion.mcqData.correctAnswer === idx;
                            return (
                              <div key={idx} className={`flex items-center gap-2 ${isCorrect ? "text-emerald-600 font-bold" : ""}`}>
                                <span className={isCorrect ? "text-emerald-500 font-bold" : "text-slate-400"}>
                                  {idx === 0 ? "ক)" : idx === 1 ? "খ)" : idx === 2 ? "গ)" : "ঘ)"}
                                </span>
                                <span>{opt}</span>
                                {isCorrect && <Check className="size-3.5 inline text-emerald-500 ml-1" />}
                              </div>
                            );
                          })}
                      </div>

                      {selectedPreviewQuestion.mcqData.explanation && (
                        <div className="mt-6 p-4 bg-black/[0.02] border border-black/[0.05] rounded-xl text-xs font-sans text-slate-500 backdrop-blur-sm">
                          <strong>উত্তর বিশ্লেষণ/ব্যাখ্যা:</strong> {selectedPreviewQuestion.mcqData.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Creative Mode */}
                {selectedPreviewQuestion.category === "Creative" && selectedPreviewQuestion.creativeData && (
                  <div className="space-y-5">
                    {selectedPreviewQuestion.creativeData.stem && (
                      <div className="p-5 bg-black/[0.02] border-l-4 border-l-[#4F46E5] border border-black/[0.05] rounded-r-xl text-[14px] leading-relaxed text-slate-700 backdrop-blur-sm">
                        {selectedPreviewQuestion.creativeData.stem}
                      </div>
                    )}

                    <div className="pl-4 space-y-3.5 text-sm font-sans font-semibold text-slate-700">
                      <div className="flex justify-between items-start gap-2">
                        <span className="w-6">ক)</span>
                        <span className="flex-1 font-serif">{selectedPreviewQuestion.creativeData.subQuestions?.cognitiveA?.text}</span>
                        <span className="text-slate-500 text-xs font-serif font-bold">১</span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="w-6">খ)</span>
                        <span className="flex-1 font-serif">{selectedPreviewQuestion.creativeData.subQuestions?.cognitiveB?.text}</span>
                        <span className="text-slate-500 text-xs font-serif font-bold">২</span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="w-6">গ)</span>
                        <span className="flex-1 font-serif">{selectedPreviewQuestion.creativeData.subQuestions?.cognitiveC?.text}</span>
                        <span className="text-slate-500 text-xs font-serif font-bold">৩</span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="w-6">ঘ)</span>
                        <span className="flex-1 font-serif">{selectedPreviewQuestion.creativeData.subQuestions?.cognitiveD?.text}</span>
                        <span className="text-slate-500 text-xs font-serif font-bold">৪</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* General Mode */}
                {!["MCQ", "Creative"].includes(selectedPreviewQuestion.category) && selectedPreviewQuestion.generalData && (
                  <div className="space-y-4">
                    {selectedPreviewQuestion.generalData.stem && (
                      <div className="p-4 bg-black/[0.02] border border-black/[0.05] rounded-xl text-sm italic font-serif leading-relaxed backdrop-blur-sm">
                        {selectedPreviewQuestion.generalData.stem}
                      </div>
                    )}

                    <div className="font-bold text-[15px] flex justify-between items-start gap-4">
                      <div className="flex gap-2">
                        <span>১.</span>
                        <div className="font-serif">{selectedPreviewQuestion.generalData.questionText}</div>
                      </div>
                      <span className="text-slate-600 text-xs font-sans font-bold shrink-0 bg-black/[0.04] px-2 py-0.5 rounded border border-black/[0.05]">
                        নম্বর: {selectedPreviewQuestion.generalData.marks}
                      </span>
                    </div>

                    {selectedPreviewQuestion.generalData.suggestedAnswer && (
                      <div className="p-4 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-xs font-sans text-slate-700">
                        <strong>আদর্শ উত্তর:</strong> {selectedPreviewQuestion.generalData.suggestedAnswer}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="bg-black/[0.02] border-t border-black/[0.05] px-6 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="text-[11px] font-sans text-slate-500 flex items-center gap-1.5 font-medium">
                  <User className="size-3.5 text-slate-400" />
                  <span>তৈরি করেছেন: {selectedPreviewQuestion.creatorId?.fullName} ({selectedPreviewQuestion.creatorId?.role})</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  {canManageQuestion(selectedPreviewQuestion) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleEdit(selectedPreviewQuestion);
                        setSelectedPreviewQuestion(null);
                      }}
                      className="border-black/[0.08] text-slate-600 hover:text-[#4F46E5] hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/20 rounded-xl font-semibold text-xs h-9 px-4 cursor-pointer"
                    >
                      <Edit3 className="size-3 inline mr-1" />
                      সম্পাদন করুন
                    </Button>
                  )}
                  <Button
                    onClick={() => setSelectedPreviewQuestion(null)}
                    className="bg-[#4F46E5] hover:bg-[#4F46E5]/95 text-white rounded-xl font-semibold text-xs h-9 px-4 cursor-pointer shadow-sm shadow-[#4F46E5]/10"
                  >
                    বন্ধ করুন
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md border border-black/[0.08] bg-white/[0.90] backdrop-blur-xl rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 font-bold">
              <AlertCircle className="size-5 animate-pulse" />
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
              className="border-black/[0.08] text-slate-600 hover:bg-black/[0.02] rounded-xl font-semibold cursor-pointer"
            >
              বাতিল করুন
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm shadow-red-500/10"
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
