import { useUserContext } from "@/context/UserContext";
import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useAuthDrawer() {
  const {
    isAuthDrawerOpen,
    closeAuthDrawer,
    drawerDefaultTab,
    login: loginContext,
  } = useUserContext();

  const [mode, setMode] = useState("auth"); // 'auth' | 'forgotPassword'
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login States
  const [loginStep, setLoginStep] = useState(1); // 1: Phone, 2: Password
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register States
  const [regStep, setRegStep] = useState(1); // 1: Phone, 2: OTP, 3: Password & Name
  const [regPhone, setRegPhone] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regUserType, setRegUserType] = useState("Teacher"); // 'Teacher' | 'Institution'
  const [otpToken, setOtpToken] = useState(null);

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState(1); // 1: Phone, 2: OTP, 3: Passwords
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");

  // Timer State for OTP Resend (Register & Forgot)
  const [timer, setTimer] = useState(0);
  const [forgotTimer, setForgotTimer] = useState(0);

  // Track drawer state for resetting state during render transition
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if (isAuthDrawerOpen !== prevIsOpen) {
    setPrevIsOpen(isAuthDrawerOpen);
    if (isAuthDrawerOpen) {
      setActiveTab(drawerDefaultTab || "login");
      setMode("auth");
      setLoginStep(1);
      setLoginPhone("");
      setLoginPassword("");
      setRegStep(1);
      setRegPhone("");
      setRegOtp("");
      setRegFullName("");
      setRegPassword("");
      setRegConfirmPassword("");
      setRegUserType("Teacher");
      setOtpToken(null);
      setForgotStep(1);
      setForgotPhone("");
      setForgotOtp("");
      setResetToken(null);
      setForgotNewPassword("");
      setForgotConfirmPassword("");
      setForgotTimer(0);
      setLoading(false);
      setShowPassword(false);
    }
  }

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    let interval;
    if (forgotTimer > 0) {
      interval = setInterval(() => setForgotTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [forgotTimer]);

  // --- LOGIN HANDLERS ---
  const handleLoginNext = (e) => {
    e.preventDefault();
    if (!loginPhone.trim()) {
      toast.error("ফোন নম্বর প্রদান করুন।");
      return;
    }
    if (!/^(\+88)?01[3-9]\d{8}$/.test(loginPhone.trim())) {
      toast.error("সঠিক বাংলাদেশি ফোন নম্বর দিন (যেমন: 017XXXXXXXX)।");
      return;
    }
    setLoginStep(2);
  };

  // 2FA Login States
  const [tempToken2FA, setTempToken2FA] = useState(null);
  const [phoneNumberMasked2FA, setPhoneNumberMasked2FA] = useState("");
  const [is2FALoginModalOpen, setIs2FALoginModalOpen] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginPassword) {
      toast.error("পাসওয়ার্ড প্রদান করুন।");
      return;
    }

    setLoading(true);
    try {
      const data = await loginContext(loginPhone.trim(), loginPassword);
      if (data?.code === "PHONE_NOT_VERIFIED") {
        toast.info("আপনার মোবাইল নম্বরটি এখনও ভেরিফাই করা হয়নি।");
        setRegPhone(loginPhone.trim());
        setMode("auth");
        setActiveTab("register");
        setRegStep(2);
        setTimer(60);

        try {
          await apiClient.post("/auth/resend-otp", {
            phoneNumber: loginPhone.trim(),
          });
          toast.success("একটি নতুন OTP আপনার নম্বরে পাঠানো হয়েছে!");
        } catch {
          // ignore resend error
        }
      } else if (data?.requires2FA) {
        toast.info(data.message || "আপনার রেজিস্টার্ড নম্বরে ২-স্টেপ সিকিউরিটি OTP পাঠানো হয়েছে।");
        setTempToken2FA(data.tempToken);
        setPhoneNumberMasked2FA(data.phoneNumberMasked);
        closeAuthDrawer();
        setIs2FALoginModalOpen(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        err.response?.data?.message ||
          "লগইন করতে ব্যর্থ হয়েছে। নম্বর ও পাসওয়ার্ড আবার চেক করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTER HANDLERS ---
  const handleRegSendOtp = async (e) => {
    e.preventDefault();
    if (!regPhone.trim()) {
      toast.error("ফোন নম্বর প্রদান করুন।");
      return;
    }
    if (!/^(\+88)?01[3-9]\d{8}$/.test(regPhone.trim())) {
      toast.error("সঠিক বাংলাদেশি ফোন নম্বর দিন (যেমন: 017XXXXXXXX)।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/register-otp", {
        phoneNumber: regPhone.trim(),
      });
      toast.success(res.data.message || "OTP পাঠানো হয়েছে!");
      setRegStep(2);
      setTimer(60);
    } catch (err) {
      console.error("Reg OTP error:", err);
      toast.error(err.response?.data?.message || "OTP পাঠাতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleRegResendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/resend-otp", {
        phoneNumber: regPhone.trim(),
      });
      toast.success(res.data.message || "নতুন OTP পাঠানো হয়েছে!");
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP রিকোয়েস্ট ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleRegVerifyOtp = async (e) => {
    e.preventDefault();
    if (!regOtp || regOtp.trim().length !== 6) {
      toast.error("৬ ডিজিটের OTP কোডটি দিন।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/verify-otp", {
        phoneNumber: regPhone.trim(),
        otp: regOtp.trim(),
      });
      if (res.data.otpToken) {
        setOtpToken(res.data.otpToken);
      }
      toast.success(res.data.message || "OTP ভেরিফাইড!");
      setRegStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "ভুল OTP প্রদান করা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleRegComplete = async (e) => {
    e.preventDefault();
    if (!regFullName.trim() || regFullName.trim().length < 2) {
      toast.error("আপনার পুরো নাম লিখুন (কমপক্ষে ২ অক্ষর)।");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      toast.error("পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/complete-registration", {
        otpToken,
        phoneNumber: regPhone.trim(),
        fullName: regFullName.trim(),
        password: regPassword,
        userType: regUserType,
      });

      if (res.data.accessToken) {
        toast.success("রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!");
        closeAuthDrawer();
        window.location.reload();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "রেজিস্ট্রেশন সম্পন্ন করতে সমস্যা হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- FORGOT PASSWORD HANDLERS (3-Step Interactive Flow) ---
  // Step 1: Send OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotPhone.trim()) {
      toast.error("ফোন নম্বর প্রদান করুন।");
      return;
    }

    if (!/^(\+88)?01[3-9]\d{8}$/.test(forgotPhone.trim())) {
      toast.error("সঠিক বাংলাদেশি ফোন নম্বর দিন (যেমন: 017XXXXXXXX)।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/forgot-password", {
        phoneNumber: forgotPhone.trim(),
      });
      toast.success(res.data.message || "OTP পাঠানো হয়েছে!");
      setForgotStep(2);
      setForgotTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP পাঠাতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Resend OTP
  const handleForgotResendOtp = async () => {
    if (forgotTimer > 0) return;
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/forgot-password", {
        phoneNumber: forgotPhone.trim(),
      });
      toast.success(res.data.message || "নতুন OTP পাঠানো হয়েছে!");
      setForgotTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP রিকোয়েস্ট ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP -> Receive resetToken -> Step 3
  const handleForgotVerifyOtp = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      toast.error("৬ ডিজিটের OTP প্রদান করুন।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/verify-forgot-otp", {
        phoneNumber: forgotPhone.trim(),
        otp: forgotOtp.trim(),
      });
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
      toast.success(res.data.message || "OTP সফলভাবে যাচাই করা হয়েছে!");
      setForgotStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "ভুল OTP প্রদান করা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Submit New Password & Confirm Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      toast.error("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      toast.error("নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/reset-password", {
        phoneNumber: forgotPhone.trim(),
        resetToken,
        newPassword: forgotNewPassword,
      });
      toast.success(
        res.data.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!",
      );
      setMode("auth");
      setActiveTab("login");
      setLoginPhone(forgotPhone.trim());
      setLoginStep(2);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
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
    tempToken2FA,
    phoneNumberMasked2FA,
    is2FALoginModalOpen,
    setIs2FALoginModalOpen,

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
    regUserType,
    setRegUserType,
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
    resetToken,
    forgotNewPassword,
    setForgotNewPassword,
    forgotConfirmPassword,
    setForgotConfirmPassword,
    forgotTimer,
    handleForgotSendOtp,
    handleForgotResendOtp,
    handleForgotVerifyOtp,
    handleResetPasswordSubmit,
  };
}
