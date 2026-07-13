import React from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Eraser,
  Minus,
  Plus,
} from "lucide-react";

export default function FloatingFormatToolbar({
  visible,
  position = { top: 0, left: 0 },
  fontSize = 14,
  onChangeFontSize,
}) {
  if (!visible) return null;

  const handleCommand = (e, command, value = null) => {
    e.preventDefault();
    document.execCommand(command, false, value);
  };

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 print:hidden transition-all duration-200 ease-out flex items-center gap-1.5 px-4 py-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-full text-slate-200"
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className="text-[11px] font-bold text-slate-400 border-r border-slate-700/60 pr-2.5 mr-1 hidden sm:inline">
        টেক্সট ফরম্যাট
      </span>

      {/* Font Size controls */}
      {onChangeFontSize && (
        <div className="flex items-center gap-1 border-r border-slate-700/60 pr-2 mr-1">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onChangeFontSize(Math.max(10, fontSize - 1));
            }}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
            title="ফন্ট ছোট করুন"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="text-xs font-black min-w-[24px] text-center font-sans text-white">
            {fontSize}
          </span>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onChangeFontSize(Math.min(32, fontSize + 1));
            }}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
            title="ফন্ট বড় করুন"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      )}

      {/* Basic formatting */}
      <div className="flex items-center gap-0.5 border-r border-slate-700/60 pr-2 mr-1">
        <button
          type="button"
          onMouseDown={(e) => handleCommand(e, "bold")}
          className="p-1.5 hover:bg-slate-800 hover:text-indigo-400 rounded-lg transition cursor-pointer"
          title="Bold (গাঢ়)"
        >
          <Bold className="size-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleCommand(e, "italic")}
          className="p-1.5 hover:bg-slate-800 hover:text-indigo-400 rounded-lg transition cursor-pointer"
          title="Italic (বাঁকা)"
        >
          <Italic className="size-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleCommand(e, "underline")}
          className="p-1.5 hover:bg-slate-800 hover:text-indigo-400 rounded-lg transition cursor-pointer"
          title="Underline"
        >
          <Underline className="size-3.5" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 border-r border-slate-700/60 pr-2 mr-1">
        <button
          type="button"
          onMouseDown={(e) => handleCommand(e, "justifyLeft")}
          className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="size-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleCommand(e, "justifyCenter")}
          className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="size-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleCommand(e, "justifyRight")}
          className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition cursor-pointer"
          title="Align Right"
        >
          <AlignRight className="size-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleCommand(e, "justifyFull")}
          className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition cursor-pointer"
          title="Justify"
        >
          <AlignJustify className="size-3.5" />
        </button>
      </div>

      {/* Clear Formatting */}
      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, "removeFormat")}
        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
        title="ফরম্যাটিং মুছুন"
      >
        <Eraser className="size-3.5" />
      </button>
    </div>
  );
}
