import { ArrowRight, Check } from "lucide-react";
import { QGEN_BULLETS } from "../data/landingContent";
import { PrimaryButton, SectionHeading } from "./ui";

export default function QuestionGeneratorSection({ onStart }) {
  return (
    <section id="question-generator" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl grid gap-8 lg:gap-12 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1 rounded-2xl sm:rounded-3xl border border-border bg-glass-elevated p-4 sm:p-6 shadow-soft overflow-hidden">
          <div
            className="rounded-xl px-4 py-3 mb-4 text-sm font-bold text-primary-foreground font-bengali"
            style={{ background: "var(--landing-hero-gradient)" }}
          >
            প্রশ্নপত্র বিল্ডার
          </div>
          <div className="space-y-2.5 font-bengali text-sm">
            {["শ্রেণি নির্বাচন", "বিষয় ও অধ্যায়", "MCQ / CQ মিশ্রণ", "Difficulty + Board filter"].map(
              (row) => (
                <div
                  key={row}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-3 py-2.5"
                >
                  <span className="text-muted-foreground">{row}</span>
                  <span className="size-2 rounded-full bg-purple-500" />
                </div>
              ),
            )}
            <div className="rounded-xl border border-dashed border-purple-200 bg-purple-50/60 p-4 text-center text-xs text-purple-800 font-semibold">
              Generate → PDF Ready Preview
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 space-y-5">
          <SectionHeading
            align="left"
            title="প্রশ্নপত্র তৈরি এখন আর ঘণ্টার কাজ নয়।"
            description="শ্রেণি, বিষয়, অধ্যায়, টপিক ও প্রশ্নের ধরন নির্বাচন করে কয়েকটি ক্লিকেই তৈরি করুন আপনার কাঙ্ক্ষিত প্রশ্নপত্র।"
          />
          <ul className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
            {QGEN_BULLETS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-foreground font-bengali"
              >
                <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <PrimaryButton className="w-full sm:w-auto" onClick={onStart}>
            প্রশ্নপত্র তৈরি করুন
            <ArrowRight className="size-4" />
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
