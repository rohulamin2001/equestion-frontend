import {
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Phone,
  RefreshCw,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
        {regStep === 1 && (
          <motion.form
            key="regStep1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleRegSendOtp}
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
          </motion.form>
        )}

        {regStep === 2 && (
          <motion.form
            key="regStep2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleRegVerifyOtp}
            className="space-y-4"
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
                  className="text-amber-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
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
          </motion.form>
        )}

        {regStep === 3 && (
          <motion.form
            key="regStep3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleRegComplete}
            className="space-y-3.5"
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
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-6 text-center text-xs font-semibold text-slate-500 font-bengali">
        <span>ইতিমধ্যে একাউন্ট আছে? </span>
        <button
          type="button"
          onClick={() => {
            setActiveTab("login");
            setLoginStep(1);
          }}
          className="text-amber-600 font-bold hover:underline cursor-pointer"
        >
          লগইন করুন
        </button>
      </div>
    </div>
  );
}
