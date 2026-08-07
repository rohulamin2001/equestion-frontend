import { ChevronRight, Eye, EyeOff, Loader2, Lock, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
    <div>
      <AnimatePresence mode="wait">
        {loginStep === 1 ? (
          <motion.form
            key="loginStep1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleLoginNext}
            className="space-y-4"
          >
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
          </motion.form>
        ) : (
          <motion.form
            key="loginStep2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleLoginSubmit}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 font-sans">
                {loginPhone}
              </span>
              <button
                type="button"
                onClick={() => setLoginStep(1)}
                className="text-xs font-bold text-amber-600 hover:underline font-bengali cursor-pointer"
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
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
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
          </motion.form>
        )}
      </AnimatePresence>

      {/* Bottom Links */}
      <div className="mt-6 text-center text-xs font-semibold text-slate-500 font-bengali flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("register");
            setRegStep(1);
          }}
          className="hover:text-slate-800 transition cursor-pointer"
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
          className="hover:text-amber-600 transition cursor-pointer"
        >
          পাসওয়ার্ড ভুলে গেছেন
        </button>
      </div>
    </div>
  );
}
