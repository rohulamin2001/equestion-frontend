import { ArrowRight, Printer } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import OMRSettingsSidebar from "./components/OMRSettingsSidebar";
import OMRSheetPrintView from "./components/OMRSheetPrintView";

export default function OMRGeneratorPage() {
  const [templateType, setTemplateType] = useState("smart-signature"); // "smart-signature" | "standard-classic"
  const [instituteName, setInstituteName] = useState("সোনার বাংলা হাই স্কুল");
  const [instituteAddress, setInstituteAddress] = useState("বেলাবো, নরসিংদী");
  const [instituteNameSize, setInstituteNameSize] = useState(18);
  const [instituteAddressSize, setInstituteAddressSize] = useState(12);
  const [examTitle, setExamTitle] = useState(
    "বার্ষিক মূল্যায়ন মডেল টেস্ট - ২০২৬",
  );
  const [subject, setSubject] = useState("পদার্থবিজ্ঞান ১ম পত্র");
  const [subjectCode, setSubjectCode] = useState("১০১");
  const [examTime, setExamTime] = useState("৫০ মিনিট");
  const [totalQuestions, setTotalQuestions] = useState(40);
  const [optionLanguage, setOptionLanguage] = useState("BN"); // 'BN' (ক,খ,গ,ঘ) or 'EN' (A,B,C,D)
  const [themeColor, setThemeColor] = useState("#E11D48"); // Default: Rose / Board Red
  const [headerType, setHeaderType] = useState("big"); // "small" | "big"
  const [infoType, setInfoType] = useState("digital"); // "digital" | "manual"

  const selectedLayoutCode =
    templateType === "smart-signature"
      ? `OMR-SIG-${totalQuestions}-V1`
      : `OMR-STD-${totalQuestions}-V1`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header (Hidden on Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              ওএমআর (OMR) শিট তৈরি ও কাস্টমাইজেশন
            </h1>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-200 dark:border-indigo-800">
              Step 1
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ডানপাশের সেটিংস প্যানেল থেকে টেমপ্লেট, থিম ও প্রতিষ্ঠানের নাম
            কাস্টমাইজ করে সরাসরি A4 শিট প্রিন্ট করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট করুন (A4)</span>
          </button>

          <Link
            to="/dashboard/omr/tokens"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            <span>টোকেন পেজ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main 2-Column Editor Workspace */}
      <div className="flex flex-col lg:flex-row items-start gap-6 relative">
        {/* Left / Center: Interactive A4 Sheet Canvas Preview */}
        <div className="flex-1 w-full bg-slate-200/70 dark:bg-slate-950/70 p-3 sm:p-6 rounded-2xl border border-slate-300/80 dark:border-slate-800/80 flex justify-center overflow-x-auto min-h-[calc(100vh-220px)] print:p-0 print:border-none print:bg-white">
          <OMRSheetPrintView
            templateType={templateType}
            instituteName={instituteName}
            instituteAddress={instituteAddress}
            instituteNameSize={instituteNameSize}
            instituteAddressSize={instituteAddressSize}
            examTitle={examTitle}
            subject={subject}
            subjectCode={subjectCode}
            examTime={examTime}
            totalQuestions={totalQuestions}
            optionLanguage={optionLanguage}
            themeColor={themeColor}
            headerType={headerType}
            infoType={infoType}
            selectedLayoutCode={selectedLayoutCode}
          />
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
          selectedLayoutCode={selectedLayoutCode}
          onPrint={handlePrint}
        />
      </div>
    </div>
  );
}
