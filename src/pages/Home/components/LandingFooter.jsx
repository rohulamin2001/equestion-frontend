import { BookOpen, Link2, PlayCircle, Share2 } from "lucide-react";
import { FOOTER_COLUMNS } from "../data/landingContent";

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/50 pt-10 sm:pt-12 pb-6 px-4 sm:px-6 font-bengali">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className="flex size-9 items-center justify-center rounded-xl text-primary-foreground"
                style={{ background: "var(--landing-hero-gradient)" }}
              >
                <BookOpen className="size-4" />
              </div>
              <span className="font-extrabold text-foreground">স্মার্ট প্রশ্নব্যাংক</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              শিক্ষকদের জন্য স্মার্ট প্রশ্নপত্র, পরীক্ষা ও শিক্ষা ব্যবস্থাপনা প্ল্যাটফর্ম।
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[
                { Icon: Share2, label: "Facebook", href: "#" },
                { Icon: PlayCircle, label: "YouTube", href: "#" },
                { Icon: Link2, label: "LinkedIn", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground hover:text-purple-800 hover:border-purple-200 transition"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-foreground mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-purple-800 transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-5 border-t border-border text-center text-xs text-muted-foreground">
          © {year} স্মার্ট প্রশ্নব্যাংক। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
