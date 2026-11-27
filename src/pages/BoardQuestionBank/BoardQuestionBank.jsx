import {
  BookOpenCheck,
  Building2,
  Calendar,
  FileQuestion,
  Filter,
  Landmark,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const EDUCATION_BOARDS = [
  { id: "all", name: "সকল বোর্ড", short: "সকল" },
  { id: "dhaka", name: "ঢাকা বোর্ড", short: "ঢাকা" },
  { id: "rajshahi", name: "রাজশাহী বোর্ড", short: "রাজশাহী" },
  { id: "chattogram", name: "চট্টগ্রাম বোর্ড", short: "চট্টগ্রাম" },
  { id: "sylhet", name: "সিলেট বোর্ড", short: "সিলেট" },
  { id: "barishal", name: "বরিশাল বোর্ড", short: "বরিশাল" },
  { id: "cumilla", name: "কুমিল্লা বোর্ড", short: "কুমিল্লা" },
  { id: "jashore", name: "যশোর বোর্ড", short: "যশোর" },
  { id: "dinajpur", name: "দিনাজপুর বোর্ড", short: "দিনাজপুর" },
  { id: "mymensingh", name: "ময়মনসিংহ বোর্ড", short: "ময়মনসিংহ" },
  { id: "madrasah", name: "মাদ্রাসা বোর্ড", short: "মাদ্রাসা" },
];

const EXAM_LEVELS = ["সকল স্তর", "এসএসসি (SSC)", "এইচএসসি (HSC)", "দাখিল", "আলিম"];
const EXAM_YEARS = ["সকল সাল", "২০২৫", "২০২৪", "২০২৩", "২০২২", "২০২১"];

export default function BoardQuestionBank() {
  const [selectedBoard, setSelectedBoard] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("সকল স্তর");
  const [selectedYear, setSelectedYear] = useState("সকল সাল");
  const [searchQuery, setSearchQuery] = useState("");

  const activeBoardMeta = useMemo(
    () =>
      EDUCATION_BOARDS.find((b) => b.id === selectedBoard) ||
      EDUCATION_BOARDS[0],
    [selectedBoard],
  );

  return (
    <div className="space-y-6 font-bengali">
      {/* Page Header */}
      <section className="rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/60 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/90 text-indigo-700 border border-indigo-200/80 text-xs font-semibold">
              <Landmark className="size-3.5" />
              <span>বোর্ড প্রশ্ন আর্কাইভ</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              বোর্ড প্রশ্ন ব্যাংক
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              ঢাকা, সিলেট, রাজশাহী, বরিশালসহ দেশের সকল শিক্ষা বোর্ডের বিগত বছরের
              বোর্ড প্রশ্নপত্র ও প্রশ্ন সংগ্রহ এখান থেকে ব্রাউজ ও ব্যবহার করতে
              পারবেন।
            </p>
          </div>

          <Link
            to="/dashboard/generate"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition self-start md:self-auto shrink-0"
          >
            <Sparkles className="size-3.5" />
            <span>১ ক্লিকে প্রশ্ন তৈরি</span>
          </Link>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বিষয়, বোর্ডের নাম বা সাল লিখে খুঁজুন (যেমন: পদার্থবিজ্ঞান, সিলেট বোর্ড, ২০২৪)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600">
              <Filter className="size-3.5 text-slate-400" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
                aria-label="পরীক্ষার স্তর"
              >
                {EXAM_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600">
              <Calendar className="size-3.5 text-slate-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
                aria-label="পরীক্ষার সাল"
              >
                {EXAM_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Board Pills (Responsive Wrap, No Scrollbar) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          {EDUCATION_BOARDS.map((board) => {
            const active = selectedBoard === board.id;
            return (
              <button
                key={board.id}
                type="button"
                onClick={() => setSelectedBoard(board.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition cursor-pointer border ${
                  active
                    ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 hover:text-purple-700"
                }`}
              >
                <Building2 className="size-3 shrink-0" />
                <span>{board.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Empty / Ready State */}
      <section className="rounded-2xl border border-dashed border-slate-200 bg-white/90 p-10 sm:p-14 text-center space-y-3">
        <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
          <FileQuestion className="size-7" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-slate-800">
          {activeBoardMeta.name}-এর প্রশ্ন এখনো যুক্ত করা হয়নি
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          বোর্ড ভিত্তিক (সিলেট, রাজশাহী, বরিশাল, ঢাকা ও অন্যান্য) প্রশ্নগুলো
          সংরক্ষণের জন্য এই সেকশনটি প্রস্তুত। অ্যাডমিন প্যানেল থেকে বোর্ড প্রশ্ন
          আপলোড করা হলেই এখানে বছর ও বিষয়ভিত্তিকভাবে দেখতে পারবেন।
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100">
            <BookOpenCheck className="size-3.5 text-purple-600" />
            নির্বাচিত বোর্ড: {activeBoardMeta.name}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100">
            স্তর: {selectedLevel}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100">
            সাল: {selectedYear}
          </span>
        </div>
      </section>
    </div>
  );
}
