import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Package,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useUserContext } from "../../context/UserContext";
import apiClient from "../../lib/apiClient";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useUserContext();

  const paymentId = searchParams.get("paymentId");

  const {
    data: paymentData,
    isLoading: loading,
    isFetching: checking,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["paymentStatus", paymentId],
    queryFn: async () => {
      const res = await apiClient.get(`/payments/${paymentId}/status`);
      return res.data?.payment;
    },
    enabled: !!paymentId,
    retry: 1,
  });

  const hasRefreshedRef = useRef(false);
  useEffect(() => {
    if (paymentData?.status === "PAID" && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      refreshProfile();
    }
  }, [paymentData?.status, refreshProfile]);

  const handleRefresh = async () => {
    try {
      const result = await refetch();
      const status = result.data?.status;
      if (status === "PAID") {
        refreshProfile();
        toast.success("পেমেন্ট সফলভাবে যাচাই করা হয়েছে!");
      } else {
        toast.info(`বর্তমান স্ট্যাটাস: ${status || "যাচাই করা হচ্ছে"}`);
      }
    } catch {
      toast.error("পেমেন্ট স্ট্যাটাস যাচাই করতে সমস্যা হয়েছে।");
    }
  };

  const errorMessage = !paymentId
    ? "কোনো পেমেন্ট আইডি পাওয়া যায়নি।"
    : queryError
      ? queryError.response?.data?.error ||
        "পেমেন্ট স্ট্যাটাস যাচাই করতে সমস্যা হয়েছে।"
      : null;

  if (paymentId && loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="size-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">
          পেমেন্ট তথ্য যাচাই করা হচ্ছে...
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          অনুগ্রহ করে অপেক্ষা করুন, PortPos গেটওয়ে থেকে আপনার পেমেন্টের নিশ্চয়তা
          নেওয়া হচ্ছে।
        </p>
      </div>
    );
  }

  if (errorMessage || !paymentData) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-rose-200 rounded-3xl shadow-xl text-center space-y-6">
        <div className="size-16 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">
            পেমেন্ট তথ্য পাওয়া যায়নি
          </h2>
          <p className="text-sm text-slate-500">
            {errorMessage ||
              "অনুরোধকৃত পেমেন্ট রেকর্ডের তথ্য লোড করা সম্ভব হয়নি।"}
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/subscription")}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2"
        >
          <span>সাবস্ক্রিপশন পেজে ফিরুন</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    );
  }

  const status = paymentData.status;

  return (
    <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-glass-elevated border border-slate-200/80 rounded-3xl shadow-2xl backdrop-blur-xl space-y-8 font-sans">
      {/* Top Banner based on Status */}
      {status === "PAID" && (
        <div className="text-center space-y-4">
          <div className="size-20 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="size-10 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              <ShieldCheck className="size-3.5" />
              <span>পেমেন্ট সফল ও ভেরিফাইড</span>
            </span>
            <h1 className="text-2xl font-bold text-slate-800 mt-2">
              অভিনন্দন! আপনার ক্রয় সফল হয়েছে
            </h1>
            <p className="text-sm text-slate-500">
              আপনার সাবস্ক্রিপশন লাইসেন্স সক্রিয় করা হয়েছে। এখন আপনি সম্পূর্ণ
              ফিচার ব্যবহার করতে পারবেন।
            </p>
          </div>
        </div>
      )}

      {status === "PENDING" && (
        <div className="text-center space-y-4">
          <div className="size-20 bg-amber-50 text-amber-600 border border-amber-200 rounded-3xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <Clock className="size-10" />
          </div>
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
              <RefreshCw className="size-3.5 animate-spin" />
              <span>পেমেন্ট প্রক্রিয়াধীন (Pending)</span>
            </span>
            <h1 className="text-2xl font-bold text-slate-800 mt-2">
              পেমেন্ট ভেরিফিকেশন চলছে
            </h1>
            <p className="text-sm text-slate-500">
              PortPos থেকে পেমেন্টের নিশ্চয়তা রিসিভ হতে কিছু সময় লাগতে পারে।
              নিচের বাটনে ক্লিক করে বর্তমান স্ট্যাটাস রিফ্রেশ করুন।
            </p>
          </div>
        </div>
      )}

      {status === "RECONCILIATION_REQUIRED" && (
        <div className="text-center space-y-4">
          <div className="size-20 bg-orange-50 text-orange-600 border border-orange-200 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="size-10" />
          </div>
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
              পর্যালোচনা আবশ্যক
            </span>
            <h1 className="text-2xl font-bold text-slate-800 mt-2">
              পেমেন্ট যাচাইয়ের অপেক্ষায় রয়েছে
            </h1>
            <p className="text-sm text-slate-500">
              আপনার অর্থ কেটে থাকলে চিন্তা করবেন না। গেটওয়ের অডিট স্বয়ংক্রিয়ভাবে
              চলছে এবং খুব শীঘ্রই লাইসেন্স চালু হয়ে যাবে।
            </p>
          </div>
        </div>
      )}

      {(status === "FAILED" ||
        status === "CANCELLED" ||
        status === "EXPIRED") && (
        <div className="text-center space-y-4">
          <div className="size-20 bg-rose-50 text-rose-600 border border-rose-200 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <XCircle className="size-10 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
              পেমেন্ট ব্যর্থ হয়েছে
            </span>
            <h1 className="text-2xl font-bold text-slate-800 mt-2">
              পেমেন্ট সম্পন্ন হতে পারেনি
            </h1>
            <p className="text-sm text-slate-500">
              {paymentData.failureMessage ||
                "লেনদেনটি বাতিল বা ব্যর্থ হয়েছে। আপনি চাইলে পুনরায় চেষ্টা করতে পারেন।"}
            </p>
          </div>
        </div>
      )}

      {/* Invoice Details Card */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3 text-left">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
          <span className="text-slate-500 font-medium">অর্ডার নম্বর:</span>
          <span className="font-bold text-slate-800 font-mono">
            {paymentData.orderNumber || "N/A"}
          </span>
        </div>

        {paymentData.packageTitle && (
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">প্যাকেজ:</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Package className="size-3.5 text-purple-600" />
              <span>{paymentData.packageTitle}</span>
              {paymentData.version && (
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-medium">
                  {paymentData.version}
                </span>
              )}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
          <span className="text-slate-500 font-medium">পরিশোধিত মূল্য:</span>
          <span className="font-bold text-slate-900 text-sm">
            ৳{paymentData.amount} {paymentData.currency}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">লেনদেনের স্থিতি:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              status === "PAID"
                ? "bg-emerald-100 text-emerald-800"
                : status === "PENDING"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {status === "PAID" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/dashboard/generate")}
              className="py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-xl text-xs shadow-md shadow-purple-200 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>প্রশ্ন তৈরি শুরু করুন</span>
              <ArrowRight className="size-4" />
            </button>
            <button
              onClick={() => navigate("/dashboard/subscription")}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>লাইসেন্স তালিকা দেখুন</span>
              <ExternalLink className="size-4" />
            </button>
          </div>
        ) : status === "PENDING" ? (
          <div className="space-y-2">
            <button
              onClick={handleRefresh}
              disabled={checking}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <RefreshCw
                className={`size-4 ${checking ? "animate-spin" : ""}`}
              />
              <span>স্ট্যাটাস রিফ্রেশ করুন</span>
            </button>
            <button
              onClick={() => navigate("/dashboard/subscription")}
              className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
            >
              পরে চেক করুন / সাবস্ক্রিপশন পেজে যান
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/dashboard/subscription")}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <RotateCcw className="size-4" />
            <span>আবার চেষ্টা করুন</span>
          </button>
        )}
      </div>
    </div>
  );
}
