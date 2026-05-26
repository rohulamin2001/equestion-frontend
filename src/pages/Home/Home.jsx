import { Show, useAuth } from "@clerk/react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle, Shield } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              ইপ্রশ্নব্যাংক
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              লগইন
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/95 transition shadow-sm"
            >
              নিবন্ধন করুন
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            <Shield className="h-4 w-4" /> এপ্রোশ্নব্যাংক - ক্লাস ৩ থেকে ১২ এর প্রশ্ন জেনারেটর
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            কয়েক ক্লিকেই তৈরি করুন <br />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              মানসম্মত পরীক্ষার প্রশ্নপত্র
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            শিক্ষকদের মূল্যবান সময় বাঁচাতে আমাদের স্বয়ংক্রিয় প্রশ্ন জেনারেটর ইঞ্জিন।
            সহজে সিলেবাস, অধ্যায় এবং কাঠামোগত প্রশ্ন নির্বাচন করে আকর্ষণীয় ও সৃজনশীল প্রশ্নপত্র তৈরি করুন।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white hover:bg-primary/95 transition shadow-lg shadow-blue-500/20"
            >
              শুরু করুন <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              ডেমো দেখুন
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-12 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <CheckCircle className="h-8 w-8 text-emerald-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">১ ক্লিকে প্রশ্ন তৈরি</h3>
              <p className="text-sm text-slate-500">
                শ্রেণি ও বিষয় নির্বাচন করে অতি দ্রুত সম্পূর্ণ প্রশ্নপত্র স্বয়ংক্রিয়ভাবে ডাউনলোড করুন।
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <CheckCircle className="h-8 w-8 text-emerald-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">সৃজনশীল ও MCQ ব্যাংক</h3>
              <p className="text-sm text-slate-500">
                ক্লাস ৩ থেকে ১২ পর্যন্ত বিশাল প্রশ্নভাণ্ডার থেকে আপনার পছন্দমতো প্রশ্ন নির্বাচন করুন।
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <CheckCircle className="h-8 w-8 text-emerald-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">OMR এবং অনলাইন এক্সাম</h3>
              <p className="text-sm text-slate-500">
                পরীক্ষা শেষে OMR শিট মূল্যায়ন এবং শিক্ষার্থীদের অনলাইন পরীক্ষা নেওয়ার সুবিধা।
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ইপ্রশ্নব্যাংক। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>
    </div>
  );
}
