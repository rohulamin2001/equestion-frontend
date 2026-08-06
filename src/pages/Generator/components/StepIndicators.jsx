import { CheckCircle2 } from "lucide-react";

const STEPS = [
  { num: "১", label: "তথ্য ও শ্রেণি" },
  { num: "২", label: "বিষয় ও অধ্যায়" },
  { num: "৩", label: "টাইপ ও নম্বর" },
];

export function StepIndicators({ activeStep }) {
  return (
    <div className="flex items-center justify-center gap-0 overflow-x-auto py-1 font-sans">
      {STEPS.map((step, idx) => {
        const isDone = idx < activeStep;
        const isActive = idx === activeStep;
        return (
          <div key={idx} className="flex items-center shrink-0">
            <div
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-300 ${
                isDone
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : isActive
                    ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs"
                    : "bg-slate-50 text-slate-400 border border-slate-200"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="size-3 sm:size-3.5 text-emerald-600 shrink-0" />
              ) : (
                <span
                  className={`size-3.5 sm:size-4 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-semibold shrink-0 ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step.num}
                </span>
              )}
              <span className="whitespace-nowrap">{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-3 sm:w-6 h-px mx-0.5 sm:mx-1 transition-all duration-300 ${
                  idx < activeStep ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
