import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { FAQ_ITEMS } from "../data/landingContent";
import { SectionHeading } from "./ui";

function FaqItem({ item, open, onToggle }) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="rounded-2xl border border-border bg-glass-elevated shadow-soft overflow-hidden">
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full min-h-12 items-center justify-between gap-3 px-4 sm:px-5 py-4 text-left cursor-pointer font-bengali"
      >
        <span className="text-sm sm:text-base font-bold text-foreground">{item.q}</span>
        <ChevronDown
          className={`size-5 shrink-0 text-purple-700 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-4 sm:px-5 pb-4 text-sm text-muted-foreground leading-relaxed font-bengali">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <SectionHeading title="সচরাচর জিজ্ঞাসা" />
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
