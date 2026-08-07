import { ArrowLeft, ChevronRight, Loader2, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setMode("auth")}
        className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bengali mb-2 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>লগইনে ফিরে যান</span>
      </button>

      <AnimatePresence mode="wait">
        {forgotStep === 1 ? (
          <motion.form
            key="forgotStep1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleForgotSendOtp}
            className="space-y-4"
          >
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
          </motion.form>
        ) : (
          <motion.form
            key="forgotStep2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
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
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
