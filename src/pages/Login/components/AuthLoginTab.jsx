import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Smartphone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// ── Shared dark-glass design tokens ──
const inputClass =
  "w-full rounded-xl text-sm text-white font-sans transition-all duration-200 outline-none border"
  + " bg-white/5 border-white/15 focus:border-purple-400/80 focus:ring-2 focus:ring-purple-400/20 placeholder:text-purple-300/40";

const labelClass =
  "text-xs font-semibold uppercase tracking-wider font-bengali block mb-1.5"
  + " text-purple-200";

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

export function AuthLoginTab({
  loginStep,
  setLoginStep,
  loginPhone,
  setLoginPhone,
  loginPassword,
  setLoginPassword,
  showPassword,
  setShowPassword,
  loading,
  handleLoginNext,
  handleLoginSubmit,
  setActiveTab,
  setRegStep,
  setMode,
  setForgotStep,
}) {
  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {loginStep === 1 ? (
          <motion.form
            key="loginStep1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleLoginNext}
            className="space-y-5"
          >
            <div>
              <label className={labelClass}>ফোন নম্বর</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Smartphone className="h-[18px] w-[18px]" style={iconStyle} />
                </div>
                <input
                  type="text"
                  required
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={inputClass + " h-12 pl-11 pr-4"}
                />
              </div>
            </div>

            <button type="submit" className={ctaClass(false)} style={ctaStyle}>
              <span>এগিয়ে যাই</span>
              <ArrowRight className="h-[18px] w-[18px]" />
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="loginStep2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleLoginSubmit}
            className="space-y-5"
          >
            {/* Phone chip */}
            <div
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span className="text-xs font-bold font-sans text-white/80">
                {loginPhone}
              </span>
              <button
                type="button"
                onClick={() => setLoginStep(1)}
                className="text-xs font-bold font-bengali cursor-pointer transition-colors"
                style={{ color: "#c084fc" }}
              >
                পরিবর্তন করুন
              </button>
            </div>

            <div>
              <label className={labelClass}>পাসওয়ার্ড</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px]" style={iconStyle} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড দিন"
                  className={inputClass + " h-12 pl-11 pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer transition-colors"
                  style={{ color: "rgba(192,132,252,0.5)" }}
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
              className={ctaClass(loading)}
              style={ctaStyle}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>লগইন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>লগইন করুন</span>
                  <ArrowRight className="h-[18px] w-[18px]" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Bottom Links */}
      <div className="flex items-center justify-center gap-2 text-xs font-semibold font-bengali pt-1"
        style={{ color: "rgba(216,180,254,0.7)" }}>
        <button
          type="button"
          onClick={() => { setActiveTab("register"); setRegStep(1); }}
          className="hover:text-white transition-colors cursor-pointer"
        >
          নতুন একাউন্ট
        </button>
        <span className="opacity-40">•</span>
        <button
          type="button"
          onClick={() => { setMode("forgotPassword"); setForgotStep(1); }}
          className="font-bold cursor-pointer transition-colors hover:text-white"
          style={{ color: "#c084fc" }}
        >
          পাসওয়ার্ড ভুলে গেছেন?
        </button>
      </div>
    </div>
  );
}
