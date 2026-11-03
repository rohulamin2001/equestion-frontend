import {
  BookOpen,
  Bookmark,
  Building2,
  Folder,
  GraduationCap,
  Layers,
  School,
} from "lucide-react";
import { motion } from "motion/react";

const getIconForType = (type, level) => {
  if (level === 0) {
    if (type === "School")
      return <School className="size-4 sm:size-5 text-indigo-600" />;
    if (type === "College")
      return <GraduationCap className="size-4 sm:size-5 text-emerald-600" />;
    if (type === "Madrasah")
      return <Building2 className="size-4 sm:size-5 text-amber-600" />;
  }
  if (level === 1)
    return <Layers className="size-4 sm:size-5 text-[var(--purple-600)]" />;
  if (level === 2)
    return <BookOpen className="size-4 sm:size-5 text-blue-600" />;
  if (level === 3)
    return <Bookmark className="size-4 sm:size-5 text-violet-600" />;
  return <Folder className="size-4 sm:size-5 text-slate-500" />;
};

const getBgForLevel = (level, type) => {
  if (level === 0) {
    if (type === "School") return "bg-indigo-50 border-indigo-100/80";
    if (type === "College") return "bg-emerald-50 border-emerald-100/80";
    if (type === "Madrasah") return "bg-amber-50 border-amber-100/80";
  }
  if (level === 1) return "bg-purple-50/70 border-purple-100/80";
  if (level === 2) return "bg-blue-50/70 border-blue-100/80";
  if (level === 3) return "bg-violet-50/70 border-violet-100/80";
  return "bg-slate-50 border-slate-100";
};

export default function FolderCard({
  title,
  subtitle,
  code,
  count = 0,
  level = 0,
  type = "",
  onClick,
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      onClick={onClick}
      className="relative flex items-center justify-between p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs active:bg-slate-50/80 transition-colors cursor-pointer select-none overflow-hidden min-h-[52px] sm:min-h-[58px]"
    >
      {/* Left side: Icon and Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
        <div
          className={`p-2 sm:p-2.5 rounded-xl border shrink-0 flex items-center justify-center ${getBgForLevel(
            level,
            type,
          )}`}
        >
          {getIconForType(type, level)}
        </div>
        <div className="min-w-0 text-left">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
              {title}
            </h4>
            {code && (
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500 font-mono font-medium">
                {code}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Count badge (no hover change, steady & readable) */}
      <div className="shrink-0 flex items-center pl-1">
        <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-[var(--purple-50)] border border-purple-200/60 text-[var(--purple-700)] font-bold text-[11px] sm:text-xs text-center">
          <span>{count?.toLocaleString("bn-BD")}</span>
          <span className="text-[10px] font-normal ml-0.5 opacity-80">টি</span>
        </div>
      </div>
    </motion.div>
  );
}
