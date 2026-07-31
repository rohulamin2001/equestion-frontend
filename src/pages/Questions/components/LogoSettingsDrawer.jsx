import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Eye,
  Image,
  LayoutGrid,
  Maximize2,
  Move,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

export default function LogoSettingsDrawer({
  isOpen,
  onClose,
  layoutSettings,
  updateSettingField,
  handleDragStart,
  handleDragMove,
  handleDragTouchMove,
  handleDragEnd,
}) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay with subtle dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] print:hidden"
            style={{ background: "rgba(15,10,40,0.45)" }}
          />

          {/* Bottom Drawer — glassmorphic premium panel */}
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
            className="fixed bottom-0 left-1/2 w-full max-w-lg z-[200] rounded-t-3xl print:hidden overflow-hidden"
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
            {/* Gradient header strip */}
            <div
              className="relative flex items-center justify-between px-6 pt-5 pb-4"
              style={{
                background: "var(--q-header-gradient)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Decorative glow circles */}
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
                {/* Logo icon badge */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                  }}
                >
                  <Image className="size-4 text-white" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white leading-tight font-bengali tracking-tight">
                    লোগো সেটিংস
                  </h3>
                  <p className="text-white/70 text-[11px] font-medium leading-tight font-bengali mt-0.5">
                    প্রশ্নপত্রে লোগো কাস্টমাইজ করুন
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Drag handle pill */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300/70" />
            </div>

            {/* ── Mode Tab Switcher — Always visible, outside scroll ── */}
            <div className="px-5 pb-3">
              <div
                className="flex p-1 rounded-2xl gap-1"
                style={{
                  background: "var(--q-tab-switcher-bg)",
                  border: "1.5px solid var(--q-tab-switcher-border)",
                }}
              >
                {/* Tab: সহজ মোড */}
                <button
                  type="button"
                  onClick={() =>
                    updateSettingField("logoSettings", "positionType", "simple")
                  }
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer"
                  style={
                    layoutSettings.logoSettings.positionType === "simple"
                      ? {
                          background: "var(--q-header-gradient)",
                          color: "#fff",
                          boxShadow:
                            "0 4px 16px rgba(144,14,176,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                        }
                      : {
                          color: "var(--q-tab-inactive-text)",
                          background: "transparent",
                        }
                  }
                >
                  <LayoutGrid className="size-3.5" />
                  <span className="font-bengali">সহজ মোড</span>
                </button>

                {/* Tab: ড্র্যাগ মোড */}
                <button
                  type="button"
                  onClick={() =>
                    updateSettingField("logoSettings", "positionType", "drag")
                  }
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer"
                  style={
                    layoutSettings.logoSettings.positionType === "drag"
                      ? {
                          background: "var(--q-header-gradient)",
                          color: "#fff",
                          boxShadow:
                            "0 4px 16px rgba(144,14,176,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                        }
                      : {
                          color: "var(--q-tab-inactive-text)",
                          background: "transparent",
                        }
                  }
                >
                  <Move className="size-3.5" />
                  <span className="font-bengali">ড্র্যাগ মোড</span>
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div
              className="overflow-y-auto px-5 pb-6 space-y-5 no-scrollbar"
              style={{ maxHeight: "calc(88vh - 180px)" }}
            >
              {/* ── Simple Mode: Position Selector ── */}
              {layoutSettings.logoSettings.positionType === "simple" && (
                <motion.div
                  key="simple-panel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <AlignCenter className="size-3.5 text-violet-600" />
                    <span className="text-[12px] font-bold text-slate-700 font-bengali">
                      লোগোর অবস্থান
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { pos: "left", label: "বামে", icon: AlignLeft },
                      { pos: "center", label: "মাঝে", icon: AlignCenter },
                      { pos: "right", label: "ডানে", icon: AlignRight },
                    ].map(({ pos, label, icon: Icon }) => {
                      const isActive =
                        layoutSettings.logoSettings.position === pos;
                      return (
                        <button
                          key={pos}
                          type="button"
                          onClick={() =>
                            updateSettingField("logoSettings", "position", pos)
                          }
                          className="flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                          style={
                            isActive
                              ? {
                                  background: "var(--q-selected-bg)",
                                  border: "1.5px solid var(--q-selected-border)",
                                  color: "var(--q-selected-text)",
                                  boxShadow: "0 2px 12px rgba(144,14,176,0.15)",
                                }
                              : {
                                  background: "rgba(248,248,255,0.8)",
                                  border: "1.5px solid rgba(226,232,240,0.8)",
                                  color: "#64748b",
                                }
                          }
                        >
                          <Icon className="size-4" />
                          <span className="font-bengali">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── Drag Mode: Canvas ── */}
              {layoutSettings.logoSettings.positionType === "drag" && (
                <motion.div
                  key="drag-panel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Move className="size-3.5 text-[var(--purple-600)]" />
                    <span className="text-[12px] font-bold text-slate-700 font-bengali">
                      অবস্থান ড্র্যাগ করুন
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bengali font-medium">
                    নিচের বক্সে{" "}
                    <span className="text-[var(--purple-600)] font-bold">LOGO</span>{" "}
                    ট্যাগটি ড্র্যাগ করে যেকোনো জায়গায় রাখুন।
                  </p>
                  <div
                    id="logo-drag-container"
                    className="relative w-full h-40 rounded-2xl overflow-hidden cursor-crosshair select-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(248,246,255,0.9) 0%, rgba(240,235,255,0.9) 100%)",
                      border: "1.5px solid var(--q-card-border-soft)",
                      boxShadow: "inset 0 2px 12px rgba(144,14,176,0.06)",
                    }}
                    onMouseMove={handleDragMove}
                    onTouchMove={handleDragTouchMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchEnd={handleDragEnd}
                  >
                    {/* Dot grid */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, rgba(144,14,176,0.4) 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                      }}
                    />
                    {/* Corner labels */}
                    <span className="absolute top-2 left-2.5 text-[9px] font-bold text-[var(--purple-400)]/60 font-sans select-none">
                      ↖ TL
                    </span>
                    <span className="absolute top-2 right-2.5 text-[9px] font-bold text-[var(--purple-400)]/60 font-sans select-none">
                      TR ↗
                    </span>
                    <span className="absolute bottom-2 left-2.5 text-[9px] font-bold text-[var(--purple-400)]/60 font-sans select-none">
                      ↙ BL
                    </span>
                    <span className="absolute bottom-2 right-2.5 text-[9px] font-bold text-[var(--purple-400)]/60 font-sans select-none">
                      BR ↘
                    </span>
                    {/* Draggable badge */}
                    <div
                      style={{
                        left: `${layoutSettings.logoSettings.x}%`,
                        top: `${layoutSettings.logoSettings.y}%`,
                        transform: "translate(-50%, -50%)",
                        background: "var(--q-header-gradient)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 4px 16px rgba(144,14,176,0.45)",
                      }}
                      className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-move shadow-lg active:scale-95 transition-transform select-none"
                      onMouseDown={handleDragStart}
                      onTouchStart={handleDragStart}
                    >
                      <Image className="size-3 text-white" />
                      <span className="text-white font-black text-[10px] font-sans">
                        LOGO
                      </span>
                    </div>
                  </div>
                  {/* Coordinates chip */}
                  <div className="flex justify-center">
                    <span
                      className="text-[11px] font-bold font-sans px-3 py-1 rounded-lg"
                      style={{
                        background: "var(--q-badge-bg)",
                        color: "var(--q-badge-text)",
                        border: "1px solid var(--q-badge-border)",
                      }}
                    >
                      X: {layoutSettings.logoSettings.x}% &nbsp;|&nbsp; Y:{" "}
                      {layoutSettings.logoSettings.y}%
                    </span>
                  </div>
                </motion.div>
              )}

              {/* ── Size Slider ── */}
              <div
                className="space-y-3 p-4 rounded-2xl"
                style={{
                  background: "var(--q-card-bg)",
                  border: "1px solid var(--q-card-border-soft)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="size-3.5 text-[var(--purple-600)]" />
                    <span className="text-[13px] font-bold text-slate-700 font-bengali">
                      সাইজ
                    </span>
                  </div>
                  <span
                    className="text-[12px] font-black font-sans px-2.5 py-0.5 rounded-lg"
                    style={{
                      background: "var(--q-badge-bg)",
                      color: "var(--q-badge-text)",
                    }}
                  >
                    {layoutSettings.logoSettings.size}px
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={layoutSettings.logoSettings.size}
                  onChange={(e) =>
                    updateSettingField(
                      "logoSettings",
                      "size",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "var(--purple-600)" }}
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 font-sans">
                  <span>20px</span>
                  <span>150px</span>
                </div>
              </div>

              {/* ── Opacity Slider ── */}
              <div
                className="space-y-3 p-4 rounded-2xl"
                style={{
                  background: "var(--q-card-bg)",
                  border: "1px solid var(--q-card-border-soft)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="size-3.5 text-[var(--purple-600)]" />
                    <span className="text-[13px] font-bold text-slate-700 font-bengali">
                      স্বচ্ছতা
                    </span>
                  </div>
                  <span
                    className="text-[12px] font-black font-sans px-2.5 py-0.5 rounded-lg"
                    style={{
                      background: "var(--q-badge-bg)",
                      color: "var(--q-badge-text)",
                    }}
                  >
                    {layoutSettings.logoSettings.opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={layoutSettings.logoSettings.opacity}
                  onChange={(e) =>
                    updateSettingField(
                      "logoSettings",
                      "opacity",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "var(--purple-600)" }}
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 font-sans">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* ── Logo Image Uploader ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="size-3.5 text-[var(--purple-600)]" />
                  <span className="text-[13px] font-bold text-slate-700 font-bengali">
                    লোগো ইমেজ
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="logo-image-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (uploadEvent) => {
                        updateSettingField(
                          "logoSettings",
                          "logoUrl",
                          uploadEvent.target.result,
                        );
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="flex items-center gap-3">
                  {/* Upload button */}
                  <label
                    htmlFor="logo-image-upload"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold transition-all cursor-pointer"
                    style={{
                      background: "var(--q-selected-bg)",
                      border: "1.5px dashed var(--q-selected-border)",
                      color: "var(--q-selected-text)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--q-config-hover-bg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--q-selected-bg)";
                    }}
                  >
                    <Upload className="size-4" />
                    <span className="font-bengali">ইমেজ আপলোড করুন</span>
                  </label>

                  {/* Logo preview + remove */}
                  {layoutSettings.logoSettings.logoUrl && (
                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className="w-10 h-10 rounded-xl overflow-hidden border"
                        style={{
                          border: "1.5px solid var(--q-card-border-soft)",
                          boxShadow: "0 2px 8px rgba(144,14,176,0.15)",
                        }}
                      >
                        <img
                          src={layoutSettings.logoSettings.logoUrl}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateSettingField("logoSettings", "logoUrl", null)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
