import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, useClerk, useSignIn, useSignUp } from "@clerk/react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, BookOpen, Eye, EyeOff, Key, Loader2, Lock, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Common Clerk Error Mapper to Bengali
const getBengaliError = (err) => {
  const code = err.errors?.[0]?.code || "";
  const msg = err.errors?.[0]?.message || "";

  if (code === "form_password_incorrect") {
    return "ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।";
  }
  if (code === "password_too_short" || msg.toLowerCase().includes("minimum length")) {
    return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
  }
  if (code === "code_expired") {
    return "ওটিপি কোডটির মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।";
  }
  if (code === "form_code_incorrect" || msg.toLowerCase().includes("incorrect code")) {
    return "ভুল ওটিপি কোড! সঠিক ওটিপি কোডটি লিখুন।";
  }
  if (code === "too_many_requests") {
    return "অতিরিক্ত অনুরোধ করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।";
  }
  if (msg.toLowerCase().includes("invalid phone")) {
    return "সঠিক মোবাইল নম্বর প্রদান করুন।";
  }
  
  return msg || "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
};

export default function AuthFlow() {
  const { isLoaded } = useAuth();
  const clerk = useClerk();
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const navigate = useNavigate();

  // States
  const [step, setStep] = useState("PHONE"); // PHONE, PASSWORD, OTP, SET_PASSWORD
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">লোড হচ্ছে...</p>
      </div>
    );
  }



  // Handle back navigation
  const goBack = (prevStep) => {
    setDirection(-1);
    setError("");
    setStep(prevStep);
  };

  // Helper to format/standardize phone number to E.164
  const formatPhoneNumber = (num) => {
    let cleaned = num.trim();
    if (!cleaned.startsWith("+")) {
      if (cleaned.startsWith("880")) {
        cleaned = "+" + cleaned;
      } else if (cleaned.startsWith("0")) {
        cleaned = "+880" + cleaned.substring(1);
      } else {
        cleaned = "+880" + cleaned;
      }
    }
    return cleaned;
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) {
      setError("সঠিক মোবাইল নম্বর প্রদান করুন।");
      return;
    }

    setLoading(true);
    setError("");
    const formattedPhone = formatPhoneNumber(phone);
    console.log("DEBUG: handlePhoneSubmit starting with:", formattedPhone);

    try {
      // Reset any pending/active attempts on the client to avoid state contamination
      if (clerk?.client) {
        if (typeof clerk.client.resetSignIn === "function") clerk.client.resetSignIn();
        if (typeof clerk.client.resetSignUp === "function") clerk.client.resetSignUp();
      }

      console.log("DEBUG: Calling signIn.create...");
      const res = await signIn.create({ identifier: formattedPhone });
      console.log("DEBUG: signIn.create succeeded:", res);
      setDirection(1);
      setStep("PASSWORD");
    } catch (err) {
      console.log("DEBUG: signIn.create failed:", err);
      console.log("DEBUG: err.errors:", err.errors);
      // Check if user is not found (meaning they are new and need to sign up)
      const isUserNotFound = err.errors?.some(e => e.code === "form_identifier_not_found") || 
                             err.errors?.some(e => e.message?.toLowerCase().includes("not found"));
      console.log("DEBUG: isUserNotFound:", isUserNotFound);

      if (isUserNotFound) {
        try {
          console.log("DEBUG: Calling signUp.create...");
          const signUpRes = await signUp.create({ phoneNumber: formattedPhone });
          console.log("DEBUG: signUp.create succeeded:", signUpRes);
          console.log("DEBUG: Calling signUp.preparePhoneNumberVerification...");
          const prepRes = await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });
          console.log("DEBUG: signUp.preparePhoneNumberVerification succeeded:", prepRes);
          setDirection(1);
          setStep("OTP");
        } catch (signUpErr) {
          console.log("DEBUG: signUp failed:", signUpErr);
          setError(getBengaliError(signUpErr));
        }
      } else {
        setError(getBengaliError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("পাসওয়ার্ড লিখুন।");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "password",
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      } else {
        setError("লগইন সম্পূর্ণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch (err) {
      setError(getBengaliError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      setError("সঠিক ওটিপি কোডটি লিখুন।");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signUp.attemptPhoneNumberVerification({
        code: otp,
      });

      if (result.status === "missing_fields" || result.status === "complete" || signUp.unverifiedFields.length === 0) {
        setDirection(1);
        setStep("SET_PASSWORD");
      } else {
        setError("ওটিপি কোডটি যাচাই করা যায়নি।");
      }
    } catch (err) {
      setError(getBengaliError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("পাসওয়ার্ড দুটি মিলছে না।");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signUp.update({
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      } else {
        setError("রেজিস্ট্রেশন সম্পূর্ণ করা যায়নি।");
      }
    } catch (err) {
      setError(getBengaliError(err));
    } finally {
      setLoading(false);
    }
  };

  // Slide Animation Variants
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-100 to-blue-50/50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden relative">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center pt-8 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="bg-primary p-2.5 rounded-xl text-white shadow-md shadow-blue-500/10 mb-2">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            ইপ্রশ্নব্যাংক
          </span>
          <p className="text-xs text-slate-400 mt-1">কয়েক ক্লিকেই মানসম্মত পরীক্ষার প্রশ্নপত্র</p>
        </div>

        {/* Global Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2.5 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Content Steps with Animations */}
        <div className="p-6 overflow-hidden min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait" custom={direction}>
            {step === "PHONE" && (
              <motion.div
                key="PHONE"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-800">লগইন অথবা নিবন্ধন</h2>
                  <p className="text-sm text-slate-500 mt-1">এগিয়ে যেতে আপনার মোবাইল নম্বরটি প্রদান করুন।</p>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-slate-400" /> মোবাইল নম্বর
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+8801XXXXXXXXX"
                      disabled={loading}
                      className="text-base tracking-wide h-11 border-slate-200 focus-visible:ring-primary font-mono"
                      autoFocus
                    />
                  </div>

                  {/* CAPTCHA Widget Container */}
                  <div id="clerk-captcha" className="mt-2 flex justify-center empty:hidden"></div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 text-base font-semibold shadow-md bg-primary hover:bg-primary/95 text-white transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "এগিয়ে যান"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === "PASSWORD" && (
              <motion.div
                key="PASSWORD"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <button
                    onClick={() => goBack("PHONE")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-2"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> ফিরে যান
                  </button>
                  <h2 className="text-lg font-bold text-slate-800">পাসওয়ার্ড লিখুন</h2>
                  <div className="flex items-center justify-between mt-1 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm text-slate-600 font-medium">মোবাইল: {phone}</span>
                    <button
                      onClick={() => goBack("PHONE")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      পরিবর্তন করুন
                    </button>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-slate-400" /> পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        disabled={loading}
                        className="text-base tracking-wide h-11 border-slate-200 focus-visible:ring-primary pr-10"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 text-base font-semibold shadow-md bg-primary hover:bg-primary/95 text-white transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "লগইন করুন"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === "OTP" && (
              <motion.div
                key="OTP"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <button
                    onClick={() => goBack("PHONE")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-2"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> ফিরে যান
                  </button>
                  <h2 className="text-lg font-bold text-slate-800">ওটিপি কোড যাচাই</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    আমরা আপনার <span className="font-semibold text-slate-700">{phone}</span> নম্বরে একটি ওটিপি কোড পাঠিয়েছি।
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                      <Key className="h-4 w-4 text-slate-400" /> ওটিপি কোড
                    </label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP code"
                      disabled={loading}
                      maxLength={6}
                      className="text-base tracking-widest text-center font-bold font-mono h-11 border-slate-200 focus-visible:ring-primary"
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 text-base font-semibold shadow-md bg-primary hover:bg-primary/95 text-white transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "কোড যাচাই করুন"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === "SET_PASSWORD" && (
              <motion.div
                key="SET_PASSWORD"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-800">পাসওয়ার্ড সেট করুন</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    ভবিষ্যতে সহজে লগইন করার জন্য একটি নতুন পাসওয়ার্ড সেট করুন।
                  </p>
                </div>

                <form onSubmit={handleSetPasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-slate-400" /> নতুন পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min 8 chars)"
                        disabled={loading}
                        className="text-base tracking-wide h-11 border-slate-200 focus-visible:ring-primary pr-10"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-slate-400" /> পাসওয়ার্ড নিশ্চিত করুন
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        disabled={loading}
                        className="text-base tracking-wide h-11 border-slate-200 focus-visible:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 text-base font-semibold shadow-md bg-primary hover:bg-primary/95 text-white transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "নিবন্ধন সম্পন্ন করুন"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
