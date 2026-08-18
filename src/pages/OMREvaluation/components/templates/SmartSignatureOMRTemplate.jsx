import { QRCodeSVG } from "qrcode.react";

export default function SmartSignatureOMRTemplate({
  instituteName = "সোনার বাংলা হাই স্কুল",
  instituteAddress = "বেলাবো, নরসিংদী",
  instituteNameSize = 18,
  instituteAddressSize = 12,
  examTitle = "বার্ষিক মূল্যায়ন মডেল টেস্ট - ২০২৬",
  subject = "পদার্থবিজ্ঞান ১ম পত্র",
  subjectCode = "১০১",
  examTime = "৫০ মিনিট",
  totalQuestions = 40,
  optionLanguage = "BN", // 'BN' (ক,খ,গ,ঘ) or 'EN' (A,B,C,D)
  themeColor = "#E11D48", // Hex color
  headerType = "big", // "small" | "big"
  infoType = "digital", // "digital" | "manual"
  showInstructions = true,
  showSignatures = true,
  selectedLayoutCode = "OMR-SIG-V1",
}) {
  const optionsLabels =
    optionLanguage === "BN" ? ["ক", "খ", "গ", "ঘ"] : ["A", "B", "C", "D"];
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const classesList = ["৬", "৭", "৮", "৯", "১০", "১১", "১২"];
  const setCodes = ["ক", "খ", "গ", "ঘ", "ঙ", "চ"];
  const smallSetCodes = ["ক", "খ", "গ", "ঘ"];

  // Dynamic row and bubble dimensions to perfectly fit on A4 single page (up to 100 questions)
  const getLayoutConfig = () => {
    const isSmallHeader = headerType === "small";
    const isManualBig = headerType === "big" && infoType === "manual";

    if (totalQuestions > 80) {
      return {
        topRowHeight: isSmallHeader ? "h-[20px]" : "h-[21px]",
        topBubbleSize: "w-[18px] h-[18px]",
        mcqRowHeight: isSmallHeader
          ? "h-[27px]"
          : isManualBig
            ? "h-[26px]"
            : "h-[24px]",
        mcqBubbleSize: "w-[18px] h-[18px]",
        sheetPadding: "p-4 sm:p-5",
        titleMargin: "my-2",
        sigHeight: "h-[64px]",
      };
    }
    if (totalQuestions > 60) {
      return {
        topRowHeight: "h-[22px]",
        topBubbleSize: "w-[19px] h-[19px]",
        mcqRowHeight: isSmallHeader
          ? "h-[28px]"
          : isManualBig
            ? "h-[27px]"
            : "h-[26px]",
        mcqBubbleSize: "w-[19px] h-[19px]",
        sheetPadding: "p-5 sm:p-6",
        titleMargin: "my-2.5",
        sigHeight: "h-[70px]",
      };
    }
    if (totalQuestions > 40) {
      return {
        topRowHeight: "h-6",
        topBubbleSize: "w-[19px] h-[19px]",
        mcqRowHeight: isSmallHeader ? "h-[30px]" : "h-[28px]",
        mcqBubbleSize: "w-[20px] h-[20px]",
        sheetPadding: "p-6",
        titleMargin: "my-3",
        sigHeight: "h-[76px]",
      };
    }
    return {
      topRowHeight: "h-6",
      topBubbleSize: "w-[20px] h-[20px]",
      mcqRowHeight: isSmallHeader ? "h-[32px]" : "h-[30px]",
      mcqBubbleSize: "w-[21px] h-[21px]",
      sheetPadding: "p-6 sm:p-7",
      titleMargin: "my-3.5",
      sigHeight: "h-[80px]",
    };
  };

  const layout = getLayoutConfig();

  // Helper to chunk questions into 4 columns
  const getColumns = () => {
    const cols = [];
    const perCol = Math.ceil(totalQuestions / 4);
    for (let c = 0; c < 4; c++) {
      const colQuestions = [];
      for (let r = 1; r <= perCol; r++) {
        const qNum = c * perCol + r;
        if (qNum <= totalQuestions) {
          colQuestions.push(qNum);
        }
      }
      if (colQuestions.length > 0) {
        cols.push(colQuestions);
      }
    }
    return cols;
  };

  const questionColumns = getColumns();

  // Convert number to Bangla numeral
  const toBanglaNum = (num) => {
    return num
      .toString()
      .split("")
      .map((d) => banglaDigits[parseInt(d, 10)] || d)
      .join("");
  };

  return (
    <div
      id="omr-printable-sheet"
      className={`relative bg-white text-black w-[210mm] min-h-[297mm] max-h-[297mm] ${layout.sheetPadding} print:w-full print:m-0 border border-slate-300 print:border-none select-none font-solaiman rounded-none flex flex-col justify-between overflow-hidden`}
      style={{
        boxSizing: "border-box",
        fontFamily:
          '"SolaimanLipi", "Kalpurush", "Noto Sans Bengali", sans-serif',
        "--theme-color": themeColor,
      }}
    >
      {/* 4 SOLID BLACK CORNER FIDUCIAL MARKERS FOR OPENCV PERSPECTIVE WARP */}
      <div className="absolute top-3 left-3 w-5 h-5 bg-black" />
      <div className="absolute top-3 right-3 w-5 h-5 bg-black" />
      <div className="absolute bottom-3 left-3 w-5 h-5 bg-black" />
      <div className="absolute bottom-3 right-3 w-5 h-5 bg-black" />

      <div>
        {/* ========================================================================= */}
        {/* HEADER VARIANT 1: SMALL HEADER */}
        {/* ========================================================================= */}
        {headerType === "small" && (
          <div className="space-y-1.5">
            {/* Institute Name */}
            <div className="text-center">
              <h1
                className="font-black text-black tracking-tight"
                style={{ fontSize: `${instituteNameSize}px`, lineHeight: 1.2 }}
              >
                {instituteName || "প্রতিষ্ঠানের নাম"}
              </h1>
            </div>

            {/* Main Small Header Box */}
            <div
              className="border border-b-2"
              style={{ borderColor: themeColor }}
            >
              <div
                className="flex divide-x"
                style={{ borderColor: themeColor }}
              >
                {/* Left Side: Exam Type Checkboxes */}
                <div className="w-[45%] p-2.5 flex flex-col justify-center gap-2">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-[12px] font-bold text-black">
                    <label className="flex items-center gap-1.5 cursor-default">
                      <span
                        className="w-3.5 h-3.5 border-2 inline-block rounded-xs"
                        style={{ borderColor: themeColor }}
                      />
                      <span>অর্ধ-বার্ষিক পরীক্ষা</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-default">
                      <span
                        className="w-3.5 h-3.5 border-2 inline-block rounded-xs"
                        style={{ borderColor: themeColor }}
                      />
                      <span>মডেল টেস্ট পরীক্ষা</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-default">
                      <span
                        className="w-3.5 h-3.5 border-2 inline-block rounded-xs"
                        style={{ borderColor: themeColor }}
                      />
                      <span>বার্ষিক পরীক্ষা</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-default">
                      <span
                        className="w-3.5 h-3.5 border-2 inline-block rounded-xs"
                        style={{ borderColor: themeColor }}
                      />
                      <span>................... পরীক্ষা</span>
                    </label>
                  </div>
                </div>

                {/* Right Side: Rules + Scannable QR Code + Set Code Selection */}
                <div className="w-[55%] flex flex-col justify-between">
                  <div
                    className="flex divide-x"
                    style={{ borderColor: themeColor }}
                  >
                    {/* Rules Box with Vertical Badge */}
                    <div className="flex-1 flex">
                      <div
                        className="text-white font-bold flex items-center justify-center px-1 text-[11px] select-none shrink-0"
                        style={{
                          backgroundColor: themeColor,
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }}
                      >
                        নিয়মাবলী
                      </div>
                      <div className="p-1.5 text-[8.5px] leading-[12px] text-black space-y-0.5 font-medium flex-1">
                        <p>
                          ১। বৃত্তাকার ঘরগুলো এমন ভাবে ভরাট করতে হবে যাতে ভেতরের
                          লেখাটি দেখা না যায়।
                        </p>
                        <p>২। উত্তরপত্রে কোন অবাঞ্ছিত দাগ দেয়া যাবেনা।</p>
                        <p>৩। উত্তরপত্র কোন ভাবেই ভাজ করা যাবেনা।</p>
                        <p>৪। সেট কোড না ভরাট করলে উত্তরপত্র বাতিল হবে।</p>
                      </div>
                    </div>

                    {/* QR Code Container - Live Scannable */}
                    <div className="p-1 flex items-center justify-center shrink-0">
                      <div
                        className="border p-0.5 bg-white shadow-xs"
                        style={{ borderColor: themeColor }}
                        title="স্মার্ট প্রশ্নব্যাংক - https://smartproshnobank.com"
                      >
                        <QRCodeSVG
                          value="https://smartproshnobank.com"
                          size={56}
                          level="M"
                          bgColor="#ffffff"
                          fgColor="#000000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Question Set Code Bar */}
                  <div
                    className="border-t flex items-center justify-between px-3 py-1 bg-white"
                    style={{ borderColor: themeColor }}
                  >
                    <span className="text-[13px] font-bold text-black">
                      প্রশ্নের সেট কোড
                    </span>
                    <div className="flex items-center gap-3">
                      {smallSetCodes.map((st) => (
                        <div
                          key={st}
                          className="w-[20px] h-[20px] rounded-full border text-[12px] font-normal flex items-center justify-center text-black shrink-0"
                          style={{
                            borderColor: themeColor,
                            backgroundColor: `${themeColor}18`,
                          }}
                        >
                          {st}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Info Dotted Lines */}
            <div className="pt-1 px-1 text-[13px] font-bold text-black space-y-1.5">
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 flex items-baseline">
                  <span className="shrink-0 mr-1.5">নাম:</span>
                  <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                </div>
                <div className="flex-1 flex items-baseline">
                  <span className="shrink-0 mr-1.5">রোল:</span>
                  <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                </div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 flex items-baseline">
                  <span className="shrink-0 mr-1.5">শ্রেণি:</span>
                  <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                </div>
                <div className="flex-1 flex items-baseline">
                  <span className="shrink-0 mr-1.5">বিষয়:</span>
                  <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                </div>
                <div className="flex-1 flex items-baseline">
                  <span className="shrink-0 mr-1.5">বিভাগ:</span>
                  <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* HEADER VARIANT 2: BIG HEADER + DIGITAL (STANDARD BUBBLE GRID) */}
        {/* ========================================================================= */}
        {headerType === "big" && infoType === "digital" && (
          <div>
            {/* School Branding Header */}
            <div className="text-center mb-1.5 pb-0.5">
              <h1
                className="font-black text-black tracking-tight"
                style={{ fontSize: `${instituteNameSize}px`, lineHeight: 1.2 }}
              >
                {instituteName || "প্রতিষ্ঠানের নাম"}
              </h1>
              <p
                className="font-semibold text-slate-800 mt-0.5"
                style={{
                  fontSize: `${instituteAddressSize}px`,
                  lineHeight: 1.3,
                }}
              >
                {instituteAddress || "ঠিকানা / এলাকা"}
              </p>
            </div>

            {/* Top Info Grid (শ্রেণি | রোল নম্বর | বিষয় কোড | সেট কোড | নিয়মাবলী ও স্বাক্ষর) */}
            <div className="flex gap-2 items-start justify-between mt-1">
              {/* 1. শ্রেণি (Class) */}
              <div
                className="border shrink-0 w-[60px]"
                style={{ borderColor: themeColor }}
              >
                <div
                  className="text-white text-center font-bold py-0.5 text-[14px]"
                  style={{ backgroundColor: themeColor }}
                >
                  শ্রেণি
                </div>
                <div
                  className="grid grid-cols-2 divide-x border-b"
                  style={{ borderColor: themeColor }}
                >
                  <div
                    className={`${layout.topRowHeight} flex items-center justify-center font-bold text-[13px]`}
                  />
                  <div
                    className={`${layout.topRowHeight} flex items-center justify-center font-bold text-[13px]`}
                  />
                </div>
                <div className="divide-y" style={{ borderColor: themeColor }}>
                  {classesList.map((cls) => (
                    <div
                      key={cls}
                      className={`flex items-center justify-center ${layout.topRowHeight}`}
                    >
                      <div
                        className={`${layout.topBubbleSize} rounded-full border text-[12px] leading-[16px] font-normal flex items-center justify-center text-black shrink-0`}
                        style={{
                          borderColor: themeColor,
                          backgroundColor: `${themeColor}18`,
                        }}
                      >
                        {cls}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. রোল নম্বর (Roll Number - 6 Digits) */}
              <div
                className="border shrink-0 w-[162px]"
                style={{ borderColor: themeColor }}
              >
                <div
                  className="text-white text-center font-bold py-0.5 text-[14px]"
                  style={{ backgroundColor: themeColor }}
                >
                  রোল নম্বর
                </div>
                <div
                  className="grid grid-cols-6 divide-x border-b"
                  style={{ borderColor: themeColor }}
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`${layout.topRowHeight} flex items-center justify-center font-mono font-bold text-xs`}
                    />
                  ))}
                </div>
                <div className="divide-y" style={{ borderColor: themeColor }}>
                  {banglaDigits.map((digit) => (
                    <div
                      key={digit}
                      className={`grid grid-cols-6 divide-x items-center ${layout.topRowHeight}`}
                      style={{ borderColor: themeColor }}
                    >
                      {[...Array(6)].map((_, col) => (
                        <div
                          key={col}
                          className="flex items-center justify-center h-full px-0.5"
                        >
                          <div
                            className={`${layout.topBubbleSize} rounded-full border text-[12px] leading-[16px] font-normal flex items-center justify-center text-black shrink-0`}
                            style={{
                              borderColor: themeColor,
                              backgroundColor: `${themeColor}18`,
                            }}
                          >
                            {digit}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. বিষয় কোড (Subject Code - 3 Digits) */}
              <div
                className="border shrink-0 w-[81px]"
                style={{ borderColor: themeColor }}
              >
                <div
                  className="text-white text-center font-bold py-0.5 text-[14px]"
                  style={{ backgroundColor: themeColor }}
                >
                  বিষয় কোড
                </div>
                <div
                  className="grid grid-cols-3 divide-x border-b"
                  style={{ borderColor: themeColor }}
                >
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`${layout.topRowHeight} flex items-center justify-center font-mono font-bold text-xs`}
                    />
                  ))}
                </div>
                <div className="divide-y" style={{ borderColor: themeColor }}>
                  {banglaDigits.map((digit) => (
                    <div
                      key={digit}
                      className={`grid grid-cols-3 divide-x items-center ${layout.topRowHeight}`}
                      style={{ borderColor: themeColor }}
                    >
                      {[...Array(3)].map((_, col) => (
                        <div
                          key={col}
                          className="flex items-center justify-center h-full px-0.5"
                        >
                          <div
                            className={`${layout.topBubbleSize} rounded-full border text-[12px] leading-[16px] font-normal flex items-center justify-center text-black shrink-0`}
                            style={{
                              borderColor: themeColor,
                              backgroundColor: `${themeColor}18`,
                            }}
                          >
                            {digit}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. সেট কোড (Set Code) */}
              <div
                className="border shrink-0 w-[58px]"
                style={{ borderColor: themeColor }}
              >
                <div
                  className="text-white text-center font-bold py-0.5 text-[14px]"
                  style={{ backgroundColor: themeColor }}
                >
                  সেট কোড
                </div>
                <div
                  className={`border-b ${layout.topRowHeight} flex items-center justify-center font-bold text-[13px]`}
                  style={{ borderColor: themeColor }}
                />
                <div className="divide-y" style={{ borderColor: themeColor }}>
                  {setCodes.map((st) => (
                    <div
                      key={st}
                      className={`flex items-center justify-center ${layout.topRowHeight}`}
                    >
                      <div
                        className={`${layout.topBubbleSize} rounded-full border text-[12px] leading-[16px] font-normal flex items-center justify-center text-black shrink-0`}
                        style={{
                          borderColor: themeColor,
                          backgroundColor: `${themeColor}18`,
                        }}
                      >
                        {st}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. নিয়মাবলী ও কক্ষ পরিদর্শকের স্বাক্ষর */}
              <div className="flex-1 flex flex-col justify-between self-stretch min-w-[190px]">
                {/* Rules Box */}
                <div
                  className="border leading-tight"
                  style={{ borderColor: themeColor }}
                >
                  <div
                    className="text-white text-center font-bold py-0.5 text-[14px]"
                    style={{ backgroundColor: themeColor }}
                  >
                    নিয়মাবলী
                  </div>
                  <div className="p-1.5 space-y-0.5 text-black text-[8.5px] leading-[12.5px]">
                    <div>
                      <p className="font-semibold">
                        ১। বৃত্তাকার ঘরগুলো এমনভাবে ভরাট করতে হবে যাতে ভিতরের
                        লেখাটি দেখা না যায়।
                      </p>
                      <div className="flex items-center gap-2.5 pl-2 my-0.5 text-[8px]">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-800">
                          <span>* সঠিক পদ্ধতি:</span>
                          <span className="text-[10px] text-black">⬤</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-rose-700 font-medium">
                          <span>* ভুল পদ্ধতি:</span>
                          <span className="text-[8.5px] font-mono tracking-tight">
                            🗹, ⮽, ◐, ⊙
                          </span>
                        </span>
                      </div>
                    </div>
                    <p>
                      ২। বৃত্তাকার ঘরগুলো অবশ্যই <b>কালো কালির বলপয়েন্ট কলম</b>{" "}
                      দিয়ে ভরাট করতে হবে।
                    </p>
                    <p>
                      ৩। রোল নম্বর, রেজিস্ট্রেশন নম্বর ও প্রশ্নপত্রের সেট কোড
                      সঠিকভাবে লিখে বৃত্ত ভরাট করতে হবে; অন্যথায় উত্তরপত্র বাতিল
                      বলে গণ্য হবে।
                    </p>
                    <p>
                      ৪। উত্তরপত্রে কোনো প্রকার অবাঞ্ছিত দাগ দেওয়া এবং উত্তরপত্র
                      ভাঁজ করা যাবে না।
                    </p>
                    <p>
                      ৫। পরিষ্কার-পরিচ্ছন্ন ও ভাঁজবিহীন উত্তরপত্র মেশিনে
                      মূল্যায়নের জন্য অপরিহার্য।
                    </p>
                  </div>
                </div>

                {/* Signature Box */}
                <div
                  className="border p-1.5 text-center flex flex-col justify-end flex-1 min-h-[52px] mt-1"
                  style={{ borderColor: themeColor }}
                >
                  <span className="text-[13px] font-bold text-black border-t border-dashed border-slate-400 pt-1 leading-snug">
                    কক্ষ পরিদর্শকের স্বাক্ষর ও তারিখ
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* HEADER VARIANT 3: BIG HEADER + MANUAL (WRITTEN FORM + QR + SIGNATURE) */}
        {/* ========================================================================= */}
        {headerType === "big" && infoType === "manual" && (
          <div>
            {/* School Branding Header */}
            <div className="text-center mb-1.5 pb-0.5">
              <h1
                className="font-black text-black tracking-tight"
                style={{ fontSize: `${instituteNameSize}px`, lineHeight: 1.2 }}
              >
                {instituteName || "প্রতিষ্ঠানের নাম"}
              </h1>
              <p
                className="font-semibold text-slate-800 mt-0.5"
                style={{
                  fontSize: `${instituteAddressSize}px`,
                  lineHeight: 1.3,
                }}
              >
                {instituteAddress || "ঠিকানা / এলাকা"}
              </p>
            </div>

            {/* Divided 2-Box Container (Left: পরীক্ষার্থীর তথ্য, Right: নিয়মাবলী + QR + স্বাক্ষর) */}
            <div className="flex gap-2 items-stretch mt-1">
              {/* Left Box: পরীক্ষার্থীর তথ্য */}
              <div
                className="w-[62%] border p-3 flex flex-col justify-between"
                style={{ borderColor: themeColor }}
              >
                <div className="text-center mb-2">
                  <span
                    className="inline-block font-bold text-[15px] text-black border-b-2 pb-0.5 px-4"
                    style={{ borderColor: themeColor }}
                  >
                    পরীক্ষার্থীর তথ্য
                  </span>
                </div>

                <div className="space-y-3.5 text-[13px] font-bold text-black">
                  {/* Row 1: নাম */}
                  <div className="flex items-baseline">
                    <span className="shrink-0 mr-1.5">নাম:</span>
                    <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                  </div>

                  {/* Row 2: শ্রেণি, রোল, বিভাগ */}
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex-1 flex items-baseline">
                      <span className="shrink-0 mr-1.5">শ্রেণি:</span>
                      <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                    </div>
                    <div className="flex-1 flex items-baseline">
                      <span className="shrink-0 mr-1.5">রোল:</span>
                      <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                    </div>
                    <div className="flex-1 flex items-baseline">
                      <span className="shrink-0 mr-1.5">বিভাগ:</span>
                      <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                    </div>
                  </div>

                  {/* Row 3: বিষয়, পত্র, বিষয় কোড */}
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex-1 flex items-baseline">
                      <span className="shrink-0 mr-1.5">বিষয়:</span>
                      <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                    </div>
                    <div className="flex-1 flex items-baseline">
                      <span className="shrink-0 mr-1.5">পত্র:</span>
                      <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                    </div>
                    <div className="flex-1 flex items-baseline">
                      <span className="shrink-0 mr-1.5">বিষয় কোড:</span>
                      <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                    </div>
                  </div>

                  {/* Row 4: তারিখ */}
                  <div className="flex items-baseline">
                    <span className="shrink-0 mr-1.5">তারিখ:</span>
                    <span className="flex-1 border-b-2 border-dotted border-rose-500/80 -translate-y-0.5" />
                  </div>
                </div>
              </div>

              {/* Right Box: Rules + Scannable QR Code + Signature */}
              <div className="w-[38%] flex flex-col justify-between gap-1.5">
                {/* Rules Box */}
                <div
                  className="border leading-tight"
                  style={{ borderColor: themeColor }}
                >
                  <div
                    className="text-white text-center font-bold py-0.5 text-[13px]"
                    style={{ backgroundColor: themeColor }}
                  >
                    নিয়মাবলী
                  </div>
                  <div className="p-1.5 text-[8px] leading-[11.5px] text-black space-y-0.5 font-medium">
                    <p>
                      ১। বৃত্তাকার ঘরগুলো এমন ভাবে ভরাট করতে হবে যাতে ভেতরের
                      লেখাটি দেখা না যায়।
                    </p>
                    <p>২। উত্তরপত্রে অবাঞ্ছিত দাগ দেয়া যাবেনা।</p>
                    <p>৩। উত্তরপত্র ভাজ করা যাবেনা।</p>
                    <p>৪। সেট কোডবিহীন উত্তরপত্র বাতিল হবে।</p>
                  </div>
                </div>

                {/* QR Code - Live Scannable */}
                <div className="flex items-center justify-center py-0.5">
                  <div
                    className="border p-1 bg-white inline-block shadow-xs"
                    style={{ borderColor: themeColor }}
                    title="স্মার্ট প্রশ্নব্যাংক - https://smartproshnobank.com"
                  >
                    <QRCodeSVG
                      value="https://smartproshnobank.com"
                      size={54}
                      level="M"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>

                {/* Signature Box */}
                <div
                  className="border p-1.5 text-center flex flex-col justify-end min-h-[46px]"
                  style={{ borderColor: themeColor }}
                >
                  <span className="text-[12px] font-bold text-black border-t border-dashed border-slate-400 pt-1 leading-snug">
                    কক্ষ পরিদর্শকের স্বাক্ষর তারিখসহ
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Divider Title */}
        <div className={`text-center ${layout.titleMargin}`}>
          <span className="inline-block font-bold text-[16px] px-6 py-0.5 tracking-wide">
            বহুনির্বাচনি অভীক্ষার উত্তরপত্র
          </span>
        </div>

        {/* Main MCQ Bubble Columns Table (4 Columns, Full Grid Lines) */}
        <div className="grid grid-cols-4 gap-2">
          {questionColumns.map((colQuestions, colIdx) => (
            <div
              key={colIdx}
              className="border"
              style={{ borderColor: themeColor }}
            >
              {/* Header: প্রশ্ন | উত্তর */}
              <div
                className="grid grid-cols-12 text-[12px] leading-[16px] font-bold text-center border-b py-0.5"
                style={{
                  borderColor: themeColor,
                  backgroundColor: `${themeColor}15`,
                  color: "black",
                }}
              >
                <div
                  className="col-span-4 border-r"
                  style={{ borderColor: themeColor }}
                >
                  প্রশ্ন
                </div>
                <div className="col-span-8">উত্তর</div>
              </div>

              {/* Question Rows with full horizontal borders */}
              <div className="divide-y" style={{ borderColor: themeColor }}>
                {colQuestions.map((qNum) => (
                  <div
                    key={qNum}
                    className={`grid grid-cols-12 items-center ${layout.mcqRowHeight}`}
                  >
                    {/* Question Number (12px Font) */}
                    <div
                      className="col-span-4 h-full flex items-center justify-center font-normal text-[12px] leading-[16px] text-black border-r"
                      style={{ borderColor: themeColor }}
                    >
                      {toBanglaNum(qNum)}
                    </div>
                    {/* Options (ক, খ, গ, ঘ) - 12px Font */}
                    <div className="col-span-8 h-full flex items-center justify-around px-1">
                      {optionsLabels.map((lbl, optIdx) => (
                        <div
                          key={optIdx}
                          className={`${layout.mcqBubbleSize} rounded-full border text-[12px] leading-[16px] font-normal flex items-center justify-center text-black shrink-0`}
                          style={{
                            borderColor: themeColor,
                            backgroundColor: `${themeColor}18`,
                          }}
                        >
                          {lbl}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
