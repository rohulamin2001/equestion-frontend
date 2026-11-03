import {
  AlertTriangle,
  ArrowRight,
  Check,
  Code2,
  Copy,
  Sparkles,
  Wand2,
  WrapText,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Analyzes JSON syntax errors and extracts exact line number, column number,
 * and human-friendly Bengali suggestions.
 */
function analyzeJsonError(jsonString) {
  if (!jsonString || !jsonString.trim()) return null;
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (err) {
    const message = err.message || "";
    let line = null;
    let col = null;
    let hint;

    // 1. Try matching "at line X column Y"
    const lineColMatch = message.match(/at line (\d+) column (\d+)/i);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      col = parseInt(lineColMatch[2], 10);
    }

    // 2. Try matching "at position X"
    if (!line) {
      const posMatch = message.match(/at position (\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const textBefore = jsonString.slice(0, pos);
        line = textBefore.split("\n").length;
        col = (textBefore.split("\n").pop() || "").length + 1;
      }
    }

    // 3. Fallback: match unexpected character position
    if (!line) {
      const tokenMatch = message.match(/Unexpected token '([^']+)'/);
      if (tokenMatch) {
        const char = tokenMatch[1];
        const idx = jsonString.indexOf(char);
        if (idx !== -1) {
          const textBefore = jsonString.slice(0, idx);
          line = textBefore.split("\n").length;
          col = (textBefore.split("\n").pop() || "").length + 1;
        }
      }
    }

    // Friendly Bengali explanations & actionable hints
    if (message.includes("Expected ',' or '}'")) {
      hint =
        "আগের লাইনের শেষে কমা (,) দিতে ভুলে গেছেন কিনা অথবা বাড়তি কোনো চিহ্ন আছে কিনা চেক করুন।";
    } else if (
      message.includes("Expected double-quoted property name") ||
      message.includes("Expected property name")
    ) {
      hint =
        'শেষের লাইনে বাড়তি কমা (,) আছে কিনা অথবা ডাবল কোটেশন (")-এর বদলে সিঙ্গেল কোট ব্যবহার করেছেন কিনা চেক করুন।';
    } else if (message.includes("Unterminated string")) {
      hint = 'কোনো কোটেশন মার্ক (") শেষ করতে ভুলে গেছেন।';
    } else if (
      jsonString.includes("“") ||
      jsonString.includes("”") ||
      jsonString.includes("‘") ||
      jsonString.includes("’")
    ) {
      hint =
        'স্মার্ট/বাংলা কোটেশন (“ ”) রয়েছে। সাধারণ ইংরেজি ডাবল কোটেশন (") ব্যবহার করুন।';
    } else if (message.includes("Expected ',' or ']'")) {
      hint =
        "অ্যারের ভেতরের উপাদানগুলোর মাঝে কমা (,) অথবা ব্র্যাকেট (]) মেলেনি কিনা চেক করুন।";
    } else {
      hint = "ব্র্যাকেট বা কোটেশন সঠিকভাবে ক্লোজ করা হয়েছে কিনা নিশ্চিত করুন।";
    }

    const canAutoFix =
      jsonString.includes("“") ||
      jsonString.includes("”") ||
      jsonString.includes("‘") ||
      jsonString.includes("’") ||
      /,\s*([}\]])/.test(jsonString);

    return {
      valid: false,
      message,
      line,
      col,
      hint,
      canAutoFix,
    };
  }
}

/**
 * JsonCodeEditor: Lightweight code editor with synchronized line numbers,
 * active line highlighting, error line indicator, jump-to-error,
 * tab indentation, format (prettify) support, and word wrap.
 */
export default function JsonCodeEditor({
  value = "",
  onChange = () => {},
  placeholder = "",
  minHeight = "280px",
  maxHeight = "500px",
  headerActions = null,
  className = "",
}) {
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);
  const mirrorRef = useRef(null);

  const [activeLine, setActiveLine] = useState(1);
  const [activeCol, setActiveCol] = useState(1);
  const [copied, setCopied] = useState(false);
  const [wrapLines, setWrapLines] = useState(true);
  const [lineHeights, setLineHeights] = useState([]);

  // Split lines to calculate line count
  const lines = useMemo(() => {
    return value ? value.split("\n") : [""];
  }, [value]);

  const lineCount = lines.length;

  // Track cursor position (Line & Col)
  const updateCursorPosition = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const pos = el.selectionStart || 0;
    const textBefore = value.slice(0, pos);
    const lineParts = textBefore.split("\n");
    const currentLine = lineParts.length;
    const currentCol = (lineParts[lineParts.length - 1] || "").length + 1;
    setActiveLine(currentLine);
    setActiveCol(currentCol);
  }, [value]);

  // Measure wrapped heights of each line to keep gutter numbers 100% aligned
  const updateLineHeights = useCallback(() => {
    if (!wrapLines) {
      setLineHeights([]);
      return;
    }
    const textarea = textareaRef.current;
    const mirror = mirrorRef.current;
    if (!textarea || !mirror) return;

    // Set mirror width to match textarea's client width (excluding scrollbar)
    mirror.style.width = `${textarea.clientWidth}px`;

    const children = mirror.children;
    const heights = [];
    for (let i = 0; i < children.length; i++) {
      heights.push(children[i].getBoundingClientRect().height || 22);
    }
    setLineHeights(heights);
  }, [wrapLines]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      updateLineHeights();
    });
    return () => cancelAnimationFrame(handle);
  }, [value, wrapLines, updateLineHeights]);

  // Re-measure when window/container resizes
  useEffect(() => {
    if (!textareaRef.current) return;
    const observer = new ResizeObserver(() => {
      updateLineHeights();
    });
    observer.observe(textareaRef.current);
    return () => observer.disconnect();
  }, [updateLineHeights]);

  // Sync scroll between textarea and line number gutter
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle Tab key for indentation
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = textareaRef.current;
      if (!el) return;

      const start = el.selectionStart;
      const end = el.selectionEnd;
      const spaces = "  "; // 2 spaces

      const newValue =
        value.substring(0, start) + spaces + value.substring(end);
      onChange(newValue);

      // Restore cursor position after inserted spaces
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + spaces.length;
        updateCursorPosition();
      }, 0);
    }
  };

  // Format / Prettify JSON
  const handleFormatJson = () => {
    if (!value || !value.trim()) return;
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
      toast.success("JSON কোড সুন্দরভাবে সাজানো (Format) হয়েছে!");
    } catch (err) {
      toast.error(`JSON সিনট্যাক্স ভুল আছে: ${err.message}`);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("JSON কোড কপি করা হয়েছে!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("কপি করা যায়নি!");
    }
  };

  // Validation & Error analysis
  const jsonStatus = useMemo(() => {
    return analyzeJsonError(value);
  }, [value]);

  // Jump directly to the error line
  const jumpToErrorLine = () => {
    if (
      !jsonStatus ||
      jsonStatus.valid ||
      !jsonStatus.line ||
      !textareaRef.current
    )
      return;
    const errorLine = jsonStatus.line;
    const errorCol = jsonStatus.col || 1;
    const textLines = value.split("\n");

    let offset = 0;
    for (let i = 0; i < Math.min(errorLine - 1, textLines.length); i++) {
      offset += textLines[i].length + 1;
    }
    const currentLineLength = (textLines[errorLine - 1] || "").length;
    offset += Math.min(Math.max(0, errorCol - 1), currentLineLength);

    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(offset, offset);

    // Scroll textarea to that line
    const targetScroll = Math.max(0, (errorLine - 2) * 22);
    textareaRef.current.scrollTop = targetScroll;
    if (gutterRef.current) {
      gutterRef.current.scrollTop = targetScroll;
    }
    setActiveLine(errorLine);
    setActiveCol(errorCol);
    toast.info(`লাইন ${errorLine}-এ কার্সর নেওয়া হয়েছে`);
  };

  // Auto-fix common syntax errors (smart quotes & trailing commas)
  const handleAutoFix = () => {
    let fixed = value;
    // 1. Replace smart quotes with standard ASCII quotes
    fixed = fixed.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    // 2. Remove trailing commas before } or ]
    fixed = fixed.replace(/,\s*([}\]])/g, "$1");

    try {
      const parsed = JSON.parse(fixed);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
      toast.success(
        "স্মার্ট কোটেশন ও বাড়তি কমা স্বয়ংক্রিয়ভাবে সমাধান করা হয়েছে!",
      );
    } catch {
      onChange(fixed);
      toast.info("কোটেশন ও বাড়তি কমা ক্লিন করা হয়েছে, বাকি ত্রুটি চেক করুন");
    }
  };

  useEffect(() => {
    updateCursorPosition();
  }, [updateCursorPosition]);

  return (
    <div
      className={`rounded-2xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-2xl flex flex-col font-mono text-xs transition-all focus-within:border-purple-500/80 focus-within:ring-2 focus-within:ring-purple-500/20 ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-300 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-950/70 border border-purple-800/60 text-purple-300 font-bold text-[11px]">
            <Code2 className="size-3.5 text-purple-400" />
            <span>JSON Editor</span>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            ({lineCount} {lineCount === 1 ? "লাইন" : "টি লাইন"})
          </span>

          {jsonStatus && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                jsonStatus.valid
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                  : "bg-rose-950/80 text-rose-400 border border-rose-800/60"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  jsonStatus.valid ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
              <span className="truncate max-w-[140px] sm:max-w-none">
                {jsonStatus.valid
                  ? "সঠিক JSON"
                  : `সিনট্যাক্স ত্রুটি ${jsonStatus.line ? `(লাইন ${jsonStatus.line})` : ""}`}
              </span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Word Wrap Toggle Button */}
          <button
            type="button"
            onClick={() => setWrapLines(!wrapLines)}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
              wrapLines
                ? "bg-purple-900/60 text-purple-200 border-purple-600/60"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
            }`}
            title={
              wrapLines ? "লাইন র‍্যাপ বন্ধ করুন" : "লাইন র‍্যাপ চালু করুন"
            }
          >
            <WrapText className="size-3 text-purple-400" />
            <span>Wrap</span>
          </button>

          {/* Format / Prettify Button */}
          {value && (
            <button
              type="button"
              onClick={handleFormatJson}
              className="text-[11px] font-semibold text-purple-300 hover:text-white bg-slate-800 hover:bg-purple-700 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-purple-600 transition flex items-center gap-1 cursor-pointer"
              title="JSON সুন্দরভাবে সাজান (Auto Prettify)"
            >
              <Sparkles className="size-3 text-purple-400" />
              <span>ফরম্যাট</span>
            </button>
          )}

          {/* Copy Button */}
          {value && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer"
              title="সম্পূর্ণ কোড কপি করুন"
            >
              {copied ? (
                <Check className="size-3 text-emerald-400" />
              ) : (
                <Copy className="size-3" />
              )}
              <span className="hidden sm:inline">কপি</span>
            </button>
          )}

          {/* External Header Actions (e.g. Server Duplicate check, Paste from clipboard, Clear) */}
          {headerActions}
        </div>
      </div>

      {/* Error Info Strip (Shows exact line, column, error hint, and Jump button) */}
      {jsonStatus && !jsonStatus.valid && jsonStatus.line && (
        <div className="px-3.5 py-2 bg-rose-950/70 border-b border-rose-800/80 flex flex-wrap items-center justify-between gap-2 text-rose-300 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <AlertTriangle className="size-4 text-rose-400 shrink-0" />
            <span className="font-bold text-rose-200 shrink-0">
              লাইন {jsonStatus.line}, কলাম {jsonStatus.col}:
            </span>
            <span className="truncate text-rose-300 font-sans text-[11px] sm:text-xs">
              {jsonStatus.hint || jsonStatus.message}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {jsonStatus.canAutoFix && (
              <button
                type="button"
                onClick={handleAutoFix}
                className="text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                title="কোটেশন বা বাড়তি কমা স্বয়ংক্রিয়ভাবে ফিক্স করুন"
              >
                <Wand2 className="size-3" />
                <span>অটো-ফিক্স</span>
              </button>
            )}
            <button
              type="button"
              onClick={jumpToErrorLine}
              className="text-[11px] font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              <span>ভুল লাইনে যান ({jsonStatus.line})</span>
              <ArrowRight className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Code Editor Body (Gutter + Textarea) */}
      <div
        className="relative flex flex-1 overflow-hidden"
        style={{ minHeight, maxHeight }}
      >
        {/* Invisible Mirror Element used to accurately measure wrapped line heights */}
        <div
          ref={mirrorRef}
          aria-hidden="true"
          className="absolute top-0 left-0 opacity-0 pointer-events-none p-3 font-mono text-xs sm:text-[13px] leading-[22px] whitespace-pre-wrap break-words"
          style={{
            zIndex: -999,
            visibility: "hidden",
            boxSizing: "border-box",
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ minHeight: "22px", lineHeight: "22px" }}>
              {line || "\u00A0"}
            </div>
          ))}
        </div>

        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          className="w-11 sm:w-13 shrink-0 bg-slate-900/90 border-r border-slate-800/80 py-3 select-none overflow-hidden text-right font-mono"
          style={{ maxHeight }}
          aria-hidden="true"
        >
          {lines.map((_, index) => {
            const lineNum = index + 1;
            const isCurrent = lineNum === activeLine;
            const isErrorLine =
              !jsonStatus?.valid && jsonStatus?.line === lineNum;
            const h =
              wrapLines && lineHeights[index]
                ? `${lineHeights[index]}px`
                : "22px";
            return (
              <div
                key={lineNum}
                className={`pr-2.5 sm:pr-3 text-[11px] sm:text-xs transition-colors flex items-start justify-end gap-1 ${
                  isErrorLine
                    ? "bg-rose-500/25 text-rose-400 font-bold border-r-2 border-rose-500"
                    : isCurrent
                      ? "text-purple-300 font-bold bg-purple-500/15"
                      : "text-slate-600"
                }`}
                style={{ height: h, minHeight: "22px" }}
                title={isErrorLine ? `ত্রুটি: লাইন ${lineNum}` : undefined}
              >
                {isErrorLine && (
                  <span className="text-[9px] text-rose-400 leading-[22px]">
                    ⚠️
                  </span>
                )}
                <span style={{ lineHeight: "22px" }}>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            updateCursorPosition();
          }}
          onScroll={handleScroll}
          onClick={updateCursorPosition}
          onKeyUp={updateCursorPosition}
          onSelect={updateCursorPosition}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className={`flex-1 p-3 font-mono text-xs sm:text-[13px] bg-slate-950 text-slate-100 placeholder:text-slate-600 outline-none resize-none overflow-auto leading-[22px] selection:bg-purple-600/30 selection:text-white ${
            wrapLines
              ? "whitespace-pre-wrap break-words"
              : "whitespace-pre overflow-x-auto"
          }`}
          style={{
            maxHeight,
            lineHeight: "22px",
            tabSize: 2,
          }}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/95 border-t border-slate-800 text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-purple-400">
            Ln {activeLine}, Col {activeCol}
          </span>
          <span className="text-slate-600">•</span>
          <span>মোট {lineCount} লাইন</span>
          <span className="text-slate-600">•</span>
          <span>{value.length} টি ক্যারেক্টার</span>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-[10px]">
          <span className="hidden sm:inline">UTF-8</span>
          <span className="hidden sm:inline">•</span>
          <span>{wrapLines ? "Wrap: On" : "Wrap: Off"}</span>
          <span className="hidden sm:inline">•</span>
          <span>JSON</span>
        </div>
      </div>
    </div>
  );
}
