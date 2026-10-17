import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Coins,
  DollarSign,
  HelpCircle,
  Menu,
  Percent,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";

export default function AffiliateLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      q: "স্মার্ট প্রশ্নব্যাংক অ্যাফিলিয়েট প্রোগ্রাম কী?",
      a: "এটি একটি প্রাতিষ্ঠানিক পার্টনারশিপ প্রোগ্রাম যেখানে আপনি আপনার নিজস্ব স্পেশাল কুপন কোড ব্যবহার করে শিক্ষক, কোচিং বা শিক্ষা প্রতিষ্ঠানকে স্মার্ট প্রশ্নব্যাংকে রেফার করবেন। আপনার কুপন ব্যবহার করে তারা সাবস্ক্রিপশন কিনলে আপনি পাবেন ২০% পর্যন্ত নগদ কমিশন এবং ক্রেতা পাবেন ১০% বিশেষ ছাড়।",
    },
    {
      q: "কমিশন কখন এবং কীভাবে পাওয়া যায়?",
      a: "গ্রাহক সফলভাবে সাবস্ক্রিপশন কেনার পর কমিশন আপনার অ্যাকাউন্টের পেন্ডিং ব্যালেন্সে যোগ হবে। গ্রাহকের ১৪ দিনের রিফান্ড সুরক্ষা সময়সীমা অতিক্রমের পর কমিশন স্বয়ংক্রিয়ভাবে 'Available' ব্যালেন্সে স্থানান্তরিত হবে।",
    },
    {
      q: "টাকা তোলার (উইথড্রয়াল) নিয়ম ও নূন্যতম শর্ত কী?",
      a: "টাকা উইথড্র করার জন্য আপনার অন্তত ৩টি সফল কোয়ালিফাইং সেল সম্পন্ন হতে হবে এবং এভেইলেবল ব্যালেন্স নূন্যতম ৫,০০০ টাকা (৳৫,০০০) হতে হবে। বিকাশ, নগদ, রকেট অথবা সরাসরি ব্যাংক একাউন্টে টাকা ট্রান্সফার করা যাবে।",
    },
    {
      q: "রিনিউয়াল বা পরবর্তী ক্রয়ে কি কমিশন পাওয়া যাবে?",
      a: "না, অ্যাফিলিয়েট কুপন ও কমিশন শুধুমাত্র নতুন গ্রাহকের প্রথম সফল ক্রয়ের জন্য প্রযোজ্য। রিনিউয়াল বা পূর্ববর্তী সাবস্ক্রাইবারদের ক্ষেত্রে এটি প্রযোজ্য নয়।",
    },
    {
      q: "আমি কি শিক্ষক অ্যাকাউন্ট থেকে স্বয়ংক্রিয়ভাবে অ্যাফিলিয়েট হতে পারি?",
      a: "না, নিরাপত্তা ও অ্যাকাউন্ট পৃথকীকরণের জন্য অ্যাফিলিয়েট পার্টনারদের আলাদাভাবে এই পোর্টাল থেকে সেলফ-রেজিস্ট্রেশন করতে হবে। অ্যাডমিন পর্যালোচনা করে অনুমোদন দিলে আপনি ইউনিক কুপন ও ড্যাশবোর্ড পাবেন।",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-slate-950/90 backdrop-blur-xl border-slate-800 shadow-xl shadow-black/20"
            : "bg-slate-950/70 backdrop-blur-md border-slate-800/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-2">
            {/* Left: Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2.5 min-w-0 group shrink-0"
            >
              <div className="size-8 sm:size-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="size-4 sm:size-4.5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold text-sm sm:text-base md:text-lg text-white tracking-tight truncate">
                  Smart Proshno
                </span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 font-bold border border-indigo-500/30 shrink-0">
                  Partner
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                কীভাবে কাজ করে
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                সুবিধাসমূহ
              </button>
              <button
                onClick={() => scrollToSection("faqs")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                জিজ্ঞাসা ও উত্তর
              </button>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-2.5">
              <Link
                to="/affiliate/login"
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
              >
                লগইন করুন
              </Link>
              <Link
                to="/affiliate/register"
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                পার্টনার হিসেবে যোগ দিন
              </Link>
            </div>

            {/* Mobile Actions: Compact Direct Button + Hamburger Menu */}
            <div className="flex items-center gap-1.5 md:hidden">
              <Link
                to="/affiliate/register"
                className="px-3 py-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 rounded-lg shadow-sm whitespace-nowrap"
              >
                যোগ দিন
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
                className="size-9 rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                {mobileMenuOpen ? (
                  <X className="size-4.5" />
                ) : (
                  <Menu className="size-4.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/90 bg-slate-950/98 backdrop-blur-2xl px-4 py-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Quick Navigation Links */}
            <div className="space-y-1 font-medium text-sm text-slate-300">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-white transition"
              >
                স্মার্ট প্রশ্নব্যাংক হোম
              </Link>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-white transition cursor-pointer"
              >
                কীভাবে কাজ করে
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-white transition cursor-pointer"
              >
                পার্টনার সুবিধাসমূহ
              </button>
              <button
                onClick={() => scrollToSection("faqs")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-white transition cursor-pointer"
              >
                সাধারণ জিজ্ঞাসা (FAQ)
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <Link
                to="/affiliate/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>পার্টনার হিসেবে আবেদন করুন</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/affiliate/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 block"
              >
                অ্যাফিলিয়েট লগইন করুন
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-28 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[250px] sm:h-[400px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-transparent blur-[100px] sm:blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[11px] sm:text-xs font-semibold mb-5 sm:mb-6">
            <Coins className="size-3.5 sm:size-4 text-indigo-400" />
            <span>স্মার্ট প্রশ্ন ব্যাংক পার্টনার প্রোগ্রাম ২০২৬</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-[1.15]">
            রেফার করুন, শেয়ার করুন এবং উপার্জন করুন{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              ২০% পর্যন্ত আকর্ষণীয় কমিশন
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            বাংলাদেশের সবচেয়ে উন্নত প্রশ্নব্যাংক ও ওএমআর সিস্টেমকে আপনার পরিচিত শিক্ষক ও প্রতিষ্ঠানের কাছে পৌঁছে দিন। তারা পাবে বিশেষ ছাড়, আপনি পাবেন প্রতিটি সফল বিক্রয় থেকে নিশ্চিত ইনকাম।
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Link
              to="/affiliate/register"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:opacity-95 rounded-xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>এখনই আবেদন করুন</span>
              <ArrowRight className="size-4 sm:size-5" />
            </Link>
            <Link
              to="/affiliate/login"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all text-center"
            >
              অ্যাফিলিয়েট লগইন
            </Link>
          </div>

          {/* Quick Metrics Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm">
              <div className="text-xl sm:text-3xl font-black text-indigo-400">২০%</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">সর্বোচ্চ কমিশন হার</div>
            </div>
            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm">
              <div className="text-xl sm:text-3xl font-black text-emerald-400">১০%</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">গ্রাহক ডিসকাউন্ট</div>
            </div>
            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm">
              <div className="text-xl sm:text-3xl font-black text-amber-400">১৪ দিন</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">হোল্ড ও সিকিউরিটি</div>
            </div>
            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm">
              <div className="text-xl sm:text-3xl font-black text-purple-400">৳৫,০০০</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">সহজ উইথড্রয়াল সীমা</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="py-14 sm:py-20 bg-slate-950/70 border-t border-slate-800/60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-400">
              সহজ ৩টি ধাপ
            </h2>
            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-bold text-white">কীভাবে প্রোগ্রামটি কাজ করে?</p>
          </div>

          <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {/* Step 1 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors relative group">
              <div className="size-10 sm:size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-base sm:text-lg mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                ১
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">বিনামূল্যে রেজিস্ট্রেশন করুন</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                আপনার নাম, মোবাইল নম্বর এবং মৌলিক তথ্য দিয়ে আবেদন করুন। মোবাইল ওটিপি দিয়ে ভেরিফাই সম্পন্ন করুন। অ্যাডমিন অনুমোদনের পর আপনি ইউনিক কুপন কোড পাবেন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 transition-colors relative group">
              <div className="size-10 sm:size-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-black text-base sm:text-lg mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                ২
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">কুপন কোড শেয়ার করুন</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                আপনার স্পেশাল কুপন কোড শিক্ষক, কোচিং বা ফেসবুক গ্রুপে শেয়ার করুন। আপনার কুপন ব্যবহার করে প্যাকেজ কিনলে গ্রাহক ১০% ছাড় পাবেন।
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors relative group">
              <div className="size-10 sm:size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-base sm:text-lg mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                ৩
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">কমিশন উত্তোলন করুন</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                প্রতিটি সফল সেল থেকে আপনার কমিশন জমা হবে। ৩টি সফল সেল ও ৫,০০০ টাকা ব্যালেন্স হলেই বিকাশ, নগদ, রকেট বা ব্যাংকে সরাসরি টাকা ট্রান্সফার করুন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section id="benefits" className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-400">
              সুবিধাসমূহ
            </h2>
            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-bold text-white">কেন আমাদের সাথে কাজ করবেন?</p>
          </div>

          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-3.5 sm:gap-4">
              <div className="size-9 sm:size-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <TrendingUp className="size-4.5 sm:size-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">আকর্ষণীয় ইনকাম</h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">প্রতিটি পেইড সাবস্ক্রিপশনে ২০% পর্যন্ত নগদ কমিশন পাওয়ার সুযোগ।</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-3.5 sm:gap-4">
              <div className="size-9 sm:size-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-4.5 sm:size-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">স্বচ্ছ অডিট ট্রেইল</h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">প্রতিটি সেল এবং উইথড্রয়ালের সম্পূর্ণ অপরিবর্তনীয় লেজার রেকর্ড।</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-3.5 sm:gap-4">
              <div className="size-9 sm:size-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                <Percent className="size-4.5 sm:size-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">গ্রাহকদের জন্য ছাড়</h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">আপনার কুপন দিয়ে গ্রাহকরা ১০% ছাড় পাবেন, যা বিক্রয় বাড়াতে সাহায্য করে।</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-3.5 sm:gap-4">
              <div className="size-9 sm:size-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Zap className="size-4.5 sm:size-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">দ্রুত পেআউট</h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">অনুমোদিত উইথড্রয়াল বিকাশ, নগদ বা ব্যাংকে দ্রুত সম্পন্ন করা হয়।</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-3.5 sm:gap-4">
              <div className="size-9 sm:size-10 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0">
                <Users className="size-4.5 sm:size-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">শিক্ষকদের আস্থা</h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">দেশজুড়ে হাজারো শিক্ষক ও শিক্ষা প্রতিষ্ঠানের বিশ্বস্ত প্রশ্ন প্ল্যাটফর্ম।</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-3.5 sm:gap-4">
              <div className="size-9 sm:size-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="size-4.5 sm:size-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">ডেডিকেটেড ড্যাশবোর্ড</h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">সেলস, কমিশন, কোয়ালিফাইং প্রগ্রেস ট্র্যাক করার আধুনিক ড্যাশবোর্ড।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section
        id="faqs"
        className="py-14 sm:py-20 bg-slate-950/70 border-t border-slate-800/60"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-400">
              জিজ্ঞাসা ও উত্তর
            </h2>
            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-bold text-white">সাধারণ কিছু প্রশ্নের উত্তর</p>
          </div>

          <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800/90 bg-slate-900/60 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between text-xs sm:text-sm md:text-base font-semibold text-white hover:text-indigo-400 transition-colors gap-3"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 sm:size-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-indigo-400" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-6 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-slate-900/80 border border-indigo-500/30 backdrop-blur-md relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-3 sm:space-y-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                আজই আমাদের সাথে পার্টনার হিসেবে যুক্ত হন
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
                মাত্র দুই মিনিটে আবেদন সম্পন্ন করুন। আপনার ইউনিক কুপন দিয়ে আয় শুরু করুন ঘরে বসেই।
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  to="/affiliate/register"
                  className="w-full sm:w-auto px-7 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  পার্টনারশিপের জন্য আবেদন
                </Link>
                <Link
                  to="/affiliate/login"
                  className="w-full sm:w-auto px-7 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-200 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-xl transition-all"
                >
                  লগইন করুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500 space-y-2">
          <p>© ২০২৬ Smart Proshno Bank. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center justify-center gap-4 text-[11px]">
            <Link to="/terms" className="hover:text-slate-300 transition">শর্তাবলী ও নীতিমালা</Link>
            <span>•</span>
            <Link to="/" className="hover:text-slate-300 transition">স্মার্ট প্রশ্নব্যাংক হোম</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
