import { ArrowLeft, ArrowRight, KeyRound, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import OMRTokenManager from "./components/OMRTokenManager";

export default function OMRTokenPage() {
  const navigate = useNavigate();

  const handleSelectTokenForEvaluation = (tokenId) => {
    navigate(`/dashboard/omr/evaluator?token=${encodeURIComponent(tokenId)}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header — Glassmorphic Purple Brand Card */}
      <div className="bg-glass rounded-2xl shadow-soft px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: Icon + Title + Description */}
          <div className="flex items-start gap-3.5">
            {/* Page Icon */}
            <div
              className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--q-header-gradient)",
                boxShadow: "var(--sidebar-brand-shadow)",
              }}
            >
              <KeyRound className="w-5 h-5 text-white" strokeWidth={2} />
            </div>

            {/* Title + Badge + Description */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  ওএমআর (OMR) টোকেন ও উত্তরমালা
                </h1>
                {/* Step Badge — purple brand */}
                <span
                  className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full border"
                  style={{
                    backgroundColor: "var(--purple-50)",
                    color: "var(--purple-700)",
                    borderColor: "var(--purple-100)",
                  }}
                >
                  Step 2
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 leading-relaxed">
                <Sparkles
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "var(--purple-600)" }}
                />
                প্রতিটি পরীক্ষার জন্য সঠিক উত্তরমালা (Answer Key), নেগেটিভ
                মার্কিং ও টোকেন আইডি সেট করুন।
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Secondary — Back to OMR Print */}
            <Link
              to="/dashboard/omr/generate"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors focus-ring-modern hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
                border: "1px solid var(--q-badge-border)",
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ওএমআর প্রিন্ট</span>
            </Link>

            {/* Primary — Go to Evaluator */}
            <Link
              to="/dashboard/omr/evaluator"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white transition-colors focus-ring-modern hover:opacity-90 cursor-pointer"
              style={{
                background: "var(--q-header-gradient)",
                boxShadow: "var(--q-print-btn-shadow)",
              }}
            >
              <span>ওএমআর মূল্যায়ন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Token & Answer Key Manager */}
      <OMRTokenManager
        onSelectTokenForEvaluation={handleSelectTokenForEvaluation}
      />
    </div>
  );
}
