import {
  CheckCircle2,
  Database,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { HERO_HIGHLIGHTS } from "../data/landingContent";

const ICON_MAP = {
  ShieldCheck,
  Zap,
  Database,
  CheckCircle2,
};

export default function HeroHighlights() {
  const reduce = useReducedMotion();

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 -mt-4 mb-12 sm:mb-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-70"
        style={{ background: "var(--landing-glow-soft)" }}
        aria-hidden
      />

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {HERO_HIGHLIGHTS.map((item, index) => {
          const Icon = ICON_MAP[item.icon] ?? ShieldCheck;

          return (
            <motion.article
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={reduce ? undefined : { y: -6 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="landing-highlight-tile group relative flex h-full flex-col overflow-hidden rounded-3xl px-5 py-8 sm:px-6 sm:py-9 lg:py-10 font-bengali shadow-soft shadow-soft-hover"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "var(--landing-highlight-glow)" }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-55 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "var(--landing-hero-gradient)" }}
                aria-hidden
              />

              <div className="relative z-10 flex h-full flex-col items-center text-center gap-5 sm:items-start sm:text-left sm:gap-5">
                <div
                  className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl text-primary-foreground shadow-soft ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "var(--landing-hero-gradient)" }}
                >
                  <Icon className="size-5 sm:size-6" aria-hidden />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
