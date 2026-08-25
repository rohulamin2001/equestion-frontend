import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Crown,
  Gift,
  GraduationCap,
  Grid,
  Layers,
  Loader2,
  Lock,
  Package,
  PackageOpen,
  School,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GENERATOR_CLASSES } from "../../constants/classes";
import { translateSubscriptionKey } from "../../constants/subscriptions";
import { useUserContext } from "../../context/UserContext";
import apiClient from "../../lib/apiClient";
import { useSubscription } from "./hook/useSubscription";
import PricingCardGrid from "./components/PricingCardGrid";

export default function Subscription() {
  const { refreshProfile } = useUserContext();

  const {
    packages: packagesList,
    coupons: couponsList,
    loadingPackages: packagesLoading,
    mySubscriptions: userSubs,
    loadingSubscriptions: subsLoading,
    validateCoupon,
    purchaseSubscription,
  } = useSubscription();

  const activeSubs = userSubs.filter(
    (sub) =>
      sub.isActive && !sub.isSuspended && new Date(sub.endDate) >= new Date(),
  );

  const [activeTab, setActiveTab] = useState("packages"); // 'packages' or 'subjects'
  const [allSubjects, setAllSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Class 7");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("tutor");
  const [selectedVersion, setSelectedVersion] = useState("Bangla");

  const [checkoutPkg, setCheckoutPkg] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const couponLoading = validateCoupon.isPending;
  const loading = purchaseSubscription.isPending;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getCouponScopeText = (coupon) => {
    if (!coupon.targetType || coupon.targetType === "All") {
      return "গ্লোবাল (সব প্যাকেজ)";
    }
    if (coupon.targetType === "Category") {
      const cat = packageCategories.find((c) => c.id === coupon.targetId);
      return cat ? `${cat.label}` : `ক্যাটাগরি: ${coupon.targetId}`;
    }
    if (coupon.targetType === "Package") {
      const pkg = packagesList?.find((p) => p.id === coupon.targetId);
      return pkg ? `প্যাকেজ: ${pkg.title}` : `প্যাকেজ: ${coupon.targetId}`;
    }
    return "গ্লোবাল (সব প্যাকেজ)";
  };

  const classes = GENERATOR_CLASSES;

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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("কুপন কোড লিখুন");
      return;
    }
    setCouponError("");
    try {
      const res = await validateCoupon.mutateAsync({
        code: couponCode,
        packageId: checkoutPkg.id,
        version: checkoutPkg.version,
        cartTotal: checkoutPkg.price,
      });
      setAppliedCoupon(res);
      toast.success("কুপন কোড সফলভাবে প্রয়োগ করা হয়েছে!");
    } catch (err) {
      console.error("Coupon validation error:", err);
      setCouponError(
        err.response?.data?.error || "কুপন কোডটি অবৈধ বা মেয়াদোত্তীর্ণ",
      );
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleConfirmPurchase = async () => {
    const payload = checkoutPkg.isSubjectPack
      ? {
          purchaseType: "Subject",
          subjectIds: checkoutPkg.subjectIds,
          version: checkoutPkg.version,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          cartTotal: checkoutPkg.price,
          // Fresh key per attempt; server dedupes duplicate submissions.
          idempotencyKey: crypto.randomUUID(),
        }
      : {
          purchaseType: "Package",
          packageId: checkoutPkg.id,
          classNames: checkoutPkg.classes,
          version: checkoutPkg.version,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          cartTotal: checkoutPkg.price,
          idempotencyKey: crypto.randomUUID(),
        };

    try {
      await purchaseSubscription.mutateAsync(payload);
      toast.success(`${checkoutPkg.title} সফলভাবে ক্রয় করা হয়েছে!`);
      setCheckoutPkg(null);
      setAppliedCoupon(null);
      setCouponCode("");
      setSelectedSubjects([]);
      refreshProfile();
    } catch (err) {
      console.error("Purchase error:", err);
      toast.error(
        err.response?.data?.error || "ক্রয় সম্পন্ন করতে ব্যর্থ হয়েছে",
      );
    }
  };

  const handleSubjectCheckout = () => {
    const firstSubId = selectedSubjects[0];
    const firstSub = allSubjects.find((s) => s._id === firstSubId);
    const subVersion = firstSub ? firstSub.version : "Bangla";

    setCheckoutPkg({
      id: "subject-custom-pack",
      title: `বিষয় প্যাক (${selectedSubjects.length} টি বিষয়)`,
      price: selectedSubjects.length * 100,
      originalPrice: selectedSubjects.length * 100,
      classes: [selectedClass],
      subjectIds: selectedSubjects,
      version: subVersion,
      isSubjectPack: true,
    });
  };

  // Fetch subjects of selected class
  const fetchClassSubjects = async (className) => {
    try {
      setSubjectsLoading(true);
      const res = await apiClient.get(`/subjects?className=${className}`);
      setAllSubjects(res.data.subjects || []);
      setSelectedSubjects([]);
    } catch (err) {
      console.error("Error fetching class subjects:", err);
      toast.error("বিষয় তালিকা লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setSubjectsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "subjects" && selectedClass) {
      Promise.resolve().then(() => {
        fetchClassSubjects(selectedClass);
      });
    }
  }, [activeTab, selectedClass]);

  const handleToggleSubject = (subId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subId)
        ? prev.filter((id) => id !== subId)
        : [...prev, subId],
    );
  };

  // Helper check to verify if a subject is active in subscription list
  const isSubjectSubscribed = (subId, className) => {
    const now = new Date();
    const subject = allSubjects.find((s) => s._id === subId);
    const subjectName = subject ? subject.subjectName : "";
    const subjectVersion = subject ? subject.version : "Bangla";

    return userSubs.some((sub) => {
      if (!sub.isActive || sub.isSuspended || new Date(sub.endDate) < now)
        return false;

      const subVersion = sub.version || "Bangla";

      // 1. Teacher package check
      if (sub.packageId && sub.packageId.startsWith("teacher-")) {
        if (subVersion !== subjectVersion) return false;
        const pkgKey = sub.packageId.replace("-madrasah", "");
        const classesList = [
          "Class 6",
          "Class 7",
          "Class 8",
          "Class 9-10",
          "Class 9",
          "Class 10",
        ];
        if (classesList.includes(className)) {
          if (
            pkgKey === "teacher-bangla-6-10" &&
            /বাংলা|Bangla/i.test(subjectName)
          )
            return true;
          if (pkgKey === "teacher-math-6-10" && /গণিত|Math/i.test(subjectName))
            return true;
          if (
            pkgKey === "teacher-science-6-10" &&
            /বিজ্ঞান|Science/i.test(subjectName)
          )
            return true;
          if (
            pkgKey === "teacher-english-6-10" &&
            /English|ইংরেজি/i.test(subjectName)
          )
            return true;
          if (pkgKey === "teacher-ict-6-10" && /আইসিটি|ICT/i.test(subjectName))
            return true;
          if (
            pkgKey === "teacher-bgs-6-10" &&
            /বাংলাদেশ ও বিশ্বপরিচয়|BGS|Bangladesh/i.test(subjectName)
          )
            return true;
          if (
            pkgKey === "teacher-islam-6-10" &&
            /ইসলাম শিক্ষা|Islam/i.test(subjectName)
          )
            return true;
          if (
            pkgKey === "teacher-agriculture-6-10" &&
            /কৃষি শিক্ষা|Agri/i.test(subjectName)
          )
            return true;
        }
      }

      // 2. Package ID check (all-classes, 6-to-10, 9-10, etc.)
      if (sub.packageId) {
        const pkgId = String(sub.packageId).toLowerCase();
        const matchesVersion =
          !sub.version ||
          sub.version === subjectVersion ||
          (sub.version === "Madrasah"
            ? subjectVersion === "Madrasah"
            : subjectVersion !== "Madrasah");

        if (matchesVersion) {
          if (pkgId.includes("all-classes") || pkgId.includes("all-in-one"))
            return true;
          if (
            (pkgId.includes("6-to-10") || pkgId.includes("6-10")) &&
            [
              "Class 6",
              "Class 7",
              "Class 8",
              "Class 9-10",
              "Class 9",
              "Class 10",
            ].includes(className)
          )
            return true;
          if (
            (pkgId.includes("3-to-5") || pkgId.includes("3-5")) &&
            ["Class 3", "Class 4", "Class 5"].includes(className)
          )
            return true;
          if (
            (pkgId.includes("9-10") ||
              pkgId.includes("9-to-10") ||
              pkgId.includes("class-9") ||
              pkgId.includes("class-10")) &&
            ["Class 9-10", "Class 9", "Class 10"].includes(className)
          )
            return true;
          if (
            (pkgId.includes("hsc") ||
              pkgId.includes("11-12") ||
              pkgId.includes("college")) &&
            ["HSC", "Class 11", "Class 12"].includes(className)
          )
            return true;
        }
      }

      // 3. PurchaseType Package or Class
      if (sub.purchaseType === "Package" || sub.purchaseType === "Class") {
        const subClasses = new Set(sub.classNames || []);
        if (subClasses.has("Class 9") || subClasses.has("Class 10"))
          subClasses.add("Class 9-10");
        if (subClasses.has("Class 9-10")) {
          subClasses.add("Class 9");
          subClasses.add("Class 10");
        }
        if (subClasses.has("HSC")) {
          subClasses.add("Class 11");
          subClasses.add("Class 12");
        }

        const classMatches = subClasses.has(className);
        const versionMatches =
          !sub.version ||
          sub.version === subjectVersion ||
          (sub.version === "Madrasah"
            ? subjectVersion === "Madrasah"
            : subjectVersion !== "Madrasah");

        return classMatches && versionMatches;
      }

      // 4. Subject purchase
      if (sub.purchaseType === "Subject") {
        return sub.subjectIds?.some(
          (s) => (s?._id || s || "").toString() === subId.toString(),
        );
      }

      return false;
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <div className="bg-glass p-6 rounded-2xl border shadow-sm flex items-center gap-4">
        <div className="p-3 bg-purple-50 border border-purple-200/60 text-primary rounded-2xl shrink-0">
          <Crown className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            সাবস্ক্রিপশন ও প্যাকেজ
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            আপনার বর্তমান প্যাকেজের স্থিতি, কুপন ছাড় এবং নতুন লাইসেন্স ক্রয়
            করুন।
          </p>
        </div>
      </div>

      {/* Current Active Subscriptions Status */}
      <div className="bg-glass rounded-2xl p-6 border shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <span>আপনার সক্রিয় লাইসেন্স সমূহ</span>
        </h2>

        {subsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-7 animate-spin text-primary" />
          </div>
        ) : activeSubs.length === 0 ? (
          <div className="p-5 rounded-xl border border-purple-100 bg-purple-50/40 flex items-start gap-3">
            <PackageOpen className="size-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                কোনো সক্রিয় লাইসেন্স পাওয়া যায়নি
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                প্রশ্নপত্র তৈরির সম্পূর্ণ অ্যাক্সেস পেতে নিচের প্যাকেজ বা বিষয়
                ক্রয় করুন।
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSubs.map((sub, idx) => (
              <div
                key={idx}
                className="border border-purple-200/60 bg-purple-50/40 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-primary text-white shadow-sm shrink-0">
                      {sub.purchaseType === "Package"
                        ? "গ্রুপ প্যাক"
                        : sub.purchaseType === "Class"
                          ? "শ্রেণি প্যাক"
                          : "বিষয় প্যাক"}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {sub.purchaseType === "Package"
                        ? packagesList.find((p) => p.id === sub.packageId)
                            ?.title || translateSubscriptionKey(sub.packageId)
                        : sub.purchaseType === "Class"
                          ? sub.classNames
                              ?.map((c) => translateSubscriptionKey(c))
                              .join(", ") || ""
                          : "একক বিষয়"}
                    </span>
                  </div>
                  {sub.purchaseType === "Subject" && sub.subjectIds && (
                    <p className="text-xs text-slate-500 font-medium">
                      বিষয়:{" "}
                      <span className="font-semibold text-slate-700">
                        {sub.subjectIds.map((s) => s.subjectName).join(", ")}
                      </span>
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="size-3.5 text-primary shrink-0" />
                    <span>মেয়াদ শেষ: {formatDate(sub.endDate)}</span>
                  </div>
                </div>
                <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
                  <Check className="size-4.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Coupons Showcase - Gorgeous Banner */}
      {couponsList.length > 0 && (
        <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-semibold tracking-wider uppercase border border-white/20">
                <Gift className="size-3.5 text-yellow-300 animate-bounce" />
                <span>বিশেষ কুপন ছাড়</span>
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                কুপন কোড ব্যবহার করে অতিরিক্ত ছাড় পান!
              </h2>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                নিচের কুপন কোডগুলোর যেকোনো একটি কপি করুন এবং পেমেন্ট করার সময়
                ব্যবহার করে অফার উপভোগ করুন।
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {couponsList.map((coupon, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3.5 flex items-center justify-between gap-4 shadow-sm hover:bg-white/15 transition-all min-w-[260px]"
                >
                  <div className="space-y-1 text-left flex-1">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wide">
                        {coupon.discountType === "Percentage"
                          ? `${coupon.value}% ছাড়`
                          : `${coupon.value}৳ ছাড়`}
                      </span>
                      {coupon.minCartAmount > 0 && (
                        <span className="text-[10px] text-white/90 font-medium bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                          ৳{coupon.minCartAmount} ক্রয়ে
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold tracking-widest text-white select-all bg-black/20 px-2.5 py-0.5 rounded-lg border border-white/10">
                        {coupon.code}
                      </span>
                    </div>
                    <div className="text-[10px] text-white/90 font-medium mt-1 bg-white/10 border border-white/10 px-2 py-0.5 rounded-md block text-center">
                      {getCouponScopeText(coupon)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      toast.success(`"${coupon.code}" কুপন কোড কপি করা হয়েছে!`);
                    }}
                    className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-purple-800 rounded-xl transition duration-200 cursor-pointer shrink-0"
                    title="কোড কপি করুন"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex justify-center my-4">
        <div className="bg-glass p-1.5 rounded-2xl border shadow-sm flex gap-2 w-full max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab("packages")}
            className={`flex-1 relative py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "packages"
                ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md shadow-purple-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Package className="size-4" />
            <span>প্যাকেজসমূহ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subjects")}
            className={`flex-1 relative py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "subjects"
                ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md shadow-purple-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Grid className="size-4" />
            <span>বিষয় বাছাই করুন</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Packages List */}
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
                const isActive = selectedVersion === ver.id;
                return (
                  <button
                    key={ver.id}
                    type="button"
                    onClick={() => setSelectedVersion(ver.id)}
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

          {/* Filtered Packages Grid */}
          <PricingCardGrid
            packages={packagesList}
            loading={packagesLoading}
            selectedCategory={selectedCategory}
            selectedVersion={selectedVersion}
            activeSubs={activeSubs}
            categoryIcon={getCategoryIcon(selectedCategory)}
            isPurchasing={loading}
            onSelectPackage={setCheckoutPkg}
          />
        </div>
      )}

      {/* Tab 2: Subject-wise Selector Grid */}
      {activeTab === "subjects" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Class selection pane */}
          <div className="bg-glass p-4 rounded-2xl border shadow-sm space-y-2 h-fit">
            <h3 className="text-sm font-semibold text-slate-800 pb-2.5 border-b flex items-center gap-2">
              <Tag className="size-4 text-primary" />
              <span>শ্রেণি নির্বাচন করুন</span>
            </h3>
            {classes.map((cls) => (
              <button
                key={cls.value}
                onClick={() => setSelectedClass(cls.value)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                  selectedClass === cls.value
                    ? "bg-purple-50 text-purple-700 border border-purple-200/60 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{cls.label}</span>
                <ChevronRight
                  className={`size-4 ${selectedClass === cls.value ? "text-primary" : "text-slate-300"}`}
                />
              </button>
            ))}
          </div>

          {/* Subjects selection grid */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-glass p-6 rounded-2xl border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <BookOpen className="size-4 text-primary" />
                  <span>
                    {classes.find((c) => c.value === selectedClass)?.label} -
                    বিষয় তালিকা
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  প্রতিটি বিষয়ের মূল্য: ১০০/- টাকা (১ বছর)
                </p>
              </div>

              {subjectsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="size-7 animate-spin text-primary" />
                </div>
              ) : allSubjects.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center italic">
                  কোনো বিষয় পাওয়া যায়নি।
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allSubjects.map((sub) => {
                    const isSubscribed = isSubjectSubscribed(
                      sub._id,
                      selectedClass,
                    );
                    const isChecked = selectedSubjects.includes(sub._id);
                    return (
                      <div
                        key={sub._id}
                        onClick={() =>
                          !isSubscribed && handleToggleSubject(sub._id)
                        }
                        className={`p-3.5 border rounded-xl flex items-center justify-between transition cursor-pointer select-none ${
                          isSubscribed
                            ? "border-slate-100 bg-slate-50/50 cursor-default"
                            : isChecked
                              ? "border-purple-300 bg-purple-50/60 text-purple-800 shadow-sm"
                              : "border-slate-200 bg-white/70 hover:border-purple-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isSubscribed ? (
                            <div className="size-4 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <Check className="size-3" />
                            </div>
                          ) : (
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="size-4 rounded text-primary border-slate-300 focus:ring-purple-100 accent-purple-600"
                            />
                          )}
                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {sub.subjectName}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-medium">
                              {sub.version} Version •{" "}
                              {sub.subjectCode || "কোড নেই"}
                            </p>
                          </div>
                        </div>
                        {isSubscribed && (
                          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <Lock className="size-3.5" />
                            ক্রয়কৃত
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Checkout banner for selected subjects */}
            {selectedSubjects.length > 0 && (
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold opacity-90">
                    নির্বাচনকৃত বিষয়: {selectedSubjects.length} টি
                  </h4>
                  <p className="text-xl font-bold mt-0.5">
                    মোট মূল্য: {selectedSubjects.length * 100} টাকা
                  </p>
                </div>
                <button
                  onClick={handleSubjectCheckout}
                  disabled={loading}
                  className="bg-white text-purple-800 hover:bg-purple-50 transition px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>পেমেন্ট করুন ও সচল করুন</span>
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout & Coupon Modal */}
      <Dialog
        open={!!checkoutPkg}
        onOpenChange={(open) => {
          if (!open && !loading) {
            setCheckoutPkg(null);
            setAppliedCoupon(null);
            setCouponCode("");
            setShowCouponInput(false);
          }
        }}
      >
        <DialogContent
          from="top"
          showCloseButton={!loading}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans"
        >
          <div className="px-6 pt-6 pb-5 border-b border-slate-100 flex items-start gap-4 text-left">
            <div className="p-2.5 bg-purple-50 border border-purple-100 text-primary rounded-xl shrink-0 shadow-sm mt-0.5">
              <CreditCard className="size-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="font-semibold text-slate-800 text-base leading-snug">
                {checkoutPkg?.title}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-normal leading-relaxed uppercase tracking-wider">
                প্যাকেজ চেকআউট
              </DialogDescription>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Price breakdown */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 space-y-2 text-left">
              <div className="flex justify-between text-xs text-slate-500">
                <span>মূল দাম</span>
                <span className="font-semibold">
                  {checkoutPkg?.originalPrice}/- টাকা
                </span>
              </div>
              {checkoutPkg?.discount && (
                <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                  <span>
                    প্রোমো ডিসকাউন্ট ({checkoutPkg.discount.value}
                    {checkoutPkg.discount.discountType === "Percentage"
                      ? "%"
                      : " টাকা"}
                    )
                  </span>
                  <span>-{checkoutPkg.discount.amount}/- টাকা</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-xs text-primary font-semibold">
                  <span>কুপন ডিসকাউন্ট ({appliedCoupon.code})</span>
                  <span>-{appliedCoupon.discountAmount}/- টাকা</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-800 font-bold border-t border-slate-200/60 pt-2.5">
                <span>পরিশোধযোগ্য মোট মূল্য</span>
                <span className="text-primary">
                  {(() => {
                    const finalVal = appliedCoupon
                      ? Math.max(
                          0,
                          checkoutPkg?.price - appliedCoupon.discountAmount,
                        )
                      : checkoutPkg?.price;
                    return finalVal === 0 ? "ফ্রি (৳০)" : `${finalVal}/- টাকা`;
                  })()}
                </span>
              </div>
            </div>

            {/* Coupon Code Section */}
            {checkoutPkg?.price > 0 && (
              <div className="space-y-2 text-left">
                <button
                  type="button"
                  onClick={() => setShowCouponInput(!showCouponInput)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-purple-800 transition focus:outline-none cursor-pointer tracking-wide select-none"
                >
                  <span>কুপন কোড প্রয়োগ করুন</span>
                  <ChevronRight
                    className={`size-4 transform transition-transform duration-250 ${
                      showCouponInput ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </button>

                {showCouponInput && (
                  <div className="flex gap-2 animate-in fade-in duration-200 mt-2">
                    <input
                      type="text"
                      placeholder="SAVE20"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      disabled={appliedCoupon || couponLoading}
                      className="flex-1 px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-primary transition-all text-slate-800 uppercase"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-4 h-11 bg-rose-50 text-rose-600 hover:bg-rose-100 transition rounded-xl text-xs font-semibold cursor-pointer border border-rose-100"
                      >
                        মুছে ফেলুন
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 h-11 bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:bg-slate-50 disabled:text-slate-400 transition rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm border border-purple-100/60"
                      >
                        {couponLoading && (
                          <Loader2 className="size-3.5 animate-spin" />
                        )}
                        <span>প্রয়োগ করুন</span>
                      </button>
                    )}
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">
                    {couponError}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setCheckoutPkg(null);
                  setAppliedCoupon(null);
                  setCouponCode("");
                  setShowCouponInput(false);
                }}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition rounded-xl text-xs font-semibold text-slate-600 cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition rounded-xl text-xs font-semibold text-white shadow-md shadow-purple-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading && (
                  <Loader2 className="size-4 animate-spin text-white" />
                )}
                <span>
                  {(() => {
                    const finalVal = appliedCoupon
                      ? Math.max(
                          0,
                          checkoutPkg?.price - appliedCoupon.discountAmount,
                        )
                      : checkoutPkg?.price;
                    return finalVal === 0
                      ? "বিনামূল্যে অ্যাক্টিভেট করুন"
                      : "নিশ্চিত পেমেন্ট করুন";
                  })()}
                </span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
