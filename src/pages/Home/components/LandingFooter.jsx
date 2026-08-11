import { BookOpen, Link2, PlayCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import footerBg from "../../../assets/landing/footer-bg.png";
import { FOOTER_COLUMNS } from "../data/landingContent";

function FooterLink({ link }) {
  const className =
    "text-[11px] xs:text-sm text-white/70 hover:text-white transition leading-snug break-words";

  if (link.href.startsWith("/")) {
    return (
      <Link to={link.href} className={className}>
        {link.label}
      </Link>
    );
  }

  return (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  );
}

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden font-bengali text-white">
      <img
        src={footerBg}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover object-center scale-105"
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--landing-footer-overlay)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--landing-footer-scrim)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-80"
        style={{ background: "var(--landing-hero-gradient)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-28 right-0 size-72 rounded-full blur-3xl opacity-40"
        style={{ background: "var(--landing-glow)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full blur-3xl opacity-30"
        style={{ background: "var(--landing-glow-soft)" }}
        aria-hidden
      />

      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-14 pb-7 sm:pb-8">
          <div className="mb-8 sm:mb-10 flex flex-col xs:flex-row xs:items-center gap-5 justify-between border-b border-white/15 pb-7 sm:pb-8">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-primary-foreground shadow-soft ring-1 ring-white/25"
                style={{ background: "var(--landing-hero-gradient)" }}
              >
                <BookOpen className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                  স্মার্ট প্রশ্নব্যাংক
                </p>
                <p className="mt-1 text-[11px] xs:text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm">
                  প্রশ্নপত্র, OMR ও পরীক্ষা—এক প্ল্যাটফর্মে।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {[
                { Icon: Share2, label: "Facebook", href: "#" },
                { Icon: PlayCircle, label: "YouTube", href: "#" },
                { Icon: Link2, label: "LinkedIn", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex size-9 sm:size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/85 backdrop-blur-md hover:bg-white/20 hover:text-white hover:border-white/35 transition"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-2.5 xs:gap-x-4 sm:gap-x-8 gap-y-6 sm:gap-y-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="min-w-0">
                <h3 className="mb-2.5 sm:mb-3.5 flex items-center gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm font-bold uppercase tracking-wide text-white">
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{ background: "var(--landing-hero-gradient)" }}
                    aria-hidden
                  />
                  {col.title}
                </h3>
                <ul className="space-y-1.5 sm:space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-9 sm:mt-11 pt-5 border-t border-white/15 flex flex-col xs:flex-row items-center justify-between gap-2 text-[11px] xs:text-xs text-white/60">
            <p>© {year} স্মার্ট প্রশ্নব্যাংক। সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex items-center gap-3">
              <Link to="/terms" className="hover:text-white transition">
                Terms
              </Link>
              <span className="text-white/30" aria-hidden>
                ·
              </span>
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
