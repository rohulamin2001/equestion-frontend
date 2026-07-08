import { ChevronDown, CreditCard, Loader2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useGenerator } from "./hook/useGenerator";

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

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 font-bengali relative">
      {/* Header Banner */}
      <div className="bg-indigo-900 text-white rounded-3xl p-8 text-center relative overflow-hidden shadow-lg shadow-indigo-900/10">
        <div className="absolute top-2 right-4 text-xs font-sans opacity-40 font-bold">
          ৪.৩.৩
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          ১ ক্লিকে প্রশ্ন তৈরির সফটওয়্যার !
        </h1>
        <p className="text-xs text-indigo-200 mt-2 flex items-center justify-center gap-1 font-semibold">
          শিক্ষা এবং সফটওয়্যার, একসাথে এগিয়ে চলা! 🌱
        </p>

        {/* Subscribe Banner if any selected subject is locked */}
        {hasLockedSubject && (
          <div className="mt-5 flex justify-center">
            <button
              onClick={() => navigate("/dashboard/subscription")}
              className="bg-red-500 hover:bg-red-600 transition text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-red-500/20 font-sans cursor-pointer"
            >
              <CreditCard className="h-4 w-4" />
              Subscribe Now!
            </button>
          </div>
        )}
      </div>

      {/* Main Generator Form Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        {loadingSubs ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3 font-sans">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-xs text-slate-500 font-medium">
              সাবস্ক্রিপশন চেক করা হচ্ছে...
            </p>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 font-bengali">
            <div className="p-3 bg-amber-50 rounded-full border border-amber-200/60">
              <Lock className="h-6 w-6 text-amber-600" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-sm font-bold text-slate-800">
                কোনো সক্রিয় সাবস্ক্রিপশন নেই
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                ১ ক্লিকে প্রশ্ন তৈরি করতে আপনার সক্রিয় সাবস্ক্রিপশন থাকা আবশ্যক।
                অনুগ্রহ করে আপনার পছন্দের ক্লাস বা বিষয়ের সাবস্ক্রিপশন সচল করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/subscription")}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2.5 rounded-xl text-xs font-bold font-sans cursor-pointer shadow-md shadow-indigo-500/10"
            >
              সাবস্ক্রিপশন কিনুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Exam Name Input */}
            <div className="space-y-1.5 font-sans">
              <label className="text-xs font-bold text-slate-700 font-bengali">
                প্রোগ্রাম/পরীক্ষার নাম লিখুন{" "}
                <span className="text-red-500 font-sans">*</span>
              </label>
              <input
                type="text"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="প্রোগ্রাম/পরীক্ষার নাম লিখুন *"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium"
              />
              {examName === "" && (
                <p className="text-[10px] text-red-500 font-semibold font-bengali">
                  প্রোগ্রাম/পরীক্ষার নাম লিখুন
                </p>
              )}
            </div>

            {/* Class Select Dropdown (Modernized to match visual design) */}
            <div className="space-y-1.5 font-sans">
              <label className="text-xs font-bold text-slate-700 font-bengali">
                শ্রেণি
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-left text-sm flex items-center justify-between hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-white cursor-pointer select-none font-medium text-slate-800"
                  >
                    <span>
                      {classes.find((cls) => cls.value === selectedClass)
                        ?.label || selectedClass}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
                  {classes.map((cls) => {
                    const isSelected = selectedClass === cls.value;
                    return (
                      <DropdownMenuItem
                        key={cls.value}
                        onSelect={() => setSelectedClass(cls.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                          isSelected
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{cls.label}</span>
                        {isSelected && (
                          <span className="size-1.5 rounded-full bg-indigo-500" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Subject Trigger Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">বিষয়</label>
              <button
                type="button"
                onClick={handleOpenSubjectModal}
                className="w-full min-h-11 py-2 px-3.5 rounded-xl border border-slate-200 text-left text-sm flex items-center justify-between hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-white cursor-pointer select-none text-slate-800"
              >
                <div className="flex-1 flex flex-wrap gap-1.5 items-center min-h-[26px]">
                  {selectedSubjects.length > 0 ? (
                    selectedSubjects.map((s) => {
                      const itemId = s.subjectId?._id || s.subjectId;
                      return (
                        <span
                          key={itemId}
                          className="inline-flex items-center gap-1 bg-indigo-50/60 text-indigo-700 border border-indigo-100/80 px-2.5 py-1 rounded-lg text-xs font-semibold"
                        >
                          <span>
                            {s.subjectName} (
                            {s.version === "Bangla" ? "বাংলা" : "ইংরেজি"})
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
                              // Also clear any selected chapters for this subject
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
                            className="hover:bg-indigo-100/80 p-0.5 rounded-md transition text-indigo-500 hover:text-indigo-700 cursor-pointer ml-0.5 flex items-center justify-center size-4"
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-slate-400">বিষয় সিলেক্ট করুন</span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
              </button>
            </div>

            {/* Chapter Trigger Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">অধ্যায়</label>
              <button
                type="button"
                disabled={selectedSubjects.length === 0}
                onClick={() => setShowChapterModal(true)}
                className={`w-full h-11 px-4 rounded-xl border border-slate-200 text-left text-sm flex items-center justify-between transition bg-white ${
                  selectedSubjects.length === 0
                    ? "bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100"
                    : "hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer text-slate-800"
                }`}
              >
                <span
                  className={
                    selectedChapters.length > 0
                      ? "text-slate-800 font-semibold"
                      : "text-slate-400"
                  }
                >
                  {selectedChapters.length > 0
                    ? `${selectedChapters.length} টি অধ্যায় সিলেক্ট করা হয়েছে`
                    : "অধ্যায় সিলেক্ট করুন"}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            {/* Type Select & Total Marks inline inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-700 font-bengali">
                  টাইপ
                </label>
                <div className="relative">
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm appearance-none bg-white font-sans font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="MCQ">বহুনির্বাচনী</option>
                    <option value="Creative">সৃজনশীল</option>
                    <option value="Combined">সমন্বিত</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-700 font-bengali">
                  মোট নম্বর
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  placeholder="100"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium"
                />
              </div>
            </div>

            {/* Generate Button (Color updated to Indigo to match primary branding and outline colors) */}
            <button
              type="submit"
              disabled={generating || fetchingSyllabus}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow shadow-indigo-500/10 cursor-pointer"
            >
              {generating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "প্রশ্ন তৈরি করুন"
              )}
            </button>
          </form>
        )}
      </div>

      {/* Modal 1: Subject Selection Popup */}
      <Dialog
        open={showSubjectModal}
        onOpenChange={(open) => {
          if (open) {
            setTempSelectedSubjects(selectedSubjects);
          }
          setShowSubjectModal(open);
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={true}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative"
        >
          {/* Header */}
          <DialogHeader className="p-5 border-b border-slate-100/50 mb-0 flex flex-col justify-start items-start">
            <DialogTitle className="text-sm font-bold text-slate-800">
              বিষয় সিলেক্ট করুন
            </DialogTitle>
          </DialogHeader>

          {/* Filters (centered badges) */}
          <div className="p-4 bg-slate-50/50 flex justify-center gap-2 border-b border-slate-100/50">
            <button
              type="button"
              onClick={() => setSubjectFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer select-none ${
                subjectFilter === "all"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                  : "bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50"
              }`}
            >
              সবগুলো
            </button>
            <button
              type="button"
              onClick={() => setSubjectFilter("bangla")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer select-none ${
                subjectFilter === "bangla"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                  : "bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50"
              }`}
            >
              বাংলা ভার্শন
            </button>
            <button
              type="button"
              onClick={() => setSubjectFilter("english")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer select-none ${
                subjectFilter === "english"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                  : "bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50"
              }`}
            >
              English Version
            </button>
          </div>

          {/* List */}
          <div className="max-h-[280px] overflow-y-auto p-5 space-y-2">
            {fetchingSyllabus ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : filteredSyllabusList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8 font-medium">
                কোনো বিষয় পাওয়া যায়নি।
              </p>
            ) : (
              filteredSyllabusList.map((item) => {
                const itemId = item.subjectId?._id || item.subjectId;
                const isSelected = tempSelectedSubjects.some(
                  (s) => (s.subjectId?._id || s.subjectId) === itemId,
                );
                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      if (isSelected) {
                        setTempSelectedSubjects((prev) =>
                          prev.filter(
                            (s) => (s.subjectId?._id || s.subjectId) !== itemId,
                          ),
                        );
                      } else {
                        setTempSelectedSubjects((prev) => [...prev, item]);
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                      isSelected
                        ? "border-indigo-400 bg-indigo-50/10"
                        : "border-slate-100 hover:border-indigo-300 hover:bg-slate-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="h-4 w-4 rounded text-indigo-600 border-slate-350 focus:ring-indigo-500/20 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        {item.subjectName}
                      </span>
                    </div>
                    <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wide px-2 py-0.5 bg-slate-100 border rounded-md">
                      {item.version}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Select & Close Buttons */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100/50 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedSubjects(tempSelectedSubjects);
                // Clear any selected chapters that don't belong to the newly selected subjects
                const selectedIds = tempSelectedSubjects.map(
                  (s) => s.subjectId?._id || s.subjectId,
                );
                setSelectedChapters((prev) =>
                  prev.filter((key) => selectedIds.includes(key.split("_")[0])),
                );
                setShowSubjectModal(false);
              }}
              className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl text-sm font-semibold text-white shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              সিলেক্ট করুন
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSubjectModal(false);
              }}
              className="flex-1 h-10 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-xl text-sm font-semibold text-slate-600 cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Chapter Selection Popup */}
      <Dialog open={showChapterModal} onOpenChange={setShowChapterModal}>
        <DialogContent
          from="top"
          showCloseButton={true}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative"
        >
          {/* Header */}
          <DialogHeader className="p-5 border-b border-slate-100/50 mb-0 flex flex-col justify-start items-start">
            <DialogTitle className="text-sm font-bold text-slate-800">
              অধ্যায় সিলেক্ট করুন
            </DialogTitle>
          </DialogHeader>

          {/* List */}
          <div className="max-h-[350px] overflow-y-auto p-5 space-y-4">
            {selectedSubjects.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                কোনো বিষয় সিলেক্ট করা নেই।
              </p>
            ) : (
              selectedSubjects.map((sub) => {
                const subId = sub.subjectId?._id || sub.subjectId;
                const isSubscribed = hasSubjectAccess(sub);

                return (
                  <div key={subId} className="space-y-2">
                    <h4 className="text-xs font-bold text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded-lg border border-indigo-100/30">
                      {sub.subjectName} (
                      {sub.version === "Bangla" ? "বাংলা" : "ইংরেজি"})
                    </h4>
                    {!sub.chapters || sub.chapters.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic pl-2">
                        কোনো অধ্যায় পাওয়া যায়নি।
                      </p>
                    ) : (
                      <div className="space-y-1.5 pl-1">
                        {sub.chapters.map((ch, idx) => {
                          const isLocked = !isSubscribed && idx > 0;
                          const key = `${subId}_${ch.chapterNumber}`;
                          const isChecked = selectedChapters.includes(key);

                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                if (isLocked) {
                                  toast.error(
                                    "বাকি অধ্যায়সমূহ আনলক করতে অনুগ্রহ করে সাবস্ক্রাইব করুন।",
                                  );
                                  return;
                                }
                                setSelectedChapters((prev) =>
                                  prev.includes(key)
                                    ? prev.filter((k) => k !== key)
                                    : [...prev, key],
                                );
                              }}
                              className={`p-3 border rounded-xl flex items-center justify-between transition select-none ${
                                isLocked
                                  ? "border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-60"
                                  : isChecked
                                    ? "border-indigo-400 bg-indigo-50/10 cursor-pointer"
                                    : "border-slate-100 hover:border-indigo-300 hover:bg-slate-50/30 cursor-pointer"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {isLocked ? (
                                  <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                                ) : (
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="h-4 w-4 rounded text-indigo-600 border-slate-350 focus:ring-indigo-500/20 cursor-pointer shrink-0"
                                  />
                                )}
                                <span
                                  className={`text-xs font-bold ${isLocked ? "text-slate-400" : "text-slate-700"}`}
                                >
                                  {ch.chapterName}
                                </span>
                              </div>
                              {isLocked && (
                                <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                  Locked
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100/50 flex gap-3">
            <button
              type="button"
              onClick={() => setShowChapterModal(false)}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl text-sm font-semibold text-white shadow-md shadow-indigo-500/10 cursor-pointer text-center"
            >
              ঠিক আছে
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
