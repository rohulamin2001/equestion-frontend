import { useAuth } from "@clerk/react";
import {
  Calendar,
  Check,
  ChevronRight,
  Copy,
  Grid,
  Info,
  Loader2,
  Lock,
  Package,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserContext } from "../../context/UserContext";
import apiClient from "../../lib/apiClient";
import { useSubscription } from "./hook/useSubscription";

export default function Subscription() {
  const { refreshProfile } = useUserContext();
  const { getToken } = useAuth();
  
  const {
    packages: packagesList,
    coupons: couponsList,
    loadingPackages: packagesLoading,
    mySubscriptions: userSubs,
    loadingSubscriptions: subsLoading,
    validateCoupon,
    purchaseSubscription,
  } = useSubscription();

  const [activeTab, setActiveTab] = useState("packages"); // 'packages' or 'subjects'
  const [allSubjects, setAllSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Class 7");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("tutor");

  const [checkoutPkg, setCheckoutPkg] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

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

  const classes = [
    { value: "Class 3", label: "৩য় শ্রেণী" },
    { value: "Class 4", label: "৪র্থ শ্রেণী" },
    { value: "Class 5", label: "৫ম শ্রেণী" },
    { value: "Class 6", label: "৬ষ্ঠ শ্রেণী" },
    { value: "Class 7", label: "৭ম শ্রেণী" },
    { value: "Class 8", label: "৮ম শ্রেণী" },
    { value: "Class 9", label: "৯ম শ্রেণী" },
    { value: "Class 10", label: "১০ম শ্রেণী" },
    { value: "Class 11", label: "একাদশ শ্রেণী" },
    { value: "Class 12", label: "দ্বাদশ শ্রেণী" },
  ];

  const packageCategories = [
    { id: "tutor", label: "১। শিক্ষক/টিউটর প্যাকেজ" },
    { id: "bundle", label: "২। একাডেমিক বান্ডেল প্যাকেজ" },
    { id: "coaching", label: "৩। কোচিং/প্রতিষ্ঠান প্যাকেজ" },
    { id: "school", label: "৪। শ্রেণি ভিত্তিক প্যাকেজ" },
    { id: "teacher-subject", label: "৫। বিষয়ভিত্তিক শিক্ষক প্যাকেজ" }
  ];

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
        cartTotal: checkoutPkg.price
      });
      setAppliedCoupon(res);
      toast.success("কুপন কোড সফলভাবে প্রয়োগ করা হয়েছে!");
    } catch (err) {
      console.error("Coupon validation error:", err);
      setCouponError(err.response?.data?.error || "কুপন কোডটি অবৈধ বা মেয়াদোত্তীর্ণ");
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
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          cartTotal: checkoutPkg.price
        }
      : {
          purchaseType: "Package",
          packageId: checkoutPkg.id,
          classNames: checkoutPkg.classes,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          cartTotal: checkoutPkg.price
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
      toast.error(err.response?.data?.error || "ক্রয় সম্পন্ন করতে ব্যর্থ হয়েছে");
    }
  };

  const handleSubjectCheckout = () => {
    setCheckoutPkg({
      id: "subject-custom-pack",
      title: `বিষয় প্যাক (${selectedSubjects.length} টি বিষয়)`,
      price: selectedSubjects.length * 100,
      originalPrice: selectedSubjects.length * 100,
      classes: [selectedClass],
      subjectIds: selectedSubjects,
      isSubjectPack: true
    });
  };

  // Fetch subjects of selected class
  const fetchClassSubjects = async (className) => {
    try {
      setSubjectsLoading(true);
      const token = await getToken();
      const res = await apiClient.get(`/subjects?className=${className}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllSubjects(res.data.subjects || []);
      setSelectedSubjects([]); // Reset subject selection
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    return userSubs.some((sub) => {
      if (!sub.isActive || new Date(sub.endDate) < now) return false;

      // Fallback check for teacher package
      if (sub.packageId && sub.packageId.startsWith("teacher-")) {
        const pkgKey = sub.packageId;
        const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
        if (classes.includes(className)) {
          if (pkgKey === "teacher-bangla-6-10" && /বাংলা|Bangla/i.test(subjectName)) return true;
          if (pkgKey === "teacher-math-6-10" && /গণিত|Math/i.test(subjectName)) return true;
          if (pkgKey === "teacher-science-6-10" && /বিজ্ঞান|Science/i.test(subjectName)) return true;
          if (pkgKey === "teacher-english-6-10" && /English|ইংরেজি/i.test(subjectName)) return true;
          if (pkgKey === "teacher-ict-6-10" && /আইসিটি|ICT/i.test(subjectName)) return true;
          if (pkgKey === "teacher-bgs-6-10" && /বাংলাদেশ ও বিশ্বপরিচয়|BGS|Bangladesh/i.test(subjectName)) return true;
          if (pkgKey === "teacher-islam-6-10" && /ইসলাম শিক্ষা|Islam/i.test(subjectName)) return true;
          if (pkgKey === "teacher-agriculture-6-10" && /কৃষি শিক্ষা|Agri/i.test(subjectName)) return true;
        }
      }

      if (sub.purchaseType === "Package" || sub.purchaseType === "Class") {
        return sub.classNames?.includes(className);
      }
      if (sub.purchaseType === "Subject") {
        return sub.subjectIds?.some((s) => (s._id || s) === subId);
      }
      return false;
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-bengali">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
          সাবস্ক্রিপশন ও প্যাকেজ
        </h1>
        <p className="text-sm text-slate-500">
          আপনার বর্তমান প্যাকেজের স্থিতি, বিলিং তথ্য এবং নতুন প্যাকেজ ক্রয় করুন
        </p>
      </div>

      {/* Current Active Subscriptions Status */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
          আপনার সক্রিয় লাইসেন্স সমূহ
        </h2>

        {subsLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        ) : userSubs.length === 0 ? (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
            <Info className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-700">
                কোনো সক্রিয় লাইসেন্স পাওয়া যায়নি
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                প্রশ্নপত্র তৈরির সম্পূর্ণ অ্যাক্সেস পেতে নিচের প্যাকেজ বা বিষয়
                ক্রয় করুন।
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userSubs.map((sub, idx) => (
              <div
                key={idx}
                className="border border-indigo-50 bg-indigo-50/10 p-4 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-md">
                      {sub.purchaseType === "Package"
                        ? "গ্রুপ প্যাক"
                        : sub.purchaseType === "Class"
                          ? "শ্রেণি প্যাক"
                          : "বিষয় প্যাক"}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {sub.packageId
                        ? packagesList.find((p) => p.id === sub.packageId)
                            ?.title
                        : sub.classNames?.[0] || "একক বিষয়"}
                    </span>
                  </div>
                  {sub.purchaseType === "Subject" && sub.subjectIds && (
                    <p className="text-xs text-slate-400 mt-1">
                      বিষয়:{" "}
                      <span className="font-semibold text-slate-600">
                        {sub.subjectIds.map((s) => s.subjectName).join(", ")}
                      </span>
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>মেয়াদ শেষ: {formatDate(sub.endDate)}</span>
                  </div>
                </div>
                <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Coupons Showcase - Gorgeous & Animated Banner */}
      {couponsList.length > 0 && (
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/10 overflow-hidden relative group">
          {/* Subtle background animated sparkles */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black tracking-wider uppercase border border-white/20 animate-pulse">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
                বিশেষ অফার
              </span>
              <h2 className="text-xl font-extrabold tracking-tight">কুপন কোড ব্যবহার করে অতিরিক্ত ছাড় পান!</h2>
              <p className="text-xs text-white/80 leading-relaxed font-semibold">
                নিচের কুপন কোডগুলোর যেকোনো একটি কপি করুন এবং পেমেন্ট করার সময় ব্যবহার করে ছাড় উপভোগ করুন।
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {couponsList.map((coupon, idx) => (
                <div 
                  key={idx}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-wide">
                      {coupon.discountType === "Percentage" ? `${coupon.value}% ছাড়` : `${coupon.value}৳ ছাড়`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black tracking-widest text-yellow-300 select-all">
                        {coupon.code}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      toast.success(`"${coupon.code}" কুপন কোড কপি করা হয়েছে!`);
                    }}
                    className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-indigo-600 rounded-xl transition duration-200 active:scale-95 shadow-inner cursor-pointer"
                    title="কোড কপি করুন"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab("packages")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "packages"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Package className="h-4 w-4" />
          প্যাকেজসমূহ
        </button>
        <button
          onClick={() => setActiveTab("subjects")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "subjects"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Grid className="h-4 w-4" />
          বিষয় বাছাই করুন
        </button>
      </div>

      {/* Tab 1: Packages List */}
      {activeTab === "packages" && (
        <div className="space-y-6">
          {/* Sub-tabs / Categories Selector */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            {packageCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filtered Packages Grid */}
          {packagesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
                  <div className="my-4 h-8 bg-slate-100 rounded-md w-1/2"></div>
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <div className="h-3 bg-slate-100 rounded-md w-5/6"></div>
                    <div className="h-3 bg-slate-100 rounded-md w-4/6"></div>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-xl w-full mt-6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packagesList
                .filter((pkg) => pkg.category === selectedCategory)
                .map((pkg) => {
                  const isSubscribed = userSubs.some((s) => s.packageId === pkg.id);
                return (
                  <div
                    key={pkg.id}
                    className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition relative overflow-hidden ${
                      isSubscribed
                        ? "border-indigo-200 ring-1 ring-indigo-100"
                        : "border-slate-100 hover:border-indigo-400"
                    }`}
                  >
                    {pkg.price === 0 && !isSubscribed && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase tracking-wider py-1 px-3.5 rounded-bl-xl shadow-md animate-pulse">
                        ফ্রি ক্যাম্পেইন
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        {pkg.title}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
                        {pkg.version}
                      </p>

                      <div className="my-4 flex items-baseline gap-2">
                        {pkg.price === 0 ? (
                          <>
                            <span className="text-2xl font-black text-orange-600 font-sans">
                              ফ্রি (৳০)
                            </span>
                            <span className="text-xs text-slate-400 line-through font-sans">
                              {pkg.originalPrice}/-
                            </span>
                            <span className="bg-orange-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md animate-pulse">
                              ফ্রি অফার
                            </span>
                          </>
                        ) : pkg.price !== pkg.originalPrice ? (
                          <>
                            <span className="text-2xl font-black text-indigo-600 font-sans">
                              {pkg.price}/-
                            </span>
                            <span className="text-xs text-slate-400 line-through font-sans">
                              {pkg.originalPrice}/-
                            </span>
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md font-sans">
                              {pkg.discount?.discountType === "Percentage" 
                                ? `${pkg.discount.value}% ছাড়` 
                                : `${pkg.discount.value}৳ ছাড়`}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl font-black text-indigo-600 font-sans">
                              {pkg.price}/-
                            </span>
                            <span className="text-xs text-slate-400 font-sans">
                              টাকা / {pkg.period}
                            </span>
                          </>
                        )}
                      </div>

                      <ul className="space-y-2 mt-4 border-t border-slate-100 pt-4">
                        {pkg.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-slate-600"
                          >
                            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setCheckoutPkg(pkg)}
                      disabled={loading || isSubscribed}
                      className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                        isSubscribed
                          ? "bg-emerald-50 text-emerald-600 cursor-default"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/10"
                      }`}
                    >
                      {isSubscribed ? (
                        <>
                          <Check className="h-4 w-4" />
                          সক্রিয় রয়েছে
                        </>
                      ) : (
                        <>
                          {pkg.price === 0 ? "বিনামূল্যে অ্যাক্টিভেট করুন" : "ক্রয় করুন"}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
          </div>
          )}
        </div>
      )}

      {/* Tab 2: Subject-wise Selector Grid */}
      {activeTab === "subjects" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Class selection pane */}
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm space-y-2 h-fit">
            <h3 className="text-sm font-bold text-slate-800 pb-2 border-b">
              শ্রেণি নির্বাচন করুন
            </h3>
            {classes.map((cls) => (
              <button
                key={cls.value}
                onClick={() => setSelectedClass(cls.value)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                  selectedClass === cls.value
                    ? "bg-indigo-50 text-indigo-600 font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{cls.label}</span>
                <ChevronRight
                  className={`h-4 w-4 ${selectedClass === cls.value ? "text-indigo-500" : "text-slate-300"}`}
                />
              </button>
            ))}
          </div>

          {/* Subjects selection grid */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h3 className="text-sm font-bold text-slate-800">
                  {classes.find((c) => c.value === selectedClass)?.label} - বিষয়
                  তালিকা
                </h3>
                <p className="text-[10px] text-slate-400">
                  প্রতিটি বিষয়ের মূল্য: ১০০/- টাকা (১ বছর)
                </p>
              </div>

              {subjectsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                </div>
              ) : allSubjects.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
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
                              ? "border-indigo-400 bg-indigo-50/10"
                              : "border-slate-100 hover:border-indigo-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isSubscribed ? (
                            <div className="h-4 w-4 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <Check className="h-3 w-3" />
                            </div>
                          ) : (
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="h-4 w-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500/20"
                            />
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              {sub.subjectName}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider font-sans">
                              {sub.version} Version • {sub.subjectCode}
                            </p>
                          </div>
                        </div>
                        {isSubscribed && (
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Lock className="h-3.5 w-3.5 text-slate-400" />
                            ক্রয়কৃত
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Check out pane */}
            {selectedSubjects.length > 0 && (
              <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg shadow-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold opacity-80">
                    নির্বাচনকৃত বিষয়: {selectedSubjects.length} টি
                  </h4>
                  <p className="text-xl font-black mt-1 font-sans">
                    মোট মূল্য: {selectedSubjects.length * 100} টাকা
                  </p>
                </div>
                <button
                  onClick={handleSubjectCheckout}
                  disabled={loading}
                  className="bg-white text-indigo-700 hover:bg-indigo-50 transition px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  পেমেন্ট করুন ও সচল করুন
                  <ChevronRight className="h-4 w-4 text-indigo-700" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Checkout & Coupon Modal */}
      <Dialog open={!!checkoutPkg} onOpenChange={(open) => {
        if (!open && !loading) {
          setCheckoutPkg(null);
          setAppliedCoupon(null);
          setCouponCode("");
        }
      }}>
        <DialogContent
          from="top"
          showCloseButton={!loading}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative"
        >
          <div className="px-6 pt-6 pb-5 border-b border-slate-100 flex items-start gap-4 text-left">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl shrink-0 shadow-sm mt-0.5">
              <Package className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="font-extrabold text-slate-800 text-base leading-snug">{checkoutPkg?.title}</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-normal leading-relaxed uppercase tracking-wider font-sans">প্যাকেজ চেকআউট</DialogDescription>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Price breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-left">
              <div className="flex justify-between text-xs text-slate-500">
                <span>মূল দাম</span>
                <span className="font-semibold font-sans">{checkoutPkg?.originalPrice}/- টাকা</span>
              </div>
              {checkoutPkg?.discount && (
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>প্রোমো ডিসকাউন্ট ({checkoutPkg.discount.value}{checkoutPkg.discount.discountType === "Percentage" ? "%" : " টাকা"})</span>
                  <span className="font-semibold font-sans">-{checkoutPkg.discount.amount}/- টাকা</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-xs text-indigo-600 font-bold">
                  <span>কুপন ডিসকাউন্ট ({appliedCoupon.code})</span>
                  <span className="font-semibold font-sans">-{appliedCoupon.discountAmount}/- টাকা</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-800 font-black border-t border-slate-200/60 pt-2.5">
                <span>পরিশোধযোগ্য মোট মূল্য</span>
                <span className="font-sans text-indigo-600">
                  {(() => {
                    const finalVal = appliedCoupon 
                      ? Math.max(0, checkoutPkg?.price - appliedCoupon.discountAmount) 
                      : checkoutPkg?.price;
                    return finalVal === 0 ? "ফ্রি (৳০)" : `${finalVal}/- টাকা`;
                  })()}
                </span>
              </div>
            </div>

            {/* Coupon Code Section */}
            {checkoutPkg?.price > 0 && (
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">কুপন কোড প্রয়োগ করুন</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="SAVE20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={appliedCoupon || couponLoading}
                    className="flex-1 px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 text-slate-700 shadow-sm focus:bg-white hover:border-slate-300 uppercase font-sans"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="px-4 h-11 bg-rose-50 text-rose-600 hover:bg-rose-100 transition rounded-xl text-xs font-bold cursor-pointer"
                    >
                      মুছে ফেলুন
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 h-11 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:bg-slate-50 disabled:text-slate-400 transition rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm border border-indigo-100/30"
                    >
                      {couponLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      প্রয়োগ করুন
                    </button>
                  )}
                </div>
                {couponError && <p className="text-[10px] text-rose-500 font-bold">{couponError}</p>}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setCheckoutPkg(null); setAppliedCoupon(null); setCouponCode(""); }}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 transition rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={loading}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {(() => {
                  const finalVal = appliedCoupon 
                    ? Math.max(0, checkoutPkg?.price - appliedCoupon.discountAmount) 
                    : checkoutPkg?.price;
                  return finalVal === 0 ? "বিনামূল্যে অ্যাক্টিভেট করুন" : "নিশ্চিত পেমেন্ট করুন";
                })()}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
