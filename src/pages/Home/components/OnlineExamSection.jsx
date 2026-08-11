import { Check, Clock } from "lucide-react";
import { EXAM_BULLETS } from "../data/landingContent";
import { SectionHeading } from "./ui";

export default function OnlineExamSection() {
  return (
    <section id="exam" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl grid gap-8 lg:gap-12 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1 rounded-2xl sm:rounded-3xl border border-border bg-glass-elevated shadow-soft overflow-hidden font-bengali">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/50">
            <div>
              <p className="text-sm font-bold text-foreground">গণিত — অধ্যায় পরীক্ষা</p>
              <p className="text-[11px] text-muted-foreground">MCQ • ২০ প্রশ্ন</p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-800">
              <Clock className="size-3.5" />
              14:32
            </div>
          </div>
          <div className="p-4 sm:p-5 space-y-4">
            <p className="text-sm font-semibold text-foreground">
              ৩. দ্বিঘাত সমীকরণের সমাধান কীভাবে নির্ণয় করা যায়?
            </p>
            <div className="space-y-2">
              {["সূত্র প্রয়োগ করে", "লেখচিত্র দিয়ে", "উভয় পদ্ধতিতে", "কোনোটিই নয়"].map(
                (opt, i) => (
                  <div
                    key={opt}
                    className={`rounded-xl border px-3 py-2.5 text-sm ${
                      i === 2
                        ? "border-purple-300 bg-purple-50 text-purple-900 font-semibold"
                        : "border-border bg-white text-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </div>
                ),
              )}
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`size-2 rounded-full ${i < 3 ? "bg-purple-600" : "bg-muted"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="min-h-10 rounded-xl px-4 text-xs font-bold text-primary-foreground cursor-default"
                style={{ background: "var(--landing-hero-gradient)" }}
              >
                সাবমিট
              </button>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 space-y-5">
          <SectionHeading
            align="left"
            title="অনলাইন পরীক্ষা নিন, ফলাফল দেখুন মুহূর্তেই।"
            description="ব্যাচভিত্তিক সিকিউর পরীক্ষা, অটো রেজাল্ট এবং পারফরম্যান্স অ্যানালিটিক্স একসাথে।"
          />
          <ul className="space-y-2.5">
            {EXAM_BULLETS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-foreground font-bengali"
              >
                <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
