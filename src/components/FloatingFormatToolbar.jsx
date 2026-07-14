import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Eraser,
  Highlighter,
  Italic,
  Minus,
  Plus,
  Underline,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingFormatToolbar({
  visible,
  fontSize = 14,
  onChangeFontSize,
}) {
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);

  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);

  const textColors = [
    { name: "Slate", value: "#1e293b" },
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Purple", value: "#a855f7" },
    { name: "Orange", value: "#f97316" },
  ];

  const bgColors = [
    { name: "None", value: "transparent" },
    { name: "Yellow", value: "#fef08a" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Pink", value: "#fbcfe8" },
    { name: "Orange", value: "#fed7aa" },
  ];

  const toggleTextColor = (e) => {
    e.preventDefault();
    setShowTextColor(!showTextColor);
    setShowBgColor(false);
  };

  const toggleBgColor = (e) => {
    e.preventDefault();
    setShowBgColor(!showBgColor);
    setShowTextColor(false);
  };

  // Close menus when toolbar visibility changes
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        setShowTextColor(false);
        setShowBgColor(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Monitor selection change to update bold/italic/underline states and active font size
  useEffect(() => {
    if (!visible) return;

    const updateStates = () => {
      // 1. Update text formatting states
      try {
        setActiveStates({
          bold: document.queryCommandState("bold"),
          italic: document.queryCommandState("italic"),
          underline: document.queryCommandState("underline"),
        });
      } catch {
        // Ignored
      }

      // 2. Update computed font size of the active element
      const activeEl = document.activeElement;
      if (activeEl && activeEl.getAttribute("contenteditable") === "true") {
        const style = window.getComputedStyle(activeEl);
        const sizePx = parseFloat(style.fontSize);
        if (sizePx) {
          setCurrentFontSize(Math.round(sizePx));
        }
      } else {
        setCurrentFontSize(fontSize);
      }
    };

    document.addEventListener("selectionchange", updateStates);
    updateStates();

    return () => {
      document.removeEventListener("selectionchange", updateStates);
    };
  }, [visible, fontSize]);

  if (!visible) return null;

  const handleCommand = (e, command, value = null) => {
    e.preventDefault();
    const activeEl = document.activeElement;

    // Check if the user is editing a contentEditable block
    if (activeEl && activeEl.getAttribute("contenteditable") === "true") {
      const selection = window.getSelection();
      // If there's no highlighted text selection, select the entire block content automatically
      if (selection.isCollapsed) {
        const range = document.createRange();
        range.selectNodeContents(activeEl);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    document.execCommand(command, false, value);

    // Trigger selection change to update button active states immediately
    const event = new Event("selectionchange");
    document.dispatchEvent(event);
  };

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 print:hidden transition-all duration-200 ease-out flex items-center gap-1.5 px-4 py-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-full text-slate-200"
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className="text-[11px] font-bold text-slate-400 border-r border-slate-700/60 pr-2.5 mr-1 hidden sm:inline select-none">
        টেক্সট ফরম্যাট
      </span>

      {/* Font Size controls */}
      {onChangeFontSize && (
        <div className="flex items-center gap-1 border-r border-slate-700/60 pr-2 mr-1">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              const newSize = Math.max(10, currentFontSize - 1);
              setCurrentFontSize(newSize);
              onChangeFontSize(newSize);
            }}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-350 hover:text-white transition cursor-pointer"
            title="ফন্ট ছোট করুন"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="text-xs font-black min-w-[24px] text-center font-sans text-white select-none">
            {currentFontSize}
          </span>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              const newSize = Math.min(32, currentFontSize + 1);
              setCurrentFontSize(newSize);
              onChangeFontSize(newSize);
            }}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-350 hover:text-white transition cursor-pointer"
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
          className={`p-1.5 hover:bg-slate-800 rounded-lg transition cursor-pointer ${
            activeStates.bold
              ? "text-indigo-400 bg-slate-800"
              : "text-slate-350 hover:text-white"
          }`}
          title="Bold (গাঢ়)"
        >
          <Bold className="size-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleCommand(e, "italic")}
          className={`p-1.5 hover:bg-slate-800 rounded-lg transition cursor-pointer ${
            activeStates.italic
              ? "text-indigo-400 bg-slate-800"
              : "text-slate-350 hover:text-white"
          }`}
          title="Italic (বাঁকা)"
        >
          <Italic className="size-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleCommand(e, "underline")}
          className={`p-1.5 hover:bg-slate-800 rounded-lg transition cursor-pointer ${
            activeStates.underline
              ? "text-indigo-400 bg-slate-800"
              : "text-slate-350 hover:text-white"
          }`}
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

      {/* Colors (Text & Highlight) */}
      <div className="flex items-center gap-0.5 border-r border-slate-700/60 pr-2 mr-1">
        {/* Text Color Button */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={toggleTextColor}
            className={`p-1.5 hover:bg-slate-800 rounded-lg transition cursor-pointer ${
              showTextColor
                ? "text-indigo-400 bg-slate-800"
                : "text-slate-350 hover:text-white"
            }`}
            title="লেখা কালার করুন"
          >
            <Baseline className="size-3.5" />
          </button>

          {showTextColor && (
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-1.5 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl flex gap-1 z-[60]"
              onMouseDown={(e) => e.preventDefault()}
            >
              {textColors.map((col) => (
                <button
                  key={col.value}
                  type="button"
                  onMouseDown={(e) => {
                    handleCommand(e, "foreColor", col.value);
                    setShowTextColor(false);
                  }}
                  className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 active:scale-95 transition cursor-pointer shrink-0"
                  style={{ backgroundColor: col.value }}
                  title={col.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Text Background Color (Highlight) Button */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={toggleBgColor}
            className={`p-1.5 hover:bg-slate-800 rounded-lg transition cursor-pointer ${
              showBgColor
                ? "text-indigo-400 bg-slate-800"
                : "text-slate-350 hover:text-white"
            }`}
            title="লেখা হাইলাইট করুন"
          >
            <Highlighter className="size-3.5" />
          </button>

          {showBgColor && (
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-1.5 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl flex gap-1 z-[60]"
              onMouseDown={(e) => e.preventDefault()}
            >
              {bgColors.map((col) => (
                <button
                  key={col.value}
                  type="button"
                  onMouseDown={(e) => {
                    handleCommand(e, "backColor", col.value);
                    setShowBgColor(false);
                  }}
                  className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 active:scale-95 transition cursor-pointer shrink-0 flex items-center justify-center"
                  style={{
                    backgroundColor:
                      col.value === "transparent" ? "#475569" : col.value,
                  }}
                  title={col.name === "None" ? "নো কালার" : col.name}
                >
                  {col.name === "None" && (
                    <span className="text-[10px] text-slate-300 font-bold leading-none">
                      ×
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
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
