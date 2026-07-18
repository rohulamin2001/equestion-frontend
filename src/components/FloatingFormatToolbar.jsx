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
import { useEffect, useRef, useState } from "react";

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

  const textColorInputRef = useRef(null);
  const bgColorInputRef = useRef(null);

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

      // 2. Update computed font size of the active element or selection
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const parentEl = selection.anchorNode.nodeType === 3
          ? selection.anchorNode.parentElement
          : selection.anchorNode;
        if (parentEl) {
          const style = window.getComputedStyle(parentEl);
          const sizePx = parseFloat(style.fontSize);
          if (sizePx) {
            setCurrentFontSize(Math.round(sizePx));
            return;
          }
        }
      }

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
        {/* Text Color Wrapper */}
        <div className="relative flex items-center justify-center">
          <input
            ref={textColorInputRef}
            type="color"
            className="sr-only"
            style={{
              width: 0,
              height: 0,
              opacity: 0,
              position: "absolute",
              bottom: "36px",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
            onChange={(e) => {
              document.execCommand("foreColor", false, e.target.value);
            }}
          />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              textColorInputRef.current?.click();
            }}
            className="p-1.5 hover:bg-slate-800 text-slate-350 hover:text-white rounded-lg transition cursor-pointer"
            title="লেখা কালার করুন"
          >
            <Baseline className="size-3.5" />
          </button>
        </div>

        {/* Text Background Color (Highlight) Wrapper */}
        <div className="relative flex items-center justify-center">
          <input
            ref={bgColorInputRef}
            type="color"
            className="sr-only"
            style={{
              width: 0,
              height: 0,
              opacity: 0,
              position: "absolute",
              bottom: "36px",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
            onChange={(e) => {
              document.execCommand("backColor", false, e.target.value);
            }}
          />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              bgColorInputRef.current?.click();
            }}
            className="p-1.5 hover:bg-slate-800 text-slate-350 hover:text-white rounded-lg transition cursor-pointer"
            title="লেখা হাইলাইট করুন"
          >
            <Highlighter className="size-3.5" />
          </button>
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
