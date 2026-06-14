import katex from "katex";
import "katex/dist/katex.min.css";
import { useMemo } from "react";

// Utility to find LaTeX syntax in HTML and render it to KaTeX HTML
function parseAndRenderMath(html) {
  if (!html) return "";

  let processedHtml = html;

  // 1. Process block formulas $$ ... $$ or \[ ... \]
  const blockRegex = /\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g;
  processedHtml = processedHtml.replace(blockRegex, (match, p1, p2) => {
    const formula = p1 || p2;
    try {
      return `<div class="katex-block-wrapper my-4 flex justify-center overflow-x-auto">${katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
      })}</div>`;
    } catch (err) {
      console.error("KaTeX Block Error:", err);
      return match;
    }
  });

  // 2. Process inline formulas $ ... $ or \( ... \)
  const inlineRegex = /\$([^$\n]+?)\$|\\\(([\s\S]*?)\\\)/g;
  processedHtml = processedHtml.replace(inlineRegex, (match, p1, p2) => {
    const formula = p1 || p2;
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch (err) {
      console.error("KaTeX Inline Error:", err);
      return match;
    }
  });

  return processedHtml;
}

/**
 * Strips a single wrapping <p>...</p> so content can flow inline.
 * Jodit always wraps text in <p> tags, which causes block-level line breaks.
 * Using this allows the content to sit next to a label on the same line.
 */
function stripOuterP(html) {
  if (!html) return "";
  let trimmed = html.trim();
  // Remove leading <p...> and trailing </p> if they wrap the content
  if (trimmed.toLowerCase().startsWith("<p") && trimmed.toLowerCase().endsWith("</p>")) {
    trimmed = trimmed.replace(/^<p[^>]*>/i, "").replace(/<\/p>$/i, "");
  }
  return trimmed;
}

/**
 * RichTextRender renders rich HTML content (from Jodit editor) with KaTeX math support.
 *
 * Props:
 *  - content: HTML string from editor
 *  - className: extra CSS classes
 *  - inline: if true, strips the outer <p> wrapper and renders as <span>
 *            so text flows on the same line as adjacent labels (e.g. "উত্তর:")
 */
export default function RichTextRender({ content, className = "", inline = false, ...props }) {
  const renderedContent = useMemo(() => {
    const parsed = parseAndRenderMath(content);
    return inline ? stripOuterP(parsed) : parsed;
  }, [content, inline]);

  if (inline) {
    return (
      <span
        className={`inline [&_*]:inline [&_p]:inline [&_p]:m-0 [&_p]:p-0 font-serif leading-relaxed text-[15px] select-text break-words jodit-rendered-content ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
        {...props}
      />
    );
  }

  return (
    <div
      className={`prose max-w-none dark:prose-invert font-serif leading-relaxed text-[15px] select-text break-words jodit-rendered-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
      {...props}
    />
  );
}
