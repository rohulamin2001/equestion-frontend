import {
  ArrowRight,
  BookOpen,
  FileCheck,
  Layers,
  Shield,
  Sparkles,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

export default function Home() {
  const { userProfile, openAuthDrawer } = useUserContext();

  if (userProfile) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glow Blobs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(144,14,176,0.18) 0%, rgba(219,39,119,0.08) 60%, transparent 80%)",
        }}
      />

      {/* Navbar */}
      <header className="border-b border-purple-100/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-[var(--purple-700)] to-[var(--purple-600)] text-white rounded-xl shadow-md shadow-purple-600/20">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-[var(--purple-800)] via-[var(--purple-700)] to-[var(--purple-600)] bg-clip-text text-transparent font-sans tracking-tight">
              স্মার্ট প্রশ্নব্যাংক
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => openAuthDrawer("login")}
              className="inline-flex items-center justify-center rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/80 font-bold px-3.5 sm:px-5 py-2 text-xs sm:text-sm text-[var(--purple-800)] transition-all shadow-sm font-bengali cursor-pointer"
            >
              লগইন
            </button>
            <button
              onClick={() => openAuthDrawer("register")}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] hover:opacity-95 font-bold px-3.5 sm:px-5 py-2 text-xs sm:text-sm text-white transition-all shadow-md shadow-purple-600/20 font-bengali cursor-pointer"
            >
              নতুন একাউন্ট
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center py-12 sm:py-20 px-4 relative z-10">
        <div className="max-w-4xl text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-100/70 border border-purple-200/60 text-[var(--purple-800)] px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold font-bengali shadow-sm">
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--purple-600)]" />
            <span>স্মার্ট প্রশ্নব্যাংক — ক্লাস ৩ থেকে ১২ এর অটো জেনারেটর</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight font-sans">
            কয়েক ক্লিকেই তৈরি করুন <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[var(--purple-800)] via-[var(--purple-700)] to-[var(--purple-600)] bg-clip-text text-transparent">
              মানসম্মত পরীক্ষার প্রশ্নপত্র
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-bengali">
            শিক্ষকদের মূল্যবান সময় বাঁচাতে আমাদের স্বয়ংক্রিয় প্রশ্ন জেনারেটর
            ইঞ্জিন। সহজে সিলেবাস, অধ্যায় এবং কাঠামোগত প্রশ্ন নির্বাচন করে
            আকর্ষণীয় ও সৃজনশীল প্রশ্নপত্র তৈরি করুন।
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center items-center pt-2">
            <button
              onClick={() => openAuthDrawer("register")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] hover:opacity-95 font-black px-8 py-3.5 sm:py-4 text-sm sm:text-base text-white transition-all shadow-lg shadow-purple-600/25 active:scale-[0.98] font-bengali cursor-pointer border border-purple-300/30"
            >
              <span>শুরু করুন</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => openAuthDrawer("login")}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white border border-purple-200/80 px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-[var(--purple-800)] hover:bg-purple-50/60 transition-all font-bengali cursor-pointer shadow-sm"
            >
              লগইন করুন
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-10 sm:pt-14 text-left">
            <div className="bg-glass-elevated backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-purple-100/80 shadow-soft hover:shadow-md transition-all duration-300 group">
              <div className="p-3 bg-purple-100/60 text-[var(--purple-700)] rounded-xl w-fit mb-4 group-hover:scale-105 transition-transform border border-purple-200/50">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 font-bengali">
                ১ ক্লিকে প্রশ্ন তৈরি
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-bengali leading-relaxed">
                শ্রেণি ও বিষয় নির্বাচন করে অতি দ্রুত সম্পূর্ণ প্রশ্নপত্র
                স্বয়ংক্রিয়ভাবে ডাউনলোড করুন।
              </p>
            </div>

            <div className="bg-glass-elevated backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-purple-100/80 shadow-soft hover:shadow-md transition-all duration-300 group">
              <div className="p-3 bg-purple-100/60 text-[var(--purple-700)] rounded-xl w-fit mb-4 group-hover:scale-105 transition-transform border border-purple-200/50">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 font-bengali">
                সৃজনশীল ও MCQ ব্যাংক
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-bengali leading-relaxed">
                ক্লাস ৩ থেকে ১২ পর্যন্ত বিশাল প্রশ্নভাণ্ডার থেকে আপনার পছন্দমতো
                প্রশ্ন নির্বাচন করুন।
              </p>
            </div>

            <div className="bg-glass-elevated backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-purple-100/80 shadow-soft hover:shadow-md transition-all duration-300 group sm:col-span-2 md:col-span-1">
              <div className="p-3 bg-purple-100/60 text-[var(--purple-700)] rounded-xl w-fit mb-4 group-hover:scale-105 transition-transform border border-purple-200/50">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 font-bengali">
                OMR এবং অনলাইন এক্সাম
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-bengali leading-relaxed">
                পরীক্ষা শেষে OMR শিট মূল্যায়ন এবং শিক্ষার্থীদের অনলাইন পরীক্ষা
                নেওয়ার সুব্যবস্থা।
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-100/60 bg-white/80 backdrop-blur-xl py-5 sm:py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs sm:text-sm font-medium text-slate-500 font-bengali">
          © {new Date().getFullYear()}{" "}
          <span className="font-bold text-[var(--purple-700)]">
            স্মার্ট প্রশ্নব্যাংক
          </span>{" "}
          — সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>
    </div>
  );
}
