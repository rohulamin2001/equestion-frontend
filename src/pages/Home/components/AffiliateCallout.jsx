import { ArrowRight, Coins, ShieldCheck, Sparkles, TrendingUp, Users, Wallet } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function AffiliateCallout() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 px-4 sm:px-6 bg-slate-950 font-bengali text-white">
      {/* Background Ambience Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-pink-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="rounded-3xl bg-gradient-to-br from-purple-950/70 via-slate-900/90 to-indigo-950/70 border border-purple-500/25 p-7 sm:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Top-Right Accent */}
          <div className="absolute -top-16 -right-16 size-48 rounded-full bg-purple-500/15 blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10">
            {/* Left Content */}
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold">
                <Coins className="size-3.5 text-purple-300" />
                <span>স্মার্ট প্রশ্নব্যাংক পার্টনার ও অ্যাফিলিয়েট প্রোগ্রাম</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                রেফার করে ঘরে বসেই উপার্জন করুন{" "}
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                  ২০% পর্যন্ত নিশ্চিত কমিশন!
                </span>
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
                আপনি কি শিক্ষক, কন্টেন্ট ক্রিয়েটর, কোচিং পরিচালক বা এডুকেশন উদ্যোক্তা? আপনার পরিচিত শিক্ষকদের কাছে স্মার্ট প্রশ্নব্যাংক পৌঁছে দিন। তারা পাবে ১০% বিশেষ ছাড়, আর আপনি পাবেন প্রতিটি সফল পেইড অর্ডারে নিশ্চিত কমিশন।
              </p>

              {/* Feature Pills */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/70">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  বিনামূল্যে রেজিস্ট্রেশন
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/70">
                  <TrendingUp className="size-3.5 text-purple-400" />
                  ২০% পর্যন্ত কমিশন
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/70">
                  <Wallet className="size-3.5 text-amber-400" />
                  বিকাশ / নগদ / ব্যাংকে উইথড্র
                </span>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="w-full lg:w-auto shrink-0 flex flex-col items-center gap-3">
              <Link
                to="/affiliate/register"
                className="w-full sm:w-auto min-w-[240px] px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-xl shadow-purple-900/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>পার্টনার হিসেবে জয়েন করুন</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                to="/affiliate"
                className="w-full sm:w-auto min-w-[240px] px-6 py-3 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="size-3.5 text-purple-300" />
                <span>প্রোগ্রাম বিস্তারিত জানুন</span>
              </Link>

              <div className="pt-1 text-center">
                <Link
                  to="/affiliate/login"
                  className="text-xs text-purple-300 hover:text-white underline underline-offset-4 transition"
                >
                  ইতিমধ্যে রেজিস্টার্ড? অ্যাফিলিয়েট লগইন করুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
