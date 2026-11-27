import { Lock, Magnet, RotateCw, Unlock, X } from "lucide-react";
import { useRef } from "react";

/**
 * Interactive Virtual Ruler (edge-snapping) and Protractor (0-180 degrees)
 * synced to Konva Stage world coordinates.
 */
export default function StemToolsOverlay({
  viewport,
  rulerTool,
  onChangeRuler,
  protractorTool,
  onChangeProtractor,
}) {
  const dragRef = useRef(null);

  const startDrag = (kind, currentObj, e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      kind,
      clientX: e.clientX,
      clientY: e.clientY,
      startX: currentObj.x,
      startY: currentObj.y,
    };
  };

  const onMove = (e) => {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.clientX) / viewport.scale;
    const dy = (e.clientY - dragRef.current.clientY) / viewport.scale;
    const nextPos = {
      x: Math.round(dragRef.current.startX + dx),
      y: Math.round(dragRef.current.startY + dy),
    };
    if (dragRef.current.kind === "ruler") {
      onChangeRuler((prev) => ({ ...prev, ...nextPos }));
    } else {
      onChangeProtractor((prev) => ({ ...prev, ...nextPos }));
    }
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  if (!rulerTool?.visible && !protractorTool?.visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Virtual Snap-to-Edge Ruler */}
        {rulerTool?.visible && (
          <div
            onPointerDown={(e) => startDrag("ruler", rulerTool, e)}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            style={{
              pointerEvents: "auto",
              position: "absolute",
              left: `${rulerTool.x}px`,
              top: `${rulerTool.y}px`,
              width: `${rulerTool.length || 560}px`,
              height: `${rulerTool.height || 86}px`,
              transform: `rotate(${rulerTool.rotation || 0}deg)`,
              transformOrigin: "0 0",
            }}
            className="rounded-lg border-2 border-amber-500/80 bg-amber-100/80 backdrop-blur-xs shadow-lg cursor-grab active:cursor-grabbing select-none font-sans"
          >
            {/* Centimeter Tick Marks */}
            <svg
              width="100%"
              height="24"
              className="block border-b border-amber-400/50"
            >
              {Array.from({ length: 56 }, (_, i) => {
                const xPos = i * 10;
                const isMajor = i % 5 === 0;
                return (
                  <g key={i}>
                    <line
                      x1={xPos}
                      y1={0}
                      x2={xPos}
                      y2={isMajor ? 16 : 9}
                      stroke="#78350F"
                      strokeWidth={isMajor ? 1.5 : 1}
                    />
                    {isMajor && i > 0 && (
                      <text
                        x={xPos - 4}
                        y={22}
                        fontSize="9"
                        fill="#78350F"
                        fontWeight="bold"
                      >
                        {i / 5}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="px-3 py-1.5 flex items-center justify-between text-xs text-amber-950 font-bengali">
              <div className="flex items-center gap-2">
                <span className="font-bold">স্কেল</span>
                <span className="font-sans text-[11px] bg-white/70 px-1.5 py-0.5 rounded">
                  {Math.round(rulerTool.rotation || 0)}°
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="এজ-স্ন্যাপ অন/অফ"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() =>
                    onChangeRuler((p) => ({
                      ...p,
                      snapEnabled: !p.snapEnabled,
                    }))
                  }
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                    rulerTool.snapEnabled
                      ? "bg-amber-600 text-white"
                      : "bg-white/70 text-amber-900"
                  }`}
                >
                  <Magnet className="size-3" />
                  <span>স্ন্যাপ</span>
                </button>
                <button
                  type="button"
                  title="১৫° ঘোরান"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() =>
                    onChangeRuler((p) => ({
                      ...p,
                      rotation: ((p.rotation || 0) + 15) % 360,
                    }))
                  }
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/75 hover:bg-white text-[11px] cursor-pointer"
                >
                  <RotateCw className="size-3" />
                  <span>+১৫°</span>
                </button>
                <button
                  type="button"
                  title="-১৫° ঘোরান"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() =>
                    onChangeRuler((p) => ({
                      ...p,
                      rotation: ((p.rotation || 0) - 15 + 360) % 360,
                    }))
                  }
                  className="px-2 py-0.5 rounded bg-white/75 hover:bg-white text-[11px] cursor-pointer"
                >
                  -১৫°
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() =>
                    onChangeRuler((p) => ({ ...p, visible: false }))
                  }
                  className="p-0.5 rounded hover:bg-rose-100 text-rose-700 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Virtual 0-180 Protractor */}
        {protractorTool?.visible && (
          <div
            onPointerDown={(e) => startDrag("protractor", protractorTool, e)}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            style={{
              pointerEvents: "auto",
              position: "absolute",
              left: `${protractorTool.x}px`,
              top: `${protractorTool.y}px`,
              width: "340px",
              height: "190px",
              transform: `rotate(${protractorTool.rotation || 0}deg)`,
              transformOrigin: "170px 165px",
            }}
            className="cursor-grab active:cursor-grabbing select-none"
          >
            <svg viewBox="0 0 340 190" className="w-full h-full drop-shadow-md">
              <path
                d="M 15 165 A 155 155 0 0 1 325 165 Z"
                fill="rgba(224, 231, 255, 0.72)"
                stroke="#4F46E5"
                strokeWidth="2"
              />
              <circle cx="170" cy="165" r="5" fill="#4F46E5" />
              {Array.from({ length: 19 }, (_, i) => {
                const deg = i * 10;
                const rad = (deg * Math.PI) / 180;
                const rOuter = 152;
                const rInner = deg % 30 === 0 ? 132 : 142;
                const x1 = 170 - Math.cos(rad) * rOuter;
                const y1 = 165 - Math.sin(rad) * rOuter;
                const x2 = 170 - Math.cos(rad) * rInner;
                const y2 = 165 - Math.sin(rad) * rInner;
                const tx = 170 - Math.cos(rad) * 116;
                const ty = 165 - Math.sin(rad) * 116;
                return (
                  <g key={deg}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#312E81"
                      strokeWidth={deg % 30 === 0 ? 1.8 : 1}
                    />
                    {deg % 30 === 0 && (
                      <text
                        x={tx}
                        y={ty + 3}
                        fontSize="9"
                        fontWeight="bold"
                        fill="#312E81"
                        textAnchor="middle"
                      >
                        {deg}°
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-lg bg-white/95 border border-indigo-200 px-2 py-0.5 shadow text-[11px] font-bengali">
              <span className="font-bold text-indigo-800">
                চাঁদা ({Math.round(protractorTool.rotation || 0)}°)
              </span>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() =>
                  onChangeProtractor((p) => ({
                    ...p,
                    rotation: ((p.rotation || 0) + 15) % 360,
                  }))
                }
                className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 cursor-pointer"
              >
                +১৫°
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() =>
                  onChangeProtractor((p) => ({
                    ...p,
                    locked: !p.locked,
                  }))
                }
                className="p-0.5 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
              >
                {protractorTool.locked ? (
                  <Lock className="size-3" />
                ) : (
                  <Unlock className="size-3" />
                )}
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() =>
                  onChangeProtractor((p) => ({ ...p, visible: false }))
                }
                className="p-0.5 rounded hover:bg-rose-100 text-rose-600 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
