import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move,
  Scan,
  AlertTriangle,
} from "lucide-react";
import { createPortal } from "react-dom";

export default function OMRInteractiveImageViewer({
  imageSrc,
  alt = "OMR Sheet Preview",
  className = "",
  initialZoom = 1,
}) {
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Reset view when image source changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  }, [imageSrc]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(6, Number((prev + 0.5).toFixed(1))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(1, Number((prev - 0.5).toFixed(1)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleSetZoom = useCallback((level) => {
    setZoom(level);
    if (level === 1) setPan({ x: 0, y: 0 });
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  // Double click to toggle zoom
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    setZoom((prev) => {
      if (prev > 1.2) {
        setPan({ x: 0, y: 0 });
        return 1;
      }
      return 2.5;
    });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.3 : -0.3;
    setZoom((prev) => {
      const next = Math.min(6, Math.max(1, Number((prev + delta).toFixed(2))));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Mouse drag to pan
  const handleMouseDown = useCallback(
    (e) => {
      if (zoom <= 1) return;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
    },
    [zoom, pan]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || zoom <= 1) return;
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    },
    [isDragging, zoom]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const renderControls = (inFullscreen = false) => (
    <div className="flex items-center flex-wrap justify-between gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 text-white shadow-xl z-20">
      {/* Zoom In/Out & Value */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          title="জুম কমান (-)"
          className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4 text-slate-300" />
        </button>

        <span className="px-2 py-0.5 min-w-[54px] text-center font-mono font-bold text-xs bg-slate-800/80 rounded-md text-purple-300 border border-purple-500/20">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoom >= 6}
          title="জুম বাড়ান (+)"
          className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4 text-slate-300" />
        </button>
      </div>

      {/* Preset Quick Zoom Pills */}
      <div className="hidden sm:flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => handleSetZoom(lvl)}
            className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
              zoom === lvl
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {lvl}x
          </button>
        ))}
      </div>

      {/* Action Tools: Rotate, Reset, Fullscreen */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleRotate}
          title="ডানে ঘোরান (৯০°)"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleReset}
          title="রিসেট করুন (১০০%)"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={inFullscreen ? "ফুলস্ক্রিন বন্ধ" : "ফুলস্ক্রিন ভিউয়ার"}
          className="p-1.5 rounded-lg hover:bg-purple-600/30 text-purple-400 hover:text-purple-200 transition-colors cursor-pointer ml-1 border border-purple-500/30"
        >
          {inFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  const renderImageCanvas = (fullMode = false) => {
    if (!imageSrc) {
      return (
        <div className="w-full h-full min-h-[350px] flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
          <AlertTriangle className="w-8 h-8 opacity-40 text-amber-500" />
          <span>ওভারলে ছবি পাওয়া যায়নি</span>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${
          zoom > 1
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-zoom-in"
        }`}
        style={{ touchAction: "none" }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
          className="relative max-w-full max-h-full flex items-center justify-center"
        >
          <img
            src={imageSrc}
            alt={alt}
            draggable={false}
            className={`w-auto object-contain rounded-lg shadow-2xl ${
              fullMode ? "max-h-[85vh]" : "max-h-[460px]"
            }`}
          />
        </div>

        {/* Floating Pan Indicator when Zoomed */}
        {zoom > 1 && (
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 text-[10px] text-slate-300 font-medium flex items-center gap-1.5 pointer-events-none shadow-md">
            <Move className="w-3 h-3 text-purple-400 animate-pulse" />
            <span>ড্র্যাগ করে খাতাটি সরান | ডাবল ক্লিকে রিসেট</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Top Controls Toolbar */}
      {renderControls(false)}

      {/* Main Inline Canvas */}
      <div className="w-full min-h-[380px] max-h-[520px] bg-slate-950 rounded-2xl flex flex-col items-center justify-center overflow-hidden border border-slate-800 shadow-inner relative">
        {renderImageCanvas(false)}
      </div>

      {/* Fullscreen Modal View (Portal) */}
      {isFullscreen &&
        createPortal(
          <div className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 animate-in fade-in duration-150">
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white text-sm font-bold">
                <Scan className="w-5 h-5 text-purple-400" />
                <span>ওএমআর খাতা ফুলস্ক্রিন হাই-রেজোলিউশন ভিউয়ার</span>
                <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                  (স্ক্রোল করে জুম করুন অথবা ড্র্যাগ করে যে কোনো বাবল নিখুঁতভাবে দেখুন)
                </span>
              </div>

              {renderControls(true)}
            </div>

            {/* Fullscreen Canvas Body */}
            <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden my-2">
              {renderImageCanvas(true)}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
