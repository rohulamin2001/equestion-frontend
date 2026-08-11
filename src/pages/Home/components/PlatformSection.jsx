import { ArrowRight } from "lucide-react";
import { PLATFORM_TOOLS } from "../data/landingContent";
import { SectionHeading } from "./ui";

export default function PlatformSection({ onStart }) {
  return (
    <section
      id="platform"
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6"
    >
      <div
        className="absolute inset-0"
        style={{ background: "var(--landing-cta-gradient)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-20 right-0 size-72 rounded-full blur-3xl opacity-40 bg-white/20"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 sm:space-y-10">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {PLATFORM_TOOLS.map((tool) => (
            <div
              key={tool}
              className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-3 py-4 sm:px-4 sm:py-5 text-center text-xs sm:text-sm font-bold text-white shadow-soft"
            >
              {tool}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex w-full sm:w-auto min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-soft transition hover:opacity-95 active:scale-[0.98] cursor-pointer font-bengali bg-white text-purple-900"
          >
            স্মার্ট প্রশ্নব্যাংক ব্যবহার শুরু করুন
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
