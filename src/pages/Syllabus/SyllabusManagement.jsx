import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Button,
  ModalCancelButton,
  ModalSubmitButton,
} from "@/components/ui/button";
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
import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/ui/ripple-button";
import {
  AlertCircle,
  Book,
  BookOpen,
  Calendar,
  ChevronDown,
  Edit,
  FolderPlus,
  Globe,
  GraduationCap,
  Hash,
  Layers,
  ListOrdered,
  Loader2,
  Plus,
  School,
  Tag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AcademicHierarchyGraph from "./components/AcademicHierarchyGraph";
import { useSyllabusManagement } from "./hook/useSyllabusManagement";

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

const getGroupLabel = (groupName) => {
  switch (groupName) {
    case "Science":
      return "বিজ্ঞান";
    case "Humanities":
      return "মানবিক";
    case "Commerce":
      return "ব্যবসায় শিক্ষা";
    default:
      return "";
  }
};

export default function SyllabusManagement() {
  const {
    selectedType,
    setSelectedType,
    selectedLevel,
    setSelectedLevel,
    selectedClass,
    setSelectedClass,
    allowedClasses,
    isModalOpen,
    setIsModalOpen,
    editingSyllabus,
    syllabusToDelete,
    setSyllabusToDelete,
    formType,
    setFormType,
    formLevel,
    setFormLevel,
    formClass,
    setFormClass,
    formSubject,
    setFormSubject,
    formSubjectId,
    setFormSubjectId,
    formSubjectCode,
    setFormSubjectCode,
    formSubjects,
    subjectsLoading,
    formGroup,
    setFormGroup,
    formYears,
    setFormYears,
    formVersion,
    setFormVersion,
    config,
    formChapters,
    formLoading,
    deletePending,
    syllabusList,
    loading,
    error,
    refetch,
    handleOpenAddModal,
    handleOpenEditModal,
    handleAddChapterField,
    handleRemoveChapterField,
    handleChapterFieldChange,
    handleSubmit,
    handleDelete,
  } = useSyllabusManagement();

  // Expanded subject tracking
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  // Modal dropdown states
  const [isFormTypeDropdownOpen, setIsFormTypeDropdownOpen] = useState(false);
  const [isFormLevelDropdownOpen, setIsFormLevelDropdownOpen] = useState(false);
  const [isFormClassDropdownOpen, setIsFormClassDropdownOpen] = useState(false);
  const [isFormSubjectDropdownOpen, setIsFormSubjectDropdownOpen] =
    useState(false);

  const toggleSubject = (id) => {
    setExpandedSubjectId((prev) => (prev === id ? null : id));
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    const levels = Array.from(
      new Set(
        allowedClasses.filter((c) => c.type === type).map((c) => c.level),
      ),
    );
    if (levels.length > 0) {
      const firstLevel = levels[0];
      setSelectedLevel(firstLevel);
      const classes = allowedClasses.filter(
        (c) => c.type === type && c.level === firstLevel,
      );
      if (classes.length > 0) {
        setSelectedClass(classes[0].value, type, firstLevel);
      }
    }
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    const classes = allowedClasses.filter(
      (c) => c.type === selectedType && c.level === level,
    );
    if (classes.length > 0) {
      setSelectedClass(classes[0].value, selectedType, level);
    }
  };

  const handleFormTypeChange = (type) => {
    setFormType(type);
    const levels = Array.from(
      new Set(
        allowedClasses.filter((c) => c.type === type).map((c) => c.level),
      ),
    );
    if (levels.length > 0) {
      const firstLevel = levels[0];
      setFormLevel(firstLevel);
      const classes = allowedClasses.filter(
        (c) => c.type === type && c.level === firstLevel,
      );
      if (classes.length > 0) {
        setFormClass(classes[0].value);
      }
    }
  };

  const handleFormLevelChange = (level) => {
    setFormLevel(level);
    const classes = allowedClasses.filter(
      (c) => c.type === formType && c.level === level,
    );
    if (classes.length > 0) {
      setFormClass(classes[0].value);
    }
  };

  const activeTypes = Array.from(new Set(allowedClasses.map((c) => c.type)));

  const currentClassLabel =
    allowedClasses.find(
      (c) =>
        c.value === selectedClass &&
        c.type === selectedType &&
        c.level === selectedLevel,
    )?.label || selectedClass;

  return (
    <div className="space-y-6 font-sans">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-glass p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <BookOpen className="size-6 text-primary" />
            <span>সিলেবাস ও টপিক ব্যবস্থাপনা</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            শ্রেণীভিত্তিক পরীক্ষার প্রশ্নের অধ্যায় ও সুনির্দিষ্ট টপিকসমূহ আগে
            থেকে প্রস্তুত করুন।
          </p>
        </div>
        <RippleButton
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white transition font-semibold shadow-md shadow-purple-200 cursor-pointer"
        >
          <FolderPlus className="size-[18px]" />
          <span>নতুন সিলেবাস যোগ করুন</span>
          <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
        </RippleButton>
      </div>

      {/* Classes Filter Bar (Academic Hierarchy Graph) */}
      <AcademicHierarchyGraph
        selectedType={selectedType}
        handleTypeChange={handleTypeChange}
        selectedLevel={selectedLevel}
        handleLevelChange={handleLevelChange}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        setExpandedSubjectId={setExpandedSubjectId}
        allowedClasses={allowedClasses}
        activeTypes={activeTypes}
      />

      {/* Main Content Area */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-glass rounded-2xl border shadow-sm p-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-slate-500 text-sm">
              {currentClassLabel}-এর সিলেবাস লোড হচ্ছে...
            </p>
          </div>
        ) : error ? (
          <div className="bg-glass rounded-2xl border shadow-sm p-16 text-center max-w-md mx-auto">
            <AlertCircle className="size-10 text-red-500 mb-3 mx-auto" />
            <p className="text-slate-800 font-semibold mb-1">
              সিলেবাস লোড করা যায়নি
            </p>
            <p className="text-slate-500 text-sm mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              আবার চেষ্টা করুন
            </Button>
          </div>
        ) : syllabusList.length === 0 ? (
          <div className="bg-glass rounded-2xl border shadow-sm p-16 text-center max-w-md mx-auto">
            <Book className="size-12 text-slate-400 mb-3 mx-auto" />
            <p className="text-slate-800 font-semibold mb-1">
              কোনো সিলেবাস পাওয়া যায়নি
            </p>
            <p className="text-slate-500 text-sm">
              {currentClassLabel}-এর জন্য কোনো সিলেবাস বা বিষয় এখন পর্যন্ত যুক্ত
              করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {syllabusList.map((subject) => {
              const isExpanded = expandedSubjectId === subject._id;
              return (
                <div
                  key={subject._id}
                  className="bg-glass border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:bg-white/[0.60]"
                >
                  {/* Subject Title Bar */}
                  <div
                    onClick={() => toggleSubject(subject._id)}
                    className="flex justify-between items-center px-6 py-5 cursor-pointer select-none hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl shrink-0 border border-purple-200/50">
                        <BookOpen className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-800 text-lg leading-tight">
                            {subject.subjectName}
                          </h3>
                          {(!config?.versions ||
                            config.versions.length > 1) && (
                            <span
                              className={`inline-flex items-center border text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                                subject.version === "English"
                                  ? "bg-purple-50 border-purple-200 text-purple-700"
                                  : "bg-purple-50 border-purple-200 text-purple-700"
                              }`}
                            >
                              {subject.version === "English"
                                ? "ইংরেজি"
                                : "বাংলা"}
                            </span>
                          )}
                          {subject.group && subject.group !== "General" && (
                            <span className="inline-flex items-center bg-purple-50 border border-purple-200/60 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                              {getGroupLabel(subject.group)}
                            </span>
                          )}
                          {subject.years && subject.years.length > 0 && (
                            <span className="inline-flex items-center bg-purple-50 border border-purple-200/60 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                              সাল: {subject.years.join(", ")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {subject.chapters?.length || 0} টি অধ্যায় সংযুক্ত
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="সম্পাদনা করুন"
                          onClick={() => handleOpenEditModal(subject)}
                          className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-purple-50 rounded-lg"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="মুছে ফেলুন"
                          onClick={() => setSyllabusToDelete(subject)}
                          className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <button
                        onClick={() => toggleSubject(subject._id)}
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <ChevronDown
                          className={`size-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Chapters List (Accordion Content) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="border-t border-black/[0.04] bg-black/[0.01]"
                      >
                        <div className="p-6 space-y-4">
                          {subject.chapters && subject.chapters.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {subject.chapters
                                .sort(
                                  (a, b) => a.chapterNumber - b.chapterNumber,
                                )
                                .map((chap) => (
                                  <div
                                    key={chap._id || chap.chapterNumber}
                                    className="bg-white/45 p-5 rounded-xl border border-slate-200/50 shadow-sm transition-all hover:bg-white/70 space-y-3"
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className="inline-flex items-center justify-center size-7 rounded-lg bg-primary/10 text-primary font-semibold text-xs shrink-0 mt-0.5">
                                        {chap.chapterNumber}
                                      </span>
                                      <h4 className="font-semibold text-slate-800 text-[15px] pt-0.5">
                                        {chap.chapterName}
                                      </h4>
                                    </div>

                                    <div className="pl-10 space-y-1.5">
                                      <span className="text-[12px] text-slate-400 uppercase tracking-wider block font-semibold">
                                        টপিকসমূহ:
                                      </span>
                                      {chap.topics && chap.topics.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                          {chap.topics.map((topic, ti) => (
                                            <span
                                              key={ti}
                                              className="inline-block bg-purple-50/60 border border-purple-100 text-purple-700 text-[11px] px-2.5 py-1 rounded-md font-semibold"
                                            >
                                              #{topic}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-slate-400 italic">
                                          কোনো টপিক সেট করা হয়নি
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="text-slate-400 text-sm text-center italic py-4">
                              কোনো অধ্যায় পাওয়া যায়নি।
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Syllabus Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open && !formLoading) {
            setIsModalOpen(false);
          }
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={!formLoading}
          onPointerDownOutside={(e) => {
            if (formLoading) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (formLoading) e.preventDefault();
          }}
          className="max-w-2xl p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans"
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full max-h-[85vh]"
          >
            <DialogHeader className="bg-transparent px-6 pt-6 pb-5 border-b border-black/[0.05] relative flex flex-col space-y-0 mb-0 text-left">
              <div className="flex items-start gap-4 pr-8">
                <div className="p-2.5 bg-purple-50 border border-purple-200/60 text-primary rounded-xl shrink-0 mt-0.5 shadow-sm">
                  <FolderPlus className="size-5" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="font-semibold text-slate-800 text-[17px] tracking-tight leading-snug">
                    {editingSyllabus
                      ? "সিলেবাস সংশোধন করুন"
                      : "নতুন সিলেবাস যোগ করুন"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-[13px] font-normal leading-relaxed">
                    শ্রেণী ও বিষয়ের অধীনে অধ্যায় এবং প্রতিটি অধ্যায়ের
                    সুনির্দিষ্ট টপিকসমূহ সাজিয়ে নিন।
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {/* Form cascading selectors for Type, Level, and Class */}
              {(() => {
                const formActiveTypes = Array.from(
                  new Set(allowedClasses.map((c) => c.type)),
                );
                const formActiveLevels = Array.from(
                  new Set(
                    allowedClasses
                      .filter((c) => c.type === formType)
                      .map((c) => c.level),
                  ),
                );
                const formActiveClasses = allowedClasses.filter(
                  (c) => c.type === formType && c.level === formLevel,
                );

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Type Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <School className="size-3.5 text-primary" />
                        <span>প্রতিষ্ঠান এর ধরণ (Type)</span>
                      </label>
                      <DropdownMenu
                        open={isFormTypeDropdownOpen}
                        onOpenChange={(open) => {
                          if (!formLoading && !editingSyllabus) {
                            setIsFormTypeDropdownOpen(open);
                          }
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            disabled={formLoading || !!editingSyllabus}
                            className="w-full px-4 border border-slate-200 rounded-xl text-sm bg-white hover:bg-slate-50/50 hover:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-primary transition-all duration-200 font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 disabled:pointer-events-none cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Book className="size-4 text-primary" />
                              {TYPE_LABELS[formType] || formType}
                            </span>
                            <ChevronDown
                              className={`size-4 text-slate-400 transition-transform duration-300 ${isFormTypeDropdownOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="start"
                          className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]"
                        >
                          {formActiveTypes.map((type) => {
                            const isSelected = formType === type;
                            return (
                              <DropdownMenuItem
                                key={type}
                                onSelect={() => handleFormTypeChange(type)}
                                className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-primary hover:bg-slate-50/80 group ${
                                  isSelected
                                    ? "bg-purple-50 text-primary"
                                    : "text-slate-700"
                                }`}
                              >
                                <span>{TYPE_LABELS[type] || type}</span>
                                {isSelected && (
                                  <span className="size-1.5 rounded-full bg-primary" />
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Level Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="size-3.5 text-primary" />
                        <span>শিক্ষার স্তর (Level)</span>
                      </label>
                      <DropdownMenu
                        open={isFormLevelDropdownOpen}
                        onOpenChange={(open) => {
                          if (!formLoading && !editingSyllabus) {
                            setIsFormLevelDropdownOpen(open);
                          }
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            disabled={formLoading || !!editingSyllabus}
                            className="w-full px-4 border border-slate-200 rounded-xl text-sm bg-white hover:bg-slate-50/50 hover:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-primary transition-all duration-200 font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 disabled:pointer-events-none cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Book className="size-4 text-primary" />
                              {LEVEL_LABELS[formLevel] || formLevel}
                            </span>
                            <ChevronDown
                              className={`size-4 text-slate-400 transition-transform duration-300 ${isFormLevelDropdownOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="start"
                          className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]"
                        >
                          {formActiveLevels.map((level) => {
                            const isSelected = formLevel === level;
                            return (
                              <DropdownMenuItem
                                key={level}
                                onSelect={() => handleFormLevelChange(level)}
                                className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-primary hover:bg-slate-50/80 group ${
                                  isSelected
                                    ? "bg-purple-50 text-primary"
                                    : "text-slate-700"
                                }`}
                              >
                                <span>{LEVEL_LABELS[level] || level}</span>
                                {isSelected && (
                                  <span className="size-1.5 rounded-full bg-primary" />
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Class Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="size-3.5 text-primary" />
                        <span>শ্রেণী নির্বাচন (Class)</span>
                      </label>
                      <DropdownMenu
                        open={isFormClassDropdownOpen}
                        onOpenChange={(open) => {
                          if (!formLoading && !editingSyllabus) {
                            setIsFormClassDropdownOpen(open);
                          }
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            disabled={formLoading || !!editingSyllabus}
                            className="w-full px-4 border border-slate-200 rounded-xl text-sm bg-white hover:bg-slate-50/50 hover:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-primary transition-all duration-200 font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 disabled:pointer-events-none cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Book className="size-4 text-primary" />
                              {formActiveClasses.find(
                                (c) => c.value === formClass,
                              )?.label || formClass}
                            </span>
                            <ChevronDown
                              className={`size-4 text-slate-400 transition-transform duration-300 ${isFormClassDropdownOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="start"
                          className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]"
                        >
                          {formActiveClasses.map((cls) => {
                            const isSelected = formClass === cls.value;
                            return (
                              <DropdownMenuItem
                                key={cls.value}
                                onSelect={() => setFormClass(cls.value)}
                                className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-primary hover:bg-slate-50/80 group ${
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

                    {/* Version Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="size-3.5 text-primary" />
                        <span>
                          ভার্সন (Version){" "}
                          <span className="text-primary">*</span>
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "Bangla", label: "বাংলা" },
                          { value: "English", label: "ইংরেজি" },
                          { value: "Madrasah", label: "মাদ্রাসা" },
                        ]
                          .filter((ver) => {
                            if (
                              config?.versions &&
                              !config.versions.includes(ver.value)
                            ) {
                              return false;
                            }
                            if (formType === "Madrasah") {
                              return ver.value === "Madrasah";
                            } else {
                              return ver.value !== "Madrasah";
                            }
                          })
                          .map((ver) => {
                            const isSelected = formVersion === ver.value;
                            return (
                              <label
                                key={ver.value}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold select-none transition-all duration-200 h-11 ${
                                  editingSyllabus
                                    ? "pointer-events-none"
                                    : "cursor-pointer"
                                } ${
                                  isSelected
                                    ? "bg-primary border-primary text-white shadow-md shadow-purple-200"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:text-primary"
                                } ${
                                  editingSyllabus && !isSelected
                                    ? "opacity-50"
                                    : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="formVersion"
                                  checked={isSelected}
                                  onChange={() => setFormVersion(ver.value)}
                                  disabled={formLoading || !!editingSyllabus}
                                  className="sr-only"
                                />
                                {ver.label}
                              </label>
                            );
                          })}
                      </div>
                    </div>

                    {/* Subject Selection Dropdown */}
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="size-3.5 text-primary" />
                        <span>বিষয় নির্বাচন (Subject)</span>
                      </label>
                      <DropdownMenu
                        open={isFormSubjectDropdownOpen}
                        onOpenChange={(open) => {
                          if (!formLoading && !editingSyllabus) {
                            setIsFormSubjectDropdownOpen(open);
                          }
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            disabled={
                              formLoading ||
                              !!editingSyllabus ||
                              subjectsLoading
                            }
                            className="w-full px-4 border border-slate-200 rounded-xl text-sm bg-white hover:bg-slate-50/50 hover:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-primary transition-all duration-200 font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 disabled:pointer-events-none cursor-pointer text-left"
                          >
                            <span className="flex items-center gap-2">
                              <BookOpen className="size-4 text-primary" />
                              {subjectsLoading ? (
                                <span className="flex items-center gap-1.5">
                                  <Loader2 className="size-3 animate-spin text-primary" />{" "}
                                  লোড হচ্ছে...
                                </span>
                              ) : formSubject ? (
                                formSubject
                              ) : (
                                "বিষয় নির্বাচন করুন"
                              )}
                            </span>
                            <ChevronDown
                              className={`size-4 text-slate-400 transition-transform duration-300 ${isFormSubjectDropdownOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="start"
                          className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] max-h-[220px] overflow-y-auto"
                        >
                          {formSubjects.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center py-2.5">
                              কোনো বিষয় পাওয়া যায়নি। প্রথমে সাবজেক্ট সেটআপ করুন।
                            </p>
                          ) : (
                            formSubjects.map((sub) => {
                              const isSelected = formSubjectId === sub._id;
                              return (
                                <DropdownMenuItem
                                  key={sub._id}
                                  onSelect={() => {
                                    setFormSubject(sub.subjectName);
                                    setFormSubjectId(sub._id);
                                    setFormSubjectCode(sub.subjectCode);
                                    setFormGroup(sub.group || "General");
                                    if (sub.years && sub.years.length > 0) {
                                      setFormYears(sub.years);
                                    }
                                  }}
                                  className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-primary hover:bg-slate-50/80 group ${
                                    isSelected
                                      ? "bg-purple-50 text-primary"
                                      : "text-slate-700"
                                  }`}
                                >
                                  <span>{sub.subjectName}</span>
                                  {isSelected && (
                                    <span className="size-1.5 rounded-full bg-primary" />
                                  )}
                                </DropdownMenuItem>
                              );
                            })
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })()}

              {/* Selected Subject info preview */}
              {formSubject && (
                <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-slate-500 flex items-center gap-1 uppercase text-[10px] tracking-wider mb-1.5">
                      <Hash className="size-3 text-slate-400" />
                      <span>বিষয় কোড</span>
                    </span>
                    <span className="text-slate-800 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block font-mono">
                      {formSubjectCode || "কোড নেই"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 flex items-center gap-1 uppercase text-[10px] tracking-wider mb-1.5">
                      <Layers className="size-3 text-primary" />
                      <span>বিভাগ / গ্রুপ</span>
                    </span>
                    <span className="text-purple-700 font-semibold bg-purple-50 border border-purple-200/60 px-2.5 py-1 rounded-lg inline-block">
                      {getGroupLabel(formGroup) || "সাধারণ"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 flex items-center gap-1 uppercase text-[10px] tracking-wider mb-1.5">
                      <Calendar className="size-3 text-primary" />
                      <span>সক্রিয় শিক্ষাবর্ষ</span>
                    </span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {formYears.map((yr) => (
                        <span
                          key={yr}
                          className="bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded border border-purple-100"
                        >
                          {yr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chapters Dynamic Fields */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                  <h4 className="font-semibold text-slate-800 text-base flex items-center gap-2">
                    <ListOrdered className="size-5 text-primary" />
                    <span>অধ্যায় ও টপিকসমূহ</span>
                  </h4>
                  <RippleButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddChapterField}
                    disabled={formLoading}
                    className="flex items-center gap-2 text-primary hover:bg-purple-50 active:scale-95 rounded-xl border border-purple-200 hover:border-purple-400 transition-all py-2 px-3.5 text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    <Plus className="size-4" />
                    <span>অধ্যায় যোগ করুন</span>
                    <RippleButtonRipples color="rgba(144, 14, 176, 0.12)" />
                  </RippleButton>
                </div>

                <div className="space-y-5 max-h-[38vh] overflow-y-auto pr-1">
                  {formChapters.map((chap, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-2xl border border-slate-200 border-l-4 border-l-primary bg-slate-50/50 hover:bg-white hover:border-purple-200 hover:shadow-md transition-all duration-300 space-y-4 relative group shadow-sm"
                    >
                      {/* Chapter Header Bar */}
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center rounded-full px-1.5 pt-0.5 size-6 bg-purple-100 text-purple-700 font-semibold text-xs">
                            {chap.chapterNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            অধ্যায় বিবরণ
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveChapterField(index)}
                          disabled={formLoading}
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all duration-200 border border-slate-200 shadow-sm flex items-center justify-center"
                          title="অধ্যায়টি মুছুন"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-3 sm:col-span-2.5">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                            অধ্যায় নং
                          </label>
                          <Input
                            required
                            type="number"
                            value={chap.chapterNumber}
                            onChange={(e) =>
                              handleChapterFieldChange(
                                index,
                                "chapterNumber",
                                e.target.value,
                              )
                            }
                            disabled={formLoading}
                            className="text-center rounded-xl border border-slate-200 h-10 focus-visible:ring-purple-100 focus-visible:border-primary font-semibold text-slate-700 bg-white hover:border-slate-300 shadow-sm focus:bg-white"
                          />
                        </div>
                        <div className="col-span-9 sm:col-span-9.5">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                            অধ্যায়ের নাম (Chapter Name)
                          </label>
                          <Input
                            required
                            placeholder="যেমন: বাস্তব সংখ্যা বা প্রথম অধ্যায়"
                            value={chap.chapterName}
                            onChange={(e) =>
                              handleChapterFieldChange(
                                index,
                                "chapterName",
                                e.target.value,
                              )
                            }
                            disabled={formLoading}
                            className="rounded-xl border border-slate-200 h-10 px-4 focus-visible:ring-purple-100 focus-visible:border-primary font-semibold text-slate-700 bg-white hover:border-slate-300 shadow-sm focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          টপিকসমূহ (Topics - কমা দিয়ে আলাদা করুন)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="যেমন: সংখ্যার তুলনা, ক্রমবাচক সংখ্যা, ভগ্নাংশ"
                          value={chap.topicsString}
                          onChange={(e) =>
                            handleChapterFieldChange(
                              index,
                              "topicsString",
                              e.target.value,
                            )
                          }
                          disabled={formLoading}
                          className="w-full border border-slate-200 rounded-xl text-sm p-3 focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-primary font-semibold text-slate-700 placeholder-slate-400 hover:border-slate-300 transition-all resize-none bg-white shadow-sm"
                        />

                        {/* Real-time Tags Preview */}
                        {chap.topicsString && (
                          <div className="space-y-1.5 pt-2 border-t border-slate-200/40 mt-1">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                              টপিক ট্যাগ প্রিভিউ:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {chap.topicsString.split(",").map((t, ti) => {
                                const trimmed = t.trim();
                                if (!trimmed) return null;
                                return (
                                  <span
                                    key={ti}
                                    className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 font-semibold text-xs px-2.5 py-1 rounded-lg border border-purple-100 transition-all duration-200 cursor-default shadow-sm"
                                  >
                                    #{trimmed}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="bg-slate-50/70 px-6 py-3.5 border-t border-slate-100/85 flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-0">
              <DialogClose asChild>
                <ModalCancelButton disabled={formLoading}>
                  বাতিল করুন
                </ModalCancelButton>
              </DialogClose>
              <ModalSubmitButton type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : (
                  "সংরক্ষণ করুন"
                )}
              </ModalSubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!syllabusToDelete}
        onOpenChange={(open) => {
          if (!open && !deletePending) {
            setSyllabusToDelete(null);
          }
        }}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-3">
              <Trash2 className="h-6 w-6 text-red-600 animate-bounce" />
            </div>
            <AlertDialogTitle className="text-center font-semibold text-slate-900 text-base">
              আপনি কি নিশ্চিত?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-500 text-xs mt-1.5 leading-relaxed">
              আপনি কি নিশ্চিত যে আপনি{" "}
              <strong>
                {syllabusToDelete?.subjectName} ({currentClassLabel})
              </strong>{" "}
              বিষয়ের সম্পূর্ণ সিলেবাসটি স্থায়ীভাবে মুছে ফেলতে চান? এটি আর
              পুনরুদ্ধার করা যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="w-full sm:w-auto text-xs"
              disabled={deletePending}
              onClick={() => {
                if (!deletePending) {
                  setSyllabusToDelete(null);
                }
              }}
            >
              না, বাতিল করুন
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-2"
              disabled={deletePending}
              onClick={async (e) => {
                e.preventDefault();
                if (syllabusToDelete) {
                  try {
                    await handleDelete();
                  } catch {
                    // Handled in mutation
                  }
                }
              }}
            >
              {deletePending ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  মুছে ফেলা হচ্ছে...
                </>
              ) : (
                "হ্যাঁ, মুছে ফেলুন"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}
