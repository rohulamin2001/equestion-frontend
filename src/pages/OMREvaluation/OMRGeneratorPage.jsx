import { ArrowRight, FileCheck, Printer, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import OMRSettingsSidebar from "./components/OMRSettingsSidebar";
import OMRSheetPrintView from "./components/OMRSheetPrintView";

export default function OMRGeneratorPage() {
  const [templateType, setTemplateType] = useState("smart-signature"); // "smart-signature" | "standard-classic"
  const [instituteName, setInstituteName] = useState("সোনার বাংলা হাই স্কুল");
  const [instituteAddress, setInstituteAddress] = useState("ভালুকা, ময়মনসিংহ");
  const [instituteNameSize, setInstituteNameSize] = useState(18);
  const [instituteAddressSize, setInstituteAddressSize] = useState(12);
  const [examTitle, setExamTitle] = useState(
    "বার্ষিক মূল্যায়ন মডেল টেস্ট - ২০২৬",
  );
  const [showExamTitle, setShowExamTitle] = useState(true);

  const [subject, setSubject] = useState("পদার্থবিজ্ঞান ১ম পত্র");
  const [showSubject, setShowSubject] = useState(true);

  const [subjectCode, setSubjectCode] = useState("১০১");
  const [showSubjectCode, setShowSubjectCode] = useState(true);

  const [examTime, setExamTime] = useState("৫০ মিনিট");
  const [showExamTime, setShowExamTime] = useState(true);

  const [totalQuestions, setTotalQuestions] = useState(40);
  const [optionLanguage, setOptionLanguage] = useState("BN"); // 'BN' (ক,খ,গ,ঘ) or 'EN' (A,B,C,D)
  const [themeColor, setThemeColor] = useState("#E11D48"); // Default: Rose / Board Red
  const [headerType, setHeaderType] = useState("big"); // "small" | "big"
  const [infoType, setInfoType] = useState("digital"); // "digital" | "manual"
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSignatures, setShowSignatures] = useState(true);

  const selectedLayoutCode =
    templateType === "smart-signature"
      ? `OMR-SIG-${totalQuestions}-V1`
      : `OMR-STD-${totalQuestions}-V1`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-2.5 max-w-[1600px] mx-auto pb-6">
      {/* ── Slim Single-Line Top Bar (Hidden on Print) ── */}
      <div
        className="print:hidden w-full flex items-center justify-between px-3 sm:px-4 py-2 rounded-xl transition-all shadow-xs"
        style={{
          background: "var(--q-tab-switcher-bg)",
          border: "1px solid var(--q-tab-switcher-border)",
        }}
      >
        {/* Left: Compact Title & Icon */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
            style={{ background: "var(--q-header-gradient)" }}
          >
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              ওএমআর (OMR) শিট তৈরি ও কাস্টমাইজেশন
            </h1>
            <span
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
              style={{
                backgroundColor: "var(--q-selected-bg)",
                color: "var(--purple-700)",
                border: "1px solid var(--q-card-border-soft)",
              }}
            >
              <Sparkles className="w-3 h-3 text-purple-600" />
              A4 রেডি
            </span>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white text-xs font-bold rounded-lg transition-colors focus-ring-modern hover:opacity-95 cursor-pointer shadow-sm"
            style={{
              background: "var(--q-header-gradient)",
              boxShadow: "var(--q-print-btn-shadow)",
            }}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট করুন (A4)</span>
          </button>

          <Link
            to="/dashboard/omr/tokens"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-ring-modern hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-foreground)",
              border: "1px solid var(--q-badge-border)",
            }}
          >
            <span>টোকেন পেজ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Main 2-Column Editor Workspace ── */}
      <div className="flex flex-col lg:flex-row items-start gap-4 relative">
        {/* Left: Interactive A4 Sheet Canvas Preview */}
        <div className="flex-1 w-full flex flex-col items-center min-w-0">
          <div className="w-full bg-slate-200/60 dark:bg-slate-950/60 p-3 sm:p-5 rounded-2xl border border-slate-300/80 dark:border-slate-800 flex justify-center overflow-x-auto min-h-[calc(100vh-100px)] print:p-0 print:border-none print:bg-white shadow-inner">
            <OMRSheetPrintView
              templateType={templateType}
              instituteName={instituteName}
              instituteAddress={instituteAddress}
              instituteNameSize={instituteNameSize}
              instituteAddressSize={instituteAddressSize}
              examTitle={examTitle}
              showExamTitle={showExamTitle}
              subject={subject}
              showSubject={showSubject}
              subjectCode={subjectCode}
              showSubjectCode={showSubjectCode}
              examTime={examTime}
              showExamTime={showExamTime}
              totalQuestions={totalQuestions}
              optionLanguage={optionLanguage}
              themeColor={themeColor}
              headerType={headerType}
              infoType={infoType}
              showInstructions={showInstructions}
              showSignatures={showSignatures}
              selectedLayoutCode={selectedLayoutCode}
            />
          </div>
        </div>

        {/* Right: Dedicated OMR Customizer & Settings Sidebar */}
        <OMRSettingsSidebar
          templateType={templateType}
          setTemplateType={setTemplateType}
          instituteName={instituteName}
          setInstituteName={setInstituteName}
          instituteAddress={instituteAddress}
          setInstituteAddress={setInstituteAddress}
          instituteNameSize={instituteNameSize}
          setInstituteNameSize={setInstituteNameSize}
          instituteAddressSize={instituteAddressSize}
          setInstituteAddressSize={setInstituteAddressSize}
          examTitle={examTitle}
          setExamTitle={setExamTitle}
          showExamTitle={showExamTitle}
          setShowExamTitle={setShowExamTitle}
          subject={subject}
          setSubject={setSubject}
          showSubject={showSubject}
          setShowSubject={setShowSubject}
          subjectCode={subjectCode}
          setSubjectCode={setSubjectCode}
          showSubjectCode={showSubjectCode}
          setShowSubjectCode={setShowSubjectCode}
          examTime={examTime}
          setExamTime={setExamTime}
          showExamTime={showExamTime}
          setShowExamTime={setShowExamTime}
          totalQuestions={totalQuestions}
          setTotalQuestions={setTotalQuestions}
          optionLanguage={optionLanguage}
          setOptionLanguage={setOptionLanguage}
          themeColor={themeColor}
          setThemeColor={setThemeColor}
          headerType={headerType}
          setHeaderType={setHeaderType}
          infoType={infoType}
          setInfoType={setInfoType}
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
          showSignatures={showSignatures}
          setShowSignatures={setShowSignatures}
          selectedLayoutCode={selectedLayoutCode}
          onPrint={handlePrint}
        />
      </div>
    </div>
  );
}
