import {
  ArrowRight,
  Building2,
  Check,
  Clock,
  Code,
  Copy,
  FileCheck,
  FileText,
  HelpCircle,
  Languages,
  Layers,
  Palette,
  Printer,
  QrCode,
  Settings,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
  examTitle,
  setExamTitle,
  showExamTitle = true,
  setShowExamTitle,
  subject,
  setSubject,
  showSubject = true,
  setShowSubject,
  subjectCode,
  setSubjectCode,
  showSubjectCode = true,
  setShowSubjectCode,
  examTime,
  setExamTime,
  showExamTime = true,
  setShowExamTime,
  showInstructions = true,
  setShowInstructions,
  showSignatures = true,
  setShowSignatures,
  totalQuestions,
  setTotalQuestions,
  optionLanguage,
  setOptionLanguage,
  themeColor,
  setThemeColor,
  headerType = "big",
  setHeaderType,
  infoType = "digital",
  setInfoType,
  selectedLayoutCode,
  onPrint,
}) {
  const [activeTab, setActiveTab] = useState("settings"); // "settings" | "actions"
  const [copied, setCopied] = useState(false);

  // Color Swatches including standard and premium deep tone palettes
  const themeSwatches = [
    { name: "বোর্ড রেড/রোজ", hex: "#E11D48" },
    { name: "রয়েল ব্লু", hex: "#3B82F6" },
    { name: "এমেরাল্ড গ্রিন", hex: "#10B981" },
    { name: "পার্পল", hex: "#8B5CF6" },
    { name: "রয়েল ভায়োলেট", hex: "#4B1D6E" },
    { name: "স্লেট ভায়োলেট", hex: "#4C3A8C" },
    { name: "মিডনাইট ভায়োলেট", hex: "#2D1B4E" },
    { name: "ইন্ডিগো", hex: "#4B0082" },
    { name: "ডিপ টিল", hex: "#0D7377" },
    { name: "ডিপ পার্পল", hex: "#271066" },
    { name: "অরেঞ্জ", hex: "#F97316" },
    { name: "স্কাই সায়ান", hex: "#06B6D4" },
    { name: "স্লেট গ্রে", hex: "#64748B" },
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
    <aside className="w-full lg:w-[380px] lg:shrink-0 print:hidden lg:sticky lg:top-2 lg:h-[calc(100vh-48px)] lg:flex lg:flex-col gap-2.5">
      {/* Top Tab Switcher */}
      <div
        className="flex p-1 rounded-xl shrink-0 gap-1 shadow-xs"
        style={{
          background: "var(--q-tab-switcher-bg)",
          border: "1px solid var(--q-tab-switcher-border)",
        }}
      >
        {[
          { id: "settings", label: "সেটিংস ও এডিট", icon: Settings },
          { id: "actions", label: "প্রিন্ট ও অ্যাকশন", icon: Printer },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer select-none relative"
              style={{
                color: isActive ? "#fff" : "var(--q-tab-inactive-text)",
                background: "transparent",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeOMRSidebarTabIndicator"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "var(--q-header-gradient)",
                    boxShadow: "0 2px 8px rgba(144,14,176,0.25)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Panel Body with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-sidebar-scrollbar pr-1">
        <AnimatePresence mode="wait">
          {activeTab === "settings" ? (
            <motion.div
              key="omr-settings-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="p-5 rounded divide-y divide-[var(--q-card-border)]/70 space-y-5"
              style={{
                background: "var(--q-panel-bg)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid var(--q-panel-border)",
                boxShadow:
                  "0 8px 32px rgba(144,14,176,0.08), 0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* 1. প্রতিষ্ঠান ও ব্র্যান্ডিং */}
              <div className="space-y-3.5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans relative overflow-hidden"
                  style={{
                    background: "var(--q-header-gradient)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "var(--q-section-shadow)",
                    border: "1px solid var(--q-section-border)",
                  }}
                >
                  <Building2 className="size-4 text-white" />
                  <span>প্রতিষ্ঠান ও ব্র্যান্ডিং</span>
                </h3>

                <div
                  className="p-3.5 rounded-xl space-y-3.5"
                  style={{
                    background: "var(--q-card-bg)",
                    border: "1px solid var(--q-card-border-soft)",
                  }}
                >
                  {/* Title input + Slider */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      প্রতিষ্ঠানের নাম
                    </label>
                    <input
                      type="text"
                      value={instituteName}
                      onChange={(e) => setInstituteName(e.target.value)}
                      placeholder="সোনার বাংলা হাই স্কুল"
                      className="w-full px-3 py-2 text-[13px] font-bold border rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring-modern shadow-2xs"
                      style={{ borderColor: "var(--q-card-border)" }}
                    />
                    <div className="flex items-center gap-2 px-1 pt-1">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        ফন্ট সাইজ
                      </span>
                      <input
                        type="range"
                        min="12"
                        max="28"
                        value={instituteNameSize}
                        onChange={(e) =>
                          setInstituteNameSize(Number(e.target.value))
                        }
                        className="flex-1 accent-purple-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                      />
                      <span className="text-[12px] font-mono font-bold text-purple-700 dark:text-purple-300 w-5 text-right">
                        {instituteNameSize}
                      </span>
                    </div>
                  </div>

                  {/* Subtitle / Address input + Slider */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      ঠিকানা বা উপ-শিরোনাম
                    </label>
                    <input
                      type="text"
                      value={instituteAddress}
                      onChange={(e) => setInstituteAddress(e.target.value)}
                      placeholder="ভালুকা, ময়মনসিংহ"
                      className="w-full px-3 py-2 text-[13px] border rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring-modern shadow-2xs"
                      style={{ borderColor: "var(--q-card-border)" }}
                    />
                    <div className="flex items-center gap-2 px-1 pt-1">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        ফন্ট সাইজ
                      </span>
                      <input
                        type="range"
                        min="8"
                        max="20"
                        value={instituteAddressSize}
                        onChange={(e) =>
                          setInstituteAddressSize(Number(e.target.value))
                        }
                        className="flex-1 accent-purple-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                      />
                      <span className="text-[12px] font-mono font-bold text-purple-700 dark:text-purple-300 w-5 text-right">
                        {instituteAddressSize}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. পরীক্ষার তথ্য ও মেটাডাটা (Exam Info & Metadata with Toggle Switches) */}
              <div className="space-y-3.5 pt-5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans relative overflow-hidden"
                  style={{
                    background: "var(--q-header-gradient)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "var(--q-section-shadow)",
                    border: "1px solid var(--q-section-border)",
                  }}
                >
                  <FileText className="size-4 text-white" />
                  <span>পরীক্ষার তথ্য ও মেটাডাটা</span>
                </h3>

                <div
                  className="p-3.5 rounded-xl space-y-3.5"
                  style={{
                    background: "var(--q-card-bg)",
                    border: "1px solid var(--q-card-border-soft)",
                  }}
                >
                  {/* 1. Exam Title Field + Switch */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span>পরীক্ষার নাম / শিরোনাম</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowExamTitle && setShowExamTitle(!showExamTitle)}
                        className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                        style={{
                          background: showExamTitle
                            ? "var(--q-toggle-on)"
                            : "var(--q-toggle-off)",
                        }}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                            showExamTitle ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    {showExamTitle && (
                      <input
                        type="text"
                        value={examTitle}
                        onChange={(e) => setExamTitle && setExamTitle(e.target.value)}
                        placeholder="বার্ষিক মূল্যায়ন মডেল টেস্ট - ২০২৬"
                        className="w-full px-3 py-2 text-[13px] font-medium border rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring-modern shadow-2xs"
                        style={{ borderColor: "var(--q-card-border)" }}
                      />
                    )}
                  </div>

                  {/* 2. Subject Name Field + Switch */}
                  <div className="space-y-1.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                        <span>বিষয়ের নাম</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSubject && setShowSubject(!showSubject)}
                        className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                        style={{
                          background: showSubject
                            ? "var(--q-toggle-on)"
                            : "var(--q-toggle-off)",
                        }}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                            showSubject ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    {showSubject && (
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject && setSubject(e.target.value)}
                        placeholder="পদার্থবিজ্ঞান ১ম পত্র"
                        className="w-full px-3 py-2 text-[13px] font-medium border rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring-modern shadow-2xs"
                        style={{ borderColor: "var(--q-card-border)" }}
                      />
                    )}
                  </div>

                  {/* 3. Subject Code Field + Switch */}
                  <div className="space-y-1.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-purple-600" />
                        <span>বিষয় কোড</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSubjectCode && setShowSubjectCode(!showSubjectCode)}
                        className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                        style={{
                          background: showSubjectCode
                            ? "var(--q-toggle-on)"
                            : "var(--q-toggle-off)",
                        }}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                            showSubjectCode ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    {showSubjectCode && (
                      <input
                        type="text"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode && setSubjectCode(e.target.value)}
                        placeholder="১০১"
                        className="w-full px-3 py-2 text-[13px] font-medium border rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring-modern shadow-2xs"
                        style={{ borderColor: "var(--q-card-border)" }}
                      />
                    )}
                  </div>

                  {/* 4. Exam Time Field + Switch */}
                  <div className="space-y-1.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>পরীক্ষার সময়</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowExamTime && setShowExamTime(!showExamTime)}
                        className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                        style={{
                          background: showExamTime
                            ? "var(--q-toggle-on)"
                            : "var(--q-toggle-off)",
                        }}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                            showExamTime ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    {showExamTime && (
                      <input
                        type="text"
                        value={examTime}
                        onChange={(e) => setExamTime && setExamTime(e.target.value)}
                        placeholder="৫০ মিনিট"
                        className="w-full px-3 py-2 text-[13px] font-medium border rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring-modern shadow-2xs"
                        style={{ borderColor: "var(--q-card-border)" }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 3. টেমপ্লেট নির্বাচন */}
              <div className="space-y-3.5 pt-5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans relative overflow-hidden"
                  style={{
                    background: "var(--q-header-gradient)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "var(--q-section-shadow)",
                    border: "1px solid var(--q-section-border)",
                  }}
                >
                  <Layers className="size-4 text-white" />
                  <span>টেমপ্লেট নির্বাচন</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {/* Card 1: ইপ্রশ্নব্যাংক সিগনেচার */}
                  <button
                    type="button"
                    onClick={() => setTemplateType("smart-signature")}
                    className="p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer relative"
                    style={{
                      borderColor:
                        templateType === "smart-signature"
                          ? "var(--purple-600)"
                          : "var(--q-card-border)",
                      background:
                        templateType === "smart-signature"
                          ? "var(--q-selected-bg)"
                          : "var(--q-card-bg)",
                      boxShadow:
                        templateType === "smart-signature"
                          ? "0 2px 8px rgba(144,14,176,0.15)"
                          : "none",
                    }}
                  >
                    {templateType === "smart-signature" && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    {/* Miniature Thumbnail */}
                    <div className="w-full h-22 bg-white border border-slate-300 rounded-lg p-1.5 flex flex-col justify-between overflow-hidden shadow-inner mb-2 pointer-events-none">
                      <div className="flex justify-between items-center">
                        <div className="w-1.5 h-1.5 bg-black" />
                        <div className="flex gap-0.5">
                          <div className="w-1 h-1 rounded-full bg-rose-500" />
                          <div className="w-1 h-1 bg-black" />
                        </div>
                        <div className="w-1.5 h-1.5 bg-black" />
                      </div>
                      <div className="w-10 h-0.5 bg-slate-800 mx-auto rounded" />
                      <div className="grid grid-cols-4 gap-0.5 my-0.5">
                        <div className="h-4 border border-rose-300 bg-rose-50 rounded" />
                        <div className="h-4 border border-rose-300 bg-rose-50 rounded" />
                        <div className="h-4 border border-rose-300 bg-rose-50 rounded" />
                        <div className="h-4 border border-rose-300 bg-rose-50 rounded" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="w-1.5 h-1.5 bg-black" />
                        <div className="w-1.5 h-1.5 bg-black" />
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">
                      সিগনেচার ওএমআর
                    </span>
                  </button>

                  {/* Card 2: সাধারণ ক্লাসিক */}
                  <button
                    type="button"
                    onClick={() => setTemplateType("standard-classic")}
                    className="p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer relative"
                    style={{
                      borderColor:
                        templateType === "standard-classic"
                          ? "var(--purple-600)"
                          : "var(--q-card-border)",
                      background:
                        templateType === "standard-classic"
                          ? "var(--q-selected-bg)"
                          : "var(--q-card-bg)",
                      boxShadow:
                        templateType === "standard-classic"
                          ? "0 2px 8px rgba(144,14,176,0.15)"
                          : "none",
                    }}
                  >
                    {templateType === "standard-classic" && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    {/* Miniature Thumbnail */}
                    <div className="w-full h-22 bg-white border border-slate-300 rounded-lg p-1.5 flex flex-col justify-between overflow-hidden shadow-inner mb-2 pointer-events-none">
                      <div className="text-center space-y-0.5">
                        <div className="w-8 h-0.5 bg-slate-800 mx-auto rounded" />
                        <div className="w-10 h-0.5 bg-slate-400 mx-auto rounded" />
                      </div>
                      <div className="border border-slate-600 rounded p-1 space-y-0.5">
                        <div className="flex justify-between">
                          <div className="w-1 h-1 bg-black" />
                          <div className="w-1 h-1 bg-black" />
                        </div>
                        <div className="grid grid-cols-2 gap-0.5">
                          <div className="h-0.5 bg-slate-400" />
                          <div className="h-0.5 bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">
                      সাধারণ ক্লাসিক
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. কালার থিম ও হেডার স্টাইল */}
              {templateType === "smart-signature" && (
                <div className="space-y-3.5 pt-5">
                  <h3
                    className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans relative overflow-hidden"
                    style={{
                      background: "var(--q-header-gradient)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      boxShadow: "var(--q-section-shadow)",
                      border: "1px solid var(--q-section-border)",
                    }}
                  >
                    <Palette className="size-4 text-white" />
                    <span>কালার থিম ও হেডার স্টাইল</span>
                  </h3>

                  <div
                    className="p-3.5 rounded-xl space-y-3.5"
                    style={{
                      background: "var(--q-card-bg)",
                      border: "1px solid var(--q-card-border-soft)",
                    }}
                  >
                    {/* Color Swatches */}
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        থিম কালার নির্বাচন
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {themeSwatches.map((swatch) => (
                          <button
                            key={swatch.hex}
                            type="button"
                            onClick={() => setThemeColor(swatch.hex)}
                            title={swatch.name}
                            className={`h-9 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-2xs relative ${
                              themeColor.toLowerCase() ===
                              swatch.hex.toLowerCase()
                                ? "ring-2 ring-offset-2 ring-purple-600 scale-105"
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

                    {/* হেডার নির্বাচন (SMALL vs BIG) */}
                    <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        হেডার সাইজ
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setHeaderType("small")}
                          className={`py-2 px-3 rounded-xl border text-[12px] font-bold transition flex items-center justify-center cursor-pointer shadow-2xs ${
                            headerType === "small"
                              ? "text-white border-transparent shadow-xs"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                          }`}
                          style={
                            headerType === "small"
                              ? { backgroundColor: themeColor }
                              : { borderColor: "var(--q-card-border)" }
                          }
                        >
                          SMALL (ছোট হেডার)
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeaderType("big")}
                          className={`py-2 px-3 rounded-xl border text-[12px] font-bold transition flex items-center justify-center cursor-pointer shadow-2xs ${
                            headerType === "big"
                              ? "text-white border-transparent shadow-xs"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                          }`}
                          style={
                            headerType === "big"
                              ? { backgroundColor: themeColor }
                              : { borderColor: "var(--q-card-border)" }
                          }
                        >
                          BIG (পূর্ণাঙ্গ হেডার)
                        </button>
                      </div>
                    </div>

                    {/* তথ্যের টাইপ (DIGITAL vs MANUAL) */}
                    {headerType === "big" && (
                      <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                        <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                          পরীক্ষা ও শিক্ষার্থীর তথ্যের ধরণ
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setInfoType("digital")}
                            className={`py-2 px-3 rounded-xl border text-[12px] font-bold transition flex items-center justify-center cursor-pointer shadow-2xs ${
                              infoType === "digital"
                                ? "text-white border-transparent shadow-xs"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                            }`}
                            style={
                              infoType === "digital"
                                ? { backgroundColor: themeColor }
                                : { borderColor: "var(--q-card-border)" }
                            }
                          >
                            DIGITAL
                          </button>
                          <button
                            type="button"
                            onClick={() => setInfoType("manual")}
                            className={`py-2 px-3 rounded-xl border text-[12px] font-bold transition flex items-center justify-center cursor-pointer shadow-2xs ${
                              infoType === "manual"
                                ? "text-white border-transparent shadow-xs"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                            }`}
                            style={
                              infoType === "manual"
                                ? { backgroundColor: themeColor }
                                : { borderColor: "var(--q-card-border)" }
                            }
                          >
                            MANUAL
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. প্রশ্ন সংখ্যা ও ভাষা */}
              <div className="space-y-3.5 pt-5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans relative overflow-hidden"
                  style={{
                    background: "var(--q-header-gradient)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "var(--q-section-shadow)",
                    border: "1px solid var(--q-section-border)",
                  }}
                >
                  <HelpCircle className="size-4 text-white" />
                  <span>প্রশ্ন সংখ্যা ও ভাষা</span>
                </h3>

                <div
                  className="p-3.5 rounded-xl space-y-3.5"
                  style={{
                    background: "var(--q-card-bg)",
                    border: "1px solid var(--q-card-border-soft)",
                  }}
                >
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      মোট প্রশ্ন সংখ্যা
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[20, 40, 60, 80, 100].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setTotalQuestions(count)}
                          className={`py-2 px-1 rounded-xl border text-center text-[12px] font-bold transition cursor-pointer shadow-2xs ${
                            totalQuestions === count
                              ? "text-white border-transparent shadow-xs"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                          }`}
                          style={
                            totalQuestions === count
                              ? { background: "var(--q-header-gradient)" }
                              : { borderColor: "var(--q-card-border)" }
                          }
                        >
                          {count}টি
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option Language */}
                  <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                    <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      বাবল অপশন ভাষা
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOptionLanguage("BN")}
                        className={`py-2 px-3 rounded-xl border text-[12px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                          optionLanguage === "BN"
                            ? "text-white border-transparent shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        }`}
                        style={
                          optionLanguage === "BN"
                            ? { background: "var(--q-header-gradient)" }
                            : { borderColor: "var(--q-card-border)" }
                        }
                      >
                        <Languages className="w-3.5 h-3.5" />
                        <span>ক, খ, গ, ঘ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOptionLanguage("EN")}
                        className={`py-2 px-3 rounded-xl border text-[12px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                          optionLanguage === "EN"
                            ? "text-white border-transparent shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        }`}
                        style={
                          optionLanguage === "EN"
                            ? { background: "var(--q-header-gradient)" }
                            : { borderColor: "var(--q-card-border)" }
                        }
                      >
                        <Languages className="w-3.5 h-3.5" />
                        <span>A, B, C, D</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. নিয়মাবলী ও স্বাক্ষর (Rules & Signatures Toggles) */}
              <div className="space-y-3.5 pt-5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans relative overflow-hidden"
                  style={{
                    background: "var(--q-header-gradient)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "var(--q-section-shadow)",
                    border: "1px solid var(--q-section-border)",
                  }}
                >
                  <FileCheck className="size-4 text-white" />
                  <span>নিয়মাবলী ও স্বাক্ষর</span>
                </h3>

                <div
                  className="p-3.5 rounded-xl space-y-3.5"
                  style={{
                    background: "var(--q-card-bg)",
                    border: "1px solid var(--q-card-border-soft)",
                  }}
                >
                  {/* Toggle 1: নিয়মাবলী প্রদর্শন */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                        নিয়মাবলী বক্স প্রদর্শন
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        ওএমআর পূরণের নির্দেশনা বক্স দেখান/লুকান
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowInstructions && setShowInstructions(!showInstructions)}
                      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                      style={{
                        background: showInstructions
                          ? "var(--q-toggle-on)"
                          : "var(--q-toggle-off)",
                      }}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                          showInstructions ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 2: স্বাক্ষর বক্স প্রদর্শন */}
                  <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                        স্বাক্ষর বক্স প্রদর্শন
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        পরীক্ষার্থী ও পরিদর্শকের স্বাক্ষর বক্স
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSignatures && setShowSignatures(!showSignatures)}
                      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                      style={{
                        background: showSignatures
                          ? "var(--q-toggle-on)"
                          : "var(--q-toggle-off)",
                      }}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                          showSignatures ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Tab 2: প্রিন্ট ও অ্যাকশন */
            <motion.div
              key="omr-actions-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="p-5 rounded divide-y divide-[var(--q-card-border)]/70 space-y-5"
              style={{
                background: "var(--q-panel-bg)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid var(--q-panel-border)",
                boxShadow:
                  "0 8px 32px rgba(144,14,176,0.08), 0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* OMR Code Card */}
              <div className="space-y-3.5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans relative overflow-hidden"
                  style={{
                    background: "var(--q-header-gradient)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "var(--q-section-shadow)",
                    border: "1px solid var(--q-section-border)",
                  }}
                >
                  <QrCode className="size-4 text-white" />
                  <span>ইউনিক OMR কোড</span>
                </h3>

                <div
                  className="p-3.5 rounded-xl space-y-3"
                  style={{
                    background: "var(--q-card-bg)",
                    border: "1px solid var(--q-card-border-soft)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                      লেআউট কোড
                    </span>
                    <span
                      className="px-2 py-0.5 text-white text-[10px] font-bold rounded-full"
                      style={{ background: "var(--q-header-gradient)" }}
                    >
                      {templateType === "smart-signature"
                        ? "Signature"
                        : "Classic"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
                      {selectedLayoutCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer hover:opacity-90 shadow-2xs"
                      style={{
                        background: "var(--q-selected-bg)",
                        color: "var(--purple-700)",
                        border: "1px solid var(--q-card-border-soft)",
                      }}
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
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    💡 এই কোডটি দিয়ে পরবর্তী ধাপে ওএমআর টোকেন ও উত্তরমালা তৈরি
                    করবেন।
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-5">
                <button
                  type="button"
                  onClick={onPrint}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-white font-bold text-[13px] rounded-xl shadow-md transition cursor-pointer hover:opacity-95"
                  style={{
                    background: "var(--q-header-gradient)",
                    boxShadow: "var(--q-print-btn-shadow)",
                  }}
                >
                  <Printer className="w-4 h-4" />
                  <span>A4 ওএমআর শিট প্রিন্ট করুন</span>
                </button>

                <Link
                  to="/dashboard/omr/tokens"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 font-bold text-[13px] rounded-xl border transition text-center"
                  style={{
                    backgroundColor: "var(--q-selected-bg)",
                    color: "var(--purple-700)",
                    borderColor: "var(--q-card-border)",
                  }}
                >
                  <span>পরবর্তী ধাপ: ওএমআর টোকেন তৈরি</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Guidelines */}
              <div className="space-y-3 pt-5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans relative overflow-hidden"
                  style={{
                    background: "var(--q-header-gradient)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "var(--q-section-shadow)",
                    border: "1px solid var(--q-section-border)",
                  }}
                >
                  <FileCheck className="size-4 text-white" />
                  <span>প্রিন্ট করার নিয়মাবলী</span>
                </h3>

                <div
                  className="p-3.5 rounded-xl border text-xs space-y-2"
                  style={{
                    background: "var(--q-card-bg)",
                    borderColor: "var(--q-card-border-soft)",
                  }}
                >
                  <ul className="text-[12px] text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bottom Quick Print Button on Mobile */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2.5 text-white font-bold text-xs rounded-full shadow-2xl transition cursor-pointer"
          style={{ background: "var(--q-header-gradient)" }}
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট (A4)</span>
        </button>
      </div>
    </aside>
  );
}
