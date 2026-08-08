import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// ── Shared dark-glass design tokens ──
const inputClass =
  "w-full rounded-xl text-sm text-white font-sans transition-all duration-200 outline-none border"
  + " bg-white/5 border-white/15 focus:border-purple-400/80 focus:ring-2 focus:ring-purple-400/20 placeholder:text-purple-300/40";

const labelClass =
  "text-xs font-semibold uppercase tracking-wider font-bengali block mb-1.5 text-purple-200";

const ctaClass = (disabled) =>
  `w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 font-bengali text-white border border-white/20 ${
    disabled
      ? "opacity-50 cursor-not-allowed"
      : "hover:opacity-90 active:scale-[0.99] cursor-pointer"
  }`;

const ctaStyle = {
  background: "linear-gradient(135deg, #7e22ce 0%, #be185d 100%)",
  boxShadow: "0 6px 24px rgba(126,34,206,0.35)",
};

const iconStyle = { color: "rgba(192,132,252,0.7)" };

export function AuthForgotPasswordMode({
  forgotStep,
  forgotPhone,
  setForgotPhone,
  forgotOtp,
  setForgotOtp,
  forgotNewPassword,
  setForgotNewPassword,
  loading,
  handleForgotSendOtp,
  handleResetPasswordSubmit,
  setMode,
}) {
  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setMode("auth")}
        className="flex items-center gap-1.5 text-xs font-bold font-bengali cursor-pointer transition-colors group"
        style={{ color: "#c084fc" }}
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>লগইনে ফিরে যান</span>
      </button>

      {/* Context header */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="p-2 rounded-xl shrink-0"
          style={{
            background: "rgba(192,132,252,0.12)",
            border: "1px solid rgba(192,132,252,0.2)",
          }}
        >
          <KeyRound className="h-5 w-5" style={{ color: "#c084fc" }} />
        </div>
        <div>
          <p className="text-xs font-bold text-white font-bengali">
            {forgotStep === 1 ? "আপনার নিবন্ধিত নম্বরে OTP যাবে" : "OTP ও নতুন পাসওয়ার্ড দিন"}
          </p>
          <p className="text-[11px] font-bengali" style={{ color: "rgba(216,180,254,0.5)" }}>
            {forgotStep === 1 ? "নম্বর যাচাই করে এগিয়ে যান" : "নিরাপদ পাসওয়ার্ড রাখুন"}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 1: Phone ── */}
        {forgotStep === 1 ? (
          <motion.form
            key="forgotStep1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleForgotSendOtp}
            className="space-y-5"
          >
            <div>
              <label className={labelClass}>নিবন্ধিত ফোন নম্বর</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Smartphone className="h-[18px] w-[18px]" style={iconStyle} />
                </div>
                <input
                  type="text"
                  required
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={inputClass + " h-12 pl-11 pr-4"}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={ctaClass(loading)} style={ctaStyle}>
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /><span>OTP পাঠানো হচ্ছে...</span></>
              ) : (
                <><span>OTP পাঠান</span><ArrowRight className="h-[18px] w-[18px]" /></>
              )}
            </button>
          </motion.form>
        ) : (
          /* ── Step 2: OTP + New Password ── */
          <motion.form
            key="forgotStep2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleResetPasswordSubmit}
            className="space-y-4"
          >
            <div>
              <label className={labelClass}>৬-ডিজিট OTP কোড</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <ShieldCheck className="h-[18px] w-[18px]" style={iconStyle} />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  placeholder="• • • • • •"
                  className={inputClass + " h-12 pl-11 pr-4 text-center text-lg font-bold"}
                  style={{ letterSpacing: "0.5em" }}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>নতুন পাসওয়ার্ড</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px]" style={iconStyle} />
                </div>
                <input
                  type="password"
                  required
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className={inputClass + " h-11 pl-11 pr-4"}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={ctaClass(loading) + " mt-1"} style={ctaStyle}>
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /><span>পরিবর্তন করা হচ্ছে...</span></>
              ) : (
                <><span>পাসওয়ার্ড পরিবর্তন করুন</span><ArrowRight className="h-[18px] w-[18px]" /></>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
