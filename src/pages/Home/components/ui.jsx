export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}) {
  const alignClass =
    align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <div className={`flex flex-col gap-3 max-w-3xl ${alignClass} ${align === "center" ? "mx-auto" : ""}`}>
      {eyebrow && (
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-[11px] sm:text-xs font-bold font-bengali ${
            light
              ? "border-white/20 bg-white/10 text-white/90"
              : "border-purple-200/70 bg-purple-50 text-purple-800"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight leading-snug font-bengali ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-sm sm:text-base leading-relaxed font-bengali ${
            light ? "text-white/80" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function PrimaryButton({ children, className = "", style, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft transition hover:opacity-95 active:scale-[0.98] cursor-pointer font-bengali disabled:opacity-60 ${className}`}
      style={{ background: "var(--landing-hero-gradient)", ...style }}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", light = false, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition active:scale-[0.98] cursor-pointer font-bengali ${
        light
          ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
          : "landing-glass-chip text-purple-800 hover:bg-purple-50/80"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
