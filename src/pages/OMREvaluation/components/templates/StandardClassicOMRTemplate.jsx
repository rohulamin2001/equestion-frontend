export default function StandardClassicOMRTemplate({
  instituteName = "সোনার বাংলা হাই স্কুল",
  instituteAddress = "বেলাবো, নরসিংদী",
  instituteNameSize = 18,
  instituteAddressSize = 12,
  examTitle = "বার্ষিক মূল্যায়ন",
  subject = "বাংলা ১ম পত্র",
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
          <p
            className="font-semibold text-slate-800 mt-0.5"
            style={{ fontSize: `${instituteAddressSize}px`, lineHeight: 1.3 }}
          >
            {instituteAddress || "ঠিকানা / এলাকা"}
          </p>

          <div className="w-48 h-0.5 bg-black mx-auto mt-2 mb-4" />
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
    </div>
  );
}
