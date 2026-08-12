import { ArrowLeft, Check, FileText, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import LandingFooter from "../Home/components/LandingFooter";
import LandingNavbar from "../Home/components/LandingNavbar";
import { LEGAL_CONTACT, TERMS_SECTIONS } from "./data/termsContent";

function BlockRenderer({ block }) {
  if (block.type === "p") {
    return (
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-bengali">
        {block.text}
      </p>
    );
  }

  if (block.type === "sub") {
    return (
      <div className="space-y-1.5">
        {block.title && (
          <h4 className="text-sm font-bold text-foreground font-bengali">
            {block.title}
          </h4>
        )}
        {block.text ? (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-bengali">
            {block.text}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "ul" || block.type === "ol") {
    const Tag = block.type === "ol" ? "ol" : "ul";
    return (
      <Tag
        className={`space-y-2 text-sm sm:text-base text-muted-foreground font-bengali ${
          block.type === "ol" ? "list-decimal pl-5" : "list-none"
        }`}
      >
        {block.items?.map((item) => (
          <li key={item} className="leading-relaxed flex gap-2.5">
            {block.type === "ul" && (
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-purple-500" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </Tag>
    );
  }

  if (block.type === "accept") {
    return (
      <ul className="space-y-2.5">
        {block.items?.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 rounded-xl border border-purple-200/70 bg-purple-50/60 px-3.5 py-3 text-sm text-foreground font-bengali"
          >
            <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

export default function Terms() {
  const { openAuthDrawer } = useUserContext();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LandingNavbar onLogin={() => openAuthDrawer("login")} />

      <main className="overflow-x-hidden">
        <section className="relative overflow-hidden border-b border-border">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-3xl opacity-70"
            style={{ background: "var(--landing-glow)" }}
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-800 hover:underline font-bengali mb-5"
            >
              <ArrowLeft className="size-4" />
              হোমে ফিরে যান
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-purple-50 px-3 py-1 text-[11px] sm:text-xs font-bold text-purple-800 font-bengali">
                  <FileText className="size-3.5" />
                  Legal
                </div>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-foreground font-bengali leading-snug">
                  ব্যবহারের শর্তাবলী ও সেবা চুক্তি
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground font-bengali">
                  {LEGAL_CONTACT.orgName} ({LEGAL_CONTACT.orgNameEn}) — Terms
                  &amp; Conditions of Service
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-glass-elevated px-4 py-3 shadow-soft text-xs sm:text-sm font-bengali space-y-1 shrink-0">
                <p>
                  <span className="text-muted-foreground">কার্যকর:</span>{" "}
                  <span className="font-bold text-foreground">
                    {LEGAL_CONTACT.effectiveDate}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">সংশোধিত:</span>{" "}
                  <span className="font-bold text-foreground">
                    {LEGAL_CONTACT.lastUpdated}
                  </span>
                </p>
                <a
                  href={LEGAL_CONTACT.website}
                  className="font-semibold text-purple-800 hover:underline break-all"
                  target="_blank"
                  rel="noreferrer"
                >
                  {LEGAL_CONTACT.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-8 lg:gap-10">
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <nav
                aria-label="ধারা সূচি"
                className="rounded-2xl border border-border bg-glass-elevated p-4 shadow-soft max-h-[70vh] overflow-y-auto"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 font-bengali">
                  সূচিপত্র
                </p>
                <ul className="space-y-1">
                  {TERMS_SECTIONS.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-lg px-2.5 py-2 text-xs sm:text-sm text-muted-foreground hover:bg-purple-50 hover:text-purple-800 transition font-bengali leading-snug"
                      >
                        <span className="font-bold text-purple-700 mr-1">
                          {section.number}.
                        </span>
                        {section.title.split(" (")[0]}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="space-y-5 sm:space-y-6">
              {TERMS_SECTIONS.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-2xl sm:rounded-3xl border border-border bg-glass-elevated p-5 sm:p-7 shadow-soft"
                >
                  <header className="mb-4 sm:mb-5 flex items-start gap-3">
                    <span
                      className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl text-xs sm:text-sm font-black text-primary-foreground shadow-soft"
                      style={{ background: "var(--landing-hero-gradient)" }}
                    >
                      {section.number}
                    </span>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground font-bengali leading-snug pt-1.5">
                      {section.title}
                    </h2>
                  </header>

                  <div className="space-y-4">
                    {section.blocks.map((block, idx) => (
                      <BlockRenderer
                        key={`${section.id}-${idx}`}
                        block={block}
                      />
                    ))}
                  </div>

                  {section.id === "contact" && (
                    <div className="mt-5 rounded-2xl border border-purple-200/70 bg-purple-50/50 p-4 sm:p-5 font-bengali space-y-3">
                      <p className="font-bold text-foreground">
                        {LEGAL_CONTACT.orgName}
                      </p>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0 mt-0.5 text-purple-700" />
                        <span>{LEGAL_CONTACT.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="size-4 shrink-0 text-purple-700" />
                        <a
                          href={`mailto:${LEGAL_CONTACT.email}`}
                          className="font-semibold text-purple-800 hover:underline"
                        >
                          {LEGAL_CONTACT.email}
                        </a>
                      </div>
                      {LEGAL_CONTACT.phone && (
                        <p className="text-sm text-muted-foreground">
                          ফোন: {LEGAL_CONTACT.phone}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              ))}

              <p className="text-center text-xs text-muted-foreground font-bengali pb-4">
                © ২০২৬ {LEGAL_CONTACT.orgName} ({LEGAL_CONTACT.orgNameEn})।
                সর্বস্বত্ব সংরক্ষিত। বাংলাদেশের আইন অনুযায়ী নিবন্ধিত ও
                পরিচালিত।
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
