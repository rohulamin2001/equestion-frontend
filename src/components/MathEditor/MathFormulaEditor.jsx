import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "mathlive";

/**
 * MathFormulaEditor: React wrapper for MathLive `<math-field>`
 * Provides visual WYSIWYG mathematical expression authoring.
 */
const MathFormulaEditor = forwardRef(function MathFormulaEditor(
  {
    value = "",
    onChange = () => {},
    onEnter,
    placeholder = "এখানে গাণিতিক সূত্র লিখুন...",
    readOnly = false,
    className = "",
  },
  ref
) {
  const mfRef = useRef(null);

  // Expose imperative API for parent dialog to insert templates, focus, or clear
  useImperativeHandle(ref, () => ({
    insert: (latex) => {
      if (!mfRef.current) return;
      mfRef.current.focus();
      // Insert LaTeX at current cursor position with placeholder selection
      mfRef.current.insert(latex, {
        focus: true,
        selectionMode: "placeholder",
        format: "latex",
      });
      const newVal = mfRef.current.value;
      onChange(newVal);
    },
    focus: () => {
      mfRef.current?.focus();
    },
    clear: () => {
      if (mfRef.current) {
        mfRef.current.setValue("", { silenceNotifications: true });
        onChange("");
        mfRef.current.focus();
      }
    },
    getValue: () => mfRef.current?.value || "",
    setValue: (newVal) => {
      if (mfRef.current) {
        mfRef.current.setValue(newVal || "", { silenceNotifications: true });
      }
    },
    toggleVirtualKeyboard: () => {
      if (typeof window !== "undefined" && window.mathVirtualKeyboard) {
        if (window.mathVirtualKeyboard.visible) {
          window.mathVirtualKeyboard.hide();
        } else {
          window.mathVirtualKeyboard.show();
        }
      }
    },
  }));

  // Sync internal value when prop changes from outside (e.g. loading existing formula)
  useEffect(() => {
    if (mfRef.current && mfRef.current.value !== value) {
      mfRef.current.setValue(value || "", { silenceNotifications: true });
    }
  }, [value]);

  // Configure MathLive field attributes and event listeners
  useEffect(() => {
    const mf = mfRef.current;
    if (!mf) return;

    // Configuration options
    mf.readOnly = readOnly;
    mf.smartFence = true;
    mf.smartMode = true;
    mf.mathVirtualKeyboardPolicy = "auto";

    // Handle user typing and editing
    const handleInput = () => {
      const currentLatex = mf.value;
      onChange(currentLatex);
    };

    // Handle enter key press
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && onEnter) {
        e.preventDefault();
        onEnter(mf.value);
      }
    };

    mf.addEventListener("input", handleInput);
    mf.addEventListener("keydown", handleKeyDown);

    return () => {
      mf.removeEventListener("input", handleInput);
      mf.removeEventListener("keydown", handleKeyDown);
    };
  }, [onChange, onEnter, readOnly]);

  return (
    <div className={`relative w-full rounded-xl bg-slate-50/70 dark:bg-slate-900/50 p-3 border-2 border-indigo-200 dark:border-indigo-800/60 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all ${className}`}>
      <math-field
        ref={mfRef}
        style={{
          display: "block",
          width: "100%",
          minHeight: "3.2rem",
          fontSize: "1.35rem",
          outline: "none",
          border: "none",
          background: "transparent",
          color: "inherit",
          fontFamily: "KaTeX_Main, Cambria Math, system-ui, sans-serif",
        }}
      >
        {value}
      </math-field>
      {!value && (
        <div className="pointer-events-none absolute top-4 left-4 text-slate-400 text-sm select-none">
          {placeholder}
        </div>
      )}
    </div>
  );
});

export default MathFormulaEditor;

