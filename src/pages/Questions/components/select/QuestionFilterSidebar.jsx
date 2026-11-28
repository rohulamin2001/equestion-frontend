import { getCategoryDisplayName } from "@/constants/categories";
import { CLASSES_MAP } from "@/constants/classes";
import {
  ArrowDown,
  ArrowDownWideNarrow,
  ArrowUp,
  ArrowUpNarrowWide,
  Award,
  BookOpen,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Copy,
  Filter,
  Hash,
  Image as ImageIcon,
  Layers,
  ListOrdered,
  RotateCcw,
  School,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  COGNITIVE_LEVEL_LABELS,
  DIFFICULTY_BADGES,
  MCQ_TYPE_LABELS,
  extractQuestionMetadata,
  getQuestionMarks,
  toBnNumber,
} from "../../utils/questionUtils";

function stripHtmlSummary(html = "") {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<img[^>]*>/gi, " [চিত্র] ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getQuestionHeadline(q) {
  if (!q) return "";
  if (q.category === "MCQ") {
    return stripHtmlSummary(q.mcqData?.questionText || q.mcqData?.stem || "");
  }
  if (q.category === "Creative") {
    return stripHtmlSummary(q.creativeData?.stem || "");
  }
  return stripHtmlSummary(
    q.generalData?.questionText || q.generalData?.stem || "",
  );
}

/**
 * Shared accordion wrapper preventing duplicate section header markup across filters.
 */
function FilterAccordionSection({
  title,
  icon: Icon,
  badgeCount = 0,
  defaultOpen = true,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200/80 rounded-2xl bg-white/75 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-purple-50/40 transition cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          {Icon && <Icon className="size-3.5 text-[#900EB0] shrink-0" />}
          <span>{title}</span>
          {badgeCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#900EB0] text-white text-[10px] font-bold">
              {toBnNumber(badgeCount)}
            </span>
          )}
        </div>
        <ChevronDown
          className={`size-3.5 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-[#900EB0]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 space-y-2.5">
          {children}
        </div>
      )}
    </div>
  );
}

function toggleArrayItem(setter, value) {
  setter((prev) =>
    prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
  );
}

/**
 * Sticky Right Sidebar featuring:
 *  - Tab 1: Complete server-side Metadata & Special Keyword Filters
 *  - Tab 2: Focused Question Full Metadata Inspector & Selected Questions Cart/Reorder
 */
export default function QuestionFilterSidebar({
  className = "",
  activeTab,
  onChangeTab,
  activeSet,
  searchKeyword,
  setSearchKeyword,
  sortOrder,
  setSortOrder,
  uniqueMode,
  setUniqueMode,
  selectedChapters,
  setSelectedChapters,
  setChapterNumbers,
  selectedTopics,
  setSelectedTopics,
  selectedDifficulties,
  setSelectedDifficulties,
  selectedLevels,
  setSelectedLevels,
  selectedBoards,
  setSelectedBoards,
  selectedYears,
  setSelectedYears,
  selectedSchools,
  setSelectedSchools,
  selectedTags,
  setSelectedTags,
  selectedMcqTypes,
  setSelectedMcqTypes,
  selectedCategories,
  setSelectedCategories,
  hasImageOnly,
  setHasImageOnly,
  resetAllFilters,
  metadataOptions,
  availableChapters,
  availableTopics,
  allowedSubjectCategories,
  totalBankCount,
  selectedQuestions,
  inspectedQuestion,
  onReorderSelected,
  onRemoveSelected,
  onClearSelected,
  onInspectQuestion,
  onQuickTagFilter,
}) {
  const [schoolSearch, setSchoolSearch] = useState("");
  const [specialTagSearch, setSpecialTagSearch] = useState("");

  const activeFilterCount =
    (searchKeyword ? 1 : 0) +
    (uniqueMode ? 1 : 0) +
    selectedTopics.length +
    selectedDifficulties.length +
    selectedLevels.length +
    selectedBoards.length +
    selectedYears.length +
    selectedSchools.length +
    selectedTags.length +
    selectedMcqTypes.length +
    selectedCategories.length +
    (hasImageOnly ? 1 : 0);

  const isCombinedSet = activeSet?.category === "Combined";
  const showMcqSubFilters =
    activeSet?.category === "MCQ" ||
    isCombinedSet ||
    selectedCategories.includes("MCQ");

  const filteredSchools = useMemo(() => {
    const q = schoolSearch.trim().toLowerCase();
    const list = metadataOptions?.schools || [];
    if (!q) return list;
    return list.filter((s) => s.name?.toLowerCase().includes(q));
  }, [metadataOptions?.schools, schoolSearch]);

  const mergedSpecialTags = useMemo(() => {
    const dynamicNames = (metadataOptions?.specialSearches || []).map(
      (s) => s.name,
    );
    const merged = ["Exercise", ...dynamicNames];
    return Array.from(new Set(merged));
  }, [metadataOptions?.specialSearches]);

  const filteredSpecialTags = useMemo(() => {
    const q = specialTagSearch.trim().toLowerCase();
    if (!q) return mergedSpecialTags;
    return mergedSpecialTags.filter((t) => t.toLowerCase().includes(q));
  }, [mergedSpecialTags, specialTagSearch]);

  const mergedLevels = useMemo(() => {
    const dynamicNames = (metadataOptions?.levels || []).map((l) => l.name);
    const cognitiveKeys = Object.keys(COGNITIVE_LEVEL_LABELS);
    return Array.from(new Set([...dynamicNames, ...cognitiveKeys]));
  }, [metadataOptions?.levels]);

  const inspectedMeta = useMemo(
    () =>
      inspectedQuestion
        ? extractQuestionMetadata(inspectedQuestion, availableChapters)
        : null,
    [inspectedQuestion, availableChapters],
  );

  const selectedMarksTotal = useMemo(
    () => selectedQuestions.reduce((sum, q) => sum + getQuestionMarks(q), 0),
    [selectedQuestions],
  );

  return (
    <aside
      className={`w-full lg:w-[350px] xl:w-[390px] 2xl:w-[410px] lg:shrink-0 lg:h-full font-bengali ${className}`}
    >
      <div className="bg-white/95 lg:bg-white/90 backdrop-blur-xl border border-purple-200/70 lg:border-y-0 lg:border-r-0 lg:border-l lg:border-black/[0.07] rounded-3xl lg:rounded-none shadow-sm lg:shadow-none overflow-hidden flex flex-col lg:h-full">
        {/* Dual Tab Switcher */}
        <div className="p-2 bg-purple-50/70 border-b border-purple-100 grid grid-cols-2 gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onChangeTab("filters")}
            className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "filters"
                ? "bg-white text-[#720A7B] shadow-sm border border-purple-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Filter className="size-3.5" />
            <span>ফিল্টার ও কীওয়ার্ড</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#900EB0] text-white text-[10px]">
                {toBnNumber(activeFilterCount)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onChangeTab("inspector")}
            className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "inspector"
                ? "bg-white text-[#720A7B] shadow-sm border border-purple-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ListOrdered className="size-3.5" />
            <span>নির্বাচিত ও মেটাডাটা</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-[#720A7B] text-[10px]">
              {toBnNumber(selectedQuestions.length)}
            </span>
          </button>
        </div>

        {/* Scrollable Panel Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
          {activeTab === "filters" ? (
            <>
              {/* Search & Sort Row */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="প্রশ্ন, টপিক, কীওয়ার্ড বা #ID..."
                    className="w-full pl-9 pr-8 h-10 bg-white border border-slate-200 focus:border-[#900EB0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-3 focus:ring-purple-100 transition-all"
                  />
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={() => setSearchKeyword("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold">
                    পাওয়া গেছে:{" "}
                    <strong className="text-slate-800">
                      {toBnNumber(totalBankCount)} টি
                    </strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-600 font-semibold cursor-pointer transition"
                    >
                      {sortOrder === "desc" ? (
                        <ArrowDownWideNarrow className="size-3 text-[#900EB0]" />
                      ) : (
                        <ArrowUpNarrowWide className="size-3 text-[#900EB0]" />
                      )}
                      <span>{sortOrder === "desc" ? "নতুন আগে" : "পুরনো আগে"}</span>
                    </button>

                    {(activeFilterCount > 0 ||
                      selectedChapters.length !== setChapterNumbers.length) && (
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 cursor-pointer transition"
                      >
                        <RotateCcw className="size-3" />
                        <span>রিসেট</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Unique Mode Card */}
              <div className="border border-purple-200/60 bg-purple-50/40 p-3 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-[#900EB0]" />
                    ইউনিক মোড
                  </span>
                  <button
                    type="button"
                    onClick={() => setUniqueMode((v) => !v)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      uniqueMode ? "bg-[#900EB0]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                        uniqueMode ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  আপনার আগের তৈরি প্রশ্নসেটগুলোতে ব্যবহৃত প্রশ্ন বাদ দিয়ে শুধুমাত্র
                  নতুন প্রশ্ন দেখাবে।
                </p>
              </div>

              {/* Chapters & Syllabus Topics */}
              <FilterAccordionSection
                title="অধ্যায় ও টপিক"
                icon={BookOpen}
                badgeCount={selectedChapters.length + selectedTopics.length}
                defaultOpen={true}
              >
                <div className="flex items-center justify-between gap-2 pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedChapters([])}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer transition ${
                      selectedChapters.length === 0
                        ? "bg-[#900EB0] text-white border-[#900EB0]"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    সব অধ্যায়
                  </button>
                  {setChapterNumbers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedChapters(setChapterNumbers)}
                      className="text-[11px] font-bold text-[#720A7B] hover:underline cursor-pointer"
                    >
                      সেটের নির্ধারিত অধ্যায় ({toBnNumber(setChapterNumbers.length)})
                    </button>
                  )}
                </div>

                {availableChapters.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">
                    এই বিষয়ের কোনো অধ্যায় সিলেবাসে যুক্ত নেই।
                  </p>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {availableChapters.map((chap) => {
                      const num = Number(chap.chapterNumber);
                      const checked = selectedChapters.includes(num);
                      const isInSet = setChapterNumbers.includes(num);
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => toggleArrayItem(setSelectedChapters, num)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer transition ${
                            checked
                              ? "bg-[#900EB0]/10 border-[#900EB0]/35 text-[#720A7B]"
                              : "bg-slate-50/70 border-slate-200/70 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span className="truncate">
                            অধ্যায় {toBnNumber(num)}: {chap.chapterName}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            {isInSet && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                                সেট
                              </span>
                            )}
                            {checked && (
                              <Check className="size-3.5 text-[#900EB0]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {availableTopics.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Hash className="size-3 text-[#900EB0]" />
                      টপিকসমূহ
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                      {availableTopics.map((topic) => {
                        const checked = selectedTopics.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => toggleArrayItem(setSelectedTopics, topic)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition ${
                              checked
                                ? "bg-[#900EB0] text-white border-[#900EB0]"
                                : "bg-purple-50/60 text-[#720A7B] border-purple-200/70 hover:bg-purple-100"
                            }`}
                          >
                            #{topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </FilterAccordionSection>

              {/* Category (for Combined sets) + Structural Type Flags */}
              {(isCombinedSet || showMcqSubFilters) && (
                <FilterAccordionSection
                  title="প্রশ্নের ধরণ ও কাঠামো"
                  icon={Layers}
                  badgeCount={
                    selectedCategories.length +
                    selectedMcqTypes.length +
                    (hasImageOnly ? 1 : 0)
                  }
                  defaultOpen={true}
                >
                  {isCombinedSet && allowedSubjectCategories.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 block">
                        ক্যাটাগরি নির্বাচন
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {allowedSubjectCategories.map((cat) => {
                          const checked = selectedCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() =>
                                toggleArrayItem(setSelectedCategories, cat)
                              }
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition ${
                                checked
                                  ? "bg-[#900EB0] text-white border-[#900EB0]"
                                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {getCategoryDisplayName(cat, activeSet?.subjectName)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {showMcqSubFilters && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 block">
                        MCQ প্রকারভেদ
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(MCQ_TYPE_LABELS).map(([val, label]) => {
                          const checked = selectedMcqTypes.includes(val);
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() =>
                                toggleArrayItem(setSelectedMcqTypes, val)
                              }
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition ${
                                checked
                                  ? "bg-[#900EB0] text-white border-[#900EB0]"
                                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setHasImageOnly((v) => !v)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition ${
                      hasImageOnly
                        ? "bg-[#900EB0]/10 border-[#900EB0]/40 text-[#720A7B]"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="size-3.5" />
                      শুধুমাত্র চিত্রযুক্ত প্রশ্ন
                    </span>
                    {hasImageOnly && <Check className="size-3.5 text-[#900EB0]" />}
                  </button>
                </FilterAccordionSection>
              )}

              {/* Special Search Dynamic Keywords */}
              <FilterAccordionSection
                title="প্রশ্নব্যাংক স্পেশাল সার্চ ও কীওয়ার্ড"
                icon={Tag}
                badgeCount={selectedTags.length}
                defaultOpen={true}
              >
                {mergedSpecialTags.length > 6 && (
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={specialTagSearch}
                      onChange={(e) => setSpecialTagSearch(e.target.value)}
                      placeholder="স্পেশাল কীওয়ার্ড খুঁজুন..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-[#900EB0]"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
                  {filteredSpecialTags.map((tagName) => {
                    const checked = selectedTags.includes(tagName);
                    const displayLabel =
                      tagName === "Exercise" ? "অনুশীলনী (Exercise)" : tagName;
                    return (
                      <button
                        key={tagName}
                        type="button"
                        onClick={() => toggleArrayItem(setSelectedTags, tagName)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition ${
                          checked
                            ? "bg-[#900EB0] text-white border-[#900EB0] shadow-2xs"
                            : "bg-violet-50/70 text-violet-800 border-violet-200/80 hover:bg-violet-100"
                        }`}
                      >
                        {checked ? `✓ ${displayLabel}` : displayLabel}
                      </button>
                    );
                  })}
                </div>
              </FilterAccordionSection>

              {/* Difficulty & Level */}
              <FilterAccordionSection
                title="কাঠিন্য ও লেভেল"
                icon={Award}
                badgeCount={
                  selectedDifficulties.length + selectedLevels.length
                }
                defaultOpen={false}
              >
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    কাঠিন্যের স্তর
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.entries(DIFFICULTY_BADGES).map(([key, cfg]) => {
                      const checked = selectedDifficulties.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            toggleArrayItem(setSelectedDifficulties, key)
                          }
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border cursor-pointer transition ${
                            checked
                              ? `${cfg.className} ring-2 ring-[#900EB0]/30`
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {mergedLevels.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      লেভেল (মেটাডাটা / কগনিটিভ)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mergedLevels.map((lvl) => {
                        const checked = selectedLevels.includes(lvl);
                        const label = COGNITIVE_LEVEL_LABELS[lvl] || lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() =>
                              toggleArrayItem(setSelectedLevels, lvl)
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition ${
                              checked
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-indigo-50/60 text-indigo-800 border-indigo-200/70 hover:bg-indigo-100"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </FilterAccordionSection>

              {/* Board & Year */}
              <FilterAccordionSection
                title="বোর্ড ও পরীক্ষার সাল"
                icon={Calendar}
                badgeCount={selectedBoards.length + selectedYears.length}
                defaultOpen={false}
              >
                {(metadataOptions?.boards || []).length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      শিক্ষা বোর্ড
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                      {metadataOptions.boards.map((bd) => {
                        const checked = selectedBoards.includes(bd.name);
                        return (
                          <button
                            key={bd._id}
                            type="button"
                            onClick={() =>
                              toggleArrayItem(setSelectedBoards, bd.name)
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition ${
                              checked
                                ? "bg-[#900EB0] text-white border-[#900EB0]"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {bd.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(metadataOptions?.years || []).length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      পরীক্ষার সাল
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {metadataOptions.years.map((yr) => {
                        const checked = selectedYears.includes(yr.name);
                        return (
                          <button
                            key={yr._id}
                            type="button"
                            onClick={() =>
                              toggleArrayItem(setSelectedYears, yr.name)
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition ${
                              checked
                                ? "bg-[#900EB0] text-white border-[#900EB0]"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {yr.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </FilterAccordionSection>

              {/* Schools */}
              {(metadataOptions?.schools || []).length > 0 && (
                <FilterAccordionSection
                  title="শীর্ষস্থানীয় স্কুল"
                  icon={School}
                  badgeCount={selectedSchools.length}
                  defaultOpen={false}
                >
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={schoolSearch}
                      onChange={(e) => setSchoolSearch(e.target.value)}
                      placeholder="স্কুলের নাম খুঁজুন..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-[#900EB0]"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {filteredSchools.map((sch) => {
                      const checked = selectedSchools.includes(sch.name);
                      return (
                        <button
                          key={sch._id}
                          type="button"
                          onClick={() =>
                            toggleArrayItem(setSelectedSchools, sch.name)
                          }
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer transition ${
                            checked
                              ? "bg-sky-50 border-sky-300 text-sky-900"
                              : "bg-white border-slate-200/70 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{sch.name}</span>
                          {checked && (
                            <Check className="size-3.5 text-sky-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </FilterAccordionSection>
              )}
            </>
          ) : (
            /* TAB 2: Inspected Question Full Metadata & Selected Cart Queue */
            <div className="space-y-4">
              {/* Inspected Question Full Authoring Metadata */}
              <div className="border border-purple-200/80 bg-gradient-to-br from-purple-50/60 via-white to-white rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-2">
                  <span className="text-xs font-bold text-[#720A7B] flex items-center gap-1.5">
                    <Tag className="size-3.5" />
                    প্রশ্নের পূর্ণ মেটাডাটা ও কীওয়ার্ড
                  </span>
                  {inspectedMeta?.uid && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(inspectedMeta.uid);
                        toast.success(`#${inspectedMeta.uid} কপি করা হয়েছে`);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-[#720A7B] text-[10px] font-mono font-bold cursor-pointer hover:bg-purple-200 transition"
                    >
                      <Copy className="size-2.5" />#{inspectedMeta.uid}
                    </button>
                  )}
                </div>

                {!inspectedQuestion || !inspectedMeta ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    বাম পাশের যেকোনো প্রশ্নের{" "}
                    <strong className="text-slate-600">“মেটাডাটা”</strong>{" "}
                    বাটনে ক্লিক করলে এখানে তার সব কীওয়ার্ড, বোর্ড, সাল ও স্কুল
                    দেখাবে।
                  </p>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    <p className="text-slate-700 font-semibold line-clamp-2 leading-snug bg-slate-50 px-2.5 py-2 rounded-xl border border-slate-200/70">
                      {getQuestionHeadline(inspectedQuestion) ||
                        "নির্বাচিত প্রশ্ন"}
                    </p>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
                        <span className="text-slate-400 block text-[10px]">
                          শ্রেণি ও অধ্যায়
                        </span>
                        <strong className="text-slate-800">
                          {CLASSES_MAP.find(
                            (c) => c.value === inspectedQuestion.className,
                          )?.label || inspectedQuestion.className}{" "}
                          • অধ্যায় {toBnNumber(inspectedQuestion.chapterNumber)}
                        </strong>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
                        <span className="text-slate-400 block text-[10px]">
                          নম্বর ও কাঠিন্য
                        </span>
                        <strong className="text-slate-800">
                          {toBnNumber(inspectedMeta.marks)} নম্বর •{" "}
                          {inspectedMeta.difficultyMeta.label}
                        </strong>
                      </div>
                    </div>

                    {inspectedMeta.chapterName && (
                      <div className="text-[11px] text-slate-600">
                        <span className="font-bold text-slate-500">অধ্যায়: </span>
                        {inspectedMeta.chapterName}
                      </div>
                    )}

                    {inspectedMeta.levelLabel && (
                      <div className="text-[11px]">
                        <span className="font-bold text-slate-500">লেভেল: </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                          {inspectedMeta.levelLabel}
                        </span>
                      </div>
                    )}

                    {inspectedMeta.boardYearPairs.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          বোর্ড ও সাল ইতিহাস
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {inspectedMeta.boardYearPairs.map((by, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold"
                            >
                              {by}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {inspectedMeta.schools.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          শীর্ষস্থানীয় স্কুল
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {inspectedMeta.schools.map((sch, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => onQuickTagFilter?.("school", sch)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-semibold hover:bg-sky-100 cursor-pointer"
                            >
                              <Building2 className="size-3" />
                              {sch}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {inspectedMeta.topics.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          টপিকসমূহ (ক্লিক করে ফিল্টার করুন)
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {inspectedMeta.topics.map((tp, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => onQuickTagFilter?.("topic", tp)}
                              className="px-2 py-0.5 rounded-md bg-[#900EB0]/10 text-[#720A7B] border border-[#900EB0]/20 text-[11px] font-semibold hover:bg-[#900EB0]/20 cursor-pointer"
                            >
                              #{tp}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {inspectedMeta.specialSearches.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          স্পেশাল সার্চ কীওয়ার্ড (ক্লিক করে ফিল্টার করুন)
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {inspectedMeta.specialSearches.map((tag, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => onQuickTagFilter?.("special", tag)}
                              className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-800 border border-violet-200 text-[11px] font-semibold hover:bg-violet-100 cursor-pointer"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Questions Queue & Re-order */}
              <div className="border border-slate-200/80 rounded-2xl bg-white p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      নির্বাচিত প্রশ্নের ক্রম ({toBnNumber(selectedQuestions.length)} টি)
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      মোট নম্বর: {toBnNumber(selectedMarksTotal)}
                    </span>
                  </div>
                  {selectedQuestions.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearSelected}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold hover:bg-rose-100 cursor-pointer"
                    >
                      <Trash2 className="size-3" />
                      সব বাদ
                    </button>
                  )}
                </div>

                {selectedQuestions.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-5">
                    এখনো কোনো প্রশ্ন নির্বাচন করা হয়নি।
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {selectedQuestions.map((sq, idx) => {
                      const sqId = sq._id || sq;
                      const headline = getQuestionHeadline(sq);
                      return (
                        <div
                          key={sqId}
                          onClick={() => typeof sq === "object" && onInspectQuestion(sq)}
                          className="p-2 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-purple-50/40 flex items-center gap-2 text-xs cursor-pointer transition"
                        >
                          <span className="size-5 rounded-md bg-purple-100 text-[#720A7B] font-bold text-[11px] flex items-center justify-center shrink-0">
                            {toBnNumber(idx + 1)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-semibold text-slate-700 text-[11px]">
                              {headline || `প্রশ্ন #${idx + 1}`}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {toBnNumber(getQuestionMarks(sq))} নম্বর
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                onReorderSelected(idx, idx - 1);
                              }}
                              className="p-1 rounded hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                              title="উপরে তুলুন"
                            >
                              <ArrowUp className="size-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === selectedQuestions.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                onReorderSelected(idx, idx + 1);
                              }}
                              className="p-1 rounded hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                              title="নিচে নামান"
                            >
                              <ArrowDown className="size-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveSelected(sqId);
                              }}
                              className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="বাদ দিন"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
