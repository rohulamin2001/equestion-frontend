import {
  ArrowUpRight,
  Circle,
  Eraser,
  Feather,
  Hand,
  Highlighter,
  Minus,
  MousePointer2,
  PenTool,
  Redo2,
  Shapes,
  Sparkles,
  Square,
  Trash2,
  Triangle,
  Type,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import {
  BOARD_TOOLS,
  DARK_PEN_COLORS,
  HIGHLIGHTER_COLORS,
  LIGHT_PEN_COLORS,
  SHAPE_TOOLS,
  STROKE_WIDTHS,
} from "../constants/boardDefaults";

export default function FloatingToolbar({
  activeTool,
  onSelectTool,
  brushColor,
  onChangeColor,
  strokeWidth,
  onChangeWidth,
  penOnly,
  onTogglePenOnly,
  isDarkBoard,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearStrokes,
  onClearPage,
}) {
  const [showShapeMenu, setShowShapeMenu] = useState(false);

  const palette =
    activeTool === BOARD_TOOLS.HIGHLIGHTER
      ? HIGHLIGHTER_COLORS
      : isDarkBoard
        ? DARK_PEN_COLORS
        : LIGHT_PEN_COLORS;

  const isShapeActive = SHAPE_TOOLS.some((s) => s.id === activeTool);

  const toolButtons = [
    { id: BOARD_TOOLS.SELECT, label: "সিলেক্ট", icon: MousePointer2 },
    { id: BOARD_TOOLS.HAND, label: "প্যান / সরান", icon: Hand },
    { id: BOARD_TOOLS.PEN, label: "পেন", icon: PenTool },
    { id: BOARD_TOOLS.FOUNTAIN, label: "ফাউন্টেন পেন", icon: Feather },
    { id: BOARD_TOOLS.HIGHLIGHTER, label: "হাইলাইটার", icon: Highlighter },
    { id: BOARD_TOOLS.DASHED_PEN, label: "ড্যাশড লাইন", icon: Minus },
    { id: BOARD_TOOLS.ERASER, label: "ইরেজার", icon: Eraser },
    { id: BOARD_TOOLS.TEXT, label: "টেক্সট", icon: Type },
    { id: BOARD_TOOLS.LASER, label: "লেজার", icon: Sparkles },
  ];

  const getShapeIcon = (id) => {
    if (id === BOARD_TOOLS.ELLIPSE) return Circle;
    if (
      id === BOARD_TOOLS.RIGHT_TRIANGLE ||
      id === BOARD_TOOLS.EQUILATERAL_TRIANGLE
    ) {
      return Triangle;
    }
    if (id === BOARD_TOOLS.ARROW) return ArrowUpRight;
    return Square;
  };

  return (
    <div className="pointer-events-auto absolute bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-[96%] font-bengali">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md px-2.5 py-2 shadow-xl">
        {/* Main Tool Buttons */}
        <div className="flex items-center gap-1">
          {toolButtons.map((t) => {
            const Icon = t.icon;
            const active = activeTool === t.id;
            return (
              <button
                key={t.id}
                type="button"
                title={t.label}
                onClick={() => {
                  onSelectTool(t.id);
                  setShowShapeMenu(false);
                }}
                className={`inline-flex size-9 items-center justify-center rounded-xl transition cursor-pointer ${
                  active
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="size-4" />
              </button>
            );
          })}

          {/* Shapes Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              title="জ্যামিতিক শেপ"
              onClick={() => setShowShapeMenu((v) => !v)}
              className={`inline-flex size-9 items-center justify-center rounded-xl transition cursor-pointer ${
                isShapeActive
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Shapes className="size-4" />
            </button>

            {showShapeMenu && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl space-y-0.5 z-50">
                {SHAPE_TOOLS.map((shp) => {
                  const SIcon = getShapeIcon(shp.id);
                  const active = activeTool === shp.id;
                  return (
                    <button
                      key={shp.id}
                      type="button"
                      onClick={() => {
                        onSelectTool(shp.id);
                        setShowShapeMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                        active
                          ? "bg-purple-50 text-purple-700 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <SIcon className="size-3.5" />
                      <span>{shp.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <span className="hidden sm:block h-6 w-px bg-slate-200 mx-0.5" />

        {/* Color Swatches */}
        <div className="flex items-center gap-1 px-1">
          {palette.map((c) => {
            const active = brushColor.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => onChangeColor(c)}
                style={{ backgroundColor: c }}
                className={`size-5 rounded-full border transition cursor-pointer ${
                  active
                    ? "ring-2 ring-purple-500 ring-offset-1 border-white scale-110"
                    : "border-slate-300 hover:scale-105"
                }`}
              />
            );
          })}
        </div>

        {/* Stroke Width Dots */}
        <div className="hidden md:flex items-center gap-1 px-1">
          {STROKE_WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              title={`পুরুত্ব ${w}px`}
              onClick={() => onChangeWidth(w)}
              className={`inline-flex size-7 items-center justify-center rounded-lg border transition cursor-pointer ${
                strokeWidth === w
                  ? "bg-purple-50 border-purple-300"
                  : "border-transparent hover:bg-slate-100"
              }`}
            >
              <span
                className="rounded-full bg-slate-800 block"
                style={{
                  width: `${Math.min(14, Math.max(4, w + 2))}px`,
                  height: `${Math.min(14, Math.max(4, w + 2))}px`,
                }}
              />
            </button>
          ))}
        </div>

        <span className="hidden sm:block h-6 w-px bg-slate-200 mx-0.5" />

        {/* History, Palm Rejection & Clear */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            onClick={onUndo}
            className="inline-flex size-8 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            disabled={!canRedo}
            onClick={onRedo}
            className="inline-flex size-8 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
          >
            <Redo2 className="size-4" />
          </button>

          <button
            type="button"
            title="শুধু স্টাইলাস পেন মোড (Palm Rejection)"
            onClick={onTogglePenOnly}
            className={`px-2 py-1 rounded-xl text-[11px] font-semibold border transition cursor-pointer ${
              penOnly
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            পেন-অনলি
          </button>

          <button
            type="button"
            title="সব দাগ মুছুন"
            onClick={onClearStrokes}
            className="px-2 py-1 rounded-xl text-[11px] border border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700 cursor-pointer"
          >
            দাগ মুছুন
          </button>

          <button
            type="button"
            title="পুরো পৃষ্ঠা ক্লিয়ার করুন"
            onClick={onClearPage}
            className="inline-flex size-8 items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
