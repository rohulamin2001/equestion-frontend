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
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Database,
  Eye,
  EyeOff,
  Filter,
  Loader2,
  MessageSquare,
  Search,
  User,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { toast } from "sonner";
import { useQuestionApproval } from "./hook/useQuestionApproval";

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

const formatBengaliDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toLocaleString("bn-BD");
  const month = date.toLocaleString("bn-BD", { month: "long" });
  const year = date.getFullYear().toLocaleString("bn-BD").replace(/,/g, "");
  return `${day} ${month}, ${year}`;
};

const formatBengaliDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toLocaleString("bn-BD");
  const month = date.toLocaleString("bn-BD", { month: "long" });
  const year = date.getFullYear().toLocaleString("bn-BD").replace(/,/g, "");
  const time = date.toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} ${month}, ${year} (সময়: ${time})`;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

export default function QuestionApproval() {
  const {
    filterStatus,
    setFilterStatus,
    pageSize,
    setPageSize,
    qm,
    showFilters,
    setShowFilters,
    selectedPreviewQuestion,
    setSelectedPreviewQuestion,
    stats,
    questions,
    isLoading,
    isError,
    refetchQuestions,
    hasNextPage,
    filterActiveTypes,
    filterActiveLevels,
    filterActiveClasses,
    handleFilterTypeChange,
    handleFilterLevelChange,
    filterSubjects,
    filterChapters,
    updateStatusMutation,
    handleUpdateStatus,
    observerRef,
    handleResetFilters,
    getActiveCategories,
    hasActiveFilters,
  } = useQuestionApproval();

  const [prevQuestionId, setPrevQuestionId] = React.useState(null);
  const [showModalExplanation, setShowModalExplanation] = React.useState(true);
  const [showChatHistory, setShowChatHistory] = React.useState(true);
  const [showAnswers, setShowAnswers] = React.useState(false);
  const [showModalAnswers, setShowModalAnswers] = React.useState(false);
  const [rejectConfirmId, setRejectConfirmId] = React.useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = React.useState("");
  const [selectedRejectionReason, setSelectedRejectionReason] =
    React.useState(null);

  const currentQuestionId = selectedPreviewQuestion?._id || null;
  if (currentQuestionId !== prevQuestionId) {
    setPrevQuestionId(currentQuestionId);
    setShowModalExplanation(true);
    setShowChatHistory(true);
  }

  const statCards = [
    {
      label: "সর্বমোট প্রশ্ন",
      count: stats.total,
      icon: Database,
      statusType: "",
      borderClass: "hover:border-indigo-500/35",
      activeBorderClass:
        "border-indigo-500/50 ring-2 ring-indigo-500/10 shadow-md",
      iconBgClass:
        "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20",
    },
    {
      label: "অনুমোদিত প্রশ্ন",
      count: stats.approved,
      icon: CheckCircle,
      statusType: "Approved",
      borderClass: "hover:border-emerald-500/35",
      activeBorderClass:
        "border-emerald-500/50 ring-2 ring-emerald-500/10 shadow-md",
      iconBgClass:
        "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    },
    {
      label: "অপেক্ষমান প্রশ্ন",
      count: stats.pending,
      icon: Clock,
      statusType: "Pending",
      borderClass: "hover:border-amber-500/35",
      activeBorderClass:
        "border-amber-500/50 ring-2 ring-amber-500/10 shadow-md",
      iconBgClass: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    },
    {
      label: "বাতিলকৃত প্রশ্ন",
      count: stats.rejected,
      icon: XCircle,
      statusType: "Rejected",
      borderClass: "hover:border-rose-500/35",
      activeBorderClass: "border-rose-500/50 ring-2 ring-rose-500/10 shadow-md",
      iconBgClass: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-6 pb-12 w-full font-bengali">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-glass p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">
            প্রশ্ন অনুমোদন ও যাচাই
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            কোশ্চেন ক্রিয়েটরদের তৈরি করা পেন্ডিং প্রশ্নাবলী পর্যবেক্ষণ এবং
            অনুমোদন করুন
          </p>
        </div>
      </div>

      {/* Stats Cards Banner */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {statCards.map((stat, i) => {
          const IconComponent = stat.icon;
          const isCurrentStatus =
            filterStatus === stat.statusType ||
            (stat.statusType === "" && !filterStatus);
          return (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              onClick={() => {
                if (stat.statusType !== "") {
                  setFilterStatus(stat.statusType);
                } else {
                  setFilterStatus(""); // Show all
                }
              }}
              className={`group relative bg-white/[0.45] hover:bg-white/[0.65] p-5 rounded-2xl border ${
                isCurrentStatus ? stat.activeBorderClass : "border-black/[0.04]"
              } ${stat.borderClass} backdrop-blur-md shadow-sm hover:shadow-md transition-colors duration-200 flex items-center justify-between overflow-hidden cursor-pointer`}
            >
              <div className="relative z-10 space-y-1.5">
                <span className="text-sm md:text-base font-bold text-slate-600 block font-sans">
                  {stat.label}
                </span>
                <span className="text-3xl font-extrabold text-slate-800 block font-sans tracking-tight">
                  {stat.count.toLocaleString("bn-BD")}
                </span>
              </div>
              <div
                className={`relative z-10 size-12 rounded-xl ${stat.iconBgClass} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out`}
              >
                <IconComponent className="size-6 shrink-0" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters & Control bar */}
      <div className="bg-glass p-5 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              type="text"
              placeholder="প্রশ্ন খুঁজুন..."
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

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-black/[0.08] text-slate-600 hover:bg-black/[0.02] bg-white/[0.45] rounded-xl h-11 px-4 flex items-center gap-2 font-semibold ${
                showFilters
                  ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#4F46E5]"
                  : ""
              }`}
            >
              <Filter className="size-4" />
              ফিল্টারসমূহ
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
              />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAnswers(!showAnswers)}
              className={`border-black/[0.08] text-slate-600 hover:bg-black/[0.02] bg-white/[0.45] rounded-xl h-11 px-4 flex items-center gap-2 font-semibold ${
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
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-11 px-3.5 font-semibold transition"
              >
                রিসেট
              </Button>
            )}

            {/* Page Size Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-11 px-4 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center gap-2 shadow-sm backdrop-blur-sm cursor-pointer select-none">
                  <span>{pageSize}টি করে প্রদর্শন</span>
                  <ChevronDown className="size-3.5 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[180px]">
                {[10, 20, 50, 100].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onSelect={() => setPageSize(size)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                      pageSize === size
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-700"
                    }`}
                  >
                    <span>{size}টি করে প্রদর্শন</span>
                    {pageSize === size && (
                      <span className="size-1 rounded-full bg-indigo-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Collapsible filters panel */}
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
                    কঠিনতা
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>
                          {qm.filterDifficulty
                            ? DIFFICULTY_MAP[qm.filterDifficulty]?.label ||
                              qm.filterDifficulty
                            : "সকল কঠিনতা"}
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
                        <span>সকল কঠিনতা</span>
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
                    সংস্করণ
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none">
                        <span>
                          {qm.filterVersion === "Bangla"
                            ? "বাংলা সংস্করণ"
                            : qm.filterVersion === "English"
                              ? "ইংরেজি সংস্করণ"
                              : "সকল সংস্করণ"}
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
                        <span>সকল সংস্করণ</span>
                        {!qm.filterVersion && (
                          <span className="size-1 rounded-full bg-indigo-500" />
                        )}
                      </DropdownMenuItem>
                      {[
                        { value: "Bangla", label: "বাংলা সংস্করণ" },
                        { value: "English", label: "ইংরেজি সংস্করণ" },
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

      {/* Main Questions List Container */}
      {isLoading ? (
        <div className="bg-glass rounded-2xl border border-black/[0.05] p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#4F46E5]" />
          <span className="text-slate-500 text-sm font-semibold">
            প্রশ্নসমূহ লোড হচ্ছে...
          </span>
        </div>
      ) : isError ? (
        <div className="bg-glass rounded-2xl border border-rose-100 p-12 flex flex-col items-center justify-center gap-2 text-rose-600">
          <span className="text-sm font-bold">
            প্রশ্ন লোড করতে সমস্যা হয়েছে!
          </span>
          <Button
            variant="outline"
            onClick={() => refetchQuestions()}
            className="mt-2 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold"
          >
            পুনরায় চেষ্টা করুন
          </Button>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-glass rounded-2xl border border-black/[0.05] p-16 flex flex-col items-center justify-center gap-2 text-slate-550">
          <span className="text-sm font-bold">
            কোন প্রশ্ন খুঁজে পাওয়া যায়নি!
          </span>
          <span className="text-xs text-slate-400">
            এই বিভাগে কোনো পেন্ডিং প্রশ্ন জমা পড়েনি।
          </span>
        </div>
      ) : (
        <motion.div
          key="question-approval-list-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {questions.map((q, index) => {
            const classObj = CLASSES_MAP.find((c) => c.value === q.className);
            const categoryObj = CATEGORIES_MAP.find(
              (c) => c.value === q.category,
            );
            return (
              <motion.div
                key={q._id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="group bg-white/[0.45] hover:bg-white/[0.75] rounded-2xl border border-black/[0.04] hover:border-black/[0.08] p-5 shadow-sm hover:shadow-md transition-colors duration-200 backdrop-blur-md flex flex-col gap-4 overflow-hidden"
              >
                {/* Badge Header Row */}
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans font-bold text-slate-500">
                    {new Date() - new Date(q.createdAt) <
                      24 * 60 * 60 * 1000 && (
                      <span className="bg-rose-100 text-rose-650 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
                        নতুন
                      </span>
                    )}
                    {classObj && (
                      <span className="bg-indigo-50 text-[#4F46E5] border border-indigo-100 px-2 py-0.5 rounded">
                        {classObj.label}
                      </span>
                    )}
                    {q.subjectId?.subjectName && (
                      <span className="bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded">
                        {q.subjectId.subjectName}
                      </span>
                    )}
                    {q.chapterNumber && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">
                        অধ্যায় {q.chapterNumber.toLocaleString("bn-BD")}
                      </span>
                    )}
                    {q.topics && q.topics.length > 0 && (
                      <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                        #{q.topics.join(", #")}
                      </span>
                    )}
                    {q.year &&
                      (Array.isArray(q.year)
                        ? q.year.length > 0
                        : String(q.year).trim()) && (
                        <span className="bg-amber-55 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
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
                    {categoryObj && (
                      <span className="bg-[#4F46E5]/5 text-[#4F46E5] border border-[#4F46E5]/10 px-2 py-0.5 rounded">
                        {categoryObj.label}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded border ${
                        q.difficulty === "Easy"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : q.difficulty === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}
                    >
                      {q.difficulty === "Easy"
                        ? "সহজ"
                        : q.difficulty === "Medium"
                          ? "মধ্যম"
                          : "কঠিন"}
                    </span>
                  </div>
                </div>

                {/* Question Content Area */}
                <div className="text-slate-800 font-serif leading-relaxed flex-1 pt-1 pointer-events-none">
                  {/* MCQ */}
                  {q.category === "MCQ" && q.mcqData && (
                    <div className="space-y-4">
                      {q.mcqData.mcqType === "Contextual" && q.mcqData.stem && (
                        <div className="p-4 bg-black/[0.02] border-l-4 border-l-[#4F46E5]/70 border-y border-r border-black/[0.05] rounded-r-xl rounded-l-none text-sm font-serif leading-relaxed text-slate-700 backdrop-blur-sm">
                          <strong>উদ্দীপক:</strong>
                          <RichTextRender
                            content={q.mcqData.stem}
                            className="mt-1 font-serif"
                          />
                        </div>
                      )}

                      <div className="text-[15px] flex justify-between items-start gap-4">
                        <div className="flex gap-2">
                          <span className="font-bold shrink-0">
                            {(index + 1).toLocaleString("bn-BD")}.
                          </span>
                          <div className="flex-1">
                            <RichTextRender content={q.mcqData.questionText} />
                            {q.mcqData.mcqType === "MultipleCompletion" &&
                              q.mcqData.statements && (
                                <div className="space-y-1 pl-4 mt-2 font-normal text-[15px] font-serif text-slate-700">
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
                                        className="inline-block font-serif"
                                      />
                                    </div>
                                  ))}
                                  <div className="mt-2 font-semibold font-serif">
                                    নিচের কোনটি সঠিক?
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                        <span className="text-slate-555 text-xs font-bold">
                          {(q.mcqData?.marks || 1).toLocaleString("bn-BD")}
                        </span>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 text-[15px] font-serif">
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
                                  <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
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

                      {q.mcqData.explanation && (
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
                          {(index + 1).toLocaleString("bn-BD")}.
                        </span>
                        <div className="flex-1 space-y-4">
                          {q.creativeData.stem && (
                            <div className="p-4 bg-black/[0.02] border-l-4 border-l-[#4F46E5]/70 border-y border-r border-black/[0.05] rounded-r-xl rounded-l-none text-sm font-serif leading-relaxed text-slate-700 backdrop-blur-sm">
                              <strong>উদ্দীপক:</strong>
                              <RichTextRender
                                content={q.creativeData.stem}
                                className="mt-1 font-serif"
                              />
                            </div>
                          )}

                          <div className="pl-4 space-y-2.5 text-[15px] font-serif text-slate-700">
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start ">
                                <span className="w-6">ক.</span>
                                <RichTextRender
                                  content={
                                    q.creativeData.subQuestions?.cognitiveA
                                      ?.text
                                  }
                                  className="flex-1 font-serif inline-block"
                                />
                                <span className="text-slate-555 text-[15px] font-bold">
                                  {(
                                    q.creativeData.subQuestions?.cognitiveA
                                      ?.marks || 1
                                  ).toLocaleString("bn-BD")}
                                </span>
                              </div>
                              {showAnswers &&
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
                              <div className="flex justify-between items-start ">
                                <span className="w-6">খ.</span>
                                <RichTextRender
                                  content={
                                    q.creativeData.subQuestions?.cognitiveB
                                      ?.text
                                  }
                                  className="flex-1 font-serif inline-block"
                                />
                                <span className="text-slate-555 text-[15px] font-bold">
                                  {(
                                    q.creativeData.subQuestions?.cognitiveB
                                      ?.marks || 2
                                  ).toLocaleString("bn-BD")}
                                </span>
                              </div>
                              {showAnswers &&
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
                              <div className="flex justify-between items-start ">
                                <span className="w-6">গ.</span>
                                <RichTextRender
                                  content={
                                    q.creativeData.subQuestions?.cognitiveC
                                      ?.text
                                  }
                                  className="flex-1 font-serif inline-block"
                                />
                                <span className="text-slate-555 text-[15px] font-bold">
                                  {(
                                    q.creativeData.subQuestions?.cognitiveC
                                      ?.marks || 3
                                  ).toLocaleString("bn-BD")}
                                </span>
                              </div>
                              {showAnswers &&
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
                              <div className="flex justify-between items-start ">
                                <span className="w-6">ঘ.</span>
                                <RichTextRender
                                  content={
                                    q.creativeData.subQuestions?.cognitiveD
                                      ?.text
                                  }
                                  className="flex-1 font-serif inline-block"
                                />
                                <span className="text-slate-555 text-[15px] font-bold">
                                  {(
                                    q.creativeData.subQuestions?.cognitiveD
                                      ?.marks || 4
                                  ).toLocaleString("bn-BD")}
                                </span>
                              </div>
                              {showAnswers &&
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
                          <div className="p-4 bg-black/[0.02] border-l-4 border-l-[#4F46E5]/70 border-y border-r border-black/[0.05] rounded-r-xl rounded-l-none text-sm font-serif leading-relaxed text-slate-700 backdrop-blur-sm">
                            <RichTextRender content={q.generalData.stem} />
                          </div>
                        )}

                        <div className="text-[15px] flex justify-between items-start gap-4">
                          <div className="flex gap-2">
                            <span className="font-bold shrink-0">
                              {(index + 1).toLocaleString("bn-BD")}.
                            </span>
                            <RichTextRender
                              content={q.generalData.questionText}
                              className="font-serif"
                            />
                          </div>
                          <span className="text-slate-555 text-xs font-serif font-bold">
                            {(q.generalData.marks || 0).toLocaleString("bn-BD")}
                          </span>
                        </div>

                        {q.generalData.suggestedAnswer && (
                          <div className="p-3 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-[15px] font-serif text-slate-700">
                            <span className="font-semibold">উত্তর: </span>
                            <RichTextRender
                              content={q.generalData.suggestedAnswer}
                              className="inline-block font-serif"
                              inline
                            />
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* Footer Metadata & Action Buttons */}
                <div
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-black/[0.05] pt-3 gap-3 text-[11px] font-sans text-slate-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-wrap items-center gap-4 font-medium">
                    <div className="flex items-center gap-1">
                      <User className="size-3.5 text-slate-400" />
                      <span>
                        তৈরি করেছেন:{" "}
                        {q.creatorId?.fullName || "Content Creator"} (
                        {q.creatorId?.role || ""})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-slate-400" />
                      <span>তারিখ: {formatBengaliDate(q.createdAt)}</span>
                    </div>
                    {q.status === "Approved" && q.approvedBy?.fullName && (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                        <Check className="size-3 text-emerald-600" />
                        <span>অনুমোদনকারী: {q.approvedBy.fullName}</span>
                      </div>
                    )}
                    {q.status === "Rejected" && q.rejectedBy?.fullName && (
                      <div className="flex items-center gap-1 text-rose-600 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">
                        <XCircle className="size-3 text-rose-600" />
                        <span>বাতিলকারী: {q.rejectedBy.fullName}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedPreviewQuestion(q)}
                      className="border-black/[0.08] text-slate-600 hover:text-[#4F46E5] hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/20 rounded-xl h-8 px-3 text-xs flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Eye className="size-3" />
                      বিস্তারিত
                    </Button>

                    {q.status === "Pending" && (
                      <>
                        <Button
                          type="button"
                          onClick={() => handleUpdateStatus(q._id, "Approved")}
                          disabled={updateStatusMutation.isPending}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-8 px-3 text-xs flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Check className="size-3" />
                          অনুমোদন
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setRejectConfirmId(q._id);
                            setRejectionReasonInput("");
                          }}
                          disabled={updateStatusMutation.isPending}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl h-8 px-3 text-xs flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <XCircle className="size-3" />
                          বাতিল
                        </Button>
                      </>
                    )}

                    {q.status === "Approved" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setRejectConfirmId(q._id);
                          setRejectionReasonInput("");
                        }}
                        disabled={updateStatusMutation.isPending}
                        className="border-red-200 text-red-650 hover:bg-red-50 hover:border-red-300 rounded-xl h-8 px-3 text-xs flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <XCircle className="size-3" />
                        বাতিল করুন
                      </Button>
                    )}

                    {q.status === "Rejected" && (
                      <Button
                        type="button"
                        onClick={() => handleUpdateStatus(q._id, "Approved")}
                        disabled={updateStatusMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-8 px-3 text-xs flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Check className="size-3" />
                        অনুমোদন করুন
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {hasNextPage && (
            <div
              ref={observerRef}
              className="py-6 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold"
            >
              <Loader2 className="size-4 animate-spin text-indigo-500" />
              <span>আরও প্রশ্ন লোড হচ্ছে...</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Details Preview Dialog */}
      <Dialog
        open={!!selectedPreviewQuestion}
        onOpenChange={(open) => !open && setSelectedPreviewQuestion(null)}
      >
        <DialogContent className="max-w-3xl border border-black/[0.08] bg-white/[0.92] backdrop-blur-xl rounded-3xl shadow-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden font-sans">
          {selectedPreviewQuestion && (
            <div className="flex flex-col h-full min-h-0">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-black/[0.05] flex items-center justify-between bg-slate-50/50 shrink-0">
                <div>
                  <DialogTitle className="text-slate-800 font-extrabold text-lg tracking-tight font-sans">
                    প্রশ্নপত্র বিস্তারিত বিবরণ ও যাচাইকরণ
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-xs mt-0.5">
                    প্রশ্নের মান এবং সকল মেটাডাটা সুচারুভাবে যাচাই করুন
                  </DialogDescription>
                </div>
              </div>

              {/* Scrollable Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                {/* Meta details Grid */}
                <div className="bg-slate-50/60 border border-black/[0.03] rounded-2xl p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    মেটাডাটা বিবরণসমূহ
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CLASSES_MAP.find(
                      (c) => c.value === selectedPreviewQuestion.className,
                    ) && (
                      <div className="bg-indigo-50 text-indigo-700 border border-indigo-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                        <span className="size-1.5 rounded-full bg-indigo-500" />
                        <span>
                          শ্রেণী:{" "}
                          {
                            CLASSES_MAP.find(
                              (c) =>
                                c.value === selectedPreviewQuestion.className,
                            ).label
                          }
                        </span>
                      </div>
                    )}
                    {selectedPreviewQuestion.subjectId?.subjectName && (
                      <div className="bg-violet-50 text-violet-700 border border-violet-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                        <span className="size-1.5 rounded-full bg-violet-500" />
                        <span>
                          বিষয়: {selectedPreviewQuestion.subjectId.subjectName}
                        </span>
                      </div>
                    )}
                    {selectedPreviewQuestion.chapterNumber && (
                      <div className="bg-amber-50 text-amber-700 border border-amber-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        <span>
                          অধ্যায়:{" "}
                          {selectedPreviewQuestion.chapterNumber.toLocaleString(
                            "bn-BD",
                          )}
                        </span>
                      </div>
                    )}
                    {CATEGORIES_MAP.find(
                      (c) => c.value === selectedPreviewQuestion.category,
                    ) && (
                      <div className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <span>
                          ধরণ:{" "}
                          {
                            CATEGORIES_MAP.find(
                              (c) =>
                                c.value === selectedPreviewQuestion.category,
                            ).label
                          }
                        </span>
                      </div>
                    )}
                    {selectedPreviewQuestion.subjectId?.version && (
                      <div className="bg-cyan-50 text-cyan-700 border border-cyan-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                        <span className="size-1.5 rounded-full bg-cyan-500" />
                        <span>
                          সংস্করণ:{" "}
                          {selectedPreviewQuestion.subjectId.version ===
                          "Bangla"
                            ? "বাংলা সংস্করণ"
                            : "ইংরেজি সংস্করণ"}
                        </span>
                      </div>
                    )}
                    <div
                      className={`border px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm ${
                        selectedPreviewQuestion.difficulty === "Easy"
                          ? "bg-teal-50 text-teal-700 border-teal-100/50"
                          : selectedPreviewQuestion.difficulty === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-100/50"
                            : "bg-rose-50 text-rose-700 border-rose-100/50"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          selectedPreviewQuestion.difficulty === "Easy"
                            ? "bg-teal-500"
                            : selectedPreviewQuestion.difficulty === "Medium"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                        }`}
                      />
                      <span>
                        কঠিনতা:{" "}
                        {selectedPreviewQuestion.difficulty === "Easy"
                          ? "সহজ"
                          : selectedPreviewQuestion.difficulty === "Medium"
                            ? "মধ্যম"
                            : "কঠিন"}
                      </span>
                    </div>

                    {selectedPreviewQuestion.year &&
                      (Array.isArray(selectedPreviewQuestion.year)
                        ? selectedPreviewQuestion.year.length > 0
                        : String(selectedPreviewQuestion.year).trim()) && (
                        <div className="bg-amber-50 text-amber-700 border border-amber-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                          <span className="size-1.5 rounded-full bg-amber-500" />
                          <span>
                            সাল:{" "}
                            {Array.isArray(selectedPreviewQuestion.year)
                              ? selectedPreviewQuestion.year.join(", ")
                              : selectedPreviewQuestion.year}
                          </span>
                        </div>
                      )}
                    {selectedPreviewQuestion.board &&
                      (Array.isArray(selectedPreviewQuestion.board)
                        ? selectedPreviewQuestion.board.length > 0
                        : String(selectedPreviewQuestion.board).trim()) && (
                        <div className="bg-blue-50 text-blue-700 border border-blue-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                          <span className="size-1.5 rounded-full bg-blue-500" />
                          <span>
                            বোর্ড:{" "}
                            {Array.isArray(selectedPreviewQuestion.board)
                              ? selectedPreviewQuestion.board.join(", ")
                              : selectedPreviewQuestion.board}
                          </span>
                        </div>
                      )}
                    {selectedPreviewQuestion.school &&
                      (Array.isArray(selectedPreviewQuestion.school)
                        ? selectedPreviewQuestion.school.length > 0
                        : String(selectedPreviewQuestion.school).trim()) && (
                        <div className="bg-purple-50 text-purple-700 border border-purple-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                          <span className="size-1.5 rounded-full bg-purple-500" />
                          <span>
                            শিক্ষা প্রতিষ্ঠান:{" "}
                            {Array.isArray(selectedPreviewQuestion.school)
                              ? selectedPreviewQuestion.school.join(", ")
                              : selectedPreviewQuestion.school}
                          </span>
                        </div>
                      )}
                    {selectedPreviewQuestion.level &&
                      String(selectedPreviewQuestion.level).trim() && (
                        <div className="bg-rose-50 text-rose-700 border border-rose-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                          <span className="size-1.5 rounded-full bg-rose-500" />
                          <span>
                            লেভেল:{" "}
                            {LEVEL_LABELS[selectedPreviewQuestion.level] ||
                              selectedPreviewQuestion.level}
                          </span>
                        </div>
                      )}
                    {selectedPreviewQuestion.specialSearch &&
                      (Array.isArray(selectedPreviewQuestion.specialSearch)
                        ? selectedPreviewQuestion.specialSearch.length > 0
                        : String(
                            selectedPreviewQuestion.specialSearch,
                          ).trim()) && (
                        <div className="bg-slate-50 text-slate-700 border border-slate-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                          <span className="size-1.5 rounded-full bg-slate-500" />
                          <span>
                            কীওয়ার্ড:{" "}
                            {Array.isArray(
                              selectedPreviewQuestion.specialSearch,
                            )
                              ? selectedPreviewQuestion.specialSearch.join(", ")
                              : selectedPreviewQuestion.specialSearch}
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                {/* Content Preview Container */}
                <div className="bg-white border border-black/[0.04] p-6 rounded-2xl shadow-inner space-y-4">
                  <div className="flex items-center justify-between border-b border-black/[0.03] pb-1.5">
                    <span className="text-xs  text-slate-400 uppercase tracking-wider font-sans">
                      প্রশ্নের কন্টেন্ট প্রিভিউ
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`border px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm ${
                          selectedPreviewQuestion.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : selectedPreviewQuestion.status === "Pending"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {selectedPreviewQuestion.status === "Pending" ? (
                          <Loader2 className="size-3 animate-spin text-orange-600 shrink-0" />
                        ) : (
                          <span
                            className={`size-1.5 rounded-full ${
                              selectedPreviewQuestion.status === "Approved"
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          />
                        )}
                        <span>
                          {selectedPreviewQuestion.status === "Approved"
                            ? "অনুমোদিত"
                            : selectedPreviewQuestion.status === "Pending"
                              ? "অপেক্ষমান"
                              : "বাতিলকৃত"}
                        </span>
                      </div>
                      {selectedPreviewQuestion.category === "Creative" && (
                        <div className="ml-2 border-l pl-3 border-black/[0.05]">
                          <button
                            type="button"
                            onClick={() =>
                              setShowModalAnswers(!showModalAnswers)
                            }
                            className={`border px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-colors ${
                              showModalAnswers
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {showModalAnswers ? "উত্তর লুকান" : "উত্তর দেখান"}
                          </button>
                        </div>
                      )}
                      {selectedPreviewQuestion.status === "Rejected" &&
                        (selectedPreviewQuestion.rejectionReason ||
                          (selectedPreviewQuestion.rejectionHistory &&
                            selectedPreviewQuestion.rejectionHistory.length >
                              0)) && (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRejectionReason(
                                selectedPreviewQuestion.rejectionReason ||
                                  selectedPreviewQuestion.rejectionHistory[
                                    selectedPreviewQuestion.rejectionHistory
                                      .length - 1
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
                  </div>

                  {/* Chat history / Rejection & Review logs */}
                  {(() => {
                    const messages = [];

                    if (
                      selectedPreviewQuestion.rejectionHistory &&
                      Array.isArray(selectedPreviewQuestion.rejectionHistory)
                    ) {
                      selectedPreviewQuestion.rejectionHistory.forEach((r) => {
                        if (r.reason) {
                          messages.push({
                            type: "rejection",
                            text: r.reason,
                            by: r.rejectedBy,
                            date: r.rejectedAt ? new Date(r.rejectedAt) : null,
                          });
                        }
                      });
                    }

                    if (
                      selectedPreviewQuestion.reviewHistory &&
                      Array.isArray(selectedPreviewQuestion.reviewHistory)
                    ) {
                      selectedPreviewQuestion.reviewHistory.forEach((r) => {
                        if (r.comment) {
                          messages.push({
                            type: "review",
                            text: r.comment,
                            date: r.requestedAt
                              ? new Date(r.requestedAt)
                              : null,
                          });
                        }
                      });
                    }

                    // Fallback to legacy fields if arrays are empty
                    if (messages.length === 0) {
                      if (selectedPreviewQuestion.previousRejectionReason) {
                        messages.push({
                          type: "rejection",
                          text: selectedPreviewQuestion.previousRejectionReason,
                          date: selectedPreviewQuestion.createdAt
                            ? new Date(selectedPreviewQuestion.createdAt)
                            : null,
                        });
                      }
                      if (selectedPreviewQuestion.reviewComment) {
                        messages.push({
                          type: "review",
                          text: selectedPreviewQuestion.reviewComment,
                          date: selectedPreviewQuestion.updatedAt
                            ? new Date(selectedPreviewQuestion.updatedAt)
                            : null,
                        });
                      }
                      if (
                        selectedPreviewQuestion.status === "Rejected" &&
                        selectedPreviewQuestion.rejectionReason &&
                        selectedPreviewQuestion.rejectionReason !==
                          selectedPreviewQuestion.previousRejectionReason
                      ) {
                        messages.push({
                          type: "rejection",
                          text: selectedPreviewQuestion.rejectionReason,
                          by: selectedPreviewQuestion.rejectedBy,
                          date: selectedPreviewQuestion.updatedAt
                            ? new Date(selectedPreviewQuestion.updatedAt)
                            : null,
                        });
                      }
                    }

                    // Sort chronologically (oldest first)
                    messages.sort((a, b) => {
                      if (!a.date) return -1;
                      if (!b.date) return 1;
                      return a.date - b.date;
                    });

                    if (messages.length === 0) return null;

                    return (
                      <div className="rounded-xl border border-slate-200 bg-slate-50/80 overflow-hidden mb-4">
                        {/* Header */}
                        <div className="flex items-center justify-between gap-2 px-4 py-2 bg-white border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="size-3.5 text-[#4F46E5] shrink-0" />
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
                              প্রশ্ন যাচাইকরণ ইতিহাস ও মন্তব্যসমূহ
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowChatHistory(!showChatHistory)}
                            className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-650 hover:text-indigo-850 cursor-pointer transition select-none bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/15"
                          >
                            {showChatHistory ? (
                              <>
                                <EyeOff className="size-3.5" />
                                <span>লুকিয়ে রাখুন</span>
                              </>
                            ) : (
                              <>
                                <Eye className="size-3.5" />
                                <span>ইতিহাস দেখান</span>
                              </>
                            )}
                          </button>
                        </div>
                        {/* Chat body */}
                        <AnimatePresence initial={false}>
                          {showChatHistory && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 py-4 space-y-4 max-h-[300px] overflow-y-auto bg-slate-50/50">
                                {messages.map((msg, index) => {
                                  if (msg.type === "rejection") {
                                    const observerName = msg.by?.fullName || "";
                                    const observerLabel = observerName
                                      ? `পর্যবেক্ষক (${observerName})`
                                      : "পর্যবেক্ষক";
                                    return (
                                      <div
                                        key={index}
                                        className="flex items-start gap-2"
                                      >
                                        <div className="size-7 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                                          <X className="size-3.5 text-rose-600" />
                                        </div>
                                        <div className="max-w-[85%]">
                                          <p className="text-[11px] font-bold text-rose-500 mb-0.5 font-sans">
                                            {observerLabel} · বাতিলের কারণ
                                          </p>
                                          <div className="bg-white border border-rose-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm">
                                            <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                                              {msg.text}
                                            </p>
                                          </div>
                                          {msg.date && (
                                            <p className="text-[9px] text-slate-400 mt-1 pl-1 font-sans">
                                              {formatBengaliDateTime(msg.date)}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div
                                        key={index}
                                        className="flex items-start gap-2 justify-end"
                                      >
                                        <div className="max-w-[85%]">
                                          <p className="text-[11px] font-bold text-[#4F46E5] mb-0.5 font-sans text-right">
                                            প্রশ্ন প্রণেতা · সংশোধনের বিবরণ
                                          </p>
                                          <div className="bg-[#4F46E5] rounded-2xl rounded-tr-sm px-3.5 py-2.5 shadow-sm">
                                            <p className="text-[13px] text-white leading-relaxed whitespace-pre-wrap font-medium">
                                              {msg.text}
                                            </p>
                                          </div>
                                          {msg.date && (
                                            <p className="text-[9px] text-slate-400 mt-1 pr-1 font-sans text-right">
                                              {formatBengaliDateTime(msg.date)}
                                            </p>
                                          )}
                                        </div>
                                        <div className="size-7 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center justify-center shrink-0 mt-0.5">
                                          <User className="size-3.5 text-[#4F46E5]" />
                                        </div>
                                      </div>
                                    );
                                  }
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })()}

                  {/* MCQ Mode Preview */}
                  {selectedPreviewQuestion.category === "MCQ" &&
                    selectedPreviewQuestion.mcqData && (
                      <div className="space-y-5">
                        {selectedPreviewQuestion.mcqData.mcqType ===
                          "Contextual" &&
                          selectedPreviewQuestion.mcqData.stem && (
                            <div className="p-4 bg-black/[0.015] border-l-4 border-[#4F46E5]/70 border-y border-r border-black/[0.03] rounded-r-xl rounded-l-none text-sm font-serif leading-relaxed text-slate-700">
                              <strong>উদ্দীপক:</strong>
                              <RichTextRender
                                content={selectedPreviewQuestion.mcqData.stem}
                                className="mt-1 font-serif"
                              />
                            </div>
                          )}

                        <div className="space-y-3">
                          <div className="text-[15px] flex justify-between items-start gap-4 w-full">
                            <div className="flex gap-2">
                              <span className="font-bold shrink-0">১.</span>
                              <RichTextRender
                                content={
                                  selectedPreviewQuestion.mcqData.questionText
                                }
                                className="font-serif inline-block text-slate-800"
                              />
                            </div>
                            <span className="text-slate-505 text-xs font-bold whitespace-nowrap pt-1">
                              মান:{" "}
                              {(
                                selectedPreviewQuestion.mcqData?.marks || 1
                              ).toLocaleString("bn-BD")}
                            </span>
                          </div>

                          {selectedPreviewQuestion.mcqData.mcqType ===
                            "MultipleCompletion" &&
                            selectedPreviewQuestion.mcqData.statements && (
                              <div className="space-y-1.5 pl-6 mt-2 font-normal text-sm font-sans text-slate-650">
                                {selectedPreviewQuestion.mcqData.statements.map(
                                  (st, idx) => (
                                    <div
                                      key={idx}
                                      className="flex gap-2 items-start"
                                    >
                                      <span className="shrink-0 text-slate-400 font-bold">
                                        {idx === 0
                                          ? "i."
                                          : idx === 1
                                            ? "ii."
                                            : "iii."}
                                      </span>
                                      <RichTextRender
                                        content={st}
                                        className="inline-block font-sans font-normal"
                                      />
                                    </div>
                                  ),
                                )}
                              </div>
                            )}

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 text-sm font-sans text-slate-700 mt-4">
                            {selectedPreviewQuestion.mcqData.options &&
                              selectedPreviewQuestion.mcqData.options.map(
                                (opt, idx) => {
                                  const isCorrect =
                                    selectedPreviewQuestion.mcqData
                                      .correctAnswer === idx;
                                  return (
                                    <div
                                      key={idx}
                                      className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-200 ${
                                        isCorrect
                                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 font-semibold"
                                          : "border-black/[0.04] bg-slate-50/50 hover:bg-slate-50 text-slate-600"
                                      }`}
                                    >
                                      <span
                                        className={`shrink-0 font-bold ${isCorrect ? "text-emerald-500" : "text-slate-400"}`}
                                      >
                                        {idx === 0
                                          ? "ক)"
                                          : idx === 1
                                            ? "খ)"
                                            : idx === 2
                                              ? "গ)"
                                              : "ঘ)"}
                                      </span>
                                      <RichTextRender
                                        content={opt}
                                        className={`inline-block font-sans [&_p]:inline [&_p]:m-0 ${isCorrect ? "font-semibold text-emerald-800" : "font-normal"}`}
                                      />
                                      {isCorrect && (
                                        <Check className="size-4 text-emerald-600 ml-auto shrink-0" />
                                      )}
                                    </div>
                                  );
                                },
                              )}
                          </div>

                          {selectedPreviewQuestion.mcqData.explanation && (
                            <div className="mt-5 p-4 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-[15px] text-slate-700 leading-relaxed transition-all duration-300">
                              <div className="flex items-center justify-between border-b border-[#4F46E5]/10 pb-2 mb-2">
                                <strong className="text-slate-800 font-semibold text-[15px]">
                                  উত্তর বিশ্লেষণ/ব্যাখ্যা:{" "}
                                </strong>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowModalExplanation(
                                      !showModalExplanation,
                                    )
                                  }
                                  className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-650 hover:text-indigo-850 cursor-pointer transition select-none bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/15"
                                >
                                  {showModalExplanation ? (
                                    <>
                                      <EyeOff className="size-3.5" />
                                      <span>লুকিয়ে রাখুন</span>
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="size-3.5" />
                                      <span>বিশ্লেষণ দেখান</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <AnimatePresence initial={false}>
                                {showModalExplanation && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <RichTextRender
                                      content={
                                        selectedPreviewQuestion.mcqData
                                          .explanation
                                      }
                                      inline
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Creative Mode Preview */}
                  {selectedPreviewQuestion.category === "Creative" &&
                    selectedPreviewQuestion.creativeData && (
                      <div className="space-y-5">
                        {selectedPreviewQuestion.creativeData.stem && (
                          <div className="p-5 bg-black/[0.02] border-l-4 border-l-[#4F46E5] border border-black/[0.05] rounded-r-xl text-[14px] leading-relaxed text-slate-700 backdrop-blur-sm font-serif">
                            <RichTextRender
                              content={
                                selectedPreviewQuestion.creativeData.stem
                              }
                            />
                          </div>
                        )}

                        <div className="pl-4 space-y-3.5 text-[15px] text-slate-700">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <span className="w-6 text-slate-400">ক.</span>
                              <RichTextRender
                                content={
                                  selectedPreviewQuestion.creativeData
                                    .subQuestions?.cognitiveA?.text
                                }
                                className="flex-1 font-serif inline-block text-slate-800"
                              />
                              <span className="text-slate-505 text-[15px] font-bold">
                                {(
                                  selectedPreviewQuestion.creativeData
                                    .subQuestions?.cognitiveA?.marks || 1
                                ).toLocaleString("bn-BD")}
                              </span>
                            </div>
                            {showModalAnswers &&
                              selectedPreviewQuestion.creativeData.subQuestions
                                ?.cognitiveA?.answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={
                                      selectedPreviewQuestion.creativeData
                                        .subQuestions.cognitiveA.answer
                                    }
                                    inline={true}
                                  />
                                </div>
                              )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <span className="w-6 text-slate-400">খ.</span>
                              <RichTextRender
                                content={
                                  selectedPreviewQuestion.creativeData
                                    .subQuestions?.cognitiveB?.text
                                }
                                className="flex-1 font-serif inline-block text-slate-800"
                              />
                              <span className="text-slate-505 text-[15px] font-bold">
                                {(
                                  selectedPreviewQuestion.creativeData
                                    .subQuestions?.cognitiveB?.marks || 2
                                ).toLocaleString("bn-BD")}
                              </span>
                            </div>
                            {showModalAnswers &&
                              selectedPreviewQuestion.creativeData.subQuestions
                                ?.cognitiveB?.answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={
                                      selectedPreviewQuestion.creativeData
                                        .subQuestions.cognitiveB.answer
                                    }
                                    inline={true}
                                  />
                                </div>
                              )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <span className="w-6 text-slate-400">গ.</span>
                              <RichTextRender
                                content={
                                  selectedPreviewQuestion.creativeData
                                    .subQuestions?.cognitiveC?.text
                                }
                                className="flex-1 font-serif inline-block text-slate-800"
                              />
                              <span className="text-slate-505 text-[15px] font-bold">
                                {(
                                  selectedPreviewQuestion.creativeData
                                    .subQuestions?.cognitiveC?.marks || 3
                                ).toLocaleString("bn-BD")}
                              </span>
                            </div>
                            {showModalAnswers &&
                              selectedPreviewQuestion.creativeData.subQuestions
                                ?.cognitiveC?.answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={
                                      selectedPreviewQuestion.creativeData
                                        .subQuestions.cognitiveC.answer
                                    }
                                    inline={true}
                                  />
                                </div>
                              )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <span className="w-6 text-slate-400">ঘ.</span>
                              <RichTextRender
                                content={
                                  selectedPreviewQuestion.creativeData
                                    .subQuestions?.cognitiveD?.text
                                }
                                className="flex-1 font-serif inline-block text-slate-800"
                              />
                              <span className="text-slate-505 text-[15px] font-bold">
                                {(
                                  selectedPreviewQuestion.creativeData
                                    .subQuestions?.cognitiveD?.marks || 4
                                ).toLocaleString("bn-BD")}
                              </span>
                            </div>
                            {showModalAnswers &&
                              selectedPreviewQuestion.creativeData.subQuestions
                                ?.cognitiveD?.answer && (
                                <div className="ml-8 mt-1 p-3 bg-green-50/50 border border-green-100 rounded-lg text-[17px] text-green-800 font-serif">
                                  <span className="font-bold text-green-700 mr-1.5">
                                    উত্তর:
                                  </span>
                                  <RichTextRender
                                    content={
                                      selectedPreviewQuestion.creativeData
                                        .subQuestions.cognitiveD.answer
                                    }
                                    inline={true}
                                  />
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* General Mode Preview */}
                  {!["MCQ", "Creative"].includes(
                    selectedPreviewQuestion.category,
                  ) &&
                    selectedPreviewQuestion.generalData && (
                      <div className="space-y-4">
                        {selectedPreviewQuestion.generalData.stem && (
                          <div className="p-4 bg-black/[0.02] border border-black/[0.05] rounded-xl text-sm font-serif leading-relaxed backdrop-blur-sm">
                            <RichTextRender
                              content={selectedPreviewQuestion.generalData.stem}
                            />
                          </div>
                        )}

                        <div className="text-[15px] flex justify-between items-start gap-4 w-full">
                          <div className="flex gap-2">
                            <span className="font-bold shrink-0">১.</span>
                            <RichTextRender
                              content={
                                selectedPreviewQuestion.generalData.questionText
                              }
                              className="font-serif inline-block text-slate-800"
                            />
                          </div>
                          <span className="text-slate-505 text-xs font-bold whitespace-nowrap pt-1">
                            মান:{" "}
                            {(
                              selectedPreviewQuestion.generalData.marks || 0
                            ).toLocaleString("bn-BD")}
                          </span>
                        </div>

                        {selectedPreviewQuestion.generalData
                          .suggestedAnswer && (
                          <div className="p-4 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl text-[15px] font-serif text-slate-700 transition-all duration-300">
                            <div className="flex items-center justify-between border-b border-[#4F46E5]/10 pb-2 mb-2">
                              <span className="text-xs font-bold text-[#4F46E5]">
                                উত্তর / সমাধান:{" "}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowModalExplanation(!showModalExplanation)
                                }
                                className="flex items-center gap-1.5 text-[11px] font-bold text-[#4F46E5] hover:text-[#4F46E5]/80 cursor-pointer transition select-none bg-[#4F46E5]/5 px-2.5 py-1 rounded-lg border border-[#4F46E5]/10"
                              >
                                {showModalExplanation ? (
                                  <>
                                    <EyeOff className="size-3.5" />
                                    <span>লুকিয়ে রাখুন</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="size-3.5" />
                                    <span>উত্তর দেখান</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <AnimatePresence initial={false}>
                              {showModalExplanation && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <RichTextRender
                                    content={
                                      selectedPreviewQuestion.generalData
                                        .suggestedAnswer
                                    }
                                    inline
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* Creator & Status Information Panel (Moved out of footer to full-width card above footer) */}
                <div className="border border-black/[0.06] bg-slate-50/50 p-4 rounded-2xl backdrop-blur-sm space-y-3">
                  <span className=" text-xs font-bold text-slate-400 uppercase tracking-wider block border-b border-black/[0.03] pb-1.5 font-sans">
                    তথ্য ও স্ট্যাটাস বিবরণী
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    {/* Creator Information Panel */}
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-650 flex items-center justify-center border border-indigo-500/20 shadow-sm shrink-0">
                        <User className="size-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">
                            {selectedPreviewQuestion.creatorId?.fullName ||
                              "Content Creator"}
                          </span>
                          <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-500/10 px-1.5 py-0.5 rounded-md border border-indigo-500/20 uppercase font-sans">
                            {selectedPreviewQuestion.creatorId?.role ||
                              "Creator"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
                          <Calendar className="size-3 text-slate-400" />
                          <span>
                            তৈরির তারিখ:{" "}
                            {formatBengaliDate(
                              selectedPreviewQuestion.createdAt,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Approver Panel */}
                    {selectedPreviewQuestion.status === "Approved" &&
                      selectedPreviewQuestion.approvedBy?.fullName && (
                        <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-8">
                          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-650 flex items-center justify-center border border-emerald-500/20 shadow-sm shrink-0">
                            <Check className="size-5" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-700">
                                অনুমোদনকারী:{" "}
                                {selectedPreviewQuestion.approvedBy.fullName}
                              </span>
                              <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 uppercase font-sans">
                                {selectedPreviewQuestion.approvedBy.role ||
                                  "Approver"}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              প্রশ্নের স্ট্যাটাস: অনুমোদিত
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Rejecter Panel */}
                    {selectedPreviewQuestion.status === "Rejected" &&
                      selectedPreviewQuestion.rejectedBy?.fullName && (
                        <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-8">
                          <div className="size-10 rounded-xl bg-rose-500/10 text-rose-650 flex items-center justify-center border border-rose-500/20 shadow-sm shrink-0">
                            <XCircle className="size-5" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs  text-slate-700 font-medium">
                                বাতিলকারী:{" "}
                                {selectedPreviewQuestion.rejectedBy.fullName}
                              </span>
                              <span className="text-[9px] font-extrabold text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded-md border border-rose-500/20 uppercase font-sans">
                                {selectedPreviewQuestion.rejectedBy.role ||
                                  "Rejecter"}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              প্রশ্নের স্ট্যাটাস: বাতিলকৃত
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Modal Footer with Actions Only */}
              <div className="bg-slate-50/80 border-t border-black/[0.05] px-6 py-4 flex items-center justify-end shrink-0">
                {/* Footer Action Buttons */}
                <div className="flex flex-row flex-nowrap items-center gap-2.5 shrink-0 animate-in fade-in duration-200">
                  {selectedPreviewQuestion.status === "Pending" && (
                    <>
                      <Button
                        onClick={() =>
                          handleUpdateStatus(
                            selectedPreviewQuestion._id,
                            "Approved",
                          )
                        }
                        disabled={updateStatusMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs h-10 px-4 cursor-pointer flex items-center gap-1.5 shadow-sm transition hover:scale-102 shrink-0"
                      >
                        <Check className="size-3.5" />
                        অনুমোদন করুন
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRejectConfirmId(selectedPreviewQuestion._id);
                          setRejectionReasonInput("");
                        }}
                        disabled={updateStatusMutation.isPending}
                        className="border-red-200 text-red-650 hover:bg-red-50 hover:border-red-350 rounded-xl font-bold text-xs h-10 px-4 cursor-pointer flex items-center gap-1.5 shadow-sm transition hover:scale-102 shrink-0"
                      >
                        <XCircle className="size-3.5" />
                        বাতিল করুন
                      </Button>
                    </>
                  )}

                  {selectedPreviewQuestion.status === "Approved" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRejectConfirmId(selectedPreviewQuestion._id);
                        setRejectionReasonInput("");
                      }}
                      disabled={updateStatusMutation.isPending}
                      className="border-red-200 text-red-650 hover:bg-red-50 hover:border-red-350 rounded-xl font-bold text-xs h-10 px-4 cursor-pointer flex items-center gap-1.5 shadow-sm transition hover:scale-102 shrink-0"
                    >
                      <XCircle className="size-3.5" />
                      বাতিল করুন
                    </Button>
                  )}

                  {selectedPreviewQuestion.status === "Rejected" && (
                    <Button
                      onClick={() =>
                        handleUpdateStatus(
                          selectedPreviewQuestion._id,
                          "Approved",
                        )
                      }
                      disabled={updateStatusMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs h-10 px-4 cursor-pointer flex items-center gap-1.5 shadow-sm transition hover:scale-102 shrink-0"
                    >
                      <Check className="size-3.5" />
                      অনুমোদন করুন
                    </Button>
                  )}

                  <Button
                    onClick={() => setSelectedPreviewQuestion(null)}
                    className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs h-10 px-4 cursor-pointer shadow-md transition hover:scale-102 shrink-0"
                  >
                    বন্ধ করুন
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Modal */}
      <Dialog
        open={!!rejectConfirmId}
        onOpenChange={(open) => !open && setRejectConfirmId(null)}
      >
        <DialogContent className="max-w-md border border-black/[0.08] bg-white/[0.90] backdrop-blur-xl rounded-2xl shadow-xl font-sans">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-650 font-bold">
              <XCircle className="size-5" />
              প্রশ্নটি বাতিলকরণের কারণ
            </DialogTitle>
            <DialogDescription className="pt-1.5 text-slate-500 font-semibold text-xs">
              প্রশ্নটি বাতিল করার পূর্বে অনুগ্রহ করে সুনির্দিষ্ট কারণটি নিচে
              সংক্ষেপে লিখুন। এই কারণটি প্রশ্ন প্রণেতা তার ড্যাশবোর্ডে দেখতে
              পাবেন।
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <label
              htmlFor="rejection-reason"
              className="text-xs font-bold text-slate-700 block"
            >
              বাতিলকরণের কারণ (আবশ্যক)
            </label>
            <textarea
              id="rejection-reason"
              placeholder="যেমন: প্রশ্নে বানান ভুল রয়েছে / উদ্দীপকটি অস্পষ্ট / সঠিক উত্তর নেই..."
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white/70 resize-none font-sans font-medium"
            />
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setRejectConfirmId(null)}
              className="border-black/[0.08] text-slate-600 hover:bg-black/[0.02] rounded-xl font-bold cursor-pointer text-xs h-9 px-4"
            >
              বন্ধ করুন
            </Button>
            <Button
              onClick={() => {
                if (!rejectionReasonInput.trim()) {
                  toast.error("অনুগ্রহ করে বাতিলকরণের কারণটি লিখুন");
                  return;
                }
                handleUpdateStatus(
                  rejectConfirmId,
                  "Rejected",
                  rejectionReasonInput.trim(),
                );
                setRejectConfirmId(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5 shadow-sm text-xs h-9 px-4"
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  বাতিল করা হচ্ছে...
                </>
              ) : (
                <>
                  <XCircle className="size-4" />
                  নিশ্চিত বাতিল করুন
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Viewer Modal */}
      <Dialog
        open={!!selectedRejectionReason}
        onOpenChange={(open) => !open && setSelectedRejectionReason(null)}
      >
        <DialogContent className="max-w-md border border-black/[0.08] bg-white/[0.90] backdrop-blur-xl rounded-2xl shadow-xl font-sans">
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
