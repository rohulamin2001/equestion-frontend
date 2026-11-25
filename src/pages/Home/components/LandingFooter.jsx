import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
      <polygon
        points="10 15 15 12 10 9 10 15"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    Icon: FacebookIcon,
    label: "Facebook",
    href: "https://facebook.com/smartproshnobank",
    hoverClass:
      "hover:border-blue-400/50 hover:bg-blue-500/15 hover:text-blue-300",
  },
  {
    Icon: InstagramIcon,
    label: "Instagram",
    href: "https://www.instagram.com/smartproshnobank",
    hoverClass:
      "hover:border-pink-400/50 hover:bg-pink-500/15 hover:text-pink-300",
  },
  {
    Icon: YoutubeIcon,
    label: "YouTube",
    href: "https://youtube.com/@smartproshnobank",
    hoverClass:
      "hover:border-red-400/50 hover:bg-red-500/15 hover:text-red-300",
  },
];

function FooterLink({ link, isHome }) {
  const baseClass =
    "group inline-flex items-center gap-1.5 sm:gap-2 text-[11px] xs:text-xs sm:text-sm text-slate-400 hover:text-white transition-all duration-200 leading-snug sm:leading-relaxed";

  const content = (
    <>
      <span
        className="size-1 rounded-full bg-slate-600 group-hover:bg-purple-400 group-hover:scale-125 transition-all duration-200 shrink-0"
        aria-hidden
      />
      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
        {link.label}
      </span>
    </>
  );

  if (link.href.startsWith("/")) {
    return (
      <Link to={link.href} className={baseClass}>
        {content}
      </Link>
    );
  }

  if (link.href.startsWith("#") && !isHome) {
    return (
      <Link to={`/${link.href}`} className={baseClass}>
        {content}
      </Link>
    );
  }

  return (
    <a href={link.href} className={baseClass}>
      {content}
    </a>
  );
}

export default function LandingFooter() {
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <footer className="relative isolate overflow-hidden bg-[#070512] font-bengali text-white border-t border-white/[0.08]">
      {/* Top luminous gradient hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent"
        aria-hidden
      />

      {/* Subtle architectural grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 0%, black 20%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Ambient atmospheric glows */}
      <div
        className="pointer-events-none absolute -top-32 right-[10%] size-96 rounded-full bg-purple-600/15 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-indigo-600/15 blur-[110px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-14 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/[0.08]">
          {/* Brand, Address & Social Column */}
          <div className="lg:col-span-5 flex flex-col items-center text-center md:items-start md:text-left space-y-6">
            {/* Brand Lockup */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
              <div className="flex aspect-square size-12 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-lg shadow-purple-950/50 ring-1 ring-white/20">
                <img
                  src="/logo.svg"
                  alt="স্মার্ট প্রশ্নব্যাংক"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-white text-xl tracking-tight font-sans">
                  <span className="text-[#FF8533]">স্মার্ট</span> প্রশ্নব্যাংক
                </p>
                <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-sm">
                  প্রশ্নপত্র তৈরি, OMR মূল্যায়ন ও অনলাইন পরীক্ষা—সবকিছু এক
                  আধুনিক প্ল্যাটফর্মে।
                </p>
              </div>
            </div>

            {/* Contact & Address Cards */}
            <div className="w-full max-w-md space-y-2.5">
              <a
                href="https://maps.google.com/?q=Seedstore+Bazar,+Habirbari,+Bhaluka,+Mymensingh"
                target="_blank"
                rel="noreferrer"
                title="গুগল ম্যাপে লোকেশন দেখুন"
                className="group flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-400/35 px-4 py-3 text-left transition-all duration-200"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/20 group-hover:bg-purple-500/25 transition">
                  <MapPin className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    অফিস ঠিকানা
                  </span>
                  <span className="mt-0.5 block text-xs sm:text-sm text-slate-200 leading-relaxed">
                    সিডস্টোর বাজার (ইন্ডাস্ট্রিয়াল এরিয়া), হবিরবাড়ী,
                    ভালুকা–২২৪০, ময়মনসিংহ।
                  </span>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1" />
              </a>

              <a
                href="mailto:support@smartproshnobank.com"
                className="group inline-flex w-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-400/35 px-4 py-2.5 text-left transition-all duration-200"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/20 group-hover:bg-indigo-500/25 transition">
                  <Mail className="size-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-xs sm:text-sm text-slate-200 font-sans">
                  support@smartproshnobank.com
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>

            {/* Social Media Buttons — centered on small devices */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
              {SOCIAL_LINKS.map(({ Icon, label, href, hoverClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className={`inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 ${hoverClass}`}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-x-2.5 xs:gap-x-4 sm:gap-x-6 gap-y-8 lg:pl-6">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="min-w-0">
                <h3 className="mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold tracking-wide text-white">
                  <span
                    className="h-3 sm:h-3.5 w-1 rounded-full bg-gradient-to-b from-purple-400 to-indigo-500 shrink-0"
                    aria-hidden
                  />
                  {col.title}
                </h3>
                <ul className="space-y-2 sm:space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} isHome={isHome} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col xs:flex-row items-center gap-2.5 sm:gap-4 text-center sm:text-left">
            <p>© {year} স্মার্ট প্রশ্নব্যাংক। সর্বস্বত্ব সংরক্ষিত।</p>
            <span className="hidden xs:inline text-slate-700" aria-hidden>
              |
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
              </span>
              সকল সিস্টেম সচল
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/termsandcondition"
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <span className="text-slate-700" aria-hidden>
              ·
            </span>
            <Link
              to="/privacypolicy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
