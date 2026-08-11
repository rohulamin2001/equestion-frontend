import { WORKFLOW_STEPS } from "../data/landingContent";
import { SectionHeading } from "./ui";

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-8 sm:space-y-10">
        <SectionHeading title="মাত্র কয়েকটি ধাপেই কাজ শেষ" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {WORKFLOW_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-border bg-glass-elevated p-5 shadow-soft font-bengali"
            >
              <div
                className="mb-4 flex size-10 items-center justify-center rounded-full text-sm font-black text-primary-foreground shadow-soft"
                style={{ background: "var(--landing-hero-gradient)" }}
              >
                {step.step}
              </div>
              {idx < WORKFLOW_STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-9 left-[calc(100%-0.5rem)] w-[calc(100%-2rem)] h-px bg-purple-200"
                  aria-hidden
                />
              )}
              <h3 className="text-base font-bold text-foreground mb-1.5">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
