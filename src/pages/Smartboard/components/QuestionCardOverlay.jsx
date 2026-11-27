import RichTextRender from "@/components/RichTextRender";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  GripHorizontal,
  Lock,
  Trash2,
  Type,
  Unlock,
} from "lucide-react";
import { useRef } from "react";
import { BOARD_TOOLS } from "../constants/boardDefaults";

const FONT_SCALE_OPTIONS = [
  { label: "S", scale: 0.85 },
  { label: "M", scale: 1.0 },
  { label: "L", scale: 1.2 },
  { label: "XL", scale: 1.4 },
];

const OPTION_LABELS = ["ক", "খ", "গ", "ঘ"];

function QuestionCardItem({
  obj,
  viewport,
  isSelectMode,
  onUpdateObject,
  onDeleteObject,
  registerCardNode,
}) {
  const dragOriginRef = useRef(null);
  const resizeOriginRef = useRef(null);

  const snapshot = obj.payload?.snapshot || {};
  const reveal = obj.payload?.reveal || {};
  const fontScale = obj.style?.fontScale || 1;
  const cardOpacity = obj.style?.cardOpacity ?? 0.96;

  const startDrag = (e) => {
    if (obj.locked) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragOriginRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: obj.x,
      startY: obj.y,
    };
  };

  const moveDrag = (e) => {
    if (!dragOriginRef.current) return;
    e.stopPropagation();
    const dx = (e.clientX - dragOriginRef.current.clientX) / viewport.scale;
    const dy = (e.clientY - dragOriginRef.current.clientY) / viewport.scale;
    onUpdateObject(obj.id, {
      x: Math.round(dragOriginRef.current.startX + dx),
      y: Math.round(dragOriginRef.current.startY + dy),
    });
  };

  const endDrag = (e) => {
    if (!dragOriginRef.current) return;
    e.stopPropagation();
    dragOriginRef.current = null;
  };

  const startResize = (e) => {
    if (obj.locked) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    resizeOriginRef.current = {
      clientX: e.clientX,
      startWidth: obj.width || 960,
    };
  };

  const moveResize = (e) => {
    if (!resizeOriginRef.current) return;
    e.stopPropagation();
    const dx = (e.clientX - resizeOriginRef.current.clientX) / viewport.scale;
    const nextWidth = Math.max(420, Math.min(1800, resizeOriginRef.current.startWidth + dx));
    onUpdateObject(obj.id, { width: Math.round(nextWidth) });
  };

  const endResize = (e) => {
    if (!resizeOriginRef.current) return;
    e.stopPropagation();
    resizeOriginRef.current = null;
  };

  const toggleRevealAnswer = (e) => {
    e.stopPropagation();
    const nextVisible = !reveal.answerVisible;
    onUpdateObject(obj.id, {
      payload: {
        ...obj.payload,
        reveal: {
          ...reveal,
          answerVisible: nextVisible,
          explanationVisible: nextVisible,
        },
      },
    });
  };

  const cycleFontScale = (e) => {
    e.stopPropagation();
    const idx = FONT_SCALE_OPTIONS.findIndex(
      (f) => Math.abs(f.scale - fontScale) < 0.05,
    );
    const next = FONT_SCALE_OPTIONS[(idx + 1) % FONT_SCALE_OPTIONS.length];
    onUpdateObject(obj.id, {
      style: { ...obj.style, fontScale: next.scale },
    });
  };

  const toggleLock = (e) => {
    e.stopPropagation();
    onUpdateObject(obj.id, { locked: !obj.locked });
  };

  const isBodyInteractive = isSelectMode && !obj.locked;

  return (
    <div
      ref={(el) => registerCardNode(obj.id, el)}
      style={{
        position: "absolute",
        left: `${obj.x}px`,
        top: `${obj.y}px`,
        width: `${obj.width || 1000}px`,
        opacity: cardOpacity,
        pointerEvents: isBodyInteractive ? "auto" : "none",
      }}
      className={`rounded-2xl border bg-white shadow-lg transition-shadow font-bengali ${
        obj.locked
          ? "border-slate-200/90"
          : "border-indigo-300/90 ring-1 ring-indigo-100"
      }`}
    >
      {/* Compact Header Controls (always clickable for Answer/Lock) */}
      <div
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        style={{ pointerEvents: "auto" }}
        className={`flex items-center justify-between gap-2 px-4 py-2 rounded-t-2xl border-b border-slate-100 bg-slate-50/95 ${
          obj.locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <div className="flex items-center gap-2 text-xs text-slate-600">
          {!obj.locked && <GripHorizontal className="size-4 text-slate-400" />}
          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-semibold">
            {snapshot.questionType || "প্রশ্ন"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleRevealAnswer}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
              reveal.answerVisible
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            {reveal.answerVisible ? (
              <>
                <EyeOff className="size-3" />
                <span>উত্তর লুকান</span>
              </>
            ) : (
              <>
                <Eye className="size-3" />
                <span>উত্তর দেখুন</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={cycleFontScale}
            title="ফন্ট সাইজ পরিবর্তন"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
          >
            <Type className="size-3" />
            <span>
              {FONT_SCALE_OPTIONS.find((f) => Math.abs(f.scale - fontScale) < 0.05)
                ?.label || "M"}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleLock}
            title={obj.locked ? "আনলক করুন" : "কার্ড পিন/লক করুন"}
            className={`inline-flex items-center justify-center p-1.5 rounded-lg border transition cursor-pointer ${
              obj.locked
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
            }`}
          >
            {obj.locked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteObject(obj.id);
            }}
            title="প্রশ্ন কার্ড মুছুন"
            className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Question Body (Scaled cleanly with RichTextRender + KaTeX) */}
      <div
        className="px-5 py-4 space-y-3 text-slate-900 leading-relaxed"
        style={{ fontSize: `${Math.round(20 * fontScale)}px` }}
      >
        {snapshot.stimulus && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700">
            <RichTextRender content={snapshot.stimulus} />
          </div>
        )}

        {snapshot.questionText && (
          <div className="font-medium">
            <RichTextRender content={snapshot.questionText} />
          </div>
        )}

        {snapshot.imageUrl && (
          <img
            src={snapshot.imageUrl}
            alt="প্রশ্নের ছবি"
            crossOrigin="anonymous"
            className="max-h-56 object-contain border border-slate-200"
          />
        )}

        {Array.isArray(snapshot.options) && snapshot.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {snapshot.options.map((opt, idx) => {
              const optText = typeof opt === "object" ? opt.text || opt.label : opt;
              const isCorrect =
                reveal.answerVisible &&
                snapshot.correctAnswer &&
                String(optText).trim() === String(snapshot.correctAnswer).trim();
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2 px-3 py-2 rounded-xl border ${
                    isCorrect
                      ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                      : "bg-slate-50/70 border-slate-200/80"
                  }`}
                >
                  <span className="font-bold shrink-0">
                    ({OPTION_LABELS[idx] || idx + 1})
                  </span>
                  <div className="min-w-0 flex-1">
                    <RichTextRender content={String(optText || "")} inline />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {Array.isArray(snapshot.subQuestions) && snapshot.subQuestions.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            {snapshot.subQuestions.map((sq, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-bold shrink-0">
                  {OPTION_LABELS[idx] || idx + 1})
                </span>
                <div className="flex-1 min-w-0">
                  <RichTextRender content={sq.question || sq.text || ""} inline />
                </div>
              </div>
            ))}
          </div>
        )}

        {reveal.answerVisible && (snapshot.correctAnswer || snapshot.explanation) && (
          <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-emerald-950 space-y-1.5">
            {snapshot.correctAnswer && (
              <div className="flex items-start gap-2 font-semibold">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <span>সঠিক উত্তর: </span>
                  <RichTextRender content={String(snapshot.correctAnswer)} inline />
                </div>
              </div>
            )}
            {snapshot.explanation && (
              <div className="text-[0.9em] text-emerald-900 border-t border-emerald-200/70 pt-1.5">
                <span className="font-semibold">ব্যাখ্যা: </span>
                <RichTextRender content={String(snapshot.explanation)} inline />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Edge Resize Handle */}
      {!obj.locked && (
        <div
          onPointerDown={startResize}
          onPointerMove={moveResize}
          onPointerUp={endResize}
          style={{ pointerEvents: "auto" }}
          title="প্রস্থ পরিবর্তন করুন"
          className="absolute top-12 right-0 w-2.5 h-16 cursor-ew-resize rounded-l bg-indigo-400/40 hover:bg-indigo-500 transition"
        />
      )}
    </div>
  );
}

/**
 * Synchronized HTML/KaTeX DOM overlay anchored to the Konva Stage world transform.
 */
export default function QuestionCardOverlay({
  objects,
  viewport,
  activeTool,
  onUpdateObject,
  onDeleteObject,
  registerCardNode,
}) {
  const questionCards = (objects || []).filter(
    (o) => o.type === "QUESTION_CARD" && o.visible !== false,
  );
  if (questionCards.length === 0) return null;

  const isSelectMode = activeTool === BOARD_TOOLS.SELECT;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-label="প্রশ্ন কার্ড লেয়ার"
    >
      <div
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {questionCards.map((card) => (
          <QuestionCardItem
            key={card.id}
            obj={card}
            viewport={viewport}
            isSelectMode={isSelectMode}
            onUpdateObject={onUpdateObject}
            onDeleteObject={onDeleteObject}
            registerCardNode={registerCardNode}
          />
        ))}
      </div>
    </div>
  );
}
