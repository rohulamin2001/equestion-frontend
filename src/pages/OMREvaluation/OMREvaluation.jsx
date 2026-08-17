import { KeyRound, Printer, Scan } from "lucide-react";
import { useState } from "react";
import OMRScannerDashboard from "./components/OMRScannerDashboard";
import OMRSheetPrintView from "./components/OMRSheetPrintView";
import OMRTokenManager from "./components/OMRTokenManager";
import { useOMRTemplates } from "./hook/useOMREvaluation";

export default function OMREvaluation() {
  const [activeTab, setActiveTab] = useState("generator"); // 'generator' | 'tokens' | 'evaluator'
  const [selectedTokenForEval, setSelectedTokenForEval] = useState("");
  const { data: templates = [] } = useOMRTemplates();

  const handleSelectTokenForEvaluation = (tokenId) => {
    setSelectedTokenForEval(tokenId);
    setActiveTab("evaluator");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header (Hidden on Print) */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              স্মার্ট OMR মূল্যায়ন হাব
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold rounded-full border border-blue-200 dark:border-blue-800">
              AI Vision V1.0
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            স্বয়ংক্রিয় ওএমআর শিট জেনারেশন, টোকেন ও উত্তরমালা ব্যবস্থাপনা এবং
            হাই-স্পিড ইমেজ প্রসেসিং মূল্যায়ন
          </p>
        </div>
      </div>

      {/* 3-Step Flow Indicator Tabs (Hidden on Print) */}
      <div className="print:hidden grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Step 1 Tab */}
        <button
          onClick={() => setActiveTab("generator")}
          className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition relative overflow-hidden ${
            activeTab === "generator"
              ? "bg-white dark:bg-slate-900 border-blue-500 shadow-md shadow-blue-500/5 ring-1 ring-blue-500"
              : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900"
          }`}
        >
          <div
            className={`p-3 rounded-xl transition ${
              activeTab === "generator"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Step 1
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Generate OMR
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              প্রিন্টযোগ্য OMR শিট তৈরি ও কোড সংরক্ষণ
            </div>
          </div>
        </button>

        {/* Step 2 Tab */}
        <button
          onClick={() => setActiveTab("tokens")}
          className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition relative overflow-hidden ${
            activeTab === "tokens"
              ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500"
              : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900"
          }`}
        >
          <div
            className={`p-3 rounded-xl transition ${
              activeTab === "tokens"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Step 2
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Get OMR Token
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              উত্তরমালা ও পরীক্ষার টোকেন সংরক্ষণ
            </div>
          </div>
        </button>

        {/* Step 3 Tab */}
        <button
          onClick={() => setActiveTab("evaluator")}
          className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition relative overflow-hidden ${
            activeTab === "evaluator"
              ? "bg-white dark:bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500"
              : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900"
          }`}
        >
          <div
            className={`p-3 rounded-xl transition ${
              activeTab === "evaluator"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Step 3
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Evaluate OMR
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              টোকেন দিয়ে ওএমআর শিট স্ক্যান ও মার্কশিট
            </div>
          </div>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="transition-all duration-300">
        {activeTab === "generator" && (
          <OMRSheetPrintView templates={templates} />
        )}

        {activeTab === "tokens" && (
          <OMRTokenManager
            onSelectTokenForEvaluation={handleSelectTokenForEvaluation}
          />
        )}

        {activeTab === "evaluator" && (
          <OMRScannerDashboard
            selectedTokenId={selectedTokenForEval}
            onTokenChange={(id) => setSelectedTokenForEval(id)}
          />
        )}
      </div>
    </div>
  );
}
