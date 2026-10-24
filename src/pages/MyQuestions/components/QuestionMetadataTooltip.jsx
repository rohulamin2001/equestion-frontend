import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Award,
  BookOpen,
  Bookmark,
  Building2,
  Calendar,
  GraduationCap,
  Hash,
  Info,
  Search,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

const TYPE_LABELS = {
  School: "স্কুল",
  College: "কলেজ",
  Madrasah: "মাদ্রাসা",
};

const LEVEL_LABELS = {
  Primary: "প্রাথমিক (Primary)",
  Secondary: "মাধ্যমিক (Secondary)",
  "Higher Secondary": "উচ্চমাধ্যমিক (Higher Secondary)",
  Ebtedayee: "ইবতেদায়ী (Ebtedayee)",
  Dakhil: "দাখিল (Dakhil)",
  Alim: "আলিম (Alim)",
};

const getFormattedTagValue = (val) => {
  if (!val) return "";
  if (Array.isArray(val)) {
    return val
      .map((item) => (item != null ? String(item).trim() : ""))
      .filter(Boolean)
      .join(", ");
  }
  return String(val).trim();
};

export default function QuestionMetadataTooltip({ question, classLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsOpen(true), 120);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsOpen(false), 180);
  };

  const q = question || {};

  // Formatted metadata values
  const instTypeLabel = TYPE_LABELS[q.institutionType] || q.institutionType;
  const formattedSchool = getFormattedTagValue(q.school);
  const formattedBoard = getFormattedTagValue(q.board);
  const formattedYear = getFormattedTagValue(q.year);
  const boardYearStr = [formattedBoard, formattedYear]
    .filter(Boolean)
    .join(" - ");
  const levelStr =
    LEVEL_LABELS[q.level] || (q.level ? String(q.level).trim() : "");
  const subjectName = q.subjectId?.subjectName;
  const chapterNumber =
    q.chapterNumber !== undefined && q.chapterNumber !== null
      ? q.chapterNumber
      : "";
  const topics = Array.isArray(q.topics) ? q.topics.filter(Boolean) : [];

  let specialSearchList = [];
  if (Array.isArray(q.specialSearch)) {
    specialSearchList = q.specialSearch.filter(Boolean);
  } else if (q.specialSearch && String(q.specialSearch).trim()) {
    specialSearchList = [String(q.specialSearch).trim()];
  }

  const hasAnyMetadata =
    instTypeLabel ||
    formattedSchool ||
    classLabel ||
    subjectName ||
    chapterNumber !== "" ||
    topics.length > 0 ||
    boardYearStr ||
    levelStr ||
    specialSearchList.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (timerRef.current) clearTimeout(timerRef.current);
            setIsOpen((prev) => !prev);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`size-5 sm:size-6 rounded-md sm:rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0 ${
            isOpen
              ? "bg-[#900EB0] text-white border border-[#900EB0] shadow-sm shadow-[#900EB0]/20"
              : "bg-purple-50 hover:bg-purple-100/90 text-[#900EB0] border border-[#900EB0]/20 hover:border-[#900EB0]/40"
          }`}
          title="প্রশ্নের বিস্তারিত তথ্য ও মেটাডাটা"
          aria-label="প্রশ্নের বিস্তারিত তথ্য ও মেটাডাটা"
        >
          <Info className="size-3 sm:size-3.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        collisionPadding={12}
        avoidCollisions={true}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="z-50 w-[285px] sm:w-[320px] max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl border border-purple-200/80 shadow-[0_12px_36px_-6px_rgba(144,14,176,0.18),0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-0 overflow-hidden text-slate-800 font-sans"
      >
        {/* Card Header */}
        <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50/50 px-3.5 py-2.5 border-b border-purple-100/90 flex items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <div className="size-5 rounded-md bg-[#900EB0]/10 text-[#900EB0] flex items-center justify-center shrink-0">
              <Info className="size-3" />
            </div>
            <span>প্রশ্নের বিবরণ ও মেটাডাটা</span>
          </div>

          <div className="flex items-center gap-1">
            {instTypeLabel && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#900EB0]/10 text-[#900EB0] border border-[#900EB0]/20 shrink-0">
                {instTypeLabel}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="size-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 sm:hidden cursor-pointer"
              aria-label="Close"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Card Body - 2-Column Vertical Specifications Grid */}
        <div className="p-3 space-y-0.5 max-h-[360px] overflow-y-auto no-scrollbar">
          {!hasAnyMetadata ? (
            <div className="py-4 text-center text-slate-400 text-xs font-medium">
              কোনো অতিরিক্ত বিবরণ সংযুক্ত নেই
            </div>
          ) : (
            <>
              {/* ১. প্রতিষ্ঠান */}
              {formattedSchool && (
                <div className="grid grid-cols-[82px_1fr] items-baseline gap-2 py-1.5 px-1 rounded-lg hover:bg-purple-50/30 transition-colors border-b border-slate-100/80 last:border-b-0">
                  <div className="flex  gap-1.5 text-slate-500 font-medium text-[11px] shrink-0 select-none">
                    <Building2 className="size-3 text-purple-600/80 shrink-0" />
                    <span>প্রতিষ্ঠান:</span>
                  </div>
                  <div className="text-slate-800 font-semibold text-[11px] leading-tight break-words">
                    {formattedSchool}
                  </div>
                </div>
              )}

              {/* ২. শ্রেণী */}
              {classLabel && (
                <div className="grid grid-cols-[82px_1fr] items-baseline gap-2 py-1.5 px-1 rounded-lg hover:bg-purple-50/30 transition-colors border-b border-slate-100/80 last:border-b-0">
                  <div className="flex  gap-1.5 text-slate-500 font-medium text-[11px] shrink-0 select-none">
                    <GraduationCap className="size-3 text-purple-600/80 shrink-0" />
                    <span>শ্রেণী:</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200/60 rounded px-1.5 py-0.2">
                      {classLabel}
                    </span>
                  </div>
                </div>
              )}

              {/* ৩. বিষয় / বই */}
              {subjectName && (
                <div className="grid grid-cols-[82px_1fr] items-baseline gap-2 py-1.5 px-1 rounded-lg hover:bg-purple-50/30 transition-colors border-b border-slate-100/80 last:border-b-0">
                  <div className="flex  gap-1.5 text-slate-500 font-medium text-[11px] shrink-0 select-none">
                    <BookOpen className="size-3 text-purple-600/80 shrink-0" />
                    <span>বই/বিষয়:</span>
                  </div>
                  <div className="text-slate-800 font-semibold text-[11px] leading-tight break-words">
                    {subjectName}
                  </div>
                </div>
              )}

              {/* ৪. অধ্যায় */}
              {chapterNumber !== "" && (
                <div className="grid grid-cols-[82px_1fr] items-baseline gap-2 py-1.5 px-1 rounded-lg hover:bg-purple-50/30 transition-colors border-b border-slate-100/80 last:border-b-0">
                  <div className="flex   gap-1.5 text-slate-500 font-medium text-[11px] shrink-0 select-none">
                    <Bookmark className="size-3 text-purple-600/80 shrink-0" />
                    <span>অধ্যায়:</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 rounded px-1.5 py-0.2">
                      অধ্যায় {chapterNumber}
                    </span>
                  </div>
                </div>
              )}

              {/* ৫. টপিক */}
              {topics.length > 0 && (
                <div className="grid grid-cols-[82px_1fr] items-baseline gap-2 py-1.5 px-1 rounded-lg hover:bg-purple-50/30 transition-colors border-b border-slate-100/80 last:border-b-0">
                  <div className="flex  gap-1.5 text-slate-500 font-medium text-[11px] shrink-0 select-none">
                    <Hash className="size-3 text-purple-600/80 shrink-0" />
                    <span>টপিক:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-[10px] font-semibold bg-purple-50 text-[#900EB0] border border-purple-200/60 rounded px-1.5 py-0.2"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ৬. বোর্ড ও সাল */}
              {boardYearStr && (
                <div className="grid grid-cols-[82px_1fr] items-baseline gap-2 py-1.5 px-1 rounded-lg hover:bg-purple-50/30 transition-colors border-b border-slate-100/80 last:border-b-0">
                  <div className="flex  gap-1.5 text-slate-500 font-medium text-[11px] shrink-0 select-none">
                    <Calendar className="size-3 text-purple-600/80 shrink-0" />
                    <span>বোর্ড/সাল:</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 rounded px-1.5 py-0.2">
                      {boardYearStr}
                    </span>
                  </div>
                </div>
              )}

              {/* ৭. লেভেল */}
              {levelStr && (
                <div className="grid grid-cols-[82px_1fr] items-baseline gap-2 py-1.5 px-1 rounded-lg hover:bg-purple-50/30 transition-colors border-b border-slate-100/80 last:border-b-0">
                  <div className="flex  gap-1.5 text-slate-500 font-medium text-[11px] shrink-0 select-none">
                    <Award className="size-3 text-purple-600/80 shrink-0" />
                    <span>লেভেল:</span>
                  </div>
                  <div className="text-slate-800 font-semibold text-[11px] leading-tight break-words">
                    {levelStr}
                  </div>
                </div>
              )}

              {/* ৮. কীওয়ার্ড */}
              {specialSearchList.length > 0 && (
                <div className="grid grid-cols-[82px_1fr] items-baseline gap-2 py-1.5 px-1 rounded-lg hover:bg-purple-50/30 transition-colors border-b border-slate-100/80 last:border-b-0">
                  <div className="flex  gap-1.5 text-slate-500 font-medium text-[11px] shrink-0 select-none">
                    <Search className="size-3 text-purple-600/80 shrink-0" />
                    <span>কীওয়ার্ড:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {specialSearchList.map((k, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/70 rounded px-1.5 py-0.2"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
