import { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  ZoomIn,
  Loader2,
  X,
  Sparkles,
  ClipboardPaste,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { resolveImageUrl } from "@/lib/imageUtils";

/**
 * QuestionImageSlot
 * A dedicated component for attaching, previewing, and managing images
 * with support for click-to-browse, drag-and-drop, and Ctrl+V clipboard paste.
 */
export default function QuestionImageSlot({
  imageUrl = "",
  onImageAttached = () => {},
  onImageRemoved = () => {},
  label = "চিত্র",
  compact = false,
  disabled = false,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadFile = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) {
      toast.error("শুধুমাত্র ইমেজ ফাইল (PNG, JPG, WEBP, GIF) গ্রহণযোগ্য!");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ছবির সর্বোচ্চ সাইজ ১০ মেগাবাইট হতে পারে!");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "questions");

      const res = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && (res.data.path || res.data.relativePath)) {
        const relativePath = res.data.path || res.data.relativePath;
        onImageAttached(relativePath);
        toast.success("ছবি Cloudflare R2-তে আপলোড হয়েছে!");
      } else {
        throw new Error(res.data?.error || "আপলোড ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error(
        err.response?.data?.error || err.message || "ছবি আপলোড করা যায়নি!",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
      e.target.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handlePaste = (e) => {
    if (disabled || isUploading) return;
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        e.stopPropagation();
        const blob = items[i].getAsFile();
        if (blob) {
          toast.info("ক্লিপবোর্ড থেকে স্ক্রিনশট পাওয়া গেছে, আপলোড হচ্ছে...");
          handleUploadFile(blob);
          return;
        }
      }
    }
  };

  // Compact mode (used beside MCQ options)
  if (compact) {
    if (imageUrl) {
      const fullUrl = resolveImageUrl(imageUrl);
      return (
        <div className="relative inline-flex items-center group shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
          />
          <div
            onClick={() => setIsZoomOpen(true)}
            className="h-9 min-w-9 max-w-28 border border-purple-300 bg-white cursor-pointer shadow-2xs hover:border-purple-600 transition flex items-center justify-center p-0.5"
            title="ছবি বড় করে দেখুন"
          >
            <img
              src={fullUrl}
              alt={label}
              className="max-h-8 max-w-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          {!disabled && (
            <div className="absolute -top-1.5 -right-1.5 flex items-center gap-0.5 opacity-90 group-hover:opacity-100 transition z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageRemoved();
                  toast.info("অপশনের ছবি সরানো হয়েছে");
                }}
                className="size-4.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-xs transition cursor-pointer"
                title="ছবি রিমুভ করুন"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          {/* Zoom Modal */}
          {isZoomOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
              onClick={() => setIsZoomOpen(false)}
            >
              <div
                className="relative max-w-2xl max-h-[85vh] bg-white p-2 rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="absolute -top-3 -right-3 size-8 bg-slate-800 text-white hover:bg-rose-600 rounded-full flex items-center justify-center shadow-lg transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
                <img
                  src={fullUrl}
                  alt={label}
                  className="max-h-[80vh] w-auto object-contain"
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className="inline-flex items-center shrink-0"
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className={`size-8 rounded-lg border flex items-center justify-center transition cursor-pointer ${
            isDragging
              ? "border-purple-600 bg-purple-100 text-purple-700 animate-pulse"
              : isUploading
                ? "border-slate-300 bg-slate-100 text-slate-400"
                : "border-dashed border-slate-300 hover:border-purple-500 bg-white hover:bg-purple-50 text-slate-500 hover:text-purple-600 shadow-2xs"
          }`}
          title="অপশনে ছবি যোগ করুন (ক্লিক / ড্রপ / Ctrl+V)"
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin text-purple-600" />
          ) : (
            <ImageIcon className="size-4" />
          )}
        </button>
      </div>
    );
  }

  // Normal mode (for Stem / Question Text / CQ)
  if (imageUrl) {
    const fullUrl = resolveImageUrl(imageUrl);
    return (
      <div className="mt-2 p-3 bg-purple-50/40 border border-purple-200/80 rounded-xl space-y-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
        <div className="flex items-center justify-between text-xs font-semibold text-purple-900">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="size-3.5 text-purple-600" />
            <span>সংযুক্ত {label}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="px-2 py-1 bg-white hover:bg-purple-100 text-purple-700 rounded-md border border-purple-200 text-[11px] font-medium flex items-center gap-1 shadow-2xs transition cursor-pointer"
            >
              <ZoomIn className="size-3" />
              <span>বড় করুন</span>
            </button>
            {!disabled && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-2 py-1 bg-white hover:bg-purple-100 text-purple-700 rounded-md border border-purple-200 text-[11px] font-medium flex items-center gap-1 shadow-2xs transition cursor-pointer"
                >
                  <Upload className="size-3" />
                  <span>পরিবর্তন</span>
                </button>
                <button
                  type="button"
                  onClick={onImageRemoved}
                  className="px-2 py-1 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-md border border-rose-200 hover:border-rose-600 text-[11px] font-medium flex items-center gap-1 shadow-2xs transition cursor-pointer"
                >
                  <Trash2 className="size-3" />
                  <span>মুছে ফেলুন</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div
          className="relative max-w-sm border border-purple-200/70 bg-white p-1 cursor-pointer group shadow-2xs"
          onClick={() => setIsZoomOpen(true)}
        >
          <img
            src={fullUrl}
            alt={label}
            className="max-h-48 w-auto object-contain mx-auto group-hover:scale-[1.01] transition"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Zoom Modal */}
        {isZoomOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsZoomOpen(false)}
          >
            <div
              className="relative max-w-3xl max-h-[85vh] bg-white p-3 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="absolute -top-3 -right-3 size-8 bg-slate-800 text-white hover:bg-rose-600 rounded-full flex items-center justify-center shadow-lg transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
              <img
                src={fullUrl}
                alt={label}
                className="max-h-[80vh] w-auto object-contain mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      onPaste={handlePaste}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-2 p-3.5 rounded-xl border-2 border-dashed transition-all outline-none focus:ring-2 focus:ring-purple-500/30 ${
        isDragging
          ? "border-purple-600 bg-purple-100/60 ring-4 ring-purple-600/10 scale-[1.005]"
          : isUploading
            ? "border-purple-300 bg-purple-50/50 cursor-wait"
            : "border-slate-300/80 hover:border-purple-500 bg-slate-50/60 hover:bg-purple-50/30"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-left">
          <div
            className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition ${
              isUploading
                ? "bg-purple-100 text-purple-600"
                : "bg-white text-purple-600 border border-purple-200/60 shadow-2xs"
            }`}
          >
            {isUploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <ImageIcon className="size-5" />
            )}
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span>{label} যুক্ত করুন</span>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono font-medium">
                Ctrl+V পেস্ট সাপোর্ট
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              ক্লিক করে ফাইল সিলেক্ট করুন, ড্রপ করুন অথবা ক্লিপবোর্ড থেকে স্ক্রিনশট পেস্ট করুন।
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="px-3.5 py-1.5 bg-white hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-300 hover:border-purple-600 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>আপলোড হচ্ছে...</span>
            </>
          ) : (
            <>
              <Upload className="size-3.5" />
              <span>ছবি সিলেক্ট করুন</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
