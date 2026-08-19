import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  ChevronDown,
  Download,
  Eye,
  RefreshCw,
  Scan,
  Search,
  Trash2,
  UploadCloud,
  UserCheck,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  useDeleteOMRResult,
  useEvaluateOMR,
  useOMRResults,
  useOMRTokens,
  usePythonServiceHealth,
} from "../hook/useOMREvaluation";

export default function OMRScannerDashboard({
  selectedTokenId,
  onTokenChange,
}) {
  const { data: tokens = [] } = useOMRTokens();
  const { data: health } = usePythonServiceHealth();
  const evaluateMutation = useEvaluateOMR();
  const deleteResultMutation = useDeleteOMRResult();

  const [internalTokenId, setInternalTokenId] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isEvaluatingBatch, setIsEvaluatingBatch] = useState(false);
  const [searchRoll, setSearchRoll] = useState("");
  const [viewingResult, setViewingResult] = useState(null);

  const fileInputRef = useRef(null);

  // Derive activeTokenId directly during rendering (no cascading renders via useEffect)
  const activeTokenId =
    selectedTokenId ||
    internalTokenId ||
    (tokens.length > 0 ? tokens[0].tokenId : "");

  const activeToken = tokens.find((t) => t.tokenId === activeTokenId);
  const {
    data: resultsData,
    isLoading: loadingResults,
    refetch: refetchResults,
  } = useOMRResults(activeTokenId);

  const results = resultsData?.results || [];
  const summary = resultsData?.summary || {
    totalEvaluated: 0,
    completed: 0,
    manualReview: 0,
    highestScore: 0,
    averageScore: 0,
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files) => {
    const validImageFiles = files.filter((f) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type),
    );

    if (validImageFiles.length === 0) {
      toast.error("শুধুমাত্র JPEG, PNG অথবা WebP ফরম্যাটের ছবি আপলোড করুন");
      return;
    }

    const newEntries = validImageFiles.map((file) => ({
      id: `${file.name}_${Date.now()}_${Math.random()}`,
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      preview: URL.createObjectURL(file),
      status: "READY", // READY, EVALUATING, SUCCESS, ERROR
      errorMessage: null,
      result: null,
    }));

    setSelectedFiles((prev) => [...prev, ...newEntries]);
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Evaluate All Uploaded Files
  const handleEvaluateAll = async () => {
    if (!activeTokenId) {
      toast.error("মূল্যায়নের জন্য প্রথমে একটি OMR টোকেন নির্বাচন করুন");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("মূল্যায়ন করার জন্য অন্তত একটি OMR ছবি আপলোড করুন");
      return;
    }

    setIsEvaluatingBatch(true);

    for (let i = 0; i < selectedFiles.length; i++) {
      const item = selectedFiles[i];
      if (item.status === "SUCCESS") continue;

      // Update status to EVALUATING
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === item.id ? { ...f, status: "EVALUATING" } : f,
        ),
      );

      const formData = new FormData();
      formData.append("image", item.file);
      formData.append("tokenId", activeTokenId);

      try {
        const res = await evaluateMutation.mutateAsync({ formData });
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: "SUCCESS", result: res.result }
              : f,
          ),
        );
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || "মূল্যায়ন ব্যর্থ হয়েছে";
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, status: "ERROR", errorMessage: msg } : f,
          ),
        );
      }
    }

    setIsEvaluatingBatch(false);
    toast.success("OMR মূল্যায়ন সমাপ্ত হয়েছে!");
    refetchResults();
  };

  // Export Marksheet as CSV
  const handleExportCSV = () => {
    if (results.length === 0) {
      toast.error("এক্সপোর্ট করার মতো কোনো রেজাল্ট নেই");
      return;
    }

    const headers = [
      "Student Roll",
      "Set Code",
      "Total Score",
      "Correct Answers",
      "Wrong Answers",
      "Blank",
      "Multiple Mark",
      "Status",
      "Evaluated At",
    ];

    const rows = results.map((r) => [
      `"${r.studentRoll}"`,
      `"${r.setCode || "A"}"`,
      r.totalScore,
      r.correctCount,
      r.wrongCount,
      r.blankCount,
      r.multipleTouchCount,
      `"${r.status}"`,
      `"${new Date(r.evaluatedAt).toLocaleString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `OMR_Results_${activeToken?.examTitle || activeTokenId}_${Date.now()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV মার্কশিট ডাউনলোড হয়েছে!");
  };

  // Filtered Results
  const filteredResults = results.filter((r) =>
    searchRoll.trim()
      ? r.studentRoll.toLowerCase().includes(searchRoll.toLowerCase().trim())
      : true,
  );

  return (
    <div className="space-y-6">
      {/* Top Token Selector & Engine Health Bar */}
      <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
            সক্রিয় টোকেন:
          </label>
          <div className="relative flex-1 max-w-md">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full h-10 px-3.5 border border-black/[0.08] dark:border-white/10 bg-white dark:bg-slate-800 hover:border-[#900EB0]/40 focus:outline-none focus:ring-2 focus:ring-[#900EB0]/20 transition-all rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex justify-between items-center shadow-xs backdrop-blur-sm cursor-pointer select-none"
                >
                  <span className="truncate">
                    {activeToken
                      ? `${activeToken.tokenId} - ${activeToken.examTitle} (${activeToken.totalQuestions} প্রশ্ন)`
                      : "কোনো টোকেন তৈরি নেই"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/[0.08] dark:border-slate-800 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[280px] max-h-60 overflow-y-auto"
              >
                {tokens.length === 0 ? (
                  <div className="p-3 text-xs text-muted-foreground text-center">
                    কোনো টোকেন তৈরি নেই
                  </div>
                ) : (
                  tokens.map((t) => {
                    const isSelected = activeTokenId === t.tokenId;
                    return (
                      <DropdownMenuItem
                        key={t._id}
                        onSelect={() => {
                          setInternalTokenId(t.tokenId);
                          if (onTokenChange) onTokenChange(t.tokenId);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-[#900EB0]/10 focus:text-[#900EB0] hover:bg-purple-50/60 dark:hover:bg-slate-800 group ${
                          isSelected
                            ? "bg-[#900EB0]/10 text-[#900EB0] font-bold"
                            : "text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <span>
                          {t.tokenId} - {t.examTitle} ({t.totalQuestions}{" "}
                          প্রশ্ন)
                        </span>
                        {isSelected && (
                          <span className="size-1.5 rounded-full bg-[#900EB0]" />
                        )}
                      </DropdownMenuItem>
                    );
                  })
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Python Engine Status Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${
              health?.healthy
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                health?.healthy
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-amber-500"
              }`}
            />
            <span>Python Engine: {health?.healthy ? "ONLINE" : "STANDBY"}</span>
          </div>

          <button
            onClick={() => refetchResults()}
            className="p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upload Zone & Batch Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drag & Drop Card */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px] ${
              dragActive
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                : "border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-white/50 dark:bg-slate-900/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl mb-3 shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
              OMR শিটের ছবি টেনে এনে ছেড়ে দিন অথবা ক্লিক করুন
            </h4>
            <p className="text-xs text-slate-500 max-w-xs">
              JPEG, PNG বা WebP ফরম্যাট। একাধিক খাতা একসাথে মূল্যায়ন করতে একসাথে
              একাধিক ছবি সিলেক্ট করুন।
            </p>
          </div>

          {/* Selected Files Queue */}
          {selectedFiles.length > 0 && (
            <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  আপলোড কিউ ({selectedFiles.length} টি ছবি)
                </span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-[11px] text-red-500 hover:underline"
                >
                  সব ক্লিয়ার
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedFiles.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={item.preview}
                        alt="preview"
                        className="w-8 h-8 rounded object-cover border border-slate-200"
                      />
                      <div className="truncate">
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.size} MB
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === "EVALUATING" && (
                        <span className="text-[10px] text-blue-600 animate-pulse font-bold">
                          প্রসেসিং...
                        </span>
                      )}
                      {item.status === "SUCCESS" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>স্কোর: {item.result?.totalScore}</span>
                        </span>
                      )}
                      {item.status === "ERROR" && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] text-red-500 font-bold"
                          title={item.errorMessage}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>ব্যর্থ</span>
                        </span>
                      )}

                      <button
                        onClick={() => removeFile(item.id)}
                        disabled={isEvaluatingBatch}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleEvaluateAll}
                disabled={isEvaluatingBatch || selectedFiles.length === 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isEvaluatingBatch ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>মূল্যায়ন হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>সকল খাতা মূল্যায়ন শুরু করুন</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Live Evaluation Summary Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
              <div className="text-[11px] text-slate-500 font-medium mb-1">
                মোট মূল্যায়িত
              </div>
              {loadingResults ? (
                <Skeleton className="h-7 w-12 rounded-md mt-0.5" />
              ) : (
                <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {summary.totalEvaluated}
                </div>
              )}
            </div>

            <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
              <div className="text-[11px] text-emerald-600 font-medium mb-1">
                সফল সম্পন্ন
              </div>
              {loadingResults ? (
                <Skeleton className="h-7 w-12 rounded-md mt-0.5" />
              ) : (
                <div className="text-xl font-bold text-emerald-600">
                  {summary.completed}
                </div>
              )}
            </div>

            <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
              <div className="text-[11px] text-blue-600 font-medium mb-1">
                সর্বোচ্চ নম্বর
              </div>
              {loadingResults ? (
                <Skeleton className="h-7 w-12 rounded-md mt-0.5" />
              ) : (
                <div className="text-xl font-bold text-blue-600">
                  {summary.highestScore}
                </div>
              )}
            </div>

            <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
              <div className="text-[11px] text-amber-600 font-medium mb-1">
                ম্যানুয়াল রিভিউ
              </div>
              {loadingResults ? (
                <Skeleton className="h-7 w-12 rounded-md mt-0.5" />
              ) : (
                <div className="text-xl font-bold text-amber-600">
                  {summary.manualReview}
                </div>
              )}
            </div>
          </div>

          {/* Exam Details Card */}
          {activeToken && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-300">
                  {activeToken.tokenId}
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                  {activeToken.omrTemplate?.title || "Standard Template"}
                </span>
              </div>
              <h3 className="font-bold text-base">{activeToken.examTitle}</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1 border-t border-slate-700">
                <div>
                  বিষয়:{" "}
                  <span className="font-medium text-white">
                    {activeToken.subject || "সাধারণ"}
                  </span>
                </div>
                <div>
                  প্রশ্ন সংখ্যা:{" "}
                  <span className="font-medium text-white">
                    {activeToken.totalQuestions} টি
                  </span>
                </div>
                <div>
                  সঠিক উত্তরে:{" "}
                  <span className="font-medium text-emerald-400">
                    +{activeToken.marksPerQuestion}
                  </span>
                </div>
                <div>
                  ভুল উত্তরে:{" "}
                  <span className="font-medium text-red-400">
                    -{activeToken.negativeMarks}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Table & Marksheet */}
      <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              শিক্ষার্থীদের ফলাফল মার্কশিট ({filteredResults.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchRoll}
                onChange={(e) => setSearchRoll(e.target.value)}
                placeholder="রোল নম্বর খুঁজুন..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              onClick={handleExportCSV}
              disabled={results.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV মার্কশিট</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {loadingResults ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">রোল নম্বর</th>
                  <th className="py-2.5 px-3">সেট</th>
                  <th className="py-2.5 px-3">মোট প্রাপ্ত নম্বর</th>
                  <th className="py-2.5 px-3">সঠিক</th>
                  <th className="py-2.5 px-3">ভুল</th>
                  <th className="py-2.5 px-3">ব্ল্যাঙ্ক</th>
                  <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <td className="py-3 px-3">
                      <Skeleton className="h-4 w-16 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <Skeleton className="h-4 w-6 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <Skeleton className="h-5 w-10 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <Skeleton className="h-4 w-8 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <Skeleton className="h-4 w-8 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <Skeleton className="h-4 w-8 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Skeleton className="h-7 w-7 rounded-lg" />
                        <Skeleton className="h-7 w-7 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            এই টোকেনের আওতায় এখনো কোনো ওএমআর খাতা মূল্যায়ন করা হয়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">রোল নম্বর</th>
                  <th className="py-2.5 px-3">সেট</th>
                  <th className="py-2.5 px-3">মোট প্রাপ্ত নম্বর</th>
                  <th className="py-2.5 px-3">সঠিক</th>
                  <th className="py-2.5 px-3">ভুল</th>
                  <th className="py-2.5 px-3">ব্ল্যাঙ্ক</th>
                  <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredResults.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {item.studentRoll}
                    </td>
                    <td className="py-2.5 px-3 font-semibold">
                      {item.setCode || "A"}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                        {item.totalScore}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold">
                      {item.correctCount}
                    </td>
                    <td className="py-2.5 px-3 text-red-500 font-semibold">
                      {item.wrongCount}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {item.blankCount}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60"
                            : item.status === "MANUAL_REVIEW"
                              ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60"
                              : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setViewingResult(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition"
                          title="ওভারলে ও উত্তরপত্র দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm("এই রেজাল্টটি ডিলিট করতে চান?")
                            ) {
                              deleteResultMutation.mutate({
                                resultId: item._id,
                                tokenId: activeTokenId,
                              });
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition"
                          title="ডিলিট"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VISUAL MARKED OVERLAY MODAL */}
      {createPortal(
        <AnimatePresence>
          {viewingResult && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              {/* Neutral Backdrop with blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                onClick={() => setViewingResult(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              />

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: -16,
                  filter: "blur(4px)",
                }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, y: -16, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden z-10"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      মূল্যায়িত খাতার বিস্তারিত (রোল:{" "}
                      {viewingResult.studentRoll})
                    </h3>
                    <p className="text-xs text-slate-500">
                      স্কোর:{" "}
                      <b className="text-blue-600">
                        {viewingResult.totalScore}
                      </b>{" "}
                      | সঠিক:{" "}
                      <b className="text-emerald-600">
                        {viewingResult.correctCount}
                      </b>{" "}
                      | ভুল:{" "}
                      <b className="text-red-500">{viewingResult.wrongCount}</b>
                    </p>
                  </div>

                  <button
                    onClick={() => setViewingResult(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Annotated Sheet Image */}
                  <div className="md:col-span-7 flex justify-center bg-slate-950 p-2 rounded-2xl">
                    {viewingResult.annotatedImageBase64 ? (
                      <img
                        src={viewingResult.annotatedImageBase64}
                        alt="Annotated OMR"
                        className="max-h-[500px] w-auto object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="text-slate-400 text-xs flex items-center justify-center h-48">
                        ওভারলে ছবি পাওয়া যায়নি
                      </div>
                    )}
                  </div>

                  {/* Answers Grid Details */}
                  <div className="md:col-span-5 space-y-3">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      প্রশ্নের উত্তর বিবরণী
                    </div>
                    <div className="max-h-[440px] overflow-y-auto space-y-1.5 pr-1">
                      {(viewingResult.studentAnswers || []).map((ans) => (
                        <div
                          key={ans.questionNo}
                          className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                            ans.isCorrect
                              ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
                              : ans.state === "BLANK"
                                ? "bg-slate-50 border-slate-200 dark:bg-slate-800"
                                : "bg-red-50/50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
                          }`}
                        >
                          <span className="font-mono font-bold w-6">
                            Q{ans.questionNo}.
                          </span>
                          <span className="font-semibold">
                            উত্তর:{" "}
                            <b className="font-mono">
                              {ans.selectedAnswer || "N/A"}
                            </b>
                          </span>
                          <span className="text-[10px] font-bold">
                            {ans.isCorrect ? (
                              <span className="text-emerald-600">✔ সঠিক</span>
                            ) : ans.state === "BLANK" ? (
                              <span className="text-slate-400">খালি</span>
                            ) : ans.state === "MULTIPLE" ? (
                              <span className="text-amber-500">একাধিক</span>
                            ) : ans.state === "DAMAGED" ? (
                              <span className="text-purple-500">
                                ক্ষতিগ্রস্ত
                              </span>
                            ) : ans.state === "UNCERTAIN" ? (
                              <span className="text-amber-500">অস্পষ্ট</span>
                            ) : (
                              <span className="text-red-500">✖ ভুল</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
