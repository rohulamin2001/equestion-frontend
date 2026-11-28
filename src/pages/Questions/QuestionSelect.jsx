import { groupPassageQuestions } from "@/lib/questionUtils";
import {
  BookOpen,
  Filter,
  Info,
  Loader2,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import QuestionBankCard from "./components/select/QuestionBankCard";
import QuestionFilterSidebar from "./components/select/QuestionFilterSidebar";
import QuestionPreviewModal from "./components/select/QuestionPreviewModal";
import QuestionSelectHeader from "./components/select/QuestionSelectHeader";
import { useQuestions } from "./hook/useQuestions";
import { toBnNumber } from "./utils/questionUtils";

/**
 * Modern Question Bank Selection Workspace (`/dashboard/questions/select`)
 * using MyQuestions-matched 15px typography, server-side metadata & keyword filtering,
 * and a sticky Right Sidebar for Filters, Metadata Inspection & Selection Reordering.
 */
export default function QuestionSelect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get("setId") || "";

  const {
    loadingSets,
    activeSetId,
    setActiveSetId,
    activeSet,
    bankQuestions,
    totalBankCount,
    loadingBank,
    isFetchingBank,
    isFetchingNextBankPage,
    fetchNextBankPage,
    hasMoreBankQuestions,
    searchKeyword,
    setSearchKeyword,
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
    sortOrder,
    setSortOrder,
    resetAllFilters,
    metadataOptions,
    availableChapters,
    availableTopics,
    allowedSubjectCategories,
    syllabusList,
    updateQuestionSet,
  } = useQuestions();

  const [selectionOverride, setSelectionOverride] = useState({
    setId: null,
    questions: null,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [globalShowAnswers, setGlobalShowAnswers] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("filters");
  const [inspectedQuestion, setInspectedQuestion] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Sync active set ID from query string
  useEffect(() => {
    if (targetId && activeSetId !== targetId) {
      setActiveSetId(targetId);
    }
  }, [targetId, activeSetId, setActiveSetId]);

  const selectedQuestions = useMemo(() => {
    if (
      selectionOverride.setId === activeSet?._id &&
      Array.isArray(selectionOverride.questions)
    ) {
      return selectionOverride.questions;
    }
    return activeSet?.questions || [];
  }, [selectionOverride, activeSet]);

  const setSelectedQuestions = useCallback(
    (updater) => {
      const next =
        typeof updater === "function" ? updater(selectedQuestions) : updater;
      setSelectionOverride({
        setId: activeSet?._id || null,
        questions: next,
      });
    },
    [activeSet?._id, selectedQuestions],
  );

  const selectedIdsSet = useMemo(
    () => new Set(selectedQuestions.map((sq) => sq._id || sq)),
    [selectedQuestions],
  );

  const groupedBankItems = useMemo(
    () => groupPassageQuestions(bankQuestions),
    [bankQuestions],
  );

  const itemStartSerials = useMemo(() => {
    const starts = [];
    let cursor = 1;
    for (const item of groupedBankItems) {
      starts.push(cursor);
      cursor += item.isGroup ? item.questions?.length || 1 : 1;
    }
    return starts;
  }, [groupedBankItems]);

  const returnSetsParam =
    searchParams.get("setIds") || searchParams.get("setId") || activeSetId || "";

  const handleSaveQuestions = async () => {
    if (!activeSetId) return;
    try {
      const qIds = selectedQuestions.map((q) => q._id || q);
      await updateQuestionSet.mutateAsync({
        id: activeSetId,
        payload: { questions: qIds },
      });
      toast.success("প্রশ্নমালা সফলভাবে সংরক্ষণ করা হয়েছে!");
      navigate(`/dashboard/questions?setId=${returnSetsParam}`);
    } catch (err) {
      console.error("Error saving questions:", err);
      toast.error("প্রশ্ন সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/questions?setId=${returnSetsParam}`);
  };

  const handleToggleQuestion = useCallback(
    (q, { standalone = false } = {}) => {
      const isSelected = selectedQuestions.some(
        (sq) => (sq._id || sq) === q._id,
      );
      if (isSelected) {
        setSelectedQuestions((prev) =>
          prev.filter((sq) => (sq._id || sq) !== q._id),
        );
      } else if (!standalone && q.passageGroupId) {
        const related = bankQuestions.filter(
          (bq) => bq.passageGroupId === q.passageGroupId,
        );
        setSelectedQuestions((prev) => {
          const existing = new Set(prev.map((sq) => sq._id || sq));
          const toAdd = related.filter((rq) => !existing.has(rq._id));
          return [...prev, ...toAdd];
        });
      } else {
        setSelectedQuestions((prev) => [...prev, q]);
      }
    },
    [bankQuestions, selectedQuestions, setSelectedQuestions],
  );

  const handleToggleGroup = useCallback(
    (groupQuestions, allGroupSelected) => {
      if (allGroupSelected) {
        const gIds = new Set(groupQuestions.map((gq) => gq._id));
        setSelectedQuestions((prev) =>
          prev.filter((sq) => !gIds.has(sq._id || sq)),
        );
      } else {
        setSelectedQuestions((prev) => {
          const existing = new Set(prev.map((sq) => sq._id || sq));
          const toAdd = groupQuestions.filter((gq) => !existing.has(gq._id));
          return [...prev, ...toAdd];
        });
      }
    },
    [setSelectedQuestions],
  );

  const handleSelectAllShown = useCallback(() => {
    const newQuestions = bankQuestions.filter(
      (q) => !selectedIdsSet.has(q._id),
    );
    if (newQuestions.length === 0) {
      const shownIds = new Set(bankQuestions.map((b) => b._id));
      setSelectedQuestions((prev) =>
        prev.filter((sq) => !shownIds.has(sq._id || sq)),
      );
    } else {
      setSelectedQuestions((prev) => [...prev, ...newQuestions]);
    }
  }, [bankQuestions, selectedIdsSet, setSelectedQuestions]);

  const allShownSelected = useMemo(() => {
    if (bankQuestions.length === 0) return false;
    return bankQuestions.every((bq) => selectedIdsSet.has(bq._id));
  }, [bankQuestions, selectedIdsSet]);

  const handleReorderSelected = useCallback(
    (fromIndex, toIndex) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= selectedQuestions.length ||
        toIndex >= selectedQuestions.length
      ) {
        return;
      }
      setSelectedQuestions((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    },
    [selectedQuestions.length, setSelectedQuestions],
  );

  const handleRemoveSelected = useCallback(
    (qId) => {
      setSelectedQuestions((prev) =>
        prev.filter((sq) => (sq._id || sq) !== qId),
      );
    },
    [setSelectedQuestions],
  );

  const handleInspectQuestion = useCallback((question) => {
    setInspectedQuestion(question);
    setSidebarTab("inspector");
    setShowMobileSidebar(true);
  }, []);

  const handleQuickTagFilter = useCallback(
    (type, value) => {
      const toggleVal = (setter) =>
        setter((prev) =>
          prev.includes(value) ? prev : [...prev, value],
        );

      if (type === "topic") {
        toggleVal(setSelectedTopics);
        toast.success(`টপিক "#${value}" দিয়ে ফিল্টার করা হচ্ছে`);
      } else if (type === "special") {
        toggleVal(setSelectedTags);
        toast.success(`কীওয়ার্ড "${value}" দিয়ে ফিল্টার করা হচ্ছে`);
      } else if (type === "school") {
        toggleVal(setSelectedSchools);
        toast.success(`স্কুল "${value}" দিয়ে ফিল্টার করা হচ্ছে`);
      }
      setSidebarTab("filters");
    },
    [setSelectedSchools, setSelectedTags, setSelectedTopics],
  );

  // Active filter summary chips displayed above feed
  const activeFilterChips = useMemo(() => {
    const chips = [];
    selectedChapters.forEach((chNum) => {
      chips.push({
        key: `ch-${chNum}`,
        label: `অধ্যায় ${toBnNumber(chNum)}`,
        onRemove: () =>
          setSelectedChapters((prev) => prev.filter((c) => c !== chNum)),
      });
    });
    selectedTopics.forEach((t) =>
      chips.push({
        key: `tp-${t}`,
        label: `#${t}`,
        onRemove: () =>
          setSelectedTopics((prev) => prev.filter((x) => x !== t)),
      }),
    );
    selectedTags.forEach((t) =>
      chips.push({
        key: `ss-${t}`,
        label: t === "Exercise" ? "অনুশীলনী" : t,
        onRemove: () =>
          setSelectedTags((prev) => prev.filter((x) => x !== t)),
      }),
    );
    selectedBoards.forEach((b) =>
      chips.push({
        key: `bd-${b}`,
        label: b,
        onRemove: () =>
          setSelectedBoards((prev) => prev.filter((x) => x !== b)),
      }),
    );
    selectedYears.forEach((y) =>
      chips.push({
        key: `yr-${y}`,
        label: y,
        onRemove: () =>
          setSelectedYears((prev) => prev.filter((x) => x !== y)),
      }),
    );
    selectedSchools.forEach((s) =>
      chips.push({
        key: `sch-${s}`,
        label: s,
        onRemove: () =>
          setSelectedSchools((prev) => prev.filter((x) => x !== s)),
      }),
    );
    selectedDifficulties.forEach((d) =>
      chips.push({
        key: `df-${d}`,
        label: d === "Easy" ? "সহজ" : d === "Medium" ? "মধ্যম" : "কঠিন",
        onRemove: () =>
          setSelectedDifficulties((prev) => prev.filter((x) => x !== d)),
      }),
    );
    selectedLevels.forEach((l) =>
      chips.push({
        key: `lv-${l}`,
        label: l,
        onRemove: () =>
          setSelectedLevels((prev) => prev.filter((x) => x !== l)),
      }),
    );
    if (hasImageOnly) {
      chips.push({
        key: "img-only",
        label: "চিত্রযুক্ত প্রশ্ন",
        onRemove: () => setHasImageOnly(false),
      });
    }
    if (uniqueMode) {
      chips.push({
        key: "unique-mode",
        label: "ইউনিক মোড",
        onRemove: () => setUniqueMode(false),
      });
    }
    return chips;
  }, [
    selectedChapters,
    selectedTopics,
    selectedTags,
    selectedBoards,
    selectedYears,
    selectedSchools,
    selectedDifficulties,
    selectedLevels,
    hasImageOnly,
    uniqueMode,
    setSelectedChapters,
    setSelectedTopics,
    setSelectedTags,
    setSelectedBoards,
    setSelectedYears,
    setSelectedSchools,
    setSelectedDifficulties,
    setSelectedLevels,
    setHasImageOnly,
    setUniqueMode,
  ]);

  if (loadingSets || !activeSet) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3 font-bengali">
        <Loader2 className="h-8 w-8 animate-spin text-[#900EB0]" />
        <p className="text-sm text-slate-500 font-semibold">
          প্রশ্ন ডেটা লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full lg:h-full flex flex-col lg:flex-row lg:overflow-hidden font-bengali text-left">
      {/* Mobile Filter Drawer Toggle */}
      <div className="lg:hidden px-4 pt-4 order-1">
        <button
          type="button"
          onClick={() => setShowMobileSidebar((v) => !v)}
          className="w-full py-2.5 px-4 rounded-2xl border border-purple-200 bg-white/95 text-[#720A7B] text-xs font-bold flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
        >
          <SlidersHorizontal className="size-4" />
          <span>
            {showMobileSidebar
              ? "ফিল্টার ও মেটাডাটা প্যানেল লুকান"
              : `ফিল্টার, কীওয়ার্ড ও নির্বাচিত (${toBnNumber(selectedQuestions.length)})`}
          </span>
        </button>
      </div>

      {/* Left/Main Scrollable Workspace: Sticky-Header Card + Question Bank Feed */}
      <div className="flex-1 min-w-0 lg:h-full lg:overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-5 order-3 lg:order-1">
        <QuestionSelectHeader
          activeSet={activeSet}
          syllabusList={syllabusList}
          selectedQuestions={selectedQuestions}
          allShownSelected={allShownSelected}
          hasVisibleQuestions={bankQuestions.length > 0}
          globalShowAnswers={globalShowAnswers}
          onToggleGlobalAnswers={() => setGlobalShowAnswers((v) => !v)}
          onToggleSelectAll={handleSelectAllShown}
          onOpenPreview={() => setIsPreviewOpen(true)}
          onSave={handleSaveQuestions}
          onCancel={handleCancel}
          saving={updateQuestionSet.isPending}
        />

        <div className="bg-white/75 backdrop-blur-md border border-slate-200/70 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            {/* Feed Sub-Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#900EB0]/10 text-[#900EB0]">
                  <BookOpen className="size-4" />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800">
                    প্রশ্নব্যাংক থেকে প্রশ্ন নির্বাচন করুন
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    মোট{" "}
                    <strong className="text-slate-700">
                      {toBnNumber(totalBankCount)}
                    </strong>{" "}
                    টি অনুমোদিত প্রশ্ন পাওয়া গেছে (প্রদর্শিত:{" "}
                    {toBnNumber(bankQuestions.length)} টি)
                  </p>
                </div>
              </div>

              {isFetchingBank && !loadingBank && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#900EB0] bg-purple-50 px-2.5 py-1 rounded-full">
                  <Loader2 className="size-3 animate-spin" />
                  আপডেট হচ্ছে...
                </span>
              )}
            </div>

            {/* Active Filter Chips Bar */}
            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 bg-purple-50/40 p-2.5 rounded-2xl border border-purple-100/80">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="size-3 text-[#900EB0]" />
                  সক্রিয়:
                </span>
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-purple-200 text-[#720A7B] text-[11px] font-semibold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 cursor-pointer transition"
                  >
                    <span>{chip.label}</span>
                    <X className="size-3" />
                  </button>
                ))}
                {selectedChapters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedChapters([])}
                    className="ml-auto text-[11px] font-bold text-[#900EB0] hover:underline cursor-pointer px-2"
                  >
                    সব অধ্যায় দেখুন
                  </button>
                )}
              </div>
            )}

            {/* Question List States */}
            {loadingBank ? (
              <div className="h-72 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-7 w-7 animate-spin text-[#900EB0]" />
                <p className="text-xs font-semibold text-slate-500">
                  প্রশ্নসমূহ লোড হচ্ছে...
                </p>
              </div>
            ) : bankQuestions.length === 0 ? (
              <div className="border border-dashed border-purple-200 bg-purple-50/20 p-10 sm:p-14 rounded-2xl text-center space-y-3">
                <Info className="h-9 w-9 text-purple-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">
                  এই ফিল্টারের সাথে কোনো প্রশ্ন পাওয়া যায়নি
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {selectedChapters.length > 0
                    ? "নির্বাচিত অধ্যায়গুলোতে পর্যাপ্ত প্রশ্ন না থাকলে সব অধ্যায় থেকে খুঁজে দেখতে পারেন।"
                    : "দয়া করে অন্য কীওয়ার্ড, বোর্ড, টপিক বা স্পেশাল সার্চ ফিল্টার পরিবর্তন করুন।"}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  {selectedChapters.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedChapters([])}
                      className="px-4 py-2 rounded-xl bg-[#900EB0] hover:bg-[#720A7B] text-white text-xs font-bold cursor-pointer transition"
                    >
                      সব অধ্যায় থেকে দেখুন
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer transition"
                  >
                    <RotateCcw className="size-3.5" />
                    সব ফিল্টার রিসেট
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {groupedBankItems.map((item, idx) => (
                  <QuestionBankCard
                    key={
                      item.isGroup
                        ? `grp-${item.passageGroupId}`
                        : `q-${item.question?._id}`
                    }
                    item={item}
                    indexOffset={itemStartSerials[idx]}
                    selectedIdsSet={selectedIdsSet}
                    globalShowAnswers={globalShowAnswers}
                    inspectedQuestionId={inspectedQuestion?._id || null}
                    availableChapters={availableChapters}
                    onToggleQuestion={handleToggleQuestion}
                    onToggleGroup={handleToggleGroup}
                    onInspectQuestion={handleInspectQuestion}
                    onQuickTagFilter={handleQuickTagFilter}
                  />
                ))}

                {hasMoreBankQuestions && (
                  <div className="pt-3 flex justify-center">
                    <button
                      type="button"
                      disabled={isFetchingNextBankPage}
                      onClick={() => fetchNextBankPage()}
                      className="px-7 py-2.5 bg-purple-50 hover:bg-[#900EB0] text-[#720A7B] hover:text-white border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                      {isFetchingNextBankPage && (
                        <Loader2 className="size-3.5 animate-spin" />
                      )}
                      <span>আরও প্রশ্ন লোড করুন</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Fixed-Height Docked Sidebar: Filters & Metadata Inspector */}
        <QuestionFilterSidebar
          className={
            showMobileSidebar
              ? "block px-4 pt-3 lg:p-0 order-2"
              : "hidden lg:block lg:order-2"
          }
          activeTab={sidebarTab}
            onChangeTab={setSidebarTab}
            activeSet={activeSet}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            uniqueMode={uniqueMode}
            setUniqueMode={setUniqueMode}
            selectedChapters={selectedChapters}
            setSelectedChapters={setSelectedChapters}
            setChapterNumbers={setChapterNumbers}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            selectedDifficulties={selectedDifficulties}
            setSelectedDifficulties={setSelectedDifficulties}
            selectedLevels={selectedLevels}
            setSelectedLevels={setSelectedLevels}
            selectedBoards={selectedBoards}
            setSelectedBoards={setSelectedBoards}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
            selectedSchools={selectedSchools}
            setSelectedSchools={setSelectedSchools}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            selectedMcqTypes={selectedMcqTypes}
            setSelectedMcqTypes={setSelectedMcqTypes}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            hasImageOnly={hasImageOnly}
            setHasImageOnly={setHasImageOnly}
            resetAllFilters={resetAllFilters}
            metadataOptions={metadataOptions}
            availableChapters={availableChapters}
            availableTopics={availableTopics}
            allowedSubjectCategories={allowedSubjectCategories}
            totalBankCount={totalBankCount}
            selectedQuestions={selectedQuestions}
            inspectedQuestion={inspectedQuestion}
            onReorderSelected={handleReorderSelected}
            onRemoveSelected={handleRemoveSelected}
            onClearSelected={() => setSelectedQuestions([])}
            onInspectQuestion={handleInspectQuestion}
            onQuickTagFilter={handleQuickTagFilter}
          />

      {/* Modern Preview, Arrange & Save Confirmation Modal */}
      <QuestionPreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        activeSet={activeSet}
        selectedQuestions={selectedQuestions}
        availableChapters={availableChapters}
        onReorderSelected={handleReorderSelected}
        onRemoveSelected={handleRemoveSelected}
        onSave={handleSaveQuestions}
        saving={updateQuestionSet.isPending}
      />
    </div>
  );
}
