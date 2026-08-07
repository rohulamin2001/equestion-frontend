import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { AuthForgotPasswordMode } from "./components/AuthForgotPasswordMode";
import { AuthLoginTab } from "./components/AuthLoginTab";
import { AuthRegisterTab } from "./components/AuthRegisterTab";
import { useAuthDrawer } from "./hook/useAuthDrawer";

export default function AuthDrawer() {
  const {
    isAuthDrawerOpen,
    closeAuthDrawer,
    mode,
    setMode,
    activeTab,
    setActiveTab,
    loading,
    showPassword,
    setShowPassword,

    // Login
    loginStep,
    setLoginStep,
    loginPhone,
    setLoginPhone,
    loginPassword,
    setLoginPassword,
    handleLoginNext,
    handleLoginSubmit,

    // Register
    regStep,
    setRegStep,
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
    timer,
    handleRegSendOtp,
    handleRegResendOtp,
    handleRegVerifyOtp,
    handleRegComplete,

    // Forgot Password
    forgotStep,
    setForgotStep,
    forgotPhone,
    setForgotPhone,
    forgotOtp,
    setForgotOtp,
    forgotNewPassword,
    setForgotNewPassword,
    handleForgotSendOtp,
    handleResetPasswordSubmit,
  } = useAuthDrawer();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const drawerVariants = {
    hidden: isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 },
    visible: {
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        damping: isMobile ? 26 : 30,
        stiffness: isMobile ? 320 : 340,
        mass: 0.8,
      },
    },
    exit: isMobile
      ? { y: "100%", x: 0, transition: { duration: 0.22, ease: "easeIn" } }
      : { x: "100%", y: 0, transition: { duration: 0.25, ease: "easeInOut" } },
  };

  return (
    <AnimatePresence>
      {isAuthDrawerOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-stretch sm:justify-end font-sans overflow-hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeAuthDrawer}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Responsive Animated Drawer Container */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full bg-glass-elevated backdrop-blur-2xl border-slate-200/50 shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-full sm:h-full sm:w-[440px] sm:max-w-full rounded-t-3xl border-t sm:rounded-none sm:rounded-l-3xl sm:border-l p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              {/* Header Close Button */}
              <button
                onClick={closeAuthDrawer}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all duration-200 z-20 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title Header */}
              <div className="text-center mb-6 pt-2">
                <motion.h2
                  key={mode + activeTab}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-black text-slate-800 font-bengali tracking-tight"
                >
                  {mode === "forgotPassword"
                    ? "পাসওয়ার্ড রিসেট করুন"
                    : activeTab === "login"
                      ? "একাউন্টে লগইন করুন"
                      : "নতুন একাউন্ট খুলুন"}
                </motion.h2>
              </div>

              {/* Mode Switcher Tabs (Only in Auth mode) */}
              {mode === "auth" && (
                <div className="bg-slate-100/90 p-1.5 rounded-2xl flex mb-6 shadow-inner relative">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setLoginStep(1);
                    }}
                    className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200 font-bengali cursor-pointer ${
                      activeTab === "login"
                        ? "text-slate-900"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {activeTab === "login" && (
                      <motion.div
                        layoutId="authTabPill"
                        className="absolute inset-0 bg-white rounded-xl shadow-md"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">লগইন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("register");
                      setRegStep(1);
                    }}
                    className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200 font-bengali cursor-pointer ${
                      activeTab === "register"
                        ? "text-slate-900"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {activeTab === "register" && (
                      <motion.div
                        layoutId="authTabPill"
                        className="absolute inset-0 bg-white rounded-xl shadow-md"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">নতুন একাউন্ট</span>
                  </button>
                </div>
              )}

              {/* Tab & Mode Animated Content Switcher */}
              <AnimatePresence mode="wait">
                {mode === "auth" && activeTab === "login" && (
                  <motion.div
                    key="loginTab"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AuthLoginTab
                      loginStep={loginStep}
                      setLoginStep={setLoginStep}
                      loginPhone={loginPhone}
                      setLoginPhone={setLoginPhone}
                      loginPassword={loginPassword}
                      setLoginPassword={setLoginPassword}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      loading={loading}
                      handleLoginNext={handleLoginNext}
                      handleLoginSubmit={handleLoginSubmit}
                      setActiveTab={setActiveTab}
                      setRegStep={setRegStep}
                      setMode={setMode}
                      setForgotStep={setForgotStep}
                    />
                  </motion.div>
                )}

                {mode === "auth" && activeTab === "register" && (
                  <motion.div
                    key="registerTab"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AuthRegisterTab
                      regStep={regStep}
                      regPhone={regPhone}
                      setRegPhone={setRegPhone}
                      regOtp={regOtp}
                      setRegOtp={setRegOtp}
                      regFullName={regFullName}
                      setRegFullName={setRegFullName}
                      regPassword={regPassword}
                      setRegPassword={setRegPassword}
                      regConfirmPassword={regConfirmPassword}
                      setRegConfirmPassword={setRegConfirmPassword}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      loading={loading}
                      timer={timer}
                      handleRegSendOtp={handleRegSendOtp}
                      handleRegResendOtp={handleRegResendOtp}
                      handleRegVerifyOtp={handleRegVerifyOtp}
                      handleRegComplete={handleRegComplete}
                      setActiveTab={setActiveTab}
                      setLoginStep={setLoginStep}
                    />
                  </motion.div>
                )}

                {mode === "forgotPassword" && (
                  <motion.div
                    key="forgotTab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AuthForgotPasswordMode
                      forgotStep={forgotStep}
                      forgotPhone={forgotPhone}
                      setForgotPhone={setForgotPhone}
                      forgotOtp={forgotOtp}
                      setForgotOtp={setForgotOtp}
                      forgotNewPassword={forgotNewPassword}
                      setForgotNewPassword={setForgotNewPassword}
                      loading={loading}
                      handleForgotSendOtp={handleForgotSendOtp}
                      handleResetPasswordSubmit={handleResetPasswordSubmit}
                      setMode={setMode}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Support Banner */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] font-semibold text-slate-400 font-bengali">
                OTP পেতে সমস্যা হলে কল করুন{" "}
                <span className="font-sans text-slate-600 font-bold">
                  +8801822482522
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
