import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  RefreshCw,
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

// Step progress bar
function StepBadge({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full transition-all duration-400"
          style={{
            background:
              i < step
                ? "linear-gradient(90deg, #7e22ce, #c026d3)"
                : "rgba(255,255,255,0.1)",
          }}
        />
      ))}
      <span className="text-[10px] font-bold font-sans shrink-0" style={{ color: "#c084fc" }}>
        {step}/{total}
      </span>
    </div>
  );
}

export function AuthForgotPasswordMode({
  forgotStep,
  forgotPhone,
  setForgotPhone,
  forgotOtp,
  setForgotOtp,
  forgotNewPassword,
  setForgotNewPassword,
  forgotConfirmPassword,
  setForgotConfirmPassword,
  showPassword,
  setShowPassword,
  forgotTimer,
  loading,
  handleForgotSendOtp,
  handleForgotResendOtp,
  handleForgotVerifyOtp,
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
            {forgotStep === 1
              ? "আপনার নিবন্ধিত নম্বরে OTP যাবে"
              : forgotStep === 2
                ? "৬-ডিজিট OTP কোড দিয়ে যাচাই করুন"
                : "নতুন ও কনফার্ম পাসওয়ার্ড সেট করুন"}
          </p>
          <p className="text-[11px] font-bengali" style={{ color: "rgba(216,180,254,0.5)" }}>
            {forgotStep === 1
              ? "নম্বর দিয়ে এগিয়ে যান"
              : forgotStep === 2
                ? "কোডটি আপনার মোবাইলে পাঠানো হয়েছে"
                : "নিরাপদ পাসওয়ার্ড নির্বাচন করুন"}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 1: Phone Number ── */}
        {forgotStep === 1 && (
          <motion.form
            key="forgotStep1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleForgotSendOtp}
            className="space-y-5"
          >
            <StepBadge step={1} total={3} />

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
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>OTP পাঠানো হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>OTP পাঠান</span>
                  <ArrowRight className="h-[18px] w-[18px]" />
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* ── Step 2: OTP Verification ── */}
        {forgotStep === 2 && (
          <motion.form
            key="forgotStep2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleForgotVerifyOtp}
            className="space-y-5"
          >
            <StepBadge step={2} total={3} />

            {/* Phone info chip */}
            <div
              className="flex items-start gap-2.5 p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#c084fc" }} />
              <p className="text-xs font-bengali leading-relaxed" style={{ color: "rgba(216,180,254,0.8)" }}>
                <span className="font-bold font-sans text-white">{forgotPhone}</span>{" "}
                নম্বরে একটি ৬-ডিজিটের OTP পাঠানো হয়েছে।
              </p>
            </div>

            <div>
              <label className={labelClass}>৬-ডিজিট OTP কোড</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                placeholder="• • • • • •"
                className={inputClass + " h-14 text-center text-xl font-bold tracking-[0.55em] px-4"}
              />
            </div>

            <div
              className="flex items-center justify-between text-xs font-semibold font-bengali"
              style={{ color: "rgba(216,180,254,0.6)" }}
            >
              <span>{forgotTimer > 0 ? `পুনরায় পাঠান (${forgotTimer}s)` : "কোড পাননি?"}</span>
              {forgotTimer === 0 && (
                <button
                  type="button"
                  onClick={handleForgotResendOtp}
                  className="flex items-center gap-1 font-bold cursor-pointer transition-colors hover:text-white"
                  style={{ color: "#c084fc" }}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>পুনরায় পাঠান</span>
                </button>
              )}
            </div>

            <button type="submit" disabled={loading} className={ctaClass(loading)} style={ctaStyle}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>OTP যাচাই করুন</span>
                  <ArrowRight className="h-[18px] w-[18px]" />
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* ── Step 3: New Password & Confirm Password ── */}
        {forgotStep === 3 && (
          <motion.form
            key="forgotStep3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleResetPasswordSubmit}
            className="space-y-4"
          >
            <StepBadge step={3} total={3} />

            <div>
              <label className={labelClass}>নতুন পাসওয়ার্ড</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px]" style={iconStyle} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className={inputClass + " h-11 pl-11 pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer transition-colors"
                  style={{ color: "rgba(192,132,252,0.5)" }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>কনফার্ম পাসওয়ার্ড</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px]" style={iconStyle} />
                </div>
                <input
                  type="password"
                  required
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড পুনরায় দিন"
                  className={inputClass + " h-11 pl-11 pr-4"}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={ctaClass(loading) + " mt-1"} style={ctaStyle}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>পরিবর্তন করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                  <ArrowRight className="h-[18px] w-[18px]" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
