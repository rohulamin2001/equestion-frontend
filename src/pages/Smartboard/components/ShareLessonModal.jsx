import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Link2, Loader2, QrCode, ShieldOff, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { smartboardApi } from "../services/smartboardApi";

export default function ShareLessonModal({
  open,
  onClose,
  lessonId,
  lessonTitle,
  onEnsureSaved,
}) {
  const queryClient = useQueryClient();
  const [mutating, setMutating] = useState(false);
  const [expiryHours, setExpiryHours] = useState("168");
  const [allowPdfDownload, setAllowPdfDownload] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareQuery = useQuery({
    queryKey: ["smartboardShareStatus", lessonId],
    queryFn: async () => {
      const res = await smartboardApi.getShareStatus(lessonId);
      return res.share || null;
    },
    enabled: open && Boolean(lessonId),
  });

  if (!open || typeof document === "undefined") return null;

  const shareData = shareQuery.data || null;
  const loading = shareQuery.isLoading || mutating;
  const shareUrl = shareData?.shareUrl
    ? `${window.location.origin}${shareData.shareUrl}`
    : shareData?.token
      ? `${window.location.origin}/board-notes/${shareData.token}`
      : "";

  const handleEnableOrUpdateShare = async () => {
    setMutating(true);
    try {
      const resolvedId = lessonId || (await onEnsureSaved?.());
      if (!resolvedId) {
        toast.error("শেয়ার করার আগে লেসনটি ক্লাউডে সেভ করুন।");
        return;
      }
      const res = await smartboardApi.createOrUpdateShare(resolvedId, {
        expiryHours: expiryHours === "never" ? null : Number(expiryHours),
        permissions: { view: true, downloadPdf: allowPdfDownload },
      });
      queryClient.setQueryData(
        ["smartboardShareStatus", resolvedId],
        res.share || null,
      );
      toast.success("পাবলিক শেয়ার লিংক ও QR কোড তৈরি হয়েছে!");
    } catch {
      toast.error("শেয়ার লিংক তৈরি করা যায়নি।");
    } finally {
      setMutating(false);
    }
  };

  const handleRevoke = async () => {
    if (!lessonId) return;
    setMutating(true);
    try {
      await smartboardApi.revokeShare(lessonId);
      queryClient.setQueryData(["smartboardShareStatus", lessonId], null);
      toast.success("শেয়ার লিংক বন্ধ করা হয়েছে।");
    } catch {
      toast.error("শেয়ার লিংক বন্ধ করা যায়নি।");
    } finally {
      setMutating(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("লিংক কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 1800);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9990] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 font-bengali"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="size-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              ছাত্রদের সাথে ক্লাস নোট শেয়ার
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
          <p className="text-xs text-slate-600">
            <span className="font-semibold text-slate-800">{lessonTitle}</span> —
            শিক্ষার্থীরা লগইন ছাড়াই রিড-অনলি নোট দেখতে পারবে।
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className="space-y-1">
              <span className="text-slate-500 block">মেয়াদ</span>
              <select
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-2.5 py-2 bg-white"
              >
                <option value="24">২৪ ঘণ্টা</option>
                <option value="168">৭ দিন</option>
                <option value="720">৩০ দিন</option>
                <option value="never">সীমাহীন</option>
              </select>
            </label>

            <label className="flex items-center gap-2 pt-5 cursor-pointer">
              <input
                type="checkbox"
                checked={allowPdfDownload}
                onChange={(e) => setAllowPdfDownload(e.target.checked)}
                className="size-4 rounded border-slate-300 text-purple-600"
              />
              <span className="text-slate-700">PDF ডাউনলোড অনুমতি</span>
            </label>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-6 animate-spin text-indigo-600" />
            </div>
          ) : shareUrl ? (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 flex flex-col items-center gap-3">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <QRCodeSVG value={shareUrl} size={156} level="M" />
              </div>

              <div className="w-full flex items-center gap-1.5">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-sans text-slate-700"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs cursor-pointer"
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  <span>{copied ? "কপিড" : "কপি"}</span>
                </button>
              </div>

              <div className="w-full flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleEnableOrUpdateShare}
                  className="flex-1 py-1.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-semibold cursor-pointer"
                >
                  আপডেট করুন
                </button>
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold cursor-pointer"
                >
                  <ShieldOff className="size-3.5" />
                  <span>রিভোক</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEnableOrUpdateShare}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow cursor-pointer"
            >
              <Link2 className="size-4" />
              <span>পাবলিক লিংক ও QR কোড তৈরি করুন</span>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
