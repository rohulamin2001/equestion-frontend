import {
  Award,
  ChevronDown,
  ChevronLeft,
  Download,
  FileText,
  Info,
  LayoutGrid,
  Loader2,
  Plus,
  Printer,
  Settings,
  Sliders,
  X,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import FloatingFormatToolbar from "../../components/FloatingFormatToolbar.jsx";
import InlineEditable from "../../components/InlineEditable.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu.jsx";
import { translateSubscriptionKey } from "../../constants/subscriptions.js";
import { useQuestionPreview } from "./hook/useQuestionPreview";

const PAPER_SIZES_META = [
  { id: "A4", label: "A4", w: 34, h: 48 },
  { id: "Letter", label: "Letter", w: 37, h: 48 },
  { id: "Legal", label: "Legal", w: 29, h: 48 },
  { id: "A5", label: "A5", w: 27, h: 38 },
];

// Helper to parse Bengali numerals as standard numbers
const parseBanglaNumber = (val) => {
  if (!val) return 0;
  let cleanStr = String(val)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  const digitsOnly = cleanStr.match(/[০-৯0-9]/g);
  if (!digitsOnly) return 0;
  const digitsStr = digitsOnly.join("");

  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const englishStr = digitsStr.replace(/[০-৯]/g, (d) =>
    String(banglaDigits.indexOf(d)),
  );

  const parsed = Number(englishStr);
  return isNaN(parsed) ? 0 : parsed;
};

const getChapterNames = (set, syllabusList) => {
  if (!set.chapters || set.chapters.length === 0) return "";
  const targetSubjectId = set.subjectId?._id || set.subjectId;
  const matchingSyllabus = syllabusList?.find(
    (s) =>
      s.className === set.className &&
      (s.subjectId?._id === targetSubjectId || s.subjectId === targetSubjectId),
  );
  if (!matchingSyllabus || !matchingSyllabus.chapters) {
    return `অধ্যায়: ${set.chapters.join(", ")}`;
  }
  const names = set.chapters.map((chapNum) => {
    const chap = matchingSyllabus.chapters.find(
      (c) =>
        c.chapterNumber === chapNum ||
        String(c.chapterNumber) === String(chapNum),
    );
    return chap ? chap.chapterName : `অধ্যায় ${chapNum}`;
  });
  return names.join(", ");
};

const getCategoryMarkLabel = (category, count) => {
  const toBengaliNumber = (num) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(num)
      .split("")
      .map((d) => (d >= "0" && d <= "9" ? banglaDigits[Number(d)] : d))
      .join("");
  };

  if (category === "MCQ") {
    return `${toBengaliNumber(count)} × ১ = ${toBengaliNumber(count)}`;
  }
  if (category === "ShortAnswer") {
    return `${toBengaliNumber(count)} × ২ = ${toBengaliNumber(count * 2)}`;
  }
  if (category === "Creative") {
    return `${toBengaliNumber(count)} × ১০ = ${toBengaliNumber(count * 10)}`;
  }
  return "";
};

const DefaultLogo = () => (
  <svg
    className="w-full h-full text-slate-700"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

export default function QuestionPreview() {
  const [customGroupLabels, setCustomGroupLabels] = useState({});
  const [customGroupMarks, setCustomGroupMarks] = useState({});
  const [customSubMarks, setCustomSubMarks] = useState({});
  const [isPageSetupOpen, setIsPageSetupOpen] = useState(false);
  const [isLogoSettingsOpen, setIsLogoSettingsOpen] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  const handleDragStart = (e) => {
    setIsDraggingLogo(true);
    updateDragPosition(e);
  };

  const handleDragEnd = () => {
    setIsDraggingLogo(false);
  };

  const updateDragPosition = (e) => {
    const container = document.getElementById("logo-drag-container");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)));

    updateSettingField("logoSettings", "x", x);
    updateSettingField("logoSettings", "y", y);
  };

  const handleDragMove = (e) => {
    if (!isDraggingLogo) return;
    updateDragPosition(e);
  };

  const handleDragTouchMove = (e) => {
    if (!isDraggingLogo) return;
    if (e.cancelable) e.preventDefault();
    updateDragPosition(e);
  };

  const {
    loadingSets,
    activeSet,
    layoutSettings,
    activeTab,
    setActiveTab,
    toolbarVisible,
    toolbarPos,
    groupedQuestions,
    handleEditorActivate,
    handleEditorDeactivate,
    handleSaveSetField,
    handleSaveQuestionEdit,
    updateSettingField,
    handlePrint,
    handleSaveAll,
    handleGoBackToSelect,
    userProfile,
    syllabusList,
  } = useQuestionPreview();

  const handleSaveSubjectCodeDigit = (index, char) => {
    const cleanedChar = char ? String(char).trim().charAt(0) : "";
    let codeStr = String(activeSet.subjectCode || "১০১");
    while (codeStr.length < 3) codeStr += " ";
    const codeArr = codeStr.split("");
    codeArr[index] = cleanedChar || " ";
    const newCode = codeArr.join("");
    handleSaveSetField("subjectCode", newCode);
  };

  const FONT_OPTIONS = [
    { value: "SolaimanLipi", label: "সোলাইমান লিপি (SolaimanLipi)" },
    { value: "Nikosh", label: "নিকোষ (Nikosh)" },
    { value: "SutonnyMJ", label: "সুতন্বী এমজে (SutonnyMJ)" },
    { value: "Kalpurush", label: "কালপুরুষ (Kalpurush)" },
    { value: "TiroBangla", label: "তিরো বাংলা (TiroBangla)" },
    { value: "Purno", label: "পূর্ণ (Purno)" },
  ];

  const activeFont = FONT_OPTIONS.some(
    (f) => f.value === layoutSettings.fontFamily,
  )
    ? layoutSettings.fontFamily
    : "SolaimanLipi";

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
            className={`question-paper-container ${layoutSettings.fontFamily === "English" ? "is-english" : `font-family-${activeFont}`} bg-white text-black border border-slate-200/60 p-8 shadow-sm print:border-none print:shadow-none print:p-0 select-none print:select-text`}
            style={{
              fontFamily:
                layoutSettings.fontFamily === "English"
                  ? "Outfit, sans-serif"
                  : `'${activeFont}', 'Purno', 'SutonnyMJ', 'SutonnyMJ-Regular', 'Kalpurush', 'SolaimanLipi', sans-serif`,
              fontSize: `${layoutSettings.fontSize}px`,
              paddingTop: `${layoutSettings.pagePaddingTop !== undefined ? layoutSettings.pagePaddingTop : 32}px`,
              paddingBottom: `${layoutSettings.pagePaddingBottom !== undefined ? layoutSettings.pagePaddingBottom : 32}px`,
              paddingLeft: `${layoutSettings.pagePaddingLeft !== undefined ? layoutSettings.pagePaddingLeft : 32}px`,
              paddingRight: `${layoutSettings.pagePaddingRight !== undefined ? layoutSettings.pagePaddingRight : 32}px`,
            }}
          >
            <div className="space-y-3 mb-6 select-none">
              {/* Three-column Top Layout */}
              <div className="grid grid-cols-12 items-center gap-2 relative">
                {layoutSettings.branding.logo &&
                  layoutSettings.logoSettings.positionType === "drag" && (
                    <div
                      className="absolute print:absolute select-none pointer-events-none"
                      style={{
                        left: `${layoutSettings.logoSettings.x}%`,
                        top: `${layoutSettings.logoSettings.y}%`,
                        width: `${layoutSettings.logoSettings.size}px`,
                        height: `${layoutSettings.logoSettings.size}px`,
                        opacity: layoutSettings.logoSettings.opacity / 100,
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                      }}
                    >
                      {layoutSettings.logoSettings.logoUrl ? (
                        <img
                          src={layoutSettings.logoSettings.logoUrl}
                          className="w-full h-full object-contain"
                          alt="Logo"
                        />
                      ) : (
                        <DefaultLogo />
                      )}
                    </div>
                  )}
                {/* Left Column: Obtained Marks */}
                <div className="col-span-3 flex flex-col justify-start items-start">
                  {layoutSettings.branding.logo &&
                    layoutSettings.logoSettings.positionType === "simple" &&
                    layoutSettings.logoSettings.position === "left" && (
                      <div
                        className="mb-1.5"
                        style={{
                          width: `${layoutSettings.logoSettings.size}px`,
                          height: `${layoutSettings.logoSettings.size}px`,
                          opacity: layoutSettings.logoSettings.opacity / 100,
                        }}
                      >
                        {layoutSettings.logoSettings.logoUrl ? (
                          <img
                            src={layoutSettings.logoSettings.logoUrl}
                            className="w-full h-full object-contain"
                            alt="Logo"
                          />
                        ) : (
                          <DefaultLogo />
                        )}
                      </div>
                    )}
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
                  className="col-span-6 text-center space-y-0.5 flex flex-col items-center justify-center"
                  style={{ lineHeight: "1.25" }}
                >
                  {layoutSettings.branding.logo &&
                    layoutSettings.logoSettings.positionType === "simple" &&
                    layoutSettings.logoSettings.position === "center" && (
                      <div
                        className="mb-1.5"
                        style={{
                          width: `${layoutSettings.logoSettings.size}px`,
                          height: `${layoutSettings.logoSettings.size}px`,
                          opacity: layoutSettings.logoSettings.opacity / 100,
                        }}
                      >
                        {layoutSettings.logoSettings.logoUrl ? (
                          <img
                            src={layoutSettings.logoSettings.logoUrl}
                            className="w-full h-full object-contain"
                            alt="Logo"
                          />
                        ) : (
                          <DefaultLogo />
                        )}
                      </div>
                    )}
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
                      className="text-black tracking-wide uppercase block text-center"
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
                        className="text-black tracking-wide block text-center"
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
                        className="text-black block text-center"
                        style={{ fontSize: "18px", fontWeight: 400 }}
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
                        className="text-black block text-center"
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
                            ? getChapterNames(activeSet, syllabusList)
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
                        className="text-black font-normal block text-center"
                        style={{ fontSize: "16px" }}
                        placeholder="অধ্যায় নম্বর"
                        renderRichText={false}
                        inline={false}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column: Set Code and Subject Code Stacked */}
                <div className="col-span-3 flex flex-col items-end gap-1.5">
                  {layoutSettings.branding.logo &&
                    layoutSettings.logoSettings.positionType === "simple" &&
                    layoutSettings.logoSettings.position === "right" && (
                      <div
                        className="mb-1.5"
                        style={{
                          width: `${layoutSettings.logoSettings.size}px`,
                          height: `${layoutSettings.logoSettings.size}px`,
                          opacity: layoutSettings.logoSettings.opacity / 100,
                        }}
                      >
                        {layoutSettings.logoSettings.logoUrl ? (
                          <img
                            src={layoutSettings.logoSettings.logoUrl}
                            className="w-full h-full object-contain"
                            alt="Logo"
                          />
                        ) : (
                          <DefaultLogo />
                        )}
                      </div>
                    )}
                  {/* Set Code */}
                  {layoutSettings.metadata.setCode ? (
                    <div
                      className="flex items-center gap-1.5 font-normal text-black"
                      style={{ fontSize: "16px", fontWeight: 400 }}
                    >
                      <span>সেট কোড:</span>
                      <InlineEditable
                        value={activeSet.setCode || "ক"}
                        onSave={(val) => handleSaveSetField("setCode", val)}
                        onActivate={handleEditorActivate}
                        onDeactivate={handleEditorDeactivate}
                        renderRichText={false}
                        className="w-6 h-6 border-2 border-black flex items-center justify-center bg-white text-base font-bold text-center !px-0 !mx-0 !border-black !bg-white !rounded-none select-text"
                        style={{ fontSize: "16px", fontWeight: 700 }}
                        placeholder="ক"
                        inline={false}
                        singleLine={true}
                      />
                    </div>
                  ) : (
                    <div className="h-5"></div>
                  )}

                  {/* Subject Code */}
                  {layoutSettings.attachments.subjectCode ? (
                    <div
                      className="flex items-center gap-1.5 font-normal text-black"
                      style={{ fontSize: "16px", fontWeight: 400 }}
                    >
                      <span>বিষয় কোড :</span>
                      <div className="flex gap-0 font-sans font-normal">
                        {[0, 1, 2].map((i) => {
                          const codeVal = String(
                            activeSet.subjectCode || "১০১",
                          );
                          const digit = codeVal[i] || "";
                          const borderClass =
                            i === 0
                              ? "border-2 border-black !border-2 !border-black"
                              : "border-2 border-l-0 border-black !border-2 !border-l-0 !border-black";
                          return (
                            <InlineEditable
                              key={i}
                              value={digit}
                              onSave={(val) =>
                                handleSaveSubjectCodeDigit(i, val)
                              }
                              onActivate={handleEditorActivate}
                              onDeactivate={handleEditorDeactivate}
                              renderRichText={false}
                              className={`w-6 h-6 flex items-center justify-center bg-white text-base font-bold text-center !px-0 !mx-0 !bg-white !rounded-none select-text ${borderClass}`}
                              style={{ fontSize: "16px", fontWeight: 700 }}
                              placeholder=""
                              inline={false}
                              singleLine={true}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
              </div>

              {/* Time and Marks Row */}
              <div
                className="flex justify-between items-center text-black font-normal   mt-2"
                style={{ fontSize: "16px", fontWeight: 400 }}
              >
                <div className="flex items-center gap-1">
                  <InlineEditable
                    value={
                      layoutSettings.examTime
                        ? layoutSettings.examTime.startsWith("সময়")
                          ? layoutSettings.examTime
                          : `সময়— ${layoutSettings.examTime}`
                        : "সময়— ১ ঘণ্টা ৫০ মিনিট"
                    }
                    onSave={(val) => updateSettingField(null, "examTime", val)}
                    onActivate={handleEditorActivate}
                    onDeactivate={handleEditorDeactivate}
                    renderRichText={false}
                    className="font-normal"
                    style={{ fontSize: "16px", fontWeight: 400 }}
                    placeholder="সময়— ১ ঘণ্টা ৫০ মিনিট"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <InlineEditable
                    value={
                      layoutSettings.totalMarksLabel !== undefined
                        ? layoutSettings.totalMarksLabel
                        : `পূর্ণমান— ${
                            activeSet.totalMarks
                              ? Number(activeSet.totalMarks).toLocaleString(
                                  "bn-BD",
                                )
                              : "৭৯"
                          }`
                    }
                    onSave={(val) => {
                      updateSettingField(null, "totalMarksLabel", val);
                      handleSaveSetField("totalMarks", parseBanglaNumber(val));
                    }}
                    onActivate={handleEditorActivate}
                    onDeactivate={handleEditorDeactivate}
                    renderRichText={false}
                    className="font-normal"
                    style={{ fontSize: "16px", fontWeight: 400 }}
                    placeholder="পূর্ণমান— ১০০"
                  />
                </div>
              </div>

              {/* Student Info Row */}
              {layoutSettings.attachments.studentInfo && (
                <div
                  className="flex justify-between items-baseline text-xs font-normal pb-2 text-black"
                  style={{ fontSize: "16px", fontWeight: 400, margin: "0" }}
                >
                  <div className="flex-1 max-w-[55%] flex items-baseline gap-0">
                    <InlineEditable
                      value={activeSet.studentNameLabel || "শিক্ষার্থীর নাম:"}
                      onSave={(val) =>
                        handleSaveSetField("studentNameLabel", val)
                      }
                      onActivate={handleEditorActivate}
                      onDeactivate={handleEditorDeactivate}
                      renderRichText={false}
                      className="shrink-0 font-normal !border-none !bg-transparent !shadow-none !px-0 !mx-0 h-5 leading-5"
                      style={{ fontSize: "16px", fontWeight: 400 }}
                      placeholder="শিক্ষার্থীর নাম:"
                      inline={false}
                    />
                    <div className="flex-grow border-b border-dotted border-black pb-0 min-w-[120px]">
                      <InlineEditable
                        value={activeSet.studentNameValue || ""}
                        onSave={(val) =>
                          handleSaveSetField("studentNameValue", val)
                        }
                        onActivate={handleEditorActivate}
                        onDeactivate={handleEditorDeactivate}
                        renderRichText={false}
                        className="font-normal w-full block !border-none !bg-transparent !shadow-none !px-0 !mx-0 h-5 leading-5"
                        style={{ fontSize: "16px", fontWeight: 400 }}
                        placeholder=""
                        inline={false}
                      />
                    </div>
                  </div>
                  <div className="w-[22%] flex items-baseline justify-center gap-0">
                    <InlineEditable
                      value={activeSet.sectionLabel || "শাখা:"}
                      onSave={(val) => handleSaveSetField("sectionLabel", val)}
                      onActivate={handleEditorActivate}
                      onDeactivate={handleEditorDeactivate}
                      renderRichText={false}
                      className="shrink-0 font-normal !border-none !bg-transparent !shadow-none !px-0 !mx-0 h-5 leading-5"
                      style={{ fontSize: "16px", fontWeight: 400 }}
                      placeholder="শাখা:"
                      inline={false}
                    />
                    <div className="flex-grow max-w-[120px] border-b border-dotted border-black pb-0">
                      <InlineEditable
                        value={activeSet.sectionValue || ""}
                        onSave={(val) =>
                          handleSaveSetField("sectionValue", val)
                        }
                        onActivate={handleEditorActivate}
                        onDeactivate={handleEditorDeactivate}
                        renderRichText={false}
                        className="font-normal w-full block !border-none !bg-transparent !shadow-none !px-0 !mx-0 h-5 leading-5"
                        style={{ fontSize: "16px", fontWeight: 400 }}
                        placeholder=""
                        inline={false}
                      />
                    </div>
                  </div>
                  <div className="w-[20%] flex items-baseline justify-end gap-0">
                    <InlineEditable
                      value={activeSet.rollLabel || "রোল:"}
                      onSave={(val) => handleSaveSetField("rollLabel", val)}
                      onActivate={handleEditorActivate}
                      onDeactivate={handleEditorDeactivate}
                      renderRichText={false}
                      className="shrink-0 font-normal !border-none !bg-transparent !shadow-none !px-0 !mx-0 h-5 leading-5"
                      style={{ fontSize: "16px", fontWeight: 400 }}
                      placeholder="রোল:"
                      inline={false}
                    />
                    <div className="w-[60%] border-b border-dotted border-black pb-0">
                      <InlineEditable
                        value={activeSet.rollValue || ""}
                        onSave={(val) => handleSaveSetField("rollValue", val)}
                        onActivate={handleEditorActivate}
                        onDeactivate={handleEditorDeactivate}
                        renderRichText={false}
                        className="font-normal w-full block !border-none !bg-transparent !shadow-none !px-0 !mx-0 h-5 leading-5"
                        style={{ fontSize: "16px", fontWeight: 400 }}
                        placeholder=""
                        inline={false}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Separator Line */}
              <hr className="border-t border-black" style={{ margin: 0 }} />

              {/* Instructions Row */}
              {layoutSettings.metadata.instructions && (
                <div className="text-center select-none">
                  <InlineEditable
                    value={
                      activeSet.instructionsText ||
                      "প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবে না।"
                    }
                    onSave={(val) =>
                      handleSaveSetField("instructionsText", val)
                    }
                    onActivate={handleEditorActivate}
                    onDeactivate={handleEditorDeactivate}
                    renderRichText={false}
                    className="font-bold text-center block"
                    style={{ fontSize: "14px", fontWeight: 700 }}
                    placeholder="নির্দেশনা"
                    inline={false}
                  />
                </div>
              )}
            </div>

            {/* Questions List Render (Grouped by Category) */}
            {groupedQuestions && groupedQuestions.length > 0 ? (
              <div className="space-y-8">
                {groupedQuestions.map((group) => (
                  <div key={group.category} className="">
                    {/* Section Header */}
                    <div className="flex justify-between items-baseline font-bold text-sm text-black pt-1 print:pt-0 font-bengali select-text print:select-text">
                      <span>
                        <InlineEditable
                          value={
                            customGroupLabels[group.category] !== undefined
                              ? customGroupLabels[group.category]
                              : group.label === "সৃজনশীল প্রশ্ন"
                                ? "সৃজনশীল অংশ:"
                                : group.label === "বহু নির্বাচনী প্রশ্ন"
                                  ? "বহুনির্বাচনি অংশ:"
                                  : group.label === "সংক্ষিপ্ত উত্তর প্রশ্ন"
                                    ? "সংক্ষিপ্ত প্রশ্ন গুলোর উত্তর লিখ:"
                                    : group.label
                          }
                          onSave={(val) => {
                            setCustomGroupLabels((prev) => ({
                              ...prev,
                              [group.category]: val,
                            }));
                          }}
                          onActivate={handleEditorActivate}
                          onDeactivate={handleEditorDeactivate}
                          renderRichText={false}
                          className="font-bold text-sm text-black"
                          inline={true}
                          placeholder="শিরোনাম"
                        />
                      </span>
                      {getCategoryMarkLabel(
                        group.category,
                        group.questions.length,
                      ) && (
                        <span>
                          <InlineEditable
                            value={
                              customGroupMarks[group.category] !== undefined
                                ? customGroupMarks[group.category]
                                : getCategoryMarkLabel(
                                    group.category,
                                    group.questions.length,
                                  )
                            }
                            onSave={(val) => {
                              setCustomGroupMarks((prev) => ({
                                ...prev,
                                [group.category]: val,
                              }));
                            }}
                            onActivate={handleEditorActivate}
                            onDeactivate={handleEditorDeactivate}
                            renderRichText={false}
                            className="font-semibold text-xs text-black font-sans print:font-sans"
                            inline={true}
                            placeholder="মান বণ্টন"
                          />
                        </span>
                      )}
                    </div>

                    <div
                      className="block"
                      style={{
                        columnCount: layoutSettings.columns,
                        columnGap: `${layoutSettings.columnGap || 15}px`,
                        columnRule:
                          layoutSettings.columns > 1 &&
                          layoutSettings.columnDivider
                            ? "1px solid black"
                            : "none",
                      }}
                    >
                      {group.questions.map((q) => {
                        const serialNum = (() => {
                          const num = q.serialNumber || 1;
                          const padded = num < 10 ? `0${num}` : String(num);
                          const banglaDigits = [
                            "০",
                            "১",
                            "২",
                            "৩",
                            "৪",
                            "৫",
                            "৬",
                            "৭",
                            "৮",
                            "৯",
                          ];
                          return padded
                            .split("")
                            .map((char) =>
                              char >= "0" && char <= "9"
                                ? banglaDigits[Number(char)]
                                : char,
                            )
                            .join("");
                        })();
                        return (
                          <div
                            key={q._id}
                            className="relative group border border-transparent hover:border-indigo-100 hover:bg-indigo-50/10 py-0.5 px-2 rounded-xl transition print:border-none print:hover:border-none print:hover:bg-transparent print:p-0"
                            style={{
                              marginBottom: `${layoutSettings.lineSpacing}px`,
                              breakInside: "avoid",
                              pageBreakInside: "avoid",
                            }}
                          >
                            <div className="flex items-start gap-2.5 text-inherit text-black">
                              <span className="font-normal text-black min-w-[20px]">
                                {serialNum}.
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
                                      <div className="grid grid-cols-2 gap-2 text-black text-inherit">
                                        {q.mcqData.options.map((opt, oIdx) => {
                                          const prefix = ["ক", "খ", "গ", "ঘ"][
                                            oIdx
                                          ];
                                          return (
                                            <div
                                              key={oIdx}
                                              className="flex items-start gap-1"
                                            >
                                              <span className="font-normal text-black">
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
                                      <div className="font-medium text-black bg-slate-50 border p-2 rounded-lg italic">
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
                                        <div className="space-y-1 text-black pl-2 text-inherit">
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
                                                <span>
                                                  <InlineEditable
                                                    value={
                                                      customSubMarks[
                                                        `${q._id}-${sqIdx}`
                                                      ] !== undefined
                                                        ? customSubMarks[
                                                            `${q._id}-${sqIdx}`
                                                          ]
                                                        : ["১", "২", "৩", "৪"][
                                                            sqIdx
                                                          ]
                                                    }
                                                    onSave={(val) => {
                                                      setCustomSubMarks(
                                                        (prev) => ({
                                                          ...prev,
                                                          [`${q._id}-${sqIdx}`]:
                                                            val,
                                                        }),
                                                      );
                                                    }}
                                                    onActivate={
                                                      handleEditorActivate
                                                    }
                                                    onDeactivate={
                                                      handleEditorDeactivate
                                                    }
                                                    renderRichText={false}
                                                    className="text-[10px] text-black font-normal shrink-0 font-sans print:font-sans"
                                                    inline={true}
                                                    placeholder="নম্বর"
                                                  />
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
                                        <div className="text-[11px] text-black italic bg-slate-50 p-1.5 border rounded-lg">
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
        <div className="w-full lg:w-[360px] lg:shrink-0 print:hidden lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] lg:flex lg:flex-col gap-4">
          <div className="flex gap-1.5 p-1 bg-black/[0.02] border border-black/[0.04] rounded-2xl backdrop-blur-sm shrink-0">
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

          <div className="flex-1 lg:overflow-y-auto pr-1 min-h-0 custom-sidebar-scrollbar">
            {activeTab === "settings" && (
              <div className="bg-glass-elevated border border-slate-200/50 p-5 rounded-2xl divide-y divide-slate-200/60 space-y-5">
                {/* Attachment settings card */}
                <div className="space-y-3.5">
                  <h3 className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", boxShadow: "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)", border: "1px solid rgba(167,139,250,0.4)" }}>
                    <LayoutGrid className="size-4 text-white" />
                    <span>প্রশ্নে সংযুক্তি</span>
                  </h3>
                  <div className="space-y-2">
                    {[
                      { field: "answerSheet", label: "উত্তরপত্র সংযুক্তি" },
                      { field: "omr", label: "OMR সংযুক্তি" },
                      {
                        field: "important",
                        label: "গুরুত্বপূর্ণ প্রশ্ন চিহ্নিতকরণ",
                      },
                      {
                        field: "questionInfo",
                        label: "প্রশ্নের তথ্য প্রদর্শন",
                      },
                      { field: "studentInfo", label: "শিক্ষার্থীর তথ্য" },
                      { field: "marksGrid", label: "প্রাপ্ত নম্বর" },
                      { field: "subjectCode", label: "বিষয় কোড" },
                    ].map((opt) => (
                      <div
                        key={opt.field}
                        className="flex items-center justify-between p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/40 rounded-xl transition shadow-sm"
                      >
                        <span className="text-[14px] font-semibold text-slate-700 font-sans tracking-tight">
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
                <div className="space-y-3.5 pt-5">
                  <h3 className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", boxShadow: "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)", border: "1px solid rgba(167,139,250,0.4)" }}>
                    <FileText className="size-4 text-white" />
                    <span>প্রশ্নের মেটাডাটা (হেডার)</span>
                  </h3>
                  <div className="space-y-2">
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
                        className="flex items-center justify-between p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/40 rounded-xl transition shadow-sm"
                      >
                        <span className="text-[14px] font-semibold text-slate-700 font-sans tracking-tight">
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
                <div className="space-y-3.5 pt-5">
                  <h3 className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", boxShadow: "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)", border: "1px solid rgba(167,139,250,0.4)" }}>
                    <Sliders className="size-4 text-white" />
                    <span>ডকুমেন্ট কাস্টমাইজেশন</span>
                  </h3>
                  <div className="space-y-3">
                    {/* Paper size */}
                    <div className="space-y-1.5 p-3 bg-slate-50/50 border border-slate-200/40 rounded-xl shadow-sm">
                      <label className="text-[12px] font-extrabold text-slate-600 block font-bengali">
                        কাগজের সাইজ
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {PAPER_SIZES_META.map((paper) => {
                          const isSelected =
                            layoutSettings.paperSize === paper.id;
                          return (
                            <button
                              key={paper.id}
                              onClick={() =>
                                updateSettingField(null, "paperSize", paper.id)
                              }
                              className={`flex flex-col items-center justify-center p-2 border rounded-xl transition cursor-pointer select-none ${
                                isSelected
                                  ? "bg-emerald-50/60 border-emerald-500 text-emerald-700 font-extrabold shadow-sm"
                                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                              }`}
                            >
                              <div className="h-14 w-full flex items-center justify-center bg-slate-50/50 rounded-lg mb-1.5 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div
                                  className={`bg-white border border-slate-300 rounded shadow-sm transition-all ${
                                    isSelected
                                      ? "border-emerald-300 bg-emerald-50/10"
                                      : ""
                                  }`}
                                  style={{
                                    width: `${paper.w}px`,
                                    height: `${paper.h}px`,
                                  }}
                                />
                              </div>
                              <span className="text-[11px] font-bold">
                                {paper.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Page Setup trigger button */}
                    <button
                      type="button"
                      onClick={() => setIsPageSetupOpen(true)}
                      className="w-full flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl hover:bg-slate-100 transition shadow-sm cursor-pointer select-none"
                    >
                      <div className="">
                        <span className="text-xs font-semibold text-slate-700 font-sans tracking-tight">
                          Page Setup
                        </span>
                      </div>
                      <Sliders className="size-4 text-slate-700" />
                    </button>

                    {/* Columns layout cards */}
                    <div className="space-y-1.5 p-3 bg-slate-50/50 border border-slate-200/40 rounded-xl shadow-sm">
                      <label className="text-[12px] font-extrabold text-slate-600 block font-bengali">
                        কলাম বিন্যাস
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          {
                            id: 1,
                            label: "১ কলাম",
                            content: (
                              <div className="h-8 w-6 bg-slate-300 rounded-sm shadow-sm" />
                            ),
                          },
                          {
                            id: 2,
                            label: "২ কলাম",
                            content: (
                              <div className="flex gap-1.5">
                                <div className="h-8 w-2.5 bg-slate-300 rounded-sm shadow-sm" />
                                <div className="h-8 w-2.5 bg-slate-300 rounded-sm shadow-sm" />
                              </div>
                            ),
                          },
                          {
                            id: 3,
                            label: "৩ কলাম",
                            content: (
                              <div className="flex gap-1">
                                <div className="h-8 w-1.5 bg-slate-300 rounded-sm shadow-sm" />
                                <div className="h-8 w-1.5 bg-slate-300 rounded-sm shadow-sm" />
                                <div className="h-8 w-1.5 bg-slate-300 rounded-sm shadow-sm" />
                              </div>
                            ),
                          },
                        ].map((col) => {
                          const isSelected = layoutSettings.columns === col.id;
                          return (
                            <button
                              key={col.id}
                              onClick={() =>
                                updateSettingField(null, "columns", col.id)
                              }
                              className={`flex flex-col items-center justify-center p-2 border rounded-xl transition cursor-pointer select-none ${
                                isSelected
                                  ? "bg-emerald-50/60 border-emerald-500 text-emerald-700 font-extrabold shadow-sm"
                                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                              }`}
                            >
                              <div className="h-14 w-full flex items-center justify-center bg-slate-50/50 rounded-lg mb-1.5 border border-slate-100 shadow-sm relative overflow-hidden">
                                {col.content}
                              </div>
                              <span className="text-[11px] font-bold">
                                {col.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column Divider card with sliders */}
                    <div className="p-3 bg-slate-50/50 border border-slate-200/40 rounded-xl shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-semibold text-slate-700 font-sans tracking-tight">
                          কলাম ডিভাইডার
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateSettingField(
                              null,
                              "columnDivider",
                              !layoutSettings.columnDivider,
                            )
                          }
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                            layoutSettings.columnDivider
                              ? "bg-emerald-600"
                              : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                              layoutSettings.columnDivider
                                ? "translate-x-4"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Gaps box */}
                      <div className="border border-slate-200/60 bg-white rounded-xl p-3 space-y-3">
                        {/* Question Bottom Gap slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11.5px] font-semibold text-slate-600 font-sans tracking-tight">
                            <span>প্রশ্নের নিচের গ্যাপ</span>
                            <span className="font-sans text-[11px] text-slate-500">
                              {layoutSettings.lineSpacing}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={layoutSettings.lineSpacing}
                            onChange={(e) =>
                              updateSettingField(
                                null,
                                "lineSpacing",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
                          />
                        </div>

                        {/* Column Gap slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11.5px] font-semibold text-slate-600 font-sans tracking-tight">
                            <span>কলামের গ্যাপ</span>
                            <span className="font-sans text-[11px] text-slate-500">
                              {layoutSettings.columnGap}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="40"
                            value={layoutSettings.columnGap}
                            onChange={(e) =>
                              updateSettingField(
                                null,
                                "columnGap",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Font Selection */}
                    <div className="space-y-1.5 p-3 bg-slate-50/50 border border-slate-200/40 rounded-xl shadow-sm">
                      <label className="text-[10px] font-bold text-slate-500 block">
                        বাংলা ফন্ট
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-full h-9 px-3 border border-slate-200 bg-white hover:border-indigo-400 focus:outline-none transition-all rounded-xl text-xs font-bold text-slate-700 flex justify-between items-center shadow-sm cursor-pointer select-none">
                            <span>
                              {FONT_OPTIONS.find((f) => f.value === activeFont)
                                ?.label || activeFont}
                            </span>
                            <ChevronDown className="size-3.5 text-slate-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                          {FONT_OPTIONS.map((font) => {
                            const isSelected = activeFont === font.value;
                            return (
                              <DropdownMenuItem
                                key={font.value}
                                onSelect={() =>
                                  updateSettingField(
                                    null,
                                    "fontFamily",
                                    font.value,
                                  )
                                }
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 group ${
                                  isSelected
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-700"
                                }`}
                              >
                                <span>{font.label}</span>
                                {isSelected && (
                                  <span className="size-1.5 rounded-full bg-indigo-500" />
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Prefix Prefix style */}
                    <div className="space-y-1.5 p-3 bg-slate-50/50 border border-slate-200/40 rounded-xl shadow-sm">
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
                                ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                : "bg-white border-slate-200 text-slate-600"
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font sizes */}
                    <div className="space-y-1.5 p-3 bg-slate-50/50 border border-slate-200/40 rounded-xl shadow-sm">
                      <div className="flex justify-between text-[12px] font-bold text-slate-600 font-bengali">
                        <span>ফন্ট সাইজ</span>
                        <span className="font-sans">
                          {layoutSettings.fontSize}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={layoutSettings.fontSize}
                        onChange={(e) =>
                          updateSettingField(
                            null,
                            "fontSize",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Branding controls */}
                <div className="space-y-3.5 pt-5">
                  <h3 className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", boxShadow: "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)", border: "1px solid rgba(167,139,250,0.4)" }}>
                    <Award className="size-4 text-white" />
                    <span>ব্র্যান্ডিং</span>
                  </h3>
                  <div className="space-y-2">
                    {[
                      { field: "logo", label: "লোগো", hasConfig: true },
                      { field: "header", label: "হেডার", hasConfig: true },
                      { field: "footer", label: "ফুটার", hasConfig: true },
                      { field: "watermark", label: "জলছাপ", hasConfig: true },
                      { field: "address", label: "ঠিকানা", hasConfig: false },
                    ].map((opt) => (
                      <div
                        key={opt.field}
                        className="flex items-center justify-between p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/40 rounded-xl transition shadow-sm"
                      >
                        <span className="text-[13px] font-semibold text-slate-700 font-sans tracking-tight">
                          {opt.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateSettingField(
                                "branding",
                                opt.field,
                                !layoutSettings.branding[opt.field],
                              )
                            }
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                              layoutSettings.branding[opt.field]
                                ? "bg-emerald-600"
                                : "bg-slate-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                                layoutSettings.branding[opt.field]
                                  ? "translate-x-4"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
                          {opt.hasConfig && (
                            <button
                              type="button"
                              onClick={() => {
                                if (opt.field === "logo") {
                                  setIsLogoSettingsOpen(true);
                                }
                              }}
                              className="p-1 hover:bg-slate-100 rounded-lg transition text-slate-500 hover:text-slate-700 cursor-pointer"
                            >
                              <Sliders className="size-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
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
      </div>
      <FloatingFormatToolbar
        visible={toolbarVisible}
        position={toolbarPos}
        onChangeFontSize={(newSize) => {
          const activeEl = document.activeElement;
          if (activeEl && activeEl.getAttribute("contenteditable") === "true") {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) {
              const range = document.createRange();
              range.selectNodeContents(activeEl);
              selection.removeAllRanges();
              selection.addRange(range);
            }
            document.execCommand("fontSize", false, "7");
            const fontElements = activeEl.getElementsByTagName("font");
            for (let i = fontElements.length - 1; i >= 0; i--) {
              const fontEl = fontElements[i];
              if (fontEl.getAttribute("size") === "7") {
                fontEl.removeAttribute("size");
                fontEl.style.fontSize = `${newSize}px`;
              }
            }
          }
        }}
      />

      {/* Bottom Sheet Drawer for Page Setup with spring slide-up transition */}
      <AnimatePresence>
        {isPageSetupOpen && (
          <>
            {/* Backdrop overlay - completely transparent and clear (no blur or dark overlay) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPageSetupOpen(false)}
              className="fixed inset-0 z-[150] bg-transparent print:hidden cursor-default"
            />

            {/* Bottom Drawer panel with smooth sliding transition */}
            <motion.div
              initial={{ y: "100%", x: "-50%" }}
              animate={{ y: 0, x: "-50%" }}
              exit={{ y: "100%", x: "-50%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                mass: 0.8,
              }}
              className="fixed bottom-0 left-1/2 w-full max-w-lg z-[200] bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-t-3xl shadow-2xl p-6 print:hidden text-black"
              style={{
                maxHeight: "85vh",
                boxShadow: "0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -8px 10px -6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[17px] font-bold text-slate-800 font-bengali">
                    Page Setup
                  </h3>
                  <p className="text-slate-500 text-[12px] font-semibold leading-relaxed font-bengali mt-0.5">
                    প্রশ্নপত্রের ডানে, বামে, উপরে, নিচের স্পেস কমানো বাড়ানো যাবে।
                  </p>
                </div>
                <button
                  onClick={() => setIsPageSetupOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors focus:outline-none cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1 no-scrollbar">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[12.5px] font-bold text-slate-700 font-bengali">
                      <span>উপরে</span>
                      <span className="font-sans text-slate-500">
                        {layoutSettings.pagePaddingTop ?? 32}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layoutSettings.pagePaddingTop ?? 32}
                      onChange={(e) =>
                        updateSettingField(
                          null,
                          "pagePaddingTop",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[12.5px] font-bold text-slate-700 font-bengali">
                      <span>নিচে</span>
                      <span className="font-sans text-slate-500">
                        {layoutSettings.pagePaddingBottom ?? 32}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layoutSettings.pagePaddingBottom ?? 32}
                      onChange={(e) =>
                        updateSettingField(
                          null,
                          "pagePaddingBottom",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[12.5px] font-bold text-slate-700 font-bengali">
                      <span>বামে</span>
                      <span className="font-sans text-slate-500">
                        {layoutSettings.pagePaddingLeft ?? 32}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layoutSettings.pagePaddingLeft ?? 32}
                      onChange={(e) =>
                        updateSettingField(
                          null,
                          "pagePaddingLeft",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-1"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[12.5px] font-bold text-slate-700 font-bengali">
                      <span>ডানে</span>
                      <span className="font-sans text-slate-500">
                        {layoutSettings.pagePaddingRight ?? 32}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layoutSettings.pagePaddingRight ?? 32}
                      onChange={(e) =>
                        updateSettingField(
                          null,
                          "pagePaddingRight",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-1"
                    />
                  </div>
                </div>

                <hr className="border-slate-200/60" />

                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-slate-600 block font-bengali">
                    পেপার সাইজ
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {PAPER_SIZES_META.map((paper) => {
                      const isSelected = layoutSettings.paperSize === paper.id;
                      return (
                        <button
                          key={paper.id}
                          onClick={() =>
                            updateSettingField(null, "paperSize", paper.id)
                          }
                          className={`flex flex-col items-center justify-center p-2 border rounded-xl transition cursor-pointer select-none ${
                            isSelected
                              ? "bg-emerald-50/60 border-emerald-500 text-emerald-700 font-extrabold shadow-sm"
                              : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                          }`}
                        >
                          <div className="h-14 w-full flex items-center justify-center bg-slate-50/50 rounded-lg mb-1.5 border border-slate-100 shadow-sm relative overflow-hidden">
                            <div
                              className={`bg-white border border-slate-300 rounded shadow-sm transition-all ${
                                isSelected
                                  ? "border-emerald-300 bg-emerald-50/10"
                                  : ""
                              }`}
                              style={{
                                width: `${paper.w}px`,
                                height: `${paper.h}px`,
                              }}
                            />
                          </div>
                          <span className="text-[11px] font-bold">
                            {paper.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Sheet Drawer for Logo Settings with spring slide-up transition */}
      <AnimatePresence>
        {isLogoSettingsOpen && (
          <>
            {/* Backdrop overlay - completely transparent and clear (no blur or dark overlay) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoSettingsOpen(false)}
              className="fixed inset-0 z-[150] bg-transparent print:hidden cursor-default"
            />

            {/* Bottom Drawer panel with smooth sliding transition */}
            <motion.div
              initial={{ y: "100%", x: "-50%" }}
              animate={{ y: 0, x: "-50%" }}
              exit={{ y: "100%", x: "-50%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                mass: 0.8,
              }}
              className="fixed bottom-0 left-1/2 w-full max-w-lg z-[200] bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-t-3xl shadow-2xl p-6 print:hidden text-black"
              style={{
                maxHeight: "85vh",
                boxShadow: "0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -8px 10px -6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[17px] font-bold text-slate-800 font-bengali">
                    Logo Settings
                  </h3>
                  <p className="text-slate-500 text-[12px] font-semibold leading-relaxed font-bengali mt-0.5">
                    লোগোর পজিশন টাইপ, সাইজ, স্বচ্ছতা এবং ইমেজ কাস্টমাইজ করুন।
                  </p>
                </div>
                <button
                  onClick={() => setIsLogoSettingsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors focus:outline-none cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1 no-scrollbar">
                {/* Position Type */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 font-bengali block">
                    পজিশন টাইপ
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateSettingField("logoSettings", "positionType", "simple")}
                      className={`py-2 text-center rounded-xl text-xs font-black transition cursor-pointer ${
                        layoutSettings.logoSettings.positionType === "simple"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
                      }`}
                    >
                      সহজ
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSettingField("logoSettings", "positionType", "drag")}
                      className={`py-2 text-center rounded-xl text-xs font-black transition cursor-pointer ${
                        layoutSettings.logoSettings.positionType === "drag"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
                      }`}
                    >
                      Drag Mode
                    </button>
                  </div>
                </div>

                {/* Simple Position: visible only if positionType === 'simple' */}
                {layoutSettings.logoSettings.positionType === "simple" && (
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-700 font-bengali block">
                      অবস্থান
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["left", "center", "right"].map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => updateSettingField("logoSettings", "position", pos)}
                          className={`py-2 text-center rounded-xl text-xs font-black transition cursor-pointer capitalize ${
                            layoutSettings.logoSettings.position === pos
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drag Mode Canvas: visible only if positionType === 'drag' */}
                {layoutSettings.logoSettings.positionType === "drag" && (
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-700 font-bengali block">
                      অবস্থান নির্ধারণ করুন
                    </label>
                    <p className="text-[11px] text-slate-500 font-medium font-bengali">
                      নিচের "LOGO" বাটনটি ড্র্যাগ করে লোগোর অবস্থান নির্ধারণ করুন।
                    </p>
                    <div
                      id="logo-drag-container"
                      className="relative border border-slate-200 bg-slate-50/50 w-full h-36 rounded-xl overflow-hidden cursor-crosshair select-none"
                      onMouseMove={handleDragMove}
                      onTouchMove={handleDragTouchMove}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                      onTouchEnd={handleDragEnd}
                    >
                      {/* Draw a grid background */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                          backgroundSize: "16px 16px",
                        }}
                      />
                      
                      {/* Draggable LOGO badge */}
                      <div
                        style={{
                          left: `${layoutSettings.logoSettings.x}%`,
                          top: `${layoutSettings.logoSettings.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] px-2.5 py-1.5 rounded-lg cursor-move absolute shadow-md active:scale-95 transition-transform"
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                      >
                        LOGO
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 font-sans mt-1">
                      <span>X: {layoutSettings.logoSettings.x}% | Y: {layoutSettings.logoSettings.y}%</span>
                    </div>
                  </div>
                )}

                {/* Size Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[12px] font-bold text-slate-700 font-bengali">
                    <span>সাইজ</span>
                    <span className="font-sans text-slate-500">
                      {layoutSettings.logoSettings.size}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    value={layoutSettings.logoSettings.size}
                    onChange={(e) =>
                      updateSettingField(
                        "logoSettings",
                        "size",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-1"
                  />
                </div>

                {/* Opacity Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[12px] font-bold text-slate-700 font-bengali">
                    <span>স্বচ্ছতা</span>
                    <span className="font-sans text-slate-500">
                      {layoutSettings.logoSettings.opacity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={layoutSettings.logoSettings.opacity}
                    onChange={(e) =>
                      updateSettingField(
                        "logoSettings",
                        "opacity",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-1"
                  />
                </div>

                {/* Logo Image Uploader */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 font-bengali block">
                    লোগো ইমেজ
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      id="logo-image-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (uploadEvent) => {
                            updateSettingField("logoSettings", "logoUrl", uploadEvent.target.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="logo-image-upload"
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      ইমেজ আপলোড করুন
                    </label>
                    {layoutSettings.logoSettings.logoUrl && (
                      <button
                        type="button"
                        onClick={() => updateSettingField("logoSettings", "logoUrl", null)}
                        className="text-xs text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
                      >
                        মুছে ফেলুন
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
