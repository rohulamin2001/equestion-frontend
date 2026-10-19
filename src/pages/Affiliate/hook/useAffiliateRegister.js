import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAffiliateRegister = () => {
  const navigate = useNavigate();

  // Form State (7 Personal Info Fields)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    profession: "",
    address: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 mins = 300s
  const canResend = countdown === 0;
  const [isResending, setIsResending] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");

  // Countdown Timer
  useEffect(() => {
    let timer;
    if (showOtpModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, countdown]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("অনুগ্রহ করে আপনার মোবাইল নম্বর লিখুন।");
      return;
    }

    const cleanPhone = formData.phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 11) {
      toast.error("সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("পাসওয়ার্ড নূন্যতম ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("পাসওয়ার্ড ও পাসওয়ার্ড নিশ্চিতকরণ মিলছে না।");
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error("প্রোগ্রামের শর্তাবলী ও নীতিমালা মেনে নেওয়ার বক্সে টিক দিন।");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/affiliate/register", {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        profession: formData.profession,
        address: formData.address,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data?.success) {
        setVerifiedPhone(response.data.phoneNumber || formData.phoneNumber);
        setShowOtpModal(true);
        setCountdown(300);
        
        toast.success(response.data.message || "মোবাইলে ওটিপি পাঠানো হয়েছে।");
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error(
        err.response?.data?.error ||
          "রেজিস্ট্রেশন শুরু করতে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error("অনুগ্রহ করে ৬ ডিজিটের ওটিপি সঠিকভাবে লিখুন।");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await apiClient.post("/affiliate/verify-otp", {
        phoneNumber: verifiedPhone || formData.phoneNumber,
        otp: otpCode.trim(),
      });

      if (response.data?.success) {
        toast.success("আপনার আবেদন সফলভাবে সম্পন্ন হয়েছে!");
        setShowOtpModal(false);
        navigate("/affiliate/login", {
          state: {
            registrationSuccess: true,
            phoneNumber: verifiedPhone || formData.phoneNumber,
          },
        });
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      toast.error(
        err.response?.data?.error || "ভুল ওটিপি অথবা মেয়াদ শেষ হয়ে গেছে।",
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      const response = await apiClient.post("/affiliate/resend-otp", {
        phoneNumber: verifiedPhone || formData.phoneNumber,
      });

      if (response.data?.success) {
        toast.success("নতুন ওটিপি কোড পাঠানো হয়েছে।");
        setCountdown(300);
        
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || "ওটিপি পুনরায় পাঠাতে সমস্যা হয়েছে।",
      );
    } finally {
      setIsResending(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(mins) + ":" + (secs < 10 ? "0" : "") + String(secs);
  };

  return {
    formData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSubmitting,
    showOtpModal,
    setShowOtpModal,
    otpCode,
    setOtpCode,
    isVerifyingOtp,
    countdown,
    canResend,
    isResending,
    verifiedPhone,
    formatTimer,
    handleChange,
    handleSubmit,
    handleVerifyOtp,
    handleResendOtp,
  };
};
