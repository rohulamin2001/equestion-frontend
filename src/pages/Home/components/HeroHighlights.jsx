import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { HERO_HIGHLIGHTS } from "../data/landingContent";

export default function HeroHighlights() {
  const reduce = useReducedMotion();

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 -mt-2 sm:-mt-4 mb-12 sm:mb-16">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[min(90vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-70"
        style={{ background: "var(--landing-glow-soft)" }}
        aria-hidden
      />

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {HERO_HIGHLIGHTS.map((item, index) => {
          const isLast = index === HERO_HIGHLIGHTS.length - 1;

          return (
            <div key={item.id} className="relative flex flex-col items-center">
              <motion.article
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={reduce ? undefined : { y: -5 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="group relative w-full h-full rounded-3xl bg-white/85 backdrop-blur-xl border border-purple-100/90 sm:border-slate-200/80 p-5 sm:p-6 transition-all duration-300 font-bengali shadow-md shadow-purple-500/5 lg:shadow-sm lg:hover:shadow-2xl lg:hover:shadow-purple-500/15 lg:hover:border-purple-300/90 flex items-center overflow-hidden"
              >
                {/* Subtle top accent gradient line on hover */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-80 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[var(--purple-700)] via-[var(--purple-600)] to-indigo-600"
                  aria-hidden
                />

                {/* Ambient Soft Glow on Hover */}
                <div
                  className="pointer-events-none absolute -right-10 -bottom-10 size-36 rounded-full bg-purple-500/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  aria-hidden
                />

                {/* Left Side: Step Numeral in Brand Purple Gradient Badge */}
                <div className="flex items-center justify-center shrink-0 size-12 sm:size-14 rounded-2xl bg-purple-50/90 border border-purple-100/80 shadow-sm group-hover:scale-105 group-hover:bg-purple-100/60 transition-all duration-300">
                  <span
                    className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent leading-none select-none font-bengali drop-shadow-sm"
                    style={{ backgroundImage: "var(--landing-hero-gradient)" }}
                  >
                    {item.step}
                  </span>
                </div>

                {/* Vertical Gradient Divider */}
                <div className="h-10 sm:h-12 w-0.5 rounded-full bg-gradient-to-b from-purple-200/90 via-purple-300/70 to-purple-100/90 mx-3.5 sm:mx-4 shrink-0" />

                {/* Right Side: Bold Bengali Text Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800 leading-relaxed font-bengali group-hover:text-purple-950 transition-colors duration-200">
                    {item.text}
                  </p>
                </div>
              </motion.article>

              {/* Connecting Desktop Arrow Badge between cards */}
              {!isLast && (
                <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white/95 backdrop-blur-md border border-purple-200/90 shadow-md ring-2 ring-purple-50 items-center justify-center text-[var(--purple-700)] pointer-events-none transition-transform duration-300 group-hover:scale-110">
                  <ChevronRight className="size-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
