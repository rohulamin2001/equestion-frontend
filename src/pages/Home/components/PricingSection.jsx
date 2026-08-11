import { Check } from "lucide-react";
import { PRICING_PLANS } from "../data/landingContent";
import { PrimaryButton, SecondaryButton, SectionHeading } from "./ui";

export default function PricingSection({ onRegister, onContact }) {
  const ordered = [
    ...PRICING_PLANS.filter((p) => p.popular),
    ...PRICING_PLANS.filter((p) => !p.popular),
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8 sm:space-y-10">
        <SectionHeading title="আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {ordered.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl sm:rounded-3xl border p-5 sm:p-6 shadow-soft font-bengali transition ${
                plan.popular
                  ? "border-purple-300 ring-2 ring-purple-200/80 bg-glass-elevated lg:-translate-y-2"
                  : "border-border bg-white/80"
              }`}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-soft"
                  style={{ background: "var(--landing-hero-gradient)" }}
                >
                  সবচেয়ে জনপ্রিয়
                </span>
              )}
              <h3 className="text-lg font-black text-foreground">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{plan.audience}</p>
              <p className="mt-4 text-2xl font-black text-purple-800">{plan.price}</p>
              <ul className="mt-5 mb-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {plan.action === "contact" ? (
                <SecondaryButton className="w-full" onClick={onContact}>
                  {plan.cta}
                </SecondaryButton>
              ) : (
                <PrimaryButton className="w-full" onClick={onRegister}>
                  {plan.cta}
                </PrimaryButton>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
