import { ModalCancelButton, ModalSubmitButton } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  Loader2,
  PauseCircle,
  RefreshCw,
  Save,
  Search,
  Send,
  ShieldCheck,
  Sliders,
  Sparkles,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAdminAffiliates } from "./hook/useAdminAffiliates";

export default function AdminAffiliates() {
  const {
    activeTab,
    setActiveTab,
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
  } = useAdminAffiliates();

  const STATUS_FILTER_OPTIONS = [
    { value: "ALL", label: "সকল স্ট্যাটাস", dot: "bg-slate-400" },
    { value: "Approved", label: "অনুমোদিত (Approved)", dot: "bg-emerald-500" },
    { value: "Pending", label: "অপেক্ষমান (Pending)", dot: "bg-amber-500" },
    { value: "Rejected", label: "প্রত্যাখ্যাত (Rejected)", dot: "bg-rose-500" },
    { value: "Suspended", label: "স্থগিত (Suspended)", dot: "bg-purple-500" },
  ];

  const AFFILIATE_TABS = [
    { id: "settings", label: "গ্লোবাল সেটিংস ও পলিসি", icon: Sliders },
    {
      id: "applications",
      label: "আবেদন অনুমোদন",
      icon: UserCheck,
      badge: applications.length,
    },
    {
      id: "affiliates",
      label: "এফিলিয়েট ডিরেক্টরি",
      icon: Users,
      badge: affiliatesList.length,
    },
    {
      id: "withdrawals",
      label: "উইথড্রয়াল কিউ",
      icon: Send,
      badge: withdrawals.length,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2 font-sans">
              <Sparkles className="size-6 text-primary" />
              <span>অ্যাফিলিয়েট প্রোগ্রাম ব্যবস্থাপনা</span>
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                settings.isProgramEnabled
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {settings.isProgramEnabled
                ? "প্রোগ্রাম চালু আছে"
                : "প্রোগ্রাম বন্ধ আছে"}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-bengali">
            কুপন পলিসি, আবেদন অনুমোদন, পার্টনার অডিট ও উইথড্রয়াল ম্যানেজমেন্ট
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunReleaseJob}
            disabled={isRunningReleaseJob}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 border border-slate-200 shadow-sm disabled:opacity-50 cursor-pointer"
            title="১৪ দিন অতিক্রম করা সেলসগুলো এভেইলেবল ব্যালেন্সে পাঠাতে চালান"
          >
            <Clock
              className={`w-4 h-4 ${isRunningReleaseJob ? "animate-spin text-primary" : "text-slate-500"}`}
            />
            <span>১৪-দিনের হোল্ড রিলিজ জব চালান</span>
          </button>
        </div>
      </div>

      {/* Main Tabs List (Modern spring animated pill tabs) */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-black/[0.02] border border-black/[0.05] rounded-2xl backdrop-blur-sm">
        {AFFILIATE_TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer select-none ${
                isActive ? "text-white" : "text-slate-600 hover:bg-black/[0.03]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="affiliateActiveTabBackground"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-700 rounded-xl -z-10 shadow-md shadow-primary/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <IconComponent className="size-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`relative z-10 ml-1.5 px-2 py-0.5 text-xs rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Global Settings */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm max-w-4xl">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Toggle Program */}
            <div
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  isProgramEnabled: !prev.isProgramEnabled,
                }))
              }
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer select-none group ${
                settings.isProgramEnabled
                  ? "bg-primary/[0.04] border-primary/30 shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <label className="text-sm font-bold text-slate-800 cursor-pointer">
                  অ্যাফিলিয়েট প্রোগ্রাম সক্রিয় রাখুন
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  বন্ধ থাকলে নতুন আবেদন ও অ্যাফিলিয়েট কুপন ব্যবহার সাময়িকভাবে
                  বন্ধ থাকবে।
                </p>
              </div>
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                  settings.isProgramEnabled
                    ? "bg-primary shadow-sm shadow-primary/30"
                    : "bg-slate-200"
                }`}
              >
                <motion.span
                  animate={{
                    x: settings.isProgramEnabled ? 22 : 2,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="inline-block h-4 w-4 rounded-full bg-white shadow-md"
                />
              </div>
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
                  মার্কেটিং কস্ট ক্যাপ গার্ড: সর্বোচ্চ{" "}
                  {settings.maxMarketingCostPercent || 30}%
                </p>
                <p className="mt-0.5 text-xs opacity-90 leading-relaxed">
                  কোম্পানির লাভজনকতা বজায় রাখতে গ্রাহক ডিসকাউন্ট + অ্যাফিলিয়েট
                  কমিশনের যোগফল সর্বোচ্চ{" "}
                  {settings.maxMarketingCostPercent || 30}% হতে পারে। বর্তমানে
                  মোট: {currentTotalCost}%।
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
                  value={
                    (settings.defaultMinWithdrawalAmountMinor || 500000) / 100
                  }
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultMinWithdrawalAmountMinor:
                        Number(e.target.value) * 100,
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 transition-all shadow-sm cursor-pointer min-w-[170px] group"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${
                          STATUS_FILTER_OPTIONS.find(
                            (o) => o.value === statusFilter,
                          )?.dot || "bg-slate-400"
                        }`}
                      />
                      <span>
                        {STATUS_FILTER_OPTIONS.find(
                          (o) => o.value === statusFilter,
                        )?.label || "সকল স্ট্যাটাস"}
                      </span>
                    </span>
                    <ChevronDown className="size-4 text-slate-400 transition-transform duration-200 group-hover:text-slate-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[190px] bg-white border border-slate-100 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]"
                >
                  {STATUS_FILTER_OPTIONS.map((opt) => {
                    const isSelected = statusFilter === opt.value;
                    return (
                      <DropdownMenuItem
                        key={opt.value}
                        onSelect={() => {
                          setStatusFilter(opt.value);
                          fetchAffiliates(opt.value);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-between cursor-pointer focus:bg-primary/5 focus:text-primary hover:bg-slate-50/80 ${
                          isSelected
                            ? "bg-primary/5 text-primary font-bold"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`size-1.5 rounded-full ${opt.dot}`}
                          />
                          {opt.label}
                        </span>
                        {isSelected && (
                          <span className="size-1.5 rounded-full bg-primary" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                type="button"
                onClick={() => fetchAffiliates()}
                className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Filter className="size-3.5" />
                <span>ফিল্টার</span>
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
                        <DropdownMenu
                          open={activeControlDropdownAffId === aff._id}
                          onOpenChange={(open) =>
                            setActiveControlDropdownAffId(open ? aff._id : null)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-slate-700 transition-all duration-200 ease-out cursor-pointer min-w-[115px] group"
                            >
                              <span className="flex items-center gap-1.5">
                                <span
                                  className={`size-1.5 rounded-full transition-all duration-300 group-hover:scale-125 ${
                                    aff.accountControlStatus === "Enabled"
                                      ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                                      : aff.accountControlStatus === "Suspended"
                                        ? "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                                        : "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]"
                                  }`}
                                />
                                <span
                                  className={
                                    aff.accountControlStatus === "Enabled"
                                      ? "text-emerald-700 font-bold"
                                      : aff.accountControlStatus === "Suspended"
                                        ? "text-amber-700 font-bold"
                                        : "text-rose-700 font-bold"
                                  }
                                >
                                  {aff.accountControlStatus}
                                </span>
                              </span>
                              <ChevronDown
                                className={`size-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${
                                  activeControlDropdownAffId === aff._id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="w-[145px] bg-white border border-slate-100 rounded-xl shadow-xl p-1 space-y-0.5 z-[100]"
                          >
                            {[
                              {
                                key: "Enabled",
                                label: "Enabled",
                                dot: "bg-emerald-500",
                                text: "text-emerald-700",
                              },
                              {
                                key: "Suspended",
                                label: "Suspended",
                                dot: "bg-amber-500",
                                text: "text-amber-700",
                              },
                              {
                                key: "Disabled",
                                label: "Disabled",
                                dot: "bg-rose-500",
                                text: "text-rose-700",
                              },
                            ].map((opt) => {
                              const isSelected =
                                aff.accountControlStatus === opt.key;
                              return (
                                <DropdownMenuItem
                                  key={opt.key}
                                  onSelect={() =>
                                    handleControlStatusSelect(aff, opt.key)
                                  }
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-between cursor-pointer focus:bg-slate-50 hover:bg-slate-50 ${
                                    isSelected
                                      ? "bg-slate-100/80 font-bold"
                                      : "text-slate-700"
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span
                                      className={`size-1.5 rounded-full ${opt.dot}`}
                                    />
                                    <span className={opt.text}>
                                      {opt.label}
                                    </span>
                                  </span>
                                  {isSelected && (
                                    <span className="size-1.5 rounded-full bg-slate-900" />
                                  )}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {aff.successfulQualifyingSalesCount || 0} / ৩
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600">
                        ৳
                        {((aff.balance?.available || 0) / 100).toLocaleString(
                          "bn-BD",
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        ৳
                        {(
                          (aff.lifetimeTotals?.totalWithdrawnMinor || 0) / 100
                        ).toLocaleString("bn-BD")}
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
              {[
                "ALL",
                "Pending",
                "Approved",
                "Processing",
                "Paid",
                "Rejected",
              ].map((status) => (
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
              ))}
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
                              : w.status === "Approved" ||
                                  w.status === "Processing"
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
                            onClick={() =>
                              handleStartProcessingWithdrawal(w._id)
                            }
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
      <Dialog
        open={isRejectModalOpen}
        onOpenChange={(open) => {
          if (!open && !isProcessingApp) setIsRejectModalOpen(false);
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={!isProcessingApp}
          className="max-w-lg p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative"
        >
          <form
            onSubmit={handleRejectApp}
            className="flex flex-col h-full max-h-[85vh]"
          >
            <DialogHeader className="bg-transparent px-6 pt-6 pb-5 border-b border-slate-200/50 relative flex flex-col space-y-0 mb-0 text-left">
              <div className="flex items-start gap-4 pr-8">
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl shrink-0 mt-0.5 shadow-sm shadow-rose-500/5">
                  <XCircle className="size-5" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="font-bold text-slate-800 text-[17px] tracking-tight leading-snug">
                    আবেদন প্রত্যাখ্যানের কারণ
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-[13px] font-normal leading-relaxed">
                    আবেদনকারী:{" "}
                    <span className="font-semibold text-slate-700">
                      {selectedApplication?.fullName}
                    </span>{" "}
                    ({selectedApplication?.phoneNumber})
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  প্রত্যাখ্যানের সুনির্দিষ্ট কারণ{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                  rows={3}
                  disabled={isProcessingApp}
                  placeholder="আবেদন অসম্পূর্ণ বা নীতিমালার সাথে সাংঘর্ষিক হওয়ার সুনির্দিষ্ট কারণ লিখুন..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-xs text-slate-700 font-medium transition-all shadow-sm resize-none"
                />
              </div>
            </div>

            <DialogFooter className="bg-transparent px-6 py-3.5 border-t border-slate-200/50 flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-0">
              <DialogClose asChild>
                <ModalCancelButton disabled={isProcessingApp}>
                  বাতিল করুন
                </ModalCancelButton>
              </DialogClose>
              <ModalSubmitButton
                type="submit"
                disabled={isProcessingApp}
                className="!bg-rose-600 hover:!bg-rose-700 !shadow-rose-600/20"
              >
                {isProcessingApp ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    প্রক্রিয়াধীন...
                  </>
                ) : (
                  "প্রত্যাখ্যান নিশ্চিত করুন"
                )}
              </ModalSubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Custom Override Settings Modal */}
      <Dialog
        open={!!selectedAffiliateForCustom}
        onOpenChange={(open) => {
          if (!open) setSelectedAffiliateForCustom(null);
        }}
      >
        <DialogContent
          from="top"
          className="max-w-lg p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative"
        >
          <form
            onSubmit={handleSaveCustomSettings}
            className="flex flex-col h-full max-h-[85vh]"
          >
            <DialogHeader className="bg-transparent px-6 pt-6 pb-5 border-b border-slate-200/50 relative flex flex-col space-y-0 mb-0 text-left">
              <div className="flex items-start gap-4 pr-8">
                <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-xl shrink-0 mt-0.5 shadow-sm shadow-primary/5">
                  <Sliders className="size-5" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="font-bold text-slate-800 text-[17px] tracking-tight leading-snug">
                    কাস্টম পলিসি ও শর্তাবলী নির্ধারণ
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-[13px] font-normal leading-relaxed">
                    অ্যাফিলিয়েট:{" "}
                    <span className="font-semibold text-slate-700">
                      {selectedAffiliateForCustom?.fullName}
                    </span>{" "}
                    ({selectedAffiliateForCustom?.couponCode})
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div
                onClick={() =>
                  setCustomSettingsForm((prev) => ({
                    ...prev,
                    useCustomSettings: !prev.useCustomSettings,
                  }))
                }
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer select-none group ${
                  customSettingsForm.useCustomSettings
                    ? "bg-primary/[0.04] border-primary/30 shadow-sm"
                    : "bg-slate-50/80 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="pr-4">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block cursor-pointer">
                    ব্যক্তিগত কাস্টম পলিসি সক্রিয় করুন
                  </span>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    সক্রিয় করলে গ্লোবাল পলিসির পরিবর্তে এই নির্দিষ্ট মানগুলো
                    প্রযোজ্য হবে
                  </p>
                </div>
                <div
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                    customSettingsForm.useCustomSettings
                      ? "bg-primary shadow-sm shadow-primary/30"
                      : "bg-slate-200"
                  }`}
                >
                  <motion.span
                    animate={{
                      x: customSettingsForm.useCustomSettings ? 22 : 2,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="inline-block h-4 w-4 rounded-full bg-white shadow-md"
                  />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {customSettingsForm.useCustomSettings && (
                  <motion.div
                    key="custom-settings-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      opacity: { duration: 0.2 },
                      height: {
                        duration: 0.28,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      },
                    }}
                    className="overflow-hidden space-y-4 pt-1"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          কাস্টম ডিসকাউন্ট (%)
                        </label>
                        <Input
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
                          className="px-4 py-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-50/50 focus-visible:ring-offset-0 h-11 transition-all shadow-sm text-slate-700 text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          কাস্টম কমিশন (%)
                        </label>
                        <Input
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
                          className="px-4 py-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-50/50 focus-visible:ring-offset-0 h-11 transition-all shadow-sm text-slate-700 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          সর্বনিম্ন উইথড্রয়াল (টাকা)
                        </label>
                        <Input
                          type="number"
                          min="100"
                          value={customSettingsForm.minWithdrawalTaka}
                          onChange={(e) =>
                            setCustomSettingsForm((prev) => ({
                              ...prev,
                              minWithdrawalTaka: Number(e.target.value),
                            }))
                          }
                          className="px-4 py-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-50/50 focus-visible:ring-offset-0 h-11 transition-all shadow-sm text-slate-700 text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          অ্যাক্টিভেশন সেলস সংখ্যা
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          value={customSettingsForm.activationSalesCount}
                          onChange={(e) =>
                            setCustomSettingsForm((prev) => ({
                              ...prev,
                              activationSalesCount: Number(e.target.value),
                            }))
                          }
                          className="px-4 py-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-50/50 focus-visible:ring-offset-0 h-11 transition-all shadow-sm text-slate-700 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <DialogFooter className="bg-transparent px-6 py-3.5 border-t border-slate-200/50 flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-0">
              <DialogClose asChild>
                <ModalCancelButton type="button">বাতিল করুন</ModalCancelButton>
              </DialogClose>
              <ModalSubmitButton type="submit">সংরক্ষণ করুন</ModalSubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Paid Withdrawal Modal */}
      <Dialog
        open={!!selectedWithdrawalForPaid}
        onOpenChange={(open) => {
          if (!open) setSelectedWithdrawalForPaid(null);
        }}
      >
        <DialogContent
          from="top"
          className="max-w-lg p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative"
        >
          <form
            onSubmit={handleConfirmPaidWithdrawal}
            className="flex flex-col h-full max-h-[85vh]"
          >
            <DialogHeader className="bg-transparent px-6 pt-6 pb-5 border-b border-slate-200/50 relative flex flex-col space-y-0 mb-0 text-left">
              <div className="flex items-start gap-4 pr-8">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl shrink-0 mt-0.5 shadow-sm shadow-emerald-500/5">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="font-bold text-slate-800 text-[17px] tracking-tight leading-snug">
                    উইথড্রয়াল পরিশোধ নিশ্চিতকরণ (Confirm Paid)
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-[13px] font-normal leading-relaxed">
                    পরিশোধের পরিমাণ: ৳
                    {(
                      (selectedWithdrawalForPaid?.amountMinor || 0) / 100
                    ).toLocaleString("bn-BD")}{" "}
                    | মাধ্যম: {selectedWithdrawalForPaid?.paymentMethod} (
                    {selectedWithdrawalForPaid?.accountDetails?.accountNumber})
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ট্রানজেকশন আইডি (TrxID){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  placeholder="যেমন: BKG89102938"
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-50/50 focus-visible:ring-offset-0 h-11 transition-all shadow-sm text-slate-700 text-xs font-mono font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  অ্যাডমিন নোট (ঐচ্ছিক)
                </label>
                <Input
                  type="text"
                  value={paidNotes}
                  onChange={(e) => setPaidNotes(e.target.value)}
                  placeholder="যেমন: বিকাশ মারফত পেইড সম্পন্ন"
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-50/50 focus-visible:ring-offset-0 h-11 transition-all shadow-sm text-slate-700 text-xs font-semibold"
                />
              </div>
            </div>

            <DialogFooter className="bg-transparent px-6 py-3.5 border-t border-slate-200/50 flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-0">
              <DialogClose asChild>
                <ModalCancelButton type="button">বাতিল করুন</ModalCancelButton>
              </DialogClose>
              <ModalSubmitButton
                type="submit"
                className="!bg-emerald-600 hover:!bg-emerald-700 !shadow-emerald-600/20"
              >
                সফল পেইড নিশ্চিত করুন
              </ModalSubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reject Withdrawal Modal */}
      <Dialog
        open={!!selectedWithdrawalForReject}
        onOpenChange={(open) => {
          if (!open) setSelectedWithdrawalForReject(null);
        }}
      >
        <DialogContent
          from="top"
          className="max-w-lg p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative"
        >
          <form
            onSubmit={handleRejectWithdrawal}
            className="flex flex-col h-full max-h-[85vh]"
          >
            <DialogHeader className="bg-transparent px-6 pt-6 pb-5 border-b border-slate-200/50 relative flex flex-col space-y-0 mb-0 text-left">
              <div className="flex items-start gap-4 pr-8">
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl shrink-0 mt-0.5 shadow-sm shadow-rose-500/5">
                  <XCircle className="size-5" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="font-bold text-slate-800 text-[17px] tracking-tight leading-snug">
                    উইথড্রয়াল বাতিল ও রিফান্ড
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-[13px] font-normal leading-relaxed">
                    বাতিল করলে ৳
                    {(
                      (selectedWithdrawalForReject?.amountMinor || 0) / 100
                    ).toLocaleString("bn-BD")}{" "}
                    টাকা সাথে সাথে অ্যাফিলিয়েটের অ্যাভেইলেবল ব্যালেন্সে ফেরত
                    যোগ হবে
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  বাতিলের স্পষ্ট কারণ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={withdrawalRejectReason}
                  onChange={(e) => setWithdrawalRejectReason(e.target.value)}
                  required
                  rows={3}
                  placeholder="যেমন: অ্যাকাউন্ট নম্বর সঠিক নয় বা বিকাশ অ্যাকাউন্টে লিমিট অতিক্রম হয়েছে..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-xs text-slate-700 font-medium transition-all shadow-sm resize-none"
                />
              </div>
            </div>

            <DialogFooter className="bg-transparent px-6 py-3.5 border-t border-slate-200/50 flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-0">
              <DialogClose asChild>
                <ModalCancelButton type="button">বাতিল করুন</ModalCancelButton>
              </DialogClose>
              <ModalSubmitButton
                type="submit"
                className="!bg-rose-600 hover:!bg-rose-700 !shadow-rose-600/20"
              >
                বাতিল ও ব্যালেন্স রিফান্ড করুন
              </ModalSubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Account Control Status Modal (Suspend / Disable) */}
      <Dialog
        open={statusChangeModal.isOpen && !!statusChangeModal.affiliate}
        onOpenChange={(open) => {
          if (!open && !statusChangeModal.isSubmitting) {
            setStatusChangeModal({
              isOpen: false,
              affiliate: null,
              newStatus: "Suspended",
              reason: "",
              isSubmitting: false,
            });
          }
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={!statusChangeModal.isSubmitting}
          onPointerDownOutside={(e) => {
            if (statusChangeModal.isSubmitting) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (statusChangeModal.isSubmitting) e.preventDefault();
          }}
          className="max-w-lg p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const targetAffiliateId = statusChangeModal.affiliate?._id;
              if (!targetAffiliateId) return;
              setStatusChangeModal((prev) => ({ ...prev, isSubmitting: true }));
              await executeControlStatusChange(
                targetAffiliateId,
                statusChangeModal.newStatus,
                statusChangeModal.reason,
              );
            }}
            className="flex flex-col h-full max-h-[85vh]"
          >
            <DialogHeader className="bg-transparent px-6 pt-6 pb-5 border-b border-slate-200/50 relative flex flex-col space-y-0 mb-0 text-left">
              <div className="flex items-start gap-4 pr-8">
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 shadow-sm ${
                    statusChangeModal.newStatus === "Suspended"
                      ? "bg-amber-500/10 border border-amber-500/20 text-amber-600 shadow-amber-500/5"
                      : "bg-rose-500/10 border border-rose-500/20 text-rose-600 shadow-rose-500/5"
                  }`}
                >
                  {statusChangeModal.newStatus === "Suspended" ? (
                    <PauseCircle className="size-5" />
                  ) : (
                    <XCircle className="size-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <DialogTitle className="font-bold text-slate-800 text-[17px] tracking-tight leading-snug">
                    {statusChangeModal.newStatus === "Suspended"
                      ? "অ্যাকাউন্ট সাময়িক স্থগিত (Suspend) করুন"
                      : "অ্যাকাউন্ট নিষ্ক্রিয় (Disable) করুন"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-[13px] font-normal leading-relaxed">
                    অ্যাফিলিয়েট:{" "}
                    <span className="font-semibold text-slate-700">
                      {statusChangeModal.affiliate?.fullName}
                    </span>{" "}
                    ({statusChangeModal.affiliate?.phoneNumber})
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                  statusChangeModal.newStatus === "Suspended"
                    ? "bg-amber-50/80 border-amber-200/80 text-amber-800"
                    : "bg-rose-50/80 border-rose-200/80 text-rose-800"
                }`}
              >
                {statusChangeModal.newStatus === "Suspended"
                  ? "অ্যাকাউন্ট স্থগিত করলে অ্যাফিলিয়েট নতুন কোনো সেলস রেফার করতে পারবে না এবং উইথড্রয়াল রিকোয়েস্ট সাময়িকভাবে বন্ধ থাকবে।"
                  : "অ্যাকাউন্ট নিষ্ক্রিয় করলে অ্যাফিলিয়েটের রেফারেল কোড স্থায়ীভাবে অকার্যকর হয়ে যাবে।"}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {statusChangeModal.newStatus === "Suspended"
                    ? "স্থগিতকরণের কারণ (ঐচ্ছিক)"
                    : "নিষ্ক্রিয়করণের কারণ (ঐচ্ছিক)"}
                </label>
                <textarea
                  value={statusChangeModal.reason}
                  onChange={(e) =>
                    setStatusChangeModal((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  rows={3}
                  disabled={statusChangeModal.isSubmitting}
                  placeholder={
                    statusChangeModal.newStatus === "Suspended"
                      ? "যেমন: সন্দেহজনক ট্রাফিক বা অভিযোগের প্রেক্ষিতে সাময়িক তদন্ত..."
                      : "যেমন: সার্ভিস পলিসি ভঙ্গের কারণে অ্যাকাউন্ট বাতিল..."
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-xs text-slate-700 font-medium transition-all shadow-sm resize-none"
                />
              </div>
            </div>

            <DialogFooter className="bg-transparent px-6 py-3.5 border-t border-slate-200/50 flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-0">
              <DialogClose asChild>
                <ModalCancelButton disabled={statusChangeModal.isSubmitting}>
                  বাতিল করুন
                </ModalCancelButton>
              </DialogClose>
              <ModalSubmitButton
                type="submit"
                disabled={statusChangeModal.isSubmitting}
                className={
                  statusChangeModal.newStatus === "Suspended"
                    ? "!bg-amber-600 hover:!bg-amber-700 !shadow-amber-600/20"
                    : "!bg-rose-600 hover:!bg-rose-700 !shadow-rose-600/20"
                }
              >
                {statusChangeModal.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : statusChangeModal.newStatus === "Suspended" ? (
                  "স্থগিত নিশ্চিত করুন"
                ) : (
                  "নিষ্ক্রিয় নিশ্চিত করুন"
                )}
              </ModalSubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
