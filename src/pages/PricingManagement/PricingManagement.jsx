import {
  Calendar,
  ChevronDown,
  Edit2,
  Info,
  Loader2,
  PlusCircle,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { usePricingManagement } from "./hook/usePricingManagement";

export default function PricingManagement() {

  const {
    packages: packagesList,
    loadingPackages: packagesLoading,
    discounts: discountsList,
    loadingDiscounts: discountsLoading,
    updatePackagePrice,
    saveDiscount,
    deleteDiscount,
  } = usePricingManagement();

  const [activeTab, setActiveTab] = useState("packages"); // 'packages' or 'discounts'
  const [selectedCategory, setSelectedCategory] = useState("tutor");
  const [editingPkg, setEditingPkg] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);

  // Dropdown states for Create Modal
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);

  // New Coupon Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("Percentage");
  const [value, setValue] = useState("");
  const [targetType, setTargetType] = useState("All");
  const [targetId, setTargetId] = useState("");
  const [minCartAmount, setMinCartAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const loading = updatePackagePrice.isPending || saveDiscount.isPending || deleteDiscount.isPending;

  const packageCategories = [
    { id: "tutor", label: "১। শিক্ষক/টিউটর প্যাকেজ" },
    { id: "bundle", label: "২। একাডেমিক বান্ডেল প্যাকেজ" },
    { id: "coaching", label: "৩। কোচিং/প্রতিষ্ঠান প্যাকেজ" },
    { id: "school", label: "৪। শ্রেণি ভিত্তিক প্যাকেজ" },
    { id: "teacher-subject", label: "৫। বিষয়ভিত্তিক শিক্ষক প্যাকেজ" },
  ];

  const getCategoryBengali = (catId) => {
    const found = packageCategories.find((c) => c.id === catId);
    if (found) {
      // Strip prefixes like "১। " if present
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
      await updatePackagePrice.mutateAsync({
        id: editingPkg.id,
        basePrice: parseFloat(editPrice)
      });
      toast.success("প্যাকেজের মূল্য সফলভাবে আপডেট করা হয়েছে!");
      setEditingPkg(null);
      setEditPrice("");
    } catch (err) {
      console.error("Error updating price:", err);
      toast.error(err.response?.data?.error || "মূল্য আপডেট করতে ব্যর্থ হয়েছে");
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
        payload
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
      toast.error(err.response?.data?.error || "ডিসকাউন্ট সংরক্ষণ করতে ব্যর্থ হয়েছে");
    }
  };

  const handleStartEditDiscount = (disc) => {
    setEditingDiscount(disc);
    setCode(disc.code || "");
    setDiscountType(disc.discountType || "Percentage");
    setValue(disc.value || "");
    setTargetType(disc.targetType || "All");
    setTargetId(disc.targetId || "");
    setMinCartAmount(disc.minCartAmount || "");
    setStartDate(disc.startDate ? new Date(disc.startDate).toISOString().split('T')[0] : "");
    setEndDate(disc.endDate ? new Date(disc.endDate).toISOString().split('T')[0] : "");
    setUsageLimit(disc.usageLimit || "");
    setShowCreateModal(true);
  };

  // Delete Coupon/Discount
  const handleDeleteDiscount = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ডিসকাউন্টটি মুছে ফেলতে চান?")) return;
    try {
      await deleteDiscount.mutateAsync(id);
      toast.success("ডিসকাউন্ট সফলভাবে মুছে ফেলা হয়েছে!");
    } catch (err) {
      console.error("Error deleting discount:", err);
      toast.error("ডিসকাউন্ট মুছে ফেলতে ব্যর্থ হয়েছে");
    }
  };

  const resetForm = () => {
    setEditingDiscount(null);
    setCode("");
    setDiscountType("Percentage");
    setValue("");
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
    <div className="p-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-800">প্যাকেজ ও ডিসকাউন্ট কন্ট্রোল প্যানেল</h1>
        <p className="text-xs text-slate-400 mt-1">প্যাকেজগুলোর মূল্য পরিবর্তন এবং কুপন/ডিসকাউন্ট কোড পরিচালনা করুন</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab("packages")}
          className={`px-5 py-3 text-xs font-bold transition border-b-2 ${
            activeTab === "packages"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          প্যাকেজ মূল্য নিয়ন্ত্রণ
        </button>
        <button
          onClick={() => setActiveTab("discounts")}
          className={`px-5 py-3 text-xs font-bold transition border-b-2 ${
            activeTab === "discounts"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          ডিসকাউন্ট ও কুপন কোড
        </button>
      </div>

      {/* Tab 1: Package pricing control */}
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

          {/* Grid list of packages */}
          {packagesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
                  <div className="h-10 bg-slate-100 rounded-xl w-full mt-6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packagesList
                .filter((pkg) => pkg.category === selectedCategory)
                .map((pkg) => (
                  <div key={pkg.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{pkg.title}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">{pkg.id}</p>
                      
                      <div className="my-4 p-3 bg-slate-50 border rounded-xl flex items-baseline justify-between">
                        <span className="text-xs text-slate-500 font-bold">বেস প্রাইস:</span>
                        <span className="text-xl font-black text-indigo-600 font-sans">{pkg.originalPrice}/- ৳</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => { setEditingPkg(pkg); setEditPrice(pkg.originalPrice); }}
                      className="w-full mt-2 py-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-100"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      মূল্য পরিবর্তন করুন
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
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-600">কুপন ও ছাড়ের তালিকা</h3>
            <button
              onClick={() => { resetForm(); setShowCreateModal(true); }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="h-4 w-4" />
              নতুন কুপন/ডিসকাউন্ট তৈরি
            </button>
          </div>

          {/* List layout */}
          {discountsLoading ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : discountsList.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 shadow-sm text-center">
              <Info className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">কোনো কুপন বা ডিসকাউন্ট কোড পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discountsList.map((disc) => (
                <div key={disc._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      {disc.code ? (
                        <span className="bg-indigo-50 text-indigo-600 text-xs font-extrabold px-2.5 py-1 rounded-lg font-sans tracking-wide uppercase border border-indigo-100">
                          {disc.code}
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-600 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-emerald-100">
                          প্রোমোশনাল ডিসকাউন্ট
                        </span>
                      )}
                      <p className="text-[10px] text-slate-400 mt-2">তৈরি হয়েছে: {formatDate(disc.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEditDiscount(disc)}
                        className="p-1.5 bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition rounded-lg cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDiscount(disc._id)}
                        className="p-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 transition rounded-lg cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Value and Scope */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400">ছাড়ের পরিমাণ:</p>
                      <p className="text-sm font-black text-slate-800 mt-0.5 font-sans">
                        {disc.discountType === "Percentage" ? `${disc.value}%` : `${disc.value}৳`}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">আওতাভুক্ত পরিধি:</p>
                      <p className="text-sm font-black text-slate-800 mt-0.5">
                        {disc.targetType === "All" && "গ্লোবাল (সব প্যাকেজ)"}
                        {disc.targetType === "SpecificCategory" && `ক্যাটাগরি: ${getCategoryBengali(disc.targetId)}`}
                        {disc.targetType === "SpecificPackage" && `প্যাকেজ: ${getPackageBengali(disc.targetId)}`}
                      </p>
                    </div>
                    {disc.code && (
                      <>
                        <div>
                          <p className="text-slate-400">নূন্যতম ক্রয়সীমা:</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5 font-sans">
                            {disc.minCartAmount || 0} ৳
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">ব্যবহৃত হয়েছে:</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5 font-sans">
                            {disc.usedCount} {disc.usageLimit ? `/ ${disc.usageLimit}` : "বার"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Period info */}
                  <div className="p-2.5 bg-slate-50 border rounded-xl flex items-center justify-between text-[11px] text-slate-500 font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      শুরু: {formatDate(disc.startDate)}
                    </span>
                    <span>
                      শেষ: {formatDate(disc.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Price Modal */}
      <Dialog open={!!editingPkg} onOpenChange={(open) => {
        if (!open && !loading) {
          setEditingPkg(null);
          setEditPrice("");
        }
      }}>
        <DialogContent
          from="top"
          showCloseButton={!loading}
          className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative"
        >
          <div className="px-6 pt-6 pb-5 border-b border-slate-100 flex items-start gap-4 text-left">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl shrink-0 shadow-sm">
              <Edit2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="font-extrabold text-slate-800 text-base leading-snug">{editingPkg?.title}</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-normal leading-relaxed uppercase tracking-wider font-sans">প্যাকেজ আইডি: {editingPkg?.id}</DialogDescription>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">নতুন বেস প্রাইস (৳)</label>
              <input
                type="number"
                placeholder="যেমন: ৭০০"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 text-slate-700 shadow-sm focus:bg-white hover:border-slate-300"
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setEditingPkg(null); setEditPrice(""); }}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 transition rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleUpdatePrice}
                disabled={loading}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl text-xs font-bold text-white shadow shadow-indigo-500/10 flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                আপডেট করুন
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Discount/Coupon Modal */}
      <Dialog open={showCreateModal} onOpenChange={(open) => {
        if (!open && !loading) {
          setShowCreateModal(false);
          resetForm();
        }
      }}>
        <DialogContent
          from="top"
          showCloseButton={!loading}
          className="max-w-lg p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative max-h-[90vh] overflow-y-auto"
        >
           <div className="px-6 pt-6 pb-5 border-b border-slate-100 flex items-start gap-4 text-left">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl shrink-0 shadow-sm">
              {editingDiscount ? <Edit2 className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
            </div>
            <div className="space-y-1">
              <DialogTitle className="font-extrabold text-slate-800 text-base leading-snug">
                {editingDiscount ? "ডিসকাউন্ট/কুপন কোড সংশোধন করুন" : "নতুন ডিসকাউন্ট/কুপন তৈরি করুন"}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-normal leading-relaxed">
                {editingDiscount ? "অফারের নতুন প্রকারভেদ, মূল্য এবং মেয়াদ নির্ধারণ করুন" : "অফারের প্রকারভেদ, মূল্য এবং মেয়াদ নির্ধারণ করুন"}
              </DialogDescription>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Code */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">কুপন কোড (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="SAVE30"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 text-slate-700 shadow-sm focus:bg-white hover:border-slate-300 uppercase font-sans"
                />
              </div>

              {/* Discount Type */}
              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">ডিসকাউন্ট টাইপ</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    className="w-full px-4 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50/50 hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm cursor-pointer"
                  >
                    <span>{discountType === "Percentage" ? "শতকরা ছাড় (%)" : "ফ্ল্যাট ছাড় (৳)"}</span>
                    <ChevronDown className={`size-4 text-slate-400 transition-transform duration-300 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isTypeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]">
                      {[
                        { value: "Percentage", label: "শতকরা ছাড় (%)" },
                        { value: "Flat", label: "ফ্ল্যাট ছাড় (৳)" }
                      ].map((opt) => {
                        const isSelected = discountType === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setDiscountType(opt.value); setIsTypeDropdownOpen(false); }}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer hover:bg-slate-50/80 ${
                              isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <span className="size-1.5 rounded-full bg-indigo-500" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Value */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">ডিসকাউন্ট মান (৳ / %)</label>
                <input
                  type="number"
                  placeholder="যেমন: ৩০"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 text-slate-700 shadow-sm focus:bg-white hover:border-slate-300 font-sans"
                />
              </div>

              {/* Minimum Purchase */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">নূন্যতম ক্রয়সীমা (৳)</label>
                <input
                  type="number"
                  placeholder="যেমন: ৫০০"
                  value={minCartAmount}
                  onChange={(e) => setMinCartAmount(e.target.value)}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 text-slate-700 shadow-sm focus:bg-white hover:border-slate-300 font-sans"
                />
              </div>

              {/* Scope Target Type */}
              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">ছাড়ের পরিধি</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
                    className="w-full px-4 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50/50 hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm cursor-pointer"
                  >
                    <span>
                      {targetType === "All" && "গ্লোবাল (সবার জন্য)"}
                      {targetType === "SpecificCategory" && "ক্যাটাগরি ভিত্তিক"}
                      {targetType === "SpecificPackage" && "নির্দিষ্ট প্যাকেজ"}
                    </span>
                    <ChevronDown className={`size-4 text-slate-400 transition-transform duration-300 ${isScopeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isScopeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]">
                      {[
                        { value: "All", label: "গ্লোবাল (সবার জন্য)" },
                        { value: "SpecificCategory", label: "ক্যাটাগরি ভিত্তিক" },
                        { value: "SpecificPackage", label: "নির্দিষ্ট প্যাকেজ" }
                      ].map((opt) => {
                        const isSelected = targetType === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setTargetType(opt.value); setTargetId(""); setIsScopeDropdownOpen(false); }}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer hover:bg-slate-50/80 ${
                              isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <span className="size-1.5 rounded-full bg-indigo-500" />}
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    সিলেক্ট করুন
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsTargetDropdownOpen(!isTargetDropdownOpen)}
                      className="w-full px-4 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50/50 hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm cursor-pointer text-left"
                    >
                      <span className="truncate">
                        {targetType === "SpecificCategory"
                          ? (packageCategories.find((c) => c.id === targetId)?.label || "ক্যাটাগরি নির্বাচন করুন")
                          : (packagesList.find((p) => p.id === targetId)?.title || "প্যাকেজ নির্বাচন করুন")}
                      </span>
                      <ChevronDown className={`size-4 text-slate-400 transition-transform duration-300 ${isTargetDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isTargetDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] max-h-[220px] overflow-y-auto">
                        {targetType === "SpecificCategory" ? (
                          packageCategories.map((c) => {
                            const isSelected = targetId === c.id;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => { setTargetId(c.id); setIsTargetDropdownOpen(false); }}
                                className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer hover:bg-slate-50/80 ${
                                  isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                                }`}
                              >
                                <span>{c.label}</span>
                                {isSelected && <span className="size-1.5 rounded-full bg-indigo-500" />}
                              </button>
                            );
                          })
                        ) : (
                          packagesList.map((p) => {
                            const isSelected = targetId === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => { setTargetId(p.id); setIsTargetDropdownOpen(false); }}
                                className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer hover:bg-slate-50/80 ${
                                  isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                                }`}
                              >
                                <span className="truncate">{p.title}</span>
                                {isSelected && <span className="size-1.5 rounded-full bg-indigo-500" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">শুরুর তারিখ</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 text-slate-700 shadow-sm focus:bg-white hover:border-slate-300 font-sans"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">শেষের তারিখ</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 text-slate-700 shadow-sm focus:bg-white hover:border-slate-300 font-sans"
                />
              </div>

              {/* Usage Limit */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">সর্বোচ্চ ব্যবহার সীমা (ঐচ্ছিক)</label>
                <input
                  type="number"
                  placeholder="যেমন: ১০০"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  className="w-full px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 text-slate-700 shadow-sm focus:bg-white hover:border-slate-300 font-sans"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 transition rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveDiscount}
                disabled={loading}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl text-xs font-bold text-white shadow shadow-indigo-500/10 flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
