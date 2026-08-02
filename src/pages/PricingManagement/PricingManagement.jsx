import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Building2,
  Calendar,
  ChevronDown,
  CreditCard,
  Edit2,
  GraduationCap,
  Info,
  Layers,
  Loader2,
  MoreVertical,
  Package,
  Percent,
  PlusCircle,
  School,
  Search,
  Sliders,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { translateSubscriptionKey } from "../../constants/subscriptions";
import { useUserContext } from "../../context/UserContext";
import { usePricingManagement } from "./hook/usePricingManagement";

const PRICING_TABS = [
  { id: "packages", label: "প্যাকেজ মূল্য নিয়ন্ত্রণ", icon: CreditCard },
  { id: "discounts", label: "ডিসকাউন্ট ও কুপন কোড", icon: Percent },
  { id: "subscribers", label: "গ্রাহক সাবস্ক্রিপশন তালিকা", icon: Users },
];

export default function PricingManagement() {
  const {
    packages: packagesList,
    loadingPackages: packagesLoading,
    discounts: discountsList,
    loadingDiscounts: discountsLoading,
    subscribers: subscribersList,
    subscribersTotal,
    subscribersPages,
    loadingSubscribers: subscribersLoading,
    subscribersPage,
    setSubscribersPage,
    subscribersSearch,
    setSubscribersSearch,
    updatePackage,
    saveDiscount,
    deleteDiscount,
    toggleSuspension,
    removeSubscription,
  } = usePricingManagement();

  const { role: loggedInUserRole } = useUserContext();
  const isSuperAdmin = loggedInUserRole === "Super Admin";

  const [activeTab, setActiveTab] = useState("packages"); // 'packages', 'discounts' or 'subscribers'
  const [selectedCategory, setSelectedCategory] = useState("tutor");
  const [selectedPkgVersion, setSelectedPkgVersion] = useState("Bangla");
  const [editingPkg, setEditingPkg] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [discountToDelete, setDiscountToDelete] = useState(null);
  const [pendingSuspension, setPendingSuspension] = useState(null);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);

  // Dropdown states for Create Modal
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);

  // New Coupon Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("Percentage");
  const [value, setValue] = useState("");
  const [version, setVersion] = useState("Both");
  const [targetType, setTargetType] = useState("All");
  const [targetId, setTargetId] = useState("");
  const [minCartAmount, setMinCartAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const loading =
    updatePackage.isPending ||
    saveDiscount.isPending ||
    deleteDiscount.isPending;

  const getSubscriberSubPackageTitle = (sub) => {
    const verLabels = {
      Bangla: "বাংলা",
      English: "ইংরেজি",
      Madrasah: "মাদ্রাসা",
    };
    const verText = sub.version
      ? ` (${verLabels[sub.version] || sub.version})`
      : "";
    if (sub.purchaseType === "Package") {
      const pkg = packagesList.find((p) => p.id === sub.packageId);
      const title = pkg ? pkg.title : translateSubscriptionKey(sub.packageId);
      return `প্যাকেজ: ${title}${verText}`;
    }
    if (sub.purchaseType === "Class") {
      const translatedClasses =
        sub.classNames?.map((c) => translateSubscriptionKey(c)).join(", ") ||
        "";
      return `শ্রেণী: ${translatedClasses}${verText}`;
    }
    if (sub.purchaseType === "Subject") {
      return `বিষয়ভিত্তিক: ${sub.subjectIds?.map((s) => s.subjectName).join(", ") || `${sub.subjectIds?.length || 0} টি বিষয়`}${verText}`;
    }
    return "অজানা সাবস্ক্রিপশন";
  };

  const handleToggleSuspension = async (sub, userId) => {
    try {
      const isSuspending = !sub.isSuspended;
      await toggleSuspension.mutateAsync({
        userId,
        subscriptionId: sub._id,
        isSuspended: isSuspending,
      });
      toast.success(
        isSuspending
          ? "সাবস্ক্রিপশন সফলভাবে স্থগিত করা হয়েছে!"
          : "সাবস্ক্রিপশন সফলভাবে পুনরায় সচল করা হয়েছে!",
      );
    } catch (err) {
      console.error(err);
      toast.error("সাবস্ক্রিপশন আপডেট করতে ব্যর্থ হয়েছে।");
    }
  };

  const packageCategories = [
    { id: "tutor", label: "১। শিক্ষক/টিউটর প্যাকেজ" },
    { id: "bundle", label: "২। একাডেমিক বান্ডেল প্যাকেজ" },
    { id: "coaching", label: "৩। কোচিং/প্রতিষ্ঠান প্যাকেজ" },
    { id: "school", label: "৪। শ্রেণি ভিত্তিক প্যাকেজ" },
    { id: "teacher-subject", label: "৫। বিষয়ভিত্তিক শিক্ষক প্যাকেজ" },
  ];

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case "tutor":
        return GraduationCap;
      case "bundle":
        return Layers;
      case "coaching":
        return Building2;
      case "school":
        return School;
      case "teacher-subject":
        return BookOpen;
      default:
        return Package;
    }
  };

  const getCategoryBengali = (catId) => {
    const found = packageCategories.find((c) => c.id === catId);
    if (found) {
      return found.label.replace(/^\d+।\s*/, "");
    }
    return catId;
  };

  const getPackageBengali = (pkgId) => {
    const found = packagesList.find((p) => p.id === pkgId);
    return found ? found.title : pkgId;
  };

  // Update Package Price
  const handleUpdatePrice = async () => {
    if (!editPrice || isNaN(editPrice) || parseFloat(editPrice) < 0) {
      toast.error("দয়া করে সঠিক মূল্য নির্ধারণ করুন");
      return;
    }
    try {
      await updatePackage.mutateAsync({
        id: editingPkg.id,
        basePrice: parseFloat(editPrice),
      });
      toast.success("প্যাকেজের মূল্য সফলভাবে আপডেট করা হয়েছে!");
      setEditingPkg(null);
      setEditPrice("");
    } catch (err) {
      console.error("Error updating price:", err);
      toast.error(err.response?.data?.error || "মূল্য আপডেট করতে ব্যর্থ হয়েছে");
    }
  };

  // Toggle Package Show/Hide
  const handleToggleActive = async (pkg) => {
    try {
      const nextActiveState = !pkg.isActive;
      await updatePackage.mutateAsync({
        id: pkg.id,
        isActive: nextActiveState,
      });
      toast.success(
        nextActiveState
          ? "প্যাকেজটি সফলভাবে দৃশ্যমান করা হয়েছে!"
          : "প্যাকেজটি সফলভাবে লুকানো হয়েছে!",
      );
    } catch (err) {
      console.error("Error toggling package active status:", err);
      toast.error(
        err.response?.data?.error ||
          "প্যাকেজের দৃশ্যমানতা পরিবর্তন করতে ব্যর্থ হয়েছে",
      );
    }
  };

  // Create or Update Coupon/Discount
  const handleSaveDiscount = async () => {
    if (!discountType || !value || !endDate) {
      toast.error("প্রয়োজনীয় ফিল্ডসমূহ পূরণ করুন");
      return;
    }
    const payload = {
      code: code || undefined,
      discountType,
      value: parseFloat(value),
      version,
      targetType,
      targetId: targetType !== "All" ? targetId : undefined,
      minCartAmount: minCartAmount ? parseFloat(minCartAmount) : 0,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: new Date(endDate),
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
    };

    try {
      await saveDiscount.mutateAsync({
        id: editingDiscount ? editingDiscount._id : undefined,
        payload,
      });
      if (editingDiscount) {
        toast.success("ডিসকাউন্ট/কুপন সফলভাবে সংশোধন করা হয়েছে!");
      } else {
        toast.success("ডিসকাউন্ট/কুপন কোড সফলভাবে তৈরি করা হয়েছে!");
      }
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error("Error saving discount:", err);
      toast.error(
        err.response?.data?.error || "ডিসকাউন্ট সংরক্ষণ করতে ব্যর্থ হয়েছে",
      );
    }
  };

  const handleStartEditDiscount = (disc) => {
    setEditingDiscount(disc);
    setCode(disc.code || "");
    setDiscountType(disc.discountType || "Percentage");
    setValue(disc.value || "");
    setVersion(disc.version || "Both");
    setTargetType(disc.targetType || "All");
    setTargetId(disc.targetId || "");
    setMinCartAmount(disc.minCartAmount || "");
    setStartDate(
      disc.startDate
        ? new Date(disc.startDate).toISOString().split("T")[0]
        : "",
    );
    setEndDate(
      disc.endDate ? new Date(disc.endDate).toISOString().split("T")[0] : "",
    );
    setUsageLimit(disc.usageLimit || "");
    setShowCreateModal(true);
  };

  // Delete Coupon/Discount
  const handleDeleteDiscount = (disc) => {
    setDiscountToDelete(disc);
  };

  const resetForm = () => {
    setEditingDiscount(null);
    setCode("");
    setDiscountType("Percentage");
    setValue("");
    setVersion("Both");
    setIsVersionDropdownOpen(false);
    setTargetType("All");
    setTargetId("");
    setMinCartAmount("");
    setStartDate("");
    setEndDate("");
    setUsageLimit("");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB");
  };

  return (
    <div className="space-y-6 pb-12 w-full font-sans">
      {/* Title Header */}
      <div className="bg-glass p-6 rounded-2xl border shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Sliders className="size-6 text-primary" />
            <span>প্যাকেজ ও ডিসকাউন্ট কন্ট্রোল প্যানেল</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            প্যাকেজগুলোর মূল্য পরিবর্তন, দৃশ্যমানতা এবং কুপন/ডিসকাউন্ট কোড
            পরিচালনা করুন।
          </p>
        </div>
      </div>

      {/* Main Tabs List */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-black/[0.02] border border-black/[0.05] rounded-2xl backdrop-blur-sm">
        {PRICING_TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition cursor-pointer select-none ${
                isActive ? "text-white" : "text-slate-600 hover:bg-black/[0.03]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="pricingActiveTabBackground"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl -z-10 shadow-md shadow-purple-200"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <IconComponent className="size-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="w-full space-y-6"
        >
          {/* Tab 1: Package pricing control */}
          {activeTab === "packages" && (
            <div className="space-y-6">
              {/* Sub-tabs / Categories Selector */}
              <div className="flex flex-wrap items-center justify-center gap-2 border-b pb-6">
                {packageCategories.map((cat) => {
                  const Icon = getCategoryIcon(cat.id);
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md shadow-purple-200"
                          : "text-slate-600 bg-white/60 border border-slate-200 hover:bg-white hover:border-purple-200"
                      }`}
                    >
                      <Icon className="size-4" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Version Switcher Tabs */}
              <div className="flex justify-center mb-2">
                <div className="flex gap-1.5 bg-slate-100/80 p-1.5 border border-slate-200/60 rounded-xl">
                  {[
                    { id: "Bangla", label: "বাংলা ভার্সন" },
                    { id: "English", label: "English Version" },
                    { id: "Madrasah", label: "মাদ্রাসা" },
                  ].map((ver) => {
                    const isActive = selectedPkgVersion === ver.id;
                    return (
                      <button
                        key={ver.id}
                        type="button"
                        onClick={() => setSelectedPkgVersion(ver.id)}
                        className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <span>{ver.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid list of packages */}
              {packagesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse"
                    >
                      <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
                      <div className="h-10 bg-slate-100 rounded-xl w-full mt-6"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packagesList
                    .filter(
                      (pkg) =>
                        pkg.category === selectedCategory &&
                        (pkg.version || "Bangla") === selectedPkgVersion,
                    )
                    .map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`bg-glass border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200 ${
                          pkg.isActive
                            ? "border-slate-200/60 hover:border-purple-300"
                            : "border-slate-200 bg-slate-50/50 opacity-75"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-base font-semibold text-slate-800 leading-tight">
                              {pkg.title}
                            </h3>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`text-[11px] font-semibold ${pkg.isActive ? "text-primary" : "text-slate-400"}`}
                              >
                                {pkg.isActive ? "দৃশ্যমান" : "লুকানো"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleToggleActive(pkg)}
                                disabled={loading}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                                  pkg.isActive ? "bg-primary" : "bg-slate-300"
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${
                                    pkg.isActive
                                      ? "translate-x-4"
                                      : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                              {pkg.id}
                            </p>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200/60 text-purple-700">
                              {pkg.version === "English"
                                ? "English Version"
                                : pkg.version === "Madrasah"
                                  ? "মাদ্রাসা"
                                  : "বাংলা ভার্সন"}
                            </span>
                          </div>

                          <div className="my-4 p-3 bg-purple-50/40 border border-purple-100 rounded-xl flex items-baseline justify-between">
                            <span className="text-xs text-slate-500 font-semibold">
                              বেস প্রাইস:
                            </span>
                            <span className="text-xl font-bold text-primary">
                              {pkg.originalPrice}/- ৳
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setEditingPkg(pkg);
                            setEditPrice(pkg.originalPrice);
                          }}
                          className="w-full mt-2 py-2.5 bg-white hover:bg-purple-50 text-slate-700 hover:text-primary transition rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer shadow-sm"
                        >
                          <Edit2 className="size-3.5 text-primary" />
                          <span>মূল্য পরিবর্তন করুন</span>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Discounts and Coupons Panel */}
          {activeTab === "discounts" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-glass p-4 rounded-2xl border shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Percent className="size-4 text-primary" />
                  <span>কুপন ও ছাড়ের তালিকা</span>
                </h3>
                <button
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-200 cursor-pointer"
                >
                  <PlusCircle className="size-4" />
                  <span>নতুন কুপন/ডিসকাউন্ট তৈরি</span>
                </button>
              </div>

              {/* List layout */}
              {discountsLoading ? (
                <div className="bg-glass border rounded-2xl p-8 shadow-sm flex justify-center">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : discountsList.length === 0 ? (
                <div className="bg-glass border rounded-2xl p-12 shadow-sm text-center">
                  <Info className="size-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 italic">
                    কোনো কুপন বা ডিসকাউন্ট কোড পাওয়া যায়নি।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {discountsList.map((disc) => {
                    const now = new Date();
                    const isDateOver = disc.endDate
                      ? new Date(disc.endDate) < now
                      : false;
                    const isLimitReached =
                      disc.usageLimit && disc.usedCount >= disc.usageLimit;
                    const expired = isDateOver || isLimitReached;

                    return (
                      <div
                        key={disc._id}
                        className={`border rounded-2xl p-5 space-y-4 transition shadow-sm ${
                          expired
                            ? "bg-slate-50/70 border-slate-300/80 opacity-95"
                            : "bg-glass border-slate-200/60 hover:border-purple-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              {disc.code ? (
                                <span
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg tracking-wide uppercase border ${
                                    expired
                                      ? "bg-slate-100 text-slate-400 border-slate-200"
                                      : "bg-purple-50 text-purple-700 border-purple-200/60"
                                  }`}
                                >
                                  {disc.code}
                                </span>
                              ) : (
                                <span
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                                    expired
                                      ? "bg-slate-100 text-slate-400 border-slate-200"
                                      : "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                                  }`}
                                >
                                  প্রোমোশনাল ডিসকাউন্ট
                                </span>
                              )}

                              {expired ? (
                                <span className="bg-rose-50 text-rose-500 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-rose-100">
                                  {isDateOver
                                    ? "মেয়াদোত্তীর্ণ"
                                    : "ব্যবহারের সীমা শেষ"}
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-200/60">
                                  সক্রিয়
                                </span>
                              )}

                              <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-200/60">
                                {disc.version === "Both" ||
                                disc.version === "All"
                                  ? "সব ভার্সন"
                                  : disc.version === "Bangla"
                                    ? "বাংলা"
                                    : disc.version === "English"
                                      ? "ইংরেজি"
                                      : disc.version === "Madrasah"
                                        ? "মাদ্রাসা"
                                        : disc.version === "Bangla,English"
                                          ? "বাংলা ও ইংরেজি"
                                          : disc.version === "Bangla,Madrasah"
                                            ? "বাংলা ও মাদ্রাসা"
                                            : "ইংরেজি ও মাদ্রাসা"}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">
                              তৈরি হয়েছে: {formatDate(disc.createdAt)}
                            </p>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEditDiscount(disc)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-purple-50 transition cursor-pointer"
                              title="সম্পাদনা করুন"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDiscount(disc)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>

                        {/* Value and Scope */}
                        <div
                          className={`grid grid-cols-2 gap-3 text-xs font-medium ${expired ? "text-slate-400" : ""}`}
                        >
                          <div>
                            <p className="text-slate-400">ছাড়ের পরিমাণ:</p>
                            <p
                              className={`text-sm font-bold mt-0.5 ${expired ? "text-slate-500" : "text-slate-800"}`}
                            >
                              {disc.discountType === "Percentage" &&
                              disc.value === 100 ? (
                                <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-[10px] font-semibold">
                                  সম্পূর্ণ ফ্রি
                                </span>
                              ) : disc.discountType === "Percentage" ? (
                                `${disc.value}%`
                              ) : (
                                `${disc.value}৳`
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400">আওতাভুক্ত পরিধি:</p>
                            <p
                              className={`text-sm font-bold mt-0.5 ${expired ? "text-slate-500" : "text-slate-800"}`}
                            >
                              {disc.targetType === "All" &&
                                "গ্লোবাল (সব প্যাকেজ)"}
                              {disc.targetType === "SpecificCategory" &&
                                `ক্যাটাগরি: ${getCategoryBengali(disc.targetId)}`}
                              {disc.targetType === "SpecificPackage" &&
                                `প্যাকেজ: ${getPackageBengali(disc.targetId)}`}
                            </p>
                          </div>
                          {disc.code && (
                            <>
                              <div>
                                <p className="text-slate-400">
                                  নূন্যতম ক্রয়সীমা:
                                </p>
                                <p
                                  className={`text-sm font-semibold mt-0.5 ${expired ? "text-slate-500" : "text-slate-800"}`}
                                >
                                  {disc.minCartAmount || 0} ৳
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-400">ব্যবহৃত হয়েছে:</p>
                                <p
                                  className={`text-sm font-semibold mt-0.5 ${expired ? "text-slate-500" : "text-slate-800"}`}
                                >
                                  {disc.usedCount}{" "}
                                  {disc.usageLimit
                                    ? `/ ${disc.usageLimit}`
                                    : "বার"}
                                </p>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Period info */}
                        <div
                          className={`p-2.5 border rounded-xl flex items-center justify-between text-[11px] font-medium ${
                            expired
                              ? "bg-slate-100/50 border-slate-200/50 text-slate-400"
                              : "bg-purple-50/40 border-purple-100 text-slate-600"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Calendar className="size-3.5 text-primary" />
                            <span>শুরু: {formatDate(disc.startDate)}</span>
                          </span>
                          <span>শেষ: {formatDate(disc.endDate)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Subscribers list */}
          {activeTab === "subscribers" && (
            <div className="space-y-6">
              {/* Search bar */}
              <div className="flex items-center gap-3 bg-glass p-4 border rounded-2xl shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="নাম বা মোবাইল নাম্বার দিয়ে গ্রাহক খুঁজুন..."
                    value={subscribersSearch}
                    onChange={(e) => {
                      setSubscribersSearch(e.target.value);
                      setSubscribersPage(1);
                    }}
                    className="w-full pl-11 pr-4 h-11 bg-white/70 border border-slate-200 focus-visible:ring-purple-100 focus-visible:border-primary rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-700"
                  />
                </div>
                {subscribersSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setSubscribersSearch("");
                      setSubscribersPage(1);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold px-2 py-1 cursor-pointer"
                  >
                    মুছে ফেলুন
                  </button>
                )}
              </div>

              {/* Subscribers grid */}
              {subscribersLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse"
                    >
                      <div className="h-6 bg-slate-100 rounded-md w-1/3"></div>
                      <div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
                      <div className="h-10 bg-slate-100 rounded-xl w-full mt-6"></div>
                    </div>
                  ))}
                </div>
              ) : subscribersList.length === 0 ? (
                <div className="bg-glass border rounded-2xl p-12 shadow-sm text-center">
                  <Info className="size-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 italic">
                    কোনো গ্রাহক পাওয়া যায়নি।
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subscribersList.map((user) => {
                      const userName =
                        user.fullName ||
                        `${user.firstName || ""} ${user.lastName || ""}`;
                      const initials = userName
                        .trim()
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                      return (
                        <div
                          key={user._id}
                          className="bg-glass border rounded-2xl p-5 shadow-sm space-y-4 text-left flex flex-col justify-between hover:shadow-md transition"
                        >
                          <div className="space-y-3.5">
                            {/* User Header */}
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                              <Avatar className="size-10 border border-purple-100 rounded-xl overflow-hidden shadow-sm">
                                <AvatarImage
                                  src={user.imageUrl}
                                  alt={userName}
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-purple-50 text-primary font-semibold text-xs flex items-center justify-center h-full w-full">
                                  {initials || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-sm font-semibold text-slate-800">
                                    {user.fullName ||
                                      `${user.firstName || ""} ${user.lastName || ""}`}
                                  </h4>
                                  <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                      user.role === "Super Admin" ||
                                      user.role === "Admin"
                                        ? "bg-purple-50 text-purple-700 border-purple-200/60"
                                        : "bg-slate-100 text-slate-600 border-slate-200"
                                    }`}
                                  >
                                    {user.role}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                  {user.phoneNumber}
                                </p>
                              </div>
                            </div>

                            {/* Subscriptions List */}
                            <div className="space-y-2.5">
                              <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                সাবস্ক্রিপশনসমূহ
                              </h5>
                              {!user.subscriptions ||
                              user.subscriptions.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">
                                  কোনো সক্রিয় বা স্থগিত সাবস্ক্রিপশন নেই।
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {user.subscriptions.map((sub) => {
                                    const isExpired =
                                      new Date(sub.endDate) < new Date();
                                    const isSuspended = sub.isSuspended;

                                    return (
                                      <div
                                        key={sub._id}
                                        className={`p-3 border rounded-xl flex items-center justify-between gap-4 transition ${
                                          isSuspended
                                            ? "bg-rose-50/30 border-rose-100 text-slate-500"
                                            : isExpired
                                              ? "bg-slate-50/50 border-slate-200 text-slate-400"
                                              : "bg-purple-50/30 border-purple-200/60 text-slate-800"
                                        }`}
                                      >
                                        <div className="space-y-1 text-left flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-xs font-semibold text-slate-800 truncate">
                                              {getSubscriberSubPackageTitle(
                                                sub,
                                              )}
                                            </p>
                                            {isSuspended ? (
                                              <span className="bg-rose-50 text-rose-600 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-rose-100">
                                                স্থগিত
                                              </span>
                                            ) : isExpired ? (
                                              <span className="bg-slate-100 text-slate-400 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-slate-200">
                                                মেয়াদোত্তীর্ণ
                                              </span>
                                            ) : (
                                              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-emerald-200/60">
                                                সক্রিয়
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-slate-400 font-medium">
                                            মেয়াদ: {formatDate(sub.startDate)} -{" "}
                                            {formatDate(sub.endDate)}
                                          </p>
                                        </div>

                                        {!isExpired && (
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <button
                                                type="button"
                                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                              >
                                                <MoreVertical className="size-4" />
                                              </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                              align="end"
                                              className="w-40 bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]"
                                            >
                                              <DropdownMenuItem
                                                onSelect={() =>
                                                  setPendingSuspension({
                                                    sub,
                                                    userId: user._id,
                                                  })
                                                }
                                                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 cursor-pointer focus:bg-purple-50 focus:text-primary text-slate-700"
                                              >
                                                {isSuspended ? (
                                                  <>
                                                    <UserCheck className="size-3.5 text-emerald-600" />
                                                    <span className="text-emerald-600">
                                                      সচল করুন
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <UserX className="size-3.5 text-rose-600" />
                                                    <span className="text-rose-600">
                                                      স্থগিত করুন
                                                    </span>
                                                  </>
                                                )}
                                              </DropdownMenuItem>

                                              {isSuperAdmin && (
                                                <DropdownMenuItem
                                                  onSelect={() =>
                                                    setSubscriptionToDelete({
                                                      sub,
                                                      userId: user._id,
                                                    })
                                                  }
                                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 cursor-pointer focus:bg-rose-50 focus:text-rose-600 text-rose-600 border-t border-slate-100/50"
                                                >
                                                  <Trash2 className="size-3.5" />
                                                  <span>রিমুভ করুন</span>
                                                </DropdownMenuItem>
                                              )}
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Server-side Pagination Section */}
                  {subscribersPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-5 flex-wrap gap-3 text-xs text-slate-500 font-semibold">
                      <p>
                        মোট গ্রাহক:{" "}
                        <span className="font-bold text-slate-700">
                          {subscribersTotal}
                        </span>{" "}
                        জনের মধ্যে{" "}
                        <span className="font-bold text-slate-700">
                          {(subscribersPage - 1) * 10 + 1}
                        </span>{" "}
                        -{" "}
                        <span className="font-bold text-slate-700">
                          {Math.min(subscribersPage * 10, subscribersTotal)}
                        </span>{" "}
                        জন দেখানো হচ্ছে
                      </p>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={subscribersPage === 1}
                          onClick={() =>
                            setSubscribersPage((prev) => Math.max(1, prev - 1))
                          }
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 rounded-lg text-[11px] font-semibold text-slate-600 transition flex items-center gap-1 cursor-pointer"
                        >
                          পূর্ববর্তী
                        </button>
                        {Array.from({ length: subscribersPages }).map(
                          (_, idx) => {
                            const pageNum = idx + 1;
                            return (
                              <button
                                key={pageNum}
                                type="button"
                                onClick={() => setSubscribersPage(pageNum)}
                                className={`h-8 w-8 rounded-lg text-[11px] font-semibold transition flex items-center justify-center border cursor-pointer ${
                                  subscribersPage === pageNum
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          },
                        )}
                        <button
                          type="button"
                          disabled={subscribersPage === subscribersPages}
                          onClick={() =>
                            setSubscribersPage((prev) =>
                              Math.min(subscribersPages, prev + 1),
                            )
                          }
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 rounded-lg text-[11px] font-semibold text-slate-600 transition flex items-center gap-1 cursor-pointer"
                        >
                          পরবর্তী
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Edit Price Modal */}
      <Dialog
        open={!!editingPkg}
        onOpenChange={(open) => {
          if (!open && !loading) {
            setEditingPkg(null);
            setEditPrice("");
          }
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={!loading}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans"
        >
          <div className="px-6 pt-6 pb-5 border-b border-slate-100 flex items-start gap-4 text-left">
            <div className="p-2.5 bg-purple-50 border border-purple-100 text-primary rounded-xl shrink-0 shadow-sm">
              <Edit2 className="size-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="font-semibold text-slate-800 text-base leading-snug">
                {editingPkg?.title}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-normal leading-relaxed uppercase tracking-wider">
                প্যাকেজ আইডি: {editingPkg?.id}
              </DialogDescription>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                নতুন বেস প্রাইস (৳)
              </label>
              <input
                type="number"
                placeholder="যেমন: ৭০০"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus-visible:ring-purple-100 focus-visible:border-primary transition-all text-slate-700 shadow-sm"
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setEditingPkg(null);
                  setEditPrice("");
                }}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 transition rounded-xl text-xs font-semibold text-slate-600 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleUpdatePrice}
                disabled={loading}
                className="flex-1 py-2.5 bg-primary hover:bg-purple-700 transition rounded-xl text-xs font-semibold text-white shadow-md shadow-purple-200 flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading && (
                  <Loader2 className="size-4 animate-spin text-white" />
                )}
                <span>আপডেট করুন</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Discount/Coupon Modal */}
      <Dialog
        open={showCreateModal}
        onOpenChange={(open) => {
          if (!open && !loading) {
            setShowCreateModal(false);
            resetForm();
          }
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={!loading}
          className="max-w-lg p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative max-h-[90vh] overflow-y-auto font-sans"
        >
          <div className="px-6 pt-6 pb-5 border-b border-slate-100 flex items-start gap-4 text-left">
            <div className="p-2.5 bg-purple-50 border border-purple-100 text-primary rounded-xl shrink-0 shadow-sm">
              {editingDiscount ? (
                <Edit2 className="size-5" />
              ) : (
                <PlusCircle className="size-5" />
              )}
            </div>
            <div className="space-y-1">
              <DialogTitle className="font-semibold text-slate-800 text-base leading-snug">
                {editingDiscount
                  ? "ডিসকাউন্ট/কুপন কোড সংশোধন করুন"
                  : "নতুন ডিসকাউন্ট/কুপন তৈরি করুন"}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-normal leading-relaxed">
                {editingDiscount
                  ? "অফারের নতুন প্রকারভেদ, মূল্য এবং মেয়াদ নির্ধারণ করুন"
                  : "অফারের প্রকারভেদ, মূল্য এবং মেয়াদ নির্ধারণ করুন"}
              </DialogDescription>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Code */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  কুপন কোড (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="SAVE30"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus-visible:ring-purple-100 focus-visible:border-primary transition-all text-slate-700 uppercase"
                />
              </div>

              {/* Discount Type */}
              <div className="space-y-1 relative">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  ডিসকাউন্ট টাইপ
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    className="w-full px-4 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50/50 hover:border-purple-300 focus-visible:ring-purple-100 focus-visible:border-primary transition-all font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm cursor-pointer"
                  >
                    <span>
                      {discountType === "Percentage" && value === "100"
                        ? "সম্পূর্ণ ফ্রি (১০০% ছাড়)"
                        : discountType === "Percentage"
                          ? "শতকরা ছাড় (%)"
                          : "ফ্ল্যাট ছাড় (৳)"}
                    </span>
                    <ChevronDown
                      className={`size-4 text-slate-400 transition-transform duration-300 ${isTypeDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isTypeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]">
                      {[
                        { value: "Percentage", label: "শতকরা ছাড় (%)" },
                        { value: "Flat", label: "ফ্ল্যাট ছাড় (৳)" },
                        { value: "Free", label: "সম্পূর্ণ ফ্রি (১০০% ছাড়)" },
                      ].map((opt) => {
                        const isSelected =
                          opt.value === "Free"
                            ? discountType === "Percentage" && value === "100"
                            : opt.value === "Percentage"
                              ? discountType === "Percentage" && value !== "100"
                              : discountType === "Flat";
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              if (opt.value === "Free") {
                                setDiscountType("Percentage");
                                setValue("100");
                              } else {
                                setDiscountType(opt.value);
                                if (value === "100") setValue("");
                              }
                              setIsTypeDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer hover:bg-purple-50/60 ${
                              isSelected
                                ? "bg-purple-50 text-primary font-semibold"
                                : "text-slate-700"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && (
                              <span className="size-1.5 rounded-full bg-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Value */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  ডিসকাউন্ট মান (৳ / %)
                </label>
                <input
                  type="number"
                  placeholder="যেমন: ৩০"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={discountType === "Percentage" && value === "100"}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus-visible:ring-purple-100 focus-visible:border-primary transition-all text-slate-700 shadow-sm disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              {/* Minimum Purchase */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  নূন্যতম ক্রয়সীমা (৳)
                </label>
                <input
                  type="number"
                  placeholder="যেমন: ৫০০"
                  value={minCartAmount}
                  onChange={(e) => setMinCartAmount(e.target.value)}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus-visible:ring-purple-100 focus-visible:border-primary transition-all text-slate-700 shadow-sm"
                />
              </div>

              {/* Applicable Version */}
              <div className="space-y-1 relative">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  প্রযোজ্য ভার্সন
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsVersionDropdownOpen(!isVersionDropdownOpen)
                    }
                    className="w-full px-4 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50/50 hover:border-purple-300 focus-visible:ring-purple-100 focus-visible:border-primary transition-all font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm cursor-pointer"
                  >
                    <span>
                      {version === "Both" || version === "All"
                        ? "সবগুলো"
                        : version === "Bangla"
                          ? "বাংলা"
                          : version === "English"
                            ? "ইংরেজি"
                            : version === "Madrasah"
                              ? "মাদ্রাসা"
                              : version === "Bangla,English"
                                ? "বাংলা ও ইংরেজি"
                                : version === "Bangla,Madrasah"
                                  ? "বাংলা ও মাদ্রাসা"
                                  : "ইংরেজি ও মাদ্রাসা"}
                    </span>
                    <ChevronDown
                      className={`size-4 text-slate-400 transition-transform duration-300 ${isVersionDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isVersionDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]">
                      {[
                        { value: "Both", label: "সবগুলো" },
                        { value: "Bangla", label: "বাংলা" },
                        { value: "English", label: "ইংরেজি" },
                        { value: "Madrasah", label: "মাদ্রাসা" },
                        { value: "Bangla,English", label: "বাংলা ও ইংরেজি" },
                        { value: "Bangla,Madrasah", label: "বাংলা ও মাদ্রাসা" },
                        {
                          value: "English,Madrasah",
                          label: "ইংরেজি ও মাদ্রাসা",
                        },
                      ].map((opt) => {
                        const isSelected = version === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setVersion(opt.value);
                              setIsVersionDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer hover:bg-purple-50/60 ${
                              isSelected
                                ? "bg-purple-50 text-primary font-semibold"
                                : "text-slate-700"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && (
                              <span className="size-1.5 rounded-full bg-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Scope Target Type */}
              <div className="space-y-1 relative">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  ছাড়ের পরিধি
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
                    className="w-full px-4 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50/50 hover:border-purple-300 focus-visible:ring-purple-100 focus-visible:border-primary transition-all font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm cursor-pointer"
                  >
                    <span>
                      {targetType === "All" && "গ্লোবাল (সবার জন্য)"}
                      {targetType === "SpecificCategory" && "ক্যাটাগরি ভিত্তিক"}
                      {targetType === "SpecificPackage" && "নির্দিষ্ট প্যাকেজ"}
                    </span>
                    <ChevronDown
                      className={`size-4 text-slate-400 transition-transform duration-300 ${isScopeDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isScopeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]">
                      {[
                        { value: "All", label: "গ্লোবাল (সবার জন্য)" },
                        {
                          value: "SpecificCategory",
                          label: "ক্যাটাগরি ভিত্তিক",
                        },
                        {
                          value: "SpecificPackage",
                          label: "নির্দিষ্ট প্যাকেজ",
                        },
                      ].map((opt) => {
                        const isSelected = targetType === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setTargetType(opt.value);
                              setTargetId("");
                              setIsScopeDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer hover:bg-purple-50/60 ${
                              isSelected
                                ? "bg-purple-50 text-primary font-semibold"
                                : "text-slate-700"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && (
                              <span className="size-1.5 rounded-full bg-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Target ID Selector */}
              {targetType !== "All" && (
                <div className="space-y-1 relative">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    সিলেক্ট করুন
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsTargetDropdownOpen(!isTargetDropdownOpen)
                      }
                      className="w-full px-4 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50/50 hover:border-purple-300 focus-visible:ring-purple-100 focus-visible:border-primary transition-all font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm cursor-pointer text-left"
                    >
                      <span className="truncate">
                        {targetType === "SpecificCategory"
                          ? packageCategories.find((c) => c.id === targetId)
                              ?.label || "ক্যাটাগরি নির্বাচন করুন"
                          : packagesList.find((p) => p.id === targetId)
                              ?.title || "প্যাকেজ নির্বাচন করুন"}
                      </span>
                      <ChevronDown
                        className={`size-4 text-slate-400 transition-transform duration-300 ${isTargetDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isTargetDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] max-h-[220px] overflow-y-auto">
                        {targetType === "SpecificCategory"
                          ? packageCategories.map((c) => {
                              const isSelected = targetId === c.id;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => {
                                    setTargetId(c.id);
                                    setIsTargetDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer hover:bg-purple-50/60 ${
                                    isSelected
                                      ? "bg-purple-50 text-primary font-semibold"
                                      : "text-slate-700"
                                  }`}
                                >
                                  <span>{c.label}</span>
                                  {isSelected && (
                                    <span className="size-1.5 rounded-full bg-primary" />
                                  )}
                                </button>
                              );
                            })
                          : packagesList.map((p) => {
                              const isSelected = targetId === p.id;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => {
                                    setTargetId(p.id);
                                    setIsTargetDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer hover:bg-purple-50/60 ${
                                    isSelected
                                      ? "bg-purple-50 text-primary font-semibold"
                                      : "text-slate-700"
                                  }`}
                                >
                                  <span className="truncate">{p.title}</span>
                                  {isSelected && (
                                    <span className="size-1.5 rounded-full bg-primary" />
                                  )}
                                </button>
                              );
                            })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  শুরুর তারিখ
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus-visible:ring-purple-100 focus-visible:border-primary transition-all text-slate-700 shadow-sm"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  শেষের তারিখ
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus-visible:ring-purple-100 focus-visible:border-primary transition-all text-slate-700 shadow-sm"
                />
              </div>

              {/* Usage Limit */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  সর্বোচ্চ ব্যবহার সীমা (ঐচ্ছিক)
                </label>
                <input
                  type="number"
                  placeholder="যেমন: ১০০"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus-visible:ring-purple-100 focus-visible:border-primary transition-all text-slate-700 shadow-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 transition rounded-xl text-xs font-semibold text-slate-600 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveDiscount}
                disabled={loading}
                className="flex-1 py-2.5 bg-primary hover:bg-purple-700 transition rounded-xl text-xs font-semibold text-white shadow-md shadow-purple-200 flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading && (
                  <Loader2 className="size-4 animate-spin text-white" />
                )}
                <span>সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!discountToDelete}
        onOpenChange={(open) => {
          if (!open && !loading) {
            setDiscountToDelete(null);
          }
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={!loading}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans"
        >
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 border border-rose-100">
              <Trash2 className="size-6 text-rose-600 animate-bounce" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-center font-semibold text-slate-800 text-lg">
                আপনি কি নিশ্চিত?
              </DialogTitle>
              <DialogDescription className="text-center text-slate-500 text-xs font-normal leading-relaxed">
                আপনি কি নিশ্চিত যে আপনি কুপন কোড{" "}
                <strong>
                  {discountToDelete?.code || "প্রোমোশনাল ডিসকাউন্ট"}
                </strong>{" "}
                স্থায়ীভাবে মুছে ফেলতে চান? এটি আর পুনরুদ্ধার করা যাবে না।
              </DialogDescription>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={loading}
                onClick={() => setDiscountToDelete(null)}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 transition rounded-xl text-xs font-semibold text-slate-600 cursor-pointer disabled:opacity-50"
              >
                না, বাতিল করুন
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  if (discountToDelete) {
                    try {
                      await deleteDiscount.mutateAsync(discountToDelete._id);
                      toast.success("ডিসকাউন্ট সফলভাবে মুছে ফেলা হয়েছে!");
                      setDiscountToDelete(null);
                    } catch (err) {
                      console.error("Error deleting discount:", err);
                      toast.error("ডিসকাউন্ট মুছে ফেলতে ব্যর্থ হয়েছে");
                    }
                  }
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 transition rounded-xl text-xs font-semibold text-white shadow-md shadow-rose-200 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {loading && (
                  <Loader2 className="size-4 animate-spin text-white" />
                )}
                <span>
                  {loading ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
                </span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suspension Confirmation Modal */}
      <Dialog
        open={!!pendingSuspension}
        onOpenChange={(open) => {
          if (!open && !toggleSuspension.isPending) {
            setPendingSuspension(null);
          }
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={!toggleSuspension.isPending}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans"
        >
          <div className="p-6 text-center space-y-4 font-sans">
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                pendingSuspension?.sub?.isSuspended
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-rose-50 text-rose-600 border border-rose-100/50"
              }`}
            >
              {pendingSuspension?.sub?.isSuspended ? (
                <UserCheck className="size-6 animate-pulse" />
              ) : (
                <UserX className="size-6 animate-bounce" />
              )}
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-center font-semibold text-slate-800 text-lg">
                {pendingSuspension?.sub?.isSuspended
                  ? "সাবস্ক্রিপশন পুনরায় সচল করুন"
                  : "সাবস্ক্রিপশন স্থগিত করুন"}
              </DialogTitle>
              <DialogDescription className="text-center text-slate-500 text-xs font-normal leading-relaxed">
                আপনি কি নিশ্চিত যে আপনি এই গ্রাহকের সাবস্ক্রিপশনটি{" "}
                <strong>
                  {pendingSuspension?.sub?.isSuspended
                    ? "পুনরায় সচল"
                    : "স্থগিত"}
                </strong>{" "}
                করতে চান?
              </DialogDescription>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={toggleSuspension.isPending}
                onClick={() => setPendingSuspension(null)}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 transition rounded-xl text-xs font-semibold text-slate-600 cursor-pointer disabled:opacity-50"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                disabled={toggleSuspension.isPending}
                onClick={async () => {
                  if (pendingSuspension) {
                    await handleToggleSuspension(
                      pendingSuspension.sub,
                      pendingSuspension.userId,
                    );
                    setPendingSuspension(null);
                  }
                }}
                className={`flex-1 py-2.5 transition rounded-xl text-xs font-semibold text-white shadow-md flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 ${
                  pendingSuspension?.sub?.isSuspended
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 border border-emerald-500"
                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-200 border border-rose-500"
                }`}
              >
                {toggleSuspension.isPending ? (
                  <Loader2 className="size-4 animate-spin text-white" />
                ) : pendingSuspension?.sub?.isSuspended ? (
                  <UserCheck className="size-4 text-white" />
                ) : (
                  <UserX className="size-4 text-white" />
                )}
                <span>
                  {toggleSuspension.isPending
                    ? "প্রক্রিয়াধীন..."
                    : "নিশ্চিত করুন"}
                </span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscription Delete Confirmation Dialog */}
      <Dialog
        open={!!subscriptionToDelete}
        onOpenChange={(open) => {
          if (!open && !removeSubscription.isPending) {
            setSubscriptionToDelete(null);
          }
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={!removeSubscription.isPending}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans"
        >
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 border border-rose-100">
              <Trash2 className="size-6 text-rose-600 animate-bounce" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-center font-semibold text-slate-800 text-lg">
                সাবস্ক্রিপশন মুছে ফেলবেন?
              </DialogTitle>
              <DialogDescription className="text-center text-slate-500 text-xs font-normal leading-relaxed">
                আপনি কি নিশ্চিত যে আপনি এই গ্রাহকের সাবস্ক্রিপশনটি{" "}
                <strong>স্থায়ীভাবে মুছে ফেলতে</strong> চান? এটি আর পুনরুদ্ধার
                করা যাবে না।
              </DialogDescription>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={removeSubscription.isPending}
                onClick={() => setSubscriptionToDelete(null)}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 transition rounded-xl text-xs font-semibold text-slate-600 cursor-pointer disabled:opacity-50"
              >
                না, বাতিল করুন
              </button>
              <button
                type="button"
                disabled={removeSubscription.isPending}
                onClick={async () => {
                  if (subscriptionToDelete) {
                    try {
                      await removeSubscription.mutateAsync({
                        userId: subscriptionToDelete.userId,
                        subscriptionId: subscriptionToDelete.sub._id,
                      });
                      toast.success("সাবস্ক্রিপশন সফলভাবে মুছে ফেলা হয়েছে!");
                      setSubscriptionToDelete(null);
                    } catch (err) {
                      console.error("Error deleting subscription:", err);
                      toast.error("সাবস্ক্রিপশন মুছে ফেলতে ব্যর্থ হয়েছে");
                    }
                  }
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 transition rounded-xl text-xs font-semibold text-white shadow-md shadow-rose-200 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {removeSubscription.isPending && (
                  <Loader2 className="size-4 animate-spin text-white" />
                )}
                <span>
                  {removeSubscription.isPending
                    ? "মুছে ফেলা হচ্ছে..."
                    : "হ্যাঁ, মুছে ফেলুন"}
                </span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
