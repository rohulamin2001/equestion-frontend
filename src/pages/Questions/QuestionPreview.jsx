import {
  ChevronLeft,
  Download,
  FileText,
  Grid,
  Info,
  Loader2,
  Plus,
  Printer,
  Settings,
  Sliders,
  Trash2,
} from "lucide-react";
import FloatingFormatToolbar from "../../components/FloatingFormatToolbar.jsx";
import InlineEditable from "../../components/InlineEditable.jsx";
import { translateSubscriptionKey } from "../../constants/subscriptions.js";
import { useQuestionPreview } from "./hook/useQuestionPreview";

// Helper to parse Bengali numerals as standard numbers
const parseBanglaNumber = (val) => {
  if (!val) return 0;
  let cleanStr = String(val)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const englishStr = cleanStr.replace(/[০-৯]/g, (d) =>
    String(banglaDigits.indexOf(d)),
  );

  const parsed = Number(englishStr);
  return isNaN(parsed) ? 0 : parsed;
};

export default function QuestionPreview() {
  const {
    loadingSets,
    activeSet,
    layoutSettings,
    activeTab,
    setActiveTab,
    editingSubjectCode,
    setEditingSubjectCode,
    toolbarVisible,
    toolbarPos,
    groupedQuestions,
    handleEditorActivate,
    handleEditorDeactivate,
    handleSaveSetField,
    handleSaveQuestionEdit,
    updateSettingField,
    handleRemoveQuestion,
    handlePrint,
    handleSaveAll,
    handleGoBackToSelect,
    userProfile,
  } = useQuestionPreview();

  const activeFont = [
    "Purno",
    "SutonnyMJ",
    "Kalpurush",
    "SolaimanLipi",
  ].includes(layoutSettings.fontFamily)
    ? layoutSettings.fontFamily
    : "Purno";

  if (loadingSets || !activeSet) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-500 font-semibold">
          প্রশ্নপত্র লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-bengali text-left">
      {/* Top Header Card */}
      <div className="max-w-[1220px] mx-auto w-full bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoBackToSelect}
              className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition rounded-lg flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <ChevronLeft className="size-4" />
              প্রশ্ন সম্পাদনা করুন
            </button>
            <h1 className="text-base font-black text-slate-800 border-l pl-3 ml-1">
              প্রিভিউ ও প্রিন্ট লেআউট
            </h1>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            পরীক্ষা: {activeSet.examName} • বিষয়: {activeSet.subjectName} •
            শ্রেণী: {activeSet.className}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGoBackToSelect}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            প্রশ্ন পরিবর্তন করুন
          </button>

          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="max-w-[1220px] mx-auto w-full bg-amber-50 border border-amber-200/60 rounded-2xl p-4 shadow-sm flex items-start gap-3 print:hidden">
        <div className="p-2 bg-amber-100 rounded-full shrink-0 mt-0.5">
          <svg
            className="size-4 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900">সতর্কবার্তা</h4>
          <p className="text-xs text-amber-800/80 mt-0.5 leading-relaxed font-medium">
            অনুগ্রহ করে লক্ষ্য করবেন, এখানে করা কোনো পরিবর্তন মূল ডাটাবেজে
            সংরক্ষণ করা হয় না। এটি শুধুমাত্র আপনার প্রিন্ট বা ডাউনলোডের
            সুবিধার্থে প্রশ্নপত্রের লেআউট সাময়িকভাবে সাজিয়ে নেয়ার একটি ব্যবস্থা
            মাত্র। আপনার প্রয়োজনীয় কাস্টমাইজেশন শেষে দয়া করে প্রশ্নপত্রটি
            প্রিন্ট অথবা ডাউনলোড করে নিতে ভুলবেন না। আপনাকে অসংখ্য ধন্যবাদ।
          </p>
        </div>
      </div>
      {/* Main Preview Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center max-w-[1220px] mx-auto w-full print:block print:w-full print:m-0 print:p-0">
        {/* Left Pane (A4 Printable paper preview) */}
        <div className="flex-1 w-full max-w-[820px] space-y-4 print:w-full print:absolute print:left-0 print:top-0 print:m-0 print:p-0">
          <div className="flex justify-between items-center print:hidden border border-slate-200/50 bg-[#FBFBFC] px-4 py-3 rounded-2xl shadow-sm">
            <span className="text-xs font-black text-slate-700">
              কুইক সেটিংস
            </span>
            <button
              onClick={handleGoBackToSelect}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs transition flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className=" size-3.5" />
              আরও প্রশ্ন যুক্ত করুন
            </button>
          </div>

          <div
            className={`question-paper-container ${layoutSettings.fontFamily === "English" ? "is-english" : `font-family-${activeFont}`} bg-white border border-slate-200/60 p-8 shadow-sm print:border-none print:shadow-none print:p-0 select-none print:select-text`}
            style={{
              fontFamily:
                layoutSettings.fontFamily === "English"
                  ? "Outfit, sans-serif"
                  : `'${activeFont}', 'Purno', 'SutonnyMJ', 'SutonnyMJ-Regular', 'Kalpurush', 'SolaimanLipi', sans-serif`,
              fontSize: `${layoutSettings.fontSize}px`,
            }}
          >
            <div className="space-y-3 mb-6 select-none">
              {/* Three-column Top Layout */}
              <div className="grid grid-cols-12 items-center gap-2">
                {/* Left Column: Obtained Marks */}
                <div className="col-span-3 flex justify-start items-center">
                  {layoutSettings.attachments.marksGrid ? (
                    <div
                      className="flex items-stretch border border-black overflow-hidden h-7 select-none"
                      style={{ fontSize: "16px", fontWeight: 400 }}
                    >
                      <InlineEditable
                        value={activeSet.obtainedMarksLabel || "প্রাপ্ত নম্বর"}
                        onSave={(val) =>
                          handleSaveSetField("obtainedMarksLabel", val)
                        }
                        onActivate={handleEditorActivate}
                        onDeactivate={handleEditorDeactivate}
                        className="bg-black text-white px-2 flex items-center justify-center font-normal leading-none h-full"
                        style={{ fontSize: "16px", fontWeight: 400 }}
                        placeholder="প্রাপ্ত নম্বর"
                        renderRichText={false}
                        inline={false}
                      />
                      <span className="w-10 bg-white flex items-center justify-center border-l border-black"></span>
                    </div>
                  ) : (
                    <div className="w-1"></div>
                  )}
                </div>

                {/* Center Column: School, Exam, Class, Subject, Chapters */}
                <div
                  className="col-span-6 text-center space-y-0.5"
                  style={{ lineHeight: "1.25" }}
                >
                  {/* School Name */}
                  <div className="block">
                    <InlineEditable
                      value={
                        activeSet.institutionName ||
                        userProfile?.institutionName ||
                        "সোনার বাংলা হাই স্কুল"
                      }
                      onSave={(val) =>
                        handleSaveSetField("institutionName", val)
                      }
                      onActivate={handleEditorActivate}
                      onDeactivate={handleEditorDeactivate}
                      className="text-slate-900 tracking-wide uppercase block text-center"
                      style={{ fontSize: "20px", fontWeight: 700 }}
                      placeholder="প্রতিষ্ঠানের নাম লিখুন"
                      renderRichText={false}
                      inline={false}
                    />
                  </div>

                  {/* Exam Name */}
                  {layoutSettings.metadata.programName && (
                    <div className="block">
                      <InlineEditable
                        value={activeSet.examName || "টেস্ট পরীক্ষা"}
                        onSave={(val) => handleSaveSetField("examName", val)}
                        onActivate={handleEditorActivate}
                        onDeactivate={handleEditorDeactivate}
                        className="text-slate-850 tracking-wide block text-center"
                        style={{ fontSize: "18px", fontWeight: 700 }}
                        placeholder="পরীক্ষার নাম লিখুন"
                        renderRichText={false}
                        inline={false}
                      />
                    </div>
                  )}

                  {/* Class Name */}
                  {layoutSettings.metadata.className && (
                    <div className="block">
                      <InlineEditable
                        value={
                          activeSet.className
                            ? translateSubscriptionKey(activeSet.className)
                            : "ষষ্ঠ শ্রেণি"
                        }
                        onSave={(val) => handleSaveSetField("className", val)}
                        onActivate={handleEditorActivate}
                        onDeactivate={handleEditorDeactivate}
                        className="text-slate-700 block text-center"
                        style={{ fontSize: "16px", fontWeight: 400 }}
                        placeholder="শ্রেণী লিখুন"
                        renderRichText={false}
                        inline={false}
                      />
                    </div>
                  )}

                  {/* Subject Name */}
                  {layoutSettings.metadata.subjectName && (
                    <div className="block">
                      <InlineEditable
                        value={activeSet.subjectName || "বাংলা ১ম পত্র"}
                        onSave={(val) => handleSaveSetField("subjectName", val)}
                        onActivate={handleEditorActivate}
                        onDeactivate={handleEditorDeactivate}
                        className="text-slate-850 block text-center"
                        style={{ fontSize: "16px", fontWeight: 400 }}
                        placeholder="বিষয় লিখুন"
                        renderRichText={false}
                        inline={false}
                      />
                    </div>
                  )}

                  {/* Chapters Info */}
                  {layoutSettings.metadata.chapterName && (
                    <div className="block">
                      <InlineEditable
                        value={
                          activeSet.chapters && activeSet.chapters.length > 0
                            ? activeSet.chapters.join(", ")
                            : "গদ্য ১ - সততার পুরস্কার"
                        }
                        onSave={(val) =>
                          handleSaveSetField(
                            "chapters",
                            val
                              .split(",")
                              .map((c) => c.trim())
                              .filter(Boolean),
                          )
                        }
                        onActivate={handleEditorActivate}
                        onDeactivate={handleEditorDeactivate}
                        className="text-[11px] text-slate-500 font-normal block text-center"
                        placeholder="অধ্যায় নম্বর"
                        renderRichText={false}
                        inline={false}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column: Set Code and Subject Code Stacked */}
                <div className="col-span-3 flex flex-col items-end gap-1.5">
                  {/* Set Code */}
                  {layoutSettings.metadata.setCode ? (
                    <div
                      className="flex items-center gap-1.5 font-normal text-slate-800"
                      style={{ fontSize: "16px", fontWeight: 400 }}
                    >
                      <span>সেট কোড:</span>
                      <span className="w-8 h-6 border border-black flex items-center justify-center bg-white font-normal font-sans">
                        <InlineEditable
                          value={activeSet.setCode || "ক"}
                          onSave={(val) => handleSaveSetField("setCode", val)}
                          onActivate={handleEditorActivate}
                          onDeactivate={handleEditorDeactivate}
                          renderRichText={false}
                          className="text-center font-normal"
                          style={{ fontSize: "16px", fontWeight: 400 }}
                          placeholder="কোড"
                        />
                      </span>
                    </div>
                  ) : (
                    <div className="h-5"></div>
                  )}

                  {/* Subject Code */}
                  {layoutSettings.attachments.subjectCode ? (
                    <div
                      className="flex items-center gap-1.5 font-normal text-slate-800"
                      style={{ fontSize: "16px", fontWeight: 400 }}
                    >
                      <span>বিষয় কোড :</span>
                      {editingSubjectCode ? (
                        <input
                          type="text"
                          defaultValue={activeSet.subjectCode || "১০১"}
                          onBlur={(e) => {
                            handleSaveSetField("subjectCode", e.target.value);
                            setEditingSubjectCode(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveSetField("subjectCode", e.target.value);
                              setEditingSubjectCode(false);
                            }
                          }}
                          autoFocus
                          className="w-16 px-1 py-0.5 border border-indigo-500 rounded text-center font-sans text-xs focus:outline-none print:hidden"
                        />
                      ) : (
                        <div
                          onClick={() => setEditingSubjectCode(true)}
                          className="flex gap-0.5 font-sans font-normal cursor-pointer hover:opacity-80 print:cursor-default"
                          title="এডিট করতে ক্লিক করুন"
                        >
                          {String(activeSet.subjectCode || "১০১")
                            .split("")
                            .map((digit, i) => (
                              <span
                                key={i}
                                className="w-5 h-6 border border-black flex items-center justify-center bg-white text-base font-bold"
                              >
                                {digit}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
              </div>

              {/* Time and Marks Row */}
              <div
                className="flex justify-between items-center text-slate-800 font-normal px-1 py-1  mt-2 mb-1"
                style={{ fontSize: "16px", fontWeight: 400 }}
              >
                <div className="flex items-center gap-1">
                  <span>সময় : </span>
                  <InlineEditable
                    value={layoutSettings.examTime || "১ ঘণ্টা ৫০ মিনিট"}
                    onSave={(val) => updateSettingField(null, "examTime", val)}
                    onActivate={handleEditorActivate}
                    onDeactivate={handleEditorDeactivate}
                    renderRichText={false}
                    className="font-normal"
                    style={{ fontSize: "16px", fontWeight: 400 }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span>পূর্ণমান :</span>
                  <InlineEditable
                    value={
                      activeSet.totalMarks
                        ? Number(activeSet.totalMarks).toLocaleString("bn-BD")
                        : "৭৯"
                    }
                    onSave={(val) =>
                      handleSaveSetField("totalMarks", parseBanglaNumber(val))
                    }
                    onActivate={handleEditorActivate}
                    onDeactivate={handleEditorDeactivate}
                    renderRichText={false}
                    className="font-normal"
                    style={{ fontSize: "16px", fontWeight: 400 }}
                  />
                </div>
              </div>

              {/* Student Info Row */}
              {layoutSettings.attachments.studentInfo && (
                <div
                  className="flex justify-between items-center text-xs font-normal pt-2 pb-1 text-slate-800 select-none "
                  style={{ fontSize: "16px", fontWeight: 400 }}
                >
                  <div className="flex-1 max-w-[50%] flex items-center gap-1">
                    <span>শিক্ষার্থীর নাম: </span>
                    <span className="flex-1 border-b border-dotted border-slate-400 h-4"></span>
                  </div>
                  <div className="w-[20%] flex items-center justify-center gap-1">
                    <span>শাখা: </span>
                    <span className="w-[60%] border-b border-dotted border-slate-400 h-4"></span>
                  </div>
                  <div className="w-[20%] flex items-center justify-end gap-1">
                    <span>রোল: </span>
                    <span className="w-[60%] border-b border-dotted border-slate-400 h-4"></span>
                  </div>
                </div>
              )}

              {/* Instructions Row */}
              {layoutSettings.metadata.instructions && (
                <div className="text-center text-xs text-slate-850 font-normal border-t border-b border-dotted border-slate-400 py-1.5 mt-2 select-none">
                  প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবে না।
                </div>
              )}
            </div>

            {/* Questions List Render (Grouped by Category) */}
            {groupedQuestions && groupedQuestions.length > 0 ? (
              <div className="space-y-8">
                {groupedQuestions.map((group) => (
                  <div key={group.category} className="space-y-4">
                    {/* Section Header */}
                    <div className="text-center font-normal text-sm text-slate-800 pt-1 print:pt-0">
                      {group.label}
                    </div>

                    <div
                      className="grid gap-6 print:gap-4"
                      style={{
                        gridTemplateColumns: `repeat(${layoutSettings.columns}, minmax(0, 1fr))`,
                        columnGap: `${layoutSettings.columnGap}px`,
                      }}
                    >
                      {group.questions.map((q) => {
                        const serialNum = (q.serialNumber || 1).toLocaleString(
                          "bn-BD",
                        );
                        return (
                          <div
                            key={q._id}
                            className="relative group border border-transparent hover:border-indigo-100 hover:bg-indigo-50/10 p-2.5 rounded-xl transition print:border-none print:hover:border-none print:hover:bg-transparent print:p-0"
                            style={{
                              marginBottom: `${layoutSettings.lineSpacing}px`,
                            }}
                          >
                            {/* Remove button (Hover only) */}
                            <button
                              onClick={() => handleRemoveQuestion(q._id)}
                              className="absolute right-2 top-2 p-1.5 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 opacity-0 group-hover:opacity-100 transition print:hidden cursor-pointer"
                              title="বাদ দিন"
                            >
                              <Trash2 className="size-3.5" />
                            </button>

                            <div className="flex items-start gap-2.5 text-inherit text-slate-800">
                              <span className="font-normal text-slate-500 min-w-[20px]">
                                {serialNum}।
                              </span>
                              <div className="flex-1 space-y-2">
                                {/* MCQ format */}
                                {q.category === "MCQ" && q.mcqData && (
                                  <div className="space-y-2">
                                    <div className="font-normal">
                                      <InlineEditable
                                        value={q.mcqData.questionText}
                                        onSave={(val) =>
                                          handleSaveQuestionEdit(q, {
                                            mcqData: {
                                              ...q.mcqData,
                                              questionText: val,
                                            },
                                          })
                                        }
                                        onActivate={handleEditorActivate}
                                        onDeactivate={handleEditorDeactivate}
                                      />
                                    </div>
                                    {q.mcqData.options && (
                                      <div className="grid grid-cols-2 gap-2 text-slate-600/90 text-inherit">
                                        {q.mcqData.options.map((opt, oIdx) => {
                                          const prefix = ["ক", "খ", "গ", "ঘ"][
                                            oIdx
                                          ];
                                          return (
                                            <div
                                              key={oIdx}
                                              className="flex items-start gap-1"
                                            >
                                              <span className="font-normal text-slate-400">
                                                {layoutSettings.optionStyle ===
                                                "()"
                                                  ? `(${prefix})`
                                                  : `${prefix}${layoutSettings.optionStyle}`}
                                              </span>
                                              <div className="flex-1">
                                                <InlineEditable
                                                  value={opt}
                                                  onSave={(val) => {
                                                    const newOpts = [
                                                      ...q.mcqData.options,
                                                    ];
                                                    newOpts[oIdx] = val;
                                                    handleSaveQuestionEdit(q, {
                                                      mcqData: {
                                                        ...q.mcqData,
                                                        options: newOpts,
                                                      },
                                                    });
                                                  }}
                                                  onActivate={
                                                    handleEditorActivate
                                                  }
                                                  onDeactivate={
                                                    handleEditorDeactivate
                                                  }
                                                />
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* CQ format */}
                                {q.category === "Creative" &&
                                  q.creativeData && (
                                    <div className="space-y-2">
                                      <div className="font-medium text-slate-600 bg-slate-50 border p-2 rounded-lg italic">
                                        <InlineEditable
                                          value={q.creativeData.stem}
                                          onSave={(val) =>
                                            handleSaveQuestionEdit(q, {
                                              creativeData: {
                                                ...q.creativeData,
                                                stem: val,
                                              },
                                            })
                                          }
                                          onActivate={handleEditorActivate}
                                          onDeactivate={handleEditorDeactivate}
                                        />
                                      </div>
                                      {q.creativeData.subQuestions && (
                                        <div className="space-y-1 text-slate-700 pl-2 text-inherit">
                                          {Object.entries(
                                            q.creativeData.subQuestions,
                                          ).map(([key, sq], sqIdx) => {
                                            const letter = ["ক", "খ", "গ", "ঘ"][
                                              sqIdx
                                            ];
                                            return (
                                              <div
                                                key={key}
                                                className="flex justify-between items-baseline gap-2"
                                              >
                                                <div className="flex items-start gap-1 flex-1">
                                                  <span className="font-normal">
                                                    {letter})
                                                  </span>
                                                  <div className="flex-1 text-inherit">
                                                    <InlineEditable
                                                      value={sq.text}
                                                      onSave={(val) => {
                                                        handleSaveQuestionEdit(
                                                          q,
                                                          {
                                                            creativeData: {
                                                              ...q.creativeData,
                                                              subQuestions: {
                                                                ...q
                                                                  .creativeData
                                                                  .subQuestions,
                                                                [key]: {
                                                                  ...sq,
                                                                  text: val,
                                                                },
                                                              },
                                                            },
                                                          },
                                                        );
                                                      }}
                                                      onActivate={
                                                        handleEditorActivate
                                                      }
                                                      onDeactivate={
                                                        handleEditorDeactivate
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-normal shrink-0 font-sans">
                                                  {[1, 2, 3, 4][sqIdx]}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                {/* General format */}
                                {q.category !== "MCQ" &&
                                  q.category !== "Creative" &&
                                  q.generalData && (
                                    <div className="space-y-1">
                                      <div className="font-normal">
                                        <InlineEditable
                                          value={
                                            q.generalData.questionText || ""
                                          }
                                          onSave={(val) =>
                                            handleSaveQuestionEdit(q, {
                                              generalData: {
                                                ...q.generalData,
                                                questionText: val,
                                              },
                                            })
                                          }
                                          onActivate={handleEditorActivate}
                                          onDeactivate={handleEditorDeactivate}
                                        />
                                      </div>
                                      {q.generalData.stem && (
                                        <div className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 border rounded-lg">
                                          <InlineEditable
                                            value={q.generalData.stem}
                                            onSave={(val) =>
                                              handleSaveQuestionEdit(q, {
                                                generalData: {
                                                  ...q.generalData,
                                                  stem: val,
                                                },
                                              })
                                            }
                                            onActivate={handleEditorActivate}
                                            onDeactivate={
                                              handleEditorDeactivate
                                            }
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 bg-slate-50/20 p-8 rounded-2xl text-center py-12">
                <Info className="h-6 w-6 text-slate-350 mx-auto mb-1.5" />
                <p className="text-xs text-slate-400">
                  এই প্রশ্নসেটে এখনো কোনো প্রশ্ন যুক্ত নেই।
                </p>
                <button
                  onClick={handleGoBackToSelect}
                  className="mx-auto mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow"
                >
                  <Plus className="size-3.5" />
                  প্রশ্ন নির্বাচন করুন
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Layout Settings Sidebar */}
        <div className="w-full lg:w-[360px] lg:shrink-0 space-y-6 print:hidden lg:sticky lg:top-6">
          <div className="flex gap-1.5 p-1 bg-black/[0.02] border border-black/[0.04] rounded-2xl backdrop-blur-sm">
            {[
              { id: "settings", label: "সেটিংস", icon: Settings },
              { id: "download", label: "ডাউনলোড", icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-black transition cursor-pointer select-none ${
                    isActive
                      ? "bg-white text-indigo-600 shadow"
                      : "text-slate-500 hover:bg-black/[0.02]"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Attachment settings card */}
              <div className="bg-glass-elevated border border-slate-200/50 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Grid className="size-3.5" />
                  প্রশ্নে সংযুক্তি
                </h3>
                <div className="space-y-3">
                  {[
                    { field: "answerSheet", label: "উত্তরপত্র সংযুক্তি" },
                    { field: "omr", label: "OMR সংযুক্তি" },
                    {
                      field: "important",
                      label: "গুরুত্বপূর্ণ প্রশ্ন চিহ্নিতকরণ",
                    },
                    { field: "questionInfo", label: "প্রশ্নের তথ্য প্রদর্শন" },
                    { field: "studentInfo", label: "শিক্ষার্থীর তথ্য ঘর" },
                    { field: "marksGrid", label: "প্রাপ্ত নম্বর ঘর" },
                    { field: "subjectCode", label: "বিষয় কোড" },
                  ].map((opt) => (
                    <div
                      key={opt.field}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-700">
                        {opt.label}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSettingField(
                            "attachments",
                            opt.field,
                            !layoutSettings.attachments[opt.field],
                          )
                        }
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                          layoutSettings.attachments[opt.field]
                            ? "bg-emerald-600"
                            : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                            layoutSettings.attachments[opt.field]
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata header toggles */}
              <div className="bg-glass-elevated border border-slate-200/50 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="size-3.5" />
                  প্রশ্নের মেটাডাটা (হেডার)
                </h3>
                <div className="space-y-3">
                  {[
                    { field: "className", label: "শ্রেণির নাম" },
                    { field: "subjectName", label: "বিষয়ের নাম" },
                    { field: "chapterName", label: "অধ্যায়ের নাম" },
                    { field: "setCode", label: "সেট কোড" },
                    { field: "programName", label: "প্রোগ্রাম/পরীক্ষার নাম" },
                    { field: "instructions", label: "নির্দেশনাবলি" },
                  ].map((opt) => (
                    <div
                      key={opt.field}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-700">
                        {opt.label}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSettingField(
                            "metadata",
                            opt.field,
                            !layoutSettings.metadata[opt.field],
                          )
                        }
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                          layoutSettings.metadata[opt.field]
                            ? "bg-emerald-600"
                            : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                            layoutSettings.metadata[opt.field]
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout controls */}
              <div className="bg-glass-elevated border border-slate-200/50 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="size-3.5" />
                  ডকুমেন্ট কাস্টমাইজেশন
                </h3>
                <div className="space-y-4">
                  {/* Paper size */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">
                      কাগজের সাইজ
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {["A4", "Letter", "Legal", "A5"].map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            updateSettingField(null, "paperSize", size)
                          }
                          className={`py-1.5 border rounded-lg text-xs font-bold transition ${
                            layoutSettings.paperSize === size
                              ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-extrabold"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Columns */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">
                      কলাম বিন্যাস
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3].map((col) => (
                        <button
                          key={col}
                          onClick={() =>
                            updateSettingField(null, "columns", col)
                          }
                          className={`py-1.5 border rounded-lg text-xs font-bold transition ${
                            layoutSettings.columns === col
                              ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-extrabold"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          {col} কলাম
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">
                      বাংলা ফন্ট
                    </label>
                    <select
                      value={activeFont}
                      onChange={(e) =>
                        updateSettingField(null, "fontFamily", e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Purno">পূর্ণ (Purno)</option>
                      <option value="SutonnyMJ">
                        সুতন্বী এমজে (SutonnyMJ)
                      </option>
                      <option value="Kalpurush">কালপুরুষ (Kalpurush)</option>
                      <option value="SolaimanLipi">
                        সোলাইমান লিপি (SolaimanLipi)
                      </option>
                    </select>
                  </div>

                  {/* Prefix Prefix style */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">
                      MCQ অপশন স্টাইল
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {["●", "()", ".", ")"].map((style) => (
                        <button
                          key={style}
                          onClick={() =>
                            updateSettingField(null, "optionStyle", style)
                          }
                          className={`py-1.5 border rounded-lg text-[10px] font-black transition ${
                            layoutSettings.optionStyle === style
                              ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-extrabold"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          {style === "●" ? "ডট ডেকোরেশন" : `ক${style}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Range sliders */}
                  <div className="space-y-2 pt-2">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>লাইনের মধ্যকার ফাক</span>
                        <span className="font-sans">
                          {layoutSettings.lineSpacing}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={layoutSettings.lineSpacing}
                        onChange={(e) =>
                          updateSettingField(
                            null,
                            "lineSpacing",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-1"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>কলামের মধ্যকার গ্যাপ</span>
                        <span className="font-sans">
                          {layoutSettings.columnGap}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="40"
                        value={layoutSettings.columnGap}
                        onChange={(e) =>
                          updateSettingField(
                            null,
                            "columnGap",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "download" && (
            <div className="bg-glass-elevated border border-slate-200/50 p-6 rounded-2xl space-y-4 text-center">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-full w-fit mx-auto text-indigo-600">
                <Printer className="size-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                প্রশ্নপত্র প্রিন্ট অথবা ডাউনলোড করুন
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                আপনার নির্বাচিত সেটিংস অনুযায়ী প্রশ্নপত্রটি ডাউনলোড করতে নিচের
                বাটনে ক্লিক করুন। প্রিন্ট লেআউটে সাইডবার ও সেটিংস অংশ
                স্বয়ংক্রিয়ভাবে বাদ পড়বে।
              </p>
              <button
                onClick={handlePrint}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow shadow-indigo-500/10 flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <Printer className="size-4" />
                প্রিন্ট / PDF ডাউনলোড
              </button>
            </div>
          )}
        </div>
      </div>
      <FloatingFormatToolbar
        visible={toolbarVisible}
        position={toolbarPos}
        fontSize={layoutSettings.fontSize}
        onChangeFontSize={(newSize) =>
          updateSettingField(null, "fontSize", newSize)
        }
      />
      {/* Embedded print styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Hide non-printable panels */
          .print\\:hidden,
          .lg\\:col-span-4,
          header,
          nav,
          aside {
            display: none !important;
          }
          .lg\\:col-span-8 {
            width: 100% !important;
            max-width: 100% !important;
            flex-basis: 100% !important;
          }
          .border-slate-200\\/60 {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
