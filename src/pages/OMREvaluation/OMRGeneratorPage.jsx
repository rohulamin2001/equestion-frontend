import { useState } from "react";
import OMRSettingsSidebar from "./components/OMRSettingsSidebar";
import OMRSheetPrintView from "./components/OMRSheetPrintView";

export default function OMRGeneratorPage() {
  const [templateType, setTemplateType] = useState("smart-signature"); // "smart-signature" | "standard-classic"
  const [instituteName, setInstituteName] = useState("সোনার বাংলা হাই স্কুল");
  const [instituteAddress, setInstituteAddress] = useState("ভালুকা, ময়মনসিংহ");
  const [instituteNameSize, setInstituteNameSize] = useState(18);
  const [instituteAddressSize, setInstituteAddressSize] = useState(12);
  const [headerBorderWidth, setHeaderBorderWidth] = useState(100);
  const [headerBorderStyle, setHeaderBorderStyle] = useState("dashed"); // "dashed" | "solid" | "dotted" | "double" | "none"
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
      {/* ── Main 2-Column Editor Workspace ── */}
      <div className="flex flex-col lg:flex-row items-start gap-4 relative">
        {/* Left: Interactive A4 Sheet Canvas Preview */}
        <div className="flex-1 w-full flex flex-col items-center min-w-0">
          <div className="w-full  rounded  flex justify-center overflow-x-auto min-h-[calc(100vh-100px)] print:p-0 print:border-none print:bg-white ">
            <OMRSheetPrintView
              templateType={templateType}
              instituteName={instituteName}
              instituteAddress={instituteAddress}
              instituteNameSize={instituteNameSize}
              instituteAddressSize={instituteAddressSize}
              headerBorderWidth={headerBorderWidth}
              headerBorderStyle={headerBorderStyle}
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
          headerBorderWidth={headerBorderWidth}
          setHeaderBorderWidth={setHeaderBorderWidth}
          headerBorderStyle={headerBorderStyle}
          setHeaderBorderStyle={setHeaderBorderStyle}
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
