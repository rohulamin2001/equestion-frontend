export default function StandardClassicOMRTemplate({
  instituteName = "সোনার বাংলা হাই স্কুল",
  instituteAddress = "ভালুকা, ময়মনসিংহ",
  instituteNameSize = 18,
  instituteAddressSize = 12,
  headerBorderWidth = 100,
  headerBorderStyle = "dashed",
  examTitle = "বার্ষিক মূল্যায়ন",
  showExamTitle = true,
  subject = "বাংলা ১ম পত্র",
  showSubject = true,
  subjectCode = "১০১",
  showSubjectCode = true,
  examTime = "৫০ মিনিট",
  showExamTime = true,
  totalQuestions = 20,
  optionLanguage = "BN", // 'BN' (ক,খ,গ,ঘ) or 'EN' (A,B,C,D)
  selectedLayoutCode = "OMR-STD-V1",
}) {
  const optionsLabels =
    optionLanguage === "BN" ? ["ক", "খ", "গ", "ঘ"] : ["A", "B", "C", "D"];
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  // Convert number to Bangla numeral
  const toBanglaNum = (num) => {
    return num
      .toString()
      .split("")
      .map((d) => banglaDigits[parseInt(d, 10)] || d)
      .join("");
  };

  const hasMetadata =
    (showExamTitle && examTitle) ||
    (showSubject && subject) ||
    (showSubjectCode && subjectCode) ||
    (showExamTime && examTime);

  // Determine number of columns (2 or 4) based on question count
  const numColumns = totalQuestions > 25 ? 4 : 2;
  const perCol = Math.ceil(totalQuestions / numColumns);

  const getColumns = () => {
    const cols = [];
    for (let c = 0; c < numColumns; c++) {
      const start = c * perCol + 1;
      const end = Math.min((c + 1) * perCol, totalQuestions);
      if (start <= totalQuestions) {
        const colQ = [];
        for (let q = start; q <= end; q++) colQ.push(q);
        cols.push(colQ);
      }
    }
    return cols;
  };

  const questionColumns = getColumns();

  return (
    <div
      id="omr-printable-sheet"
      className="relative bg-white text-black w-[210mm] min-h-[297mm] p-8 sm:p-10 print:w-full print:m-0 border border-slate-300 print:border-none select-none font-solaiman rounded-none flex flex-col justify-between"
      style={{
        boxSizing: "border-box",
        fontFamily:
          '"SolaimanLipi", "Kalpurush", "Noto Sans Bengali", sans-serif',
      }}
    >
      {/* 4 SOLID BLACK CORNER FIDUCIAL MARKERS FOR COMPUTER VISION (STANDARD) */}
      <div className="absolute top-3 left-3 w-5 h-5 bg-black" />
      <div className="absolute top-3 right-3 w-5 h-5 bg-black" />
      <div className="absolute bottom-3 left-3 w-5 h-5 bg-black" />
      <div className="absolute bottom-3 right-3 w-5 h-5 bg-black" />

      <div>
        {/* Header Branding */}
        <div className="text-center pb-2">
          <h1
            className="font-black text-black tracking-tight"
            style={{ fontSize: `${instituteNameSize}px`, lineHeight: 1.2 }}
          >
            {instituteName || "প্রতিষ্ঠানের নাম"}
          </h1>
          {instituteAddress && (
            <p
              className="font-semibold text-slate-800 mt-0.5"
              style={{ fontSize: `${instituteAddressSize}px`, lineHeight: 1.3 }}
            >
              {instituteAddress}
            </p>
          )}

          {hasMetadata && (
            <div className="w-full my-2">
              {/* Full-width metadata text */}
              <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-0.5 text-[12px] font-bold text-black pb-1.5">
                {showExamTitle && examTitle && (
                  <span className="font-extrabold text-black">{examTitle}</span>
                )}
                {showSubject && subject && (
                  <span>
                    <span className="text-slate-700 font-semibold">বিষয়: </span>
                    {subject}
                  </span>
                )}
                {showSubjectCode && subjectCode && (
                  <span>
                    <span className="text-slate-700 font-semibold">
                      বিষয় কোড:{" "}
                    </span>
                    {subjectCode}
                  </span>
                )}
                {showExamTime && examTime && (
                  <span>
                    <span className="text-slate-700 font-semibold">সময়: </span>
                    {examTime}
                  </span>
                )}
              </div>

              {/* Dedicated Individual Border Line */}
              {headerBorderStyle !== "none" && (
                <div className="w-full flex justify-center">
                  <div
                    className="border-slate-400"
                    style={{
                      width: `${headerBorderWidth}%`,
                      borderBottomStyle: headerBorderStyle,
                      borderBottomWidth:
                        headerBorderStyle === "double" ? "3px" : "1.5px",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {headerBorderStyle !== "none" && (
            <div
              className="h-0.5 bg-black mx-auto mt-2 mb-4"
              style={{
                width: `${Math.min(192, Math.round(192 * (headerBorderWidth / 100)))}px`,
              }}
            />
          )}
        </div>

        {/* Fill-in Details Lines (নাম, শ্রেণি, সেকশন, বিষয়, পত্র, রোল) */}
        <div className="space-y-2.5 max-w-xl mx-auto text-xs font-bold text-black mb-6">
          <div className="flex items-end gap-2">
            <span className="shrink-0 text-[13px]">নাম:</span>
            <div className="flex-1 border-b border-dashed border-slate-600 mb-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-end gap-2">
              <span className="shrink-0 text-[13px]">শ্রেণি:</span>
              <div className="flex-1 border-b border-dashed border-slate-600 mb-1" />
            </div>
            <div className="flex items-end gap-2">
              <span className="shrink-0 text-[13px]">সেকশন:</span>
              <div className="flex-1 border-b border-dashed border-slate-600 mb-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-end gap-2">
              <span className="shrink-0 text-[13px]">বিষয়:</span>
              <div className="flex-1 border-b border-dashed border-slate-600 mb-1" />
            </div>
            <div className="flex items-end gap-2">
              <span className="shrink-0 text-[13px]">পত্র:</span>
              <div className="flex-1 border-b border-dashed border-slate-600 mb-1" />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <span className="shrink-0 text-[13px]">রোল:</span>
            <div className="flex-1 border-b border-dashed border-slate-600 mb-1" />
          </div>
        </div>

        {/* Main OMR Bubble Box with Top Timing Bar */}
        <div className="border-2 border-black max-w-xl mx-auto overflow-hidden">
          {/* Top Timing Track Bar */}
          <div className="border-b-2 border-black p-2 flex items-center justify-between bg-white">
            <div className="w-5 h-5 bg-black" />
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-black" />
              <div className="w-4 h-4 bg-black" />
            </div>
            <div className="w-4 h-4 bg-black" />
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-black" />
              <div className="w-4 h-4 bg-black" />
            </div>
          </div>

          {/* Bubbles Grid in Columns */}
          <div
            className={`grid p-3 ${
              numColumns === 2
                ? "grid-cols-2 divide-x divide-slate-400"
                : "grid-cols-4 divide-x divide-slate-400"
            }`}
          >
            {questionColumns.map((colQuestions, colIdx) => (
              <div
                key={colIdx}
                className={`space-y-1.5 ${colIdx === 0 ? "pr-3" : "pl-3"}`}
              >
                {colQuestions.map((qNum) => (
                  <div
                    key={qNum}
                    className="flex items-center justify-between py-0.5"
                  >
                    <span className="font-normal text-[12px] leading-[16px] text-black w-6">
                      {toBanglaNum(qNum)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {optionsLabels.map((lbl, optIdx) => (
                        <div
                          key={optIdx}
                          className="w-[22px] h-[22px] rounded-full border-2 border-black text-[12px] font-normal flex items-center justify-center text-black"
                        >
                          {lbl}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Sheet Footer Info Bar with Layout ID */}
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-300 print:border-slate-400 mt-2 px-1">
        <span>স্মার্ট প্রশ্নব্যাংক ক্লাসিক ওএমআর</span>
        <span className="font-bold text-slate-700">
          Layout: {selectedLayoutCode}
        </span>
      </div>
    </div>
  );
}
