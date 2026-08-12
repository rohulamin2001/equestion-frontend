import { ArrowRight } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./ui";

export default function CTASection({ onDemo, onSubscribe }) {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div
        className="absolute inset-0"
        style={{ background: "var(--landing-cta-gradient)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 top-0 size-56 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 size-64 rounded-full bg-white/15 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center space-y-5 sm:space-y-6 font-bengali">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-white leading-snug tracking-tight">
          প্রশ্নপত্র তৈরির পুরোনো পদ্ধতিকে বিদায় জানান।
        </h2>
        <p className="text-sm sm:text-base text-white/85 leading-relaxed">
          আজ থেকেই স্মার্টভাবে প্রশ্নপত্র তৈরি, পরীক্ষা ও মূল্যায়ন শুরু করুন।
        </p>
        <div className="flex flex-col xs:flex-row gap-3 justify-center">
          <SecondaryButton light className="w-full xs:w-auto" onClick={onDemo}>
            Demo দেখুন
          </SecondaryButton>
          <PrimaryButton
            className="w-full xs:w-auto"
            style={{ background: "var(--primary-foreground)", color: "var(--purple-900)" }}
            onClick={onSubscribe}
          >
            রেজিস্ট্রেশন করুন
            <ArrowRight className="size-4" />
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
