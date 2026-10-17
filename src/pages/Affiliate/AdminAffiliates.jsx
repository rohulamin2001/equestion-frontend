import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  Edit,
  Eye,
  Filter,
  History,
  Lock,
  PauseCircle,
  PlayCircle,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

export default function AdminAffiliates() {
  const [activeTab, setActiveTab] = useState("settings"); // 'settings', 'applications', 'affiliates', 'withdrawals', 'audit'
  const [isLoading, setIsLoading] = useState(false);

  // 1. Settings State
  const [settings, setSettings] = useState({
    isProgramEnabled: false,
    defaultDiscountType: "Percentage",
    defaultDiscountValue: 10,
    defaultCommissionType: "Percentage",
    defaultCommissionValue: 20,
    maxMarketingCostPercent: 30,
    defaultMinWithdrawalAmountMinor: 500000,
    defaultActivationSalesCount: 3,
    commissionHoldPeriodDays: 14,
    allowedPaymentMethods: ["bKash", "Nagad", "Rocket", "Bank Transfer"],
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isRunningReleaseJob, setIsRunningReleaseJob] = useState(false);

  // 2. Applications State
  const [applications, setApplications] = useState([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessingApp, setIsProcessingApp] = useState(false);

  // 3. Affiliates List State
  const [affiliatesList, setAffiliatesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedAffiliateForCustom, setSelectedAffiliateForCustom] = useState(null);
  const [customSettingsForm, setCustomSettingsForm] = useState({
    useCustomSettings: false,
    discountValue: 10,
    commissionValue: 20,
    minWithdrawalTaka: 5000,
    activationSalesCount: 3,
  });

  // 4. Withdrawals Queue State
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalFilter, setWithdrawalFilter] = useState("ALL");
  const [selectedWithdrawalForPaid, setSelectedWithdrawalForPaid] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [paidNotes, setPaidNotes] = useState("");
  const [selectedWithdrawalForReject, setSelectedWithdrawalForReject] = useState(null);
  const [withdrawalRejectReason, setWithdrawalRejectReason] = useState("");

  // Load Global Settings
  const fetchSettings = async () => {
    try {
      const res = await apiClient.get("/admin/affiliates/settings");
      if (res.data?.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.error("Fetch settings error:", err);
      toast.error("গ্লোবাল সেটিংস লোড করতে সমস্যা হয়েছে।");
    }
  };

  // Load Pending Applications
  const fetchApplications = async () => {
    try {
      const res = await apiClient.get("/admin/affiliates/applications");
      if (res.data?.applications) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error("Fetch applications error:", err);
    }
  };

  // Load Affiliates List
  const fetchAffiliates = async () => {
    try {
      const res = await apiClient.get("/admin/affiliates/list", {
        params: { search: searchTerm, status: statusFilter },
      });
      if (res.data?.affiliates) {
        setAffiliatesList(res.data.affiliates);
      }
    } catch (err) {
      console.error("Fetch affiliates error:", err);
    }
  };

  // Load Withdrawals Queue
  const fetchWithdrawals = async () => {
    try {
      const res = await apiClient.get("/admin/affiliates/withdrawals", {
        params: { status: withdrawalFilter },
      });
      if (res.data?.withdrawals) {
        setWithdrawals(res.data.withdrawals);
      }
    } catch (err) {
      console.error("Fetch withdrawals error:", err);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchSettings();
    fetchApplications();
    fetchAffiliates();
    fetchWithdrawals();
  }, []);

  // Handle Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();

    const discount = Number(settings.defaultDiscountValue);
    const commission = Number(settings.defaultCommissionValue);
    const cap = Number(settings.maxMarketingCostPercent || 30);

    if (discount + commission > cap) {
      toast.error(
        `ডিসকাউন্ট (${discount}%) এবং কমিশন (${commission}%)-এর যোগফল অনুমোদিত ক্যাপ (${cap}%) অতিক্রম করেছে!`
      );
      return;
    }

    setIsSavingSettings(true);
    try {
      const res = await apiClient.put("/admin/affiliates/settings", settings);
      if (res.data?.success) {
        toast.success("অ্যাফিলিয়েট গ্লোবাল সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.error("Save settings error:", err);
      toast.error(err.response?.data?.error || "সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Run 14-Day Hold Release Job Manually
  const handleRunReleaseJob = async () => {
    setIsRunningReleaseJob(true);
    try {
      const res = await apiClient.post("/admin/affiliates/run-release-job");
      if (res.data?.success) {
        toast.success(res.data.message || "রিলিজ জব সফলভাবে সম্পন্ন হয়েছে!");
        await fetchAffiliates();
        await fetchWithdrawals();
      }
    } catch (err) {
      console.error("Run release job error:", err);
      toast.error(err.response?.data?.error || "রিলিজ জব চালাতে সমস্যা হয়েছে।");
    } finally {
      setIsRunningReleaseJob(false);
    }
  };

  // Approve Application
  const handleApproveApp = async (appId) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই আবেদনটি অনুমোদন করতে চান? এটি একটি ইউনিক কুপন কোড জেনারেট করবে এবং এসএমএস পাঠাবে।")) {
      return;
    }

    setIsProcessingApp(true);
    try {
      const res = await apiClient.post(`/admin/affiliates/applications/${appId}/approve`);
      if (res.data?.success) {
        toast.success(res.data.message || "আবেদন সফলভাবে অনুমোদিত হয়েছে!");
        await fetchApplications();
        await fetchAffiliates();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "অনুমোদন ব্যর্থ হয়েছে।");
    } finally {
      setIsProcessingApp(false);
    }
  };

  // Reject Application
  const handleRejectApp = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;

    setIsProcessingApp(true);
    try {
      const res = await apiClient.post(
        `/admin/affiliates/applications/${selectedApplication._id}/reject`,
        { rejectionReason }
      );
      if (res.data?.success) {
        toast.success("আবেদন প্রত্যাখ্যাত হয়েছে।");
        setIsRejectModalOpen(false);
        setSelectedApplication(null);
        setRejectionReason("");
        await fetchApplications();
        await fetchAffiliates();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "প্রত্যাখ্যান ব্যর্থ হয়েছে।");
    } finally {
      setIsProcessingApp(false);
    }
  };

  // Toggle Affiliate Account Control Status
  const handleControlStatusChange = async (affiliateId, newStatus) => {
    let suspensionReason = "";
    if (newStatus === "Suspended") {
      suspensionReason = prompt("স্থগিত করার কারণ লিখুন (ঐচ্ছিক):") || "";
    }

    try {
      const res = await apiClient.patch(
        `/admin/affiliates/${affiliateId}/control-status`,
        { accountControlStatus: newStatus, suspensionReason }
      );
      if (res.data?.success) {
        toast.success(`অ্যাকাউন্ট স্ট্যাটাস '${newStatus}' করা হয়েছে।`);
        await fetchAffiliates();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।");
    }
  };

  // Open Custom Settings Modal
  const openCustomSettingsModal = (aff) => {
    setSelectedAffiliateForCustom(aff);
    const cs = aff.customSettings || {};
    setCustomSettingsForm({
      useCustomSettings: Boolean(aff.useCustomSettings),
      discountValue: cs.discountValue ?? 10,
      commissionValue: cs.commissionValue ?? 20,
      minWithdrawalTaka: (cs.minWithdrawalAmountMinor ?? 500000) / 100,
      activationSalesCount: cs.activationSalesCount ?? 3,
    });
  };

  // Save Custom Settings Override
  const handleSaveCustomSettings = async (e) => {
    e.preventDefault();
    if (!selectedAffiliateForCustom) return;

    const discount = Number(customSettingsForm.discountValue);
    const commission = Number(customSettingsForm.commissionValue);
    const cap = Number(settings.maxMarketingCostPercent || 30);

    if (customSettingsForm.useCustomSettings && discount + commission > cap) {
      toast.error(
        `কাস্টম ডিসকাউন্ট (${discount}%) ও কমিশনের (${commission}%) যোগফল ক্যাপ (${cap}%) এর বেশি হতে পারবে না!`
      );
      return;
    }

    try {
      const res = await apiClient.put(
        `/admin/affiliates/${selectedAffiliateForCustom._id}/custom-settings`,
        {
          useCustomSettings: customSettingsForm.useCustomSettings,
          discountValue: discount,
          commissionValue: commission,
          minWithdrawalAmountMinor: customSettingsForm.minWithdrawalTaka * 100,
          activationSalesCount: customSettingsForm.activationSalesCount,
        }
      );
      if (res.data?.success) {
        toast.success("কাস্টম পলিসি সেটিংস সংরক্ষিত হয়েছে!");
        setSelectedAffiliateForCustom(null);
        await fetchAffiliates();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "কাস্টম সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।");
    }
  };

  // Withdrawal Transitions
  const handleApproveWithdrawal = async (id) => {
    try {
      const res = await apiClient.post(`/admin/affiliates/withdrawals/${id}/approve`);
      if (res.data?.success) {
        toast.success("উইথড্র রিকোয়েস্ট অনুমোদিত হয়েছে!");
        await fetchWithdrawals();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "অনুমোদন ব্যর্থ হয়েছে।");
    }
  };

  const handleStartProcessingWithdrawal = async (id) => {
    try {
      const res = await apiClient.post(
        `/admin/affiliates/withdrawals/${id}/start-processing`
      );
      if (res.data?.success) {
        toast.success("উইথড্রয়াল প্রসেসিং শুরু হয়েছে।");
        await fetchWithdrawals();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "প্রসেসিং শুরু ব্যর্থ হয়েছে।");
    }
  };

  const handleConfirmPaidWithdrawal = async (e) => {
    e.preventDefault();
    if (!selectedWithdrawalForPaid) return;

    if (!transactionId.trim()) {
      toast.error("অনুগ্রহ করে ট্রানজেকশন আইডি (TrxID) লিখুন।");
      return;
    }

    try {
      const res = await apiClient.post(
        `/admin/affiliates/withdrawals/${selectedWithdrawalForPaid._id}/confirm-paid`,
        { transactionId: transactionId.trim(), paymentNotes: paidNotes }
      );
      if (res.data?.success) {
        toast.success("পেআউট সফলভাবে পরিশোধিত (Paid) হিসেবে রেকর্ড হয়েছে!");
        setSelectedWithdrawalForPaid(null);
        setTransactionId("");
        setPaidNotes("");
        await fetchWithdrawals();
        await fetchAffiliates();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "পরিশোধ নিশ্চিতকরণ ব্যর্থ হয়েছে।");
    }
  };

  const handleRejectWithdrawal = async (e) => {
    e.preventDefault();
    if (!selectedWithdrawalForReject) return;

    if (!withdrawalRejectReason.trim()) {
      toast.error("প্রত্যাখ্যানের কারণ উল্লেখ করুন।");
      return;
    }

    try {
      const res = await apiClient.post(
        `/admin/affiliates/withdrawals/${selectedWithdrawalForReject._id}/reject`,
        { rejectionReason: withdrawalRejectReason }
      );
      if (res.data?.success) {
        toast.success("উইথড্র রিকোয়েস্ট বাতিল করা হয়েছে এবং সংরক্ষিত ব্যালেন্স ফেরত দেওয়া হয়েছে।");
        setSelectedWithdrawalForReject(null);
        setWithdrawalRejectReason("");
        await fetchWithdrawals();
        await fetchAffiliates();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "বাতিলকরণ ব্যর্থ হয়েছে।");
    }
  };

  // Cost Cap calculation preview
  const currentTotalCost =
    Number(settings.defaultDiscountValue || 0) +
    Number(settings.defaultCommissionValue || 0);
  const isCapExceeded =
    currentTotalCost > Number(settings.maxMarketingCostPercent || 30);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              অ্যাফিলিয়েট প্রোগ্রাম ব্যবস্থাপনা
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                settings.isProgramEnabled
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {settings.isProgramEnabled ? "প্রোগ্রাম চালু আছে" : "প্রোগ্রাম বন্ধ আছে"}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            কুপন পলিসি, আবেদন অনুমোদন, পার্টনার অডিট ও উইথড্রয়াল ম্যানেজমেন্ট
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunReleaseJob}
            disabled={isRunningReleaseJob}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2 border border-slate-200 disabled:opacity-50"
            title="১৪ দিন অতিক্রম করা সেলসগুলো এভেইলেবল ব্যালেন্সে পাঠাতে চালান"
          >
            <Clock
              className={`w-3.5 h-3.5 ${isRunningReleaseJob ? "animate-spin text-indigo-600" : ""}`}
            />
            <span>১৪-দিনের হোল্ড রিলিজ জব চালান</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === "settings"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>গ্লোবাল সেটিংস ও পলিসি</span>
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === "applications"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>আবেদন অনুমোদন ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("affiliates")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === "affiliates"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>এফিলিয়েট ডিরেক্টরি ({affiliatesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("withdrawals")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === "withdrawals"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>উইথড্রয়াল কিউ ({withdrawals.length})</span>
        </button>
      </div>

      {/* TAB 1: Global Settings */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm max-w-4xl">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Toggle Program */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-sm font-bold text-slate-800">
                  অ্যাফিলিয়েট প্রোগ্রাম সক্রিয় রাখুন
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  বন্ধ থাকলে নতুন আবেদন ও অ্যাফিলিয়েট কুপন ব্যবহার সাময়িকভাবে বন্ধ থাকবে।
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.isProgramEnabled}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    isProgramEnabled: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            {/* Authoritative Cap Notice */}
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                isCapExceeded
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-indigo-50 border-indigo-200 text-indigo-900"
              }`}
            >
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-indigo-600" />
              <div>
                <p className="font-bold">
                  মার্কেটিং কস্ট ক্যাপ গার্ড: সর্বোচ্চ {settings.maxMarketingCostPercent || 30}%
                </p>
                <p className="mt-0.5 text-xs opacity-90 leading-relaxed">
                  কোম্পানির লাভজনকতা বজায় রাখতে গ্রাহক ডিসকাউন্ট + অ্যাফিলিয়েট কমিশনের যোগফল সর্বোচ্চ{" "}
                  {settings.maxMarketingCostPercent || 30}% হতে পারে। বর্তমানে মোট: {currentTotalCost}%।
                </p>
              </div>
            </div>

            {/* Rates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  ডিফল্ট গ্রাহক ডিসকাউন্ট (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.defaultDiscountValue}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultDiscountValue: Number(e.target.value),
                    }))
                  }
                  required
                  className="mt-1.5 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  কুপন দিয়ে গ্রাহক যে পরিমাণ ছাড় পাবেন
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  ডিফল্ট অ্যাফিলিয়েট কমিশন (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.defaultCommissionValue}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultCommissionValue: Number(e.target.value),
                    }))
                  }
                  required
                  className="mt-1.5 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  নেট পেইড মূল্যের ওপর কমিশন হার
                </span>
              </div>
            </div>

            {/* Hold Period & Milestone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  রিফান্ড হোল্ড পিরিয়ড (দিন)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.commissionHoldPeriodDays}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      commissionHoldPeriodDays: Number(e.target.value),
                    }))
                  }
                  required
                  className="mt-1.5 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  কমিশন রিলিজের পূর্ববর্তী সুরক্ষা সময় (ডিফল্ট ১৪ দিন)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  নূন্যতম উইথড্রয়াল (টাকা)
                </label>
                <input
                  type="number"
                  min="500"
                  value={(settings.defaultMinWithdrawalAmountMinor || 500000) / 100}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultMinWithdrawalAmountMinor: Number(e.target.value) * 100,
                    }))
                  }
                  required
                  className="mt-1.5 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ডিফল্ট ৳৫,০০০ টাকা (৫০,০০০ পয়সা)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  কোয়ালিফাইং সেলস টার্গেট
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.defaultActivationSalesCount || 3}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultActivationSalesCount: Number(e.target.value),
                    }))
                  }
                  required
                  className="mt-1.5 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  প্রথম উইথড্র করার পূর্বশর্ত সেল সংখ্যা (ডিফল্ট ৩)
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingSettings || isCapExceeded}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
              >
                {isSavingSettings ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>সেটিংস সংরক্ষণ করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Applications Queue */}
      {activeTab === "applications" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              অপেক্ষমান আবেদন তালিকা ({applications.length})
            </h3>
            <button
              onClick={fetchApplications}
              className="p-1.5 text-slate-500 hover:text-slate-800"
              title="রিফ্রেশ"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">আবেদনকারী</th>
                  <th className="py-3 px-4">যোগাযোগ</th>
                  <th className="py-3 px-4">পেশা</th>
                  <th className="py-3 px-4">ঠিকানা</th>
                  <th className="py-3 px-4">আবেদনের তারিখ</th>
                  <th className="py-3 px-4 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      কোনো অপেক্ষমান আবেদন নেই।
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {app.fullName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-700">
                          {app.phoneNumber}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {app.email}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {app.profession || "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {app.address || "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString("bn-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleApproveApp(app._id)}
                          disabled={isProcessingApp}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition-colors"
                        >
                          অনুমোদন
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApplication(app);
                            setIsRejectModalOpen(true);
                          }}
                          disabled={isProcessingApp}
                          className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs transition-colors"
                        >
                          প্রত্যাখ্যান
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Affiliates Directory */}
      {activeTab === "affiliates" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm space-y-4 p-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="নাম, ফোন বা কুপন দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAffiliates()}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700"
              >
                <option value="ALL">সকল স্ট্যাটাস</option>
                <option value="Approved">অনুমোদিত (Approved)</option>
                <option value="Pending">অপেক্ষমান (Pending)</option>
                <option value="Rejected">প্রত্যাখ্যাত (Rejected)</option>
                <option value="Suspended">স্থগিত (Suspended)</option>
              </select>

              <button
                onClick={fetchAffiliates}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                ফিল্টার
              </button>
            </div>
          </div>

          {/* Affiliates Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">অ্যাফিলিয়েট</th>
                  <th className="py-3 px-4">কুপন কোড</th>
                  <th className="py-3 px-4">রিভিউ স্ট্যাটাস</th>
                  <th className="py-3 px-4">কন্ট্রোল স্ট্যাটাস</th>
                  <th className="py-3 px-4">কোয়ালিফাইড সেলস</th>
                  <th className="py-3 px-4">এভেইলেবল ব্যালেন্স</th>
                  <th className="py-3 px-4">উত্তোলন সম্পন্ন</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {affiliatesList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      কোনো অ্যাফিলিয়েট পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  affiliatesList.map((aff) => (
                    <tr key={aff._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">
                          {aff.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {aff.phoneNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold text-[11px]">
                          {aff.couponCode}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            aff.reviewStatus === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : aff.reviewStatus === "Rejected"
                              ? "bg-pink-50 text-pink-700 border border-pink-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {aff.reviewStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={aff.accountControlStatus}
                          onChange={(e) =>
                            handleControlStatusChange(aff._id, e.target.value)
                          }
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-medium"
                        >
                          <option value="Enabled">Enabled</option>
                          <option value="Suspended">Suspended</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {aff.successfulQualifyingSalesCount || 0} / ৩
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600">
                        ৳{((aff.balance?.available || 0) / 100).toLocaleString("bn-BD")}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        ৳{((aff.lifetimeTotals?.totalWithdrawnMinor || 0) / 100).toLocaleString("bn-BD")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openCustomSettingsModal(aff)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                          title="কাস্টম পলিসি সেটিংস ওভাররাইড"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Withdrawals Queue */}
      {activeTab === "withdrawals" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {["ALL", "Pending", "Approved", "Processing", "Paid", "Rejected"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setWithdrawalFilter(status);
                      fetchWithdrawals();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      withdrawalFilter === status
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            <button
              onClick={fetchWithdrawals}
              className="p-1.5 text-slate-500 hover:text-slate-800"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">অ্যাফিলিয়েট</th>
                  <th className="py-3 px-4">পরিমাণ (টাকা)</th>
                  <th className="py-3 px-4">মাধ্যম</th>
                  <th className="py-3 px-4">অ্যাকাউন্ট বিবরণ</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      কোনো উইথড্রয়াল রিকোয়েস্ট পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((w) => (
                    <tr key={w._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(w.createdAt).toLocaleDateString("bn-BD", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">
                          {w.affiliateId?.fullName || "Affiliate"}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {w.affiliateId?.phoneNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800 text-sm">
                        ৳{(w.amountMinor / 100).toLocaleString("bn-BD")}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {w.paymentMethod}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {w.paymentDetails?.accountNumber ||
                          w.paymentDetails?.accountHolderName ||
                          "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            w.status === "Paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : w.status === "Approved" || w.status === "Processing"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : w.status === "Rejected"
                              ? "bg-pink-50 text-pink-700 border border-pink-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {w.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApproveWithdrawal(w._id)}
                              className="px-2.5 py-1 rounded bg-indigo-600 text-white font-medium text-[11px] hover:bg-indigo-500"
                            >
                              অনুমোদন
                            </button>
                            <button
                              onClick={() => {
                                setSelectedWithdrawalForReject(w);
                                setWithdrawalRejectReason("");
                              }}
                              className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 font-medium text-[11px] hover:bg-slate-300"
                            >
                              বাতিল
                            </button>
                          </>
                        )}

                        {w.status === "Approved" && (
                          <button
                            onClick={() => handleStartProcessingWithdrawal(w._id)}
                            className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[11px] hover:bg-blue-500"
                          >
                            প্রসেসিং শুরু
                          </button>
                        )}

                        {w.status === "Processing" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedWithdrawalForPaid(w);
                                setTransactionId("");
                                setPaidNotes("");
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-600 text-white font-medium text-[11px] hover:bg-emerald-500"
                            >
                              পেইড কনফার্ম
                            </button>
                            <button
                              onClick={() => {
                                setSelectedWithdrawalForReject(w);
                                setWithdrawalRejectReason("");
                              }}
                              className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 font-medium text-[11px] hover:bg-slate-300"
                            >
                              বাতিল ও রিফান্ড
                            </button>
                          </>
                        )}

                        {w.status === "Paid" && (
                          <span className="text-[11px] text-slate-500 font-mono">
                            Trx: {w.transactionId || "—"}
                          </span>
                        )}

                        {w.status === "Rejected" && (
                          <span className="text-[11px] text-pink-600">
                            {w.rejectionReason || "বাতিলকৃত"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Application Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-slate-800">
              আবেদন প্রত্যাখ্যানের কারণ
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              আবেদনকারী: {selectedApplication?.fullName} ({selectedApplication?.phoneNumber})
            </p>

            <form onSubmit={handleRejectApp} className="mt-4 space-y-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                placeholder="প্রত্যাখ্যানের সুনির্দিষ্ট কারণ লিখুন..."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isProcessingApp}
                  className="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  প্রত্যাখ্যান নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Override Settings Modal */}
      {selectedAffiliateForCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  কাস্টম পলিসি ওভাররাইড
                </h3>
                <p className="text-xs text-slate-500">
                  অ্যাফিলিয়েট: {selectedAffiliateForCustom.fullName} ({selectedAffiliateForCustom.couponCode})
                </p>
              </div>
              <button
                onClick={() => setSelectedAffiliateForCustom(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomSettings} className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="useCustomSettings"
                  checked={customSettingsForm.useCustomSettings}
                  onChange={(e) =>
                    setCustomSettingsForm((prev) => ({
                      ...prev,
                      useCustomSettings: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <label
                  htmlFor="useCustomSettings"
                  className="text-xs font-bold text-slate-700 cursor-pointer"
                >
                  এই অ্যাফিলিয়েটের জন্য কাস্টম রেট ও শর্ত কার্যকর করুন
                </label>
              </div>

              {customSettingsForm.useCustomSettings && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        কাস্টম ডিসকাউন্ট (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={customSettingsForm.discountValue}
                        onChange={(e) =>
                          setCustomSettingsForm((prev) => ({
                            ...prev,
                            discountValue: Number(e.target.value),
                          }))
                        }
                        className="mt-1 w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        কাস্টম কমিশন (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={customSettingsForm.commissionValue}
                        onChange={(e) =>
                          setCustomSettingsForm((prev) => ({
                            ...prev,
                            commissionValue: Number(e.target.value),
                          }))
                        }
                        className="mt-1 w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        নূন্যতম উইথড্র (টাকা)
                      </label>
                      <input
                        type="number"
                        min="500"
                        value={customSettingsForm.minWithdrawalTaka}
                        onChange={(e) =>
                          setCustomSettingsForm((prev) => ({
                            ...prev,
                            minWithdrawalTaka: Number(e.target.value),
                          }))
                        }
                        className="mt-1 w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        কোয়ালিফাইং সেলস
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={customSettingsForm.activationSalesCount}
                        onChange={(e) =>
                          setCustomSettingsForm((prev) => ({
                            ...prev,
                            activationSalesCount: Number(e.target.value),
                          }))
                        }
                        className="mt-1 w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAffiliateForCustom(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Paid Withdrawal Modal */}
      {selectedWithdrawalForPaid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-slate-800">
              উইথড্রয়াল পরিশোধ নিশ্চিতকরণ (Confirm Paid)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              পরিমাণ: ৳{(selectedWithdrawalForPaid.amountMinor / 100).toLocaleString("bn-BD")} | মাধ্যম: {selectedWithdrawalForPaid.paymentMethod}
            </p>

            <form onSubmit={handleConfirmPaidWithdrawal} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">
                  ট্রানজেকশন আইডি (TrxID) <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  placeholder="যেমন: BKG89102938"
                  className="mt-1 w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  অ্যাডমিন নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={paidNotes}
                  onChange={(e) => setPaidNotes(e.target.value)}
                  placeholder="যেমন: বিকাশে সফলভাবে ট্রান্সফার সম্পন্ন"
                  className="mt-1 w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedWithdrawalForPaid(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  পেইড সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Withdrawal Modal */}
      {selectedWithdrawalForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-slate-800">
              উইথড্রয়াল বাতিল ও রিফান্ড
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              বাতিল করলে সংরক্ষিত ৳{(selectedWithdrawalForReject.amountMinor / 100).toLocaleString("bn-BD")} টাকা পুনরায় অ্যাফিলিয়েটের এভেইলেবল ব্যালেন্সে যোগ হবে।
            </p>

            <form onSubmit={handleRejectWithdrawal} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">
                  বাতিলের কারণ <span className="text-pink-600">*</span>
                </label>
                <textarea
                  value={withdrawalRejectReason}
                  onChange={(e) => setWithdrawalRejectReason(e.target.value)}
                  required
                  rows={3}
                  placeholder="যেমন: অ্যাকাউন্ট নম্বর সঠিক নয়"
                  className="mt-1 w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedWithdrawalForReject(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  বাতিল ও ব্যালেন্স রিফান্ড করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
