import { useUserContext } from "@/context/UserContext";
import apiClient, { setAccessToken } from "@/lib/apiClient";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAffiliateLogin = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useUserContext();
  const location = useLocation();

  const [phoneNumber, setPhoneNumber] = useState(
    location.state?.phoneNumber || "",
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusFeedback(null);

    if (!phoneNumber.trim()) {
      toast.error("মোবাইল নম্বর লিখুন।");
      return;
    }

    if (!password) {
      toast.error("পাসওয়ার্ড লিখুন।");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post("/affiliate/login", {
        phoneNumber: phoneNumber.trim(),
        password,
      });

      if (response.data?.success) {
        setAccessToken(response.data.accessToken);
        if (refreshProfile) {
          try {
            await refreshProfile();
          } catch (e) {
            console.error("Profile refresh error:", e);
          }
        }
        toast.success("অ্যাফিলিয়েট ড্যাশবোর্ডে স্বাগতম!");
        navigate("/affiliate/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Affiliate login error:", err);
      const data = err.response?.data;

      if (
        data?.reviewStatus === "Pending" ||
        data?.code === "APPLICATION_PENDING"
      ) {
        setStatusFeedback({
          type: "pending",
          title: "আবেদন পর্যালোচনায় রয়েছে",
          message:
            data.error ||
            "আপনার আবেদনটি বর্তমানে অনুমোদনের অপেক্ষায় রয়েছে। অ্যাডমিন অনুমোদন করলে আপনি লগইন করতে পারবেন।",
        });
      } else if (
        data?.reviewStatus === "Rejected" ||
        data?.code === "APPLICATION_REJECTED"
      ) {
        setStatusFeedback({
          type: "rejected",
          title: "আবেদন প্রত্যাখ্যাত হয়েছে",
          message:
            data.error ||
            "দুঃখিত, আপনার অ্যাফিলিয়েট আবেদনটি অনুমোদন করা সম্ভব হয়নি।",
        });
      } else if (data?.code === "ACCOUNT_SUSPENDED") {
        setStatusFeedback({
          type: "suspended",
          title: "অ্যাকাউন্ট স্থগিত রয়েছে",
          message:
            data.error ||
            "আপনার অ্যাফিলিয়েট অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। সাপোর্টে যোগাযোগ করুন।",
        });
      } else {
        toast.error(
          data?.error ||
            "লগইন করতে সমস্যা হয়েছে। সঠিক মোবাইল নম্বর ও পাসওয়ার্ড দিন।",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    statusFeedback,
    registrationSuccess: location.state?.registrationSuccess,
    handleSubmit,
  };
};
