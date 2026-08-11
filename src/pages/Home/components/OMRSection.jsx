import { Check } from "lucide-react";
import { OMR_BULLETS } from "../data/landingContent";
import { SectionHeading } from "./ui";

export default function OMRSection() {
  return (
    <section id="omr" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-muted/40">
      <div className="mx-auto max-w-7xl grid gap-8 lg:gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <SectionHeading
            align="left"
            title="OMR মূল্যায়ন হবে আরও সহজ।"
            description="OMR শিট তৈরি, স্ক্যান এবং ফলাফল বিশ্লেষণ—পুরো প্রক্রিয়াটি করুন দ্রুত ও নির্ভুলভাবে।"
          />
          <ul className="space-y-2.5">
            {OMR_BULLETS.map((item) => (
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-soft font-bengali">
            <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">
              OMR Sheet
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md border border-border bg-muted/60 flex items-center justify-center text-[9px] text-muted-foreground"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-purple-200/80 bg-glass-elevated p-4 sm:p-5 shadow-soft font-bengali">
            <p className="text-sm font-bold text-foreground mb-4">OMR Result</p>
            <div className="space-y-3 text-sm">
              {[
                ["সঠিক", "72", "w-[72%]"],
                ["ভুল", "18", "w-[18%]"],
                ["ফাঁকা", "10", "w-[10%]"],
              ].map(([label, val, width]) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-bold text-foreground">{val}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${width}`}
                      style={{ background: "var(--landing-hero-gradient)" }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border flex justify-between font-bold">
                <span>স্কোর</span>
                <span className="text-purple-800">67.50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
