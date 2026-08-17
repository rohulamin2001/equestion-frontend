import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import OMRTokenManager from "./components/OMRTokenManager";

export default function OMRTokenPage() {
  const navigate = useNavigate();

  const handleSelectTokenForEvaluation = (tokenId) => {
    navigate(`/dashboard/omr/evaluator?token=${encodeURIComponent(tokenId)}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              ওএমআর (OMR) টোকেন ও উত্তরমালা
            </h1>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-200 dark:border-indigo-800">
              Step 2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            প্রতিটি পরীক্ষার জন্য সঠিক উত্তরমালা (Answer Key), নেগেটিভ মার্কিং ও
            টোকেন আইডি সেট করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/omr/generate"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ওএমআর প্রিন্ট</span>
          </Link>

          <Link
            to="/dashboard/omr/evaluator"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800 transition"
          >
            <span>ওএমআর মূল্যায়ন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Token & Answer Key Manager */}
      <OMRTokenManager
        onSelectTokenForEvaluation={handleSelectTokenForEvaluation}
      />
    </div>
  );
}
