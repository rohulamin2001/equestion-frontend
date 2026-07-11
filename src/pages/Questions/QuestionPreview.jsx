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
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import RichTextRender from "../../components/RichTextRender.jsx";
import { useQuestions } from "./hook/useQuestions";

export default function QuestionPreview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const targetId = searchParams.get("setId") || "";
  const idsParam =
    searchParams.get("setId") || searchParams.get("setIds") || "";

  const {
    questionSets,
    loadingSets,
    activeSetId,
    setActiveSetId,
    activeSet,
    updateQuestionSet,
  } = useQuestions();

  // Local state for layout settings
  const [layoutSettings, setLayoutSettings] = useState({
    paperSize: "A4",
    columns: 1,
    columnDivider: true,
    lineSpacing: 0,
    columnGap: 15,
    fontSize: 14,
    fontFamily: "Bangla",
    optionStyle: "●",
    attachments: {
      answerSheet: false,
      omr: false,
      important: false,
      questionInfo: false,
      studentInfo: false,
      marksGrid: false,
      subjectCode: false,
    },
    metadata: {
      className: true,
      subjectName: true,
      chapterName: true,
      setCode: true,
      programName: true,
      instructions: true,
    },
    branding: {
      logo: false,
      header: false,
      footer: false,
      watermark: false,
      address: false,
    },
  });

  const [activeTab, setActiveTab] = useState("settings"); // settings or download

  // Set active set ID on load
  useEffect(() => {
    if (targetId && activeSetId !== targetId) {
      setActiveSetId(targetId);
    }
  }, [targetId, activeSetId, setActiveSetId]);

  // Load layout settings on mount
  useEffect(() => {
    if (activeSet?.settings) {
      setLayoutSettings(activeSet.settings);
    }
  }, [activeSet]);

  const handleSaveSettings = async (newSettings) => {
    if (!activeSetId) return;
    try {
      await updateQuestionSet.mutateAsync({
        id: activeSetId,
        payload: { settings: newSettings },
      });
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  const updateSettingField = (category, field, value) => {
    setLayoutSettings((prev) => {
      let updated;
      if (category) {
        updated = {
          ...prev,
          [category]: {
            ...prev[category],
            [field]: value,
          },
        };
      } else {
        updated = {
          ...prev,
          [field]: value,
        };
      }
      handleSaveSettings(updated);
      return updated;
    });
  };

  const handleRemoveQuestion = async (questionId) => {
    if (!activeSet) return;
    try {
      const updatedQuestions = activeSet.questions
        .filter((q) => (q._id || q) !== questionId)
        .map((q) => q._id || q);
      await updateQuestionSet.mutateAsync({
        id: activeSetId,
        payload: { questions: updatedQuestions },
      });
      toast.success("প্রশ্নটি বাদ দেওয়া হয়েছে");
    } catch (err) {
      console.error("Error removing question:", err);
      toast.error("প্রশ্ন সরাতে ব্যর্থ হয়েছে।");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAll = () => {
    toast.success("প্রশ্নপত্র সেটিংস সংরক্ষণ করা হয়েছে!");
    navigate(`/dashboard/questions?setId=${idsParam}`);
  };

  const handleGoBackToSelect = () => {
    navigate(
      `/dashboard/questions/select?setId=${activeSetId}&setIds=${idsParam}`,
    );
  };

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
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
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

      {/* Main Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative print:block print:w-full print:m-0 print:p-0">
        {/* Left Pane (8 cols): A4 Printable paper preview */}
        <div className="lg:col-span-8 space-y-4 print:w-full print:absolute print:left-0 print:top-0 print:m-0 print:p-0">
          <div className="flex justify-between items-center print:hidden border border-slate-200/50 bg-[#FBFBFC] px-4 py-3 rounded-2xl shadow-sm">
            <span className="text-xs font-black text-slate-700">
              কুইক সেটিংস
            </span>
            <button
              onClick={handleGoBackToSelect}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="size-3.5" />
              আরও প্রশ্ন যুক্ত করুন
            </button>
          </div>

          <div
            className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm print:border-none print:shadow-none print:p-0 select-none print:select-text"
            style={{
              fontFamily:
                layoutSettings.fontFamily === "English"
                  ? "Outfit, sans-serif"
                  : "Inter, sans-serif",
              fontSize: `${layoutSettings.fontSize}px`,
            }}
          >
            {/* Header Metadata block */}
            <div className="text-center space-y-2 border-b-2 border-slate-200 pb-4 mb-6">
              {layoutSettings.branding.logo && (
                <div className="mx-auto w-12 h-12 bg-indigo-50 border rounded-full flex items-center justify-center text-indigo-600 font-black text-xs">
                  LOGO
                </div>
              )}
              {layoutSettings.metadata.programName && (
                <h1 className="text-xl font-black text-slate-800 tracking-wide uppercase font-sans">
                  {activeSet.examName}
                </h1>
              )}
              {layoutSettings.metadata.className && (
                <h2 className="text-sm font-bold text-slate-600">
                  {activeSet.className}
                </h2>
              )}

              <div className="flex justify-center gap-2 flex-wrap text-xs text-slate-500 font-semibold">
                {layoutSettings.metadata.subjectName && (
                  <span>বিষয়: {activeSet.subjectName}</span>
                )}
                {layoutSettings.metadata.chapterName &&
                  activeSet.chapters?.length > 0 && (
                    <span>• অধ্যায়: {activeSet.chapters.join(", ")}</span>
                  )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-700 font-bold px-2 pt-2">
                <span>সময়: ১ ঘণ্টা ৪০ মিনিট</span>
                <span>পূর্ণমান: {activeSet.totalMarks}</span>
              </div>
              {layoutSettings.metadata.instructions && (
                <div className="text-center text-xs text-rose-500/80 font-bold border-t border-dashed mt-2 pt-2">
                  প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবে না।
                </div>
              )}
            </div>

            {/* Questions List Render */}
            {activeSet.questions && activeSet.questions.length > 0 ? (
              <div
                className={`grid gap-6 print:gap-4`}
                style={{
                  gridTemplateColumns: `repeat(${layoutSettings.columns}, minmax(0, 1fr))`,
                  columnGap: `${layoutSettings.columnGap}px`,
                }}
              >
                {activeSet.questions.map((q, idx) => {
                  const serialNum = (idx + 1).toLocaleString("bn-BD");
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

                      <div className="flex items-start gap-2.5 text-xs text-slate-800">
                        <span className="font-extrabold text-slate-500 min-w-[20px]">
                          {serialNum}।
                        </span>
                        <div className="flex-1 space-y-2">
                          {/* MCQ format */}
                          {q.category === "MCQ" && q.mcqData && (
                            <div className="space-y-2">
                              <div className="font-bold">
                                <RichTextRender html={q.mcqData.questionText} />
                              </div>
                              {q.mcqData.options && (
                                <div className="grid grid-cols-2 gap-2 text-slate-600 text-[13px]">
                                  {q.mcqData.options.map((opt, oIdx) => {
                                    const prefix = ["ক", "খ", "গ", "ঘ"][oIdx];
                                    return (
                                      <div
                                        key={oIdx}
                                        className="flex items-start gap-1"
                                      >
                                        <span className="font-black text-slate-400">
                                          {layoutSettings.optionStyle === "()"
                                            ? `(${prefix})`
                                            : `${prefix}${layoutSettings.optionStyle}`}
                                        </span>
                                        <span>{opt}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* CQ format */}
                          {q.category === "Creative" && q.creativeData && (
                            <div className="space-y-2">
                              <div className="font-medium text-slate-600 bg-slate-50 border p-2 rounded-lg italic">
                                <RichTextRender html={q.creativeData.stem} />
                              </div>
                              {q.creativeData.subQuestions && (
                                <div className="space-y-1 text-slate-700 pl-2 text-[13px]">
                                  {Object.entries(
                                    q.creativeData.subQuestions,
                                  ).map(([key, sq], sqIdx) => {
                                    const letter = ["ক", "খ", "গ", "ঘ"][sqIdx];
                                    return (
                                      <div
                                        key={key}
                                        className="flex justify-between items-baseline gap-2"
                                      >
                                        <div className="flex items-start gap-1">
                                          <span className="font-bold">
                                            {letter})
                                          </span>
                                          <span className="text-[13px]">
                                            {sq.text}
                                          </span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold shrink-0 font-sans">
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
                                <div className="font-bold">
                                  <RichTextRender
                                    html={q.generalData.questionText}
                                  />
                                </div>
                                {q.generalData.stem && (
                                  <div className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 border rounded-lg">
                                    <RichTextRender html={q.generalData.stem} />
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

        {/* Right Pane (4 cols): Layout Settings Sidebar */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
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
