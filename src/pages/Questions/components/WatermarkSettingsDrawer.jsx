import {
  AlignLeft,
  Eye,
  Image as ImageIcon,
  RotateCw,
  Sliders,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

export default function WatermarkSettingsDrawer({
  isOpen,
  onClose,
  layoutSettings,
  updateSettingField,
}) {
  const watermark = layoutSettings?.watermarkSettings || {
    type: "text",
    text: "গভর্নমেন্ট হাই স্কুল",
    imageUrl: null,
    opacity: 15,
    fontSize: 48,
    imageWidth: 200,
    rotation: -30,
    color: "#94a3b8",
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ফাইলের সাইজ ৫ MB এর কম হতে হবে");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        updateSettingField("watermarkSettings", "imageUrl", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const COLOR_PRESETS = [
    { label: "গ্রে", value: "#94a3b8" },
    { label: "ডিপ গ্রে", value: "#475569" },
    { label: "ইনডিগো", value: "#6366f1" },
    { label: "পার্পল", value: "#8b5cf6" },
    { label: "ডার্ক", value: "#1e293b" },
    { label: "রেড", value: "#e11d48" },
  ];

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
              boxShadow:
                "0 -20px 60px -10px rgba(109,40,217,0.22), 0 -4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Fixed Top Section: Gradient header + drag handle */}
            <div className="shrink-0 relative z-10">
              {/* Gradient header */}
              <div
                className="relative flex items-center justify-between px-6 pt-5 pb-4 select-none"
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
                    <ImageIcon className="size-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-white leading-tight font-bengali tracking-tight">
                      জলছাপ সেটিংস
                    </h3>
                    <p className="text-white/70 text-[11px] font-medium leading-tight font-bengali">
                      প্রশ্নপত্রের ব্যাকগ্রাউন্ড জলছাপ (Watermark) কাস্টমাইজ
                      করুন
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none"
                  title="বন্ধ করুন"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-slate-300/70" />
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(88vh-76px)] custom-scrollbar font-bengali">
              {/* Watermark Type Selector (Text vs Image) */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Sliders className="size-4 text-indigo-600" />
                  জলছাপের ধরন (Type)
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() =>
                      updateSettingField("watermarkSettings", "type", "text")
                    }
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition cursor-pointer ${
                      watermark.type === "text"
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Type className="size-4" />
                    লেখা (Text)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateSettingField("watermarkSettings", "type", "image")
                    }
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition cursor-pointer ${
                      watermark.type === "image"
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <ImageIcon className="size-4" />
                    ছবি/লোগো (Image)
                  </button>
                </div>
              </div>

              {/* Text Mode Section */}
              {watermark.type === "text" && (
                <div className="space-y-5 bg-white/80 p-4 rounded-2xl border border-slate-200/70 shadow-sm">
                  {/* Watermark Text Input */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <AlignLeft className="size-4 text-indigo-600" />
                        জলছাপের লেখা (Watermark Text)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={watermark.text || ""}
                      onChange={(e) =>
                        updateSettingField(
                          "watermarkSettings",
                          "text",
                          e.target.value,
                        )
                      }
                      placeholder="যেমন: গভর্নমেন্ট হাই স্কুল"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300/80 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 font-medium"
                    />
                  </div>

                  {/* Font Size Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-bold text-slate-700">
                        ফন্ট সাইজ (Font Size)
                      </label>
                      <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                        {watermark.fontSize || 48}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      step="2"
                      value={watermark.fontSize || 48}
                      onChange={(e) =>
                        updateSettingField(
                          "watermarkSettings",
                          "fontSize",
                          Number(e.target.value),
                        )
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Text Color Presets */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700">
                      লেখার কালার (Text Color)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() =>
                            updateSettingField(
                              "watermarkSettings",
                              "color",
                              preset.value,
                            )
                          }
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition cursor-pointer ${
                            watermark.color === preset.value
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold"
                              : "border-slate-200/80 bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <span
                            className="size-3.5 rounded-full border border-black/20"
                            style={{ background: preset.value }}
                          />
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Image Mode Section */}
              {watermark.type === "image" && (
                <div className="space-y-5 bg-white/80 p-4 rounded-2xl border border-slate-200/70 shadow-sm">
                  {/* Upload Image Field */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="size-4 text-indigo-600" />
                        জলছাপের ইমেজ / লোগো (Image Upload)
                      </span>
                    </label>

                    {watermark.imageUrl ? (
                      <div className="flex items-center justify-between p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/80">
                        <div className="flex items-center gap-3">
                          <img
                            src={watermark.imageUrl}
                            alt="Watermark Preview"
                            className="size-12 object-contain rounded-lg border border-slate-200 bg-white"
                          />
                          <div>
                            <p className="text-[13px] font-bold text-slate-800">
                              জলছাপ ছবি লোড হয়েছে
                            </p>
                            <p className="text-[11px] text-slate-500">
                              কাস্টম আপলোড করা ইমেজ
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateSettingField(
                              "watermarkSettings",
                              "imageUrl",
                              null,
                            )
                          }
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer border border-rose-200/60"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-5 bg-slate-50 hover:bg-indigo-50/40 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl cursor-pointer transition">
                        <Upload className="size-6 text-indigo-600 mb-1.5" />
                        <span className="text-[13px] font-bold text-slate-700">
                          ছবি আপলোড করতে ক্লিক করুন
                        </span>
                        <span className="text-[11px] text-slate-500">
                          PNG, JPG বা SVG (সর্বোচ্চ 5 MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Image Width Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-bold text-slate-700">
                        ইমেজের সাইজ / প্রস্থ (Image Width)
                      </label>
                      <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                        {watermark.imageWidth || 200}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="450"
                      step="5"
                      value={watermark.imageWidth || 200}
                      onChange={(e) =>
                        updateSettingField(
                          "watermarkSettings",
                          "imageWidth",
                          Number(e.target.value),
                        )
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* Common Settings: Rotation (এঙ্গেল/বাঁকানো) & Opacity (স্পষ্টতা) */}
              <div className="space-y-5 bg-white/80 p-4 rounded-2xl border border-slate-200/70 shadow-sm">
                {/* Rotation Angle Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                      <RotateCw className="size-4 text-indigo-600" />
                      রোটেশন / বাঁকানো কোণ (Rotation Angle)
                    </label>
                    <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                      {watermark.rotation ?? -30}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="5"
                    value={watermark.rotation ?? -30}
                    onChange={(e) =>
                      updateSettingField(
                        "watermarkSettings",
                        "rotation",
                        Number(e.target.value),
                      )
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  {/* Preset angle buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {[-45, -30, 0, 30, 45].map((angle) => (
                      <button
                        key={angle}
                        type="button"
                        onClick={() =>
                          updateSettingField(
                            "watermarkSettings",
                            "rotation",
                            angle,
                          )
                        }
                        className={`flex-1 py-1 rounded text-[11px] font-bold transition border cursor-pointer ${
                          (watermark.rotation ?? -30) === angle
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-slate-100 text-slate-600 border-slate-200/80 hover:bg-slate-200"
                        }`}
                      >
                        {angle === 0 ? "সোজা (0°)" : `${angle}°`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacity / Clarity Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Eye className="size-4 text-indigo-600" />
                      অস্বচ্ছতা / স্পষ্টতা (Opacity)
                    </label>
                    <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                      {watermark.opacity ?? 15}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={watermark.opacity ?? 15}
                    onChange={(e) =>
                      updateSettingField(
                        "watermarkSettings",
                        "opacity",
                        Number(e.target.value),
                      )
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  {/* Preset opacity buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {[10, 15, 25, 50, 100].map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() =>
                          updateSettingField("watermarkSettings", "opacity", op)
                        }
                        className={`flex-1 py-1 rounded text-[11px] font-bold transition border cursor-pointer ${
                          (watermark.opacity ?? 15) === op
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-slate-100 text-slate-600 border-slate-200/80 hover:bg-slate-200"
                        }`}
                      >
                        {op}%
                      </button>
                    ))}
                  </div>
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
