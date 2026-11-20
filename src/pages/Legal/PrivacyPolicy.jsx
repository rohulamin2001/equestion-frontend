import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Globe,
  List,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import LandingFooter from "../Home/components/LandingFooter";
import LandingNavbar from "../Home/components/LandingNavbar";
import { PRIVACY_CONTACT, PRIVACY_SECTIONS } from "./data/privacyContent";

const BENGALI_NUMERALS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
function toBengaliNumber(num) {
  return String(num)
    .split("")
    .map((char) => BENGALI_NUMERALS[Number(char)] ?? char)
    .join("");
}

function BlockRenderer({ block }) {
  if (block.type === "p") {
    return (
      <p className="text-[13.5px] xs:text-sm sm:text-base text-muted-foreground leading-relaxed font-bengali break-words">
        {block.text}
      </p>
    );
  }

  if (block.type === "sub") {
    return (
      <div className="pt-1 space-y-1">
        {block.title && (
          <h4 className="text-[14px] xs:text-[15px] sm:text-base font-bold text-foreground font-bengali break-words">
            {block.title}
          </h4>
        )}
        {block.text ? (
          <p className="text-[13.5px] xs:text-sm sm:text-base text-muted-foreground leading-relaxed font-bengali break-words">
            {block.text}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "note") {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/30 px-3 xs:px-3.5 py-2.5 xs:py-3 text-[13.5px] xs:text-sm sm:text-base font-semibold text-amber-950 dark:text-amber-200 font-bengali">
        <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-1" />
        <span className="min-w-0 break-words">{block.text}</span>
      </div>
    );
  }

  if (block.type === "ul") {
    return (
      <ul className="space-y-2 text-[13.5px] xs:text-sm sm:text-base text-muted-foreground font-bengali list-none pl-1">
        {block.items?.map((item) => (
          <li key={item} className="leading-relaxed flex gap-2.5 min-w-0">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-purple-500" />
            <span className="min-w-0 break-words">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol className="space-y-2 text-[13.5px] xs:text-sm sm:text-base text-muted-foreground font-bengali list-none pl-1">
        {block.items?.map((item, idx) => (
          <li key={item} className="leading-relaxed flex gap-2.5 min-w-0">
            <span className="font-bold text-purple-700 shrink-0 select-none">
              {toBengaliNumber(idx + 1)}.
            </span>
            <span className="min-w-0 break-words">{item}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "accept") {
    return (
      <ul className="space-y-2.5">
        {block.items?.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 rounded-xl border border-purple-200/70 bg-purple-50/60 dark:border-purple-900/50 dark:bg-purple-950/30 px-3 xs:px-3.5 py-2.5 xs:py-3 text-[13.5px] xs:text-sm sm:text-base text-foreground font-bengali min-w-0"
          >
            <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="min-w-0 break-words">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

export default function PrivacyPolicy() {
  const { openAuthDrawer } = useUserContext();
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const previousTitle = document.title;
    document.title = `${PRIVACY_CONTACT.title} (${PRIVACY_CONTACT.subtitle}) | ${PRIVACY_CONTACT.orgName}`;
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LandingNavbar onLogin={() => openAuthDrawer("login")} />

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-[240px] w-[240px] sm:h-[360px] sm:w-[360px] -translate-x-1/2 rounded-full blur-3xl opacity-70"
            style={{ background: "var(--landing-glow)" }}
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-7xl px-3.5 xs:px-4 sm:px-6 py-7 xs:py-9 sm:py-14">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs xs:text-sm font-semibold text-purple-800 hover:underline font-bengali mb-4 sm:mb-5"
            >
              <ArrowLeft className="size-3.5 xs:size-4" />
              হোমে ফিরে যান
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
              <div className="max-w-3xl space-y-2.5 sm:space-y-3 min-w-0">
                <div className="inline-flex items-center gap-1.5 xs:gap-2 rounded-full border border-purple-200/80 bg-purple-50 px-2.5 xs:px-3 py-1 text-[11px] sm:text-xs font-bold text-purple-800 font-bengali">
                  <ShieldCheck className="size-3.5 shrink-0" />
                  {PRIVACY_CONTACT.subtitle}
                </div>
                <h1 className="text-[22px] xs:text-3xl sm:text-4xl font-black tracking-tight text-foreground font-bengali leading-snug break-words">
                  {PRIVACY_CONTACT.title}
                </h1>
                <p className="text-xs xs:text-sm sm:text-base text-muted-foreground font-bengali break-words">
                  {PRIVACY_CONTACT.subtitle} — {PRIVACY_CONTACT.orgDisplay}
                </p>
              </div>

              <div className="w-full lg:w-auto rounded-2xl border border-border bg-glass-elevated px-3.5 xs:px-4 py-3 xs:py-3.5 shadow-soft text-xs sm:text-sm font-bengali space-y-1.5 shrink-0 min-w-0">
                <p className="break-words">
                  <span className="text-muted-foreground">
                    সর্বশেষ হালনাগাদ:
                  </span>{" "}
                  <span className="font-bold text-foreground">
                    {PRIVACY_CONTACT.lastUpdated}
                  </span>
                </p>
                <p className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-muted-foreground">ওয়েবসাইট:</span>
                  <a
                    href={PRIVACY_CONTACT.website}
                    className="font-semibold text-purple-800 hover:underline break-all"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {PRIVACY_CONTACT.website}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="mx-auto max-w-7xl px-3.5 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-5 sm:gap-8 lg:gap-10">
            {/* Mobile / Tablet Collapsible TOC */}
            <div className="lg:hidden">
              <div className="rounded-2xl border border-border bg-glass-elevated shadow-soft overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTocOpen((prev) => !prev)}
                  aria-expanded={tocOpen}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-bengali cursor-pointer"
                >
                  <span className="inline-flex items-center gap-2 text-xs xs:text-sm font-bold text-foreground">
                    <List className="size-4 text-purple-700 shrink-0" />
                    <span>সূচিপত্র ({PRIVACY_SECTIONS.length}টি ধারা)</span>
                  </span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      tocOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {tocOpen && (
                  <nav
                    aria-label="মোবাইল ধারা সূচি"
                    className="border-t border-border px-3 py-2.5 max-h-[55vh] overflow-y-auto"
                  >
                    <ul className="grid grid-cols-1 xs:grid-cols-2 gap-1">
                      {PRIVACY_SECTIONS.map((section) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            onClick={() => setTocOpen(false)}
                            className="block rounded-lg px-2.5 py-2 text-xs xs:text-sm text-muted-foreground hover:bg-purple-50 hover:text-purple-800 active:bg-purple-50 transition font-bengali leading-snug"
                          >
                            <span className="font-bold text-purple-700 mr-1.5">
                              {section.number}.
                            </span>
                            {section.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            </div>

            {/* Desktop Sticky TOC */}
            <aside className="hidden lg:block lg:sticky lg:top-20 lg:self-start">
              <nav
                aria-label="ধারা সূচি"
                className="rounded-2xl border border-border bg-glass-elevated p-4 shadow-soft max-h-[70vh] overflow-y-auto"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 font-bengali">
                  সূচিপত্র
                </p>
                <ul className="space-y-1">
                  {PRIVACY_SECTIONS.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-lg px-2.5 py-2 text-xs sm:text-sm text-muted-foreground hover:bg-purple-50 hover:text-purple-800 transition font-bengali leading-snug"
                      >
                        <span className="font-bold text-purple-700 mr-1.5">
                          {section.number}.
                        </span>
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main Sections List */}
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 min-w-0">
              {PRIVACY_SECTIONS.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-20 sm:scroll-mt-24 rounded-2xl sm:rounded-3xl border border-border bg-glass-elevated p-4 xs:p-5 sm:p-7 shadow-soft"
                >
                  <header className="mb-3.5 sm:mb-5 flex items-start gap-2.5 xs:gap-3">
                    <span
                      className="flex size-8 xs:size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl text-xs sm:text-sm font-black text-primary-foreground shadow-soft"
                      style={{ background: "var(--landing-hero-gradient)" }}
                    >
                      {section.number}
                    </span>
                    <h2 className="min-w-0 flex-1 text-[15px] xs:text-base sm:text-lg md:text-xl font-bold text-foreground font-bengali leading-snug pt-1 sm:pt-1.5 break-words">
                      {section.title}
                    </h2>
                  </header>

                  <div className="space-y-3 sm:space-y-3.5">
                    {section.blocks.map((block, idx) => (
                      <BlockRenderer
                        key={`${section.id}-${idx}`}
                        block={block}
                      />
                    ))}
                  </div>

                  {section.id === "contact" && (
                    <div className="mt-4 sm:mt-5 rounded-2xl border border-purple-200/70 bg-purple-50/50 dark:border-purple-900/50 dark:bg-purple-950/20 p-3.5 xs:p-4 sm:p-5 font-bengali space-y-2.5 sm:space-y-3 text-[13.5px] xs:text-sm sm:text-base">
                      <p className="font-bold text-foreground break-words">
                        প্রতিষ্ঠানের নাম: {PRIVACY_CONTACT.orgNameEn}
                      </p>

                      <div className="flex items-start gap-2.5 text-muted-foreground min-w-0">
                        <Globe className="size-4 shrink-0 mt-1 text-purple-700" />
                        <p className="min-w-0 flex-1 break-all">
                          <span className="font-semibold text-foreground">
                            ওয়েবসাইট:{" "}
                          </span>
                          <a
                            href={PRIVACY_CONTACT.website}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-purple-800 hover:underline"
                          >
                            {PRIVACY_CONTACT.website}
                          </a>
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 text-muted-foreground min-w-0">
                        <MessageSquare className="size-4 shrink-0 mt-1 text-purple-700" />
                        <p className="min-w-0 flex-1 break-words">
                          <span className="font-semibold text-foreground">
                            সাপোর্ট মাধ্যম:{" "}
                          </span>
                          <span>{PRIVACY_CONTACT.supportChannels}</span>
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 text-muted-foreground min-w-0">
                        <Clock className="size-4 shrink-0 mt-1 text-purple-700" />
                        <p className="min-w-0 flex-1 break-words">
                          <span className="font-semibold text-foreground">
                            সাপোর্ট সময়:{" "}
                          </span>
                          <span>{PRIVACY_CONTACT.supportHours}</span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/40 text-xs sm:text-sm text-muted-foreground">
                        <p>
                          আমরা প্রাপ্ত অভিযোগ যথাযথভাবে পর্যালোচনা করে সমাধানের
                          জন্য প্রয়োজনীয় ব্যবস্থা গ্রহণ করব।
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              ))}

              {/* Bottom Tagline / Summary Card */}
              <div className="rounded-2xl sm:rounded-3xl border border-border bg-glass-elevated p-4 xs:p-5 sm:p-6 shadow-soft text-center font-bengali space-y-1.5">
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground break-words">
                  সর্বশেষ হালনাগাদ: {PRIVACY_CONTACT.lastUpdated}
                </p>
                <p className="text-sm sm:text-base font-bold text-foreground break-words">
                  {PRIVACY_CONTACT.orgName} ({PRIVACY_CONTACT.orgNameEn})
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  {PRIVACY_CONTACT.tagline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
