import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Image,
  Info,
  LayoutGrid,
  Loader2,
  Maximize2,
  Move,
  Plus,
  Printer,
  Settings,
  Sliders,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { createPortal } from "react-dom";
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
  const [isHeaderSettingsOpen, setIsHeaderSettingsOpen] = useState(false);
  const [isFooterSettingsOpen, setIsFooterSettingsOpen] = useState(false);
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

    const x = Math.max(
      0,
      Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)),
    );
    const y = Math.max(
      0,
      Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)),
    );

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
      {/* Warning Notice */}
      {/* <div className="max-w-[1220px] mx-auto w-full bg-amber-50 border border-amber-200/60 rounded-2xl p-4 shadow-sm flex items-start gap-3 print:hidden">
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
            এখানে করা কোনো পরিবর্তন সংরক্ষণ করা হয় না। আপনার প্রয়োজনীয়
            কাস্টমাইজেশন শেষে দয়া করে প্রশ্নপত্রটি প্রিন্ট অথবা ডাউনলোড করে নিন
          </p>
        </div>
      </div> */}
      {/* Main Preview Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center max-w-[1220px] mx-auto w-full print:block print:w-full print:m-0 print:p-0">
        {/* Left Pane (A4 Printable paper preview) */}
        <div className="flex-1 w-full max-w-[820px] space-y-4 print:w-full print:absolute print:left-0 print:top-0 print:m-0 print:p-0">
          <div
            className="flex justify-between items-center print:hidden px-5 py-3.5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(167,139,250,0.25)",
              boxShadow:
                "0 8px 32px rgba(109,40,217,0.06), 0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="p-1.5 rounded-lg"
                style={{
                  background: "rgba(109,40,217,0.08)",
                  color: "rgb(109,40,217)",
                }}
              >
                <Sliders className="size-4" />
              </div>
              <span className="text-[13px] font-black text-slate-800 font-bengali">
                কুইক সেটিংস
              </span>
            </div>
            <button
              onClick={handleGoBackToSelect}
              className="px-4 py-2 text-white rounded text-[12px]  flex items-center gap-1.5 shadow transition-all duration-200  active:scale-[0.98] cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)",
                boxShadow:
                  "0 4px 16px rgba(109,40,217,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <Plus className="size-3.5" />
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
            {layoutSettings.branding.header && (
              <div
                className="w-full flex items-center mb-6 overflow-hidden select-none print:select-text"
                style={{
                  minHeight: `${layoutSettings.headerSettings?.height || 70}px`,
                  background:
                    layoutSettings.headerSettings?.bgColor ||
                    "rgba(109,40,217,0.92)",
                  color: layoutSettings.headerSettings?.textColor || "#ffffff",
                  borderRadius: `${layoutSettings.headerSettings?.borderRadius ?? 8}px`,
                  alignItems: "center",
                  justifyContent:
                    layoutSettings.headerSettings?.align === "left"
                      ? "flex-start"
                      : layoutSettings.headerSettings?.align === "right"
                        ? "flex-end"
                        : "center",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: `${layoutSettings.headerSettings?.fontSize || 22}px`,
                    fontWeight: layoutSettings.headerSettings?.bold
                      ? "bold"
                      : "normal",
                    fontStyle: layoutSettings.headerSettings?.italic
                      ? "italic"
                      : "normal",
                    fontFamily:
                      layoutSettings.headerSettings?.fontFamily === "English"
                        ? "Outfit, sans-serif"
                        : `'${activeFont}', sans-serif`,
                    whiteSpace: "pre-line",
                    textAlign: layoutSettings.headerSettings?.align || "center",
                    width: "100%",
                  }}
                >
                  {layoutSettings.headerSettings?.text ||
                    "বুস্টার সাজেশন প্যাক"}
                </div>
              </div>
            )}
            <div className="space-y-1  select-none">
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
                        className="w-6 h-6 flex items-center justify-center text-base font-bold text-center px-0 mx-0 border-2 border-black bg-white rounded-none select-text"
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
                              ? "border-2 border-black"
                              : "border-2 border-l-0 border-black";
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
                              className={`w-6 h-6 flex items-center justify-center text-base font-bold text-center px-0 mx-0 bg-white rounded-none select-text ${borderClass}`}
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
              <div
                className="block"
                style={{
                  columnCount: layoutSettings.columns,
                  columnGap: `${layoutSettings.columnGap || 15}px`,
                  columnRule:
                    layoutSettings.columns > 1 && layoutSettings.columnDivider
                      ? "1px solid black"
                      : "none",
                }}
              >
                {groupedQuestions.map((group) => (
                  <div key={group.category} className="mb-6 break-inside-auto">
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
                            className="font-normal text-[14px] text-black font-sans print:font-sans"
                            inline={true}
                            placeholder="মান বণ্টন"
                          />
                        </span>
                      )}
                    </div>

                    <div className="block">
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
                            className="relative group border border-transparent hover:border-indigo-100 hover:bg-indigo-50/10   rounded-xl transition print:border-none print:hover:border-none print:hover:bg-transparent print:p-0"
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
                                      <div className="font-medium text-black leading-relaxed">
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
                                        <div className="space-y-1 text-black text-inherit">
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
                                                <div className="flex items-start gap-1.5 flex-1">
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
                                                    className="text-[14px] text-black font-normal shrink-0 font-sans print:font-sans"
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
                                        <div className="text-black leading-relaxed">
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

            {/* Footer Banner */}
            {layoutSettings.branding.footer && (
              <div
                className="w-full flex items-center mt-8 overflow-hidden select-none print:select-text"
                style={{
                  minHeight: `${layoutSettings.footerSettings?.height || 50}px`,
                  background:
                    layoutSettings.footerSettings?.bgColor ||
                    "rgba(109,40,217,0.92)",
                  color: layoutSettings.footerSettings?.textColor || "#ffffff",
                  borderRadius: `${layoutSettings.footerSettings?.borderRadius ?? 8}px`,
                  alignItems: "center",
                  justifyContent:
                    layoutSettings.footerSettings?.align === "left"
                      ? "flex-start"
                      : layoutSettings.footerSettings?.align === "right"
                        ? "flex-end"
                        : "center",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: `${layoutSettings.footerSettings?.fontSize || 16}px`,
                    fontWeight: layoutSettings.footerSettings?.bold
                      ? "bold"
                      : "normal",
                    fontStyle: layoutSettings.footerSettings?.italic
                      ? "italic"
                      : "normal",
                    fontFamily:
                      layoutSettings.footerSettings?.fontFamily === "English"
                        ? "Outfit, sans-serif"
                        : `'${activeFont}', sans-serif`,
                    whiteSpace: "pre-line",
                    textAlign: layoutSettings.footerSettings?.align || "center",
                    width: "100%",
                  }}
                >
                  {layoutSettings.footerSettings?.text ||
                    "সকল প্রশ্নের উত্তর দেওয়া বাধ্যতামূলক | শুভকামনা রইল"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Layout Settings Sidebar */}
        <div className="w-full lg:w-[360px] lg:shrink-0 print:hidden lg:sticky lg:top-2 lg:h-[calc(100vh-48px)] lg:flex lg:flex-col gap-4">
          <div
            className="flex p-1 rounded-full gap-1 shrink-0"
            style={{
              background: "rgba(109,40,217,0.12)",
              border: "1.5px solid rgba(109,40,217,0.2)",
            }}
          >
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
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 cursor-pointer select-none relative"
                  style={{
                    color: isActive ? "#fff" : "rgba(109,40,217,0.7)",
                    background: "transparent",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarTabIndicator"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)",
                        boxShadow:
                          "0 4px 16px rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className="size-4 relative z-10" />
                  <span className="font-bengali relative z-10">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 lg:overflow-y-auto pr-1 min-h-0 custom-sidebar-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-5 pb-40 rounded divide-y divide-violet-100/70 space-y-5"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(24px) saturate(160%)",
                    WebkitBackdropFilter: "blur(24px) saturate(160%)",
                    border: "1px solid rgba(167,139,250,0.25)",
                    boxShadow:
                      "0 8px 32px rgba(109,40,217,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Attachment settings card */}
                  <div className="space-y-3.5">
                    <h3
                      className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        boxShadow:
                          "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)",
                        border: "1px solid rgba(167,139,250,0.4)",
                      }}
                    >
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
                          className="flex items-center justify-between px-3 py-2 rounded-xl transition"
                          style={{
                            background: "rgba(248,246,255,0.85)",
                            border: "1px solid rgba(167,139,250,0.18)",
                          }}
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
                            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                            style={{
                              background: layoutSettings.attachments[opt.field]
                                ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                                : "rgba(203,213,225,0.8)",
                            }}
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
                    <h3
                      className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        boxShadow:
                          "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)",
                        border: "1px solid rgba(167,139,250,0.4)",
                      }}
                    >
                      <FileText className="size-4 text-white" />
                      <span>প্রশ্নের মেটাডাটা (হেডার)</span>
                    </h3>
                    <div className="space-y-2">
                      {[
                        { field: "className", label: "শ্রেণির নাম" },
                        { field: "subjectName", label: "বিষয়ের নাম" },
                        { field: "chapterName", label: "অধ্যায়ের নাম" },
                        { field: "setCode", label: "সেট কোড" },
                        {
                          field: "programName",
                          label: "প্রোগ্রাম/পরীক্ষার নাম",
                        },
                        { field: "instructions", label: "নির্দেশনাবলি" },
                      ].map((opt) => (
                        <div
                          key={opt.field}
                          className="flex items-center justify-between px-3 py-2 rounded-xl transition"
                          style={{
                            background: "rgba(248,246,255,0.85)",
                            border: "1px solid rgba(167,139,250,0.18)",
                          }}
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
                            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                            style={{
                              background: layoutSettings.metadata[opt.field]
                                ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                                : "rgba(203,213,225,0.8)",
                            }}
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
                    <h3
                      className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        boxShadow:
                          "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)",
                        border: "1px solid rgba(167,139,250,0.4)",
                      }}
                    >
                      <Sliders className="size-4 text-white" />
                      <span>ডকুমেন্ট কাস্টমাইজেশন</span>
                    </h3>
                    <div className="space-y-3">
                      {/* Paper size */}
                      <div
                        className="space-y-1.5 p-3 rounded-xl"
                        style={{
                          background: "rgba(248,246,255,0.85)",
                          border: "1px solid rgba(167,139,250,0.2)",
                        }}
                      >
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
                                  updateSettingField(
                                    null,
                                    "paperSize",
                                    paper.id,
                                  )
                                }
                                className="flex flex-col items-center justify-center p-2 border rounded-xl transition cursor-pointer select-none"
                                style={
                                  isSelected
                                    ? {
                                        background: "rgba(109,40,217,0.08)",
                                        border:
                                          "1.5px solid rgba(109,40,217,0.45)",
                                        color: "rgb(109,40,217)",
                                      }
                                    : {
                                        background: "white",
                                        borderColor: "rgba(203,213,225,0.8)",
                                        color: "#64748b",
                                      }
                                }
                              >
                                <div className="h-14 w-full flex items-center justify-center bg-slate-50/50 rounded-lg mb-1.5 border border-slate-100 shadow-sm relative overflow-hidden">
                                  <div
                                    className={`bg-white border border-slate-300 rounded shadow-sm transition-all ${
                                      isSelected ? "border-violet-400" : ""
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
                        className="w-full flex items-center justify-between p-3.5 rounded-xl transition cursor-pointer select-none"
                        style={{
                          background: "rgba(248,246,255,0.85)",
                          border: "1.5px solid rgba(109,40,217,0.3)",
                        }}
                      >
                        <div className="">
                          <span
                            className="text-[13px] font-bold font-bengali"
                            style={{ color: "rgb(109,40,217)" }}
                          >
                            পেজ সেটাপ (মার্জিন)
                          </span>
                        </div>
                        <Sliders
                          className="size-4"
                          style={{ color: "rgb(109,40,217)" }}
                        />
                      </button>

                      {/* Columns layout cards */}
                      <div
                        className="space-y-1.5 p-3 rounded-xl"
                        style={{
                          background: "rgba(248,246,255,0.85)",
                          border: "1px solid rgba(167,139,250,0.2)",
                        }}
                      >
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
                            const isSelected =
                              layoutSettings.columns === col.id;
                            return (
                              <button
                                key={col.id}
                                onClick={() =>
                                  updateSettingField(null, "columns", col.id)
                                }
                                className="flex flex-col items-center justify-center p-2 border rounded-xl transition cursor-pointer select-none"
                                style={
                                  isSelected
                                    ? {
                                        background: "rgba(109,40,217,0.08)",
                                        border:
                                          "1.5px solid rgba(109,40,217,0.45)",
                                        color: "rgb(109,40,217)",
                                      }
                                    : {
                                        background: "white",
                                        borderColor: "rgba(203,213,225,0.8)",
                                        color: "#64748b",
                                      }
                                }
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
                      <div
                        className="p-3.5 rounded-xl space-y-2.5"
                        style={{
                          background: "rgba(248,246,255,0.85)",
                          border: "1px solid rgba(167,139,250,0.2)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-slate-700 font-bengali">
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
                            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                            style={{
                              background: layoutSettings.columnDivider
                                ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                                : "rgba(203,213,225,0.8)",
                            }}
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
                        <div
                          className="rounded-xl p-3 space-y-3"
                          style={{
                            background: "rgba(255,255,255,0.9)",
                            border: "1px solid rgba(167,139,250,0.15)",
                          }}
                        >
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
                              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-1"
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
                              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Font Selection */}
                      <div
                        className="space-y-1.5 p-3 rounded-xl"
                        style={{
                          background: "rgba(248,246,255,0.85)",
                          border: "1px solid rgba(167,139,250,0.2)",
                        }}
                      >
                        <label className="text-[10px] font-bold text-slate-500 block">
                          বাংলা ফন্ট
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-full h-9 px-3 border border-slate-200 bg-white hover:border-violet-400 focus:outline-none transition-all rounded-xl text-xs font-bold text-slate-700 flex justify-between items-center shadow-sm cursor-pointer select-none">
                              <span>
                                {FONT_OPTIONS.find(
                                  (f) => f.value === activeFont,
                                )?.label || activeFont}
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
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer focus:bg-violet-50 focus:text-violet-700 hover:bg-slate-50 group ${
                                    isSelected
                                      ? "bg-violet-50 text-violet-700"
                                      : "text-slate-700"
                                  }`}
                                >
                                  <span>{font.label}</span>
                                  {isSelected && (
                                    <span className="size-1.5 rounded-full bg-violet-500" />
                                  )}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Prefix Prefix style */}
                      <div
                        className="space-y-1.5 p-3 rounded-xl"
                        style={{
                          background: "rgba(248,246,255,0.85)",
                          border: "1px solid rgba(167,139,250,0.2)",
                        }}
                      >
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
                              className="py-1.5 border rounded-lg text-[10px] font-black transition"
                              style={
                                layoutSettings.optionStyle === style
                                  ? {
                                      background: "rgba(109,40,217,0.09)",
                                      border: "1.5px solid rgb(124,58,237)",
                                      color: "rgb(109,40,217)",
                                    }
                                  : {
                                      background: "white",
                                      borderColor: "rgba(203,213,225,0.8)",
                                      color: "#64748b",
                                    }
                              }
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font sizes */}
                      <div
                        className="space-y-1.5 p-3 rounded-xl"
                        style={{
                          background: "rgba(248,246,255,0.85)",
                          border: "1px solid rgba(167,139,250,0.2)",
                        }}
                      >
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
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Branding controls */}
                  <div className="space-y-3.5 pt-5">
                    <h3
                      className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        boxShadow:
                          "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)",
                        border: "1px solid rgba(167,139,250,0.4)",
                      }}
                    >
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
                          className="flex items-center justify-between px-3 py-2 rounded-xl transition"
                          style={{
                            background: "rgba(248,246,255,0.85)",
                            border: "1px solid rgba(167,139,250,0.18)",
                          }}
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
                              className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                              style={{
                                background: layoutSettings.branding[opt.field]
                                  ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                                  : "rgba(203,213,225,0.8)",
                              }}
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
                                  } else if (opt.field === "header") {
                                    setIsHeaderSettingsOpen(true);
                                  } else if (opt.field === "footer") {
                                    setIsFooterSettingsOpen(true);
                                  }
                                }}
                                className="p-1.5 rounded-lg transition-all duration-200 hover:bg-violet-600/10 active:scale-95 cursor-pointer text-violet-600/70 hover:text-violet-700"
                              >
                                <Sliders className="size-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "download" && (
                <motion.div
                  key="download"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-6 rounded-2xl space-y-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(24px) saturate(160%)",
                    WebkitBackdropFilter: "blur(24px) saturate(160%)",
                    border: "1px solid rgba(167,139,250,0.25)",
                    boxShadow: "0 8px 32px rgba(109,40,217,0.08)",
                  }}
                >
                  <div
                    className="p-4 rounded-full w-fit mx-auto"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(79,70,229,0.12) 100%)",
                      border: "1.5px solid rgba(109,40,217,0.25)",
                      color: "rgb(109,40,217)",
                    }}
                  >
                    <Printer className="size-8" />
                  </div>
                  <h3
                    className="text-[15px] font-bold font-bengali"
                    style={{ color: "rgb(80,50,180)" }}
                  >
                    প্রশ্নপত্র প্রিন্ট অথবা ডাউনলোড করুন
                  </h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-medium font-bengali">
                    আপনার নির্বাচিত সেটিংস অনুযায়ী প্রশ্নপত্রটি ডাউনলোড করতে
                    নিচের বাটনে ক্লিক করুন। প্রিন্ট লেআউটে সাইডবার ও সেটিংস অংশ
                    স্বয়ংক্রিয়ভাবে বাদ পড়বে।
                  </p>
                  <button
                    onClick={handlePrint}
                    className="w-full py-3 text-white rounded-xl text-sm font-black flex items-center justify-center gap-1.5 cursor-pointer mt-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 55%, rgba(124,58,237,0.88) 100%)",
                      boxShadow:
                        "0 8px 24px rgba(109,40,217,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                  >
                    <Printer className="size-4" />
                    প্রিন্ট / PDF ডাউনলোড
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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

      {/* Bottom Sheet Drawer for Page Setup — Glassmorphic Design via Portal */}
      {createPortal(
        <AnimatePresence>
          {isPageSetupOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsPageSetupOpen(false)}
                className="fixed inset-0 z-[150] print:hidden"
                style={{ background: "rgba(15,10,40,0.45)" }}
              />
              {/* Drawer panel */}
              <motion.div
                initial={{ y: "100%", x: "-50%" }}
                animate={{ y: 0, x: "-50%" }}
                exit={{ y: "100%", x: "-50%" }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 22,
                  mass: 0.75,
                }}
                className="fixed bottom-0 left-1/2 w-full max-w-lg z-[200] rounded-t-3xl print:hidden overflow-hidden flex flex-col"
                style={{
                  maxHeight: "88vh",
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  borderBottom: "none",
                  boxShadow:
                    "0 -20px 60px -10px rgba(109,40,217,0.22), 0 -4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                {/* Fixed Top Section: Gradient header + drag handle + live margin diagram */}
                <div className="shrink-0 relative z-10">
                  {/* Gradient header */}
                  <div
                    className="relative flex items-center justify-between px-6 pt-5 pb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(109,40,217,0.90) 0%, rgba(79,70,229,0.90) 55%, rgba(124,58,237,0.85) 100%)",
                    }}
                  >
                    <div
                      className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(167,139,250,0.8), transparent)",
                      }}
                    />
                    <div
                      className="absolute -bottom-4 right-8 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(192,132,252,0.9), transparent)",
                      }}
                    />
                    <div className="flex items-center gap-3 relative z-10">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                        }}
                      >
                        <Sliders className="size-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight font-bengali tracking-tight">
                          পেজ সেটাপ
                        </h3>
                        <p className="text-white/70 text-[11px] font-medium leading-tight font-sans">
                          প্রশ্নপত্রের মার্জিন ও কাগজের সাইজ নির্ধারণ করুন
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPageSetupOpen(false)}
                      className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {/* Drag handle */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-slate-300/70" />
                  </div>

                  {/* Live margin diagram */}
                  <div className="px-5 pb-3">
                    <div
                      className="relative w-full rounded-2xl p-4 flex items-center justify-center shadow-sm"
                      style={{
                        background: "rgba(248,246,255,0.85)",
                        border: "1px solid rgba(167,139,250,0.2)",
                        minHeight: "128px",
                      }}
                    >
                      <div
                        className="relative bg-white rounded-sm shadow-md"
                        style={{
                          width: "72px",
                          height: "100px",
                          border: "1.5px solid rgba(167,139,250,0.4)",
                        }}
                      >
                        <div
                          className="absolute rounded-sm"
                          style={{
                            top: `${Math.round(((layoutSettings.pagePaddingTop ?? 32) / 100) * 20)}px`,
                            bottom: `${Math.round(((layoutSettings.pagePaddingBottom ?? 32) / 100) * 20)}px`,
                            left: `${Math.round(((layoutSettings.pagePaddingLeft ?? 32) / 100) * 20)}px`,
                            right: `${Math.round(((layoutSettings.pagePaddingRight ?? 32) / 100) * 20)}px`,
                            background:
                              "linear-gradient(135deg, rgba(109,40,217,0.08) 0%, rgba(79,70,229,0.08) 100%)",
                            border: "1px dashed rgba(109,40,217,0.3)",
                          }}
                        />
                        <span
                          className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold font-sans"
                          style={{ color: "rgb(109,40,217)" }}
                        >
                          {layoutSettings.pagePaddingTop ?? 32}
                        </span>
                        <span
                          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold font-sans"
                          style={{ color: "rgb(109,40,217)" }}
                        >
                          {layoutSettings.pagePaddingBottom ?? 32}
                        </span>
                        <span
                          className="absolute top-1/2 -left-5 -translate-y-1/2 text-[8px] font-bold font-sans"
                          style={{ color: "rgb(109,40,217)" }}
                        >
                          {layoutSettings.pagePaddingLeft ?? 32}
                        </span>
                        <span
                          className="absolute top-1/2 -right-5 -translate-y-1/2 text-[8px] font-bold font-sans"
                          style={{ color: "rgb(109,40,217)" }}
                        >
                          {layoutSettings.pagePaddingRight ?? 32}
                        </span>
                      </div>
                      <p
                        className="absolute bottom-2 right-3 text-[9px] font-bold font-bengali"
                        style={{ color: "rgba(109,40,217,0.5)" }}
                      >
                        লাইভ প্রিভিউ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-5 pt-1 pb-6 space-y-5 no-scrollbar">
                  {/* Margin sliders */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "উপরে", Icon: ArrowUp, field: "pagePaddingTop" },
                      {
                        label: "নিচে",
                        Icon: ArrowDown,
                        field: "pagePaddingBottom",
                      },
                      {
                        label: "বামে",
                        Icon: ArrowLeft,
                        field: "pagePaddingLeft",
                      },
                      {
                        label: "ডানে",
                        Icon: ArrowRight,
                        field: "pagePaddingRight",
                      },
                    ].map(({ label, Icon, field }) => (
                      <div
                        key={field}
                        className="space-y-2.5 p-3.5 rounded-2xl"
                        style={{
                          background: "rgba(248,246,255,0.85)",
                          border: "1px solid rgba(167,139,250,0.2)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Icon
                              className="size-3.5"
                              style={{ color: "rgb(109,40,217)" }}
                              strokeWidth={2.5}
                            />
                            <span className="text-[12px] font-bold text-slate-700 font-bengali">
                              {label}
                            </span>
                          </div>
                          <span
                            className="text-[11px] font-black font-sans px-2 py-0.5 rounded-lg"
                            style={{
                              background: "rgba(109,40,217,0.12)",
                              color: "rgb(109,40,217)",
                            }}
                          >
                            {layoutSettings[field] ?? 32}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={layoutSettings[field] ?? 32}
                          onChange={(e) =>
                            updateSettingField(
                              null,
                              field,
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{ accentColor: "rgb(109,40,217)" }}
                        />
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 font-sans">
                          <span>0px</span>
                          <span>100px</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paper size */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="size-3.5 text-violet-600" />
                      <span className="text-[13px] font-bold text-slate-700 font-bengali">
                        কাগজের সাইজ
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {PAPER_SIZES_META.map((paper) => {
                        const isSelected =
                          layoutSettings.paperSize === paper.id;
                        return (
                          <button
                            key={paper.id}
                            onClick={() =>
                              updateSettingField(null, "paperSize", paper.id)
                            }
                            className="flex flex-col items-center justify-center p-2 rounded-2xl transition cursor-pointer select-none"
                            style={
                              isSelected
                                ? {
                                    background:
                                      "linear-gradient(135deg, rgba(109,40,217,0.10) 0%, rgba(79,70,229,0.10) 100%)",
                                    border: "1.5px solid rgba(109,40,217,0.45)",
                                    color: "rgb(109,40,217)",
                                    boxShadow:
                                      "0 2px 12px rgba(109,40,217,0.15)",
                                  }
                                : {
                                    background: "rgba(248,248,255,0.8)",
                                    border: "1.5px solid rgba(226,232,240,0.8)",
                                    color: "#64748b",
                                  }
                            }
                          >
                            <div
                              className="h-12 w-full flex items-center justify-center rounded-xl mb-1.5 overflow-hidden"
                              style={{
                                background: isSelected
                                  ? "linear-gradient(135deg, rgba(109,40,217,0.06) 0%, rgba(79,70,229,0.06) 100%)"
                                  : "rgba(241,245,249,0.8)",
                              }}
                            >
                              <div
                                className="rounded-sm shadow-sm"
                                style={{
                                  width: `${paper.w}px`,
                                  height: `${paper.h}px`,
                                  background: "white",
                                  border: isSelected
                                    ? "1.5px solid rgba(109,40,217,0.4)"
                                    : "1px solid rgba(203,213,225,0.8)",
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
        </AnimatePresence>,
        document.body,
      )}

      {/* Bottom Sheet Drawer for Logo Settings — rendered via Portal to escape z-index stacking */}
      {createPortal(
        <AnimatePresence>
          {isLogoSettingsOpen && (
            <>
              {/* Backdrop overlay with subtle dim */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsLogoSettingsOpen(false)}
                className="fixed inset-0 z-[150] print:hidden"
                style={{ background: "rgba(15,10,40,0.45)" }}
              />

              {/* Bottom Drawer — glassmorphic premium panel */}
              <motion.div
                initial={{ y: "100%", x: "-50%" }}
                animate={{ y: 0, x: "-50%" }}
                exit={{ y: "100%", x: "-50%" }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 22,
                  mass: 0.75,
                }}
                className="fixed bottom-0 left-1/2 w-full max-w-lg z-[200] rounded-t-3xl print:hidden overflow-hidden"
                style={{
                  maxHeight: "88vh",
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  borderBottom: "none",
                  boxShadow:
                    "0 -20px 60px -10px rgba(109,40,217,0.22), 0 -4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                {/* Gradient header strip */}
                <div
                  className="relative flex items-center justify-between px-6 pt-5 pb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(109,40,217,0.90) 0%, rgba(79,70,229,0.90) 55%, rgba(124,58,237,0.85) 100%)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {/* Decorative glow circles */}
                  <div
                    className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(167,139,250,0.8), transparent)",
                    }}
                  />
                  <div
                    className="absolute -bottom-4 right-8 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(192,132,252,0.9), transparent)",
                    }}
                  />

                  <div className="flex items-center gap-3 relative z-10">
                    {/* Logo icon badge */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                      }}
                    >
                      <Image className="size-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-white leading-tight font-bengali tracking-tight">
                        লোগো সেটিংস
                      </h3>
                      <p className="text-white/70 text-[11px] font-medium leading-tight font-bengali mt-0.5">
                        প্রশ্নপত্রে লোগো কাস্টমাইজ করুন
                      </p>
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setIsLogoSettingsOpen(false)}
                    className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Drag handle pill */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-slate-300/70" />
                </div>

                {/* ── Mode Tab Switcher — Always visible, outside scroll ── */}
                <div className="px-5 pb-3">
                  <div
                    className="flex p-1 rounded-2xl gap-1"
                    style={{
                      background: "rgba(109,40,217,0.12)",
                      border: "1.5px solid rgba(109,40,217,0.2)",
                    }}
                  >
                    {/* Tab: সহজ মোড */}
                    <button
                      type="button"
                      onClick={() =>
                        updateSettingField(
                          "logoSettings",
                          "positionType",
                          "simple",
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer"
                      style={
                        layoutSettings.logoSettings.positionType === "simple"
                          ? {
                              background:
                                "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)",
                              color: "#fff",
                              boxShadow:
                                "0 4px 16px rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                            }
                          : {
                              color: "rgba(109,40,217,0.7)",
                              background: "transparent",
                            }
                      }
                    >
                      <LayoutGrid className="size-3.5" />
                      <span className="font-bengali">সহজ মোড</span>
                    </button>

                    {/* Tab: ড্র্যাগ মোড */}
                    <button
                      type="button"
                      onClick={() =>
                        updateSettingField(
                          "logoSettings",
                          "positionType",
                          "drag",
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer"
                      style={
                        layoutSettings.logoSettings.positionType === "drag"
                          ? {
                              background:
                                "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)",
                              color: "#fff",
                              boxShadow:
                                "0 4px 16px rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                            }
                          : {
                              color: "rgba(109,40,217,0.7)",
                              background: "transparent",
                            }
                      }
                    >
                      <Move className="size-3.5" />
                      <span className="font-bengali">ড্র্যাগ মোড</span>
                    </button>
                  </div>
                </div>

                {/* Scrollable body */}
                <div
                  className="overflow-y-auto px-5 pb-6 space-y-5 no-scrollbar"
                  style={{ maxHeight: "calc(88vh - 180px)" }}
                >
                  {/* ── Simple Mode: Position Selector ── */}
                  {layoutSettings.logoSettings.positionType === "simple" && (
                    <motion.div
                      key="simple-panel"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <AlignCenter className="size-3.5 text-violet-600" />
                        <span className="text-[12px] font-bold text-slate-700 font-bengali">
                          লোগোর অবস্থান
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { pos: "left", label: "বামে", icon: AlignLeft },
                          { pos: "center", label: "মাঝে", icon: AlignCenter },
                          { pos: "right", label: "ডানে", icon: AlignRight },
                        ].map(({ pos, label, icon: Icon }) => {
                          const isActive =
                            layoutSettings.logoSettings.position === pos;
                          return (
                            <button
                              key={pos}
                              type="button"
                              onClick={() =>
                                updateSettingField(
                                  "logoSettings",
                                  "position",
                                  pos,
                                )
                              }
                              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                              style={
                                isActive
                                  ? {
                                      background:
                                        "linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(79,70,229,0.12) 100%)",
                                      border:
                                        "1.5px solid rgba(109,40,217,0.45)",
                                      color: "rgb(109,40,217)",
                                      boxShadow:
                                        "0 2px 12px rgba(109,40,217,0.15)",
                                    }
                                  : {
                                      background: "rgba(248,248,255,0.8)",
                                      border:
                                        "1.5px solid rgba(226,232,240,0.8)",
                                      color: "#64748b",
                                    }
                              }
                            >
                              <Icon className="size-4" />
                              <span className="font-bengali">{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Drag Mode: Canvas ── */}
                  {layoutSettings.logoSettings.positionType === "drag" && (
                    <motion.div
                      key="drag-panel"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <Move className="size-3.5 text-violet-600" />
                        <span className="text-[12px] font-bold text-slate-700 font-bengali">
                          অবস্থান ড্র্যাগ করুন
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bengali font-medium">
                        নিচের বক্সে{" "}
                        <span className="text-violet-600 font-bold">LOGO</span>{" "}
                        ট্যাগটি ড্র্যাগ করে যেকোনো জায়গায় রাখুন।
                      </p>
                      <div
                        id="logo-drag-container"
                        className="relative w-full h-40 rounded-2xl overflow-hidden cursor-crosshair select-none"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(240,237,255,0.9) 0%, rgba(232,240,255,0.9) 100%)",
                          border: "1.5px solid rgba(167,139,250,0.35)",
                          boxShadow: "inset 0 2px 12px rgba(109,40,217,0.06)",
                        }}
                        onMouseMove={handleDragMove}
                        onTouchMove={handleDragTouchMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchEnd={handleDragEnd}
                      >
                        {/* Dot grid */}
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle, rgba(109,40,217,0.4) 1px, transparent 1px)",
                            backgroundSize: "18px 18px",
                          }}
                        />
                        {/* Corner labels */}
                        <span className="absolute top-2 left-2.5 text-[9px] font-bold text-violet-400/60 font-sans select-none">
                          ↖ TL
                        </span>
                        <span className="absolute top-2 right-2.5 text-[9px] font-bold text-violet-400/60 font-sans select-none">
                          TR ↗
                        </span>
                        <span className="absolute bottom-2 left-2.5 text-[9px] font-bold text-violet-400/60 font-sans select-none">
                          ↙ BL
                        </span>
                        <span className="absolute bottom-2 right-2.5 text-[9px] font-bold text-violet-400/60 font-sans select-none">
                          BR ↘
                        </span>
                        {/* Draggable badge */}
                        <div
                          style={{
                            left: `${layoutSettings.logoSettings.x}%`,
                            top: `${layoutSettings.logoSettings.y}%`,
                            transform: "translate(-50%, -50%)",
                            background:
                              "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            boxShadow: "0 4px 16px rgba(109,40,217,0.45)",
                          }}
                          className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-move shadow-lg active:scale-95 transition-transform select-none"
                          onMouseDown={handleDragStart}
                          onTouchStart={handleDragStart}
                        >
                          <Image className="size-3 text-white" />
                          <span className="text-white font-black text-[10px] font-sans">
                            LOGO
                          </span>
                        </div>
                      </div>
                      {/* Coordinates chip */}
                      <div className="flex justify-center">
                        <span
                          className="text-[11px] font-bold font-sans px-3 py-1 rounded-lg"
                          style={{
                            background: "rgba(109,40,217,0.1)",
                            color: "rgb(109,40,217)",
                            border: "1px solid rgba(109,40,217,0.2)",
                          }}
                        >
                          X: {layoutSettings.logoSettings.x}% &nbsp;|&nbsp; Y:{" "}
                          {layoutSettings.logoSettings.y}%
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Size Slider ── */}
                  <div
                    className="space-y-3 p-4 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Maximize2 className="size-3.5 text-violet-600" />
                        <span className="text-[13px] font-bold text-slate-700 font-bengali">
                          সাইজ
                        </span>
                      </div>
                      <span
                        className="text-[12px] font-black font-sans px-2.5 py-0.5 rounded-lg"
                        style={{
                          background: "rgba(109,40,217,0.12)",
                          color: "rgb(109,40,217)",
                        }}
                      >
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
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: "rgb(109,40,217)" }}
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 font-sans">
                      <span>20px</span>
                      <span>150px</span>
                    </div>
                  </div>

                  {/* ── Opacity Slider ── */}
                  <div
                    className="space-y-3 p-4 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="size-3.5 text-violet-600" />
                        <span className="text-[13px] font-bold text-slate-700 font-bengali">
                          স্বচ্ছতা
                        </span>
                      </div>
                      <span
                        className="text-[12px] font-black font-sans px-2.5 py-0.5 rounded-lg"
                        style={{
                          background: "rgba(109,40,217,0.12)",
                          color: "rgb(109,40,217)",
                        }}
                      >
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
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: "rgb(109,40,217)" }}
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 font-sans">
                      <span>10%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* ── Logo Image Uploader ── */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Upload className="size-3.5 text-violet-600" />
                      <span className="text-[13px] font-bold text-slate-700 font-bengali">
                        লোগো ইমেজ
                      </span>
                    </div>
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
                            updateSettingField(
                              "logoSettings",
                              "logoUrl",
                              uploadEvent.target.result,
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="flex items-center gap-3">
                      {/* Upload button */}
                      <label
                        htmlFor="logo-image-upload"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold transition-all cursor-pointer"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(109,40,217,0.10) 0%, rgba(79,70,229,0.10) 100%)",
                          border: "1.5px dashed rgba(109,40,217,0.4)",
                          color: "rgb(109,40,217)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, rgba(109,40,217,0.16) 0%, rgba(79,70,229,0.16) 100%)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, rgba(109,40,217,0.10) 0%, rgba(79,70,229,0.10) 100%)";
                        }}
                      >
                        <Upload className="size-4" />
                        <span className="font-bengali">ইমেজ আপলোড করুন</span>
                      </label>

                      {/* Logo preview + remove */}
                      {layoutSettings.logoSettings.logoUrl && (
                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            className="w-10 h-10 rounded-xl overflow-hidden border"
                            style={{
                              border: "1.5px solid rgba(109,40,217,0.3)",
                              boxShadow: "0 2px 8px rgba(109,40,217,0.15)",
                            }}
                          >
                            <img
                              src={layoutSettings.logoSettings.logoUrl}
                              alt="Logo preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              updateSettingField(
                                "logoSettings",
                                "logoUrl",
                                null,
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Bottom Sheet Drawer for Header Settings — rendered via Portal to escape z-index stacking */}
      {createPortal(
        <AnimatePresence>
          {isHeaderSettingsOpen && (
            <>
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsHeaderSettingsOpen(false)}
                className="fixed inset-0 z-[150] print:hidden"
                style={{ background: "rgba(15,10,40,0.45)" }}
              />

              {/* Drawer panel */}
              <motion.div
                initial={{ y: "100%", x: "-50%" }}
                animate={{ y: 0, x: "-50%" }}
                exit={{ y: "100%", x: "-50%" }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 22,
                  mass: 0.75,
                }}
                className="fixed bottom-0 left-1/2 w-full max-w-lg z-[200] rounded-t-3xl print:hidden overflow-hidden flex flex-col"
                style={{
                  maxHeight: "88vh",
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  borderBottom: "none",
                  boxShadow:
                    "0 -20px 60px -10px rgba(109,40,217,0.22), 0 -4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                {/* Fixed Top Section: Gradient header + drag handle + live banner preview */}
                <div className="shrink-0 relative z-10">
                  {/* Gradient header */}
                  <div
                    className="relative flex items-center justify-between px-6 pt-5 pb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(109,40,217,0.90) 0%, rgba(79,70,229,0.90) 55%, rgba(124,58,237,0.85) 100%)",
                    }}
                  >
                    <div
                      className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(167,139,250,0.8), transparent)",
                      }}
                    />
                    <div
                      className="absolute -bottom-4 right-8 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(192,132,252,0.9), transparent)",
                      }}
                    />
                    <div className="flex items-center gap-3 relative z-10">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                        }}
                      >
                        <FileText className="size-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight font-bengali tracking-tight">
                          হেডার সেটিংস
                        </h3>
                        <p className="text-white/70 text-[11px] font-medium leading-tight font-bengali mt-0.5">
                          প্রশ্নপত্রে হেডার ব্যানার কাস্টমাইজ করুন
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsHeaderSettingsOpen(false)}
                      className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {/* Drag handle */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-slate-300/70" />
                  </div>

                  {/* ── Fixed Live Banner Preview ── */}
                  <div className="px-5 pb-3">
                    <div
                      className="relative w-full rounded-2xl overflow-hidden shadow-sm"
                      style={{
                        background: "rgba(248,246,255,0.85)",
                        border: "1px solid rgba(167,139,250,0.2)",
                        minHeight: "90px",
                      }}
                    >
                      {/* Simulated paper strip */}
                      <div className="px-4 pt-3 pb-1.5">
                        <span
                          className="text-[9px] font-bold tracking-widest uppercase font-sans"
                          style={{ color: "rgba(109,40,217,0.55)" }}
                        >
                          প্রিভিউ
                        </span>
                      </div>
                      <div
                        className="mx-4 mb-3 flex items-center overflow-hidden transition-all"
                        style={{
                          minHeight: `${layoutSettings.headerSettings?.height || 70}px`,
                          background:
                            layoutSettings.headerSettings?.bgColor ||
                            "rgba(109,40,217,0.92)",
                          borderRadius: `${layoutSettings.headerSettings?.borderRadius ?? 8}px`,
                          justifyContent:
                            layoutSettings.headerSettings?.align === "left"
                              ? "flex-start"
                              : layoutSettings.headerSettings?.align === "right"
                                ? "flex-end"
                                : "center",
                          paddingLeft: "16px",
                          paddingRight: "16px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            color:
                              layoutSettings.headerSettings?.textColor ||
                              "#ffffff",
                            fontSize: `${layoutSettings.headerSettings?.fontSize || 22}px`,
                            fontWeight: layoutSettings.headerSettings?.bold
                              ? "bold"
                              : "normal",
                            fontStyle: layoutSettings.headerSettings?.italic
                              ? "italic"
                              : "normal",
                            fontFamily:
                              layoutSettings.headerSettings?.fontFamily ===
                              "English"
                                ? "Outfit, sans-serif"
                                : `'${activeFont}', sans-serif`,
                            lineHeight: 1.3,
                            whiteSpace: "pre-line",
                            textAlign:
                              layoutSettings.headerSettings?.align || "center",
                            width: "100%",
                          }}
                        >
                          {layoutSettings.headerSettings?.text ||
                            "বুস্টার সাজেশন প্যাক"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-5 pt-1 pb-6 space-y-4 no-scrollbar">
                  {/* ── Header Text Input ── */}
                  <div
                    className="space-y-2.5 p-4 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <FileText
                        className="size-3.5"
                        style={{ color: "rgb(109,40,217)" }}
                        strokeWidth={2.5}
                      />
                      <span className="text-[12px] font-bold text-slate-700 font-bengali">
                        হেডার টেক্সট
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={layoutSettings.headerSettings?.text || ""}
                      onChange={(e) =>
                        updateSettingField(
                          "headerSettings",
                          "text",
                          e.target.value,
                        )
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-violet-400 focus:border-violet-500 focus:outline-none transition-all rounded-xl text-[13px] font-semibold text-slate-800 shadow-sm resize-none"
                      placeholder="হেডার টেক্সট লিখুন..."
                    />
                  </div>

                  {/* ── Font Size & Height Sliders Row ── */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "ফন্ট সাইজ",
                        icon: Maximize2,
                        field: "fontSize",
                        min: 12,
                        max: 40,
                        unit: "px",
                        value: layoutSettings.headerSettings?.fontSize || 22,
                      },
                      {
                        label: "উচ্চতা",
                        icon: Sliders,
                        field: "height",
                        min: 40,
                        max: 150,
                        unit: "px",
                        value: layoutSettings.headerSettings?.height || 70,
                      },
                    ].map(
                      ({ label, icon: Icon, field, min, max, unit, value }) => (
                        <div
                          key={field}
                          className="space-y-2.5 p-3.5 rounded-2xl"
                          style={{
                            background: "rgba(248,246,255,0.85)",
                            border: "1px solid rgba(167,139,250,0.2)",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Icon
                                className="size-3.5"
                                style={{ color: "rgb(109,40,217)" }}
                                strokeWidth={2.5}
                              />
                              <span className="text-[12px] font-bold text-slate-700 font-bengali">
                                {label}
                              </span>
                            </div>
                            <span
                              className="text-[11px] font-black font-sans px-2 py-0.5 rounded-lg"
                              style={{
                                background: "rgba(109,40,217,0.12)",
                                color: "rgb(109,40,217)",
                              }}
                            >
                              {value}
                              {unit}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={min}
                            max={max}
                            value={value}
                            onChange={(e) =>
                              updateSettingField(
                                "headerSettings",
                                field,
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                            style={{ accentColor: "rgb(109,40,217)" }}
                          />
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 font-sans">
                            <span>
                              {min}
                              {unit}
                            </span>
                            <span>
                              {max}
                              {unit}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* ── Border Radius Slider (full width) ── */}
                  <div
                    className="space-y-2.5 p-3.5 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Move
                          className="size-3.5"
                          style={{ color: "rgb(109,40,217)" }}
                          strokeWidth={2.5}
                        />
                        <span className="text-[12px] font-bold text-slate-700 font-bengali">
                          বর্ডার রেডিয়াস
                        </span>
                      </div>
                      <span
                        className="text-[11px] font-black font-sans px-2 py-0.5 rounded-lg"
                        style={{
                          background: "rgba(109,40,217,0.12)",
                          color: "rgb(109,40,217)",
                        }}
                      >
                        {layoutSettings.headerSettings?.borderRadius ?? 8}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={layoutSettings.headerSettings?.borderRadius ?? 8}
                      onChange={(e) =>
                        updateSettingField(
                          "headerSettings",
                          "borderRadius",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: "rgb(109,40,217)" }}
                    />
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 font-sans">
                      <span>0px</span>
                      <span>40px</span>
                    </div>
                  </div>

                  {/* ── Alignment & Text Style Row ── */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Alignment */}
                    <div
                      className="space-y-2 p-3.5 rounded-2xl"
                      style={{
                        background: "rgba(248,246,255,0.85)",
                        border: "1px solid rgba(167,139,250,0.2)",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <AlignCenter
                          className="size-3.5"
                          style={{ color: "rgb(109,40,217)" }}
                          strokeWidth={2.5}
                        />
                        <span className="text-[12px] font-bold text-slate-700 font-bengali">
                          অ্যালাইনমেন্ট
                        </span>
                      </div>
                      <div className="flex gap-1.5 bg-slate-200/50 p-1 rounded-xl">
                        {[
                          { val: "left", icon: AlignLeft },
                          { val: "center", icon: AlignCenter },
                          { val: "right", icon: AlignRight },
                        ].map((alignOpt) => {
                          const isActive =
                            layoutSettings.headerSettings?.align ===
                            alignOpt.val;
                          const AlignIcon = alignOpt.icon;
                          return (
                            <button
                              key={alignOpt.val}
                              type="button"
                              onClick={() =>
                                updateSettingField(
                                  "headerSettings",
                                  "align",
                                  alignOpt.val,
                                )
                              }
                              className="flex-1 py-2 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                              style={{
                                background: isActive
                                  ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                                  : "transparent",
                                color: isActive
                                  ? "#ffffff"
                                  : "rgba(109,40,217,0.65)",
                                boxShadow: isActive
                                  ? "0 2px 8px rgba(109,40,217,0.25)"
                                  : "none",
                              }}
                            >
                              <AlignIcon className="size-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bold & Italic */}
                    <div
                      className="space-y-2 p-3.5 rounded-2xl"
                      style={{
                        background: "rgba(248,246,255,0.85)",
                        border: "1px solid rgba(167,139,250,0.2)",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Award
                          className="size-3.5"
                          style={{ color: "rgb(109,40,217)" }}
                          strokeWidth={2.5}
                        />
                        <span className="text-[12px] font-bold text-slate-700 font-bengali">
                          টেক্সট স্টাইল
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[
                          {
                            field: "bold",
                            label: "B",
                            extraClass: "font-extrabold",
                            active: layoutSettings.headerSettings?.bold,
                          },
                          {
                            field: "italic",
                            label: "I",
                            extraClass: "italic font-bold",
                            active: layoutSettings.headerSettings?.italic,
                          },
                        ].map(({ field, label, extraClass, active }) => (
                          <button
                            key={field}
                            type="button"
                            onClick={() =>
                              updateSettingField(
                                "headerSettings",
                                field,
                                !active,
                              )
                            }
                            className={`flex-1 py-2 rounded-xl border font-sans text-sm transition-all cursor-pointer ${extraClass}`}
                            style={{
                              background: active
                                ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                                : "white",
                              color: active ? "#ffffff" : "#64748b",
                              borderColor: active
                                ? "transparent"
                                : "rgba(203,213,225,0.8)",
                              boxShadow: active
                                ? "0 2px 8px rgba(109,40,217,0.25)"
                                : "none",
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Background Color ── */}
                  <div
                    className="space-y-3 p-4 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <LayoutGrid
                        className="size-3.5"
                        style={{ color: "rgb(109,40,217)" }}
                        strokeWidth={2.5}
                      />
                      <span className="text-[12px] font-bold text-slate-700 font-bengali">
                        ব্যাকগ্রাউন্ড কালার
                      </span>
                    </div>
                    {/* Preset swatches */}
                    <div className="grid grid-cols-7 gap-2">
                      {[
                        "rgba(30, 41, 59, 0.95)",
                        "rgba(109, 40, 217, 0.92)",
                        "rgba(21, 128, 61, 0.92)",
                        "rgba(185, 28, 28, 0.92)",
                        "rgba(29, 78, 216, 0.92)",
                        "rgba(3, 105, 161, 0.92)",
                        "rgba(15, 118, 110, 0.92)",
                        "rgba(180, 83, 9, 0.92)",
                        "rgba(190, 24, 74, 0.92)",
                        "rgba(55, 65, 81, 0.92)",
                        "rgba(0, 0, 0, 0.95)",
                        "rgba(8, 47, 73, 0.92)",
                        "rgba(20, 110, 120, 0.92)",
                        "rgba(124, 45, 18, 0.92)",
                      ].map((color) => {
                        const isSelected =
                          layoutSettings.headerSettings?.bgColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() =>
                              updateSettingField(
                                "headerSettings",
                                "bgColor",
                                color,
                              )
                            }
                            className="w-7 h-7 rounded-full relative transition-all hover:scale-110 active:scale-95 cursor-pointer"
                            style={{
                              background: color,
                              boxShadow: isSelected
                                ? "0 0 0 2.5px white, 0 0 0 4px rgba(109,40,217,0.6)"
                                : "0 1px 3px rgba(0,0,0,0.2)",
                            }}
                          />
                        );
                      })}
                    </div>
                    {/* Custom color picker row */}
                    <div
                      className="flex items-center gap-2.5 pt-1 px-3 py-2 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(203,213,225,0.6)",
                      }}
                    >
                      <input
                        type="color"
                        value={
                          layoutSettings.headerSettings?.bgColor?.startsWith(
                            "#",
                          )
                            ? layoutSettings.headerSettings.bgColor
                            : "#6d28d9"
                        }
                        onChange={(e) =>
                          updateSettingField(
                            "headerSettings",
                            "bgColor",
                            e.target.value,
                          )
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                        style={{ padding: 0 }}
                      />
                      <input
                        type="text"
                        value={layoutSettings.headerSettings?.bgColor || ""}
                        onChange={(e) =>
                          updateSettingField(
                            "headerSettings",
                            "bgColor",
                            e.target.value,
                          )
                        }
                        className="flex-1 bg-transparent border-0 focus:outline-none text-[12px] font-mono font-bold text-slate-600"
                        placeholder="#6d28d9 বা rgba(109,40,217,0.92)"
                      />
                    </div>
                  </div>

                  {/* ── Text Color ── */}
                  <div
                    className="space-y-3 p-4 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Eye
                        className="size-3.5"
                        style={{ color: "rgb(109,40,217)" }}
                        strokeWidth={2.5}
                      />
                      <span className="text-[12px] font-bold text-slate-700 font-bengali">
                        টেক্সট কালার
                      </span>
                    </div>
                    {/* Preset text color swatches */}
                    <div className="flex items-center gap-2.5">
                      {[
                        { color: "#ffffff", ring: "#94a3b8" },
                        { color: "#000000", ring: "transparent" },
                        { color: "#e2e8f0", ring: "#94a3b8" },
                        { color: "#fef08a", ring: "transparent" },
                        { color: "#fecdd3", ring: "transparent" },
                        { color: "#d9f99d", ring: "transparent" },
                        { color: "#bae6fd", ring: "transparent" },
                      ].map(({ color, ring }) => {
                        const isSelected =
                          layoutSettings.headerSettings?.textColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() =>
                              updateSettingField(
                                "headerSettings",
                                "textColor",
                                color,
                              )
                            }
                            className="w-7 h-7 rounded-full relative transition-all hover:scale-110 active:scale-95 cursor-pointer"
                            style={{
                              background: color,
                              border: `1px solid ${ring}`,
                              boxShadow: isSelected
                                ? "0 0 0 2.5px rgba(109,40,217,0.5), 0 0 0 4.5px rgba(109,40,217,0.2)"
                                : "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                          />
                        );
                      })}
                    </div>
                    {/* Custom text color row */}
                    <div
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(203,213,225,0.6)",
                      }}
                    >
                      <input
                        type="color"
                        value={
                          layoutSettings.headerSettings?.textColor?.startsWith(
                            "#",
                          )
                            ? layoutSettings.headerSettings.textColor
                            : "#ffffff"
                        }
                        onChange={(e) =>
                          updateSettingField(
                            "headerSettings",
                            "textColor",
                            e.target.value,
                          )
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer border-0"
                        style={{ padding: 0 }}
                      />
                      <input
                        type="text"
                        value={layoutSettings.headerSettings?.textColor || ""}
                        onChange={(e) =>
                          updateSettingField(
                            "headerSettings",
                            "textColor",
                            e.target.value,
                          )
                        }
                        className="flex-1 bg-transparent border-0 focus:outline-none text-[12px] font-mono font-bold text-slate-600"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  {/* ── Font Family ── */}
                  <div
                    className="space-y-2.5 p-4 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <FileText
                        className="size-3.5"
                        style={{ color: "rgb(109,40,217)" }}
                        strokeWidth={2.5}
                      />
                      <span className="text-[12px] font-bold text-slate-700 font-bengali">
                        ফন্ট ফ্যামিলি
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full h-10 px-3.5 border border-slate-200 bg-white hover:border-violet-400 focus:outline-none transition-all rounded-xl text-[13px] font-bold text-slate-700 flex justify-between items-center shadow-sm cursor-pointer select-none">
                          <span>
                            {layoutSettings.headerSettings?.fontFamily ===
                            "English"
                              ? "Outfit (English)"
                              : "একুশ (Ekush)"}
                          </span>
                          <ChevronDown className="size-3.5 text-slate-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                        {[
                          { value: "Ekush", label: "একুশ (Ekush)" },
                          { value: "English", label: "Outfit (English)" },
                        ].map((font) => {
                          const isSelected =
                            (layoutSettings.headerSettings?.fontFamily ||
                              "Ekush") === font.value;
                          return (
                            <DropdownMenuItem
                              key={font.value}
                              onSelect={() =>
                                updateSettingField(
                                  "headerSettings",
                                  "fontFamily",
                                  font.value,
                                )
                              }
                              className={`w-full text-left px-2.5 py-2 rounded-lg text-[13px] font-bold transition flex items-center justify-between cursor-pointer focus:bg-violet-50 focus:text-violet-700 hover:bg-slate-50 ${
                                isSelected
                                  ? "bg-violet-50 text-violet-700"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>{font.label}</span>
                              {isSelected && (
                                <span className="size-1.5 rounded-full bg-violet-500" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Bottom Sheet Drawer for Footer Settings — rendered via Portal to escape z-index stacking */}
      {createPortal(
        <AnimatePresence>
          {isFooterSettingsOpen && (
            <>
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsFooterSettingsOpen(false)}
                className="fixed inset-0 z-[150] print:hidden"
                style={{ background: "rgba(15,10,40,0.45)" }}
              />

              {/* Drawer panel */}
              <motion.div
                initial={{ y: "100%", x: "-50%" }}
                animate={{ y: 0, x: "-50%" }}
                exit={{ y: "100%", x: "-50%" }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 22,
                  mass: 0.75,
                }}
                className="fixed bottom-0 left-1/2 w-full max-w-lg z-[200] rounded-t-3xl print:hidden overflow-hidden flex flex-col"
                style={{
                  maxHeight: "88vh",
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  borderBottom: "none",
                  boxShadow:
                    "0 -20px 60px -10px rgba(109,40,217,0.22), 0 -4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                {/* Fixed Top Section: Gradient header + drag handle + live banner preview */}
                <div className="shrink-0 relative z-10">
                  {/* Gradient header */}
                  <div
                    className="relative flex items-center justify-between px-6 pt-5 pb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(109,40,217,0.90) 0%, rgba(79,70,229,0.90) 55%, rgba(124,58,237,0.85) 100%)",
                    }}
                  >
                    <div
                      className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(167,139,250,0.8), transparent)",
                      }}
                    />
                    <div
                      className="absolute -bottom-4 right-8 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(192,132,252,0.9), transparent)",
                      }}
                    />
                    <div className="flex items-center gap-3 relative z-10">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                        }}
                      >
                        <FileText className="size-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight font-bengali tracking-tight">
                          ফুটার সেটিংস
                        </h3>
                        <p className="text-white/70 text-[11px] font-medium leading-tight font-bengali mt-0.5">
                          প্রশ্নপত্রে ফুটার ব্যানার কাস্টমাইজ করুন
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFooterSettingsOpen(false)}
                      className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {/* Drag handle */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-slate-300/70" />
                  </div>

                  {/* ── Fixed Live Banner Preview ── */}
                  <div className="px-5 pb-3">
                    <div
                      className="relative w-full rounded-2xl overflow-hidden shadow-sm"
                      style={{
                        background: "rgba(248,246,255,0.85)",
                        border: "1px solid rgba(167,139,250,0.2)",
                        minHeight: "70px",
                      }}
                    >
                      {/* Simulated paper strip */}
                      <div className="px-4 pt-3 pb-1.5">
                        <span
                          className="text-[9px] font-bold tracking-widest uppercase font-sans"
                          style={{ color: "rgba(109,40,217,0.55)" }}
                        >
                          প্রিভিউ
                        </span>
                      </div>
                      <div
                        className="mx-4 mb-3 flex items-center overflow-hidden transition-all"
                        style={{
                          minHeight: `${layoutSettings.footerSettings?.height || 50}px`,
                          background:
                            layoutSettings.footerSettings?.bgColor ||
                            "rgba(109,40,217,0.92)",
                          borderRadius: `${layoutSettings.footerSettings?.borderRadius ?? 8}px`,
                          justifyContent:
                            layoutSettings.footerSettings?.align === "left"
                              ? "flex-start"
                              : layoutSettings.footerSettings?.align === "right"
                                ? "flex-end"
                                : "center",
                          paddingLeft: "16px",
                          paddingRight: "16px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            color:
                              layoutSettings.footerSettings?.textColor ||
                              "#ffffff",
                            fontSize: `${layoutSettings.footerSettings?.fontSize || 16}px`,
                            fontWeight: layoutSettings.footerSettings?.bold
                              ? "bold"
                              : "normal",
                            fontStyle: layoutSettings.footerSettings?.italic
                              ? "italic"
                              : "normal",
                            fontFamily:
                              layoutSettings.footerSettings?.fontFamily ===
                              "English"
                                ? "Outfit, sans-serif"
                                : `'${activeFont}', sans-serif`,
                            lineHeight: 1.3,
                            whiteSpace: "pre-line",
                            textAlign:
                              layoutSettings.footerSettings?.align || "center",
                            width: "100%",
                          }}
                        >
                          {layoutSettings.footerSettings?.text ||
                            "সকল প্রশ্নের উত্তর দেওয়া বাধ্যতামূলক | শুভকামনা রইল"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-5 pt-1 pb-6 space-y-4 no-scrollbar">
                  {/* ── Footer Text Input ── */}
                  <div
                    className="space-y-2.5 p-4 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <FileText
                        className="size-3.5"
                        style={{ color: "rgb(109,40,217)" }}
                        strokeWidth={2.5}
                      />
                      <span className="text-[12px] font-bold text-slate-700 font-bengali">
                        ফুটার টেক্সট
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={layoutSettings.footerSettings?.text || ""}
                      onChange={(e) =>
                        updateSettingField(
                          "footerSettings",
                          "text",
                          e.target.value,
                        )
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-violet-400 focus:border-violet-500 focus:outline-none transition-all rounded-xl text-[13px] font-semibold text-slate-800 shadow-sm resize-none"
                      placeholder="ফুটার টেক্সট লিখুন..."
                    />
                  </div>

                  {/* ── Font Size & Height Sliders Row ── */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "ফন্ট সাইজ",
                        icon: Maximize2,
                        field: "fontSize",
                        min: 10,
                        max: 40,
                        unit: "px",
                        value: layoutSettings.footerSettings?.fontSize || 16,
                      },
                      {
                        label: "উচ্চতা",
                        icon: Sliders,
                        field: "height",
                        min: 30,
                        max: 150,
                        unit: "px",
                        value: layoutSettings.footerSettings?.height || 50,
                      },
                    ].map(
                      ({ label, icon: Icon, field, min, max, unit, value }) => (
                        <div
                          key={field}
                          className="space-y-2.5 p-3.5 rounded-2xl"
                          style={{
                            background: "rgba(248,246,255,0.85)",
                            border: "1px solid rgba(167,139,250,0.2)",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Icon
                                className="size-3.5"
                                style={{ color: "rgb(109,40,217)" }}
                                strokeWidth={2.5}
                              />
                              <span className="text-[12px] font-bold text-slate-700 font-bengali">
                                {label}
                              </span>
                            </div>
                            <span
                              className="text-[11px] font-black font-sans px-2 py-0.5 rounded-lg"
                              style={{
                                background: "rgba(109,40,217,0.12)",
                                color: "rgb(109,40,217)",
                              }}
                            >
                              {value}
                              {unit}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={min}
                            max={max}
                            value={value}
                            onChange={(e) =>
                              updateSettingField(
                                "footerSettings",
                                field,
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                            style={{ accentColor: "rgb(109,40,217)" }}
                          />
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 font-sans">
                            <span>
                              {min}
                              {unit}
                            </span>
                            <span>
                              {max}
                              {unit}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* ── Border Radius Slider (full width) ── */}
                  <div
                    className="space-y-2.5 p-3.5 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Move
                          className="size-3.5"
                          style={{ color: "rgb(109,40,217)" }}
                          strokeWidth={2.5}
                        />
                        <span className="text-[12px] font-bold text-slate-700 font-bengali">
                          বর্ডার রেডিয়াস
                        </span>
                      </div>
                      <span
                        className="text-[11px] font-black font-sans px-2 py-0.5 rounded-lg"
                        style={{
                          background: "rgba(109,40,217,0.12)",
                          color: "rgb(109,40,217)",
                        }}
                      >
                        {layoutSettings.footerSettings?.borderRadius ?? 8}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={layoutSettings.footerSettings?.borderRadius ?? 8}
                      onChange={(e) =>
                        updateSettingField(
                          "footerSettings",
                          "borderRadius",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: "rgb(109,40,217)" }}
                    />
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 font-sans">
                      <span>0px</span>
                      <span>40px</span>
                    </div>
                  </div>

                  {/* ── Alignment & Text Style Row ── */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Alignment */}
                    <div
                      className="space-y-2 p-3.5 rounded-2xl"
                      style={{
                        background: "rgba(248,246,255,0.85)",
                        border: "1px solid rgba(167,139,250,0.2)",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <AlignCenter
                          className="size-3.5"
                          style={{ color: "rgb(109,40,217)" }}
                          strokeWidth={2.5}
                        />
                        <span className="text-[12px] font-bold text-slate-700 font-bengali">
                          অ্যালাইনমেন্ট
                        </span>
                      </div>
                      <div className="flex gap-1.5 bg-slate-200/50 p-1 rounded-xl">
                        {[
                          { val: "left", icon: AlignLeft },
                          { val: "center", icon: AlignCenter },
                          { val: "right", icon: AlignRight },
                        ].map((alignOpt) => {
                          const isActive =
                            layoutSettings.footerSettings?.align ===
                            alignOpt.val;
                          const AlignIcon = alignOpt.icon;
                          return (
                            <button
                              key={alignOpt.val}
                              type="button"
                              onClick={() =>
                                updateSettingField(
                                  "footerSettings",
                                  "align",
                                  alignOpt.val,
                                )
                              }
                              className="flex-1 py-2 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                              style={{
                                background: isActive
                                  ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                                  : "transparent",
                                color: isActive
                                  ? "#ffffff"
                                  : "rgba(109,40,217,0.65)",
                                boxShadow: isActive
                                  ? "0 2px 8px rgba(109,40,217,0.25)"
                                  : "none",
                              }}
                            >
                              <AlignIcon className="size-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bold & Italic */}
                    <div
                      className="space-y-2 p-3.5 rounded-2xl"
                      style={{
                        background: "rgba(248,246,255,0.85)",
                        border: "1px solid rgba(167,139,250,0.2)",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Award
                          className="size-3.5"
                          style={{ color: "rgb(109,40,217)" }}
                          strokeWidth={2.5}
                        />
                        <span className="text-[12px] font-bold text-slate-700 font-bengali">
                          টেক্সট স্টাইল
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[
                          {
                            field: "bold",
                            label: "B",
                            extraClass: "font-extrabold",
                            active: layoutSettings.footerSettings?.bold,
                          },
                          {
                            field: "italic",
                            label: "I",
                            extraClass: "italic font-bold",
                            active: layoutSettings.footerSettings?.italic,
                          },
                        ].map(({ field, label, extraClass, active }) => (
                          <button
                            key={field}
                            type="button"
                            onClick={() =>
                              updateSettingField(
                                "footerSettings",
                                field,
                                !active,
                              )
                            }
                            className={`flex-1 py-2 rounded-xl border font-sans text-sm transition-all cursor-pointer ${extraClass}`}
                            style={{
                              background: active
                                ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                                : "white",
                              color: active ? "#ffffff" : "#64748b",
                              borderColor: active
                                ? "transparent"
                                : "rgba(203,213,225,0.8)",
                              boxShadow: active
                                ? "0 2px 8px rgba(109,40,217,0.25)"
                                : "none",
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Background Color ── */}
                  <div
                    className="space-y-3 p-4 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <LayoutGrid
                        className="size-3.5"
                        style={{ color: "rgb(109,40,217)" }}
                        strokeWidth={2.5}
                      />
                      <span className="text-[12px] font-bold text-slate-700 font-bengali">
                        ব্যাকগ্রাউন্ড কালার
                      </span>
                    </div>
                    {/* Preset swatches */}
                    <div className="grid grid-cols-7 gap-2">
                      {[
                        "rgba(30, 41, 59, 0.95)",
                        "rgba(109, 40, 217, 0.92)",
                        "rgba(21, 128, 61, 0.92)",
                        "rgba(185, 28, 28, 0.92)",
                        "rgba(29, 78, 216, 0.92)",
                        "rgba(3, 105, 161, 0.92)",
                        "rgba(15, 118, 110, 0.92)",
                        "rgba(180, 83, 9, 0.92)",
                        "rgba(190, 24, 74, 0.92)",
                        "rgba(55, 65, 81, 0.92)",
                        "rgba(0, 0, 0, 0.95)",
                        "rgba(8, 47, 73, 0.92)",
                        "rgba(20, 110, 120, 0.92)",
                        "rgba(124, 45, 18, 0.92)",
                      ].map((color) => {
                        const isSelected =
                          layoutSettings.footerSettings?.bgColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() =>
                              updateSettingField(
                                "footerSettings",
                                "bgColor",
                                color,
                              )
                            }
                            className="w-7 h-7 rounded-full relative transition-all hover:scale-110 active:scale-95 cursor-pointer"
                            style={{
                              background: color,
                              boxShadow: isSelected
                                ? "0 0 0 2.5px white, 0 0 0 4px rgba(109,40,217,0.6)"
                                : "0 1px 3px rgba(0,0,0,0.2)",
                            }}
                          />
                        );
                      })}
                    </div>
                    {/* Custom color picker row */}
                    <div
                      className="flex items-center gap-2.5 pt-1 px-3 py-2 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(203,213,225,0.6)",
                      }}
                    >
                      <input
                        type="color"
                        value={
                          layoutSettings.footerSettings?.bgColor?.startsWith(
                            "#",
                          )
                            ? layoutSettings.footerSettings.bgColor
                            : "#6d28d9"
                        }
                        onChange={(e) =>
                          updateSettingField(
                            "footerSettings",
                            "bgColor",
                            e.target.value,
                          )
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                        style={{ padding: 0 }}
                      />
                      <input
                        type="text"
                        value={layoutSettings.footerSettings?.bgColor || ""}
                        onChange={(e) =>
                          updateSettingField(
                            "footerSettings",
                            "bgColor",
                            e.target.value,
                          )
                        }
                        className="flex-1 bg-transparent border-0 focus:outline-none text-[12px] font-mono font-bold text-slate-600"
                        placeholder="#6d28d9 বা rgba(109,40,217,0.92)"
                      />
                    </div>
                  </div>

                  {/* ── Text Color ── */}
                  <div
                    className="space-y-3 p-4 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Eye
                        className="size-3.5"
                        style={{ color: "rgb(109,40,217)" }}
                        strokeWidth={2.5}
                      />
                      <span className="text-[12px] font-bold text-slate-700 font-bengali">
                        টেক্সট কালার
                      </span>
                    </div>
                    {/* Preset text color swatches */}
                    <div className="flex items-center gap-2.5">
                      {[
                        { color: "#ffffff", ring: "#94a3b8" },
                        { color: "#000000", ring: "transparent" },
                        { color: "#e2e8f0", ring: "#94a3b8" },
                        { color: "#fef08a", ring: "transparent" },
                        { color: "#fecdd3", ring: "transparent" },
                        { color: "#d9f99d", ring: "transparent" },
                        { color: "#bae6fd", ring: "transparent" },
                      ].map(({ color, ring }) => {
                        const isSelected =
                          layoutSettings.footerSettings?.textColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() =>
                              updateSettingField(
                                "footerSettings",
                                "textColor",
                                color,
                              )
                            }
                            className="w-7 h-7 rounded-full relative transition-all hover:scale-110 active:scale-95 cursor-pointer"
                            style={{
                              background: color,
                              border: `1px solid ${ring}`,
                              boxShadow: isSelected
                                ? "0 0 0 2.5px rgba(109,40,217,0.5), 0 0 0 4.5px rgba(109,40,217,0.2)"
                                : "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                          />
                        );
                      })}
                    </div>
                    {/* Custom text color row */}
                    <div
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(203,213,225,0.6)",
                      }}
                    >
                      <input
                        type="color"
                        value={
                          layoutSettings.footerSettings?.textColor?.startsWith(
                            "#",
                          )
                            ? layoutSettings.footerSettings.textColor
                            : "#ffffff"
                        }
                        onChange={(e) =>
                          updateSettingField(
                            "footerSettings",
                            "textColor",
                            e.target.value,
                          )
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer border-0"
                        style={{ padding: 0 }}
                      />
                      <input
                        type="text"
                        value={layoutSettings.footerSettings?.textColor || ""}
                        onChange={(e) =>
                          updateSettingField(
                            "footerSettings",
                            "textColor",
                            e.target.value,
                          )
                        }
                        className="flex-1 bg-transparent border-0 focus:outline-none text-[12px] font-mono font-bold text-slate-600"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  {/* ── Font Family ── */}
                  <div
                    className="space-y-2.5 p-4 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <FileText
                        className="size-3.5"
                        style={{ color: "rgb(109,40,217)" }}
                        strokeWidth={2.5}
                      />
                      <span className="text-[12px] font-bold text-slate-700 font-bengali">
                        ফন্ট ফ্যামিলি
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full h-10 px-3.5 border border-slate-200 bg-white hover:border-violet-400 focus:outline-none transition-all rounded-xl text-[13px] font-bold text-slate-700 flex justify-between items-center shadow-sm cursor-pointer select-none">
                          <span>
                            {layoutSettings.footerSettings?.fontFamily ===
                            "English"
                              ? "Outfit (English)"
                              : "একুশ (Ekush)"}
                          </span>
                          <ChevronDown className="size-3.5 text-slate-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                        {[
                          { value: "Ekush", label: "একুশ (Ekush)" },
                          { value: "English", label: "Outfit (English)" },
                        ].map((font) => {
                          const isSelected =
                            (layoutSettings.footerSettings?.fontFamily ||
                              "Ekush") === font.value;
                          return (
                            <DropdownMenuItem
                              key={font.value}
                              onSelect={() =>
                                updateSettingField(
                                  "footerSettings",
                                  "fontFamily",
                                  font.value,
                                )
                              }
                              className={`w-full text-left px-2.5 py-2 rounded-lg text-[13px] font-bold transition flex items-center justify-between cursor-pointer focus:bg-violet-50 focus:text-violet-700 hover:bg-slate-50 ${
                                isSelected
                                  ? "bg-violet-50 text-violet-700"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>{font.label}</span>
                              {isSelected && (
                                <span className="size-1.5 rounded-full bg-violet-500" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

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
