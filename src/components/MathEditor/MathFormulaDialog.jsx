import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  Check,
  Code2,
  Eye,
  Keyboard,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import MathFormulaEditor from "./MathFormulaEditor";
import { FORMULA_CATEGORIES } from "./mathFormulaCategories";
import { renderLatexToHtml, validateLatex } from "./mathUtils";

export default function MathFormulaDialog({
  open = false,
  onOpenChange = () => {},
  initialLatex = "",
  initialDisplayMode = false,
  onInsert = () => {},
  isEditing = false,
}) {
  const [latex, setLatex] = useState(initialLatex || "");
  const [displayMode, setDisplayMode] = useState(Boolean(initialDisplayMode));
  const [activeCategory, setActiveCategory] = useState("arithmetic");
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(300);
  const editorRef = useRef(null);

  // Focus mathfield when dialog opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        editorRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Hide virtual keyboard when dialog closes
      if (typeof window !== "undefined" && window.mathVirtualKeyboard) {
        window.mathVirtualKeyboard.hide();
      }
    }
  }, [open]);

  // Track virtual keyboard visibility and height to adjust dialog layout
  useEffect(() => {
    if (typeof window === "undefined" || !window.mathVirtualKeyboard) return;
    const handleGeometry = () => {
      const isVisible = Boolean(window.mathVirtualKeyboard.visible);
      setIsKeyboardVisible(isVisible);
      const h = window.mathVirtualKeyboard.boundingRect?.height;
      if (h && h > 0) {
        setKeyboardHeight(h);
      }
    };
    window.mathVirtualKeyboard.addEventListener(
      "geometrychange",
      handleGeometry,
    );
    return () => {
      window.mathVirtualKeyboard.removeEventListener(
        "geometrychange",
        handleGeometry,
      );
    };
  }, []);

  const handleToggleKeyboard = () => {
    if (editorRef.current) {
      editorRef.current.toggleVirtualKeyboard();
      setTimeout(() => {
        if (typeof window !== "undefined" && window.mathVirtualKeyboard) {
          const isVisible = Boolean(window.mathVirtualKeyboard.visible);
          setIsKeyboardVisible(isVisible);
          const h = window.mathVirtualKeyboard.boundingRect?.height;
          if (h && h > 0) setKeyboardHeight(h);
        }
      }, 50);
    }
  };

  // Validation
  const validation = useMemo(() => {
    return validateLatex(latex, displayMode);
  }, [latex, displayMode]);

  // Rendered preview HTML
  const previewHtml = useMemo(() => {
    return renderLatexToHtml(latex, displayMode);
  }, [latex, displayMode]);

  const handleInsertTemplate = (templateLatex) => {
    if (editorRef.current) {
      editorRef.current.insert(templateLatex);
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.clear();
    } else {
      setLatex("");
    }
  };

  const handleSubmit = () => {
    const trimmed = (latex || "").trim();
    if (!trimmed) {
      onOpenChange(false);
      return;
    }
    if (!validation.valid) {
      return;
    }
    onInsert({ latex: trimmed, displayMode });
    onOpenChange(false);
  };

  const currentCategory = useMemo(() => {
    return (
      FORMULA_CATEGORIES.find((cat) => cat.id === activeCategory) ||
      FORMULA_CATEGORIES[0]
    );
  }, [activeCategory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        containerClassName={
          isKeyboardVisible ? "!items-start pt-2 sm:pt-3 pb-0" : "items-center"
        }
        onPointerDownOutside={(e) => {
          const target = e.target;
          if (
            target &&
            (target.closest(".ML__keyboard") ||
              target.closest(".MLK__backdrop") ||
              target.closest("math-virtual-keyboard") ||
              target.closest("[data-ml-keyboard]"))
          ) {
            e.preventDefault();
          }
        }}
        style={{
          maxHeight: isKeyboardVisible
            ? `calc(100dvh - ${keyboardHeight + 20}px)`
            : "92vh",
        }}
        className="max-w-3xl w-[95vw] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-200"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>গাণিতিক ও বৈজ্ঞানিক সূত্র এডিটর</span>
                  <span className="text-xs px-2 py-0.5 font-medium rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {isEditing ? "সম্পাদনা" : "নতুন সংযোজন"}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  সহজে ক্লিক করে সূত্র তৈরি করুন অথবা সরাসরি টাইপ করুন
                </DialogDescription>
              </div>
            </div>

            {/* Display Mode Toggle */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setDisplayMode(false)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  !displayMode
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="বাক্যের ভেতর একই লাইনে থাকবে (Inline)"
              >
                ইনলাইন (Inline)
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode(true)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  displayMode
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="আলাদা লাইনে মাঝে প্রদর্শিত হবে (Display Block)"
              >
                ব্লক / আলাদা লাইন (Block)
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div
          className={`flex-1 overflow-y-auto px-6 ${
            isKeyboardVisible ? "py-2.5 space-y-2.5" : "py-4 space-y-4"
          }`}
        >
          {/* Formula Categories Tabs */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              ফর্মুলা ও প্রতীক ক্যাটাগরি
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
              {FORMULA_CATEGORIES.map((cat) => {
                const isActive = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all border ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20"
                        : "bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-200/60"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Symbol Buttons Grid */}
          <div className="p-2.5 bg-slate-50/70 dark:bg-slate-900/40 rounded-xl border border-slate-200/70 dark:border-slate-800">
            <div
              className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-1.5 ${isKeyboardVisible ? "max-h-20" : "max-h-36"} overflow-y-auto p-0.5`}
            >
              {currentCategory.symbols.map((sym, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleInsertTemplate(sym.latex)}
                  title={sym.tooltip || sym.label}
                  className="h-10 px-2 py-1 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-all text-sm font-serif select-none shadow-2xs active:scale-95"
                >
                  <span className="truncate">{sym.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MathLive Visual Formula Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>ভিজ্যুয়াল ইনপুট এরিয়া</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  (ক্লিক করে প্রতীক লিখুন বা এডিট করুন)
                </span>
              </label>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleToggleKeyboard}
                  className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 transition ${
                    isKeyboardVisible
                      ? "bg-indigo-600 text-white font-semibold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title={
                    isKeyboardVisible
                      ? "অন-স্ক্রিন ভার্চুয়াল কিবোর্ড লুকান"
                      : "অন-স্ক্রিন ভার্চুয়াল কিবোর্ড দেখান"
                  }
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {isKeyboardVisible ? "কিবোর্ড লুকান" : "ভার্চুয়াল কিবোর্ড"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdvancedMode(!showAdvancedMode)}
                  className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 transition ${
                    showAdvancedMode
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="সরাসরি LaTeX কোড দেখতে বা এডিট করতে ক্লিক করুন"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">LaTeX কোড</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md flex items-center gap-1"
                  title="ইনপুট বক্স সম্পূর্ণ পরিষ্কার করুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">পরিষ্কার</span>
                </button>
              </div>
            </div>

            <MathFormulaEditor
              ref={editorRef}
              value={latex}
              onChange={setLatex}
              onEnter={handleSubmit}
              placeholder="এখানে ক্লিক করে গণিত বা সায়েন্সের সূত্র তৈরি করুন..."
            />
          </div>

          {/* Advanced LaTeX Source Mode */}
          {showAdvancedMode && (
            <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-1.5 border border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">LaTeX Source (Advanced)</span>
                <span>
                  যেকোনো স্ট্যান্ডার্ড ল্যাটেক কোড এখানে পেস্ট করতে পারেন
                </span>
              </div>
              <textarea
                value={latex}
                onChange={(e) => setLatex(e.target.value)}
                placeholder="\frac{a}{b}..."
                rows={2}
                className="w-full bg-slate-950 text-indigo-300 font-mono text-sm p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          )}

          {/* Live Preview Box */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                লাইভ প্রিভিউ (KaTeX Preview)
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                প্রশ্নপত্রে শিক্ষার্থী যেভাবে দেখবে
              </span>
            </div>

            <div className="p-4 min-h-[4.5rem] flex items-center justify-center overflow-x-auto text-slate-900 dark:text-slate-100">
              {latex?.trim() ? (
                <div
                  className={
                    displayMode
                      ? "w-full text-center py-2"
                      : "inline-block py-1"
                  }
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <span className="text-slate-400 text-xs italic">
                  সূত্রের প্রিভিউ এখানে দৃশ্যমান হবে...
                </span>
              )}
            </div>

            {/* Error Message if invalid */}
            {!validation.valid && (
              <div className="px-3 py-2 bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>LaTeX ত্রুটি: {validation.error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter
          className={`px-6 ${
            isKeyboardVisible ? "py-2.5" : "py-3.5"
          } bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between sm:justify-between`}
        >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition"
          >
            বাতিল (Cancel)
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!latex?.trim() || !validation.valid}
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? "আপডেট করুন" : "ফর্মুলা যুক্ত করুন"}</span>
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
