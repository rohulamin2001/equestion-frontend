import { ArrowLeft, Brain, PlusCircle, ScanLine } from "lucide-react";
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
      {/* Top Header — Glassmorphic Purple Brand Card */}
      <div className="bg-glass rounded-2xl shadow-soft px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: Icon + Title + Description */}
          <div className="flex items-start gap-3.5">
            {/* Page Icon */}
            <div
              className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                background: "var(--q-header-gradient)",
                boxShadow: "var(--sidebar-brand-shadow)",
              }}
            >
              <ScanLine className="w-5 h-5 text-white" strokeWidth={2} />
            </div>

            {/* Title + Badge + Description */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  ওএমআর (OMR) শিট মূল্যায়ন ও ফলাফল
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
                  Step 3
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 leading-relaxed">
                <Brain
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "var(--purple-600)" }}
                />
                টোকেন নির্বাচন করে ওএমআর শিটের ছবি আপলোড করুন। এআই ভিশন ইঞ্জিন
                স্বয়ংক্রিয়ভাবে খাতা মূল্যায়ন ও মার্কশিট তৈরি করবে।
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Secondary — Back to Token List */}
            <Link
              to="/dashboard/omr/tokens"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-modern hover-lift focus-ring-modern"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
                border: "1px solid var(--q-badge-border)",
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>টোকেন তালিকা</span>
            </Link>

            {/* Primary — New Token */}
            <Link
              to="/dashboard/omr/tokens"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white transition-modern hover-lift focus-ring-modern"
              style={{
                background: "var(--q-header-gradient)",
                boxShadow: "var(--q-print-btn-shadow)",
              }}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>নতুন টোকেন</span>
            </Link>
          </div>
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
