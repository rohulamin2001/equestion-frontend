import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CATEGORIES_MAP } from "@/constants/categories";
import { CLASSES_MAP } from "@/constants/classes";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  Database,
  Edit3,
  Eye,
  Filter,
  HelpCircle,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import React from "react";
import RichTextRender from "../../components/RichTextRender.jsx";
import { useQuestionBank } from "./hook/useQuestionBank";

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
    getActiveCategories,
    totalCount,
    mcqCount,
    creativeCount,
    otherCount,
    // Pagination & Infinite Scroll exports
    pageSize,
    setPageSize,
    visibleQuestions,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useQuestionBank();

  const observerRef = React.useRef(null);
  React.useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 0.1 });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, fetchNextPage, isFetchingNextPage]);

  const hasActiveFilters = 
    qm.filterType ||
    qm.filterLevel ||
    qm.filterClass ||
    qm.filterSubjectId ||
    qm.filterChapter ||
    qm.filterCategory ||
    qm.filterDifficulty ||
    qm.filterSearch ||
    qm.filterVersion;

  return (
    <div className="space-y-6 pb-12 w-full font-bengali">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-glass p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">প্রশ্নব্যাংক</h1>
          <p className="text-slate-500 text-sm mt-1">
            সকল বিষয়ের অধ্যায়ভিত্তিক সৃজনশীল ও MCQ প্রশ্নভাণ্ডার
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
          { label: "মোট প্রশ্ন", count: totalCount, color: "text-[#4F46E5]", bg: "from-[#4F46E5]/10 to-[#8B5CF6]/10", border: "hover:border-[#4F46E5]/35", icon: Database },
          { label: "MCQ প্রশ্ন", count: mcqCount, color: "text-[#10B981]", bg: "from-[#10B981]/10 to-[#059669]/10", border: "hover:border-[#10B981]/35", icon: CheckSquare },
          { label: "সৃজনশীল (CQ)", count: creativeCount, color: "text-[#F97316]", bg: "from-[#F97316]/10 to-[#EA580C]/10", border: "hover:border-[#F97316]/35", icon: Sparkles },
          { label: "সংক্ষিপ্ত ও অন্যান্য", count: otherCount, color: "text-[#8B5CF6]", bg: "from-[#8B5CF6]/10 to-[#7C3AED]/10", border: "hover:border-[#8B5CF6]/35", icon: HelpCircle },
        ].map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={i}
              className={`group relative bg-white/[0.45] hover:bg-white/[0.65] p-5 rounded-2xl border border-black/[0.04] ${stat.border} backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-500 ease-out flex items-center justify-between overflow-hidden cursor-default`}
            >
              {/* Ultra premium subtle glow background effect */}
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative z-10 space-y-1.5">
                <span className="text-sm font-bold text-slate-400 block uppercase tracking-wider font-sans">
                  {stat.label}
                </span>
                <span className="text-3xl font-extrabold text-slate-800 block font-sans tracking-tight">
                  {stat.count.toLocaleString("bn-BD")}
                </span>
              </div>

              <div className={`relative z-10 size-12 rounded-xl bg-gradient-to-br ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out`}>
                <IconComponent className="size-5.5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
              </div>
            </div>
          );
        })}
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

            {hasActiveFilters && (
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
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-black/[0.05]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 pb-1">
                {/* Institution Type */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">ধরণ</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>{TYPE_LABELS[qm.filterType] || qm.filterType || "সকল ধরণ"}</span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => handleFilterTypeChange("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterType ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                        }`}
                      >
                        <span>সকল ধরণ</span>
                        {!qm.filterType && <span className="size-1 rounded-full bg-indigo-500" />}
                      </DropdownMenuItem>
                      {filterActiveTypes.map((type) => {
                        const isSelected = qm.filterType === type;
                        return (
                          <DropdownMenuItem
                            key={type}
                            onSelect={() => handleFilterTypeChange(type)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                            }`}
                          >
                            <span>{TYPE_LABELS[type] || type}</span>
                            {isSelected && <span className="size-1 rounded-full bg-indigo-500" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Academic Level */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">স্তর</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>{LEVEL_LABELS[qm.filterLevel] || qm.filterLevel || "সকল স্তর"}</span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => handleFilterLevelChange("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterLevel ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                        }`}
                      >
                        <span>সকল স্তর</span>
                        {!qm.filterLevel && <span className="size-1 rounded-full bg-indigo-500" />}
                      </DropdownMenuItem>
                      {filterActiveLevels.map((lvl) => {
                        const isSelected = qm.filterLevel === lvl;
                        return (
                          <DropdownMenuItem
                            key={lvl}
                            onSelect={() => handleFilterLevelChange(lvl)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                            }`}
                          >
                            <span>{LEVEL_LABELS[lvl] || lvl}</span>
                            {isSelected && <span className="size-1 rounded-full bg-indigo-500" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Class */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">শ্রেণী</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>{CLASSES_MAP.find((c) => c.value === qm.filterClass)?.label || qm.filterClass || "সকল শ্রেণী"}</span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => {
                          qm.setFilterClass("");
                          qm.setFilterSubjectId("");
                          qm.setFilterChapter("");
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterClass ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                        }`}
                      >
                        <span>সকল শ্রেণী</span>
                        {!qm.filterClass && <span className="size-1 rounded-full bg-indigo-500" />}
                      </DropdownMenuItem>
                      {filterActiveClasses.map((c) => {
                        const isSelected = qm.filterClass === c.value;
                        return (
                          <DropdownMenuItem
                            key={c.value}
                            onSelect={() => {
                              qm.setFilterClass(c.value);
                              qm.setFilterSubjectId("");
                              qm.setFilterChapter("");
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                            }`}
                          >
                            <span>{c.label}</span>
                            {isSelected && <span className="size-1 rounded-full bg-indigo-500" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">বিষয়</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        disabled={qm.filterClass && filterSubjects.length === 0}
                        className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none disabled:bg-slate-100/50 disabled:text-slate-400 disabled:cursor-not-allowed"
                      >
                        <span>{filterSubjects.find((s) => s._id === qm.filterSubjectId)?.subjectName || "সকল বিষয়"}</span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => {
                          qm.setFilterSubjectId("");
                          qm.setFilterChapter("");
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterSubjectId ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                        }`}
                      >
                        <span>সকল বিষয়</span>
                        {!qm.filterSubjectId && <span className="size-1 rounded-full bg-indigo-500" />}
                      </DropdownMenuItem>
                      {filterSubjects.map((s) => {
                        const isSelected = qm.filterSubjectId === s._id;
                        return (
                          <DropdownMenuItem
                            key={s._id}
                            onSelect={() => {
                              qm.setFilterSubjectId(s._id);
                              qm.setFilterChapter("");
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                            }`}
                          >
                            <span>{s.subjectName}</span>
                            {isSelected && <span className="size-1 rounded-full bg-indigo-500" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Chapter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">অধ্যায়</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        disabled={!qm.filterSubjectId}
                        className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none disabled:bg-slate-100/50 disabled:text-slate-400 disabled:cursor-not-allowed"
                      >
                        <span>
                          {(() => {
                            const ch = filterChapters.find((c) => String(c.chapterNumber) === String(qm.filterChapter));
                            return ch ? `অধ্যায় ${ch.chapterNumber}: ${ch.chapterName}` : "সকল অধ্যায়";
                          })()}
                        </span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)] max-h-56 overflow-y-auto">
                      <DropdownMenuItem
                        onSelect={() => qm.setFilterChapter("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterChapter ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                        }`}
                      >
                        <span>সকল অধ্যায়</span>
                        {!qm.filterChapter && <span className="size-1 rounded-full bg-indigo-500" />}
                      </DropdownMenuItem>
                      {filterChapters.map((ch) => {
                        const isSelected = String(qm.filterChapter) === String(ch.chapterNumber);
                        return (
                          <DropdownMenuItem
                            key={ch.chapterNumber}
                            onSelect={() => qm.setFilterChapter(ch.chapterNumber)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                            }`}
                          >
                            <span className="truncate">অধ্যায় {ch.chapterNumber}: {ch.chapterName}</span>
                            {isSelected && <span className="size-1 rounded-full bg-indigo-500" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">প্রশ্ন ধরণ</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        disabled={qm.filterClass && filterSubjects.length === 0}
                        className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none disabled:bg-slate-100/50 disabled:text-slate-400 disabled:cursor-not-allowed"
                      >
                        <span>
                          {(() => {
                            const activeCats = getActiveCategories();
                            return activeCats.find((cat) => cat.value === qm.filterCategory)?.label || "সকল ধরণ";
                          })()}
                        </span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => qm.setFilterCategory("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterCategory ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                        }`}
                      >
                        <span>সকল ধরণ</span>
                        {!qm.filterCategory && <span className="size-1 rounded-full bg-indigo-500" />}
                      </DropdownMenuItem>
                      {(() => {
                        const activeCats = getActiveCategories();
                        return activeCats.map((cat) => {
                          const isSelected = qm.filterCategory === cat.value;
                          return (
                            <DropdownMenuItem
                              key={cat.value}
                              onSelect={() => qm.setFilterCategory(cat.value)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                                isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                              }`}
                            >
                              <span>{cat.label}</span>
                              {isSelected && <span className="size-1 rounded-full bg-indigo-500" />}
                            </DropdownMenuItem>
                          );
                        });
                      })()}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Difficulty */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">কাঠিন্য</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>
                          {qm.filterDifficulty ? DIFFICULTY_MAP[qm.filterDifficulty]?.label || qm.filterDifficulty : "সকল কাঠিন্য"}
                        </span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => qm.setFilterDifficulty("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterDifficulty ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                        }`}
                      >
                        <span>সকল কাঠিন্য</span>
                        {!qm.filterDifficulty && <span className="size-1 rounded-full bg-indigo-500" />}
                      </DropdownMenuItem>
                      {Object.keys(DIFFICULTY_MAP).map((k) => {
                        const isSelected = qm.filterDifficulty === k;
                        return (
                          <DropdownMenuItem
                            key={k}
                            onSelect={() => qm.setFilterDifficulty(k)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                            }`}
                          >
                            <span>{DIFFICULTY_MAP[k].label}</span>
                            {isSelected && <span className="size-1 rounded-full bg-indigo-500" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Version */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">সংস্করণ</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>
                          {qm.filterVersion === "Bangla" ? "বাংলা সংস্করণ" : qm.filterVersion === "English" ? "ইংরেজি সংস্করণ" : "সকল সংস্করণ"}
                        </span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => qm.setFilterVersion("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterVersion ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                        }`}
                      >
                        <span>সকল সংস্করণ</span>
                        {!qm.filterVersion && <span className="size-1 rounded-full bg-indigo-500" />}
                      </DropdownMenuItem>
                      {[
                        { value: "Bangla", label: "বাংলা সংস্করণ" },
                        { value: "English", label: "ইংরেজি সংস্করণ" }
                      ].map((v) => {
                        const isSelected = qm.filterVersion === v.value;
                        return (
                          <DropdownMenuItem
                            key={v.value}
                            onSelect={() => qm.setFilterVersion(v.value)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                            }`}
                          >
                            <span>{v.label}</span>
                            {isSelected && <span className="size-1 rounded-full bg-indigo-500" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          <div className="flex justify-between items-center bg-white/[0.45] backdrop-blur-md px-4 py-2 rounded-2xl border border-black/[0.04] text-xs font-semibold text-slate-500">
            <span>মোট {questions.length.toLocaleString("bn-BD")} টি প্রশ্ন পাওয়া গেছে</span>
            <div className="flex items-center gap-2">
              <span>প্রদর্শন:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 px-2.5 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer select-none">
                    <span>{pageSize} টি</span>
                    <ChevronDown className="size-3 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1 z-[100] w-24">
                  {[10, 20, 50, 100].map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onSelect={() => setPageSize(size)}
                      className={`text-center px-2 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                        pageSize === size ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                      }`}
                    >
                      {size} টি
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {visibleQuestions.map((q) => {
            const classLabel = CLASSES_MAP.find((c) => c.value === q.className)?.label || q.className;
            const diffConfig = DIFFICULTY_MAP[q.difficulty] || { label: q.difficulty, color: "bg-slate-50 border-slate-100 text-slate-600" };
            const catLabel = CATEGORIES_MAP.find((c) => c.value === q.category)?.label || q.category;
            const userCanManage = canManageQuestion(q);

            return (
              <div
                key={q._id}
                className="bg-white/[0.45] hover:bg-white/[0.60] p-6 rounded-2xl border border-black/[0.04] backdrop-blur-md hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col space-y-4 relative cursor-pointer"
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
                    {q.topics && q.topics.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-500 bg-black/[0.03] px-2 py-0.5 rounded border border-black/[0.05]">
                        #{q.topics.join(", #")}
                      </span>
                    )}
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
                    <div className="space-y-4">
                      {q.mcqData.mcqType === "Contextual" && q.mcqData.stem && (
                        <div className="p-4 bg-black/[0.02] border-l-4 border-l-[#4F46E5]/70 border-y border-r border-black/[0.05] rounded-r-xl rounded-l-none text-sm italic font-serif leading-relaxed text-slate-700 backdrop-blur-sm">
                          <strong>উদ্দীপক:</strong>
                          <RichTextRender content={q.mcqData.stem} className="mt-1 font-serif" />
                        </div>
                      )}

                      <div className="text-[15px] flex justify-between items-start gap-4">
                        <div className="flex gap-2">
                          <span className="font-bold shrink-0">১.</span>
                          <div className="flex-1">
                            <RichTextRender content={q.mcqData.questionText} className="font-serif" />
                            {q.mcqData.mcqType === "MultipleCompletion" && q.mcqData.statements && (
                              <div className="space-y-1 pl-4 mt-2 font-normal text-sm font-sans">
                                {q.mcqData.statements.map((st, idx) => (
                                  <div key={idx} className="flex gap-1 items-start">
                                    <span className="shrink-0">{idx === 0 ? "i. " : idx === 1 ? "ii. " : "iii. "}</span>
                                    <RichTextRender content={st} className="inline-block font-sans font-normal" />
                                  </div>
                                ))}
                                <div className="mt-2 font-semibold">নিচের কোনটি সঠিক?</div>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-slate-600 text-xs font-sans font-bold shrink-0 bg-black/[0.04] px-2 py-0.5 rounded border border-black/[0.05]">
                          {q.mcqData.marks || 1}
                        </span>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 text-sm font-sans">
                        {q.mcqData.options &&
                          q.mcqData.options.slice(0, 4).map((opt, idx) => {
                            const isCorrect = q.mcqData.correctAnswer === idx;
                            return (
                              <div
                                key={idx}
                                className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                                  isCorrect
                                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-700 shadow-sm"
                                    : "bg-white/[0.3] hover:bg-white/[0.6] border-black/[0.03] hover:border-black/[0.08] text-slate-600"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isCorrect 
                                      ? "bg-emerald-500 text-white" 
                                      : "bg-black/[0.04] text-slate-500"
                                  }`}>
                                    {idx === 0 ? "ক" : idx === 1 ? "খ" : idx === 2 ? "গ" : "ঘ"}
                                  </span>
                                  <RichTextRender content={opt} className={`inline-block font-sans ${isCorrect ? "font-semibold" : "font-normal"}`} />
                                </div>
                                {isCorrect && <Check className="size-4 text-emerald-600 shrink-0" />}
                              </div>
                            );
                          })}
                      </div>

                      {q.mcqData.explanation && (
                        <div className="mt-3 p-3 bg-black/[0.02] border border-black/[0.05] rounded-xl text-xs font-sans text-slate-500 backdrop-blur-sm">
                          <strong>উত্তর বিশ্লেষণ: </strong>
                          <RichTextRender content={q.mcqData.explanation} inline />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Creative */}
                  {q.category === "Creative" && q.creativeData && (
                    <div className="space-y-4">
                      {q.creativeData.stem && (
                        <div className="p-5 bg-black/[0.02] border-l-4 border-l-[#4F46E5]/70 border-y border-r border-black/[0.05] rounded-r-xl rounded-l-none text-[14px] leading-relaxed text-slate-700 font-serif backdrop-blur-sm">
                          <RichTextRender content={q.creativeData.stem} />
                        </div>
                      )}

                      <div className="pl-4 space-y-2.5 text-[14px] font-sans font-semibold text-slate-700">
                        <div className="flex justify-between items-start gap-2">
                          <span className="w-6">ক)</span>
                          <RichTextRender content={q.creativeData.subQuestions?.cognitiveA?.text} className="flex-1 font-serif inline-block" />
                          <span className="text-slate-500 text-xs font-serif font-bold">১</span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="w-6">খ)</span>
                          <RichTextRender content={q.creativeData.subQuestions?.cognitiveB?.text} className="flex-1 font-serif inline-block" />
                          <span className="text-slate-500 text-xs font-serif font-bold">২</span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="w-6">গ)</span>
                          <RichTextRender content={q.creativeData.subQuestions?.cognitiveC?.text} className="flex-1 font-serif inline-block" />
                          <span className="text-slate-500 text-xs font-serif font-bold">৩</span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="w-6">ঘ)</span>
                          <RichTextRender content={q.creativeData.subQuestions?.cognitiveD?.text} className="flex-1 font-serif inline-block" />
                          <span className="text-slate-500 text-xs font-serif font-bold">৪</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* General Questions */}
                  {!["MCQ", "Creative"].includes(q.category) && q.generalData && (
                    <div className="space-y-3">
                      {q.generalData.stem && (
                        <div className="p-4 bg-black/[0.02] border-l-4 border-l-[#4F46E5]/70 border-y border-r border-black/[0.05] rounded-r-xl rounded-l-none text-sm italic font-serif leading-relaxed text-slate-700 backdrop-blur-sm">
                          <RichTextRender content={q.generalData.stem} />
                        </div>
                      )}

                      <div className="text-[15px] flex justify-between items-start gap-4">
                        <div className="flex gap-2">
                          <span className="font-bold shrink-0">১.</span>
                          <RichTextRender content={q.generalData.questionText} className="font-serif" />
                        </div>
                        <span className="text-slate-600 text-xs font-sans font-bold shrink-0 bg-black/[0.04] px-2 py-0.5 rounded border border-black/[0.05]">
                          {q.generalData.marks}
                        </span>
                      </div>

                      {q.generalData.suggestedAnswer && (
                        <div className="p-3 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-xs font-sans text-slate-700">
                          <span className="text-sm font-semibold">উত্তর: </span>
                          <RichTextRender content={q.generalData.suggestedAnswer} inline />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Metadata & Action Buttons */}
                <div
                  className="flex justify-between items-center border-t border-black/[0.05] pt-3 text-[11px] font-sans text-slate-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-wrap items-center gap-4 font-medium">
                    <div className="flex items-center gap-1">
                      <User className="size-3.5 text-slate-400" />
                      <span>তৈরি করেছেন: {q.creatorId?.fullName || "Content Creator"}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                      <Calendar className="size-3.5 text-slate-400" />
                      <span>তারিখ: {formatBengaliDate(q.createdAt)}</span>
                    </div>
                    {q.approvedBy?.fullName && (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                        <Check className="size-3 text-emerald-600" />
                        <span>অনুমোদনকারী: {q.approvedBy.fullName}</span>
                      </div>
                    )}
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
          {hasMore && (
            <div 
              ref={observerRef} 
              className="py-6 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold"
            >
              <Loader2 className="size-4 animate-spin text-indigo-500" />
              <span>আরও প্রশ্ন লোড হচ্ছে...</span>
            </div>
          )}
        </div>
      )}

      <Dialog open={!!selectedPreviewQuestion} onOpenChange={(open) => !open && setSelectedPreviewQuestion(null)}>
        <DialogContent showCloseButton={false} className="max-w-2xl overflow-hidden p-0 rounded-2xl border border-black/[0.08] shadow-2xl bg-white/[0.90] backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          {selectedPreviewQuestion && (
            <>
              {/* Header */}
              <div className="border-b border-black/[0.05] bg-white/[0.5] backdrop-blur-md px-6 py-4 flex justify-between items-center gap-4">
                <h4 className="font-bold text-sm text-slate-800 tracking-wide uppercase font-sans">NCTB Exam Question Sheet</h4>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <span className="bg-[#4F46E5]/10 text-[#4F46E5] text-[11px] font-bold px-3 py-1 rounded-full border border-[#4F46E5]/20 whitespace-nowrap">
                      {CLASSES_MAP.find((c) => c.value === selectedPreviewQuestion.className)?.label || selectedPreviewQuestion.className}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${DIFFICULTY_MAP[selectedPreviewQuestion.difficulty]?.color} whitespace-nowrap`}>
                      {DIFFICULTY_MAP[selectedPreviewQuestion.difficulty]?.label}
                    </span>
                  </div>
                  
                  <DialogClose asChild>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-black/[0.04] hover:text-slate-700 transition-colors focus:outline-none cursor-pointer flex items-center justify-center">
                      <X className="size-4" />
                      <span className="sr-only">Close</span>
                    </button>
                  </DialogClose>
                </div>
              </div>

              {/* Exam Paper Sheet */}
              <div className="p-8 flex-1 bg-transparent text-slate-800 space-y-6 font-serif leading-relaxed max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="text-center space-y-1.5 border-b pb-4">
                  <div className="text-xs text-slate-500 flex justify-center gap-4 font-sans font-semibold">
                    <span>বিষয়: {selectedPreviewQuestion.subjectId?.subjectName}</span>
                    <span>অধ্যায়: {selectedPreviewQuestion.chapterNumber}</span>
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
                        <strong>উদ্দীপক:</strong>
                        <RichTextRender content={selectedPreviewQuestion.mcqData.stem} className="mt-1 font-serif" />
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="text-[15px] flex justify-between items-start gap-4 w-full">
                        <div className="flex gap-2">
                          <span className="font-bold shrink-0">১.</span>
                          <RichTextRender content={selectedPreviewQuestion.mcqData.questionText} className="font-serif inline-block" />
                        </div>
                        <span className="text-slate-400 text-xs font-sans font-bold whitespace-nowrap pt-1 ">
                          {selectedPreviewQuestion.mcqData?.marks || 1}
                        </span>
                      </div>
                      {selectedPreviewQuestion.mcqData.mcqType === "MultipleCompletion" && selectedPreviewQuestion.mcqData.statements && (
                        <div className="space-y-1 pl-8 mt-2 font-normal text-sm font-sans">
                          {selectedPreviewQuestion.mcqData.statements.map((st, idx) => (
                            <div key={idx} className="flex gap-1 items-start">
                              <span className="shrink-0">{idx === 0 ? "i. " : idx === 1 ? "ii. " : "iii. "}</span>
                              <RichTextRender content={st} className="inline-block font-sans font-normal" />
                            </div>
                          ))}
                          <div className="mt-2 font-semibold">নিচের কোনটি সঠিক?</div>
                        </div>
                      )}

                      {/* Options Grid */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 pl-6 text-sm font-sans text-slate-700">
                        {selectedPreviewQuestion.mcqData.options &&
                          selectedPreviewQuestion.mcqData.options.map((opt, idx) => {
                            const isCorrect = selectedPreviewQuestion.mcqData.correctAnswer === idx;
                            return (
                              <div 
                                key={idx} 
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                                  isCorrect 
                                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 font-semibold" 
                                    : "border-transparent text-slate-700"
                                }`}
                              >
                                <span className={`shrink-0 font-bold ${isCorrect ? "text-emerald-500" : "text-slate-400"}`}>
                                  {idx === 0 ? "ক)" : idx === 1 ? "খ)" : idx === 2 ? "গ)" : "ঘ)"}
                                </span>
                                <RichTextRender 
                                  content={opt} 
                                  className={`inline-block font-sans [&_p]:inline [&_p]:m-0 ${isCorrect ? "font-semibold" : "font-normal"}`} 
                                />
                                {isCorrect && <Check className="size-3.5 inline text-emerald-500 ml-auto shrink-0" />}
                              </div>
                            );
                          })}
                      </div>

                      {selectedPreviewQuestion.mcqData.explanation && (
                        <div className="mt-6 p-4 bg-black/[0.02] border border-black/[0.05] rounded-xl text-xs font-sans text-slate-500 backdrop-blur-sm">
                          <strong>উত্তর বিশ্লেষণ/ব্যাখ্যা: </strong>
                          <RichTextRender content={selectedPreviewQuestion.mcqData.explanation} inline />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Creative Mode */}
                {selectedPreviewQuestion.category === "Creative" && selectedPreviewQuestion.creativeData && (
                  <div className="space-y-5">
                    {selectedPreviewQuestion.creativeData.stem && (
                      <div className="p-5 bg-black/[0.02] border-l-4 border-l-[#4F46E5] border border-black/[0.05] rounded-r-xl text-[14px] leading-relaxed text-slate-700 backdrop-blur-sm font-serif">
                        <RichTextRender content={selectedPreviewQuestion.creativeData.stem} />
                      </div>
                    )}

                    <div className="pl-4 space-y-3.5 text-sm font-sans font-semibold text-slate-700">
                      <div className="flex justify-between items-start gap-2">
                        <span className="w-6">ক)</span>
                        <RichTextRender content={selectedPreviewQuestion.creativeData.subQuestions?.cognitiveA?.text} className="flex-1 font-serif inline-block" />
                        <span className="text-slate-500 text-xs font-serif font-bold">১</span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="w-6">খ)</span>
                        <RichTextRender content={selectedPreviewQuestion.creativeData.subQuestions?.cognitiveB?.text} className="flex-1 font-serif inline-block" />
                        <span className="text-slate-500 text-xs font-serif font-bold">২</span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="w-6">গ)</span>
                        <RichTextRender content={selectedPreviewQuestion.creativeData.subQuestions?.cognitiveC?.text} className="flex-1 font-serif inline-block" />
                        <span className="text-slate-500 text-xs font-serif font-bold">৩</span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="w-6">ঘ)</span>
                        <RichTextRender content={selectedPreviewQuestion.creativeData.subQuestions?.cognitiveD?.text} className="flex-1 font-serif inline-block" />
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
                        <RichTextRender content={selectedPreviewQuestion.generalData.stem} />
                      </div>
                    )}

                    <div className="text-[15px] flex justify-between items-start gap-4 w-full">
                      <div className="flex gap-2">
                        <span className="font-bold shrink-0">১.</span>
                        <RichTextRender content={selectedPreviewQuestion.generalData.questionText} className="font-serif inline-block" />
                      </div>
                      <span className="text-slate-400 text-xs font-sans font-bold whitespace-nowrap pt-1 font-serif">
                        {selectedPreviewQuestion.generalData.marks}
                      </span>
                    </div>

                    {selectedPreviewQuestion.generalData.suggestedAnswer && (
                      <div className="p-4 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-xs font-sans text-slate-700">
                        <span className="text-sm font-semibold">উত্তর: </span>
                        <RichTextRender content={selectedPreviewQuestion.generalData.suggestedAnswer} inline />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-black/[0.02] border-t border-black/[0.05] px-6 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-sans text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <User className="size-3.5 text-slate-400" />
                    <span>তৈরি করেছেন: {selectedPreviewQuestion.creatorId?.fullName} ({selectedPreviewQuestion.creatorId?.role})</span>
                  </div>
                  {selectedPreviewQuestion.approvedBy?.fullName && (
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                      <Check className="size-3 text-emerald-600" />
                      <span>অনুমোদনকারী: {selectedPreviewQuestion.approvedBy.fullName}</span>
                    </div>
                  )}
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
