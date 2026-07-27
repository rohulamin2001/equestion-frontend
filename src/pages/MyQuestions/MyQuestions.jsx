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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CATEGORIES_MAP } from "@/constants/categories";
import { CLASSES_MAP } from "@/constants/classes";
import { groupPassageQuestions } from "@/lib/questionUtils";
import {
  AlertCircle,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  BookOpen,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  Clock,
  Database,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  FolderOpen,
  HelpCircle,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useMyQuestions } from "./hook/useMyQuestions";

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
  Easy: {
    label: "সহজ",
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  Medium: {
    label: "মধ্যম",
    color: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20",
  },
  Hard: {
    label: "কঠিন",
    color: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function MyQuestions() {
  const {
    navigate,
    qm,
    deleteConfirmId,
    setDeleteConfirmId,
    showFilters,
    setShowFilters,
    questions,
    isLoading,
    isError,
    refetch,
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
    formatBengaliDateTime,
    getActiveCategories,
    totalCount,
    mcqCount,
    creativeCount,
    otherCount,
    personalStats,
    // Pagination & Infinite Scroll exports
    pageSize,
    setPageSize,
    visibleQuestions,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
    requestReviewMutation,
    handleRequestReview,
  } = useMyQuestions();

  const questionsWithSerials = visibleQuestions.map((q, idx) => {
    const serial = qm.sortOrder === "desc" ? totalCount - idx : idx + 1;
    return {
      ...q,
      _overallSerial: serial,
    };
  });

  const groupedQuestionsList = groupPassageQuestions(questionsWithSerials);

  const [selectedRejectionReason, setSelectedRejectionReason] =
    React.useState(null);
  const [reviewRequestId, setReviewRequestId] = React.useState(null);
  const [reviewComment, setReviewComment] = React.useState("");
  const [showAnswers, setShowAnswers] = React.useState(false);
  const [expandedAnswerIds, setExpandedAnswerIds] = React.useState({});

  const toggleIndividualAnswer = (id) => {
    setExpandedAnswerIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const observerRef = React.useRef(null);
  React.useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
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
      <div className="bg-glass p-3.5 sm:p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-1">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-base sm:text-2xl font-bold text-slate-800 tracking-tight font-sans">
            আমার তৈরি প্রশ্ন
          </h1>
          <Button
            onClick={() => navigate("/dashboard/add-question")}
            className="bg-[#4F46E5] hover:bg-[#4E3FB4] text-white rounded-xl h-8 sm:h-10 px-3 sm:px-4 flex items-center gap-1.5 text-xs sm:text-sm font-semibold shadow-md shadow-[#4F46E5]/10 cursor-pointer shrink-0"
          >
            <Plus className="size-3.5 sm:size-4" />
            নতুন প্রশ্ন যোগ করুন
          </Button>
        </div>
        <p className="text-slate-500 text-[11px] sm:text-sm leading-snug">
          আপনার পূর্বে প্রস্তুতকৃত এবং সেভ করা সকল প্রশ্নপত্রসমূহ
        </p>
      </div>

      {/* Statistics Banner */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4"
      >
        {[
          {
            label: "মোট প্রশ্ন",
            count: totalCount,
            color: "text-[#4F46E5]",
            bg: "from-[#4F46E5]/10 to-[#8B5CF6]/10",
            border: "hover:border-[#4F46E5]/35",
            icon: Database,
          },
          {
            label: "বহুনির্বাচনি (MCQ)",
            count: mcqCount,
            color: "text-[#10B981]",
            bg: "from-[#10B981]/10 to-[#059669]/10",
            border: "hover:border-[#10B981]/35",
            icon: CheckSquare,
          },
          {
            label: "সৃজনশীল (CQ)",
            count: creativeCount,
            color: "text-[#F97316]",
            bg: "from-[#F97316]/10 to-[#EA580C]/10",
            border: "hover:border-[#F97316]/35",
            icon: Sparkles,
          },
          {
            label: "সংক্ষিপ্ত ও অন্যান্য",
            count: otherCount,
            color: "text-[#8B5CF6]",
            bg: "from-[#8B5CF6]/10 to-[#7C3AED]/10",
            border: "hover:border-[#8B5CF6]/35",
            icon: HelpCircle,
          },
        ].map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className={`group relative bg-white/[0.45] hover:bg-white/[0.65] p-3.5 sm:p-5 rounded-2xl border border-black/[0.04] ${stat.border} backdrop-blur-md shadow-sm hover:shadow-md transition-colors duration-200 flex items-center justify-between overflow-hidden cursor-default gap-2`}
            >
              {/* Ultra premium subtle glow background effect */}
              <div
                className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              />

              <div className="relative z-10 space-y-1">
                <span className="text-[11px] sm:text-xs font-bold text-slate-600 block uppercase tracking-wider font-sans">
                  {stat.label}
                </span>
                <span className="text-xl sm:text-3xl font-extrabold text-slate-800 block font-sans tracking-tight">
                  {stat.count.toLocaleString("bn-BD")}
                </span>
              </div>

              <div
                className={`relative z-10 size-9 sm:size-12 rounded-xl bg-gradient-to-br ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out shrink-0`}
              >
                <IconComponent className="size-4 sm:size-5.5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Personal Status Statistics Banner */}
      <div className="space-y-2">
        <div className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider font-sans pl-1">
          আমার তৈরি প্রশ্নের অবস্থা
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4"
        >
          {[
            {
              label: "অনুমোদিত প্রশ্ন",
              count: personalStats.approved,
              icon: CheckSquare,
              statusType: "Approved",
              borderClass: "hover:border-emerald-500/35",
              activeBorderClass:
                "border-emerald-500/50 ring-2 ring-emerald-500/10 shadow-md",
              iconBgClass:
                "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
              bg: "from-emerald-500/10 to-teal-500/10",
              color: "text-emerald-600",
            },
            {
              label: "অপেক্ষমাণ প্রশ্ন",
              count: personalStats.pending,
              icon: Clock,
              statusType: "Pending",
              borderClass: "hover:border-amber-500/35",
              activeBorderClass:
                "border-amber-500/50 ring-2 ring-amber-500/10 shadow-md",
              iconBgClass:
                "bg-amber-500/10 text-amber-600 border border-amber-500/20",
              bg: "from-amber-500/10 to-orange-500/10",
              color: "text-amber-600",
            },
            {
              label: "বাতিলকৃত প্রশ্ন",
              count: personalStats.rejected,
              icon: XCircle,
              statusType: "Rejected",
              borderClass: "hover:border-rose-500/35",
              activeBorderClass:
                "border-rose-500/50 ring-2 ring-rose-500/10 shadow-md",
              iconBgClass:
                "bg-rose-500/10 text-rose-650 border border-rose-500/20",
              bg: "from-rose-500/10 to-red-500/10",
              color: "text-rose-650",
            },
          ].map((stat, i) => {
            const IconComponent = stat.icon;
            const isCurrent = qm.filterStatus === stat.statusType;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                onClick={() => {
                  if (isCurrent) {
                    qm.setFilterStatus("");
                  } else {
                    qm.setFilterStatus(stat.statusType);
                  }
                }}
                className={`group relative bg-white/[0.45] hover:bg-white/[0.65] p-3.5 sm:p-5 rounded-2xl border ${
                  isCurrent ? stat.activeBorderClass : "border-black/[0.04]"
                } ${stat.borderClass} backdrop-blur-md shadow-sm hover:shadow-md transition-colors duration-200 flex items-center justify-between overflow-hidden cursor-pointer gap-2`}
              >
                {/* Subtle glow effect */}
                <div
                  className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                />

                <div className="relative z-10 space-y-1">
                  <span className="text-xs sm:text-base font-bold text-slate-600 block font-sans">
                    {stat.label}
                  </span>
                  <span className="text-xl sm:text-3xl font-extrabold text-slate-800 block font-sans tracking-tight">
                    {stat.count.toLocaleString("bn-BD")}
                  </span>
                </div>

                <div
                  className={`relative z-10 size-9 sm:size-12 rounded-xl ${stat.iconBgClass} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out shrink-0`}
                >
                  <IconComponent className="size-4 sm:size-5.5" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Filters Panel */}
      <div className="bg-glass p-3.5 sm:p-5 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-slate-400" />
            <Input
              placeholder="প্রশ্ন বা উদ্দীপকের অংশবিশেষ খুঁজুন..."
              value={qm.filterSearch}
              onChange={(e) => qm.setFilterSearch(e.target.value)}
              className="pl-8 sm:pl-10 h-9 sm:h-11 text-xs sm:text-sm bg-white/[0.45] border-black/[0.08] focus-visible:ring-[#4F46E5]/15 focus-visible:border-[#4F46E5] rounded-xl font-semibold text-slate-700 backdrop-blur-sm"
            />
            {qm.filterSearch && (
              <button
                onClick={() => qm.setFilterSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="size-3.5 sm:size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto shrink-0 justify-center sm:justify-end flex-nowrap overflow-x-auto no-scrollbar py-0.5">
            <Button
              variant="outline"
              onClick={qm.toggleSortOrder}
              className="border-black/[0.08] text-slate-700 hover:bg-black/[0.02] bg-white/[0.45] rounded-xl h-8 sm:h-11 px-2 sm:px-4 text-[11px] sm:text-sm flex items-center gap-1 sm:gap-1.5 font-semibold cursor-pointer backdrop-blur-sm transition-all shadow-sm shrink-0 whitespace-nowrap"
              title={
                qm.sortOrder === "desc"
                  ? "নতুন থেকে পুরাতন (সর্বশেষ প্রশ্ন আগে)"
                  : "পুরাতন থেকে নতুন (প্রথম প্রশ্ন আগে)"
              }
            >
              {qm.sortOrder === "desc" ? (
                <>
                  <ArrowDownWideNarrow className="size-3 sm:size-4 text-indigo-600 shrink-0" />
                  <span>নতুন থেকে পুরাতন</span>
                </>
              ) : (
                <>
                  <ArrowUpNarrowWide className="size-3 sm:size-4 text-indigo-600 shrink-0" />
                  <span>পুরাতন থেকে নতুন</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-black/[0.08] text-slate-600 hover:bg-black/[0.02] bg-white/[0.45] rounded-xl h-8 sm:h-11 px-2 sm:px-4 text-[11px] sm:text-sm flex items-center gap-1 sm:gap-1.5 font-semibold shrink-0 whitespace-nowrap ${
                showFilters
                  ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#4F46E5]"
                  : ""
              }`}
            >
              <Filter className="size-3 sm:size-4 shrink-0" />
              ফিল্টার
              <ChevronDown
                className={`size-3 sm:size-4 transition-transform duration-200 shrink-0 ${showFilters ? "rotate-180" : ""}`}
              />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAnswers(!showAnswers)}
              className={`border-black/[0.08] text-slate-600 hover:bg-black/[0.02] bg-white/[0.45] rounded-xl h-8 sm:h-11 px-2 sm:px-4 text-[11px] sm:text-sm flex items-center gap-1 sm:gap-1.5 font-semibold shrink-0 whitespace-nowrap ${
                showAnswers
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                  : ""
              }`}
            >
              {showAnswers ? "উত্তর লুকান" : "উত্তর দেখান"}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-8 sm:h-11 px-2 sm:px-3.5 text-[11px] sm:text-sm font-semibold transition shrink-0 whitespace-nowrap"
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
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    ধরণ
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>
                          {TYPE_LABELS[qm.filterType] ||
                            qm.filterType ||
                            "সকল ধরণ"}
                        </span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => handleFilterTypeChange("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterType
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-700"
                        }`}
                      >
                        <span>সকল ধরণ</span>
                        {!qm.filterType && (
                          <span className="size-1 rounded-full bg-indigo-500" />
                        )}
                      </DropdownMenuItem>
                      {filterActiveTypes.map((type) => {
                        const isSelected = qm.filterType === type;
                        return (
                          <DropdownMenuItem
                            key={type}
                            onSelect={() => handleFilterTypeChange(type)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span>{TYPE_LABELS[type] || type}</span>
                            {isSelected && (
                              <span className="size-1 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Academic Level */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    স্তর
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>
                          {LEVEL_LABELS[qm.filterLevel] ||
                            qm.filterLevel ||
                            "সকল স্তর"}
                        </span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => handleFilterLevelChange("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterLevel
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-700"
                        }`}
                      >
                        <span>সকল স্তর</span>
                        {!qm.filterLevel && (
                          <span className="size-1 rounded-full bg-indigo-500" />
                        )}
                      </DropdownMenuItem>
                      {filterActiveLevels.map((lvl) => {
                        const isSelected = qm.filterLevel === lvl;
                        return (
                          <DropdownMenuItem
                            key={lvl}
                            onSelect={() => handleFilterLevelChange(lvl)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span>{LEVEL_LABELS[lvl] || lvl}</span>
                            {isSelected && (
                              <span className="size-1 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Class */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    শ্রেণী
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>
                          {CLASSES_MAP.find((c) => c.value === qm.filterClass)
                            ?.label ||
                            qm.filterClass ||
                            "সকল শ্রেণী"}
                        </span>
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
                          !qm.filterClass
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-700"
                        }`}
                      >
                        <span>সকল শ্রেণী</span>
                        {!qm.filterClass && (
                          <span className="size-1 rounded-full bg-indigo-500" />
                        )}
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
                              isSelected
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span>{c.label}</span>
                            {isSelected && (
                              <span className="size-1 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    বিষয়
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        disabled={qm.filterClass && filterSubjects.length === 0}
                        className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none disabled:bg-slate-100/50 disabled:text-slate-400 disabled:cursor-not-allowed"
                      >
                        <span>
                          {filterSubjects.find(
                            (s) => s._id === qm.filterSubjectId,
                          )?.subjectName || "সকল বিষয়"}
                        </span>
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
                          !qm.filterSubjectId
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-700"
                        }`}
                      >
                        <span>সকল বিষয়</span>
                        {!qm.filterSubjectId && (
                          <span className="size-1 rounded-full bg-indigo-500" />
                        )}
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
                              isSelected
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span>{s.subjectName}</span>
                            {isSelected && (
                              <span className="size-1 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Chapter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    অধ্যায়
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        disabled={!qm.filterSubjectId}
                        className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none disabled:bg-slate-100/50 disabled:text-slate-400 disabled:cursor-not-allowed"
                      >
                        <span>
                          {(() => {
                            const ch = filterChapters.find(
                              (c) =>
                                String(c.chapterNumber) ===
                                String(qm.filterChapter),
                            );
                            return ch
                              ? `অধ্যায় ${ch.chapterNumber}: ${ch.chapterName}`
                              : "সকল অধ্যায়";
                          })()}
                        </span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)] max-h-56 overflow-y-auto">
                      <DropdownMenuItem
                        onSelect={() => qm.setFilterChapter("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterChapter
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-700"
                        }`}
                      >
                        <span>সকল অধ্যায়</span>
                        {!qm.filterChapter && (
                          <span className="size-1 rounded-full bg-indigo-500" />
                        )}
                      </DropdownMenuItem>
                      {filterChapters.map((ch) => {
                        const isSelected =
                          String(qm.filterChapter) === String(ch.chapterNumber);
                        return (
                          <DropdownMenuItem
                            key={ch.chapterNumber}
                            onSelect={() =>
                              qm.setFilterChapter(ch.chapterNumber)
                            }
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span className="truncate">
                              অধ্যায় {ch.chapterNumber}: {ch.chapterName}
                            </span>
                            {isSelected && (
                              <span className="size-1 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    প্রশ্ন ধরণ
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        disabled={qm.filterClass && filterSubjects.length === 0}
                        className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none disabled:bg-slate-100/50 disabled:text-slate-400 disabled:cursor-not-allowed"
                      >
                        <span>
                          {(() => {
                            const activeCats = getActiveCategories();
                            return (
                              activeCats.find(
                                (cat) => cat.value === qm.filterCategory,
                              )?.label || "সকল ধরণ"
                            );
                          })()}
                        </span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => qm.setFilterCategory("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterCategory
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-700"
                        }`}
                      >
                        <span>সকল ধরণ</span>
                        {!qm.filterCategory && (
                          <span className="size-1 rounded-full bg-indigo-500" />
                        )}
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
                                isSelected
                                  ? "bg-indigo-50 text-indigo-600"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>{cat.label}</span>
                              {isSelected && (
                                <span className="size-1 rounded-full bg-indigo-500" />
                              )}
                            </DropdownMenuItem>
                          );
                        });
                      })()}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Difficulty */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    কাঠিন্য
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>
                          {qm.filterDifficulty
                            ? DIFFICULTY_MAP[qm.filterDifficulty]?.label ||
                              qm.filterDifficulty
                            : "সকল কাঠিন্য"}
                        </span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => qm.setFilterDifficulty("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterDifficulty
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-700"
                        }`}
                      >
                        <span>সকল কাঠিন্য</span>
                        {!qm.filterDifficulty && (
                          <span className="size-1 rounded-full bg-indigo-500" />
                        )}
                      </DropdownMenuItem>
                      {Object.keys(DIFFICULTY_MAP).map((k) => {
                        const isSelected = qm.filterDifficulty === k;
                        return (
                          <DropdownMenuItem
                            key={k}
                            onSelect={() => qm.setFilterDifficulty(k)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span>{DIFFICULTY_MAP[k].label}</span>
                            {isSelected && (
                              <span className="size-1 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Version */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    ভার্সন
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>
                          {qm.filterVersion === "Bangla"
                            ? "বাংলা"
                            : qm.filterVersion === "English"
                              ? "ইংরেজি"
                              : "সকল ভার্সন"}
                        </span>
                        <ChevronDown className="size-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem
                        onSelect={() => qm.setFilterVersion("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          !qm.filterVersion
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-700"
                        }`}
                      >
                        <span>সকল ভার্সন</span>
                        {!qm.filterVersion && (
                          <span className="size-1 rounded-full bg-indigo-500" />
                        )}
                      </DropdownMenuItem>
                      {[
                        { value: "Bangla", label: "বাংলা" },
                        { value: "English", label: "ইংরেজি" },
                      ].map((v) => {
                        const isSelected = qm.filterVersion === v.value;
                        return (
                          <DropdownMenuItem
                            key={v.value}
                            onSelect={() => qm.setFilterVersion(v.value)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                              isSelected
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span>{v.label}</span>
                            {isSelected && (
                              <span className="size-1 rounded-full bg-indigo-500" />
                            )}
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
            <div
              key={n}
              className="bg-glass p-6 rounded-2xl border border-black/[0.06] shadow-sm animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-black/[0.04] rounded-lg" />
                  <div className="h-6 w-24 bg-black/[0.04] rounded-lg" />
                  <div className="h-6 w-16 bg-black/[0.04] rounded-lg" />
                </div>
                <div className="h-5 w-24 bg-black/[0.04] rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-black/[0.04] rounded-md" />
                <div className="h-4 w-1/2 bg-black/[0.04] rounded-md" />
              </div>
              <div className="flex gap-2 pt-2 border-t border-black/[0.04]">
                <div className="h-9 w-20 bg-black/[0.04] rounded-lg" />
                <div className="h-9 w-20 bg-black/[0.04] rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center text-red-700 space-y-2">
          <AlertCircle className="size-8 mx-auto text-red-500 animate-bounce" />
          <h3 className="font-bold text-lg">কোয়েরি রিকোয়েস্ট ব্যর্থ হয়েছে</h3>
          <p className="text-sm">
            প্রশ্নাবলী লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পরে আবার চেষ্টা
            করুন।
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs h-9 px-4 mt-2"
          >
            পুনরায় চেষ্টা করুন
          </Button>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-glass border border-black/[0.06] rounded-2xl shadow-sm p-16 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full">
            <FolderOpen className="size-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            কোনো সংরক্ষিত প্রশ্ন পাওয়া যায়নি
          </h3>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            আপনার নির্বাচিত ফিল্টার বা ক্যাটাগরির অধীনে কোনো প্রশ্ন খুঁজে পাওয়া
            যায়নি। নতুন প্রশ্ন তৈরি করতে নিচের বাটনে ক্লিক করুন।
          </p>
          <Button
            onClick={() => navigate("/dashboard/add-question")}
            className="bg-[#4F46E5] hover:bg-[#4E3FB4] text-white rounded-xl h-10 px-5 flex items-center gap-1.5 font-semibold shadow-md shadow-[#4F46E5]/10 cursor-pointer"
          >
            <Plus className="size-4" />
            প্রথম প্রশ্ন তৈরি করুন
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center bg-white/[0.45] backdrop-blur-md px-4 py-2 rounded-2xl border border-black/[0.04] text-xs font-semibold text-slate-500 mb-4">
            <span>
              মোট {questions.length.toLocaleString("bn-BD")} টি প্রশ্ন পাওয়া
              গেছে
            </span>
            <div className="flex items-center gap-2">
              <span>প্রদর্শন:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 px-2.5 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer select-none">
                    <span>{pageSize} টি</span>
                    <ChevronDown className="size-3 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1 z-[100] w-24"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onSelect={() => setPageSize(size)}
                      className={`text-center px-2 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                        pageSize === size
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-700"
                      }`}
                    >
                      {size} টি
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <motion.div
            key="my-questions-list-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {groupedQuestionsList.map((item, index) => {
              if (item.isGroup) {
                const qMeta = item.meta;
                const classLabel =
                  CLASSES_MAP.find((c) => c.value === qMeta.className)?.label ||
                  qMeta.className;

                return (
                  <motion.div
                    key={item.passageGroupId}
                    variants={cardVariants}
                    className="bg-white/[0.60] hover:bg-white/[0.75] p-4 sm:p-6 rounded-2xl border-2 border-[#4F46E5]/25 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 flex flex-col space-y-4 relative overflow-hidden"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-black/[0.06] pb-3">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-sans font-bold text-slate-500">
                        <span className="bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] text-white px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 font-sans text-xs">
                          <BookOpen className="size-3.5" />
                          {(() => {
                            const firstSerial = item.questions[0]?._overallSerial;
                            const lastSerial = item.questions[item.questions.length - 1]?._overallSerial;
                            const rangeStr = firstSerial && lastSerial && firstSerial !== lastSerial
                              ? `প্রশ্ন ${firstSerial.toLocaleString("bn-BD")} - ${lastSerial.toLocaleString("bn-BD")}`
                              : firstSerial
                                ? `প্রশ্ন ${firstSerial.toLocaleString("bn-BD")}`
                                : "উদ্দীপকভিত্তিক প্রশ্নগুচ্ছ";
                            return `${rangeStr}: উদ্দীপকভিত্তিক প্রশ্নগুচ্ছ (${item.questions.length}টি প্রশ্ন)`;
                          })()}
                        </span>
                        <span className="bg-indigo-50 text-[#4F46E5] border border-indigo-100 px-2 py-0.5 rounded">
                          {classLabel}
                        </span>
                        <span className="bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded">
                          {qMeta.subjectId?.subjectName || "বিষয়"}
                        </span>
                        <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">
                          অধ্যায় {qMeta.chapterNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            item.questions.forEach((q) =>
                              toggleIndividualAnswer(q._id),
                            );
                          }}
                          className="p-1.5 rounded-lg border transition cursor-pointer flex items-center justify-center shrink-0 bg-indigo-50 text-[#4F46E5] border-indigo-200 hover:bg-indigo-100 text-xs font-semibold px-2.5 gap-1 font-sans"
                        >
                          <Eye className="size-3.5" />
                          সবগুলোর উত্তর দেখান
                        </button>
                      </div>
                    </div>

                    {/* Passage Box */}
                    {item.passageStem && (
                      <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-slate-800 font-serif text-[14px] leading-relaxed shadow-inner">
                        <RichTextRender
                          content={item.passageStem}
                          inline={false}
                        />
                      </div>
                    )}

                    {/* Sub Questions List */}
                    <div className="space-y-4 pt-2 border-t border-dashed border-indigo-200/80">
                      {item.questions.map((q, qSubIndex) => {
                        const isAnswerVisible =
                          showAnswers || !!expandedAnswerIds[q._id];
                        const subCatLabel =
                          CATEGORIES_MAP.find((c) => c.value === q.category)
                            ?.label || q.category;
                        const subDiffConfig = DIFFICULTY_MAP[q.difficulty] || {
                          label: q.difficulty,
                          color: "bg-slate-50 border-slate-100 text-slate-600",
                        };

                        return (
                          <div
                            key={q._id}
                            className="p-4 bg-white/70 rounded-xl border border-slate-200/60 space-y-3 relative group/sub shadow-2xs"
                          >
                            {/* Sub Question Row Header */}
                            <div className="flex flex-wrap justify-between items-center gap-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                <span className="text-[#4F46E5] font-sans">
                                  প্রশ্ন{" "}
                                  {(qSubIndex + 1).toLocaleString("bn-BD")}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded border text-[10px] ${q.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : q.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}
                                >
                                  {q.status === "Approved"
                                    ? "অনুমোদিত"
                                    : q.status === "Pending"
                                      ? "অপেক্ষমান"
                                      : "বাতিলকৃত"}
                                </span>
                                <span className="bg-[#4F46E5]/5 text-[#4F46E5] border border-[#4F46E5]/10 px-2 py-0.5 rounded text-[10px]">
                                  {subCatLabel}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded border text-[10px] ${subDiffConfig.color}`}
                                >
                                  {subDiffConfig.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleIndividualAnswer(q._id)}
                                  className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center justify-center shrink-0 ${isAnswerVisible ? "bg-indigo-50 text-[#4F46E5] border-indigo-200" : "bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200"}`}
                                  title={
                                    isAnswerVisible
                                      ? "উত্তর লুকান"
                                      : "উত্তর দেখান"
                                  }
                                >
                                  {isAnswerVisible ? (
                                    <EyeOff className="size-3.5" />
                                  ) : (
                                    <Eye className="size-3.5" />
                                  )}
                                </button>
                                {q.status !== "Approved" &&
                                  qMeta.status !== "Approved" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDeleteConfirmId({
                                          id: q._id,
                                          deleteAllGroup: false,
                                          isGroup: false,
                                        })
                                      }
                                      className="p-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                      title="এই নির্দিষ্ট প্রশ্নটি মুছে ফেলুন"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  )}
                              </div>
                            </div>

                            {/* Question Content */}
                            <div className="text-[15px]">
                              <div className="flex gap-2">
                                <span className="font-bold shrink-0">
                                  {q._overallSerial ? `${q._overallSerial.toLocaleString("bn-BD")}.` : `${(qSubIndex + 1).toLocaleString("bn-BD")}.`}
                                </span>
                                <div className="flex-1">
                                  <RichTextRender
                                    content={q.mcqData?.questionText || ""}
                                  />
                                  {q.mcqData?.mcqType ===
                                    "MultipleCompletion" &&
                                    q.mcqData?.statements && (
                                      <div className="space-y-1 pl-6 mt-2 font-normal text-[15px] text-slate-700">
                                        {q.mcqData.statements.map((st, idx) => (
                                          <div
                                            key={idx}
                                            className="flex gap-1 items-start"
                                          >
                                            <span className="shrink-0 text-slate-500 font-bold">
                                              {idx === 0
                                                ? "i. "
                                                : idx === 1
                                                  ? "ii. "
                                                  : "iii. "}
                                            </span>
                                            <RichTextRender
                                              content={st}
                                              className="inline-block"
                                            />
                                          </div>
                                        ))}
                                        <div className="mt-2 font-semibold">
                                          নিচের কোনটি সঠিক?
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>

                              {/* Options Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 mt-3 text-[15px]">
                                {q.mcqData?.options?.map((opt, idx) => {
                                  const isCorrect =
                                    isAnswerVisible &&
                                    q.mcqData.correctAnswer === idx;
                                  return (
                                    <div
                                      key={idx}
                                      className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${isCorrect ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-700 shadow-sm" : "bg-white border-black/[0.04] text-slate-600"}`}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <span
                                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${isCorrect ? "bg-emerald-500 text-white" : "bg-black/[0.04] text-slate-500"}`}
                                        >
                                          {idx === 0
                                            ? "ক"
                                            : idx === 1
                                              ? "খ"
                                              : idx === 2
                                                ? "গ"
                                                : "ঘ"}
                                        </span>
                                        <RichTextRender
                                          content={opt}
                                          className={`inline-block ${isCorrect ? "text-emerald-800" : "font-normal"}`}
                                        />
                                      </div>
                                      {isCorrect && (
                                        <Check className="size-4 text-emerald-600 shrink-0" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {isAnswerVisible && q.mcqData?.explanation && (
                                <div className="mt-3 p-3 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-[15px] text-slate-700">
                                  <span className="font-semibold text-[15px]">
                                    বিশ্লেষণ:{" "}
                                  </span>
                                  <RichTextRender
                                    content={q.mcqData.explanation}
                                    className="inline-block"
                                    inline
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer Metadata & Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-black/[0.05] pt-2.5 sm:pt-3 text-[10px] sm:text-[11px] font-sans text-slate-500">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3 sm:size-3.5 text-slate-400 shrink-0" />
                          <span>
                            সংরক্ষণকাল: {formatBengaliDateTime(qMeta.createdAt)}
                          </span>
                        </div>
                        {qMeta.status === "Rejected" &&
                          qMeta.rejectedBy?.fullName && (
                            <div className="flex items-center gap-1 text-rose-600 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10">
                              <X className="size-3 text-rose-600 shrink-0" />
                              <span>
                                বাতিলকারী: {qMeta.rejectedBy.fullName}
                              </span>
                            </div>
                          )}
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap justify-end w-full sm:w-auto">
                        {qMeta.status !== "Approved" && (
                          <>
                            {qMeta.status === "Rejected" && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setReviewRequestId(qMeta._id);
                                  setReviewComment("");
                                }}
                                className="border-indigo-200 text-[#4F46E5] hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/30 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs flex items-center gap-1 font-bold cursor-pointer bg-[#4F46E5]/5 shrink-0"
                              >
                                <RefreshCw className="size-3" />
                                রিভিউ রিকোয়েস্ট
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                              className="border-black/[0.08] text-slate-600 hover:text-[#4F46E5] hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/20 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs flex items-center gap-1 font-bold cursor-pointer shrink-0"
                            >
                              <Edit3 className="size-3" />
                              সম্পাদন
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setDeleteConfirmId({
                                  id: qMeta._id,
                                  deleteAllGroup: true,
                                  isGroup: true,
                                  count: item.questions.length,
                                })
                              }
                              className="border-black/[0.08] text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs flex items-center gap-1 font-bold cursor-pointer shrink-0"
                            >
                              <Trash2 className="size-3" />
                              মুছে ফেলুন
                            </Button>
                          </>
                        )}
                        {qMeta.status === "Approved" &&
                          qMeta.approvedBy?.fullName && (
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 font-bold">
                              <Check className="size-3.5 text-emerald-600" />
                              <span>
                                অনুমোদনকারী: {qMeta.approvedBy.fullName}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </motion.div>
                );
              }

              const q = item.question;
              const classLabel =
                CLASSES_MAP.find((c) => c.value === q.className)?.label ||
                q.className;
              const diffConfig = DIFFICULTY_MAP[q.difficulty] || {
                label: q.difficulty,
                color: "bg-slate-50 border-slate-100 text-slate-600",
              };
              const catLabel =
                CATEGORIES_MAP.find((c) => c.value === q.category)?.label ||
                q.category;
              const isAnswerVisible = showAnswers || !!expandedAnswerIds[q._id];

              return (
                <motion.div
                  key={q._id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="bg-white/[0.45] hover:bg-white/[0.60] p-3.5 sm:p-6 rounded-2xl border border-black/[0.04] backdrop-blur-md hover:shadow-md transition-colors duration-200 flex flex-col space-y-3 sm:space-y-4 relative"
                >
                  {/* Badge Header Row */}
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-sans font-bold text-slate-500">
                      {new Date() - new Date(q.createdAt) <
                        24 * 60 * 60 * 1000 && (
                        <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
                          নতুন
                        </span>
                      )}
                      {q.institutionType && (
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            q.institutionType === "School"
                              ? "bg-sky-55/60 text-sky-700 border-sky-100"
                              : q.institutionType === "College"
                                ? "bg-orange-55/60 text-orange-700 border-orange-100"
                                : "bg-emerald-55/60 text-emerald-700 border-emerald-100"
                          }`}
                        >
                          {q.institutionType === "School"
                            ? "স্কুল"
                            : q.institutionType === "College"
                              ? "কলেজ"
                              : "মাদ্রাসা"}
                        </span>
                      )}
                      <span className="bg-indigo-50 text-[#4F46E5] border border-indigo-100 px-2 py-0.5 rounded">
                        {classLabel}
                      </span>
                      <span className="bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded">
                        {q.subjectId?.subjectName || "বিষয়"}
                      </span>
                      <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">
                        অধ্যায় {q.chapterNumber}
                      </span>
                      {q.topics && q.topics.length > 0 && (
                        <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                          #{q.topics.join(", #")}
                        </span>
                      )}
                      {q.year &&
                        (Array.isArray(q.year)
                          ? q.year.length > 0
                          : String(q.year).trim()) && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
                            সাল:{" "}
                            {Array.isArray(q.year) ? q.year.join(", ") : q.year}
                          </span>
                        )}
                      {q.board &&
                        (Array.isArray(q.board)
                          ? q.board.length > 0
                          : String(q.board).trim()) && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                            বোর্ড:{" "}
                            {Array.isArray(q.board)
                              ? q.board.join(", ")
                              : q.board}
                          </span>
                        )}
                      {q.school &&
                        (Array.isArray(q.school)
                          ? q.school.length > 0
                          : String(q.school).trim()) && (
                          <span
                            className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded truncate max-w-[150px]"
                            title={
                              Array.isArray(q.school)
                                ? q.school.join(", ")
                                : q.school
                            }
                          >
                            প্রতিষ্ঠান:{" "}
                            {Array.isArray(q.school)
                              ? q.school.join(", ")
                              : q.school}
                          </span>
                        )}
                      {q.level && String(q.level).trim() && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                          লেভেল: {LEVEL_LABELS[q.level] || q.level}
                        </span>
                      )}
                      {q.specialSearch &&
                        (Array.isArray(q.specialSearch)
                          ? q.specialSearch.length > 0
                          : String(q.specialSearch).trim()) && (
                          <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
                            কীওয়ার্ড:{" "}
                            {Array.isArray(q.specialSearch)
                              ? q.specialSearch.join(", ")
                              : q.specialSearch}
                          </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans font-bold text-slate-500">
                      {/* Status Badge */}
                      <div className="flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                            q.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : q.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}
                        >
                          {q.status === "Pending" && (
                            <Loader2 className="size-3 animate-spin text-amber-600" />
                          )}
                          {q.status === "Approved"
                            ? "অনুমোদিত"
                            : q.status === "Pending"
                              ? "অপেক্ষমান"
                              : "বাতিলকৃত"}
                        </span>
                        {q.status === "Rejected" &&
                          (q.rejectionReason ||
                            (q.rejectionHistory &&
                              q.rejectionHistory.length > 0)) && (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedRejectionReason(
                                  q.rejectionReason ||
                                    q.rejectionHistory[
                                      q.rejectionHistory.length - 1
                                    ]?.reason,
                                )
                              }
                              className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer flex items-center justify-center shrink-0"
                              title="বাতিলকরণের কারণ দেখুন"
                            >
                              <MessageSquare className="size-3.5" />
                            </button>
                          )}
                      </div>
                      <span className="bg-[#4F46E5]/5 text-[#4F46E5] border border-[#4F46E5]/10 px-2 py-0.5 rounded">
                        {catLabel}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          q.difficulty === "Easy"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : q.difficulty === "Medium"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {diffConfig.label}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleIndividualAnswer(q._id);
                        }}
                        className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center justify-center shrink-0 ${
                          isAnswerVisible
                            ? "bg-indigo-50 text-[#4F46E5] border-indigo-200"
                            : "bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                        title={isAnswerVisible ? "উত্তর লুকান" : "উত্তর দেখান"}
                      >
                        {isAnswerVisible ? (
                          <EyeOff className="size-3.5" />
                        ) : (
                          <Eye className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Main Content Body */}
                  <div className="text-slate-800 leading-relaxed flex-1 pt-1">
                    {/* MCQ */}
                    {q.category === "MCQ" && q.mcqData && (
                      <div className="space-y-4">
                        {q.mcqData.mcqType === "Contextual" &&
                          q.mcqData.stem && (
                            <div className="p-4 bg-black/[0.02] border-l-4 border-l-[#4F46E5]/70 border-y border-r border-black/[0.05] rounded-r-xl rounded-l-none text-sm italic leading-relaxed text-slate-700 backdrop-blur-sm">
                              <strong>উদ্দীপক:</strong>
                              <RichTextRender
                                content={q.mcqData.stem}
                                className="mt-1"
                              />
                            </div>
                          )}

                        <div className="text-[15px] flex justify-between items-start gap-4">
                          <div className="flex gap-2">
                            <span className="font-bold shrink-0">
                              {q._overallSerial ? `${q._overallSerial.toLocaleString("bn-BD")}.` : `${(index + 1).toLocaleString("bn-BD")}.`}
                            </span>
                            <div className="flex-1">
                              <RichTextRender
                                content={q.mcqData.questionText}
                                className=""
                              />
                              {q.mcqData.mcqType === "MultipleCompletion" &&
                                q.mcqData.statements && (
                                  <div className="space-y-1 pl-6 mt-2 font-normal text-[15px] text-slate-700">
                                    {q.mcqData.statements.map((st, idx) => (
                                      <div
                                        key={idx}
                                        className="flex gap-1 items-start"
                                      >
                                        <span className="shrink-0 text-slate-505 font-bold">
                                          {idx === 0
                                            ? "i. "
                                            : idx === 1
                                              ? "ii. "
                                              : "iii. "}
                                        </span>
                                        <RichTextRender
                                          content={st}
                                          className="inline-block"
                                        />
                                      </div>
                                    ))}
                                    <div className="mt-2 font-semibold">
                                      নিচের কোনটি সঠিক?
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                          <span className="text-slate-505 text-xs font-bold">
                            {(q.mcqData?.marks || 1).toLocaleString("bn-BD")}
                          </span>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 text-[15px]">
                          {q.mcqData.options &&
                            q.mcqData.options.map((opt, idx) => {
                              const isCorrect =
                                isAnswerVisible &&
                                q.mcqData.correctAnswer === idx;
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
                                    <span
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                                        isCorrect
                                          ? "bg-emerald-500 text-white"
                                          : "bg-black/[0.04] text-slate-500"
                                      }`}
                                    >
                                      {idx === 0
                                        ? "ক"
                                        : idx === 1
                                          ? "খ"
                                          : idx === 2
                                            ? "গ"
                                            : "ঘ"}
                                    </span>
                                    <RichTextRender
                                      content={opt}
                                      className={`inline-block ${isCorrect ? " text-emerald-800" : "font-normal"}`}
                                    />
                                  </div>
                                  {isCorrect && (
                                    <Check className="size-4 text-emerald-600 shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                        </div>

                        {isAnswerVisible && q.mcqData.explanation && (
                          <div className="mt-3 p-3 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-[15px] text-slate-700">
                            <span className="font-semibold text-[15px] ">
                              বিশ্লেষণ:{" "}
                            </span>
                            <RichTextRender
                              content={q.mcqData.explanation}
                              className="inline-block"
                              inline
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Creative */}
                    {q.category === "Creative" && q.creativeData && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <span className="font-bold shrink-0">
                            {q._overallSerial ? `${q._overallSerial.toLocaleString("bn-BD")}.` : `${(index + 1).toLocaleString("bn-BD")}.`}
                          </span>
                          <div className="flex-1 space-y-4">
                            {q.creativeData.stem && (
                              <div className="p-5 bg-black/[0.02] border-l-4 border-l-[#4F46E5]/70 border-y border-r border-black/[0.05] rounded-r-xl rounded-l-none  leading-relaxed text-slate-700 backdrop-blur-sm">
                                <RichTextRender content={q.creativeData.stem} />
                              </div>
                            )}

                            <div className="pl-4 space-y-2.5 text-[15px] text-slate-700">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center ">
                                  <span className="w-6">ক.</span>
                                  <RichTextRender
                                    content={
                                      q.creativeData.subQuestions?.cognitiveA
                                        ?.text
                                    }
                                    className="flex-1 inline-block text-sm"
                                  />
                                  <span className="text-slate-555 text-[15px] font-bold">
                                    {(
                                      q.creativeData.subQuestions?.cognitiveA
                                        ?.marks || 1
                                    ).toLocaleString("bn-BD")}
                                  </span>
                                </div>
                                {isAnswerVisible &&
                                  q.creativeData.subQuestions?.cognitiveA
                                    ?.answer && (
                                    <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                      <span className="font-bold text-green-700 mr-1.5">
                                        উত্তর:
                                      </span>
                                      <RichTextRender
                                        content={
                                          q.creativeData.subQuestions.cognitiveA
                                            .answer
                                        }
                                        inline={true}
                                      />
                                    </div>
                                  )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center ">
                                  <span className="w-6">খ.</span>
                                  <RichTextRender
                                    content={
                                      q.creativeData.subQuestions?.cognitiveB
                                        ?.text
                                    }
                                    className="flex-1 inline-block text-sm"
                                  />
                                  <span className="text-slate-555 text-[15px] font-bold">
                                    {(
                                      q.creativeData.subQuestions?.cognitiveB
                                        ?.marks || 2
                                    ).toLocaleString("bn-BD")}
                                  </span>
                                </div>
                                {isAnswerVisible &&
                                  q.creativeData.subQuestions?.cognitiveB
                                    ?.answer && (
                                    <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                      <span className="font-bold text-green-700 mr-1.5">
                                        উত্তর:
                                      </span>
                                      <RichTextRender
                                        content={
                                          q.creativeData.subQuestions.cognitiveB
                                            .answer
                                        }
                                        inline={true}
                                      />
                                    </div>
                                  )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center ">
                                  <span className="w-6">গ.</span>
                                  <RichTextRender
                                    content={
                                      q.creativeData.subQuestions?.cognitiveC
                                        ?.text
                                    }
                                    className="flex-1 inline-block text-sm"
                                  />
                                  <span className="text-slate-555 text-[15px] font-bold">
                                    {(
                                      q.creativeData.subQuestions?.cognitiveC
                                        ?.marks || 3
                                    ).toLocaleString("bn-BD")}
                                  </span>
                                </div>
                                {isAnswerVisible &&
                                  q.creativeData.subQuestions?.cognitiveC
                                    ?.answer && (
                                    <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                      <span className="font-bold text-green-700 mr-1.5">
                                        উত্তর:
                                      </span>
                                      <RichTextRender
                                        content={
                                          q.creativeData.subQuestions.cognitiveC
                                            .answer
                                        }
                                        inline={true}
                                      />
                                    </div>
                                  )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center ">
                                  <span className="w-6">ঘ.</span>
                                  <RichTextRender
                                    content={
                                      q.creativeData.subQuestions?.cognitiveD
                                        ?.text
                                    }
                                    className="flex-1 inline-block text-sm"
                                  />
                                  <span className="text-slate-555 text-[15px] font-bold">
                                    {(
                                      q.creativeData.subQuestions?.cognitiveD
                                        ?.marks || 4
                                    ).toLocaleString("bn-BD")}
                                  </span>
                                </div>
                                {isAnswerVisible &&
                                  q.creativeData.subQuestions?.cognitiveD
                                    ?.answer && (
                                    <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                      <span className="font-bold text-green-700 mr-1.5">
                                        উত্তর:
                                      </span>
                                      <RichTextRender
                                        content={
                                          q.creativeData.subQuestions.cognitiveD
                                            .answer
                                        }
                                        inline={true}
                                      />
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* General Questions */}
                    {!["MCQ", "Creative"].includes(q.category) &&
                      q.generalData && (
                        <div className="space-y-3">
                          {q.generalData.stem && (
                            <div className="p-4 bg-black/[0.02] border-l-4 border-l-[#4F46E5]/70 border-y border-r border-black/[0.05] rounded-r-xl rounded-l-none text-[15px] italic leading-relaxed text-slate-700 backdrop-blur-sm">
                              <RichTextRender content={q.generalData.stem} />
                            </div>
                          )}

                          <div className="text-[15px] flex justify-between items-start gap-4">
                            <div className="flex gap-2">
                              <span className="font-bold shrink-0">
                                {q._overallSerial ? `${q._overallSerial.toLocaleString("bn-BD")}.` : `${(index + 1).toLocaleString("bn-BD")}.`}
                              </span>
                              <RichTextRender
                                content={q.generalData.questionText}
                                className=""
                              />
                            </div>
                            <span className="text-slate-505 text-xs font-bold">
                              {(q.generalData.marks || 0).toLocaleString(
                                "bn-BD",
                              )}
                            </span>
                          </div>

                          {isAnswerVisible && q.generalData.suggestedAnswer && (
                            <div className="p-3 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-[15px] text-slate-700">
                              <span className="font-semibold text-[17px]">
                                উত্তর:{" "}
                              </span>
                              <RichTextRender
                                content={q.generalData.suggestedAnswer}
                                className="inline-block "
                                inline
                              />
                            </div>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Footer Metadata & Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-black/[0.05] pt-2.5 sm:pt-3 text-[10px] sm:text-[11px] font-sans text-slate-500">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3 sm:size-3.5 text-slate-400 shrink-0" />
                        <span>
                          সংরক্ষণকাল: {formatBengaliDateTime(q.createdAt)}
                        </span>
                      </div>
                      {q.status === "Rejected" && q.rejectedBy?.fullName && (
                        <div className="flex items-center gap-1 text-rose-600 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10">
                          <X className="size-3 text-rose-600 shrink-0" />
                          <span>বাতিলকারী: {q.rejectedBy.fullName}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap justify-end w-full sm:w-auto">
                      {q.status !== "Approved" && (
                        <>
                          {q.status === "Rejected" && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setReviewRequestId(q._id);
                                setReviewComment("");
                              }}
                              className="border-indigo-200 text-[#4F46E5] hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/30 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs flex items-center gap-1 font-bold cursor-pointer bg-[#4F46E5]/5 shrink-0"
                            >
                              <RefreshCw className="size-3" />
                              রিভিউ রিকোয়েস্ট
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleEdit(q)}
                            className="border-black/[0.08] text-slate-600 hover:text-[#4F46E5] hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/20 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs flex items-center gap-1 font-bold cursor-pointer shrink-0"
                          >
                            <Edit3 className="size-3" />
                            সম্পাদন
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteConfirmId(q._id)}
                            className="border-black/[0.08] text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs flex items-center gap-1 font-bold cursor-pointer shrink-0"
                          >
                            <Trash2 className="size-3" />
                            মুছে ফেলুন
                          </Button>
                        </>
                      )}
                      {q.status === "Approved" && q.approvedBy?.fullName && (
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 font-bold">
                          <Check className="size-3.5 text-emerald-600" />
                          <span>অনুমোদনকারী: {q.approvedBy.fullName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {hasMore && (
            <div
              ref={observerRef}
              className="py-6 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold"
            >
              <Loader2 className="size-4 animate-spin text-indigo-500" />
              <span>আরও প্রশ্ন লোড হচ্ছে...</span>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent className="max-w-md border border-slate-200/50 bg-glass-elevated backdrop-blur-xl rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 font-bold">
              <AlertCircle className="size-5 animate-pulse" />
              {typeof deleteConfirmId === "object" && deleteConfirmId?.isGroup
                ? "সম্পূর্ণ উদ্দীপক প্রশ্নগুচ্ছটি কি মুছে ফেলতে চান?"
                : "প্রশ্নটি কি মুছে ফেলতে চান?"}
            </DialogTitle>
            <DialogDescription className="pt-2 text-slate-600 leading-relaxed font-semibold">
              {typeof deleteConfirmId === "object" && deleteConfirmId?.isGroup
                ? `এই উদ্দীপকভিত্তিক প্রশ্নগুচ্ছের সকল (${(deleteConfirmId.count || 0).toLocaleString("bn-BD")}টি) প্রশ্ন স্থায়ীভাবে মুছে যাবে এবং পরবর্তীতে উদ্ধার করা সম্ভব হবে না। আপনি কি নিশ্চিতভাবে এটি মুছে ফেলতে চান?`
                : "প্রশ্নটি মুছে ফেললে তা স্থায়ীভাবে হারিয়ে যাবে এবং পরবর্তীতে আর উদ্ধার করা সম্ভব হবে না। আপনি কি নিশ্চিতভাবে এটি মুছে ফেলতে চান?"}
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

      {/* Review Request Dialog */}
      <Dialog
        open={!!reviewRequestId}
        onOpenChange={(open) => {
          if (!open) {
            setReviewRequestId(null);
            setReviewComment("");
          }
        }}
      >
        <DialogContent className="max-w-lg border border-slate-200/50 bg-glass-elevated backdrop-blur-xl rounded-2xl shadow-xl font-sans">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#4F46E5] font-bold">
              <RefreshCw className="size-5" />
              পুনরায় যাচাইয়ের আবেদন
            </DialogTitle>
            <DialogDescription className="pt-2 text-slate-600 leading-relaxed font-semibold text-xs">
              প্রশ্নটি বাতিল হওয়ার পর যে সংশোধন বা পরিবর্তন করেছেন তার
              সংক্ষিপ্ত বিবরণ লিখুন। এই মন্তব্যটি অনুমোদনকারী প্রশাসক দেখতে
              পাবেন।
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <textarea
              placeholder="যেমন: ভুল উত্তর ঠিক করা হয়েছে, বানান সংশোধন করা হয়েছে..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={4}
              className="w-full resize-none bg-white/[0.60] border border-black/[0.10] focus:ring-2 focus:ring-[#4F46E5]/15 focus:border-[#4F46E5] outline-none rounded-xl font-semibold text-slate-700 text-sm leading-relaxed px-3 py-2.5"
            />
            <p className="text-[11px] text-slate-400 mt-1.5 font-semibold">
              {reviewComment.length} / ৫০০ অক্ষর
            </p>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setReviewRequestId(null);
                setReviewComment("");
              }}
              className="border-black/[0.08] text-slate-600 hover:bg-black/[0.02] rounded-xl font-semibold cursor-pointer"
            >
              বাতিল করুন
            </Button>
            <Button
              disabled={
                !reviewComment.trim() || requestReviewMutation.isPending
              }
              onClick={async () => {
                if (!reviewRequestId || !reviewComment.trim()) return;
                try {
                  await handleRequestReview(
                    reviewRequestId,
                    reviewComment.trim(),
                  );
                  setReviewRequestId(null);
                  setReviewComment("");
                } catch (err) {
                  console.error(err);
                }
              }}
              className="bg-[#4F46E5] hover:bg-[#4E3FB4] text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#4F46E5]/10 disabled:opacity-60"
            >
              {requestReviewMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  পাঠানো হচ্ছে...
                </>
              ) : (
                <>
                  <RefreshCw className="size-4" />
                  রিভিউ রিকোয়েস্ট পাঠান
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Modal */}
      <Dialog
        open={!!selectedRejectionReason}
        onOpenChange={(open) => !open && setSelectedRejectionReason(null)}
      >
        <DialogContent className="max-w-md border border-slate-200/50 bg-glass-elevated backdrop-blur-xl rounded-2xl shadow-xl font-sans">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 font-bold">
              <AlertCircle className="size-5" />
              প্রশ্নটি বাতিলকরণের কারণ
            </DialogTitle>
            <DialogDescription className="pt-2 text-slate-700 leading-relaxed font-semibold text-xs whitespace-pre-wrap">
              {selectedRejectionReason}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => setSelectedRejectionReason(null)}
              className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold cursor-pointer text-xs h-9 px-4"
            >
              বন্ধ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
