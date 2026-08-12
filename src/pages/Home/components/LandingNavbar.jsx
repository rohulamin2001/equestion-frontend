import { BookOpen, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "../data/landingContent";

export default function LandingNavbar({ onLogin }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-purple-200/60 shadow-md shadow-purple-900/5"
          : "border-slate-200/50 shadow-sm"
      }`}
      style={{
        backgroundColor: scrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <div className="mx-auto flex h-14 xs:h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            go("#home");
          }}
          className="flex min-w-0 items-center gap-2 sm:gap-2.5"
        >
          <div
            className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-soft"
            style={{ background: "var(--landing-hero-gradient)" }}
          >
            <BookOpen className="size-4 sm:size-5" />
          </div>
          <span
            className="truncate text-sm xs:text-base sm:text-lg font-extrabold tracking-tight bg-clip-text text-transparent font-bengali"
            style={{ backgroundImage: "var(--landing-hero-gradient)" }}
          >
            স্মার্ট প্রশ্নব্যাংক
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                go(link.href);
              }}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-purple-800 hover:bg-purple-50 transition font-bengali"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={onLogin}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white shadow-soft transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer font-bengali bg-[var(--purple-600)] hover:bg-[var(--purple-700)]"
          >
            লগইন
          </button>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex size-11 items-center justify-center rounded-xl landing-glass-chip text-foreground cursor-pointer"
          aria-expanded={open}
          aria-label={open ? "মেনু বন্ধ" : "মেনু খুলুন"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div
          className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl px-4 py-4 space-y-1 max-h-[calc(100dvh-3.5rem)] overflow-y-auto shadow-xl"
          style={{
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                go(link.href);
              }}
              className="block rounded-xl px-3 py-3 text-sm font-bold text-foreground hover:bg-purple-50 font-bengali"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogin();
              }}
              className="w-full min-h-11 rounded-xl text-sm font-bold text-white font-bengali cursor-pointer bg-[var(--purple-600)] hover:bg-[var(--purple-700)]"
            >
              লগইন
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
