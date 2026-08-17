import { ArrowLeft, PlusCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import OMRScannerDashboard from "./components/OMRScannerDashboard";

export default function OMREvaluatorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialToken = searchParams.get("token") || "";

  const handleTokenChange = (newTokenId) => {
    if (newTokenId) {
      setSearchParams({ token: newTokenId });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              ওএমআর (OMR) শিট মূল্যায়ন ও ফলাফল
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
              Step 3
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            টোকেন নির্বাচন করে ওএমআর শিটের ছবি আপলোড করুন। এআই ভিশন ইঞ্জিন
            স্বয়ংক্রিয়ভাবে খাতা মূল্যায়ন ও মার্কশিট তৈরি করবে।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/omr/tokens"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>টোকেন তালিকা</span>
          </Link>

          <Link
            to="/dashboard/omr/tokens"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-xl border border-blue-200 dark:border-blue-800 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>নতুন টোকেন</span>
          </Link>
        </div>
      </div>

      {/* Main Scanner & Evaluation Dashboard */}
      <OMRScannerDashboard
        selectedTokenId={initialToken}
        onTokenChange={handleTokenChange}
      />
    </div>
  );
}
