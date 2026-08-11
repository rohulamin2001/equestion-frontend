import {
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  FileQuestion,
  Library,
  ScanLine,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { FEATURES } from "../data/landingContent";
import { SectionHeading } from "./ui";

const ICONS = {
  FileQuestion,
  ScanLine,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  Library,
};

export default function FeatureGrid() {
  const reduce = useReducedMotion();

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8 sm:space-y-10">
        <SectionHeading
          title="পেপারলেস স্মার্ট প্রশ্নব্যাংকে যা যা পাচ্ছেন"
          description="প্রশ্নপত্র তৈরি থেকে শুরু করে পরীক্ষা পরিচালনা—প্রয়োজনীয় সবকিছু এখন একটি প্ল্যাটফর্মে।"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((feat, idx) => {
            const Icon = ICONS[feat.icon] || FileQuestion;
            return (
              <motion.article
                key={feat.id}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: idx * 0.05, duration: 0.35 }}
                className={`group rounded-2xl border border-border bg-glass-elevated p-5 sm:p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-soft-hover ${
                  feat.span ? "lg:col-span-2" : ""
                }`}
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-purple-200/70 bg-purple-50 text-purple-700">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground font-bengali mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-bengali">
                  {feat.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
