import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../../lib/apiClient";

export const useSms2FA = () => {
  const queryClient = useQueryClient();

  // Send Enable OTP
  const sendEnableOtp = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post("/auth/2fa/send-enable-otp");
      return data;
    },
    onSuccess: (data) => {
      toast.success(
        data.message || "আপনার রেজিস্টার্ড নম্বরে OTP পাঠানো হয়েছে।",
      );
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "OTP পাঠাতে ব্যর্থ হয়েছে।");
    },
  });

  // Confirm Enable 2FA
  const confirmEnable = useMutation({
    mutationFn: async ({ otp }) => {
      const { data } = await apiClient.post("/auth/2fa/confirm-enable", {
        otp,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(
        data.message || "SMS ২-স্টেপ নিরাপত্তা সফলভাবে সক্রিয় করা হয়েছে!",
      );
      queryClient.setQueriesData({ queryKey: ["userProfile"] }, (oldData) => {
        if (!oldData) return oldData;
        return { ...oldData, twoFactorEnabled: true };
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "OTP ভেরিফিকেশন ব্যর্থ হয়েছে।",
      );
    },
  });

  // Send Disable OTP (Requires Current Password)
  const sendDisableOtp = useMutation({
    mutationFn: async ({ currentPassword }) => {
      const { data } = await apiClient.post("/auth/2fa/send-disable-otp", {
        currentPassword,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "২-স্টেপ নিষ্ক্রিয় করার OTP পাঠানো হয়েছে।");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "পাসওয়ার্ড সঠিক নয় বা OTP পাঠাতে সমস্যা হয়েছে।",
      );
    },
  });

  // Confirm Disable 2FA (Requires Current Password + OTP)
  const confirmDisable = useMutation({
    mutationFn: async ({ currentPassword, otp }) => {
      const { data } = await apiClient.post("/auth/2fa/confirm-disable", {
        currentPassword,
        otp,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(
        data.message || "SMS ২-স্টেপ নিরাপত্তা সফলভাবে বন্ধ করা হয়েছে।",
      );
      queryClient.setQueriesData({ queryKey: ["userProfile"] }, (oldData) => {
        if (!oldData) return oldData;
        return { ...oldData, twoFactorEnabled: false };
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "2FA নিষ্ক্রিয় করতে সমস্যা হয়েছে।",
      );
    },
  });

  // Verify Login OTP
  const verifyLoginOtp = useMutation({
    mutationFn: async ({ tempToken, otp }) => {
      const { data } = await apiClient.post("/auth/2fa/verify-login", {
        tempToken,
        otp,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "লগইন সফল হয়েছে!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "ভুল OTP অথবা সেশনের মেয়াদ শেষ।",
      );
    },
  });

  // Resend Login OTP
  const resendLoginOtp = useMutation({
    mutationFn: async ({ tempToken }) => {
      const { data } = await apiClient.post("/auth/2fa/resend-login-otp", {
        tempToken,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "নতুন OTP পাঠানো হয়েছে।");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "OTP পুনঃপ্রেরণ ব্যর্থ হয়েছে।",
      );
    },
  });

  return {
    sendEnableOtp,
    confirmEnable,
    sendDisableOtp,
    confirmDisable,
    verifyLoginOtp,
    resendLoginOtp,
  };
};
