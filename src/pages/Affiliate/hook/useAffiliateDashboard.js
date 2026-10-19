import { useUserContext } from "@/context/UserContext";
import apiClient, { setAccessToken } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAffiliateDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useUserContext();

  // Core Data States
  const [profile, setProfile] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState("withdrawals"); // 'withdrawals', 'sales', 'ledger'

  // Withdrawal Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("bKash");
  const [payoutDetails, setPayoutDetails] = useState({
    accountNumber: "",
    accountType: "Personal",
    bankName: "",
    branchName: "",
    routingNumber: "",
    accountHolderName: "",
  });
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Load Me
      const meRes = await apiClient.get("/affiliate/me");
      if (meRes.data?.user && meRes.data?.affiliate) {
        setProfile(meRes.data.user);
        setAffiliate(meRes.data.affiliate);
      }

      // 2. Load Summary
      try {
        const sumRes = await apiClient.get("/affiliate/dashboard");
        if (sumRes.data?.affiliate) {
          setAffiliate((prev) => ({ ...prev, ...sumRes.data.affiliate }));
        }
        if (sumRes.data?.summary) {
          setSummary(sumRes.data.summary);
        }
      } catch (sumErr) {
        console.warn("Summary fetch error:", sumErr);
      }

      // 3. Load Withdrawals
      try {
        const withRes = await apiClient.get("/affiliate/withdrawals");
        if (withRes.data?.withdrawals) {
          setWithdrawals(withRes.data.withdrawals);
        }
      } catch (withErr) {
        console.warn("Withdrawals fetch error:", withErr);
      }

      // 4. Load Sales
      try {
        const salesRes = await apiClient.get("/affiliate/sales");
        if (salesRes.data?.sales) {
          setSales(salesRes.data.sales);
        }
      } catch (salesErr) {
        console.warn("Sales fetch error:", salesErr);
      }

      // 5. Load Ledger
      try {
        const ledRes = await apiClient.get("/affiliate/ledger");
        if (ledRes.data?.ledger) {
          setLedger(ledRes.data.ledger);
        }
      } catch (ledErr) {
        console.warn("Ledger fetch error:", ledErr);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      if (err.response?.status === 401) {
        toast.error("সেশন মেয়াদোত্তীর্ণ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।");
        navigate("/affiliate/login", { replace: true });
      } else {
        toast.error("ড্যাশবোর্ড তথ্য লোড করতে সমস্যা হয়েছে।");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post("/affiliate/logout");
    } catch (err) {
      console.error("Affiliate server logout error:", err);
    }

    try {
      if (logout) {
        await logout();
      }
    } catch (err) {
      console.error("UserContext logout error:", err);
    } finally {
      setAccessToken(null);
      toast.info("অ্যাফিলিয়েট ড্যাশবোর্ড থেকে সফলভাবে লগআউট করা হয়েছে।");
      navigate("/affiliate/login", { replace: true });
    }
  };

  const copyCouponCode = () => {
    if (!affiliate?.couponCode) return;
    navigator.clipboard.writeText(affiliate.couponCode);
    toast.success("কুপন কোড " + affiliate.couponCode + " কপি করা হয়েছে!");
  };

  const copyReferralLink = () => {
    if (!affiliate?.couponCode) return;
    const url = window.location.origin + "/?coupon=" + affiliate.couponCode;
    navigator.clipboard.writeText(url);
    toast.success("রেফারেল লিঙ্ক কপি করা হয়েছে!");
  };

  // Withdrawal Validation Helpers
  const targetActivationSales =
    affiliate?.activationSalesCount ||
    summary?.config?.activationSalesCount ||
    3;
  const qualifyingCount = affiliate?.successfulQualifyingSalesCount || 0;
  const isQualifyingComplete = qualifyingCount >= targetActivationSales;
  const availableTaka = (affiliate?.balance?.available || 0) / 100;
  const pendingTaka = (affiliate?.balance?.pending || 0) / 100;
  const reservedTaka = (affiliate?.balance?.reserved || 0) / 100;
  const recoveryDueTaka = (affiliate?.balance?.recoveryDue || 0) / 100;
  const lifetimeWithdrawnTaka =
    (affiliate?.lifetimeTotals?.totalWithdrawnMinor || 0) / 100;
  const lifetimeEarnedTaka =
    (affiliate?.lifetimeTotals?.totalEarnedMinor || 0) / 100;

  const minWithdrawTaka = affiliate?.balances?.minWithdrawalBDT
    ? Number(affiliate.balances.minWithdrawalBDT)
    : ((affiliate?.useCustomSettings
        ? affiliate?.customSettings?.minWithdrawalAmountMinor
        : summary?.config?.minWithdrawalAmountMinor) || 500000) / 100;

  // Dynamic discount/commission labels from backend config
  const effectiveDiscount = affiliate?.effectiveDiscount || summary?.config?.effectiveDiscount || summary?.affiliate?.effectiveDiscount || { type: "Percentage", value: 10 };
  const effectiveCommission = affiliate?.effectiveCommission || summary?.config?.effectiveCommission || summary?.affiliate?.effectiveCommission || { type: "Percentage", value: 20 };
  const effectiveDiscountLabel = effectiveDiscount.type === "Percentage"
    ? effectiveDiscount.value + "% ছাড়"
    : "৳" + (effectiveDiscount.value / 100) + " ছাড়";
  const effectiveCommissionLabel = effectiveCommission.type === "Percentage"
    ? effectiveCommission.value + "% কমিশন"
    : "৳" + (effectiveCommission.value / 100) + " কমিশন";

  const canRequestWithdrawal =
    isQualifyingComplete && availableTaka >= minWithdrawTaka;

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);

    if (!amountNum || amountNum < minWithdrawTaka) {
      toast.error(
        "নূন্যতম উইথড্রয়াল অ্যামাউন্ট ৳" + minWithdrawTaka.toLocaleString("bn-BD") + " টাকা।"
      );
      return;
    }

    if (amountNum > availableTaka) {
      toast.error(
        "আপনার বর্তমান এভেইলেবল ব্যালেন্সের বেশি উইথড্র করা সম্ভব নয়।"
      );
      return;
    }

    if (!payoutDetails.accountNumber.trim()) {
      toast.error("সঠিক অ্যাকাউন্ট নম্বর প্রদান করুন।");
      return;
    }

    setIsSubmittingWithdraw(true);
    try {
      const response = await apiClient.post("/affiliate/withdrawals", {
        amount: amountNum,
        paymentMethod: payoutMethod,
        paymentDetails: payoutDetails,
      });

      if (response.data?.success) {
        toast.success(
          response.data.message || "উইথড্র রিকোয়েস্ট সফলভাবে জমা হয়েছে!"
        );
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        await loadDashboardData();
      }
    } catch (err) {
      console.error("Withdraw error:", err);
      toast.error(
        err.response?.data?.error ||
          "উইথড্র রিকোয়েস্ট প্রসেস করতে সমস্যা হয়েছে।"
      );
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  return {
    profile,
    affiliate,
    summary,
    sales,
    withdrawals,
    ledger,
    isLoading,
    activeTab,
    setActiveTab,
    showWithdrawModal,
    setShowWithdrawModal,
    withdrawAmount,
    setWithdrawAmount,
    payoutMethod,
    setPayoutMethod,
    payoutDetails,
    setPayoutDetails,
    isSubmittingWithdraw,
    targetActivationSales,
    qualifyingCount,
    isQualifyingComplete,
    availableTaka,
    pendingTaka,
    reservedTaka,
    recoveryDueTaka,
    lifetimeWithdrawnTaka,
    lifetimeEarnedTaka,
    minWithdrawTaka,
    canRequestWithdrawal,
    effectiveDiscountLabel,
    effectiveCommissionLabel,
    loadDashboardData,
    handleLogout,
    copyCouponCode,
    copyReferralLink,
    handleWithdrawSubmit,
  };
};
