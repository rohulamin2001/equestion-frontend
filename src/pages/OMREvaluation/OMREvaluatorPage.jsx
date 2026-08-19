import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  ImageUp,
  PlusCircle,
  ScanLine,
  Sparkles,
  Zap,
} from "lucide-react";
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

  const features = [
    { icon: ImageUp, label: "ছবি আপলোড করুন" },
    { icon: Brain, label: "AI ভিশন বিশ্লেষণ" },
    { icon: CheckCircle2, label: "স্বয়ংক্রিয় মার্কশিট" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Hero Banner — Full Gradient with Decorative Elements ── */}
      <div
        className="relative overflow-hidden rounded-2xl text-white"
        style={{
          background: "var(--q-header-gradient)",
          boxShadow: "var(--q-section-shadow)",
        }}
      >
        {/* Decorative glow blobs */}
        <div
          className="pointer-events-none absolute -top-12 -right-12 w-52 h-52 rounded-full opacity-20"
          style={{ background: "var(--q-glow-blob-1)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 w-36 h-36 rounded-full opacity-15"
          style={{ background: "var(--q-glow-blob-2)" }}
        />
        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 32px)",
          }}
        />

        {/* Main content */}
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 px-6 pt-6 pb-5">
          {/* Left */}
          <div className="flex items-start gap-4">
            {/* Animated icon container */}
            <div className="shrink-0 w-13 h-13 rounded-2xl flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/25 shadow-lg">
              <ScanLine className="w-6 h-6 text-white" strokeWidth={2} />
            </div>

            <div className="space-y-1">
              {/* Step pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/15 rounded-full border border-white/20 backdrop-blur-md text-[11px] font-semibold">
                <Zap className="w-3 h-3" />
                Step 3: Evaluate OMR
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                ওএমআর (OMR) শিট মূল্যায়ন ও ফলাফল
              </h1>
              <p className="text-sm text-white/75 leading-relaxed max-w-xl">
                টোকেন নির্বাচন করে ওএমআর শিটের ছবি আপলোড করুন। এআই ভিশন
                ইঞ্জিন স্বয়ংক্রিয়ভাবে খাতা মূল্যায়ন ও মার্কশিট তৈরি করবে।
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/dashboard/omr/tokens"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-modern hover-lift focus-ring-modern bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-sm text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>টোকেন তালিকা</span>
            </Link>

            <Link
              to="/dashboard/omr/tokens"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl transition-modern hover-lift focus-ring-modern bg-white/95 hover:bg-white"
              style={{ color: "var(--purple-700)" }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন টোকেন</span>
            </Link>
          </div>
        </div>

        {/* ── Feature chips strip ── */}
        <div
          className="relative flex items-center gap-2 px-6 py-3 flex-wrap"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
        >
          <span className="text-[11px] text-white/50 font-medium mr-1">কীভাবে কাজ করে:</span>
          {features.map(({ icon: Icon, label }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/18 rounded-full text-[11px] font-medium border border-white/15 transition-modern">
                <Icon className="w-3 h-3" />
                {label}
              </div>
              {i < features.length - 1 && (
                <Sparkles className="w-2.5 h-2.5 text-white/30" />
              )}
            </div>
          ))}
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
