import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useAdminAffiliates = () => {
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
  const [activeControlDropdownAffId, setActiveControlDropdownAffId] =
    useState(null);
  const [selectedAffiliateForCustom, setSelectedAffiliateForCustom] =
    useState(null);
  const [statusChangeModal, setStatusChangeModal] = useState({
    isOpen: false,
    affiliate: null,
    newStatus: "Suspended",
    reason: "",
    isSubmitting: false,
  });
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
  const [selectedWithdrawalForPaid, setSelectedWithdrawalForPaid] =
    useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [paidNotes, setPaidNotes] = useState("");
  const [selectedWithdrawalForReject, setSelectedWithdrawalForReject] =
    useState(null);
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
  const fetchAffiliates = async (overrideStatus, overrideSearch) => {
    try {
      const activeStatus =
        overrideStatus !== undefined ? overrideStatus : statusFilter;
      const activeSearch =
        overrideSearch !== undefined ? overrideSearch : searchTerm;
      const res = await apiClient.get("/admin/affiliates/list", {
        params: { search: activeSearch, status: activeStatus },
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();
    fetchApplications();
    fetchAffiliates();
    fetchWithdrawals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();

    const discount = Number(settings.defaultDiscountValue);
    const commission = Number(settings.defaultCommissionValue);
    const cap = Number(settings.maxMarketingCostPercent || 30);

    if (discount + commission > cap) {
      toast.error(
        "ডিসকাউন্ট (" + discount + "%) এবং কমিশন (" + commission + "%)-এর যোগফল অনুমোদিত ক্যাপ (" + cap + "%) অতিক্রম করেছে!"
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
    if (
      !window.confirm(
        "আপনি কি নিশ্চিতভাবে এই আবেদনটি অনুমোদন করতে চান? এটি একটি ইউনিক কুপন কোড জেনারেট করবে এবং এসএমএস পাঠাবে।"
      )
    ) {
      return;
    }

    setIsProcessingApp(true);
    try {
      const res = await apiClient.post(
        "/admin/affiliates/applications/" + appId + "/approve"
      );
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
        "/admin/affiliates/applications/" + selectedApplication._id + "/reject",
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

  // Handle Affiliate Account Control Status Dropdown with Custom Modal
  const handleControlStatusSelect = (aff, newStatus) => {
    if (newStatus === aff.accountControlStatus) return;

    if (newStatus === "Suspended" || newStatus === "Disabled") {
      setStatusChangeModal({
        isOpen: true,
        affiliate: aff,
        newStatus,
        reason: "",
        isSubmitting: false,
      });
    } else {
      executeControlStatusChange(aff._id, "Enabled", "");
    }
  };

  const executeControlStatusChange = async (
    affiliateId,
    newStatus,
    reason = ""
  ) => {
    if (!affiliateId) return;
    try {
      const res = await apiClient.patch(
        "/admin/affiliates/" + affiliateId + "/control-status",
        { accountControlStatus: newStatus, reason }
      );
      if (res.data?.success) {
        toast.success("অ্যাকাউন্ট স্ট্যাটাস সফলভাবে '" + newStatus + "' করা হয়েছে।");
        setStatusChangeModal({
          isOpen: false,
          affiliate: null,
          newStatus: "Suspended",
          reason: "",
          isSubmitting: false,
        });
        await fetchAffiliates();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।"
      );
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
        "কাস্টম ডিসকাউন্ট (" + discount + "%) ও কমিশনের (" + commission + "%) যোগফল ক্যাপ (" + cap + "%) এর বেশি হতে পারবে না!"
      );
      return;
    }

    try {
      const res = await apiClient.put(
        "/admin/affiliates/" + selectedAffiliateForCustom._id + "/custom-settings",
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
      toast.error(
        err.response?.data?.error || "কাস্টম সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।"
      );
    }
  };

  // Withdrawal Transitions
  const handleApproveWithdrawal = async (id) => {
    try {
      const res = await apiClient.post(
        "/admin/affiliates/withdrawals/" + id + "/approve"
      );
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
        "/admin/affiliates/withdrawals/" + id + "/start-processing"
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
        "/admin/affiliates/withdrawals/" + selectedWithdrawalForPaid._id + "/confirm-paid",
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
      toast.error(
        err.response?.data?.error || "পরিশোধ নিশ্চিতকরণ ব্যর্থ হয়েছে।"
      );
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
        "/admin/affiliates/withdrawals/" + selectedWithdrawalForReject._id + "/reject",
        { rejectionReason: withdrawalRejectReason }
      );
      if (res.data?.success) {
        toast.success(
          "উইথড্র রিকোয়েস্ট বাতিল করা হয়েছে এবং সংরক্ষিত ব্যালেন্স ফেরত দেওয়া হয়েছে।"
        );
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

  return {
    activeTab,
    setActiveTab,
    isLoading,
    setIsLoading,
    settings,
    setSettings,
    isSavingSettings,
    isRunningReleaseJob,
    applications,
    isRejectModalOpen,
    setIsRejectModalOpen,
    selectedApplication,
    setSelectedApplication,
    rejectionReason,
    setRejectionReason,
    isProcessingApp,
    affiliatesList,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    activeControlDropdownAffId,
    setActiveControlDropdownAffId,
    selectedAffiliateForCustom,
    setSelectedAffiliateForCustom,
    statusChangeModal,
    setStatusChangeModal,
    customSettingsForm,
    setCustomSettingsForm,
    withdrawals,
    withdrawalFilter,
    setWithdrawalFilter,
    selectedWithdrawalForPaid,
    setSelectedWithdrawalForPaid,
    transactionId,
    setTransactionId,
    paidNotes,
    setPaidNotes,
    selectedWithdrawalForReject,
    setSelectedWithdrawalForReject,
    withdrawalRejectReason,
    setWithdrawalRejectReason,
    currentTotalCost,
    isCapExceeded,
    fetchSettings,
    fetchApplications,
    fetchAffiliates,
    fetchWithdrawals,
    handleSaveSettings,
    handleRunReleaseJob,
    handleApproveApp,
    handleRejectApp,
    handleControlStatusSelect,
    executeControlStatusChange,
    openCustomSettingsModal,
    handleSaveCustomSettings,
    handleApproveWithdrawal,
    handleStartProcessingWithdrawal,
    handleConfirmPaidWithdrawal,
    handleRejectWithdrawal,
  };
};
