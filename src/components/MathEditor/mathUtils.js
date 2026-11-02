import katex from "katex";
import "katex/dist/katex.min.css";
// Enable mhchem extension for chemistry equations (\ce{...})
import "katex/dist/contrib/mhchem.min.js";

/**
 * Validates LaTeX syntax using KaTeX.
 * Returns { valid: boolean, error: string | null }
 */
export function validateLatex(latex, displayMode = false) {
  if (!latex || !latex.trim()) {
    return { valid: true, error: null };
  }
  try {
    katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: true,
    });
    return { valid: true, error: null };
  } catch (err) {
    return {
      valid: false,
      error: err.message?.replace(/^KaTeX parse error:\s*/i, "") || "অবৈধ LaTeX সমীকরণ",
    };
  }
}

/**
 * Renders LaTeX to HTML using KaTeX.
 * Gracefully falls back to raw latex wrapped in code tag if rendering fails.
 */
export function renderLatexToHtml(latex, displayMode = false) {
  if (!latex || !latex.trim()) return "";
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
    });
  } catch (err) {
    console.warn("KaTeX rendering error:", err);
    return `<code class="text-red-500 font-mono text-sm">${latex}</code>`;
  }
}

/**
 * Constructs an atomic HTML element representing the math formula for the Jodit editor.
 * Uses contenteditable="false" so it behaves as an atomic block (single-key delete).
 * Stores raw LaTeX in data-latex and display type in data-display-mode.
 */
export function createMathEditorPill(latex, displayMode = false) {
  const trimmed = (latex || "").trim();
  const renderedHtml = renderLatexToHtml(trimmed, displayMode);
  // Escaped attributes
  const escapedLatex = encodeURIComponent(trimmed);

  if (displayMode) {
    return (
      `<div class="math-formula-pill math-block-pill my-3 py-2 px-4 rounded-lg bg-indigo-50/40 border border-indigo-100 flex justify-center items-center select-none cursor-pointer hover:border-indigo-400 hover:shadow-sm transition" ` +
      `contenteditable="false" data-math-formula="true" data-display-mode="block" data-latex="${escapedLatex}" ` +
      `title="ডাবল ক্লিক করে সমীকরণ এডিট করুন">${renderedHtml}</div>`
    );
  }

  return (
    `<span class="math-formula-pill math-inline-pill mx-1 inline-flex items-baseline px-1.5 py-0.5 rounded bg-indigo-50/50 border border-indigo-100/70 select-none cursor-pointer hover:border-indigo-400 align-baseline transition" ` +
    `contenteditable="false" data-math-formula="true" data-display-mode="inline" data-latex="${escapedLatex}" ` +
    `title="ডাবল ক্লিক করে সমীকরণ এডিট করুন">${renderedHtml}</span>`
  );
}

/**
 * Extracts latex and displayMode from a math pill element or dataset
 */
export function extractLatexFromPill(element) {
  if (!element) return { latex: "", displayMode: false };
  const rawData = element.getAttribute("data-latex");
  const displayModeAttr = element.getAttribute("data-display-mode");
  const displayMode = displayModeAttr === "block";

  if (!rawData) {
    return { latex: "", displayMode };
  }

  try {
    const latex = decodeURIComponent(rawData);
    return { latex, displayMode };
  } catch {
    return { latex: rawData, displayMode };
  }
}

