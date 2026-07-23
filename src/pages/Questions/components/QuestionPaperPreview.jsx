import { Info, Monitor, Plus, Settings } from "lucide-react";
import { useState } from "react";
import InlineEditable from "../../../components/InlineEditable.jsx";
import { translateSubscriptionKey } from "../../../constants/subscriptions.js";
import {
  getCategoryMarkLabel,
  getChapterNames,
  parseBanglaNumber,
} from "../utils/questionUtils.js";

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

export default function QuestionPaperPreview({
  layoutSettings,
  activeFont,
  activeSet,
  userProfile,
  syllabusList,
  groupedQuestions,
  customGroupLabels,
  setCustomGroupLabels,
  customGroupMarks,
  setCustomGroupMarks,
  customSubMarks,
  setCustomSubMarks,
  handleSaveSetField,
  handleSaveSubjectCodeDigit,
  handleSaveQuestionEdit,
  handleEditorActivate,
  handleEditorDeactivate,
  handleGoBackToSelect,
  updateSettingField,
  onOpenMobileSettings,
}) {
  const baseFontSize = layoutSettings.fontSize || 14;
  const [customSerials, setCustomSerials] = useState({});
  const [customOptionLabels, setCustomOptionLabels] = useState({});
  const [customSubLabels, setCustomSubLabels] = useState({});

  return (
    <div className="flex-1 lg:col-span-8 flex flex-col items-center">
      <div
        className="w-full max-w-[850px] mb-4 flex items-center justify-between p-1 rounded shrink-0 print:hidden"
        style={{
          background: "rgba(109,40,217,0.12)",
          border: "1.5px solid rgba(109,40,217,0.2)",
        }}
      >
        <div className="flex items-center gap-2 pl-4">
          <div className="flex items-center gap-1.5 text-violet-800 text-[13px] font-bengali">
            <Monitor className="size-4 text-violet-600" />
            <span>লাইভ প্রিভিউ</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-violet-600/70 font-medium font-bengali">
            (টেক্সটে ক্লিক করে সরাসরি এডিট করুন)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMobileSettings && (
            <button
              onClick={onOpenMobileSettings}
              className="lg:hidden px-3.5 py-2 text-white rounded text-[13px] transition flex items-center gap-1.5 shadow cursor-pointer font-bengali select-none hover:opacity-95"
              style={{
                background:
                  "linear-gradient(135deg, rgba(147,51,234,0.92) 0%, rgba(124,58,237,0.92) 100%)",
                boxShadow:
                  "0 4px 16px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <Settings className="size-4" />
              সেটিংস
            </button>
          )}

          <button
            onClick={handleGoBackToSelect}
            className="px-4 py-2 text-white rounded text-[13px] transition flex items-center gap-1.5 shadow cursor-pointer font-bengali select-none hover:opacity-95"
            style={{
              background:
                "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)",
              boxShadow:
                "0 4px 16px rgba(109,40,217,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <Plus className="size-4" />
            আরও প্রশ্ন যুক্ত করুন
          </button>
        </div>
      </div>

      <div
        className={`question-paper-container relative ${layoutSettings.fontFamily === "English" ? "is-english" : `font-family-${activeFont}`} bg-white text-black border border-slate-200/60 p-8 shadow-sm print:border-none print:shadow-none print:p-0 select-none print:select-text`}
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
        {/* Watermark Overlay */}
        {layoutSettings.branding?.watermark && (
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 select-none"
            aria-hidden="true"
          >
            {layoutSettings.watermarkSettings?.type === "image" &&
            layoutSettings.watermarkSettings?.imageUrl ? (
              <img
                src={layoutSettings.watermarkSettings.imageUrl}
                alt="Watermark"
                className="max-w-none transition-all duration-200"
                style={{
                  width: `${layoutSettings.watermarkSettings?.imageWidth || 200}px`,
                  opacity:
                    (layoutSettings.watermarkSettings?.opacity ?? 15) / 100,
                  transform: `rotate(${layoutSettings.watermarkSettings?.rotation ?? -30}deg)`,
                }}
              />
            ) : (
              <div
                className="whitespace-nowrap font-bold tracking-wider text-center transition-all duration-200"
                style={{
                  fontSize: `${layoutSettings.watermarkSettings?.fontSize || 48}px`,
                  color: layoutSettings.watermarkSettings?.color || "#94a3b8",
                  opacity:
                    (layoutSettings.watermarkSettings?.opacity ?? 15) / 100,
                  transform: `rotate(${layoutSettings.watermarkSettings?.rotation ?? -30}deg)`,
                  fontFamily:
                    layoutSettings.fontFamily === "English"
                      ? "Outfit, sans-serif"
                      : `'${activeFont}', 'SolaimanLipi', sans-serif`,
                }}
              >
                {layoutSettings.watermarkSettings?.text ||
                  "গভর্নমেন্ট হাই স্কুল"}
              </div>
            )}
          </div>
        )}
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
              {layoutSettings.headerSettings?.text || "বুস্টার সাজেশন প্যাক"}
            </div>
          </div>
        )}

        <div className="space-y-1 select-none">
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
                  onSave={(val) => handleSaveSetField("institutionName", val)}
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
                      const codeVal = String(activeSet.subjectCode || "১০১");
                      const digit = codeVal[i] || "";
                      const borderClass =
                        i === 0
                          ? "border-2 border-black"
                          : "border-2 border-l-0 border-black";
                      return (
                        <InlineEditable
                          key={i}
                          value={digit}
                          onSave={(val) => handleSaveSubjectCodeDigit(i, val)}
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
            className="flex justify-between items-center text-black font-normal mt-2"
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
                          ? Number(activeSet.totalMarks).toLocaleString("bn-BD")
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
                  onSave={(val) => handleSaveSetField("studentNameLabel", val)}
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
                    onSave={(val) => handleSaveSetField("sectionValue", val)}
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
                onSave={(val) => handleSaveSetField("instructionsText", val)}
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
            className="relative"
            style={{ lineHeight: layoutSettings.lineHeight ?? 1.5 }}
          >
            <div
              className="block"
              style={{
                columnCount: layoutSettings.columns,
                columnGap: `${layoutSettings.columnGap || 15}px`,
                columnRule: "none",
              }}
            >
              {groupedQuestions.map((group) => (
                <div key={group.category} className=" break-inside-auto">
                  {/* Section Header */}
                  <div
                    className="flex justify-between items-baseline font-bold text-black pt-1 print:pt-0 font-bengali select-text print:select-text"
                    style={{ fontSize: `${baseFontSize}px` }}
                  >
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
                        className="font-bold text-black"
                        style={{ fontSize: `${baseFontSize}px` }}
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
                          className="font-normal text-black font-sans print:font-sans"
                          style={{ fontSize: `${baseFontSize}px` }}
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
                          className="relative transition print:border-none print:hover:border-none print:hover:bg-transparent print:p-0"
                          style={{
                            marginBottom: `${layoutSettings.lineSpacing}px`,
                            breakInside: "avoid",
                            pageBreakInside: "avoid",
                          }}
                        >
                          <div className="flex items-start gap-2 text-inherit text-black">
                            <InlineEditable
                              value={
                                customSerials[q._id] !== undefined
                                  ? customSerials[q._id]
                                  : `${serialNum}.`
                              }
                              onSave={(val) =>
                                setCustomSerials((prev) => ({
                                  ...prev,
                                  [q._id]: val,
                                }))
                              }
                              onActivate={handleEditorActivate}
                              onDeactivate={handleEditorDeactivate}
                              renderRichText={false}
                              className="font-normal text-black shrink-0"
                              inline={true}
                              placeholder="সিরিয়াল"
                            />
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
                                            className="flex items-start gap-2"
                                          >
                                            {layoutSettings.optionStyle ===
                                              "◯" ||
                                            layoutSettings.optionStyle ===
                                              "●" ? (
                                              <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full border border-black text-black font-normal leading-none shrink-0 align-middle select-none">
                                                <InlineEditable
                                                  value={
                                                    customOptionLabels[
                                                      `${q._id}-${oIdx}`
                                                    ] !== undefined
                                                      ? customOptionLabels[
                                                          `${q._id}-${oIdx}`
                                                        ]
                                                      : prefix
                                                  }
                                                  onSave={(val) =>
                                                    setCustomOptionLabels(
                                                      (prev) => ({
                                                        ...prev,
                                                        [`${q._id}-${oIdx}`]:
                                                          val,
                                                      }),
                                                    )
                                                  }
                                                  onActivate={
                                                    handleEditorActivate
                                                  }
                                                  onDeactivate={
                                                    handleEditorDeactivate
                                                  }
                                                  renderRichText={false}
                                                  className="font-normal text-black text-center shrink-0"
                                                  inline={true}
                                                  placeholder="অপশন"
                                                />
                                              </span>
                                            ) : (
                                              <InlineEditable
                                                value={
                                                  customOptionLabels[
                                                    `${q._id}-${oIdx}`
                                                  ] !== undefined
                                                    ? customOptionLabels[
                                                        `${q._id}-${oIdx}`
                                                      ]
                                                    : layoutSettings.optionStyle ===
                                                        "()"
                                                      ? `(\u200A${prefix}\u200A)`
                                                      : layoutSettings.optionStyle ===
                                                          "."
                                                        ? `${prefix}.`
                                                        : layoutSettings.optionStyle ===
                                                            ")"
                                                          ? `${prefix}\u200A)`
                                                          : `${prefix}${layoutSettings.optionStyle}`
                                                }
                                                onSave={(val) =>
                                                  setCustomOptionLabels(
                                                    (prev) => ({
                                                      ...prev,
                                                      [`${q._id}-${oIdx}`]: val,
                                                    }),
                                                  )
                                                }
                                                onActivate={
                                                  handleEditorActivate
                                                }
                                                onDeactivate={
                                                  handleEditorDeactivate
                                                }
                                                renderRichText={false}
                                                className="font-normal text-black shrink-0"
                                                inline={true}
                                                placeholder="অপশন"
                                              />
                                            )}
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
                              {q.category === "Creative" && q.creativeData && (
                                <div className="space-y-1">
                                  <div className="font-medium text-black">
                                    <InlineEditable
                                      value={q.creativeData.stem}
                                      inline={false}
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
                                    <div className="space-y-0.5 text-black text-inherit">
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
                                              {layoutSettings.optionStyle ===
                                                "◯" ||
                                              layoutSettings.optionStyle ===
                                                "●" ? (
                                                <span className="inline-flex items-center justify-center w-[18px] h-[18px] px-1 rounded-full border border-black text-black font-normal leading-none shrink-0 align-middle select-none">
                                                  <InlineEditable
                                                    value={
                                                      customSubLabels[
                                                        `${q._id}-${sqIdx}`
                                                      ] !== undefined
                                                        ? customSubLabels[
                                                            `${q._id}-${sqIdx}`
                                                          ]
                                                        : letter
                                                    }
                                                    onSave={(val) =>
                                                      setCustomSubLabels(
                                                        (prev) => ({
                                                          ...prev,
                                                          [`${q._id}-${sqIdx}`]:
                                                            val,
                                                        }),
                                                      )
                                                    }
                                                    onActivate={
                                                      handleEditorActivate
                                                    }
                                                    onDeactivate={
                                                      handleEditorDeactivate
                                                    }
                                                    renderRichText={false}
                                                    className="font-normal text-black text-center shrink-0"
                                                    inline={true}
                                                    placeholder="অপশন"
                                                  />
                                                </span>
                                              ) : (
                                                <InlineEditable
                                                  value={
                                                    customSubLabels[
                                                      `${q._id}-${sqIdx}`
                                                    ] !== undefined
                                                      ? customSubLabels[
                                                          `${q._id}-${sqIdx}`
                                                        ]
                                                      : layoutSettings.optionStyle ===
                                                          "()"
                                                        ? `(\u200A${letter}\u200A)`
                                                        : layoutSettings.optionStyle ===
                                                            "."
                                                          ? `${letter}.`
                                                          : layoutSettings.optionStyle ===
                                                              ")"
                                                            ? `${letter}\u200A)`
                                                            : `${letter}${layoutSettings.optionStyle}`
                                                  }
                                                  onSave={(val) =>
                                                    setCustomSubLabels(
                                                      (prev) => ({
                                                        ...prev,
                                                        [`${q._id}-${sqIdx}`]:
                                                          val,
                                                      }),
                                                    )
                                                  }
                                                  onActivate={
                                                    handleEditorActivate
                                                  }
                                                  onDeactivate={
                                                    handleEditorDeactivate
                                                  }
                                                  renderRichText={false}
                                                  className="font-normal shrink-0"
                                                  inline={true}
                                                  placeholder="অপশন"
                                                />
                                              )}
                                              <div className="flex-1 text-inherit">
                                                <InlineEditable
                                                  value={sq.text}
                                                  onSave={(val) => {
                                                    handleSaveQuestionEdit(q, {
                                                      creativeData: {
                                                        ...q.creativeData,
                                                        subQuestions: {
                                                          ...q.creativeData
                                                            .subQuestions,
                                                          [key]: {
                                                            ...sq,
                                                            text: val,
                                                          },
                                                        },
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
                                                  setCustomSubMarks((prev) => ({
                                                    ...prev,
                                                    [`${q._id}-${sqIdx}`]: val,
                                                  }));
                                                }}
                                                onActivate={
                                                  handleEditorActivate
                                                }
                                                onDeactivate={
                                                  handleEditorDeactivate
                                                }
                                                renderRichText={false}
                                                className="text-black font-normal shrink-0 font-sans print:font-sans"
                                                style={{
                                                  fontSize: `${baseFontSize}px`,
                                                }}
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
                                        value={q.generalData.questionText || ""}
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
                                      <div className="text-black">
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
                                          onDeactivate={handleEditorDeactivate}
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

            {/* Custom Height-Controlled Column Divider Lines */}
            {layoutSettings.columns > 1 &&
              layoutSettings.columnDivider &&
              Array.from({ length: layoutSettings.columns - 1 }).map(
                (_, idx) => {
                  const leftPercent =
                    ((idx + 1) / layoutSettings.columns) * 100;
                  return (
                    <div
                      key={idx}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none print:block"
                      style={{
                        left: `${leftPercent}%`,
                        height: `${layoutSettings.columnDividerHeight ?? 100}%`,
                        width: `${layoutSettings.columnDividerWidth || 1}px`,
                        backgroundColor:
                          layoutSettings.columnDividerColor || "#000000",
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                      }}
                    />
                  );
                },
              )}
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
  );
}
