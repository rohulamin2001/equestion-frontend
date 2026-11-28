import RichTextRender from "@/components/RichTextRender";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripHorizontal,
  Lock,
  Moon,
  Sun,
  Trash2,
  Type,
  Unlock,
} from "lucide-react";
import { useRef, useState } from "react";
import { BACKGROUND_TEMPLATES, BOARD_TOOLS } from "../constants/boardDefaults";

const FONT_SCALE_OPTIONS = [
  { label: "S", scale: 0.85 },
  { label: "M", scale: 1.0 },
  { label: "L", scale: 1.2 },
  { label: "XL", scale: 1.4 },
];

const OPTION_LABELS = ["ক", "খ", "গ", "ঘ", "ঙ"];
const ROMAN_NUMERALS = ["i.", "ii.", "iii.", "iv."];

/**
 * Renders the visual body of a QUESTION_CARD (shared by live overlay and offscreen PDF export).
 */
export function QuestionCardBody({ obj, useDarkCard = false, allowScroll = false }) {
  const snapshot = obj.payload?.snapshot || {};
  const reveal = obj.payload?.reveal || {};
  const fontScale = obj.style?.fontScale || 1;
  const compact = Boolean(obj.style?.compact);

  const hasLongOptions =
    Array.isArray(snapshot.options) &&
    snapshot.options.some((opt) => {
      const str = typeof opt === "object" ? opt.text || opt.label || "" : String(opt || "");
      return str.length > 48 || str.includes("\\frac");
    });

  const correctIdx =
    typeof snapshot.correctOptionIndex === "number"
      ? snapshot.correctOptionIndex
      : null;

  return (
    <div
      className={`px-5 py-4 space-y-3 leading-relaxed ${
        useDarkCard ? "text-slate-100" : "text-slate-900"
      }`}
      style={{ fontSize: `${Math.round(20 * fontScale)}px` }}
    >
      {/* Stimulus / Passage Box */}
      {snapshot.stimulus && (
        <div
          className={`p-3.5 rounded-xl border ${
            useDarkCard
              ? "bg-slate-800/80 border-slate-700 text-slate-100"
              : "bg-indigo-50/45 border-indigo-200/70 text-slate-800"
          } ${compact ? `max-h-36 overflow-y-auto ${allowScroll ? "pointer-events-auto" : ""}` : ""}`}
        >
          <RichTextRender content={snapshot.stimulus} />
        </div>
      )}

      {/* Main Question Prompt / Stem */}
      {snapshot.questionText && (
        <div className="font-medium">
          <RichTextRender content={snapshot.questionText} />
        </div>
      )}

      {/* Multiple Completion Statements (i, ii, iii) */}
      {Array.isArray(snapshot.statements) && snapshot.statements.length > 0 && (
        <div
          className={`pl-3 py-1.5 space-y-1 border-l-2 ${
            useDarkCard ? "border-purple-400/60" : "border-purple-300"
          }`}
        >
          {snapshot.statements.map((stmt, sIdx) => (
            <div key={sIdx} className="flex items-start gap-2">
              <span className="font-semibold shrink-0">
                {ROMAN_NUMERALS[sIdx] || `${sIdx + 1}.`}
              </span>
              <div className="flex-1 min-w-0">
                <RichTextRender content={String(stmt)} inline />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attached Question Image */}
      {snapshot.imageUrl && (
        <img
          src={snapshot.imageUrl}
          alt="প্রশ্নের ছবি"
          crossOrigin="anonymous"
          className="max-h-56 object-contain border border-slate-200 bg-white p-1 rounded-lg"
        />
      )}

      {/* MCQ Options Grid */}
      {Array.isArray(snapshot.options) && snapshot.options.length > 0 && (
        <div
          className={`grid gap-2 pt-1 ${
            hasLongOptions ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {snapshot.options.map((opt, idx) => {
            const optText = typeof opt === "object" ? opt.text || opt.label : opt;
            const isCorrectByIndex = correctIdx !== null && idx === correctIdx;
            const isCorrectByText =
              correctIdx === null &&
              snapshot.correctAnswer &&
              String(optText).trim() === String(snapshot.correctAnswer).trim();
            const isCorrect =
              reveal.answerVisible && (isCorrectByIndex || isCorrectByText);

            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 px-3.5 py-2 rounded-xl border transition ${
                  isCorrect
                    ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-300"
                    : useDarkCard
                      ? "bg-slate-800/70 border-slate-700 text-slate-100"
                      : "bg-slate-50/80 border-slate-200/80 text-slate-800"
                }`}
              >
                <span
                  className={`inline-flex size-7 items-center justify-center rounded-full text-[0.8em] font-bold shrink-0 mt-0.5 ${
                    isCorrect
                      ? "bg-emerald-600 text-white"
                      : useDarkCard
                        ? "bg-slate-700 text-slate-200"
                        : "bg-white border border-slate-300 text-slate-700"
                  }`}
                >
                  {OPTION_LABELS[idx] || idx + 1}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <RichTextRender content={String(optText || "")} inline />
                </div>
                {isCorrect && (
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-1" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Creative (ক, খ, গ, ঘ) or General Sub-questions */}
      {Array.isArray(snapshot.subQuestions) && snapshot.subQuestions.length > 0 && (
        <div
          className={`space-y-2 pt-2 border-t ${
            useDarkCard ? "border-slate-700" : "border-slate-100"
          }`}
        >
          {snapshot.subQuestions.map((sq, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="font-bold shrink-0">
                    {sq.label || `${OPTION_LABELS[idx] || idx + 1})`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <RichTextRender content={sq.text || sq.question || ""} inline />
                  </div>
                </div>
                {sq.marks !== null && sq.marks !== undefined && (
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-md text-[0.75em] font-semibold ${
                      useDarkCard
                        ? "bg-slate-800 text-slate-300"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {Number(sq.marks).toLocaleString("bn-BD")}
                  </span>
                )}
              </div>

              {reveal.answerVisible && sq.answer && (
                <div className="ml-6 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-[0.88em] text-emerald-950">
                  <span className="font-bold text-emerald-700">উত্তর: </span>
                  <RichTextRender content={sq.answer} inline />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Answer & Explanation Drawer inside card (for MCQ & General single-answer) */}
      {reveal.answerVisible &&
        (snapshot.correctAnswer ||
          snapshot.explanation ||
          snapshot.suggestedAnswer) && (
          <div className="mt-2 rounded-xl border border-emerald-300/90 bg-emerald-50/95 p-3.5 text-emerald-950 space-y-1.5">
            {snapshot.correctAnswer && (
              <div className="flex items-start gap-2 font-semibold">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <span>সঠিক উত্তর: </span>
                  <RichTextRender content={String(snapshot.correctAnswer)} inline />
                </div>
              </div>
            )}
            {snapshot.suggestedAnswer && (
              <div className="text-[0.92em]">
                <span className="font-bold text-emerald-700">নমুনা উত্তর: </span>
                <RichTextRender content={String(snapshot.suggestedAnswer)} inline />
              </div>
            )}
            {snapshot.explanation && (
              <div className="text-[0.88em] text-emerald-900 border-t border-emerald-200/80 pt-1.5">
                <span className="font-bold">ব্যাখ্যা: </span>
                <RichTextRender content={String(snapshot.explanation)} inline />
              </div>
            )}
          </div>
        )}
    </div>
  );
}

function QuestionCardItem({
  obj,
  viewport,
  isSelectMode,
  isDarkBoard,
  onUpdateObject,
  onDeleteObject,
  registerCardNode,
}) {
  const dragOriginRef = useRef(null);
  const resizeOriginRef = useRef(null);

  // Smooth local preview offset during drag/resize so Undo history commits only ONCE on pointerUp
  const [dragOffset, setDragOffset] = useState(null);
  const [resizeWidth, setResizeWidth] = useState(null);

  const snapshot = obj.payload?.snapshot || {};
  const reveal = obj.payload?.reveal || {};
  const fontScale = obj.style?.fontScale || 1;
  const cardOpacity = obj.style?.cardOpacity ?? 0.97;
  const cardTheme = obj.style?.cardTheme || "auto";
  const compact = Boolean(obj.style?.compact);
  const useDarkCard =
    cardTheme === "dark" || (cardTheme === "auto" && isDarkBoard);

  const stopBtnPointer = (e) => {
    e.stopPropagation();
  };

  const startDrag = (e) => {
    if (obj.locked) return;
    // Never steal pointer events from buttons, inputs, or links inside the header
    if (e.target.closest("button, a, input, select")) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragOriginRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: obj.x,
      startY: obj.y,
    };
    setDragOffset({ dx: 0, dy: 0 });
  };

  const moveDrag = (e) => {
    if (!dragOriginRef.current) return;
    e.stopPropagation();
    const dx = (e.clientX - dragOriginRef.current.clientX) / viewport.scale;
    const dy = (e.clientY - dragOriginRef.current.clientY) / viewport.scale;
    setDragOffset({ dx, dy });
  };

  const endDrag = (e) => {
    if (!dragOriginRef.current) return;
    e.stopPropagation();
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const dx = (e.clientX - dragOriginRef.current.clientX) / viewport.scale;
    const dy = (e.clientY - dragOriginRef.current.clientY) / viewport.scale;
    const finalX = Math.round(dragOriginRef.current.startX + dx);
    const finalY = Math.round(dragOriginRef.current.startY + dy);
    dragOriginRef.current = null;
    setDragOffset(null);
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      onUpdateObject(obj.id, { x: finalX, y: finalY });
    }
  };

  const startResize = (e) => {
    if (obj.locked) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    resizeOriginRef.current = {
      clientX: e.clientX,
      startWidth: obj.width || 1100,
    };
    setResizeWidth(obj.width || 1100);
  };

  const moveResize = (e) => {
    if (!resizeOriginRef.current) return;
    e.stopPropagation();
    const dx = (e.clientX - resizeOriginRef.current.clientX) / viewport.scale;
    setResizeWidth(
      Math.round(Math.max(460, Math.min(1820, resizeOriginRef.current.startWidth + dx))),
    );
  };

  const endResize = (e) => {
    if (!resizeOriginRef.current) return;
    e.stopPropagation();
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const dx = (e.clientX - resizeOriginRef.current.clientX) / viewport.scale;
    const nextWidth = Math.round(
      Math.max(460, Math.min(1820, resizeOriginRef.current.startWidth + dx)),
    );
    resizeOriginRef.current = null;
    setResizeWidth(null);
    if (Math.abs(dx) > 2) {
      onUpdateObject(obj.id, { width: nextWidth });
    }
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

  const toggleCardTheme = (e) => {
    e.stopPropagation();
    onUpdateObject(obj.id, {
      style: { ...obj.style, cardTheme: useDarkCard ? "light" : "dark" },
    });
  };

  const toggleCompact = (e) => {
    e.stopPropagation();
    onUpdateObject(obj.id, {
      style: { ...obj.style, compact: !compact },
    });
  };

  const toggleLock = (e) => {
    e.stopPropagation();
    onUpdateObject(obj.id, { locked: !obj.locked });
  };

  const renderedX = obj.x + (dragOffset?.dx || 0);
  const renderedY = obj.y + (dragOffset?.dy || 0);
  const renderedWidth = resizeWidth ?? (obj.width || 1100);

  return (
    <div
      ref={(el) => registerCardNode(obj.id, el)}
      style={{
        position: "absolute",
        left: `${renderedX}px`,
        top: `${renderedY}px`,
        width: `${renderedWidth}px`,
        opacity: cardOpacity,
        pointerEvents: "none",
      }}
      className={`rounded-2xl border shadow-lg transition-shadow font-bengali ${
        useDarkCard
          ? obj.locked
            ? "bg-slate-900/95 border-slate-700"
            : "bg-slate-900/95 border-purple-400/70 ring-1 ring-purple-500/30"
          : obj.locked
            ? "bg-white border-slate-200/90"
            : "bg-white border-indigo-300/90 ring-1 ring-indigo-100"
      }`}
    >
      {/* Header Controls (buttons stay 100% clickable regardless of drag or lock) */}
      <div
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ pointerEvents: "auto" }}
        className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-t-2xl border-b ${
          useDarkCard
            ? "border-slate-700/80 bg-slate-800/90"
            : "border-slate-100 bg-slate-50/95"
        } ${obj.locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
      >
        <div className="flex items-center gap-2 text-xs">
          {!obj.locked && <GripHorizontal className="size-4 text-slate-400" />}
          <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-semibold">
            {snapshot.categoryLabel || snapshot.category || snapshot.questionType || "প্রশ্ন"}
          </span>
          {snapshot.marks !== null && snapshot.marks !== undefined && (
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                useDarkCard
                  ? "bg-slate-700 text-slate-200"
                  : "bg-slate-200/70 text-slate-700"
              }`}
            >
              নম্বর: {Number(snapshot.marks).toLocaleString("bn-BD")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onPointerDown={stopBtnPointer}
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
            onPointerDown={stopBtnPointer}
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

          {snapshot.stimulus && (
            <button
              type="button"
              onPointerDown={stopBtnPointer}
              onClick={toggleCompact}
              title={compact ? "সম্পূর্ণ উদ্দীপক দেখুন" : "উদ্দীপক সংক্ষিপ্ত করুন"}
              className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {compact ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronUp className="size-3.5" />
              )}
            </button>
          )}

          <button
            type="button"
            onPointerDown={stopBtnPointer}
            onClick={toggleCardTheme}
            title={useDarkCard ? "হালকা কার্ড থিম" : "ডার্ক কার্ড থিম"}
            className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {useDarkCard ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>

          <button
            type="button"
            onPointerDown={stopBtnPointer}
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
            onPointerDown={stopBtnPointer}
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

      <QuestionCardBody
        obj={obj}
        useDarkCard={useDarkCard}
        allowScroll={isSelectMode}
      />

      {/* Right Edge Resize Handle */}
      {!obj.locked && (
        <div
          onPointerDown={startResize}
          onPointerMove={moveResize}
          onPointerUp={endResize}
          onPointerCancel={endResize}
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
  isDarkBoard = false,
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
            isDarkBoard={isDarkBoard}
            onUpdateObject={onUpdateObject}
            onDeleteObject={onDeleteObject}
            registerCardNode={registerCardNode}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Shared hidden container for rendering Question Cards offscreen when exporting inactive slides to PDF.
 */
export function OffscreenQuestionExportHost({ slide, registerNode }) {
  if (!slide) return null;
  const cards = (slide.objects || []).filter(
    (o) => o.type === "QUESTION_CARD" && o.visible !== false,
  );
  if (cards.length === 0) return null;

  const bgType = slide.canvas?.background?.type || "WHITEBOARD";
  const darkBg = Boolean(BACKGROUND_TEMPLATES[bgType]?.isDark);

  return (
    <div
      className="fixed -left-[99999px] top-0 pointer-events-none font-bengali"
      aria-hidden
    >
      {cards.map((qObj) => {
        const cardTheme = qObj.style?.cardTheme || "auto";
        const useDarkCard =
          cardTheme === "dark" || (cardTheme === "auto" && darkBg);
        return (
          <div
            key={qObj.id}
            ref={(el) => registerNode(qObj.id, el)}
            style={{
              width: `${qObj.width || 1100}px`,
              opacity: qObj.style?.cardOpacity ?? 0.97,
            }}
            className={`rounded-2xl border shadow-lg ${
              useDarkCard
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-slate-200"
            }`}
          >
            <QuestionCardBody obj={qObj} useDarkCard={useDarkCard} />
          </div>
        );
      })}
    </div>
  );
}
