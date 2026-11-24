import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import footerBg from "../../../assets/landing/footer-bg.png";
import { FOOTER_COLUMNS } from "../data/landingContent";

function FacebookIcon({ className = "size-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className = "size-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "size-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
          <div className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-center gap-6 justify-between border-b border-white/15 pb-7 sm:pb-8">
            <div className="flex items-start gap-3.5 min-w-0 max-w-xl">
              <div className="flex aspect-square size-11 sm:size-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-soft ring-1 ring-white/25 mt-0.5">
                <img
                  src="/logo.svg"
                  alt="স্মার্ট প্রশ্নব্যাংক"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 space-y-1.5">
                <p className="font-extrabold text-white text-base sm:text-lg tracking-tight font-sans">
                  স্মার্ট প্রশ্নব্যাংক
                </p>
                <p className="text-[11px] xs:text-xs sm:text-sm text-white/70 leading-relaxed">
                  প্রশ্নপত্র, OMR ও পরীক্ষা—এক প্ল্যাটফর্মে।
                </p>
                <a
                  href="https://maps.google.com/?q=Seedstore+Bazar,+Habirbari,+Bhaluka,+Mymensingh"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-2 pt-1 text-xs sm:text-sm text-white/80 hover:text-white transition group"
                  title="গুগল ম্যাপে লোকেশন দেখুন"
                >
                  <MapPin className="size-4 shrink-0 text-purple-300 mt-0.5 group-hover:text-purple-200 transition" />
                  <span className="leading-relaxed">
                    সিডস্টোর বাজার (ইন্ডাস্ট্রিয়াল এরিয়া), হবিরবাড়ী, ভালুকা–২২৪০, ময়মনসিংহ।
                  </span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {[
                {
                  Icon: FacebookIcon,
                  label: "Facebook",
                  href: "https://facebook.com/smartproshnobank",
                },
                {
                  Icon: InstagramIcon,
                  label: "Instagram",
                  href: "https://www.instagram.com/smartproshnobank",
                },
                {
                  Icon: YoutubeIcon,
                  label: "YouTube",
                  href: "https://youtube.com/@smartproshnobank",
                },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
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
              <Link
                to="/termsandcondition"
                className="hover:text-white transition"
              >
                Terms
              </Link>
              <span className="text-white/30" aria-hidden>
                ·
              </span>
              <Link to="/privacypolicy" className="hover:text-white transition">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
