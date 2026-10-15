import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  Loader2,
  Sparkles,
  X,
  Check,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { resolveImageUrl } from "@/lib/imageUtils";
import { useQueryClient } from "@tanstack/react-query";

function extractFirstImageSrc(html) {
  if (!html || typeof html !== "string") return "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : "";
}

function replaceImageInHtml(html = "", newImagePath) {
  const newImgTag = `<img src="${newImagePath}" class="question-image max-w-full my-1 object-contain inline-block" alt="চিত্র" />`;
  if (!html || !html.trim()) {
    return `<p>${newImgTag}</p>`;
  }
  if (/<img[^>]*>/i.test(html)) {
    return html.replace(/<img[^>]*>/i, newImgTag);
  }
  return `${html}<p>${newImgTag}</p>`;
}

function removeImageFromHtml(html = "") {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<p>\s*<img[^>]*>\s*<\/p>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .trim();
}

export default function UpdateQuestionImageModal({
  isOpen = false,
  onClose = () => {},
  targetData = null,
}) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newImageRelativePath, setNewImageRelativePath] = useState("");
  const fileInputRef = useRef(null);

  // Reset states on target change or open
  useEffect(() => {
    if (isOpen) {
      setNewImageRelativePath("");
      setIsUploading(false);
      setIsSaving(false);
    }
  }, [isOpen, targetData]);

  if (!isOpen || !targetData || !targetData.question) return null;

  const { question, field, optIndex, currentHtml, label } = targetData;
  const currentImageSrc = extractFirstImageSrc(currentHtml);

  // Upload new image to Cloudflare R2
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
        setNewImageRelativePath(relativePath);
        toast.success("নতুন ছবি আপলোড হয়েছে!");
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

  const handlePaste = (e) => {
    if (isUploading || isSaving) return;
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

  // Build updated payload and save to DB
  const handleSaveUpdate = async () => {
    if (!newImageRelativePath) {
      toast.error("অনুগ্রহ করে একটি নতুন ছবি সিলেক্ট বা পেস্ট করুন!");
      return;
    }

    setIsSaving(true);
    try {
      let payload = {};

      if (field === "mcqOption") {
        const newOptions = [...(question.mcqData?.options || [])];
        newOptions[optIndex] = replaceImageInHtml(
          newOptions[optIndex],
          newImageRelativePath,
        );
        payload = {
          mcqData: {
            ...question.mcqData,
            options: newOptions,
          },
        };
      } else if (field === "mcqQuestionText") {
        const newText = replaceImageInHtml(
          question.mcqData?.questionText || "",
          newImageRelativePath,
        );
        payload = {
          mcqData: {
            ...question.mcqData,
            questionText: newText,
          },
        };
      } else if (field === "mcqStem") {
        const newStem = replaceImageInHtml(
          question.mcqData?.stem || "",
          newImageRelativePath,
        );
        payload = {
          mcqData: {
            ...question.mcqData,
            stem: newStem,
          },
        };
      } else if (field === "creativeStem") {
        const newStem = replaceImageInHtml(
          question.creativeData?.stem || "",
          newImageRelativePath,
        );
        payload = {
          creativeData: {
            ...question.creativeData,
            stem: newStem,
          },
        };
      } else if (field === "generalStem") {
        const newStem = replaceImageInHtml(
          question.generalData?.stem || "",
          newImageRelativePath,
        );
        payload = {
          generalData: {
            ...question.generalData,
            stem: newStem,
          },
        };
      } else if (field === "generalQuestionText") {
        const newText = replaceImageInHtml(
          question.generalData?.questionText || "",
          newImageRelativePath,
        );
        payload = {
          generalData: {
            ...question.generalData,
            questionText: newText,
          },
        };
      }

      await apiClient.put(`/questions/${question._id}`, payload);
      queryClient.invalidateQueries({ queryKey: ["myQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["globalQuestionsList"] });
      toast.success("ছবি সফলভাবে পরিবর্তন ও সেভ করা হয়েছে!");
      onClose();
    } catch (err) {
      console.error("Failed to update question image:", err);
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "ছবি আপডেট করতে ব্যর্থ হয়েছে!",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Remove existing image completely
  const handleRemoveImage = async () => {
    setIsSaving(true);
    try {
      let payload = {};

      if (field === "mcqOption") {
        const newOptions = [...(question.mcqData?.options || [])];
        newOptions[optIndex] = removeImageFromHtml(newOptions[optIndex]);
        payload = {
          mcqData: {
            ...question.mcqData,
            options: newOptions,
          },
        };
      } else if (field === "mcqQuestionText") {
        const newText = removeImageFromHtml(
          question.mcqData?.questionText || "",
        );
        payload = {
          mcqData: {
            ...question.mcqData,
            questionText: newText,
          },
        };
      } else if (field === "mcqStem") {
        const newStem = removeImageFromHtml(question.mcqData?.stem || "");
        payload = {
          mcqData: {
            ...question.mcqData,
            stem: newStem,
          },
        };
      } else if (field === "creativeStem") {
        const newStem = removeImageFromHtml(question.creativeData?.stem || "");
        payload = {
          creativeData: {
            ...question.creativeData,
            stem: newStem,
          },
        };
      } else if (field === "generalStem") {
        const newStem = removeImageFromHtml(question.generalData?.stem || "");
        payload = {
          generalData: {
            ...question.generalData,
            stem: newStem,
          },
        };
      } else if (field === "generalQuestionText") {
        const newText = removeImageFromHtml(
          question.generalData?.questionText || "",
        );
        payload = {
          generalData: {
            ...question.generalData,
            questionText: newText,
          },
        };
      }

      await apiClient.put(`/questions/${question._id}`, payload);
      queryClient.invalidateQueries({ queryKey: ["myQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["globalQuestionsList"] });
      toast.success("ছবি সফলভাবে মুছে ফেলা হয়েছে!");
      onClose();
    } catch (err) {
      console.error("Failed to remove question image:", err);
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "ছবি মুছতে ব্যর্থ হয়েছে!",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-5 sm:p-6 bg-white rounded-2xl shadow-2xl font-bengali">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="size-4.5 text-purple-600 animate-in spin-in-180" />
            <span>ছবি পরিবর্তন / আপডেট</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            {label || "প্রশ্নের ছবি আপডেট করুন"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Side by side: Current Image vs New Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Current Image Box */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-600 block">
                বর্তমান ছবি:
              </span>
              <div className="h-40 border border-slate-200 bg-slate-50 flex items-center justify-center p-2 overflow-hidden">
                {currentImageSrc ? (
                  <img
                    src={resolveImageUrl(currentImageSrc)}
                    alt="Current"
                    className="max-h-36 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400">
                    কোনো ছবি নেই
                  </span>
                )}
              </div>
            </div>

            {/* New Image Box */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-purple-700 block">
                নতুন ছবি:
              </span>
              <div className="h-40 border border-purple-200 bg-purple-50/30 flex items-center justify-center p-2 overflow-hidden">
                {newImageRelativePath ? (
                  <img
                    src={resolveImageUrl(newImageRelativePath)}
                    alt="New Preview"
                    className="max-h-36 max-w-full object-contain"
                  />
                ) : isUploading ? (
                  <div className="flex flex-col items-center gap-2 text-purple-600">
                    <Loader2 className="size-6 animate-spin" />
                    <span className="text-xs font-semibold">
                      আপলোড হচ্ছে...
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-purple-400 text-center px-2">
                    নিচের বক্স থেকে ছবি সিলেক্ট বা পেস্ট করুন
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Upload / Drag / Paste Dropzone */}
          <div
            tabIndex={0}
            onPaste={handlePaste}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleUploadFile(file);
            }}
            className={`p-3.5 border-2 border-dashed rounded-xl transition text-center outline-none focus:ring-2 focus:ring-purple-500/30 ${
              isDragging
                ? "border-purple-600 bg-purple-100/60"
                : "border-slate-300 hover:border-purple-500 bg-slate-50/60"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading || isSaving}
            />

            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isSaving}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>আপলোড হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />
                    <span>পিসি থেকে নতুন ছবি সিলেক্ট করুন</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-slate-500">
                অথবা ছবি ড্র্যাগ করে ছাড়ুন / ক্লিপবোর্ড থেকে স্ক্রিনশট <b>Ctrl+V</b> পেস্ট করুন
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          {currentImageSrc ? (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isSaving || isUploading}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
              <span>ছবি মুছে ফেলুন</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving || isUploading}
              className="cursor-pointer text-xs"
            >
              বাতিল
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveUpdate}
              disabled={!newImageRelativePath || isSaving || isUploading}
              className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>সেভ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>আপডেট নিশ্চিত করুন</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
