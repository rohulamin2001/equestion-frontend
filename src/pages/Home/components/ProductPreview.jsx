import { Check, CircleCheck, Download, Printer, ScanLine, Sparkles, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export default function ProductPreview() {
  const reduce = useReducedMotion();

  const float = reduce
    ? {}
    : {
        animate: { y: [0, -8, 0] },
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      };

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
      {/* Main Question Paper Card */}
      <motion.div
        {...float}
        className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl landing-glass-panel shadow-2xl shadow-purple-500/10"
      >
        {/* Top Header Bar */}
        <div
          className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/20"
          style={{ background: "var(--landing-hero-gradient)" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/40" />
              <span className="size-2.5 rounded-full bg-white/40" />
              <span className="size-2.5 rounded-full bg-white/40" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-primary-foreground font-bengali ml-1">
              প্রশ্নপত্র প্রিভিউ
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-white/95">
              <Download className="size-3" />
              PDF
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-white/95">
              <Printer className="size-3" />
              প্রিন্ট
            </div>
          </div>
        </div>

        {/* Question Paper Body */}
        <div className="p-4 sm:p-5 space-y-3.5 font-bengali bg-white/95 backdrop-blur-xl">
          {/* Paper Info Header */}
          <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-200">
            <p className="text-[10px] text-muted-foreground font-semibold tracking-wide">
              শ্রেণি: ৯ম–১০ম | বিষয়: গণিত | অধ্যায়: বীজগণিত
            </p>
            <p className="text-xs font-bold text-slate-700">
              সময়: ৩০ মিনিট | পূর্ণমান: ২৫
            </p>
          </div>

          {/* MCQ Question Preview */}
          <div className="space-y-2.5">
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              <span className="text-[var(--purple-700)] font-black">১।</span>{" "}
              কোনটি বীজগণিতীয় রাশি?
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {[
                { label: "ক", text: "2 + 3", selected: false },
                { label: "খ", text: "2x + 3", selected: true },
                { label: "গ", text: "5 × 7", selected: false },
                { label: "ঘ", text: "15 ÷ 3", selected: false },
              ].map((opt) => (
                <div
                  key={opt.label}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] sm:text-xs font-semibold transition-all duration-300 ${
                    opt.selected
                      ? "bg-emerald-50 border-2 border-emerald-400 text-emerald-800 shadow-sm shadow-emerald-100"
                      : "bg-slate-50/80 border border-slate-200/80 text-slate-600"
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                      opt.selected
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200/80 text-slate-500"
                    }`}
                  >
                    {opt.selected ? (
                      <Check className="size-3" />
                    ) : (
                      opt.label
                    )}
                  </span>
                  <span>{opt.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Second Question Preview (Faded) */}
          <div className="space-y-1.5 opacity-50">
            <p className="text-xs font-bold text-slate-700">
              <span className="text-[var(--purple-700)] font-black">২।</span>{" "}
              x² + 2x + 1 কে সংক্ষেপে লেখা যায়—
            </p>
            <div className="h-8 rounded-lg bg-slate-100/60 border border-slate-200/50" />
          </div>

          {/* Generate Button */}
          <button
            type="button"
            className="w-full min-h-10 sm:min-h-11 rounded-xl text-xs sm:text-sm font-bold text-primary-foreground shadow-soft cursor-default flex items-center justify-center gap-2"
            style={{ background: "var(--landing-hero-gradient)" }}
          >
            <Sparkles className="size-3.5" />
            ১-ক্লিকে PDF ডাউনলোডের জন্য প্রস্তুত
          </button>
        </div>
      </motion.div>

      {/* Floating Badge: OMR Auto-Grading */}
      <motion.div
        {...(reduce
          ? {}
          : {
              animate: { y: [0, 6, 0] },
              transition: {
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              },
            })}
        className="absolute -right-1 sm:-right-4 top-8 z-20 hidden xs:flex items-center gap-2 rounded-full landing-glass-chip px-3 py-2 text-[10px] sm:text-xs font-bold text-emerald-700 font-bengali shadow-lg shadow-emerald-500/10 border border-emerald-200/60"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <CircleCheck className="size-3.5 text-emerald-600" />
        প্রশ্নপত্র তৈরি সম্পন্ন
      </motion.div>

      {/* Floating Badge: OMR Scanner */}
      <motion.div
        {...(reduce
          ? {}
          : {
              animate: { y: [0, -5, 0] },
              transition: {
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              },
            })}
        className="absolute -left-1 sm:-left-3 bottom-24 z-20 hidden sm:flex items-center gap-2 rounded-full landing-glass-chip px-3 py-2 text-[10px] sm:text-xs font-bold text-purple-800 font-bengali shadow-lg shadow-purple-500/10 border border-purple-200/60"
      >
        <ScanLine className="size-3.5 text-[var(--purple-600)]" />
        OMR অটো-গ্রেডিং সম্পন্ন
      </motion.div>

      {/* Floating Badge: Live Metric */}
      <div className="absolute right-4 sm:right-8 -bottom-3 z-20 flex items-center gap-1.5 rounded-full landing-glass-chip px-3 py-2 text-[10px] sm:text-xs font-bold text-foreground font-bengali shadow-md border border-purple-100/60">
        <Zap className="size-3.5 text-amber-500" />
        ১০,০০০+ পেপার প্রস্তুত
      </div>
    </div>
  );
}
