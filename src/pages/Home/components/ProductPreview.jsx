import { Check, FileText, Sparkles } from "lucide-react";
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
      <motion.div
        {...float}
        className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl border border-[color:var(--landing-glass-border)] bg-white/90 shadow-soft backdrop-blur-xl"
      >
        <div
          className="flex items-center gap-2 px-4 py-3 border-b border-border"
          style={{ background: "var(--landing-hero-gradient)" }}
        >
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/40" />
            <span className="size-2.5 rounded-full bg-white/40" />
            <span className="size-2.5 rounded-full bg-white/40" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-primary-foreground font-bengali ml-1">
            প্রশ্নপত্র তৈরি করুন
          </p>
        </div>

        <div className="p-4 sm:p-5 space-y-3 font-bengali">
          {[
            ["শ্রেণি", "৯ম–১০ম"],
            ["বিষয়", "গণিত"],
            ["অধ্যায়", "বীজগণিত"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-xs sm:text-sm"
            >
              <span className="text-muted-foreground font-semibold">{label}</span>
              <span className="font-bold text-foreground">{value}</span>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-purple-200/70 bg-purple-50 px-3 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground font-semibold">MCQ</p>
              <p className="text-lg font-black text-purple-800">২০</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground font-semibold">CQ</p>
              <p className="text-lg font-black text-foreground">৫</p>
            </div>
          </div>

          <button
            type="button"
            className="w-full min-h-11 rounded-xl text-sm font-bold text-primary-foreground shadow-soft cursor-default"
            style={{ background: "var(--landing-hero-gradient)" }}
          >
            প্রশ্নপত্র তৈরি করুন
          </button>
        </div>
      </motion.div>

      <motion.div
        {...(reduce
          ? {}
          : {
              animate: { y: [0, 6, 0] },
              transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
            })}
        className="absolute -right-1 sm:-right-4 top-8 z-20 hidden xs:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-emerald-700 shadow-soft font-bengali"
      >
        <Check className="size-3.5" />
        প্রশ্নপত্র তৈরি হয়েছে
      </motion.div>

      <motion.div
        {...(reduce
          ? {}
          : {
              animate: { y: [0, -5, 0] },
              transition: { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
            })}
        className="absolute -left-1 sm:-left-3 bottom-24 z-20 hidden sm:flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-purple-800 shadow-soft font-bengali"
      >
        <Sparkles className="size-3.5" />
        OMR মূল্যায়ন সম্পন্ন
      </motion.div>

      <div className="absolute right-4 sm:right-8 -bottom-3 z-20 flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-foreground shadow-soft font-bengali">
        <FileText className="size-3.5 text-purple-700" />
        PDF Ready
      </div>
    </div>
  );
}
