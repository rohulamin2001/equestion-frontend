import { toPng } from "html-to-image";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Sigma, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SAMPLE_SNIPPETS = [
  { label: "দ্বিঘাত", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
  { label: "ইন্টিগ্রাল", latex: "\\int_{a}^{b} f(x)\\,dx" },
  { label: "ত্রিকোণমিতি", latex: "\\sin^2\\theta + \\cos^2\\theta = 1" },
  { label: "রসায়ন", latex: "2H_2 + O_2 \\rightarrow 2H_2O" },
];

export default function EquationModal({ open, onClose, onInsertEquation }) {
  const [latex, setLatex] = useState("\\frac{a^2 - b^2}{a + b} = a - b");
  const [inserting, setInserting] = useState(false);
  const previewRef = useRef(null);

  const renderedHtml = useMemo(() => {
    try {
      return katex.renderToString(latex || "", {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return "";
    }
  }, [latex]);

  if (!open || typeof document === "undefined") return null;

  const handleInsert = async () => {
    if (!previewRef.current || !latex.trim()) return;
    setInserting(true);
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      const pngDataUrl = await toPng(previewRef.current, {
        pixelRatio: 2.5,
        backgroundColor: "rgba(255,255,255,0)",
      });
      const width = Math.max(180, previewRef.current.scrollWidth);
      const height = Math.max(70, previewRef.current.scrollHeight);
      onInsertEquation({
        latex: latex.trim(),
        src: pngDataUrl,
        width,
        height,
      });
      onClose();
    } finally {
      setInserting(false);
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9990] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 font-bengali"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sigma className="size-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              গণিত ও বিজ্ঞান সমীকরণ (KaTeX)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_SNIPPETS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setLatex(s.latex)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-xs cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            placeholder="LaTeX সমীকরণ লিখুন..."
            className="w-full rounded-xl border border-slate-200 p-3 font-mono text-xs focus:outline-none focus:border-purple-500"
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-center min-h-[84px] overflow-x-auto">
            <div
              ref={previewRef}
              className="inline-block px-3 py-2 text-slate-900 text-xl"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              disabled={inserting || !latex.trim()}
              onClick={handleInsert}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {inserting ? "যুক্ত হচ্ছে..." : "বোর্ডে যোগ করুন"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
