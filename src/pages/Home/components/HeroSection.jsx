import { ArrowRight, Camera, Printer, Sparkles, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import ProductPreview from "./ProductPreview";
import { PrimaryButton, SecondaryButton } from "./ui";

export default function HeroSection({ onDemo, onSubscribe }) {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24"
    >
      {/* Ambient Glow Orbs */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl opacity-80"
        style={{ background: "var(--landing-glow)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full blur-3xl opacity-70"
        style={{ background: "var(--landing-glow-soft)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--landing-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--landing-grid-color) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* Left Side: Text Content */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center lg:text-left space-y-5 sm:space-y-6"
        >
          {/* Shimmer Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-purple-50/90 px-3 py-1.5 text-[10px] xs:text-[11px] sm:text-xs font-bold text-purple-800 font-bengali shadow-sm backdrop-blur-sm">
            <Sparkles className="size-3.5 text-purple-600 shrink-0" />
            বাংলাদেশের ১ নম্বর প্রশ্নব্যাংক ও অটোমেটেড ওএমআর সিস্টেম
          </div>

          {/* Hero Headline */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-snug text-foreground font-bengali">
            প্রশ্নপত্র তৈরি ও OMR মূল্যায়ন
            <br />
            ঘণ্টার কাজ, এখন{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--landing-hero-gradient)" }}
            >
              মুহূর্তেই
            </span>
            ।
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-bengali">
            অধ্যায়ভিত্তিক প্রশ্নপত্র তৈরি, OMR তৈরি ও মূল্যায়ন, লেকচার শীট,
            ক্লাস রুটিন—সবকিছু এক প্ল্যাটফর্মে।
          </p>

          {/* Feature Bullet Chips */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {[
              {
                icon: Zap,
                text: "১-ক্লিকে অটো প্রশ্ন নির্বাচন",
                color: "text-amber-600",
              },
              {
                icon: Camera,
                text: "ওএমআর স্ক্যানার ও রেজাল্ট",
                color: "text-purple-700",
              },
              {
                icon: Printer,
                text: "প্রিন্ট-রেডি PDF",
                color: "text-emerald-700",
              },
            ].map((feat) => (
              <div
                key={feat.text}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/80 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-slate-700 font-bengali shadow-sm"
              >
                <feat.icon
                  className={`size-3 sm:size-3.5 ${feat.color} shrink-0`}
                />
                {feat.text}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-row gap-2 sm:gap-3 justify-center lg:justify-start">
            <PrimaryButton
              className="flex-1 sm:flex-none !min-h-9 sm:!min-h-11 !px-3 sm:!px-5 !py-2 sm:!py-2.5 !text-xs sm:!text-sm"
              onClick={onDemo}
            >
              ডেমো দেখুন
              <ArrowRight className="size-3.5 sm:size-4" />
            </PrimaryButton>
            <SecondaryButton
              className="flex-1 sm:flex-none !min-h-9 sm:!min-h-11 !px-3 sm:!px-5 !py-2 sm:!py-2.5 !text-xs sm:!text-sm"
              onClick={onSubscribe}
            >
              বিনামূল্যে ট্রায়াল শুরু করুন
            </SecondaryButton>
          </div>

          {/* Trust Line */}
          <p className="text-[11px] xs:text-xs sm:text-sm font-semibold text-muted-foreground font-bengali">
            শিক্ষক • কোচিং সেন্টার • শিক্ষা প্রতিষ্ঠান
          </p>
        </motion.div>

        {/* Right Side: Product Preview */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:[perspective:1200px]"
        >
          <div className="lg:[transform:rotateY(-6deg)_rotateX(2deg)]">
            <ProductPreview />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
