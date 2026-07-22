import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  FileText,
  Sliders,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { PAPER_SIZES_META } from "../constants/paperSettings.js";

export default function PageSetupDrawer({
  isOpen,
  onClose,
  layoutSettings,
  updateSettingField,
}) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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
              boxShadow:
                "0 -20px 60px -10px rgba(109,40,217,0.22), 0 -4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Fixed Top Section: Gradient header + drag handle + live margin diagram */}
            <div className="shrink-0 relative z-10">
              {/* Gradient header */}
              <div
                className="relative flex items-center justify-between px-6 pt-5 pb-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(109,40,217,0.90) 0%, rgba(79,70,229,0.90) 55%, rgba(124,58,237,0.85) 100%)",
                }}
              >
                <div
                  className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(167,139,250,0.8), transparent)",
                  }}
                />
                <div
                  className="absolute -bottom-4 right-8 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(192,132,252,0.9), transparent)",
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
                    <Sliders className="size-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-white leading-tight font-bengali tracking-tight">
                      পেজ সেটাপ
                    </h3>
                    <p className="text-white/70 text-[11px] font-medium leading-tight font-sans">
                      প্রশ্নপত্রের মার্জিন ও কাগজের সাইজ নির্ধারণ করুন
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

              {/* Live margin diagram */}
              <div className="px-5 pb-3">
                <div
                  className="relative w-full rounded-2xl p-4 flex items-center justify-center shadow-sm"
                  style={{
                    background: "rgba(248,246,255,0.85)",
                    border: "1px solid rgba(167,139,250,0.2)",
                    minHeight: "128px",
                  }}
                >
                  <div
                    className="relative bg-white rounded-sm shadow-md"
                    style={{
                      width: "72px",
                      height: "100px",
                      border: "1.5px solid rgba(167,139,250,0.4)",
                    }}
                  >
                    <div
                      className="absolute rounded-sm"
                      style={{
                        top: `${Math.round(((layoutSettings.pagePaddingTop ?? 32) / 100) * 20)}px`,
                        bottom: `${Math.round(((layoutSettings.pagePaddingBottom ?? 32) / 100) * 20)}px`,
                        left: `${Math.round(((layoutSettings.pagePaddingLeft ?? 32) / 100) * 20)}px`,
                        right: `${Math.round(((layoutSettings.pagePaddingRight ?? 32) / 100) * 20)}px`,
                        background:
                          "linear-gradient(135deg, rgba(109,40,217,0.08) 0%, rgba(79,70,229,0.08) 100%)",
                        border: "1px dashed rgba(109,40,217,0.3)",
                      }}
                    />
                    <span
                      className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold font-sans"
                      style={{ color: "rgb(109,40,217)" }}
                    >
                      {layoutSettings.pagePaddingTop ?? 32}
                    </span>
                    <span
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold font-sans"
                      style={{ color: "rgb(109,40,217)" }}
                    >
                      {layoutSettings.pagePaddingBottom ?? 32}
                    </span>
                    <span
                      className="absolute top-1/2 -left-5 -translate-y-1/2 text-[8px] font-bold font-sans"
                      style={{ color: "rgb(109,40,217)" }}
                    >
                      {layoutSettings.pagePaddingLeft ?? 32}
                    </span>
                    <span
                      className="absolute top-1/2 -right-5 -translate-y-1/2 text-[8px] font-bold font-sans"
                      style={{ color: "rgb(109,40,217)" }}
                    >
                      {layoutSettings.pagePaddingRight ?? 32}
                    </span>
                  </div>
                  <p
                    className="absolute bottom-2 right-3 text-[9px] font-bold font-bengali"
                    style={{ color: "rgba(109,40,217,0.5)" }}
                  >
                    লাইভ প্রিভিউ
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 pt-1 pb-6 space-y-5 no-scrollbar">
              {/* Margin sliders */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "উপরে", Icon: ArrowUp, field: "pagePaddingTop" },
                  {
                    label: "নিচে",
                    Icon: ArrowDown,
                    field: "pagePaddingBottom",
                  },
                  {
                    label: "বামে",
                    Icon: ArrowLeft,
                    field: "pagePaddingLeft",
                  },
                  {
                    label: "ডানে",
                    Icon: ArrowRight,
                    field: "pagePaddingRight",
                  },
                ].map(({ label, Icon, field }) => (
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
                          style={{ color: "rgb(109,40,217)" }}
                          strokeWidth={2.5}
                        />
                        <span className="text-[12px] font-bold text-slate-700 font-bengali">
                          {label}
                        </span>
                      </div>
                      <span
                        className="text-[11px] font-black font-sans px-2 py-0.5 rounded-lg"
                        style={{
                          background: "rgba(109,40,217,0.12)",
                          color: "rgb(109,40,217)",
                        }}
                      >
                        {layoutSettings[field] ?? 32}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layoutSettings[field] ?? 32}
                      onChange={(e) =>
                        updateSettingField(
                          null,
                          field,
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: "rgb(109,40,217)" }}
                    />
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 font-sans">
                      <span>0px</span>
                      <span>100px</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paper size */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="size-3.5 text-violet-600" />
                  <span className="text-[13px] font-bold text-slate-700 font-bengali">
                    কাগজের সাইজ
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PAPER_SIZES_META.map((paper) => {
                    const isSelected = layoutSettings.paperSize === paper.id;
                    return (
                      <button
                        key={paper.id}
                        onClick={() =>
                          updateSettingField(null, "paperSize", paper.id)
                        }
                        className="flex flex-col items-center justify-center p-2 rounded-2xl transition cursor-pointer select-none"
                        style={
                          isSelected
                            ? {
                                background:
                                  "linear-gradient(135deg, rgba(109,40,217,0.10) 0%, rgba(79,70,229,0.10) 100%)",
                                border: "1.5px solid rgba(109,40,217,0.45)",
                                color: "rgb(109,40,217)",
                                boxShadow: "0 2px 12px rgba(109,40,217,0.15)",
                              }
                            : {
                                background: "rgba(248,248,255,0.8)",
                                border: "1.5px solid rgba(226,232,240,0.8)",
                                color: "#64748b",
                              }
                        }
                      >
                        <div
                          className="h-12 w-full flex items-center justify-center rounded-xl mb-1.5 overflow-hidden"
                          style={{
                            background: isSelected
                              ? "linear-gradient(135deg, rgba(109,40,217,0.06) 0%, rgba(79,70,229,0.06) 100%)"
                              : "rgba(241,245,249,0.8)",
                          }}
                        >
                          <div
                            className="rounded-sm shadow-sm"
                            style={{
                              width: `${paper.w}px`,
                              height: `${paper.h}px`,
                              background: "white",
                              border: isSelected
                                ? "1.5px solid rgba(109,40,217,0.4)"
                                : "1px solid rgba(203,213,225,0.8)",
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
