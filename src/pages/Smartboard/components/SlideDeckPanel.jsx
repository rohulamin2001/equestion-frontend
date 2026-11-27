import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";

export default function SlideDeckPanel({
  open,
  onToggleOpen,
  slides,
  activeSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
}) {
  return (
    <div className="pointer-events-auto fixed left-3 top-20 bottom-20 z-20 flex items-start gap-2 font-bengali">
      {open && (
        <div className="w-48 h-full max-h-[75vh] rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xl flex flex-col overflow-hidden">
          <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 inline-flex items-center gap-1.5">
              <Layers className="size-3.5 text-purple-600" />
              <span>পৃষ্ঠাসমূহ ({slides.length.toLocaleString("bn-BD")})</span>
            </span>
            <button
              type="button"
              onClick={onAddSlide}
              title="নতুন পৃষ্ঠা"
              className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold cursor-pointer"
            >
              <Plus className="size-3" />
              <span>নতুন</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {slides.map((s, idx) => {
              const isActive = idx === activeSlideIndex;
              const bgColor = s.canvas?.background?.color || "#FFFFFF";
              const qCount = (s.objects || []).filter(
                (o) => o.type === "QUESTION_CARD",
              ).length;
              const objCount = (s.objects || []).length;

              return (
                <div
                  key={s._id || s.localId || idx}
                  onClick={() => onSelectSlide(idx)}
                  className={`group rounded-xl border p-2 cursor-pointer transition ${
                    isActive
                      ? "border-purple-600 bg-purple-50/70 ring-1 ring-purple-300"
                      : "border-slate-200 bg-white hover:border-purple-300"
                  }`}
                >
                  <div
                    style={{ backgroundColor: bgColor }}
                    className="h-16 rounded-lg border border-slate-200/80 flex flex-col items-center justify-center text-[10px] text-slate-500 px-2 text-center"
                  >
                    <span className="font-bold">
                      পৃষ্ঠা {(idx + 1).toLocaleString("bn-BD")}
                    </span>
                    <span className="opacity-75">
                      {qCount > 0
                        ? `${qCount.toLocaleString("bn-BD")}টি প্রশ্ন`
                        : `${objCount.toLocaleString("bn-BD")} আইটেম`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1.5 px-0.5">
                    <span className="text-[10px] font-semibold text-slate-600 truncate">
                      {s.title || `স্লাইড ${idx + 1}`}
                    </span>
                    <div className="flex items-center gap-1 opacity-75 group-hover:opacity-100">
                      <button
                        type="button"
                        title="ডুপ্লিকেট"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateSlide(idx);
                        }}
                        className="p-0.5 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                      >
                        <Copy className="size-3" />
                      </button>
                      {slides.length > 1 && (
                        <button
                          type="button"
                          title="মুছুন"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSlide(idx);
                          }}
                          className="p-0.5 rounded hover:bg-rose-100 text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onToggleOpen}
        title={open ? "স্লাইড প্যানেল লুকান" : "স্লাইড প্যানেল দেখান"}
        className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 bg-white/95 shadow-md text-slate-600 hover:text-purple-700 cursor-pointer"
      >
        {open ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
      </button>
    </div>
  );
}
