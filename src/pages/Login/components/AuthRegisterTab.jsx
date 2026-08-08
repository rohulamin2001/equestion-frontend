import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  User,
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

export function AuthRegisterTab({
  regStep,
  regPhone,
  setRegPhone,
  regOtp,
  setRegOtp,
  regFullName,
  setRegFullName,
  regPassword,
  setRegPassword,
  regConfirmPassword,
  setRegConfirmPassword,
  showPassword,
  setShowPassword,
  loading,
  timer,
  handleRegSendOtp,
  handleRegResendOtp,
  handleRegVerifyOtp,
  handleRegComplete,
  setActiveTab,
  setLoginStep,
}) {
  return (
    <div>
      <AnimatePresence mode="wait">
        {/* ── Step 1: Phone ── */}
        {regStep === 1 && (
          <motion.form
            key="regStep1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleRegSendOtp}
            className="space-y-5"
          >
            <StepBadge step={1} total={3} />
            <div>
              <label className={labelClass}>ফোন নম্বর</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Smartphone className="h-[18px] w-[18px]" style={iconStyle} />
                </div>
                <input
                  type="text"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
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
        )}

        {/* ── Step 2: OTP ── */}
        {regStep === 2 && (
          <motion.form
            key="regStep2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleRegVerifyOtp}
            className="space-y-5"
          >
            <StepBadge step={2} total={3} />

            {/* OTP info chip */}
            <div
              className="flex items-start gap-2.5 p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#c084fc" }} />
              <p className="text-xs font-bengali leading-relaxed" style={{ color: "rgba(216,180,254,0.8)" }}>
                <span className="font-bold font-sans text-white">{regPhone}</span>{" "}
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
                value={regOtp}
                onChange={(e) => setRegOtp(e.target.value)}
                placeholder="• • • • • •"
                className={inputClass + " h-14 text-center text-xl font-bold tracking-[0.55em] px-4"}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold font-bengali"
              style={{ color: "rgba(216,180,254,0.6)" }}>
              <span>{timer > 0 ? `পুনরায় পাঠান (${timer}s)` : "কোড পাননি?"}</span>
              {timer === 0 && (
                <button
                  type="button"
                  onClick={handleRegResendOtp}
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
                <><Loader2 className="h-5 w-5 animate-spin" /><span>যাচাই করা হচ্ছে...</span></>
              ) : (
                <><span>যাচাই করুন</span><ArrowRight className="h-[18px] w-[18px]" /></>
              )}
            </button>
          </motion.form>
        )}

        {/* ── Step 3: Profile + Password ── */}
        {regStep === 3 && (
          <motion.form
            key="regStep3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleRegComplete}
            className="space-y-4"
          >
            <StepBadge step={3} total={3} />

            <div>
              <label className={labelClass}>আপনার পুরো নাম</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-[18px] w-[18px]" style={iconStyle} />
                </div>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="যেমন: মোঃ রাফসান আহমেদ"
                  className={inputClass + " h-11 pl-11 pr-4 font-bengali"}
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
                  type={showPassword ? "text" : "password"}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
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
              <input
                type="password"
                required
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="পাসওয়ার্ড পুনরায় দিন"
                className={inputClass + " h-11 px-4"}
              />
            </div>

            <button type="submit" disabled={loading} className={ctaClass(loading) + " mt-1"} style={ctaStyle}>
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /><span>সম্পন্ন হচ্ছে...</span></>
              ) : (
                <><span>নিবন্ধন সম্পন্ন করুন</span><ArrowRight className="h-[18px] w-[18px]" /></>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-6 text-center text-xs font-semibold font-bengali" style={{ color: "rgba(216,180,254,0.65)" }}>
        <span>ইতিমধ্যে একাউন্ট আছে? </span>
        <button
          type="button"
          onClick={() => { setActiveTab("login"); setLoginStep(1); }}
          className="font-bold cursor-pointer transition-colors hover:text-white"
          style={{ color: "#c084fc" }}
        >
          লগইন করুন
        </button>
      </div>
    </div>
  );
}
