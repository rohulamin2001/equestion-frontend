import {
  BookOpen,
  BookOpenCheck,
  Download,
  ExternalLink,
  Eye,
  Globe,
  GraduationCap,
  Landmark,
  Layers,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useUserContext } from "../../context/UserContext";
import LandingFooter from "../Home/components/LandingFooter";
import LandingNavbar from "../Home/components/LandingNavbar";
import { NCTB_BOOKS, NCTB_MASTER_URL } from "./data/nctbBooksData";

const VERSION_TABS = [
  {
    id: "Bangla",
    title: "বাংলা ভার্সন",
    subtitle: "১ম – দ্বাদশ শ্রেণি (সাধারণ শিক্ষা)",
    icon: BookOpen,
    accentGradient: "from-purple-600 to-fuchsia-600",
    activeCard:
      "border-purple-500 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white shadow-lg shadow-purple-900/20",
    pillBg: "bg-purple-50 text-purple-700 border-purple-200",
    spineColor: "bg-gradient-to-b from-purple-500 to-fuchsia-600",
    iconBox: "bg-purple-50 text-purple-700 border-purple-200/70",
  },
  {
    id: "English",
    title: "ইংরেজি ভার্সন",
    subtitle: "Class 1 – 12 (English Version)",
    icon: Globe,
    accentGradient: "from-indigo-600 to-sky-600",
    activeCard:
      "border-indigo-500 bg-gradient-to-br from-indigo-600 via-blue-700 to-sky-700 text-white shadow-lg shadow-indigo-900/20",
    pillBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    spineColor: "bg-gradient-to-b from-indigo-500 to-sky-500",
    iconBox: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
  },
  {
    id: "Madrasah",
    title: "মাদ্রাসা",
    subtitle: "ইবতেদায়ি (১ম–৫ম) ও দাখিল (৬ষ্ঠ–১০ম)",
    icon: Landmark,
    accentGradient: "from-emerald-600 to-teal-600",
    activeCard:
      "border-emerald-500 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-700 text-white shadow-lg shadow-emerald-900/20",
    pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    spineColor: "bg-gradient-to-b from-emerald-500 to-teal-600",
    iconBox: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  },
];

function getDrivePreviewUrl(url) {
  if (!url) return null;
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return null;
}

function getDriveDownloadUrl(url) {
  if (!url) return url;
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

const formatCompactClassLabel = (className) =>
  className.replace(/\s*শ্রেণি$/, "").trim();

export default function Books() {
  const { openAuthDrawer } = useUserContext();
  const [activeVersion, setActiveVersion] = useState("Bangla");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewBook, setPreviewBook] = useState(null);

  useEffect(() => {
    if (!previewBook) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewBook(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewBook]);

  const activeTabMeta =
    VERSION_TABS.find((t) => t.id === activeVersion) || VERSION_TABS[0];

  const versionCounts = useMemo(() => {
    const counts = { Bangla: 0, English: 0, Madrasah: 0 };
    for (const b of NCTB_BOOKS) {
      if (counts[b.version] !== undefined) counts[b.version] += 1;
    }
    return counts;
  }, []);

  // Books belonging to the active version
  const versionBooks = useMemo(
    () => NCTB_BOOKS.filter((b) => b.version === activeVersion),
    [activeVersion],
  );

  // Ordered unique levels inside active version
  const availableLevels = useMemo(() => {
    const map = new Map();
    for (const b of versionBooks) {
      if (!b.level) continue;
      if (!map.has(b.level)) {
        map.set(b.level, {
          level: b.level,
          minOrder: b.classOrder,
          count: 0,
        });
      }
      const entry = map.get(b.level);
      entry.count += 1;
      if (b.classOrder < entry.minOrder) {
        entry.minOrder = b.classOrder;
      }
    }
    return Array.from(map.values()).sort((a, b) => a.minOrder - b.minOrder);
  }, [versionBooks]);

  const effectiveSelectedLevel = availableLevels.some(
    (l) => l.level === selectedLevel,
  )
    ? selectedLevel
    : "all";

  // Ordered unique classes inside active version (filtered by active level)
  const availableClasses = useMemo(() => {
    const map = new Map();
    for (const b of versionBooks) {
      if (
        effectiveSelectedLevel !== "all" &&
        b.level !== effectiveSelectedLevel
      ) {
        continue;
      }
      if (!map.has(b.className)) {
        map.set(b.className, {
          className: b.className,
          classOrder: b.classOrder,
          level: b.level,
          count: 0,
        });
      }
      map.get(b.className).count += 1;
    }
    return Array.from(map.values()).sort((a, b) => a.classOrder - b.classOrder);
  }, [versionBooks, effectiveSelectedLevel]);

  const effectiveSelectedClass = availableClasses.some(
    (c) => c.className === selectedClass,
  )
    ? selectedClass
    : "all";

  const levelBookCount = useMemo(() => {
    if (effectiveSelectedLevel === "all") return versionBooks.length;
    return versionBooks.filter((b) => b.level === effectiveSelectedLevel)
      .length;
  }, [versionBooks, effectiveSelectedLevel]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return versionBooks.filter((b) => {
      if (
        effectiveSelectedLevel !== "all" &&
        b.level !== effectiveSelectedLevel
      ) {
        return false;
      }
      if (
        effectiveSelectedClass !== "all" &&
        b.className !== effectiveSelectedClass
      ) {
        return false;
      }
      if (q) {
        const matchTitle = b.title.toLowerCase().includes(q);
        const matchClass = b.className.toLowerCase().includes(q);
        const matchLevel = b.level.toLowerCase().includes(q);
        if (!matchTitle && !matchClass && !matchLevel) return false;
      }
      return true;
    });
  }, [
    versionBooks,
    effectiveSelectedLevel,
    effectiveSelectedClass,
    searchQuery,
  ]);

  // Group filtered books by className (preserving academic order)
  const groupedSections = useMemo(() => {
    const groups = new Map();
    for (const book of filteredBooks) {
      if (!groups.has(book.className)) {
        groups.set(book.className, {
          className: book.className,
          classOrder: book.classOrder,
          level: book.level,
          sourceUrl: book.sourceUrl,
          books: [],
        });
      }
      groups.get(book.className).books.push(book);
    }
    return Array.from(groups.values()).sort(
      (a, b) => a.classOrder - b.classOrder,
    );
  }, [filteredBooks]);

  const previewEmbedUrl = previewBook
    ? getDrivePreviewUrl(previewBook.link1)
    : null;

  return (
    <div className="relative min-h-screen bg-background text-foreground font-bengali flex flex-col">
      {/* Subtle atmospheric glow & grid matching Home */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-32 left-1/2 size-[min(90vw,640px)] -translate-x-1/2 rounded-full blur-3xl opacity-75"
          style={{ background: "var(--landing-glow)" }}
        />
        <div
          className="absolute top-[35%] -right-24 size-[min(65vw,440px)] rounded-full blur-3xl opacity-55"
          style={{ background: "var(--landing-glow-soft)" }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(var(--landing-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--landing-grid-color) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at top, black 25%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <LandingNavbar onLogin={() => openAuthDrawer("login")} />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 pt-8 sm:pt-12 pb-16 space-y-8">
          {/* Hero Header */}
          <section className="text-center max-w-3xl mx-auto space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-bold shadow-xs">
              <Sparkles className="size-3.5 text-purple-600" />
              <span>
                জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) • ২০২৬ শিক্ষাবর্ষ
              </span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              ১ম থেকে দ্বাদশ শ্রেণির{" "}
              <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                পাঠ্যপুস্তক লাইব্রেরি
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
              বাংলা ভার্সন, ইংরেজি ভার্সন এবং মাদ্রাসা (ইবতেদায়ি ও দাখিল)
              শিক্ষাক্রমের{" "}
              <strong className="text-slate-800">
                {NCTB_BOOKS.length.toLocaleString("bn-BD")}টি
              </strong>{" "}
              অফিশিয়াল পাঠ্যবই সরাসরি অনলাইনে পড়ুন অথবা PDF ডাউনলোড করুন।
            </p>

            <div className="pt-1">
              <a
                href={NCTB_MASTER_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 underline underline-offset-4 transition"
              >
                <span>এনসিটিবি মূল পোর্টাল ভিজিট করুন</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </section>

          {/* 3-Version Switcher Cards */}
          <section
            aria-label="ভার্সন নির্বাচন"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4"
          >
            {VERSION_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeVersion === tab.id;
              const count = versionCounts[tab.id] || 0;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveVersion(tab.id);
                    setSelectedLevel("all");
                    setSelectedClass("all");
                  }}
                  className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? tab.activeCard
                      : "bg-white/85 backdrop-blur-md border-slate-200/80 hover:border-purple-300 hover:shadow-md text-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex size-9 items-center justify-center rounded-xl border transition ${
                            isActive
                              ? "bg-white/15 border-white/25 text-white"
                              : tab.iconBox
                          }`}
                        >
                          <Icon className="size-4" />
                        </span>
                        <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                          {tab.title}
                        </h2>
                      </div>
                      <p
                        className={`text-xs leading-relaxed pl-11 ${
                          isActive ? "text-white/85" : "text-slate-500"
                        }`}
                      >
                        {tab.subtitle}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {count.toLocaleString("bn-BD")}টি বই
                    </span>
                  </div>
                </button>
              );
            })}
          </section>

          {/* Search & Class Filter Bar */}
          <section className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={`${activeTabMeta.title}-এর বই খুঁজুন (যেমন: বাংলা, গণিত, Physics, কুরআন)...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label="সার্চ মুছুন"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 shrink-0 px-1">
                <BookOpenCheck className="size-4 text-purple-600" />
                <span>
                  প্রদর্শিত হচ্ছে:{" "}
                  <strong className="text-slate-900">
                    {filteredBooks.length.toLocaleString("bn-BD")}টি
                  </strong>{" "}
                  বই
                </span>
              </div>
            </div>

            {/* Level & Class Filter Chips (Responsive, Zero Scrollbar) */}
            <div className="space-y-2.5 pt-1 border-t border-slate-100">
              {availableLevels.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">
                    স্তর:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLevel("all");
                      setSelectedClass("all");
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      effectiveSelectedLevel === "all"
                        ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>সকল স্তর</span>
                  </button>
                  {availableLevels.map((lvl) => {
                    const isLevelActive = effectiveSelectedLevel === lvl.level;
                    return (
                      <button
                        key={lvl.level}
                        type="button"
                        onClick={() => {
                          setSelectedLevel(lvl.level);
                          setSelectedClass("all");
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          isLevelActive
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                        }`}
                      >
                        <span>{lvl.level}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[10px] leading-none ${
                            isLevelActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {lvl.count.toLocaleString("bn-BD")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] font-bold text-slate-400 mr-1">
                  শ্রেণি:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedClass("all")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    effectiveSelectedClass === "all"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>সকল শ্রেণি</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] leading-none ${
                      effectiveSelectedClass === "all"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {levelBookCount.toLocaleString("bn-BD")}
                  </span>
                </button>

                {availableClasses.map((cls) => {
                  const isSelected = effectiveSelectedClass === cls.className;
                  return (
                    <button
                      key={cls.className}
                      type="button"
                      onClick={() => setSelectedClass(cls.className)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        isSelected
                          ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/60 hover:text-purple-700"
                      }`}
                    >
                      <span>{formatCompactClassLabel(cls.className)}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] leading-none ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cls.count.toLocaleString("bn-BD")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Books Display grouped by Class */}
          {groupedSections.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-12 text-center space-y-3">
              <BookOpen className="size-10 text-slate-300 mx-auto" />
              <p className="text-base font-bold text-slate-700">
                কোনো পাঠ্যবই পাওয়া যায়নি
              </p>
              <p className="text-xs text-slate-500">
                অন্য কোনো কীওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার পরিবর্তন করুন।
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedClass("all");
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition cursor-pointer"
                >
                  ফিল্টার রিসেট করুন
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {groupedSections.map((section) => (
                <section key={section.className} className="space-y-3.5">
                  {/* Class Section Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex size-8 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs text-purple-700">
                        <GraduationCap className="size-4" />
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                          {section.className}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${activeTabMeta.pillBg}`}
                        >
                          {section.level}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          • {section.books.length.toLocaleString("bn-BD")}টি বই
                        </span>
                      </div>
                    </div>

                    <a
                      href={section.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
                    >
                      <span>অফিশিয়াল NCTB পাতা</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>

                  {/* Book Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    {section.books.map((book, idx) => {
                      const hasDrivePreview = Boolean(
                        getDrivePreviewUrl(book.link1),
                      );
                      const downloadUrl = getDriveDownloadUrl(book.link1);

                      return (
                        <article
                          key={book.id}
                          className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 hover:bg-white hover:border-purple-300/80 hover:shadow-lg hover:shadow-purple-900/5 transition-all duration-200 flex flex-col justify-between p-4 pl-5"
                        >
                          {/* Vertical book-spine accent */}
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-1.5 ${activeTabMeta.spineColor} opacity-80 group-hover:opacity-100 transition`}
                            aria-hidden
                          />

                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                <Layers className="size-3" />
                                বই #{(idx + 1).toLocaleString("bn-BD")}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${activeTabMeta.pillBg}`}
                              >
                                {activeTabMeta.title}
                              </span>
                            </div>

                            <h4 className="text-sm sm:text-[15px] font-extrabold text-slate-800 group-hover:text-purple-900 transition leading-snug line-clamp-2 min-h-[2.4rem]">
                              {book.title}
                            </h4>
                          </div>

                          <div className="pt-4 mt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                            {hasDrivePreview && (
                              <button
                                type="button"
                                onClick={() => setPreviewBook(book)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                              >
                                <Eye className="size-3.5" />
                                <span>অনলাইনে পড়ুন</span>
                              </button>
                            )}

                            <a
                              href={downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                                hasDrivePreview
                                  ? "bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-slate-200 hover:border-purple-200"
                                  : "flex-1 bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                              }`}
                              title="ডাউনলোড লিংক-১ (Google Drive)"
                            >
                              <Download className="size-3.5" />
                              <span>
                                {hasDrivePreview ? "লিংক-১" : "ডাউনলোড"}
                              </span>
                            </a>

                            {book.link2 && (
                              <a
                                href={book.link2}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs font-bold transition"
                                title="বিকল্প ডাউনলোড লিংক-২ (eGovCloud)"
                              >
                                <ExternalLink className="size-3" />
                                <span>লিংক-২</span>
                              </a>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>

        <LandingFooter />
      </div>

      {/* Embedded Large PDF Reader Modal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {previewBook && (
              <motion.div
                key="nctb-pdf-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setPreviewBook(null)}
                role="dialog"
                aria-modal="true"
                aria-label={previewBook.title}
                className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
              >
                <motion.div
                  key="nctb-pdf-modal-content"
                  initial={{ opacity: 0, scale: 0.97, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 12 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ height: "94dvh" }}
                  className="w-full max-w-[1440px] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden"
                >
                  {/* Compact Top Header Bar */}
                  <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="hidden sm:inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200/70">
                        <BookOpen className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate font-bengali">
                          {previewBook.title}
                        </h2>
                        <p className="text-xs text-slate-500 truncate font-bengali">
                          {previewBook.className} • {activeTabMeta.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <a
                        href={getDriveDownloadUrl(previewBook.link1)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm font-bengali"
                      >
                        <Download className="size-3.5" />
                        <span className="hidden sm:inline">PDF ডাউনলোড</span>
                        <span className="sm:hidden">ডাউনলোড</span>
                      </a>
                      {previewBook.link2 && (
                        <a
                          href={previewBook.link2}
                          target="_blank"
                          rel="noreferrer"
                          className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition font-bengali"
                        >
                          <ExternalLink className="size-3.5" />
                          <span>বিকল্প লিংক</span>
                        </a>
                      )}
                      <a
                        href={previewBook.link1}
                        target="_blank"
                        rel="noreferrer"
                        title="নতুন ট্যাবে খুলুন"
                        className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition font-bengali"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>নতুন ট্যাবে</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setPreviewBook(null)}
                        aria-label="বন্ধ করুন"
                        className="inline-flex size-8 sm:size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-600 transition cursor-pointer"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Full-Height PDF Iframe Viewer */}
                  <div className="flex-1 min-h-0 bg-slate-900/5 relative">
                    {previewEmbedUrl ? (
                      <iframe
                        src={previewEmbedUrl}
                        title={previewBook.title || "NCTB Book Preview"}
                        className="w-full h-full border-0 block"
                        allow="autoplay"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-slate-500 font-bengali p-4 text-center">
                        প্রিভিউ লোড করা যায়নি, উপরের PDF ডাউনলোড বাটনে ক্লিক করে
                        পড়ুন।
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
