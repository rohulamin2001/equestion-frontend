import {
  CATEGORIES_MAP,
  getCategoryDisplayName,
  isEnglishSubject,
} from "@/constants/categories";
import {
  ChevronDown,
  ChevronUp,
  FolderTree,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import CategoryStatsBreakdown from "./CategoryStatsBreakdown.jsx";
import FolderBreadcrumb from "./FolderBreadcrumb.jsx";
import FolderCard from "./FolderCard.jsx";

const getCategoryLabel = (cat) => {
  const found = CATEGORIES_MAP.find((c) => c.value === cat);
  return found ? found.label : cat;
};

export default function QuestionFolderExplorer({
  hierarchy,
  isInitiallyCollapsed = false,
}) {
  const [isCollapsed, setIsCollapsed] = useState(isInitiallyCollapsed);

  const {
    institutions,
    totalQuestions,
    isLoading,
    refetch,
    currentPath,
    currentLevel,
    selectedInstitution,
    selectedClass,
    selectedSubject,
    selectedChapter,
    breadcrumbs,
    selectInstitution,
    selectClass,
    selectSubject,
    selectChapter,
    selectCategory,
    navigateUp,
    resetToRoot,
    jumpTo,
  } = hierarchy;

  return (
    <div className="bg-glass-elevated border border-slate-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xs space-y-3 sm:space-y-4 font-bengali">
      {/* Explorer Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-[var(--purple-600)] to-[var(--purple-700)] text-white shadow-2xs shrink-0">
            <FolderTree className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs sm:text-base font-bold text-slate-800 tracking-tight font-sans truncate">
                প্রশ্ন ফোল্ডার এক্সপ্লোরার
              </h3>
              <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--purple-100)] text-[var(--purple-700)] shrink-0">
                মোট {totalQuestions?.toLocaleString("bn-BD")} টি
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal truncate hidden sm:block">
              প্রতিষ্ঠান, শ্রেণি, বিষয় ও অধ্যায়ভিত্তিক প্রশ্নের ড্রিল-ডাউন
              নেভিগেশন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-200/90 text-slate-600 hover:text-[var(--purple-700)] active:bg-slate-100 transition-colors cursor-pointer"
            title="পরিসংখ্যান রিফ্রেশ করুন"
            aria-label="পরিসংখ্যান রিফ্রেশ করুন"
          >
            <RefreshCw className="size-3.5 sm:size-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl border border-slate-200/90 bg-white active:bg-slate-50 text-slate-700 transition-colors text-[11px] sm:text-xs font-semibold cursor-pointer shadow-2xs"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="size-3.5 text-slate-400" />
                <span className="hidden xs:inline">খুলুন</span>
              </>
            ) : (
              <>
                <ChevronUp className="size-3.5 text-slate-400" />
                <span className="hidden xs:inline">সংকুচিত করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="space-y-3 sm:space-y-4 overflow-hidden pt-0.5"
          >
            {/* Breadcrumb Bar */}
            <FolderBreadcrumb
              breadcrumbs={breadcrumbs}
              onJump={jumpTo}
              onNavigateUp={navigateUp}
              onReset={resetToRoot}
              currentLevel={currentLevel}
            />

            {/* Loading State */}
            {isLoading && (
              <div className="min-h-[120px] sm:min-h-[160px] flex flex-col items-center justify-center gap-2 py-6">
                <Loader2 className="size-5 sm:size-6 animate-spin text-[var(--purple-600)]" />
                <p className="text-xs text-slate-500">
                  ফোল্ডার তথ্য লোড হচ্ছে...
                </p>
              </div>
            )}

            {/* Folder Grid Views (Highly Responsive: 1-col on mobile, multi-col on tablet/desktop) */}
            {!isLoading && (
              <AnimatePresence mode="wait">
                {/* Level 0: Institutions */}
                {currentLevel === 0 && (
                  <motion.div
                    key="level-0"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3"
                  >
                    {institutions.map((inst) => (
                      <FolderCard
                        key={inst.id}
                        title={inst.label}
                        subtitle={`${inst.classes?.length || 0}টি শ্রেণি যুক্ত আছে`}
                        count={inst.count}
                        level={0}
                        type={inst.id}
                        onClick={() => selectInstitution(inst)}
                      />
                    ))}
                    {institutions.length === 0 && (
                      <div className="col-span-full py-6 text-center text-xs text-slate-400">
                        এখনো কোনো প্রশ্ন তৈরি করা হয়নি।
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Level 1: Classes */}
                {currentLevel === 1 && selectedInstitution && (
                  <motion.div
                    key="level-1"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
                  >
                    {selectedInstitution.classes.map((cls) => (
                      <FolderCard
                        key={cls.id}
                        title={cls.label}
                        classId={cls.id}
                        subtitle={`${cls.subjects?.length || 0}টি বিষয়`}
                        count={cls.count}
                        level={1}
                        onClick={() => selectClass(cls)}
                      />
                    ))}
                    {selectedInstitution.classes.length === 0 && (
                      <div className="col-span-full py-6 text-center text-xs text-slate-400">
                        এই প্রতিষ্ঠানে কোনো ক্লাস বা প্রশ্ন নেই।
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Level 2: Subjects */}
                {currentLevel === 2 && selectedClass && (
                  <motion.div
                    key="level-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
                  >
                    {selectedClass.subjects.map((sub) => (
                      <FolderCard
                        key={sub.id}
                        title={sub.name}
                        code={sub.code}
                        subtitle={`${sub.chapters?.length || 0}টি অধ্যায় • ${sub.categories?.length || 0}টি ক্যাটাগরি`}
                        count={sub.count}
                        level={2}
                        onClick={() => selectSubject(sub)}
                      />
                    ))}
                    {selectedClass.subjects.length === 0 && (
                      <div className="col-span-full py-6 text-center text-xs text-slate-400">
                        এই ক্লাসে এখনো কোনো বিষয় যোগ করা হয়নি।
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Level 3: Chapters + Subject Category Breakdown */}
                {currentLevel === 3 && selectedSubject && (() => {
                  const isSubjectEnglish = isEnglishSubject(
                    selectedSubject.name || selectedSubject.subjectName,
                  );
                  const selectedCat = currentPath.category;
                  const selectedCatLabel = selectedCat
                    ? getCategoryDisplayName(selectedCat, isSubjectEnglish)
                    : null;
                  const selectedCatTotal = selectedCat
                    ? selectedSubject.categories?.find((c) => c.category === selectedCat)?.count || 0
                    : null;

                  return (
                    <motion.div
                      key="level-3"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.16 }}
                      className="space-y-4"
                    >
                      {/* 1. Subject-level Categories Breakdown */}
                      <CategoryStatsBreakdown
                        title={`${selectedSubject.name} - বিষয়ভিত্তিক সকল ক্যাটাগরি`}
                        subtitle="অনুমোদিত ক্যাটাগরিসমূহে মোট তৈরি করা প্রশ্ন সংখ্যা"
                        categories={selectedSubject.categories || []}
                        selectedCategory={currentPath.category}
                        onSelectCategory={selectCategory}
                        emptyMessage="এই বিষয়ে কোনো ক্যাটাগরি বরাদ্দ নেই।"
                        isEnglish={isSubjectEnglish}
                      />

                      {/* 2. Chapters Grid */}
                      <div className="space-y-2.5 pt-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                              অধ্যায়সমূহ (
                              {selectedSubject.chapters?.length?.toLocaleString(
                                "bn-BD",
                              ) || "০"}
                              টি)
                            </h4>
                            {selectedCat && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-[var(--purple-700)] border border-purple-200/70 animate-in fade-in duration-200">
                                <span>ক্যাটাগরি: {selectedCatLabel}</span>
                                <span className="font-bold">
                                  ({selectedCatTotal?.toLocaleString("bn-BD")}টি)
                                </span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-slate-400">
                            {selectedCat
                              ? "প্রতিটি অধ্যায়ের নির্দিষ্ট ক্যাটাগরির প্রশ্ন সংখ্যা"
                              : "নির্দিষ্ট অধ্যায়ের ক্যাটাগরি দেখতে ক্লিক করুন"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                          {selectedSubject.chapters.map((ch) => {
                            const catEntry = selectedCat
                              ? ch.categories?.find((c) => c.category === selectedCat)
                              : null;
                            const catCount = catEntry?.count || 0;
                            const count = selectedCat ? catCount : ch.count;
                            const subtitle = selectedCat
                              ? catCount > 0
                                ? `${selectedCatLabel}`
                                : `${selectedCatLabel} নেই`
                              : `${ch.categories?.length || 0}টি ক্যাটাগরির প্রশ্ন`;

                            return (
                              <FolderCard
                                key={ch.chapterNumber}
                                title={ch.chapterName}
                                subtitle={subtitle}
                                count={count}
                                level={3}
                                onClick={() => selectChapter(ch)}
                              />
                            );
                          })}
                        </div>

                        {selectedSubject.chapters.length === 0 && (
                          <div className="py-6 text-center text-xs text-slate-400">
                            এই বিষয়ে কোনো অধ্যায় বা সিলেবাস পাওয়া যায়নি।
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Level 4: Categories Breakdown for Chapter */}
                {currentLevel === 4 && selectedChapter && (
                  <motion.div
                    key="level-4"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                  >
                    <CategoryStatsBreakdown
                      chapterName={selectedChapter.chapterName}
                      categories={selectedChapter.categories || []}
                      selectedCategory={currentPath.category}
                      onSelectCategory={selectCategory}
                      isEnglish={isEnglishSubject(
                        selectedSubject?.name || selectedSubject?.subjectName,
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
