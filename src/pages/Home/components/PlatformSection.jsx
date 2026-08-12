import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  FileQuestion,
  Laptop,
  Library,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import platformBg from "../../../assets/landing/platform-bg.png";
import { PLATFORM_TOOLS_DATA } from "../data/landingContent";
import { SectionHeading } from "./ui";

const ICON_MAP = {
  FileQuestion,
  ScanLine,
  Laptop,
  BookOpen,
  CalendarClock,
  Library,
};

export default function PlatformSection({ onStart }) {
  const reduce = useReducedMotion();

  return (
    <section
      id="platform"
      className="relative overflow-hidden py-14 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6"
    >
      {/* Base CTA Gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--landing-cta-gradient)" }}
        aria-hidden
      />

      {/* Educational Background Image Layer (Unblurred & Transparent) */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay transition-all duration-700"
        style={{ backgroundImage: `url(${platformBg})` }}
        aria-hidden
      />

      {/* Ambient Background Glowing Orbs for Glass Reflection */}
      <div
        className="pointer-events-none absolute -top-24 -left-20 size-96 rounded-full blur-3xl opacity-50 bg-purple-400/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 -right-24 size-[420px] -translate-y-1/2 rounded-full blur-3xl opacity-40 bg-pink-400/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/3 size-80 rounded-full blur-3xl opacity-40 bg-indigo-400/30"
        aria-hidden
      />

      {/* Sharp Grid Pattern Background Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.25) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse at center, black 50%, transparent 85%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10 sm:space-y-12">
        <SectionHeading
          light
          title={
            <>
              আপনার শিক্ষা প্রতিষ্ঠানের
              <br />
              প্রয়োজনীয় সব টুল এক প্ল্যাটফর্মে।
            </>
          }
        />

        {/* 6 Modern Glassmorphic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {PLATFORM_TOOLS_DATA.map((tool, index) => {
            const Icon = ICON_MAP[tool.icon] ?? Sparkles;
            return (
              <motion.div
                key={tool.id}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/25 bg-white/14 p-6 sm:p-7 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/24 hover:border-white/40 hover:shadow-purple-950/30 font-bengali"
              >
                {/* Top Glassmorphic Shine Line */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-60 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />

                {/* Subtle Ambient Radial Glow on Hover */}
                <div
                  className="pointer-events-none absolute -right-10 -bottom-10 size-40 rounded-full bg-white/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  aria-hidden
                />

                <div className="space-y-4 relative z-10">
                  {/* Top Glassmorphic Icon Badge & Feature Tag */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-white shadow-lg ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-6 text-white" aria-hidden />
                    </div>

                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold text-white/90 bg-white/15 border border-white/20 backdrop-blur-md">
                      {tool.badge}
                    </span>
                  </div>

                  {/* Card Title & English Subtitle */}
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                      {tool.title}
                    </h3>
                    <p className="text-[11px] font-medium text-white/70 uppercase tracking-wider font-sans">
                      {tool.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
                    {tool.description}
                  </p>
                </div>

                {/* Card Footer Indicator */}
                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-white/70 group-hover:text-white transition-colors duration-200 relative z-10">
                  <span>এক্সপ্লোর করুন</span>
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex w-full sm:w-auto min-h-12 items-center justify-center gap-2.5 rounded-2xl px-7 py-3 text-sm sm:text-base font-bold shadow-xl shadow-purple-950/20 transition-all hover:bg-white/95 hover:shadow-2xl active:scale-[0.98] cursor-pointer font-bengali bg-white text-purple-900"
          >
            স্মার্ট প্রশ্নব্যাংক ব্যবহার শুরু করুন
            <ArrowRight className="size-4 sm:size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
