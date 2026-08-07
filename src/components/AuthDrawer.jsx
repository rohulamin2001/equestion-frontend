import {
  ArrowLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Phone,
  RefreshCw,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserContext } from "../context/UserContext";
import apiClient from "../lib/apiClient";

export default function AuthDrawer() {
  const { isAuthDrawerOpen, closeAuthDrawer, drawerDefaultTab, login } =
    useUserContext();

  // Mode: 'auth' (login/register tabs) | 'forgotPassword'
  const [mode, setMode] = useState("auth");
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'

  // Common State
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login Flow States
  const [loginStep, setLoginStep] = useState(1); // 1: Phone, 2: Password
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Flow States
  const [regStep, setRegStep] = useState(1); // 1: Phone, 2: OTP, 3: Details & Password
  const [regPhone, setRegPhone] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regUserType, setRegUserType] = useState("Teacher"); // 'Teacher' | 'Institution'
  const [otpToken, setOtpToken] = useState(null);

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState(1); // 1: Phone, 2: OTP & New Password
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");

  // Timer State for OTP Resend
  const [timer, setTimer] = useState(0);

  // Track drawer state for resetting state during render transition
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if (isAuthDrawerOpen !== prevIsOpen) {
    setPrevIsOpen(isAuthDrawerOpen);
    if (isAuthDrawerOpen) {
      setActiveTab(drawerDefaultTab || "login");
      setMode("auth");
      setLoginStep(1);
      setLoginPhone("");
      setLoginPassword("");
      setRegStep(1);
      setRegPhone("");
      setRegOtp("");
      setRegFullName("");
      setRegPassword("");
      setRegConfirmPassword("");
      setRegUserType("Teacher");
      setOtpToken(null);
      setForgotStep(1);
      setForgotPhone("");
      setForgotOtp("");
      setForgotNewPassword("");
      setLoading(false);
      setShowPassword(false);
    }
  }

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!isAuthDrawerOpen) return null;

  // --- LOGIN HANDLERS ---
  const handleLoginNext = (e) => {
    e.preventDefault();
    if (!loginPhone.trim()) {
      toast.error("ফোন নম্বর প্রদান করুন।");
      return;
    }
    if (!/^(\+88)?01[3-9]\d{8}$/.test(loginPhone.trim())) {
      toast.error("সঠিক বাংলাদেশি ফোন নম্বর দিন (যেমন: 017XXXXXXXX)।");
      return;
    }
    setLoginStep(2);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginPassword) {
      toast.error("পাসওয়ার্ড প্রদান করুন।");
      return;
    }

    setLoading(true);
    try {
      const res = await login(loginPhone.trim(), loginPassword);
      if (res?.code === "PHONE_NOT_VERIFIED") {
        toast.info(res.message);
        setRegPhone(loginPhone.trim());
        setActiveTab("register");
        setRegStep(2);
        setTimer(60);
      } else {
        toast.success("সফলভাবে লগইন হয়েছে!");
        closeAuthDrawer();
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTER HANDLERS ---
  const handleRegSendOtp = async (e) => {
    e.preventDefault();
    if (!regPhone.trim()) {
      toast.error("ফোন নম্বর প্রদান করুন।");
      return;
    }
    if (!/^(\+88)?01[3-9]\d{8}$/.test(regPhone.trim())) {
      toast.error("সঠিক বাংলাদেশি ফোন নম্বর দিন (যেমন: 017XXXXXXXX)।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/register-otp", {
        phoneNumber: regPhone.trim(),
      });
      toast.success(res.data.message || "OTP পাঠানো হয়েছে!");
      setRegStep(2);
      setTimer(60);
    } catch (err) {
      console.error("Reg OTP error:", err);
      toast.error(err.response?.data?.message || "OTP পাঠাতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleRegResendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/resend-otp", {
        phoneNumber: regPhone.trim(),
      });
      toast.success(res.data.message || "নতুন OTP পাঠানো হয়েছে!");
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP রিকোয়েস্ট ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleRegVerifyOtp = async (e) => {
    e.preventDefault();
    if (!regOtp || regOtp.trim().length !== 6) {
      toast.error("৬ ডিজিটের OTP কোডটি দিন।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/verify-otp", {
        phoneNumber: regPhone.trim(),
        otp: regOtp.trim(),
      });
      if (res.data.otpToken) {
        setOtpToken(res.data.otpToken);
      }
      toast.success(res.data.message || "OTP ভেরিফাইড!");
      setRegStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "ভুল OTP প্রদান করা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleRegComplete = async (e) => {
    e.preventDefault();
    if (!regFullName.trim() || regFullName.trim().length < 2) {
      toast.error("আপনার পুরো নাম লিখুন (কমপক্ষে ২ অক্ষর)।");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      toast.error("পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/complete-registration", {
        otpToken,
        phoneNumber: regPhone.trim(),
        fullName: regFullName.trim(),
        password: regPassword,
        userType: regUserType,
      });

      if (res.data.accessToken) {
        toast.success("রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!");
        closeAuthDrawer();
        window.location.reload(); // Trigger refresh to load profile and onboarding
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "রেজিস্ট্রেশন সম্পন্ন করতে সমস্যা হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- FORGOT PASSWORD HANDLERS ---
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotPhone.trim()) {
      toast.error("ফোন নম্বর প্রদান করুন।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/forgot-password", {
        phoneNumber: forgotPhone.trim(),
      });
      toast.success(res.data.message || "OTP পাঠানো হয়েছে!");
      setForgotStep(2);
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP পাঠাতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      toast.error("৬ ডিজিটের OTP প্রদান করুন।");
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      toast.error("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/reset-password", {
        phoneNumber: forgotPhone.trim(),
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword,
      });
      toast.success(
        res.data.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!",
      );
      setMode("auth");
      setActiveTab("login");
      setLoginPhone(forgotPhone.trim());
      setLoginStep(2);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in-0">
      <div
        className="w-full max-w-md bg-glass-elevated backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-t-3xl sm:rounded-3xl p-6 relative overflow-hidden animate-in slide-in-from-bottom-8 duration-300 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <button
          onClick={closeAuthDrawer}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all duration-200 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6 pt-2">
          <h2 className="text-2xl font-black text-slate-800 font-bengali tracking-tight">
            {mode === "forgotPassword"
              ? "পাসওয়ার্ড রিসেট করুন"
              : activeTab === "login"
                ? "একাউন্টে লগইন করুন"
                : "নতুন একাউন্ট খুলুন"}
          </h2>
        </div>

        {/* Mode Switcher Tabs (Only in Auth mode and step 1) */}
        {mode === "auth" && (
          <div className="bg-slate-100/90 p-1.5 rounded-2xl flex mb-6 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setLoginStep(1);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 font-bengali ${
                activeTab === "login"
                  ? "bg-white text-slate-900 shadow-md transform scale-[1.02]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              লগইন
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setRegStep(1);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 font-bengali ${
                activeTab === "register"
                  ? "bg-white text-slate-900 shadow-md transform scale-[1.02]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              নতুন একাউন্ট
            </button>
          </div>
        )}

        {/* --- LOGIN TAB CONTENT --- */}
        {mode === "auth" && activeTab === "login" && (
          <div>
            {loginStep === 1 ? (
              <form onSubmit={handleLoginNext} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 font-bengali">
                    ফোন নম্বর
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="ফোন নম্বর"
                      className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 font-bengali text-base cursor-pointer"
                >
                  <span>এগিয়ে যাই</span>
                  <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleLoginSubmit}
                className="space-y-4 animate-in fade-in-0 duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 font-sans">
                    {loginPhone}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLoginStep(1)}
                    className="text-xs font-bold text-amber-600 hover:underline font-bengali"
                  >
                    নম্বর পরিবর্তন করুন
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 font-bengali">
                    পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড দিন"
                      className="w-full h-12 pl-10 pr-10 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 font-bengali text-base cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-slate-950" />
                      <span>লগইন হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>লগইন করুন</span>
                      <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom Links */}
            <div className="mt-6 text-center text-xs font-semibold text-slate-500 font-bengali flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setRegStep(1);
                }}
                className="hover:text-slate-800 transition"
              >
                নতুন একাউন্ট
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setMode("forgotPassword");
                  setForgotStep(1);
                }}
                className="hover:text-amber-600 transition"
              >
                পাসওয়ার্ড ভুলে গেছেন
              </button>
            </div>
          </div>
        )}

        {/* --- REGISTER TAB CONTENT --- */}
        {mode === "auth" && activeTab === "register" && (
          <div>
            {regStep === 1 && (
              <form onSubmit={handleRegSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 font-bengali">
                    ফোন নম্বর
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="ফোন নম্বর"
                      className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 font-bengali text-base cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>OTP পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>এগিয়ে যাই</span>
                      <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {regStep === 2 && (
              <form
                onSubmit={handleRegVerifyOtp}
                className="space-y-4 animate-in fade-in-0 duration-200"
              >
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-slate-600 font-bengali">
                    <span className="font-sans text-slate-900">{regPhone}</span>{" "}
                    নম্বরে একটি ৬-ডিজিটের OTP পাঠানো হয়েছে।
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 font-bengali">
                    ৬-ডিজিট OTP কোড
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={regOtp}
                    onChange={(e) => setRegOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full h-12 text-center tracking-[0.5em] text-lg font-bold bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 font-bengali">
                  <span>
                    {timer > 0 ? `পুনরায় OTP পাঠান (${timer}s)` : "কোড পাননি?"}
                  </span>
                  {timer === 0 && (
                    <button
                      type="button"
                      onClick={handleRegResendOtp}
                      className="text-amber-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 font-bengali text-base cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>যাচাই করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>যাচাই করুন</span>
                      <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {regStep === 3 && (
              <form
                onSubmit={handleRegComplete}
                className="space-y-3.5 animate-in fade-in-0 duration-200"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-bengali">
                    আপনার পুরো নাম
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="যেমন: মোঃ রাফসান আহমেদ"
                      className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bengali shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-bengali">
                    নতুন পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      className="w-full h-11 pl-10 pr-10 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-bengali">
                    কনফার্ম পাসওয়ার্ড
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড পুনরায় দিন"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 font-bengali text-base cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>সম্পন্ন হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>নিবন্ধন সম্পন্ন করুন</span>
                      <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-xs font-semibold text-slate-500 font-bengali">
              <span>ইতিমধ্যে একাউন্ট আছে? </span>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setLoginStep(1);
                }}
                className="text-amber-600 font-bold hover:underline"
              >
                লগইন করুন
              </button>
            </div>
          </div>
        )}

        {/* --- FORGOT PASSWORD MODE --- */}
        {mode === "forgotPassword" && (
          <div className="space-y-4 animate-in fade-in-0 duration-200">
            <button
              type="button"
              onClick={() => setMode("auth")}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bengali mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>লগইনে ফিরে যান</span>
            </button>

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 font-bengali">
                    আপনার নিবন্ধিত ফোন নম্বর
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      placeholder="ফোন নম্বর"
                      className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 font-bengali text-base cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>OTP পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>OTP পাঠান</span>
                      <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleResetPasswordSubmit}
                className="space-y-3.5"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-bengali">
                    ৬-ডিজিট OTP কোড
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full h-11 text-center tracking-[0.5em] text-lg font-bold bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 font-bengali">
                    নতুন পাসওয়ার্ড
                  </label>
                  <input
                    type="password"
                    required
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 font-bengali text-base cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>পরিবর্তন করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                      <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer Support Banner */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] font-semibold text-slate-400 font-bengali">
            OTP পেতে সমস্যা হলে কল করুন{" "}
            <span className="font-sans text-slate-600 font-bold">
              +8801822482522
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
