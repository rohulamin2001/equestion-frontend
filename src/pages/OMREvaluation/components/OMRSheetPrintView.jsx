import SmartSignatureOMRTemplate from "./templates/SmartSignatureOMRTemplate";
import StandardClassicOMRTemplate from "./templates/StandardClassicOMRTemplate";

export default function OMRSheetPrintView({
  templateType = "smart-signature", // "smart-signature" | "standard-classic"
  instituteName = "সোনার বাংলা হাই স্কুল",
  instituteAddress = "ভালুকা, ময়মনসিংহ",
  instituteNameSize = 18,
  instituteAddressSize = 12,
  examTitle = "বার্ষিক মূল্যায়ন মডেল টেস্ট - ২০২৬",
  showExamTitle = true,
  subject = "পদার্থবিজ্ঞান ১ম পত্র",
  showSubject = true,
  subjectCode = "১০১",
  showSubjectCode = true,
  examTime = "৫০ মিনিট",
  showExamTime = true,
  totalQuestions = 40,
  optionLanguage = "BN",
  themeColor = "#E11D48",
  headerType = "big",
  infoType = "digital",
  showInstructions = true,
  showSignatures = true,
  selectedLayoutCode = "OMR-SIG-V1",
}) {
  return (
    <div className="flex-1 flex justify-center items-start overflow-x-auto min-w-0">
      {templateType === "smart-signature" ? (
        <SmartSignatureOMRTemplate
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
      ) : (
        <StandardClassicOMRTemplate
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
          selectedLayoutCode={selectedLayoutCode}
        />
      )}

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm;
          }

          html,
          body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide all application shells, sidebars, dashboard headers, buttons */
          header,
          nav,
          aside,
          footer,
          .print\\:hidden,
          #sidebar,
          .sidebar,
          button {
            display: none !important;
          }

          /* Make sure the main printable A4 sheet displays at full 210mm width */
          #omr-printable-sheet {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 6mm 8mm !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            box-sizing: border-box !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
            z-index: 99999999 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #omr-printable-sheet * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
