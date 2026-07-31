import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Award,
  ChevronDown,
  Eye,
  FileText,
  LayoutGrid,
  Maximize2,
  Move,
  Sliders,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu.jsx";

export default function FooterSettingsDrawer({
  isOpen,
  onClose,
  layoutSettings,
  updateSettingField,
  activeFont,
}) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] print:hidden"
            style={{ background: "rgba(15,10,40,0.45)" }}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 22,
              mass: 0.75,
            }}
            className="fixed bottom-0 left-1/2 w-full max-w-lg z-[200] rounded-t-3xl print:hidden overflow-hidden flex flex-col"
            style={{
              maxHeight: "88vh",
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderBottom: "none",
              boxShadow: "var(--q-drawer-shadow)",
            }}
          >
            {/* Fixed Top Section: Gradient header + drag handle + live banner preview */}
            <div className="shrink-0 relative z-10">
              {/* Gradient header */}
              <div
                className="relative flex items-center justify-between px-6 pt-5 pb-4"
                style={{
                  background: "var(--q-header-gradient)",
                }}
              >
                <div
                  className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                  style={{
                    background: "var(--q-glow-blob-1)",
                  }}
                />
                <div
                  className="absolute -bottom-4 right-8 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background: "var(--q-glow-blob-2)",
                  }}
                />
                <div className="flex items-center gap-3 relative z-10">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                    }}
                  >
                    <FileText className="size-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-white leading-tight font-bengali tracking-tight">
                      ফুটার সেটিংস
                    </h3>
                    <p className="text-white/70 text-[11px] font-medium leading-tight font-bengali mt-0.5">
                      প্রশ্নপত্রে ফুটার ব্যানার কাস্টমাইজ করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-slate-300/70" />
              </div>

              {/* ── Fixed Live Banner Preview ── */}
              <div className="px-5 pb-3">
                <div
                  className="relative w-full rounded-2xl overflow-hidden shadow-sm"
                  style={{
                    background: "rgba(248,246,255,0.85)",
                    border: "1px solid rgba(167,139,250,0.2)",
                    minHeight: "70px",
                  }}
                >
                  {/* Simulated paper strip */}
                  <div className="px-4 pt-3 pb-1.5">
                    <span
                      className="text-[9px] font-bold tracking-widest uppercase font-sans"
                      style={{ color: "var(--q-tab-inactive-text)" }}
                    >
                      প্রিভিউ
                    </span>
                  </div>
                  <div
                    className="mx-4 mb-3 flex items-center overflow-hidden transition-all"
                    style={{
                      minHeight: `${layoutSettings.footerSettings?.height || 50}px`,
                      background:
                        layoutSettings.footerSettings?.bgColor ||
                        "var(--purple-600)",
                      borderRadius: `${layoutSettings.footerSettings?.borderRadius ?? 8}px`,
                      justifyContent:
                        layoutSettings.footerSettings?.align === "left"
                          ? "flex-start"
                          : layoutSettings.footerSettings?.align === "right"
                            ? "flex-end"
                            : "center",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color:
                          layoutSettings.footerSettings?.textColor || "#ffffff",
                        fontSize: `${layoutSettings.footerSettings?.fontSize || 16}px`,
                        fontWeight: layoutSettings.footerSettings?.bold
                          ? "bold"
                          : "normal",
                        fontStyle: layoutSettings.footerSettings?.italic
                          ? "italic"
                          : "normal",
                        fontFamily:
                          layoutSettings.footerSettings?.fontFamily ===
                          "English"
                            ? "Outfit, sans-serif"
                            : `'${activeFont}', sans-serif`,
                        lineHeight: 1.3,
                        whiteSpace: "pre-line",
                        textAlign:
                          layoutSettings.footerSettings?.align || "center",
                        width: "100%",
                      }}
                    >
                      {layoutSettings.footerSettings?.text ||
                        "সকল প্রশ্নের উত্তর দেওয়া বাধ্যতামূলক | শুভকামনা রইল"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 pt-1 pb-6 space-y-4 no-scrollbar">
              {/* ── Footer Text Input ── */}
              <div
                className="space-y-2.5 p-4 rounded-2xl"
                style={{
                  background: "rgba(248,246,255,0.85)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <FileText
                    className="size-3.5"
                    style={{ color: "rgb(109,40,217)" }}
                    strokeWidth={2.5}
                  />
                  <span className="text-[12px] font-bold text-slate-700 font-bengali">
                    ফুটার টেক্সট
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={layoutSettings.footerSettings?.text || ""}
                  onChange={(e) =>
                    updateSettingField("footerSettings", "text", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-violet-400 focus:border-violet-500 focus:outline-none transition-all rounded-xl text-[13px] font-semibold text-slate-800 shadow-sm resize-none"
                  placeholder="ফুটার টেক্সট লিখুন..."
                />
              </div>

              {/* ── Font Size & Height Sliders Row ── */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "ফন্ট সাইজ",
                    icon: Maximize2,
                    field: "fontSize",
                    min: 10,
                    max: 40,
                    unit: "px",
                    value: layoutSettings.footerSettings?.fontSize || 16,
                  },
                  {
                    label: "উচ্চতা",
                    icon: Sliders,
                    field: "height",
                    min: 30,
                    max: 150,
                    unit: "px",
                    value: layoutSettings.footerSettings?.height || 50,
                  },
                ].map(({ label, icon: Icon, field, min, max, unit, value }) => (
                  <div
                    key={field}
                    className="space-y-2.5 p-3.5 rounded-2xl"
                    style={{
                      background: "rgba(248,246,255,0.85)",
                      border: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Icon
                          className="size-3.5"
                          style={{ color: "var(--purple-600)" }}
                          strokeWidth={2.5}
                        />
                        <span className="text-[12px] font-bold text-slate-700 font-bengali">
                          {label}
                        </span>
                      </div>
                      <span
                        className="text-[11px] font-black font-sans px-2 py-0.5 rounded-lg"
                        style={{
                          background: "var(--q-badge-bg)",
                          color: "var(--q-badge-text)",
                        }}
                      >
                        {value}
                        {unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={value}
                      onChange={(e) =>
                        updateSettingField(
                          "footerSettings",
                          field,
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: "var(--purple-600)" }}
                    />
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 font-sans">
                      <span>
                        {min}
                        {unit}
                      </span>
                      <span>
                        {max}
                        {unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Border Radius Slider (full width) ── */}
              <div
                className="space-y-2.5 p-3.5 rounded-2xl"
                style={{
                  background: "rgba(248,246,255,0.85)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Move
                      className="size-3.5"
                      style={{ color: "var(--purple-600)" }}
                      strokeWidth={2.5}
                    />
                    <span className="text-[12px] font-bold text-slate-700 font-bengali">
                      বর্ডার রেডিয়াস
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-black font-sans px-2 py-0.5 rounded-lg"
                    style={{
                      background: "var(--q-badge-bg)",
                      color: "var(--q-badge-text)",
                    }}
                  >
                    {layoutSettings.footerSettings?.borderRadius ?? 8}px
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={layoutSettings.footerSettings?.borderRadius ?? 8}
                  onChange={(e) =>
                    updateSettingField(
                      "footerSettings",
                      "borderRadius",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "var(--purple-600)" }}
                />
                <div className="flex justify-between text-[9px] font-bold text-slate-400 font-sans">
                  <span>0px</span>
                  <span>40px</span>
                </div>
              </div>

              {/* ── Alignment & Text Style Row ── */}
              <div className="grid grid-cols-2 gap-3">
                {/* Alignment */}
                <div
                  className="space-y-2 p-3.5 rounded-2xl"
                  style={{
                    background: "rgba(248,246,255,0.85)",
                    border: "1px solid rgba(167,139,250,0.2)",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <AlignCenter
                      className="size-3.5"
                      style={{ color: "var(--purple-600)" }}
                      strokeWidth={2.5}
                    />
                    <span className="text-[12px] font-bold text-slate-700 font-bengali">
                      অ্যালাইনমেন্ট
                    </span>
                  </div>
                  <div className="flex gap-1.5 bg-slate-200/50 p-1 rounded-xl">
                    {[
                      { val: "left", icon: AlignLeft },
                      { val: "center", icon: AlignCenter },
                      { val: "right", icon: AlignRight },
                    ].map((alignOpt) => {
                      const isActive =
                        layoutSettings.footerSettings?.align === alignOpt.val;
                      const AlignIcon = alignOpt.icon;
                      return (
                        <button
                          key={alignOpt.val}
                          type="button"
                          onClick={() =>
                            updateSettingField(
                              "footerSettings",
                              "align",
                              alignOpt.val,
                            )
                          }
                          className="flex-1 py-2 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                          style={{
                            background: isActive
                              ? "var(--q-header-gradient)"
                              : "transparent",
                            color: isActive
                              ? "#ffffff"
                              : "var(--q-tab-inactive-text)",
                            boxShadow: isActive
                              ? "0 2px 8px rgba(144,14,176,0.25)"
                              : "none",
                          }}
                        >
                          <AlignIcon className="size-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bold & Italic */}
                <div
                  className="space-y-2 p-3.5 rounded-2xl"
                  style={{
                    background: "rgba(248,246,255,0.85)",
                    border: "1px solid rgba(167,139,250,0.2)",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Award
                      className="size-3.5"
                      style={{ color: "var(--purple-600)" }}
                      strokeWidth={2.5}
                    />
                    <span className="text-[12px] font-bold text-slate-700 font-bengali">
                      টেক্সট স্টাইল
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      {
                        field: "bold",
                        label: "B",
                        extraClass: "font-extrabold",
                        active: layoutSettings.footerSettings?.bold,
                      },
                      {
                        field: "italic",
                        label: "I",
                        extraClass: "italic font-bold",
                        active: layoutSettings.footerSettings?.italic,
                      },
                    ].map(({ field, label, extraClass, active }) => (
                      <button
                        key={field}
                        type="button"
                        onClick={() =>
                          updateSettingField("footerSettings", field, !active)
                        }
                        className={`flex-1 py-2 rounded-xl border font-sans text-sm transition-all cursor-pointer ${extraClass}`}
                        style={{
                          background: active
                            ? "var(--q-toggle-on)"
                            : "white",
                          color: active ? "#ffffff" : "#64748b",
                          borderColor: active
                            ? "transparent"
                            : "rgba(203,213,225,0.8)",
                          boxShadow: active
                            ? "0 2px 8px rgba(144,14,176,0.25)"
                            : "none",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Background Color ── */}
              <div
                className="space-y-3 p-4 rounded-2xl"
                style={{
                  background: "rgba(248,246,255,0.85)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <LayoutGrid
                    className="size-3.5"
                    style={{ color: "var(--purple-600)" }}
                    strokeWidth={2.5}
                  />
                  <span className="text-[12px] font-bold text-slate-700 font-bengali">
                    ব্যাকগ্রাউন্ড কালার
                  </span>
                </div>
                {/* Preset swatches */}
                <div className="grid grid-cols-7 gap-2">
                  {[
                    "rgba(30, 41, 59, 0.95)",
                    "rgba(109, 40, 217, 0.92)",
                    "rgba(21, 128, 61, 0.92)",
                    "rgba(185, 28, 28, 0.92)",
                    "rgba(29, 78, 216, 0.92)",
                    "rgba(3, 105, 161, 0.92)",
                    "rgba(15, 118, 110, 0.92)",
                    "rgba(180, 83, 9, 0.92)",
                    "rgba(190, 24, 74, 0.92)",
                    "rgba(55, 65, 81, 0.92)",
                    "rgba(0, 0, 0, 0.95)",
                    "rgba(8, 47, 73, 0.92)",
                    "rgba(20, 110, 120, 0.92)",
                    "rgba(124, 45, 18, 0.92)",
                  ].map((color) => {
                    const isSelected =
                      layoutSettings.footerSettings?.bgColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          updateSettingField("footerSettings", "bgColor", color)
                        }
                        className="w-7 h-7 rounded-full relative transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        style={{
                          background: color,
                          boxShadow: isSelected
                            ? "0 0 0 2.5px white, 0 0 0 4px var(--purple-600)"
                            : "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      />
                    );
                  })}
                </div>
                {/* Custom color picker row */}
                <div
                  className="flex items-center gap-2.5 pt-1 px-3 py-2 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(203,213,225,0.6)",
                  }}
                >
                  <input
                    type="color"
                    value={
                      layoutSettings.footerSettings?.bgColor?.startsWith("#")
                        ? layoutSettings.footerSettings.bgColor
                        : "#6d28d9"
                    }
                    onChange={(e) =>
                      updateSettingField(
                        "footerSettings",
                        "bgColor",
                        e.target.value,
                      )
                    }
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                    style={{ padding: 0 }}
                  />
                  <input
                    type="text"
                    value={layoutSettings.footerSettings?.bgColor || ""}
                    onChange={(e) =>
                      updateSettingField(
                        "footerSettings",
                        "bgColor",
                        e.target.value,
                      )
                    }
                    className="flex-1 bg-transparent border-0 focus:outline-none text-[12px] font-mono font-bold text-slate-600"
                    placeholder="#6d28d9 বা rgba(109,40,217,0.92)"
                  />
                </div>
              </div>

              {/* ── Text Color ── */}
              <div
                className="space-y-3 p-4 rounded-2xl"
                style={{
                  background: "rgba(248,246,255,0.85)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Eye
                    className="size-3.5"
                    style={{ color: "var(--purple-600)" }}
                    strokeWidth={2.5}
                  />
                  <span className="text-[12px] font-bold text-slate-700 font-bengali">
                    টেক্সট কালার
                  </span>
                </div>
                {/* Preset text color swatches */}
                <div className="flex items-center gap-2.5">
                  {[
                    { color: "#ffffff", ring: "#94a3b8" },
                    { color: "#000000", ring: "transparent" },
                    { color: "#e2e8f0", ring: "#94a3b8" },
                    { color: "#fef08a", ring: "transparent" },
                    { color: "#fecdd3", ring: "transparent" },
                    { color: "#d9f99d", ring: "transparent" },
                    { color: "#bae6fd", ring: "transparent" },
                  ].map(({ color, ring }) => {
                    const isSelected =
                      layoutSettings.footerSettings?.textColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          updateSettingField(
                            "footerSettings",
                            "textColor",
                            color,
                          )
                        }
                        className="w-7 h-7 rounded-full relative transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        style={{
                          background: color,
                          border: `1px solid ${ring}`,
                          boxShadow: isSelected
                            ? "0 0 0 2.5px var(--purple-600), 0 0 0 4.5px rgba(144,14,176,0.2)"
                            : "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      />
                    );
                  })}
                </div>
                {/* Custom text color row */}
                <div
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(203,213,225,0.6)",
                  }}
                >
                  <input
                    type="color"
                    value={
                      layoutSettings.footerSettings?.textColor?.startsWith("#")
                        ? layoutSettings.footerSettings.textColor
                        : "#ffffff"
                    }
                    onChange={(e) =>
                      updateSettingField(
                        "footerSettings",
                        "textColor",
                        e.target.value,
                      )
                    }
                    className="w-7 h-7 rounded-lg cursor-pointer border-0"
                    style={{ padding: 0 }}
                  />
                  <input
                    type="text"
                    value={layoutSettings.footerSettings?.textColor || ""}
                    onChange={(e) =>
                      updateSettingField(
                        "footerSettings",
                        "textColor",
                        e.target.value,
                      )
                    }
                    className="flex-1 bg-transparent border-0 focus:outline-none text-[12px] font-mono font-bold text-slate-600"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* ── Font Family ── */}
              <div
                className="space-y-2.5 p-4 rounded-2xl"
                style={{
                  background: "rgba(248,246,255,0.85)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <FileText
                    className="size-3.5"
                    style={{ color: "var(--purple-600)" }}
                    strokeWidth={2.5}
                  />
                  <span className="text-[12px] font-bold text-slate-700 font-bengali">
                    ফন্ট ফ্যামিলি
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full h-10 px-3.5 border border-slate-200 bg-white hover:border-[var(--purple-400)] focus:outline-none transition-all rounded-xl text-[13px] font-bold text-slate-700 flex justify-between items-center shadow-sm cursor-pointer select-none">
                      <span>
                        {layoutSettings.footerSettings?.fontFamily === "English"
                          ? "Outfit (English)"
                          : "একুশ (Ekush)"}
                      </span>
                      <ChevronDown className="size-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                    {[
                      { value: "Ekush", label: "একুশ (Ekush)" },
                      { value: "English", label: "Outfit (English)" },
                    ].map((font) => {
                      const isSelected =
                        (layoutSettings.footerSettings?.fontFamily ||
                          "Ekush") === font.value;
                      return (
                        <DropdownMenuItem
                          key={font.value}
                          onSelect={() =>
                            updateSettingField(
                              "footerSettings",
                              "fontFamily",
                              font.value,
                            )
                          }
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-[13px] font-bold transition flex items-center justify-between cursor-pointer focus:bg-[var(--q-dropdown-selected-bg)] focus:text-[var(--q-dropdown-selected-text)] hover:bg-slate-50 ${
                            isSelected
                              ? "bg-[var(--q-dropdown-selected-bg)] text-[var(--q-dropdown-selected-text)]"
                              : "text-slate-700"
                          }`}
                        >
                          <span>{font.label}</span>
                          {isSelected && (
                            <span className="size-1.5 rounded-full bg-[var(--purple-600)]" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
