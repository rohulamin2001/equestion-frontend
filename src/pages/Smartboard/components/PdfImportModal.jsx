import { FileText, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { loadPdfDocument, renderPdfPageToBlob } from "../utils/pdfImport";

export default function PdfImportModal({
  open,
  onClose,
  onImportPages,
}) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [fileName, setFileName] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open || typeof document === "undefined") return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg("");
    setLoadingPdf(true);
    setFileName(file.name);
    try {
      const doc = await loadPdfDocument(file);
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      const initial = new Set();
      for (let i = 1; i <= Math.min(3, doc.numPages); i += 1) {
        initial.add(i);
      }
      setSelectedPages(initial);
    } catch {
      setErrorMsg("PDF ফাইলটি পড়া যায়নি (পাসওয়ার্ড সুরক্ষিত বা ক্ষতিগ্রস্ত হতে পারে)।");
      setPdfDoc(null);
      setNumPages(0);
    } finally {
      setLoadingPdf(false);
    }
  };

  const togglePage = (p) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const handleConfirmImport = async () => {
    if (!pdfDoc || selectedPages.size === 0) return;
    setImporting(true);
    setErrorMsg("");
    try {
      const sorted = Array.from(selectedPages).sort((a, b) => a - b);
      const rendered = [];
      for (let i = 0; i < sorted.length; i += 1) {
        const pageNum = sorted[i];
        setProgressText(
          `পৃষ্ঠা ${pageNum.toLocaleString("bn-BD")} প্রসেস হচ্ছে (${i + 1}/${sorted.length})...`,
        );
        const result = await renderPdfPageToBlob(pdfDoc, pageNum);
        rendered.push({ pageNumber: pageNum, ...result });
      }
      await onImportPages(rendered, fileName);
      onClose();
    } catch {
      setErrorMsg("PDF পৃষ্ঠাগুলো স্লাইডে যুক্ত করতে সমস্যা হয়েছে।");
    } finally {
      setImporting(false);
      setProgressText("");
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
            <FileText className="size-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              PDF পৃষ্ঠা স্লাইডে আমদানি করুন
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
          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 hover:border-indigo-400 p-5 cursor-pointer transition text-center gap-2">
            <Upload className="size-6 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">
              {fileName || "NCTB বই বা প্রশ্নপত্রের PDF ফাইল সিলেক্ট করুন"}
            </span>
            <span className="text-[11px] text-slate-400">
              নির্বাচিত পৃষ্ঠাগুলো স্লাইড ব্যাকগ্রাউন্ড হিসেবে যুক্ত হবে
            </span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {loadingPdf && (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-600">
              <Loader2 className="size-4 animate-spin text-indigo-600" />
              <span>PDF লোড হচ্ছে...</span>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-2.5">
              {errorMsg}
            </p>
          )}

          {numPages > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>মোট পৃষ্ঠা: {numPages.toLocaleString("bn-BD")}টি</span>
                <span>নির্বাচিত: {selectedPages.size.toLocaleString("bn-BD")}টি</span>
              </div>
              <div className="max-h-44 overflow-y-auto grid grid-cols-5 gap-1.5 p-1">
                {Array.from({ length: numPages }, (_, idx) => idx + 1).map((p) => {
                  const active = selectedPages.has(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePage(p)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition ${
                        active
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      {p.toLocaleString("bn-BD")}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {progressText && (
            <p className="text-xs text-indigo-700 font-semibold text-center">
              {progressText}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              disabled={!pdfDoc || selectedPages.size === 0 || importing}
              onClick={handleConfirmImport}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {importing ? "আমদানি হচ্ছে..." : "স্লাইডে যোগ করুন"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
