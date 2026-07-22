import {
  Award,
  ChevronDown,
  Download,
  FileText,
  LayoutGrid,
  Printer,
  Settings,
  Sliders,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu.jsx";
import { FONT_OPTIONS, PAPER_SIZES_META } from "../constants/paperSettings.js";

export default function SettingsSidebar({
  activeTab,
  setActiveTab,
  layoutSettings,
  updateSettingField,
  onOpenPageSetup,
  onOpenLogoSettings,
  onOpenHeaderSettings,
  onOpenFooterSettings,
  handlePrint,
  activeFont,
}) {
  return (
    <div className="w-full lg:w-[360px] lg:shrink-0 print:hidden lg:sticky lg:top-1 lg:h-[calc(100vh-48px)] lg:flex lg:flex-col gap-4">
      {/* Tab Switcher */}
      <div
        className="flex p-1 rounded gap-1 shrink-0"
        style={{
          background: "rgba(109,40,217,0.12)",
          border: "1.5px solid rgba(109,40,217,0.2)",
        }}
      >
        {[
          { id: "settings", label: "সেটিংস", icon: Settings },
          { id: "download", label: "ডাউনলোড", icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 cursor-pointer select-none relative"
              style={{
                color: isActive ? "#fff" : "rgba(109,40,217,0.7)",
                background: "transparent",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebarTabIndicator"
                  className="absolute inset-0 rounded"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)",
                    boxShadow:
                      "0 4px 16px rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <Icon className="size-4 relative z-10" />
              <span className="font-bengali relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 lg:overflow-y-auto pr-1 min-h-0 custom-sidebar-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="p-5 pb-40 rounded divide-y divide-violet-100/70 space-y-5"
              style={{
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(167,139,250,0.25)",
                boxShadow:
                  "0 8px 32px rgba(109,40,217,0.08), 0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* Attachment settings card */}
              <div className="space-y-3.5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow:
                      "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)",
                    border: "1px solid rgba(167,139,250,0.4)",
                  }}
                >
                  <LayoutGrid className="size-4 text-white" />
                  <span>প্রশ্নে সংযুক্তি</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { field: "answerSheet", label: "উত্তরপত্র সংযুক্তি" },
                    { field: "omr", label: "OMR সংযুক্তি" },
                    {
                      field: "important",
                      label: "গুরুত্বপূর্ণ প্রশ্ন চিহ্নিতকরণ",
                    },
                    {
                      field: "questionInfo",
                      label: "প্রশ্নের তথ্য প্রদর্শন",
                    },
                    { field: "studentInfo", label: "শিক্ষার্থীর তথ্য" },
                    { field: "marksGrid", label: "প্রাপ্ত নম্বর" },
                    { field: "subjectCode", label: "বিষয় কোড" },
                  ].map((opt) => (
                    <div
                      key={opt.field}
                      className="flex items-center justify-between px-3 py-2 rounded-xl transition"
                      style={{
                        background: "rgba(248,246,255,0.85)",
                        border: "1px solid rgba(167,139,250,0.18)",
                      }}
                    >
                      <span className="text-[14px] font-semibold text-slate-700 font-sans tracking-tight">
                        {opt.label}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSettingField(
                            "attachments",
                            opt.field,
                            !layoutSettings.attachments[opt.field],
                          )
                        }
                        className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                        style={{
                          background: layoutSettings.attachments[opt.field]
                            ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                            : "rgba(203,213,225,0.8)",
                        }}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                            layoutSettings.attachments[opt.field]
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata header toggles */}
              <div className="space-y-3.5 pt-5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow:
                      "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)",
                    border: "1px solid rgba(167,139,250,0.4)",
                  }}
                >
                  <FileText className="size-4 text-white" />
                  <span>প্রশ্নের মেটাডাটা (হেডার)</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { field: "className", label: "শ্রেণির নাম" },
                    { field: "subjectName", label: "বিষয়ের নাম" },
                    { field: "chapterName", label: "অধ্যায়ের নাম" },
                    { field: "setCode", label: "সেট কোড" },
                    {
                      field: "programName",
                      label: "প্রোগ্রাম/পরীক্ষার নাম",
                    },
                    { field: "instructions", label: "নির্দেশনাবলি" },
                  ].map((opt) => (
                    <div
                      key={opt.field}
                      className="flex items-center justify-between px-3 py-2 rounded-xl transition"
                      style={{
                        background: "rgba(248,246,255,0.85)",
                        border: "1px solid rgba(167,139,250,0.18)",
                      }}
                    >
                      <span className="text-[14px] font-semibold text-slate-700 font-sans tracking-tight">
                        {opt.label}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSettingField(
                            "metadata",
                            opt.field,
                            !layoutSettings.metadata[opt.field],
                          )
                        }
                        className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                        style={{
                          background: layoutSettings.metadata[opt.field]
                            ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                            : "rgba(203,213,225,0.8)",
                        }}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                            layoutSettings.metadata[opt.field]
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout controls */}
              <div className="space-y-3.5 pt-5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow:
                      "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)",
                    border: "1px solid rgba(167,139,250,0.4)",
                  }}
                >
                  <Sliders className="size-4 text-white" />
                  <span>ডকুমেন্ট কাস্টমাইজেশন</span>
                </h3>
                <div className="space-y-3">
                  {/* Paper size */}
                  <div
                    className="space-y-1.5 p-3 rounded-xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <label className="text-[12px] font-extrabold text-slate-600 block font-bengali">
                      কাগজের সাইজ
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {PAPER_SIZES_META.map((paper) => {
                        const isSelected =
                          layoutSettings.paperSize === paper.id;
                        return (
                          <button
                            key={paper.id}
                            onClick={() =>
                              updateSettingField(null, "paperSize", paper.id)
                            }
                            className="flex flex-col items-center justify-center p-2 border rounded-xl transition cursor-pointer select-none"
                            style={
                              isSelected
                                ? {
                                    background: "rgba(109,40,217,0.08)",
                                    border: "1.5px solid rgba(109,40,217,0.45)",
                                    color: "rgb(109,40,217)",
                                  }
                                : {
                                    background: "white",
                                    borderColor: "rgba(203,213,225,0.8)",
                                    color: "#64748b",
                                  }
                            }
                          >
                            <div className="h-14 w-full flex items-center justify-center bg-slate-50/50 rounded-lg mb-1.5 border border-slate-100 shadow-sm relative overflow-hidden">
                              <div
                                className={`bg-white border border-slate-300 rounded shadow-sm transition-all ${
                                  isSelected ? "border-violet-400" : ""
                                }`}
                                style={{
                                  width: `${paper.w}px`,
                                  height: `${paper.h}px`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-bold">
                              {paper.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Page Setup trigger button */}
                  <button
                    type="button"
                    onClick={onOpenPageSetup}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl transition cursor-pointer select-none"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1.5px solid rgba(109,40,217,0.3)",
                    }}
                  >
                    <div>
                      <span
                        className="text-[13px] font-bold font-bengali"
                        style={{ color: "rgb(109,40,217)" }}
                      >
                        পেজ সেটাপ (মার্জিন)
                      </span>
                    </div>
                    <Sliders
                      className="size-4"
                      style={{ color: "rgb(109,40,217)" }}
                    />
                  </button>

                  {/* Columns layout cards */}
                  <div
                    className="space-y-1.5 p-3 rounded-xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <label className="text-[12px] font-extrabold text-slate-600 block font-bengali">
                      কলাম বিন্যাস
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        {
                          id: 1,
                          label: "১ কলাম",
                          content: (
                            <div className="h-8 w-6 bg-slate-300 rounded-sm shadow-sm" />
                          ),
                        },
                        {
                          id: 2,
                          label: "২ কলাম",
                          content: (
                            <div className="flex gap-1.5">
                              <div className="h-8 w-2.5 bg-slate-300 rounded-sm shadow-sm" />
                              <div className="h-8 w-2.5 bg-slate-300 rounded-sm shadow-sm" />
                            </div>
                          ),
                        },
                        {
                          id: 3,
                          label: "৩ কলাম",
                          content: (
                            <div className="flex gap-1">
                              <div className="h-8 w-1.5 bg-slate-300 rounded-sm shadow-sm" />
                              <div className="h-8 w-1.5 bg-slate-300 rounded-sm shadow-sm" />
                              <div className="h-8 w-1.5 bg-slate-300 rounded-sm shadow-sm" />
                            </div>
                          ),
                        },
                      ].map((col) => {
                        const isSelected = layoutSettings.columns === col.id;
                        return (
                          <button
                            key={col.id}
                            onClick={() =>
                              updateSettingField(null, "columns", col.id)
                            }
                            className="flex flex-col items-center justify-center p-2 border rounded-xl transition cursor-pointer select-none"
                            style={
                              isSelected
                                ? {
                                    background: "rgba(109,40,217,0.08)",
                                    border: "1.5px solid rgba(109,40,217,0.45)",
                                    color: "rgb(109,40,217)",
                                  }
                                : {
                                    background: "white",
                                    borderColor: "rgba(203,213,225,0.8)",
                                    color: "#64748b",
                                  }
                            }
                          >
                            <div className="h-14 w-full flex items-center justify-center bg-slate-50/50 rounded-lg mb-1.5 border border-slate-100 shadow-sm relative overflow-hidden">
                              {col.content}
                            </div>
                            <span className="text-[11px] font-bold">
                              {col.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column Divider card with sliders */}
                  <div
                    className="p-3.5 rounded-xl space-y-2.5"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-slate-700 font-bengali">
                        কলাম ডিভাইডার
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSettingField(
                            null,
                            "columnDivider",
                            !layoutSettings.columnDivider,
                          )
                        }
                        className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                        style={{
                          background: layoutSettings.columnDivider
                            ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                            : "rgba(203,213,225,0.8)",
                        }}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                            layoutSettings.columnDivider
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Gaps box */}
                    <div
                      className="rounded-xl p-3 space-y-3"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(167,139,250,0.15)",
                      }}
                    >
                      {/* Question Bottom Gap slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11.5px] font-semibold text-slate-600 font-sans tracking-tight">
                          <span>প্রশ্নের নিচের গ্যাপ</span>
                          <span className="font-sans text-[11px] text-slate-500">
                            {layoutSettings.lineSpacing}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={layoutSettings.lineSpacing}
                          onChange={(e) =>
                            updateSettingField(
                              null,
                              "lineSpacing",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-1"
                        />
                      </div>

                      {/* Line Height slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11.5px] font-semibold text-slate-600 font-sans tracking-tight">
                          <span>লাইন হাইট</span>
                          <span className="font-sans text-[11px] text-slate-500">
                            {layoutSettings.lineHeight ?? 1.5}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.8"
                          max="3.0"
                          step="0.05"
                          value={layoutSettings.lineHeight ?? 1.5}
                          onChange={(e) =>
                            updateSettingField(
                              null,
                              "lineHeight",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-1"
                        />
                      </div>

                      {/* Column Gap slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11.5px] font-semibold text-slate-600 font-sans tracking-tight">
                          <span>কলামের গ্যাপ</span>
                          <span className="font-sans text-[11px] text-slate-500">
                            {layoutSettings.columnGap}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="40"
                          value={layoutSettings.columnGap}
                          onChange={(e) =>
                            updateSettingField(
                              null,
                              "columnGap",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-1"
                        />
                      </div>

                      {/* Column Divider Controls (Height, Thickness & Color) */}
                      {layoutSettings.columnDivider && (
                        <>
                          {/* Height / Length Slider */}
                          <div className="space-y-1 pt-1.5 border-t border-slate-100">
                            <div className="flex justify-between text-[11.5px] font-semibold text-slate-600 font-sans tracking-tight">
                              <span>ডিভাইডারের দৈর্ঘ্য / হাইট</span>
                              <span className="font-sans text-[11px] text-slate-500">
                                {layoutSettings.columnDividerHeight ?? 100}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="100"
                              step="1"
                              value={layoutSettings.columnDividerHeight ?? 100}
                              onChange={(e) =>
                                updateSettingField(
                                  null,
                                  "columnDividerHeight",
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-1"
                            />
                          </div>

                          {/* Thickness Slider */}
                          <div className="space-y-1 pt-1.5 border-t border-slate-100">
                            <div className="flex justify-between text-[11.5px] font-semibold text-slate-600 font-sans tracking-tight">
                              <span>ডিভাইডার থিকনেস (সাইজ)</span>
                              <span className="font-sans text-[11px] text-slate-500">
                                {layoutSettings.columnDividerWidth || 1}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0.25"
                              max="8"
                              step="0.25"
                              value={layoutSettings.columnDividerWidth || 1}
                              onChange={(e) =>
                                updateSettingField(
                                  null,
                                  "columnDividerWidth",
                                  parseFloat(e.target.value),
                                )
                              }
                              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-1"
                            />
                          </div>

                          {/* Color & Opacity Picker */}
                          <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                            <div className="flex justify-between items-center text-[11.5px] font-semibold text-slate-600 font-sans tracking-tight">
                              <span>ডিভাইডার কালার</span>
                              <input
                                type="color"
                                value={
                                  layoutSettings.columnDividerColor || "#000000"
                                }
                                onChange={(e) =>
                                  updateSettingField(
                                    null,
                                    "columnDividerColor",
                                    e.target.value,
                                  )
                                }
                                className="size-5 rounded border border-slate-200 cursor-pointer p-0 bg-transparent"
                              />
                            </div>
                            <div className="flex items-center gap-1.5 pt-0.5">
                              {[
                                { label: "কালো", color: "#000000" },
                                { label: "ডার্ক গ্রে", color: "#334155" },
                                { label: "মিডিয়াম গ্রে", color: "#64748b" },
                                { label: "লাইট গ্রে", color: "#cbd5e1" },
                                { label: "ভায়োলেট", color: "#6d28d9" },
                              ].map((item) => (
                                <button
                                  key={item.color}
                                  type="button"
                                  onClick={() =>
                                    updateSettingField(
                                      null,
                                      "columnDividerColor",
                                      item.color,
                                    )
                                  }
                                  className={`h-4 w-4 rounded-full border transition-all ${
                                    (layoutSettings.columnDividerColor ||
                                      "#000000") === item.color
                                      ? "ring-2 ring-violet-500 ring-offset-1 scale-110"
                                      : "border-slate-200 hover:scale-105"
                                  }`}
                                  style={{ backgroundColor: item.color }}
                                  title={item.label}
                                />
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Font Selection */}
                  <div
                    className="space-y-1.5 p-3 rounded-xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <label className="text-[10px] font-bold text-slate-500 block">
                      বাংলা ফন্ট
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full h-9 px-3 border border-slate-200 bg-white hover:border-violet-400 focus:outline-none transition-all rounded-xl text-xs font-bold text-slate-700 flex justify-between items-center shadow-sm cursor-pointer select-none">
                          <span>
                            {FONT_OPTIONS.find((f) => f.value === activeFont)
                              ?.label || activeFont}
                          </span>
                          <ChevronDown className="size-3.5 text-slate-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                        {FONT_OPTIONS.map((font) => {
                          const isSelected = activeFont === font.value;
                          return (
                            <DropdownMenuItem
                              key={font.value}
                              onSelect={() =>
                                updateSettingField(
                                  null,
                                  "fontFamily",
                                  font.value,
                                )
                              }
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer focus:bg-violet-50 focus:text-violet-700 hover:bg-slate-50 group ${
                                isSelected
                                  ? "bg-violet-50 text-violet-700"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>{font.label}</span>
                              {isSelected && (
                                <span className="size-1.5 rounded-full bg-violet-500" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Prefix Prefix style */}
                  <div
                    className="space-y-1.5 p-3 rounded-xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <label className="text-[10px] font-bold text-slate-500 block">
                      অপশন স্টাইল
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {["◯", "()", ".", ")"].map((style) => {
                        const isSelected =
                          (layoutSettings.optionStyle || "()") === style;
                        return (
                          <button
                            key={style}
                            type="button"
                            onClick={() =>
                              updateSettingField(null, "optionStyle", style)
                            }
                            className="py-1.5 border rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer select-none"
                            style={
                              isSelected
                                ? {
                                    background: "rgba(109,40,217,0.12)",
                                    border: "1.5px solid rgb(109,40,217)",
                                    color: "rgb(109,40,217)",
                                  }
                                : {
                                    background: "white",
                                    borderColor: "rgba(203,213,225,0.8)",
                                    color: "#64748b",
                                  }
                            }
                          >
                            {style === "◯" ? (
                              <span className="inline-block size-3.5 rounded-full border-2 border-current" />
                            ) : (
                              style
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font sizes */}
                  <div
                    className="space-y-1.5 p-3 rounded-xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex justify-between text-[12px] font-bold text-slate-600 font-bengali">
                      <span>ফন্ট সাইজ</span>
                      <span className="font-sans">
                        {layoutSettings.fontSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={layoutSettings.fontSize}
                      onChange={(e) =>
                        updateSettingField(
                          null,
                          "fontSize",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Branding controls */}
              <div className="space-y-3.5 pt-5">
                <h3
                  className="text-[15px] text-white uppercase tracking-wider flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-sans font-semibold relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 50%, rgba(124,58,237,0.88) 100%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow:
                      "0 4px 20px 0 rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)",
                    border: "1px solid rgba(167,139,250,0.4)",
                  }}
                >
                  <Award className="size-4 text-white" />
                  <span>ব্র্যান্ডিং</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { field: "logo", label: "লোগো", hasConfig: true },
                    { field: "header", label: "হেডার", hasConfig: true },
                    { field: "footer", label: "ফুটার", hasConfig: true },
                    { field: "watermark", label: "জলছাপ", hasConfig: true },
                    { field: "address", label: "ঠিকানা", hasConfig: false },
                  ].map((opt) => (
                    <div
                      key={opt.field}
                      className="flex items-center justify-between px-3 py-2 rounded-xl transition"
                      style={{
                        background: "rgba(248,246,255,0.85)",
                        border: "1px solid rgba(167,139,250,0.18)",
                      }}
                    >
                      <span className="text-[13px] font-semibold text-slate-700 font-sans tracking-tight">
                        {opt.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateSettingField(
                              "branding",
                              opt.field,
                              !layoutSettings.branding[opt.field],
                            )
                          }
                          className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
                          style={{
                            background: layoutSettings.branding[opt.field]
                              ? "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)"
                              : "rgba(203,213,225,0.8)",
                          }}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                              layoutSettings.branding[opt.field]
                                ? "translate-x-4"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                        {opt.hasConfig && (
                          <button
                            type="button"
                            onClick={() => {
                              if (opt.field === "logo") {
                                onOpenLogoSettings();
                              } else if (opt.field === "header") {
                                onOpenHeaderSettings();
                              } else if (opt.field === "footer") {
                                onOpenFooterSettings();
                              }
                            }}
                            className="p-1.5 rounded-lg transition-all duration-200 hover:bg-violet-600/10 active:scale-95 cursor-pointer text-violet-600/70 hover:text-violet-700"
                          >
                            <Sliders className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "download" && (
            <motion.div
              key="download"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="p-6 rounded-2xl space-y-4 text-center"
              style={{
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(167,139,250,0.25)",
                boxShadow: "0 8px 32px rgba(109,40,217,0.08)",
              }}
            >
              <div
                className="p-4 rounded-full w-fit mx-auto"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(79,70,229,0.12) 100%)",
                  border: "1.5px solid rgba(109,40,217,0.25)",
                  color: "rgb(109,40,217)",
                }}
              >
                <Printer className="size-8" />
              </div>
              <h3
                className="text-[15px] font-bold font-bengali"
                style={{ color: "rgb(80,50,180)" }}
              >
                প্রশ্নপত্র প্রিন্ট অথবা ডাউনলোড করুন
              </h3>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium font-bengali">
                আপনার নির্বাচিত সেটিংস অনুযায়ী প্রশ্নপত্রটি ডাউনলোড করতে নিচের
                বাটনে ক্লিক করুন। প্রিন্ট লেআউটে সাইডবার ও সেটিংস অংশ
                স্বয়ংক্রিয়ভাবে বাদ পড়বে।
              </p>
              <button
                onClick={handlePrint}
                className="w-full py-3 text-white rounded-xl text-sm font-black flex items-center justify-center gap-1.5 cursor-pointer mt-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 55%, rgba(124,58,237,0.88) 100%)",
                  boxShadow:
                    "0 8px 24px rgba(109,40,217,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <Printer className="size-4" />
                প্রিন্ট / PDF ডাউনলোড
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
