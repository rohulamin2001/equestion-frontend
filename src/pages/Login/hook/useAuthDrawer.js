import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserContext } from "../../../context/UserContext";
import apiClient from "../../../lib/apiClient";

export function useAuthDrawer() {
  const { isAuthDrawerOpen, closeAuthDrawer, drawerDefaultTab, login } =
    useUserContext();

  // Mode: 'auth' (login/register tabs) | 'forgotPassword'
  const [mode, setMode] = useState("auth");
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'

  // Common State
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login Flow States
  const [loginStep, setLoginStep] = useState(1); // 1: Phone, 2: Password
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Flow States
  const [regStep, setRegStep] = useState(1); // 1: Phone, 2: OTP, 3: Details & Password
  const [regPhone, setRegPhone] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regUserType, setRegUserType] = useState("Teacher"); // 'Teacher' | 'Institution'
  const [otpToken, setOtpToken] = useState(null);

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState(1); // 1: Phone, 2: OTP & New Password
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");

  // Timer State for OTP Resend
  const [timer, setTimer] = useState(0);

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
      setForgotNewPassword("");
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginPassword) {
      toast.error("পাসওয়ার্ড প্রদান করুন।");
      return;
    }

    setLoading(true);
    try {
      const res = await login(loginPhone.trim(), loginPassword);
      if (res?.code === "PHONE_NOT_VERIFIED") {
        toast.info(res.message);
        setRegPhone(loginPhone.trim());
        setActiveTab("register");
        setRegStep(2);
        setTimer(60);
      } else {
        toast.success("সফলভাবে লগইন হয়েছে!");
        closeAuthDrawer();
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
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

  // --- FORGOT PASSWORD HANDLERS ---
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotPhone.trim()) {
      toast.error("ফোন নম্বর প্রদান করুন।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/forgot-password", {
        phoneNumber: forgotPhone.trim(),
      });
      toast.success(res.data.message || "OTP পাঠানো হয়েছে!");
      setForgotStep(2);
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP পাঠাতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      toast.error("৬ ডিজিটের OTP প্রদান করুন।");
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      toast.error("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/reset-password", {
        phoneNumber: forgotPhone.trim(),
        otp: forgotOtp.trim(),
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
    forgotNewPassword,
    setForgotNewPassword,
    handleForgotSendOtp,
    handleResetPasswordSubmit,
  };
}
