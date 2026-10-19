import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  History,
  LogOut,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useAffiliateDashboard } from "./hook/useAffiliateDashboard";

export default function AffiliateDashboard() {
  const {
    profile,
    affiliate,
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
    handleLogout,
    copyCouponCode,
    copyReferralLink,
    handleWithdrawSubmit,
  } = useAffiliateDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm">
            অ্যাফিলিয়েট ড্যাশবোর্ড লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-white">
                Smart Proshno
              </span>
              <span className="text-[11px] ml-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                Partner Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">
                {affiliate?.fullName || profile?.name}
              </span>
              <span className="text-[11px] text-slate-400">
                {affiliate?.phoneNumber}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Status Notices (Note: Pending users are blocked at login, handled here if session persists or on future live state updates) */}
        {affiliate?.reviewStatus === "Pending" && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">
                আপনার আবেদনটি পর্যালোচনায় রয়েছে
              </p>
              <p className="mt-0.5 text-amber-300/90 leading-relaxed">
                অ্যাডমিন কর্তৃক আবেদন অনুমোদিত হলে আপনার কুপন কোড ও উইথড্রয়াল
                ফিচার সক্রিয় হবে।
              </p>
            </div>
          </div>
        )}

        {affiliate?.accountControlStatus === "Suspended" && (
          <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs sm:text-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-pink-200">
                আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে
              </p>
              <p className="mt-0.5 text-pink-300/90 leading-relaxed">
                {affiliate.suspensionReason ||
                  "সহায়তার জন্য অ্যাডমিন সাপোর্টের সাথে যোগাযোগ করুন।"}
              </p>
            </div>
          </div>
        )}

        {/* Milestone Card (3 Qualifying Sales) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/20 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>উইথড্রয়াল যোগ্যতা মাইলস্টোন</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                কোয়ালিফাইং সেলস অগ্রগতি:{" "}
                <span className="text-indigo-400">
                  {qualifyingCount} / {targetActivationSales}
                </span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                উইথড্র করার প্রাথমিক যোগ্যতা অর্জনের জন্য অন্তত{" "}
                {targetActivationSales}টি সফল সেল প্রয়োজন (১৪ দিনের রিফান্ড
                সুরক্ষা সময় পার হলে প্রতিটি সেল কোয়ালিফাইড হিসেবে গণ্য হয়)।
              </p>
            </div>

            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">অগ্রগতি</span>
                <span className="text-indigo-400">
                  {Math.min(
                    100,
                    Math.round((qualifyingCount / targetActivationSales) * 100),
                  )}
                  %
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (qualifyingCount / targetActivationSales) * 100)}%`,
                  }}
                />
              </div>
              {isQualifyingComplete ? (
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>অভিনন্দন! আপনি উইথড্রয়াল মাইলস্টোন পূর্ণ করেছেন।</span>
                </div>
              ) : (
                <div className="text-[11px] text-amber-400/90">
                  আরও {Math.max(0, targetActivationSales - qualifyingCount)}টি
                  সফল সেল প্রয়োজন।
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Available Balance */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                এভেইলেবল ব্যালেন্স
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                ৳{availableTaka.toLocaleString("bn-BD")}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                উইথড্র করার জন্য প্রস্তুত
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={!canRequestWithdrawal}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>উইথড্র রিকোয়েস্ট</span>
              </button>
            </div>
          </div>

          {/* Card 2: Pending Hold Balance */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                পেন্ডিং হোল্ড ব্যালেন্স
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                ৳{pendingTaka.toLocaleString("bn-BD")}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ১৪ দিনের রিফান্ড সুরক্ষা সময় চলমান
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              হোল্ড মেয়াদ শেষে স্বয়ংক্রিয় এভেইলেবল হবে
            </div>
          </div>

          {/* Card 3: Reserved In-Flight */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                প্রসেসিংয়ে থাকা ব্যালেন্স
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">
                ৳{reservedTaka.toLocaleString("bn-BD")}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                অনুমোদনাধীন উইথড্র রিকোয়েস্ট
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              অ্যাডমিন পেআউট কনফার্মের অপেক্ষায়
            </div>
          </div>

          {/* Card 4: Lifetime Withdrawn */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                সর্বমোট উইথড্রয়াল
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300">
                ৳{lifetimeWithdrawnTaka.toLocaleString("bn-BD")}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                সর্বমোট অর্জিত: ৳{lifetimeEarnedTaka.toLocaleString("bn-BD")}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              সফলভাবে পরিশোধিত ফান্ড
            </div>
          </div>
        </div>

        {/* Recovery Due Warning (if any) */}
        {recoveryDueTaka > 0 && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>
                পূর্বের রিফান্ডের কারণে আপনার ৳
                {recoveryDueTaka.toLocaleString("bn-BD")} বকেয়া রিকভারি ডিউ
                রয়েছে, যা ভবিষ্যতের কমিশন থেকে স্বয়ংক্রিয়ভাবে সমন্বয় হবে।
              </span>
            </div>
          </div>
        )}

        {/* Coupon Card & Share Box */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                আপনার অফিসিয়াল কুপন কোড
              </span>
              <div className="flex items-center gap-3">
                <div className="px-5 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 text-xl sm:text-2xl font-black text-white tracking-widest selection:bg-indigo-600">
                  {affiliate?.couponCode || "SPBAFFIL00"}
                </div>
                <button
                  onClick={copyCouponCode}
                  className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-transform active:scale-95"
                  title="কুপন কপি করুন"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                এই কুপন ব্যবহার করে যেকোনো নতুন গ্রাহক প্রথম সাবস্ক্রিপশনে পাবেন{" "}
                <span className="text-emerald-400 font-semibold">
                  {effectiveDiscountLabel}
                </span>{" "}
                এবং আপনি পাবেন{" "}
                <span className="text-indigo-400 font-semibold">
                  {effectiveCommissionLabel}
                </span>
                ।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={copyReferralLink}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>রেফারেল লিঙ্ক কপি করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("withdrawals")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "withdrawals"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>উইথড্রয়াল হিস্ট্রি ({withdrawals.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("sales")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "sales"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>রেফারেল ও সেলস ({sales.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("ledger")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "ledger"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <History className="w-4 h-4" />
              <span>আর্থিক লেজার / অডিট ({ledger.length})</span>
            </button>
          </div>

          {/* Tab 1: Withdrawals */}
          {activeTab === "withdrawals" && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">তারিখ</th>
                      <th className="py-3 px-4">পরিমাণ (টাকা)</th>
                      <th className="py-3 px-4">পদ্ধতি</th>
                      <th className="py-3 px-4">অ্যাকাউন্ট বিবরণ</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4">TrxID / নোট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-slate-500"
                        >
                          এখনো কোনো উইথড্রয়াল রিকোয়েস্ট করা হয়নি।
                        </td>
                      </tr>
                    ) : (
                      withdrawals.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3 px-4 text-slate-300">
                            {new Date(item.createdAt).toLocaleDateString(
                              "bn-BD",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            ৳
                            {(item.amountMinor !== undefined
                              ? item.amountMinor / 100
                              : Number(item.amountBDT || 0)
                            ).toLocaleString("bn-BD")}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-300">
                            {item.paymentMethod}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono">
                            {item.paymentDetails?.accountNumber ||
                              item.payoutDestinationSnapshot?.accountNumber ||
                              item.paymentDetails?.accountHolderName ||
                              "—"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                item.status === "Paid"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : item.status === "Approved" ||
                                      item.status === "Processing"
                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                    : item.status === "Rejected"
                                      ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {item.transactionId ||
                              item.payoutTransactionRef ||
                              item.rejectionReason ||
                              "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Referred Sales */}
          {activeTab === "sales" && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">তারিখ</th>
                      <th className="py-3 px-4">অর্ডার আইডি</th>
                      <th className="py-3 px-4">গ্রাহক (মাস্কড)</th>
                      <th className="py-3 px-4">প্যাকেজ মূল্য</th>
                      <th className="py-3 px-4">ছাড়</th>
                      <th className="py-3 px-4">পরিশোধিত</th>
                      <th className="py-3 px-4">আপনার কমিশন</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {sales.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-8 text-center text-slate-500"
                        >
                          এখনো কোনো রেফারেল সেল পাওয়া যায়নি। আপনার কুপন কোড
                          শেয়ার করুন!
                        </td>
                      </tr>
                    ) : (
                      sales.map((sale) => (
                        <tr
                          key={sale._id}
                          className="hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3 px-4 text-slate-300">
                            {new Date(sale.createdAt).toLocaleDateString(
                              "bn-BD",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400">
                            {sale.orderId}
                          </td>
                          <td className="py-3 px-4 text-slate-200">
                            <div>{sale.customerMaskedName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {sale.customerMaskedPhone}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            ৳
                            {(sale.originalPriceMinor !== undefined
                              ? sale.originalPriceMinor / 100
                              : Number(sale.originalPriceBDT || 0)
                            ).toLocaleString("bn-BD")}
                          </td>
                          <td className="py-3 px-4 text-emerald-400">
                            -৳
                            {(sale.discountMinor !== undefined
                              ? sale.discountMinor / 100
                              : Number(sale.discountBDT || 0)
                            ).toLocaleString("bn-BD")}
                          </td>
                          <td className="py-3 px-4 text-white font-medium">
                            ৳
                            {(sale.finalPaidMinor !== undefined
                              ? sale.finalPaidMinor / 100
                              : Number(sale.finalPaidBDT || 0)
                            ).toLocaleString("bn-BD")}
                          </td>
                          <td className="py-3 px-4 font-bold text-indigo-400">
                            ৳
                            {(sale.commissionMinor !== undefined
                              ? sale.commissionMinor / 100
                              : Number(sale.commissionBDT || 0)
                            ).toLocaleString("bn-BD")}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                sale.saleStatus === "Qualified"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : sale.saleStatus === "PendingHold"
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                              }`}
                            >
                              {sale.saleStatus === "PendingHold"
                                ? "১৪ দিন হোল্ড"
                                : sale.saleStatus === "Qualified"
                                  ? "কোয়ালিফাইড"
                                  : sale.saleStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Financial Ledger */}
          {activeTab === "ledger" && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">তারিখ</th>
                      <th className="py-3 px-4">ইভেন্ট</th>
                      <th className="py-3 px-4">ব্যালেন্স বাকেট</th>
                      <th className="py-3 px-4">লেনদেন</th>
                      <th className="py-3 px-4">চলতি ব্যালেন্স</th>
                      <th className="py-3 px-4">বিবরণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {ledger.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-slate-500"
                        >
                          এখনো কোনো আর্থিক লেনদেন রেকর্ড হয়নি।
                        </td>
                      </tr>
                    ) : (
                      ledger.map((entry) => (
                        <tr
                          key={entry._id}
                          className="hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3 px-4 text-slate-300">
                            {new Date(entry.createdAt).toLocaleDateString(
                              "bn-BD",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-300">
                            {entry.eventType}
                          </td>
                          <td className="py-3 px-4 text-slate-400 uppercase text-[10px]">
                            {entry.bucket}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-bold flex items-center gap-0.5 ${
                                entry.direction === "CREDIT"
                                  ? "text-emerald-400"
                                  : "text-pink-400"
                              }`}
                            >
                              {entry.direction === "CREDIT" ? (
                                <ArrowDownRight className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              )}
                              ৳
                              {(entry.amountMinor !== undefined
                                ? entry.amountMinor / 100
                                : Number(entry.amountBDT || 0)
                              ).toLocaleString("bn-BD")}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white font-mono">
                            ৳
                            {(entry.balanceAfterMinor !== undefined
                              ? entry.balanceAfterMinor / 100
                              : Number(entry.balanceAfterBDT || 0)
                            ).toLocaleString("bn-BD")}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {entry.description}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Withdrawal Request Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  উইথড্র রিকোয়েস্ট
                </h3>
                <p className="text-xs text-slate-400">
                  নূন্যতম উত্তোলনের পরিমাণ ৳
                  {minWithdrawTaka.toLocaleString("bn-BD")} টাকা
                </p>
              </div>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  উইথড্রয়াল পরিমাণ (টাকা)
                </label>
                <div className="mt-1 relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                    ৳
                  </div>
                  <input
                    type="number"
                    min={minWithdrawTaka}
                    max={availableTaka}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    placeholder={`সর্বনিম্ন ৳${minWithdrawTaka}`}
                    className="block w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>
                    এভেইলেবল ব্যালেন্স: ৳{availableTaka.toLocaleString("bn-BD")}
                  </span>
                  {Number(withdrawAmount) > 0 && (
                    <span className="text-indigo-400 font-medium">
                      অবশিষ্ট থাকবে: ৳
                      {Math.max(
                        0,
                        availableTaka - Number(withdrawAmount),
                      ).toLocaleString("bn-BD")}
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  পেমেন্ট নেওয়ার মাধ্যম
                </label>
                <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["bKash", "Nagad", "Rocket", "Bank Transfer"].map(
                    (method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPayoutMethod(method)}
                        className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-colors ${
                          payoutMethod === method
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20"
                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        {method}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Method Details */}
              {payoutMethod !== "Bank Transfer" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {payoutMethod} মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    value={payoutDetails.accountNumber}
                    onChange={(e) =>
                      setPayoutDetails((prev) => ({
                        ...prev,
                        accountNumber: e.target.value,
                      }))
                    }
                    required
                    placeholder="01XXXXXXXXX"
                    className="mt-1 block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400">
                        ব্যাংকের নাম
                      </label>
                      <input
                        type="text"
                        value={payoutDetails.bankName}
                        onChange={(e) =>
                          setPayoutDetails((prev) => ({
                            ...prev,
                            bankName: e.target.value,
                          }))
                        }
                        required
                        placeholder="যেমন: Islami Bank"
                        className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">
                        শাখা (Branch)
                      </label>
                      <input
                        type="text"
                        value={payoutDetails.branchName}
                        onChange={(e) =>
                          setPayoutDetails((prev) => ({
                            ...prev,
                            branchName: e.target.value,
                          }))
                        }
                        placeholder="যেমন: Mirpur Branch"
                        className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400">
                      অ্যাকাউন্ট নম্বর
                    </label>
                    <input
                      type="text"
                      value={payoutDetails.accountNumber}
                      onChange={(e) =>
                        setPayoutDetails((prev) => ({
                          ...prev,
                          accountNumber: e.target.value,
                        }))
                      }
                      required
                      placeholder="ব্যাংক অ্যাকাউন্ট নম্বর"
                      className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400">
                      অ্যাকাউন্টধারীর নাম
                    </label>
                    <input
                      type="text"
                      value={payoutDetails.accountHolderName}
                      onChange={(e) =>
                        setPayoutDetails((prev) => ({
                          ...prev,
                          accountHolderName: e.target.value,
                        }))
                      }
                      required
                      placeholder="অ্যাকাউন্টে উল্লেখিত নাম"
                      className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingWithdraw}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmittingWithdraw ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>প্রসেস করা হচ্ছে...</span>
                    </>
                  ) : (
                    <span>উইথড্র রিকোয়েস্ট নিশ্চিত করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
