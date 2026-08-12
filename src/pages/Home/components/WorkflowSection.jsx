import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileDown,
  Filter,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { WORKFLOW_STEPS } from "../data/landingContent";

const ICON_MAP = {
  Filter,
  Wand2,
  FileDown,
  CheckCircle2,
};

const COLOR_CONFIG = {
  violet: {
    glow: "rgba(139, 92, 246, 0.18)",
    ring: "ring-violet-400/60",
    activeBg: "bg-violet-50",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
    connector: "from-violet-400 to-purple-400",
    highlight: "text-violet-700",
    iconBg: "from-violet-500 to-purple-600",
    accent: "#7c3aed",
    chipBg: "bg-violet-100/80 text-violet-700 border border-violet-200",
    chipActive: "bg-violet-600 text-white border-violet-600",
  },
  purple: {
    glow: "rgba(168, 85, 247, 0.18)",
    ring: "ring-purple-400/60",
    activeBg: "bg-purple-50",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    connector: "from-purple-400 to-indigo-400",
    highlight: "text-purple-700",
    iconBg: "from-purple-500 to-indigo-600",
    accent: "#9333ea",
    chipBg: "bg-purple-100/80 text-purple-700 border border-purple-200",
    chipActive: "bg-purple-600 text-white border-purple-600",
  },
  indigo: {
    glow: "rgba(99, 102, 241, 0.18)",
    ring: "ring-indigo-400/60",
    activeBg: "bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    connector: "from-indigo-400 to-blue-400",
    highlight: "text-indigo-700",
    iconBg: "from-indigo-500 to-blue-600",
    accent: "#4f46e5",
    chipBg: "bg-indigo-100/80 text-indigo-700 border border-indigo-200",
    chipActive: "bg-indigo-600 text-white border-indigo-600",
  },
  emerald: {
    glow: "rgba(16, 185, 129, 0.18)",
    ring: "ring-emerald-400/60",
    activeBg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    connector: "from-emerald-400 to-teal-400",
    highlight: "text-emerald-700",
    iconBg: "from-emerald-500 to-teal-600",
    accent: "#10b981",
    chipBg: "bg-emerald-100/80 text-emerald-700 border border-emerald-200",
    chipActive: "bg-emerald-600 text-white border-emerald-600",
  },
};

// Preview panel for each step
function StepPreviewPanel({ step, color }) {
  const cfg = COLOR_CONFIG[color];
  const [activeChip, setActiveChip] = useState(0);

  if (step.step === "01") {
    const chips = [
      step.preview.class,
      step.preview.subject,
      step.preview.chapter,
      step.preview.type,
    ];
    return (
      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-bengali">
          নির্বাচনের উদাহরণ
        </p>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip, i) => (
            <button
              key={chip}
              onClick={() => setActiveChip(i)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold font-bengali transition-all duration-200 cursor-pointer ${
                activeChip === i ? cfg.chipActive : cfg.chipBg
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
        <div
          className="rounded-2xl border border-border bg-white/60 p-4 space-y-3"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-bengali">
              নির্বাচিত প্রশ্ন
            </span>
            <span
              className="text-xl font-black font-bengali"
              style={{ color: cfg.accent }}
            >
              {step.preview.count}টি
            </span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: "70%",
                background: `linear-gradient(90deg, ${cfg.accent}, ${cfg.accent}aa)`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground font-bengali">
            ৩০টির মধ্যে ২১টি নির্বাচিত হয়েছে
          </p>
        </div>
      </div>
    );
  }

  if (step.step === "02") {
    return (
      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-bengali">
          প্রশ্নপত্রের বিবরণ
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "মোট প্রশ্ন", value: `${step.preview.total}টি` },
            { label: "MCQ", value: `${step.preview.mcq}টি` },
            { label: "CQ / সৃজনশীল", value: `${step.preview.cq}টি` },
            { label: "ইউনিক", value: step.preview.unique },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-white/60 p-3 text-center"
            >
              <p
                className="text-lg font-black font-bengali"
                style={{ color: cfg.accent }}
              >
                {value}
              </p>
              <p className="text-[10px] text-muted-foreground font-bengali mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
        <div
          className={`rounded-xl border border-border px-3.5 py-2.5 flex items-center gap-2.5 ${cfg.activeBg}`}
        >
          <Sparkles className="size-4 shrink-0" style={{ color: cfg.accent }} />
          <p
            className="text-xs font-bold font-bengali"
            style={{ color: cfg.accent }}
          >
            {step.preview.time}-এ প্রশ্নপত্র প্রস্তুত!
          </p>
        </div>
      </div>
    );
  }

  if (step.step === "03") {
    return (
      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-bengali">
          এক্সপোর্ট অপশন
        </p>
        <div
          className="rounded-2xl border border-border bg-white/70 overflow-hidden"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {/* Fake PDF header */}
          <div
            className="px-4 py-2.5 flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${cfg.accent}22, ${cfg.accent}11)`,
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="size-3.5" style={{ color: cfg.accent }} />
              <span className="text-xs font-bold" style={{ color: cfg.accent }}>
                প্রশ্নপত্র.pdf
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-bengali">
              {step.preview.pages}
            </span>
          </div>
          <div className="px-4 py-3 space-y-1.5">
            {[
              `ফরম্যাট: ${step.preview.format}`,
              `ওয়াটারমার্ক: ${step.preview.watermark}`,
              "লোগো: সংযুক্ত ✓",
              "বাংলা ফন্ট: সক্রিয় ✓",
            ].map((line) => (
              <div key={line} className="flex items-center gap-2">
                <div
                  className="size-1.5 rounded-full shrink-0"
                  style={{ background: cfg.accent }}
                />
                <span className="text-xs text-muted-foreground font-bengali">
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step.step === "04") {
    return (
      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-bengali">
          মূল্যায়ন ফলাফল
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "নির্ভুলতা",
              value: step.preview.accuracy,
              highlight: true,
            },
            { label: "স্ক্যান করা", value: `${step.preview.scanned}জন` },
            { label: "গড় স্কোর", value: step.preview.avgScore },
            { label: "সর্বোচ্চ", value: step.preview.topScore },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`rounded-xl border p-3 text-center ${
                highlight
                  ? `border-transparent ${cfg.activeBg}`
                  : "border-border bg-white/60"
              }`}
            >
              <p
                className="text-lg font-black font-bengali"
                style={{ color: highlight ? cfg.accent : undefined }}
              >
                {value}
              </p>
              <p className="text-[10px] text-muted-foreground font-bengali mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bengali">
            <span className="text-muted-foreground">OMR স্ক্যানিং সম্পন্ন</span>
            <span className="font-bold" style={{ color: cfg.accent }}>
              {step.preview.scanned}/{step.preview.scanned}
            </span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full w-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${cfg.accent}, ${cfg.accent}bb)`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
        setIsAnimating(false);
      }, 200);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleStepClick = (idx) => {
    if (idx === activeStep) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveStep(idx);
      setIsAnimating(false);
    }, 150);
  };

  const active = WORKFLOW_STEPS[activeStep];
  const cfg = COLOR_CONFIG[active.color];
  const ActiveIcon = ICON_MAP[active.icon];

  return (
    <section
      id="workflow"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-purple-50/30 pointer-events-none" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full blur-[120px] opacity-30 transition-all duration-1000"
        style={{ background: cfg.glow }}
        aria-hidden
      />
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#6d28d9 1px, transparent 1px), linear-gradient(to right, #6d28d9 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-purple-50 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-purple-800 font-bengali">
            <Sparkles className="size-3.5" />
            ধাপে ধাপে পুরো প্রক্রিয়া
          </span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight leading-snug text-foreground font-bengali">
            মাত্র কয়েকটি ধাপেই কাজ শেষ
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-bengali max-w-xl mx-auto">
            সহজ চারটি ধাপে প্রশ্নপত্র থেকে শুরু করে মূল্যায়ন পর্যন্ত সব কিছু
            সম্পন্ন করুন।
          </p>
        </div>

        {/* Step track (horizontal desktop / vertical mobile) */}
        <div className="relative flex flex-col lg:flex-row gap-3 lg:gap-0 mb-8 sm:mb-10">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            const isPast = idx < activeStep;
            const stepCfg = COLOR_CONFIG[step.color];
            const StepIcon = ICON_MAP[step.icon];

            return (
              <div
                key={step.step}
                className="relative flex-1 flex flex-col lg:flex-col items-start lg:items-center"
              >
                {/* Connector line (desktop) */}
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-7 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-0.5 z-0"
                    aria-hidden
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="absolute inset-0 rounded-full transition-all duration-700"
                        style={{
                          width: isPast || isActive ? "100%" : "0%",
                          background: `linear-gradient(90deg, ${stepCfg.accent}, ${
                            COLOR_CONFIG[WORKFLOW_STEPS[idx + 1].color].accent
                          })`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Connector line (mobile) */}
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div
                    className="lg:hidden absolute top-14 left-7 bottom-0 w-0.5 z-0"
                    aria-hidden
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="absolute top-0 left-0 right-0 rounded-full transition-all duration-700"
                        style={{
                          height: isPast ? "100%" : "0%",
                          background: `linear-gradient(180deg, ${stepCfg.accent}, ${
                            COLOR_CONFIG[WORKFLOW_STEPS[idx + 1].color].accent
                          })`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Step card button */}
                <button
                  onClick={() => handleStepClick(idx)}
                  className={`relative z-10 w-full lg:w-auto flex flex-row lg:flex-col items-center gap-4 lg:gap-2.5 rounded-2xl p-3.5 lg:p-4 transition-all duration-300 cursor-pointer text-left lg:text-center group ${
                    isActive
                      ? `${stepCfg.activeBg} ring-2 ${stepCfg.ring} shadow-lg`
                      : "hover:bg-slate-50/80 hover:shadow-md"
                  }`}
                >
                  {/* Icon circle */}
                  <div
                    className={`relative flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-all duration-300 ${
                      isActive ? "scale-110 shadow-lg" : "scale-100"
                    }`}
                    style={
                      isActive || isPast
                        ? {
                            background: `linear-gradient(135deg, ${stepCfg.accent}ee, ${stepCfg.accent}aa)`,
                            boxShadow: isActive
                              ? `0 0 24px ${stepCfg.accent}55, 0 4px 16px ${stepCfg.accent}33`
                              : undefined,
                          }
                        : { background: "#e2e8f0" }
                    }
                  >
                    <StepIcon
                      className={`size-6 transition-colors duration-300 ${
                        isActive || isPast ? "text-white" : "text-slate-400"
                      }`}
                    />
                    {/* Step number badge — top-right corner */}
                    <span
                      className="absolute  -top-2 -right-2 flex pt-1 size-5 items-center justify-center rounded-full text-[9px] font-black border border-white shadow-sm"
                      style={
                        isActive || isPast
                          ? { background: stepCfg.accent, color: "white" }
                          : { background: "#94a3b8", color: "white" }
                      }
                    >
                      {step.step.replace("0", "")}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 lg:flex-none">
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 font-bengali transition-colors duration-300 ${
                        isActive ? stepCfg.highlight : "text-muted-foreground"
                      }`}
                    >
                      {step.badge}
                    </p>
                    <h3
                      className={`text-sm sm:text-base font-bold font-bengali leading-snug transition-colors duration-300 ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>

                  {/* Mobile chevron */}
                  <ChevronRight
                    className={`size-4 shrink-0 lg:hidden transition-all duration-300 ${
                      isActive
                        ? `${stepCfg.highlight} opacity-100`
                        : "text-muted-foreground opacity-40"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Active step detail panel */}
        <div
          className={`transition-all duration-200 ${
            isAnimating
              ? "opacity-0 translate-y-2"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div
            className="rounded-3xl border border-border bg-glass-elevated shadow-2xl overflow-hidden"
            style={{
              backdropFilter: "blur(20px)",
              boxShadow: `0 4px 40px ${cfg.glow}, 0 1px 3px rgba(0,0,0,0.08)`,
            }}
          >
            {/* Glowing top bar */}
            <div
              className="h-1 w-full"
              style={{
                background: `linear-gradient(90deg, ${cfg.accent}dd, ${cfg.accent}55, transparent)`,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
              {/* Left: Step info */}
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}bb)`,
                      boxShadow: `0 0 32px ${cfg.accent}44`,
                    }}
                  >
                    <ActiveIcon className="size-7" />
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold font-bengali mb-1.5 ${cfg.badge}`}
                    >
                      ধাপ {active.step}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground font-bengali leading-snug">
                      {active.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-bengali mt-1">
                      {active.description}
                    </p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2.5">
                  {active.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-3">
                      <div
                        className={`mt-1.5 size-1.5 shrink-0 rounded-full ${cfg.dot}`}
                      />
                      <p className="text-sm text-muted-foreground font-bengali leading-relaxed">
                        {h}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Step progress dots */}
                <div className="flex items-center gap-2 pt-2">
                  {WORKFLOW_STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleStepClick(i)}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        i === activeStep
                          ? "w-6 h-2"
                          : "size-2 opacity-40 hover:opacity-70"
                      }`}
                      style={{
                        background: i === activeStep ? cfg.accent : "#94a3b8",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Interactive preview */}
              <div className="p-6 sm:p-8">
                <StepPreviewPanel step={active} color={active.color} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
