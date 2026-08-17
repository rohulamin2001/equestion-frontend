import {
  ArrowRight,
  Check,
  Copy,
  FileCheck,
  Layers,
  Printer,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function OMRSettingsSidebar({
  templateType,
  setTemplateType,
  instituteName,
  setInstituteName,
  instituteAddress,
  setInstituteAddress,
  instituteNameSize,
  setInstituteNameSize,
  instituteAddressSize,
  setInstituteAddressSize,
  totalQuestions,
  setTotalQuestions,
  optionLanguage,
  setOptionLanguage,
  themeColor,
  setThemeColor,
  selectedLayoutCode,
  onPrint,
}) {
  const [activeTab, setActiveTab] = useState("settings"); // "settings" | "actions"
  const [copied, setCopied] = useState(false);

  // 10 Color Swatches as seen in the screenshot
  const themeSwatches = [
    { name: "বোর্ড রেড/রোজ", hex: "#E11D48" },
    { name: "স্লেট গ্রে", hex: "#64748B" },
    { name: "রয়েল ব্লু", hex: "#3B82F6" },
    { name: "এমেরাল্ড গ্রিন", hex: "#10B981" },
    { name: "পার্পল", hex: "#8B5CF6" },
    { name: "অরেঞ্জ", hex: "#F97316" },
    { name: "স্কাই সায়ান", hex: "#06B6D4" },
    { name: "পিঙ্ক", hex: "#EC4899" },
    { name: "গোল্ডেন ইয়েলো", hex: "#EAB308" },
    { name: "লাইম গ্রিন", hex: "#84CC16" },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedLayoutCode);
    setCopied(true);
    toast.success("OMR লেআউট কোড কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-full lg:w-[380px] lg:shrink-0 flex flex-col gap-4 print:hidden">
      {/* Top Tab Switcher */}
      <div className="flex p-1 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
            activeTab === "settings"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>সেটিংস ও এডিট</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("actions")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
            activeTab === "actions"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট ও অ্যাকশন</span>
        </button>
      </div>

      {/* Main Panel Body */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
        {activeTab === "settings" ? (
          <>
            {/* 1. ব্র্যান্ডিং (Branding) with Font Size Sliders */}
            <div className="space-y-3.5 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800">
              <div className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
                ব্র্যান্ডিং
              </div>

              {/* Title input + Slider */}
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  placeholder="সোনার বাংলা হাই স্কুল"
                  className="w-full px-3 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-sm"
                />
                <div className="flex items-center gap-3 px-1">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Size
                  </span>
                  <input
                    type="range"
                    min="12"
                    max="28"
                    value={instituteNameSize}
                    onChange={(e) =>
                      setInstituteNameSize(Number(e.target.value))
                    }
                    className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 w-4 text-right">
                    {instituteNameSize}
                  </span>
                </div>
              </div>

              {/* Subtitle / Address input + Slider */}
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={instituteAddress}
                  onChange={(e) => setInstituteAddress(e.target.value)}
                  placeholder="বেলাবো, নরসিংদী"
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-sm"
                />
                <div className="flex items-center gap-3 px-1">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Size
                  </span>
                  <input
                    type="range"
                    min="8"
                    max="20"
                    value={instituteAddressSize}
                    onChange={(e) =>
                      setInstituteAddressSize(Number(e.target.value))
                    }
                    className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 w-4 text-right">
                    {instituteAddressSize}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. টেমপ্লেট নির্বাচন করুন (Template Selector with visual cards) */}
            <div className="space-y-2.5">
              <div className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
                টেমপ্লেট নির্বাচন করুন
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Card 1: ইপ্রশ্নব্যাংক সিগনেচার */}
                <button
                  type="button"
                  onClick={() => setTemplateType("smart-signature")}
                  className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer ${
                    templateType === "smart-signature"
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 hover:border-slate-300"
                  }`}
                >
                  {/* Stylized Miniature Thumbnail */}
                  <div className="w-full h-28 bg-white border border-slate-300 rounded-lg p-1.5 flex flex-col justify-between overflow-hidden shadow-inner mb-2 pointer-events-none">
                    <div className="flex justify-between items-center mb-0.5">
                      <div className="w-2 h-2 bg-black" />
                      <div className="flex gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-rose-500" />
                        <div className="w-1 h-1 bg-black" />
                        <div className="w-1 h-1 bg-black" />
                      </div>
                      <div className="w-2 h-2 bg-black" />
                    </div>
                    <div className="w-12 h-1 bg-slate-800 mx-auto rounded" />
                    <div className="grid grid-cols-4 gap-0.5 my-1">
                      <div className="h-6 border border-rose-300 bg-rose-50 rounded" />
                      <div className="h-6 border border-rose-300 bg-rose-50 rounded" />
                      <div className="h-6 border border-rose-300 bg-rose-50 rounded" />
                      <div className="h-6 border border-rose-300 bg-rose-50 rounded" />
                    </div>
                    <div className="grid grid-cols-4 gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-0.5">
                          <div className="h-1 bg-rose-400 rounded" />
                          <div className="h-1 bg-rose-200 rounded" />
                          <div className="h-1 bg-rose-200 rounded" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <div className="w-2 h-2 bg-black" />
                      <div className="w-2 h-2 bg-black" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    ইপ্রশ্নব্যাংক সিগনেচার
                  </span>
                </button>

                {/* Card 2: সাধারণ (Standard / Simple) */}
                <button
                  type="button"
                  onClick={() => setTemplateType("standard-classic")}
                  className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer ${
                    templateType === "standard-classic"
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 hover:border-slate-300"
                  }`}
                >
                  {/* Stylized Miniature Thumbnail */}
                  <div className="w-full h-28 bg-white border border-slate-300 rounded-lg p-1.5 flex flex-col justify-between overflow-hidden shadow-inner mb-2 pointer-events-none">
                    <div className="text-center space-y-1">
                      <div className="w-10 h-1 bg-slate-800 mx-auto rounded" />
                      <div className="w-14 h-0.5 bg-slate-400 mx-auto rounded" />
                      <div className="w-full space-y-0.5 pt-1">
                        <div className="w-full h-0.5 bg-slate-300" />
                        <div className="w-full h-0.5 bg-slate-300" />
                      </div>
                    </div>
                    {/* Bubble Box */}
                    <div className="border border-black rounded p-1 space-y-1">
                      <div className="flex justify-between">
                        <div className="w-1.5 h-1.5 bg-black" />
                        <div className="w-1.5 h-1.5 bg-black" />
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="space-y-0.5">
                          <div className="h-0.5 bg-slate-400" />
                          <div className="h-0.5 bg-slate-400" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="h-0.5 bg-slate-400" />
                          <div className="h-0.5 bg-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    সাধারণ
                  </span>
                </button>
              </div>
            </div>

            {/* 3. সিগনেচার কাস্টমাইজ অপশন্স (Theme Color Palette Swatches) */}
            {templateType === "smart-signature" && (
              <div className="space-y-3 p-3.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/70 dark:border-slate-800 animate-in fade-in-50 duration-300">
                <div className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
                  সিগনেচার কাস্টমাইজ অপশন্স
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    থিম নির্বাচন করুন
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {themeSwatches.map((swatch) => (
                      <button
                        key={swatch.hex}
                        type="button"
                        onClick={() => setThemeColor(swatch.hex)}
                        title={swatch.name}
                        className={`h-9 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-sm relative ${
                          themeColor.toLowerCase() === swatch.hex.toLowerCase()
                            ? "ring-2 ring-offset-2 ring-indigo-600 scale-105"
                            : "hover:scale-105 opacity-90 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {themeColor.toLowerCase() ===
                          swatch.hex.toLowerCase() && (
                          <Check className="w-4 h-4 text-white drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. প্রশ্ন সংখ্যা ও বাবল অপশনস */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>প্রশ্নের সংখ্যা</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[20, 40, 60, 80, 100].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTotalQuestions(count)}
                    className={`py-1.5 px-1 rounded-xl border text-center text-xs font-black transition-all cursor-pointer ${
                      totalQuestions === count
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {count}টি
                  </button>
                ))}
              </div>

              {/* Option Language */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  বাবল অপশন ভাষা
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOptionLanguage("BN")}
                    className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      optionLanguage === "BN"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>ক, খ, গ, ঘ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptionLanguage("EN")}
                    className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      optionLanguage === "EN"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>A, B, C, D</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Tab 2: প্রিন্ট ও অ্যাকশন */
          <div className="space-y-5">
            {/* OMR Code Card */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
                  ইউনিক OMR কোড
                </span>
                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded-full">
                  {templateType === "smart-signature" ? "Signature" : "Classic"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60">
                <span className="font-mono text-sm font-black text-indigo-700 dark:text-indigo-300">
                  {selectedLayoutCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>কপি কোড</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                💡 এই কোডটি দিয়ে পরবর্তী ধাপে ওএমআর টোকেন ও উত্তরমালা তৈরি
                করবেন।
              </p>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={onPrint}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>A4 ওএমআর শিট প্রিন্ট করুন</span>
            </button>

            {/* Next Step Link */}
            <Link
              to="/dashboard/omr/tokens"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 transition text-center"
            >
              <span>পরবর্তী ধাপ: ওএমআর টোকেন তৈরি</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Guidelines */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/70 text-xs space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>প্রিন্ট করার নিয়মাবলী</span>
              </div>
              <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li>
                  Paper Size: <b>A4 (210 × 297 mm)</b> নির্বাচন করুন।
                </li>
                <li>
                  Margins: <b>None</b> অথবা <b>Default</b> রাখুন।
                </li>
                <li>
                  Scale: <b>100% (Actual Size)</b> রাখুন।
                </li>
                <li>৪ কোণার কালো মার্কারগুলো যেন স্পষ্ট প্রিন্ট হয়।</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Quick Print Button on Mobile */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white font-bold text-xs rounded-full shadow-2xl hover:bg-indigo-700 transition"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট (A4)</span>
        </button>
      </div>
    </aside>
  );
}
