import { useEffect, useRef, useState } from "react";
import { SAMPLE_QUOTES, TRUST_STATS } from "../data/landingContent";
import { SectionHeading } from "./ui";

function StatCounter({ value, suffix, label }) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduceMotion) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1200;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          setDisplay(Math.floor(value * t));
          if (t < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, reduceMotion]);

  const shown = reduceMotion ? value : display;

  return (
    <div ref={ref} className="text-center font-bengali">
      <p
        className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent"
        style={{ backgroundImage: "var(--landing-hero-gradient)" }}
      >
        {shown.toLocaleString("bn-BD")}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground font-semibold">
        {label}
      </p>
    </div>
  );
}

export default function TrustSection() {
  return (
    <section
      id="trust"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-7xl space-y-8 sm:space-y-10">
        <SectionHeading title="শিক্ষা ব্যবস্থাপনায় প্রযুক্তির স্মার্ট সমাধান" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 rounded-2xl sm:rounded-3xl border border-border bg-glass-elevated p-6 sm:p-8 shadow-soft">
          {TRUST_STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {SAMPLE_QUOTES.map((item) => (
            <blockquote
              key={item.quote}
              className="rounded-2xl border border-border bg-glass-elevated p-5 sm:p-6 shadow-soft font-bengali"
            >
              <p className="text-sm sm:text-base text-foreground leading-relaxed">
                “{item.quote}”
              </p>
              <footer className="mt-3 text-xs font-semibold text-muted-foreground">
                {item.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
