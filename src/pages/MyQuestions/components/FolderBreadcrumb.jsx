import { ArrowLeft, ChevronRight, Home, RotateCcw } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";

export default function FolderBreadcrumb({
  breadcrumbs = [],
  onJump,
  onNavigateUp,
  onReset,
  currentLevel = 0,
}) {
  const scrollContainerRef = useRef(null);

  // Auto-scroll to the right whenever path changes, so active crumb is in view
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [breadcrumbs.length, currentLevel]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50/90 border border-slate-200/70 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl text-xs backdrop-blur-xs select-none">
      {/* Pinned Back Button on Left */}
      {currentLevel > 0 && (
        <button
          type="button"
          onClick={onNavigateUp}
          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white border border-slate-200/90 text-slate-700 active:bg-slate-100 transition-colors cursor-pointer shrink-0 shadow-2xs flex items-center justify-center min-w-[32px] min-h-[32px]"
          title="এক ধাপ পেছনে যান"
          aria-label="এক ধাপ পেছনে যান"
        >
          <ArrowLeft className="size-3.5 sm:size-4" />
        </button>
      )}

      {/* Horizontally Scrollable Breadcrumb Trail (touch swipe friendly) */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none flex-nowrap flex-1 py-0.5 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <Fragment key={crumb.level}>
              {idx > 0 && (
                <ChevronRight className="size-3 text-slate-300 shrink-0 mx-0.5" />
              )}
              <button
                type="button"
                onClick={() => onJump(crumb.level)}
                disabled={isLast}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg transition-colors text-[11px] sm:text-xs font-medium cursor-pointer shrink-0 whitespace-nowrap min-h-[28px] sm:min-h-[30px] ${
                  isLast
                    ? "bg-white text-[var(--purple-700)] font-bold shadow-2xs border border-purple-200/80 cursor-default"
                    : "text-slate-600 active:bg-white/90"
                }`}
              >
                {crumb.level === 0 && (
                  <Home className="size-3 text-slate-400 shrink-0" />
                )}
                <span className="truncate max-w-[90px] xs:max-w-[120px] sm:max-w-[170px]">
                  {crumb.label}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-full font-semibold ${
                    isLast
                      ? "bg-[var(--purple-100)] text-[var(--purple-800)]"
                      : "bg-slate-200/70 text-slate-500"
                  }`}
                >
                  {crumb.count?.toLocaleString("bn-BD")}
                </span>
              </button>
            </Fragment>
          );
        })}
      </div>

      {/* Pinned Reset Button on Right */}
      {currentLevel > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-slate-500 active:bg-slate-200/60 transition-colors cursor-pointer text-[10px] sm:text-[11px] shrink-0 border border-transparent hover:border-slate-200"
          title="শুরুতে ফিরে যান"
          aria-label="শুরুতে ফিরে যান"
        >
          <RotateCcw className="size-3 sm:size-3.5" />
          <span className="hidden xs:inline">রিসেট</span>
        </button>
      )}
    </div>
  );
}
