import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Phone,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useUserContext } from "@/context/UserContext";
import apiClient, { setAccessToken } from "@/lib/apiClient";

export default function AffiliateLogin() {
  const navigate = useNavigate();
  const { refreshProfile } = useUserContext();
  const location = useLocation();

  const [phoneNumber, setPhoneNumber] = useState(
    location.state?.phoneNumber || ""
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
            data?.error ||
            "আপনার অ্যাফিলিয়েট আবেদনটি সফলভাবে জমা হয়েছে এবং বর্তমানে পর্যালোচনায় রয়েছে। অ্যাডমিন অনুমোদন করার পর আপনি ড্যাশবোর্ড ও কুপন কোড ব্যবহার করতে পারবেন।",
        });
      } else if (
        data?.reviewStatus === "Rejected" ||
        data?.code === "APPLICATION_REJECTED"
      ) {
        setStatusFeedback({
          type: "rejected",
          title: "আবেদন প্রত্যাখ্যাত হয়েছে",
          message:
            data?.error ||
            `আপনার আবেদনটি অনুমোদিত হয়নি।${
              data?.rejectionReason ? ` কারণ: ${data.rejectionReason}` : ""
            }`,
        });
      } else if (
        data?.accountControlStatus === "Suspended" ||
        data?.code === "ACCOUNT_SUSPENDED"
      ) {
        setStatusFeedback({
          type: "suspended",
          title: "অ্যাকাউন্ট সাময়িকভাবে স্থগিত",
          message:
            data?.error ||
            `আপনার অ্যাকাউন্টটি স্থগিত রাখা হয়েছে।${
              data?.suspensionReason ? ` কারণ: ${data.suspensionReason}` : ""
            } বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।`,
        });
      } else if (
        data?.accountControlStatus === "Disabled" ||
        data?.code === "ACCOUNT_DISABLED"
      ) {
        setStatusFeedback({
          type: "disabled",
          title: "অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে",
          message:
            data?.error ||
            "আপনার অ্যাফিলিয়েট অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। সহায়তার জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।",
        });
      } else {
        toast.error(
          data?.error || "লগইন করতে সমস্যা হয়েছে। সঠিক মোবাইল নম্বর ও পাসওয়ার্ড দিন।"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link
          to="/affiliate"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>অ্যাফিলিয়েট হোমপেজে ফিরুন</span>
        </Link>

        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            Smart Proshno
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          অ্যাফিলিয়েট পার্টনার লগইন
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          আপনার রেফারেল ড্যাশবোর্ড ও কমিশন হিসাব দেখতে লগইন করুন
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-950/80 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl">
          {/* Registration Success Banner */}
          {location.state?.registrationSuccess && !statusFeedback && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-200">
                  আবেদন সফলভাবে গৃহীত হয়েছে!
                </p>
                <p className="mt-1 text-emerald-400/90 leading-relaxed">
                  অ্যাডমিন কর্তৃক আপনার আবেদন পর্যালোচনা করা হচ্ছে। অনুমোদন পেলে আপনি এসএমএস ও ইমেইলে নোটিফিকেশন পাবেন এবং আপনার ইউনিক কুপন সক্রিয় হবে।
                </p>
              </div>
            </div>
          )}

          {/* Account Status Feedback Banner */}
          {statusFeedback && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs flex items-start gap-3 ${
                statusFeedback.type === "pending"
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                  : "bg-pink-500/10 border border-pink-500/20 text-pink-300"
              }`}
            >
              {statusFeedback.type === "pending" ? (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{statusFeedback.title}</p>
                <p className="mt-1 leading-relaxed opacity-90">
                  {statusFeedback.message}
                </p>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                মোবাইল নম্বর
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="017XXXXXXXX"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                পাসওয়ার্ড
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="আপনার পাসওয়ার্ড"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
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
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>লগইন করা হচ্ছে...</span>
                </>
              ) : (
                <span>লগইন করুন</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            নতুন পার্টনার হতে চান?{" "}
            <Link
              to="/affiliate/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              বিনামূল্যে আবেদন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
