import { BookOpen, X } from "lucide-react";
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
    forgotConfirmPassword,
    setForgotConfirmPassword,
    forgotTimer,
    handleForgotSendOtp,
    handleForgotResendOtp,
    handleForgotVerifyOtp,
    handleResetPasswordSubmit,
  } = useAuthDrawer();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
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

  const headerTitle =
    mode === "forgotPassword"
      ? "পাসওয়ার্ড রিসেট করুন"
      : activeTab === "login"
        ? "একাউন্টে লগইন করুন"
        : "নতুন একাউন্ট খুলুন";

  const headerSubtitle =
    mode === "forgotPassword"
      ? "নিবন্ধিত নম্বর দিয়ে পাসওয়ার্ড পুনরুদ্ধার করুন"
      : activeTab === "login"
        ? "আপনার ড্যাশবোর্ডে স্বাগতম"
        : "আজই শুরু করুন — বিনামূল্যে";

  return (
    <AnimatePresence>
      {isAuthDrawerOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-stretch sm:justify-end font-sans overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeAuthDrawer}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Responsive Animated Drawer Container */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full overflow-hidden max-h-[92vh] sm:max-h-full sm:h-full sm:w-[440px] sm:max-w-full rounded-t-3xl sm:rounded-none sm:rounded-l-3xl flex flex-col"
            style={{
              background:
                "linear-gradient(160deg, rgba(58,7,89,0.97) 0%, rgba(30,7,60,0.99) 50%, rgba(10,5,30,1) 100%)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Decorative glow blobs inside drawer (clipped to boundary) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-3xl sm:rounded-none sm:rounded-l-3xl">
              <div
                className="absolute top-0 right-0 w-72 h-72 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(144,14,176,0.22) 0%, transparent 70%)",
                  transform: "translate(30%, -30%)",
                }}
              />
              <div
                className="absolute bottom-1/4 left-0 w-56 h-56 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(219,39,119,0.12) 0%, transparent 70%)",
                  transform: "translate(-30%, 0%)",
                }}
              />
            </div>

            {/* ── Header ── */}
            <div
              className="relative px-6 pt-8 pb-6 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Close Button */}
              <button
                onClick={closeAuthDrawer}
                className="absolute top-5 right-5 p-1.5 rounded-full transition-all duration-200 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.16)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Brand */}
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="p-2 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <BookOpen className="h-5 w-5" style={{ color: "#d8b4fe" }} />
                </div>
                <span
                  className="text-sm font-semibold tracking-wide"
                  style={{ color: "rgba(216,180,254,0.85)" }}
                >
                  স্মার্ট প্রশ্নব্যাংক
                </span>
              </div>

              {/* Dynamic Title */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode + activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <h2 className="text-2xl font-bold text-white font-bengali tracking-tight leading-tight">
                    {headerTitle}
                  </h2>
                  <p
                    className="text-sm mt-1 font-bengali"
                    style={{ color: "rgba(216,180,254,0.65)" }}
                  >
                    {headerSubtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-6 pb-6 sm:px-8 sm:pb-8 flex flex-col justify-between min-h-0">
              <div>
                {/* Tab Switcher */}
                {mode === "auth" && (
                  <div
                    className="flex p-1 rounded-2xl mb-6"
                    style={{
                      background: "rgba(0,0,0,0.25)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("login");
                        setLoginStep(1);
                      }}
                      className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 font-bengali cursor-pointer ${
                        activeTab === "login"
                          ? "text-white"
                          : "hover:text-white"
                      }`}
                      style={{
                        color:
                          activeTab === "login"
                            ? "white"
                            : "rgba(216,180,254,0.55)",
                      }}
                    >
                      {activeTab === "login" && (
                        <motion.div
                          layoutId="authTabPill"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(126,34,206,0.9) 0%, rgba(144,14,176,0.85) 100%)",
                            border: "1px solid rgba(167,139,250,0.25)",
                            boxShadow: "0 4px 16px rgba(126,34,206,0.35)",
                          }}
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
                      className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 font-bengali cursor-pointer`}
                      style={{
                        color:
                          activeTab === "register"
                            ? "white"
                            : "rgba(216,180,254,0.55)",
                      }}
                    >
                      {activeTab === "register" && (
                        <motion.div
                          layoutId="authTabPill"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(126,34,206,0.9) 0%, rgba(144,14,176,0.85) 100%)",
                            border: "1px solid rgba(167,139,250,0.25)",
                            boxShadow: "0 4px 16px rgba(126,34,206,0.35)",
                          }}
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

                {/* Content */}
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
                        setForgotStep={setForgotStep}
                        forgotPhone={forgotPhone}
                        setForgotPhone={setForgotPhone}
                        forgotOtp={forgotOtp}
                        setForgotOtp={setForgotOtp}
                        forgotNewPassword={forgotNewPassword}
                        setForgotNewPassword={setForgotNewPassword}
                        forgotConfirmPassword={forgotConfirmPassword}
                        setForgotConfirmPassword={setForgotConfirmPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        forgotTimer={forgotTimer}
                        loading={loading}
                        handleForgotSendOtp={handleForgotSendOtp}
                        handleForgotResendOtp={handleForgotResendOtp}
                        handleForgotVerifyOtp={handleForgotVerifyOtp}
                        handleResetPasswordSubmit={handleResetPasswordSubmit}
                        setMode={setMode}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Support Footer */}
              <div
                className="mt-8 p-3 rounded-2xl text-center flex items-center justify-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="text-xs font-bengali"
                  style={{ color: "rgba(216,180,254,0.6)" }}
                >
                  OTP পেতে সমস্যা হলে কল করুন
                </span>
                <a
                  href="tel:+8801822482522"
                  className="text-xs font-bold font-sans transition-colors hover:text-white"
                  style={{ color: "#c084fc" }}
                >
                  +8801822482522
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
