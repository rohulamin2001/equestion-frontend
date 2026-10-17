import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

export default function AffiliateRegister() {
  const navigate = useNavigate();

  // Form State (7 Personal Info Fields)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    profession: "",
    address: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 mins = 300s
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");

  // Countdown Timer
  useEffect(() => {
    let timer;
    if (showOtpModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, countdown]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("অনুগ্রহ করে আপনার মোবাইল নম্বর লিখুন।");
      return;
    }

    const cleanPhone = formData.phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 11) {
      toast.error("সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("পাসওয়ার্ড নূন্যতম ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("পাসওয়ার্ড ও পাসওয়ার্ড নিশ্চিতকরণ মিলছে না।");
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error("প্রোগ্রামের শর্তাবলী ও নীতিমালা মেনে নেওয়ার বক্সে টিক দিন।");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/affiliate/register", {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        profession: formData.profession,
        address: formData.address,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data?.success) {
        setVerifiedPhone(response.data.phoneNumber || formData.phoneNumber);
        setShowOtpModal(true);
        setCountdown(300);
        setCanResend(false);
        toast.success(response.data.message || "মোবাইলে ওটিপি পাঠানো হয়েছে।");
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error(
        err.response?.data?.error ||
          "রেজিস্ট্রেশন শুরু করতে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error("অনুগ্রহ করে ৬ ডিজিটের ওটিপি সঠিকভাবে লিখুন।");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await apiClient.post("/affiliate/verify-otp", {
        phoneNumber: verifiedPhone || formData.phoneNumber,
        otp: otpCode.trim(),
      });

      if (response.data?.success) {
        toast.success("আপনার আবেদন সফলভাবে সম্পন্ন হয়েছে!");
        setShowOtpModal(false);
        navigate("/affiliate/login", {
          state: {
            registrationSuccess: true,
            phoneNumber: verifiedPhone || formData.phoneNumber,
          },
        });
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      toast.error(
        err.response?.data?.error || "ভুল ওটিপি অথবা মেয়াদ শেষ হয়ে গেছে।"
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      const response = await apiClient.post("/affiliate/resend-otp", {
        phoneNumber: verifiedPhone || formData.phoneNumber,
      });

      if (response.data?.success) {
        toast.success("নতুন ওটিপি কোড পাঠানো হয়েছে।");
        setCountdown(300);
        setCanResend(false);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || "ওটিপি পুনরায় পাঠাতে সমস্যা হয়েছে।"
      );
    } finally {
      setIsResending(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link
          to="/affiliate"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>অ্যাফিলিয়েট হোমপেজে ফিরুন</span>
        </Link>

        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            Smart Proshno
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          অ্যাফিলিয়েট পার্টনার রেজিস্ট্রেশন
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          নতুন গ্রাহক রেফার করে আকর্ষণীয় কমিশন অর্জন শুরু করুন
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0">
        <div className="bg-slate-950/80 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                পূর্ণ নাম (Full Name) <span className="text-pink-400">*</span>
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="যেমন: মোঃ রাকিবুল হাসান"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors"
                />
              </div>
            </div>

            {/* 2. Mobile Number & Email (2 Cols on md) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  মোবাইল নম্বর <span className="text-pink-400">*</span>
                </label>
                <div className="mt-1.5 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="017XXXXXXXX"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ওটিপি ভেরিফিকেশনের জন্য ব্যবহৃত হবে
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  ইমেইল ঠিকানা <span className="text-pink-400">*</span>
                </label>
                <div className="mt-1.5 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@mail.com"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  নোটিফিকেশন পাঠানো হবে
                </span>
              </div>
            </div>

            {/* 4. Profession & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  পেশা / কর্মসংস্থান
                </label>
                <div className="mt-1.5 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="যেমন: কন্টেন্ট ক্রিয়েটর / শিক্ষক"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  বর্তমান ঠিকানা / শহর
                </label>
                <div className="mt-1.5 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="যেমন: মিরপুর, ঢাকা"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 6. Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  পাসওয়ার্ড <span className="text-pink-400">*</span>
                </label>
                <div className="mt-1.5 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="নূন্যতম ৬ অক্ষর"
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  পাসওয়ার্ড নিশ্চিতকরণ <span className="text-pink-400">*</span>
                </label>
                <div className="mt-1.5 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="একই পাসওয়ার্ড লিখুন"
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="agreedToTerms"
                name="agreedToTerms"
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="h-4 w-4 mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="agreedToTerms" className="text-xs text-slate-400 leading-relaxed">
                আমি স্মার্ট প্রশ্ন ব্যাংক অ্যাফিলিয়েট প্রোগ্রামের{" "}
                <Link to="/terms" className="text-indigo-400 hover:underline">
                  শর্তাবলী ও নীতিমালা
                </Link>{" "}
                পড়েছি এবং এতে সম্মতি জানাচ্ছি।
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>তথ্য যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>আবেদন জমা দিন এবং ওটিপি পাঠান</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            ইতিমধ্যে অ্যাফিলিয়েট অ্যাকাউন্ট আছে?{" "}
            <Link
              to="/affiliate/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              লগইন করুন
            </Link>
          </div>
        </div>
      </div>

      {/* SMS OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">মোবাইল নম্বর যাচাইকরণ</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                <span className="font-semibold text-slate-200">{verifiedPhone}</span> নম্বরে একটি ৬ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে।
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  মেয়াদ বাকি: <span className="text-indigo-400 font-semibold">{formatTimer(countdown)}</span>
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || isResending}
                  className="text-indigo-400 hover:text-indigo-300 disabled:opacity-40 disabled:hover:text-slate-400 flex items-center gap-1 font-medium"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                  <span>পুনরায় পাঠান</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp || otpCode.length !== 6}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm shadow-md shadow-indigo-600/20"
              >
                {isVerifyingOtp ? "যাচাই করা হচ্ছে..." : "কোড নিশ্চিত করুন"}
              </button>

              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-full text-xs text-slate-500 hover:text-slate-300 py-1"
              >
                বাতিল করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
