import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { downloadSampleJsonFile } from "@/constants/sampleQuestionsTemplate";
import apiClient from "@/lib/apiClient";
import { validateQuestionsJson } from "@/lib/jsonQuestionValidator";
import { useAuth } from "@clerk/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileCode2,
  FileText,
  FileType,
  Layers3,
  Loader2,
  RotateCcw,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BulkImportModal({ open, onOpenChange, onSuccess }) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [rawJsonText, setRawJsonText] = useState("");
  const [fileName, setFileName] = useState("");
  const [activeTab, setActiveTab] = useState("file"); // 'file' | 'text'
  const [validationResult, setValidationResult] = useState(null);

  const resetState = () => {
    setRawJsonText("");
    setFileName("");
    setValidationResult(null);
  };

  const handleClose = (newOpen) => {
    if (!newOpen) {
      resetState();
    }
    onOpenChange(newOpen);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("শুধুমাত্র .json ফাইল ফরম্যাট গ্রহণযোগ্য");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setRawJsonText(content);
        const result = validateQuestionsJson(content);
        setValidationResult(result);
      }
    };
    reader.onerror = () => {
      toast.error("ফাইল পড়তে সমস্যা হয়েছে");
    };
    reader.readAsText(file);
  };

  const handleTextChange = (text) => {
    setRawJsonText(text);
    if (text.trim()) {
      const result = validateQuestionsJson(text);
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  };

  // Bulk Submit Mutation
  const bulkMutation = useMutation({
    mutationFn: async (questionsPayload) => {
      const token = await getToken();
      const response = await apiClient.post("/questions", questionsPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (data) => {
      const count =
        data?.questions?.length || validationResult?.validCount || 0;
      toast.success(`সফলভাবে ${count}টি প্রশ্ন ডাটাবেজে যুক্ত করা হয়েছে! 🎉`);

      // Invalidate React Query caches for immediate background refresh
      queryClient.invalidateQueries({ queryKey: ["myQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["globalQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["personalStats"] });

      if (onSuccess) onSuccess();
      handleClose(false);
    },
    onError: (err) => {
      console.error("Bulk Import Error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "ইমপোর্ট ব্যর্থ হয়েছে। দয়া করে সংযোগ বা ডাটা চেক করুন।";
      toast.error(msg);
    },
  });

  const handleExecuteImport = () => {
    if (!validationResult || !validationResult.isValid) {
      toast.error("সকল এরর সমাধান না করে ইমপোর্ট করা সম্ভব নয়");
      return;
    }

    bulkMutation.mutate(validationResult.questions);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="max-w-3xl border border-slate-200/50 bg-glass-elevated backdrop-blur-xl rounded-2xl shadow-2xl font-bengali p-3.5 sm:p-6 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="space-y-1 mb-1 sm:mb-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.05] pb-2">
            <DialogTitle className="flex items-center gap-1.5 sm:gap-2 text-[#900EB0] text-sm sm:text-lg font-bold font-sans">
              <UploadCloud className="size-4 sm:size-6 shrink-0" />
              <span>বাল্ক ইমপোর্ট (JSON)</span>
            </DialogTitle>

            <Button
              type="button"
              variant="outline"
              onClick={downloadSampleJsonFile}
              className="border-[#900EB0]/20 text-[#900EB0] hover:bg-[#900EB0]/10 rounded-lg sm:rounded-xl h-6 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
              title="টেমপ্লেট JSON ডাউনলোড করুন"
            >
              <Download className="size-3 sm:size-3.5" />
              <span>নমুনা টেমপ্লেট</span>
            </Button>
          </div>
          <DialogDescription className="text-slate-500 text-[10px] sm:text-xs font-sans font-medium text-center pt-0.5">
            একসাথে একাধিক MCQ বা সৃজনশীল প্রশ্ন ইমপোর্ট করুন।
          </DialogDescription>
        </DialogHeader>

        {/* Option Tabs: File vs Raw Text (Centered & Tight Gap) */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 border-b border-black/[0.06] pt-0.5 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
              activeTab === "file"
                ? "bg-[#900EB0] text-white shadow-md shadow-[#900EB0]/20"
                : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <FileCode2 className="size-3 sm:size-3.5 shrink-0" />
            <span>JSON ফাইল আপলোড</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
              activeTab === "text"
                ? "bg-[#900EB0] text-white shadow-md shadow-[#900EB0]/20"
                : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <FileType className="size-3 sm:size-3.5 shrink-0" />
            <span>JSON টেক্সট পেস্ট করুন</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "file" ? (
          <div className="space-y-3 py-2">
            <label className="border-2 border-dashed border-[#900EB0]/30 hover:border-[#900EB0] bg-[#900EB0]/5 hover:bg-[#900EB0]/10 transition-all rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer text-center group">
              <UploadCloud className="size-8 sm:size-10 text-[#900EB0] group-hover:scale-110 transition-transform duration-200 mb-2" />
              <span className="text-xs sm:text-sm font-bold text-slate-700 font-sans">
                {fileName
                  ? fileName
                  : "এখানে ক্লিক করে .json ফাইল নির্বাচন করুন"}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 mt-1 font-sans">
                অথবা ড্র্যাগ করে ফাইলটি ছেড়ে দিন
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-1.5 py-2">
            <label className="text-[10px] sm:text-xs font-bold text-slate-600 font-sans block">
              JSON কোড পেস্ট করুন:
            </label>
            <textarea
              rows={8}
              placeholder={`[\n  {\n    "className": "Class 6",\n    "institutionType": "School",\n    ...\n  }\n]`}
              value={rawJsonText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full resize-none bg-white/70 border border-black/[0.1] focus:ring-2 focus:ring-[#900EB0]/20 focus:border-[#900EB0] outline-none rounded-xl font-mono text-[10px] sm:text-xs p-2.5 sm:p-3 text-slate-800"
            />
          </div>
        )}

        {/* Validation Result Area */}
        {validationResult && (
          <div className="space-y-3 pt-2">
            {validationResult.isValid ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 sm:p-4 text-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm font-sans">
                  <CheckCircle2 className="size-4 sm:size-5 text-emerald-600 shrink-0" />
                  <span>
                    ডিজিটাল ভ্যালিডেশন সফল! সকল ডেটা ইমপোর্টের জন্য প্রস্তুত।
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold pt-1">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1 font-sans">
                    <FileText className="size-3 sm:size-3.5" />
                    মোট প্রশ্ন:{" "}
                    {validationResult.totalCount.toLocaleString("bn-BD")}টি
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1 font-sans">
                    <Layers3 className="size-3 sm:size-3.5" />
                    MCQ:{" "}
                    {validationResult.stats.mcqCount.toLocaleString("bn-BD")}টি
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1 font-sans">
                    <Sparkles className="size-3 sm:size-3.5" />
                    সৃজনশীল (CQ):{" "}
                    {validationResult.stats.creativeCount.toLocaleString(
                      "bn-BD",
                    )}
                    টি
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 sm:p-4 text-rose-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm font-sans text-rose-700">
                  <AlertCircle className="size-4 sm:size-5 text-rose-600 shrink-0" />
                  <span>
                    ভ্যালিডেশন ব্যর্থ হয়েছে ({validationResult.errors.length}টি
                    এরর পাওয়া গেছে)
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-rose-600 font-semibold font-sans">
                  দয়া করে JSON ফাইলটির নিম্নলিখিত ত্রুটিগুলো সংশোধন করুন:
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2 pt-1">
                  {validationResult.errors.map((err, idx) => (
                    <div
                      key={idx}
                      className="bg-white/80 border border-rose-200 text-rose-700 text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg font-mono font-medium flex items-start gap-1.5"
                    >
                      <span className="font-bold shrink-0">•</span>
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Action Buttons */}
        <DialogFooter className="flex flex-row items-center justify-between gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-black/[0.06]">
          <Button
            type="button"
            variant="ghost"
            onClick={resetState}
            disabled={bulkMutation.isPending}
            className="text-slate-500 hover:text-slate-700 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold h-7 sm:h-9 px-2 sm:px-3 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <RotateCcw className="size-3 sm:size-3.5" />
            <span>রিসেট</span>
          </Button>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={bulkMutation.isPending}
              className="border-black/[0.08] text-slate-600 hover:bg-black/[0.02] rounded-lg sm:rounded-xl font-semibold text-[10px] sm:text-xs h-7 sm:h-9 px-2.5 sm:px-4 cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              type="button"
              onClick={handleExecuteImport}
              disabled={
                !validationResult ||
                !validationResult.isValid ||
                bulkMutation.isPending
              }
              className="bg-[#900EB0] hover:bg-[#720A7B] text-white rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs h-7 sm:h-9 px-3 sm:px-5 flex items-center gap-1 sm:gap-1.5 shadow-md shadow-[#900EB0]/20 cursor-pointer disabled:opacity-50"
            >
              {bulkMutation.isPending ? (
                <>
                  <Loader2 className="size-3 sm:size-4 animate-spin" />
                  <span>ইমপোর্ট হচ্ছে...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="size-3 sm:size-4" />
                  <span>ইমপোর্ট করুন</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
