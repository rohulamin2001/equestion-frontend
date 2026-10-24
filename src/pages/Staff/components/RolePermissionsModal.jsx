import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  FolderOpen,
  HelpCircle,
  Info,
  LayoutDashboard,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  FEATURE_CATEGORIES,
  ROLE_CONFIGS,
  ROLE_KEYS,
} from "../constants/rolePermissions";

const ORDERED_ROLES = [
  ROLE_KEYS.SUPER_ADMIN,
  ROLE_KEYS.ADMIN,
  ROLE_KEYS.CONTENT_MANAGER,
  ROLE_KEYS.QUESTION_CREATOR,
  ROLE_KEYS.SUPPORT_TEAM,
  ROLE_KEYS.SUBSCRIBER,
];

const CATEGORY_ICONS = {
  "ওভারভিউ": LayoutDashboard,
  "প্রশ্ন ইঞ্জিন": Sparkles,
  "মূল্যায়ন": FolderOpen,
  "ব্যবস্থাপনা": Users,
  "সহায়তা": HelpCircle,
};

export default function RolePermissionsModal({
  isOpen,
  onOpenChange,
  initialRoleKey = ROLE_KEYS.CONTENT_MANAGER,
}) {
  const [selectedRoleKey, setSelectedRoleKey] = useState(initialRoleKey);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'allowed' | 'restricted'
  const [activeCategory, setActiveCategory] = useState("all");

  const activeRole =
    ROLE_CONFIGS[selectedRoleKey] || ROLE_CONFIGS[ROLE_KEYS.CONTENT_MANAGER];

  // Calculate statistics
  const allowedCount = useMemo(
    () => activeRole.features.filter((f) => f.allowed).length,
    [activeRole]
  );
  const restrictedCount = useMemo(
    () => activeRole.features.length - allowedCount,
    [activeRole, allowedCount]
  );

  // Filter features based on search, status and category
  const filteredFeatures = useMemo(() => {
    return activeRole.features.filter((feat) => {
      // Status filter
      if (statusFilter === "allowed" && !feat.allowed) return false;
      if (statusFilter === "restricted" && feat.allowed) return false;

      // Category filter
      if (activeCategory !== "all" && feat.category !== activeCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = feat.name.toLowerCase().includes(query);
        const matchCategory = feat.category.toLowerCase().includes(query);
        const matchDesc = feat.description?.toLowerCase().includes(query);
        if (!matchName && !matchCategory && !matchDesc) return false;
      }

      return true;
    });
  }, [activeRole, statusFilter, activeCategory, searchQuery]);

  // Group filtered features by category
  const groupedFeatures = useMemo(() => {
    const groups = {};
    filteredFeatures.forEach((feat) => {
      if (!groups[feat.category]) {
        groups[feat.category] = [];
      }
      groups[feat.category].push(feat);
    });
    return groups;
  }, [filteredFeatures]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        from="top"
        className="max-w-4xl p-0 border border-slate-200/80 overflow-hidden bg-white/95 backdrop-blur-2xl shadow-2xl rounded-2xl relative"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 flex flex-col space-y-0 text-left bg-gradient-to-r from-slate-50/70 via-indigo-50/20 to-white">
          <div className="flex items-start gap-3.5 pr-8">
            <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl shrink-0 shadow-sm shadow-primary/5">
              <Shield className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-bold text-slate-800 text-lg tracking-tight flex items-center gap-2">
                রোল ও পারমিশন ডিরেক্টরি
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  ২৪টি ফিচার ম্যাট্রিক্স
                </span>
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs mt-1 leading-relaxed font-bengali">
                স্টাফ বা ব্যবহারকারীদের পদবি পরিবর্তনের পূর্বে সিস্টেমের প্রতিটি ফিচারের অনুমোদিত ও সীমাবদ্ধ স্ট্যাটাস যাচাই করে নিন।
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Role Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {ORDERED_ROLES.map((roleKey) => {
              const conf = ROLE_CONFIGS[roleKey];
              const isSelected = selectedRoleKey === roleKey;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => {
                    setSelectedRoleKey(roleKey);
                    // keep filter or reset if desired
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm scale-[1.02]"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full transition-all ${
                      isSelected
                        ? "bg-white ring-2 ring-white/30"
                        : conf.dotColor
                    }`}
                  />
                  <span>{conf.bengaliTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 py-5 max-h-[66vh] overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* Active Role Overview Card */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${activeRole.badgeColor}`}
                >
                  {activeRole.bengaliTitle} ({activeRole.title})
                </span>
                <span className="text-xs text-slate-400 font-sans">•</span>
                <span className="text-xs font-medium text-slate-600 font-bengali">
                  {activeRole.tagline}
                </span>
              </div>

              {/* Status Summary Pill */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  {allowedCount}টি অনুমোদিত
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                  <XCircle className="size-3 text-slate-400" />
                  {restrictedCount}টি সীমাবদ্ধ
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-[13px] mt-3 leading-relaxed font-bengali">
              {activeRole.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-sans">
              <Sparkles className="size-3.5 text-amber-500" />
              প্রধান দায়িত্ব ও ভূমিকা (Key Responsibilities)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {activeRole.responsibilities.map((resp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 text-xs text-slate-700 font-bengali leading-snug"
                >
                  <span className="size-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Features Filter & Search Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-sans">
                <ShieldAlert className="size-3.5 text-indigo-500" />
                সকল ফিচার ও পারমিশন স্ট্যাটাস ({filteredFeatures.length}টি ফিচার)
              </h4>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    statusFilter === "all"
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  সকল ({activeRole.features.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("allowed")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    statusFilter === "allowed"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  অনুমোদিত ({allowedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("restricted")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    statusFilter === "restricted"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  সীমাবদ্ধ ({restrictedCount})
                </button>
              </div>
            </div>

            {/* Live Search and Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ফিচারের নাম দিয়ে ফিল্টার করুন (যেমন: প্রশ্ন, ওএমআর, স্টাফ)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition whitespace-nowrap ${
                    activeCategory === "all"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  সকল ক্যাটাগরি
                </button>
                {FEATURE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition whitespace-nowrap ${
                      activeCategory === cat
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorized Features List */}
            {Object.keys(groupedFeatures).length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-slate-100 text-xs font-bengali">
                কোনো ফিচার পাওয়া যায়নি।
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {FEATURE_CATEGORIES.filter((cat) => groupedFeatures[cat]).map(
                  (category) => {
                    const CategoryIcon =
                      CATEGORY_ICONS[category] || LayoutDashboard;
                    const feats = groupedFeatures[category];

                    return (
                      <div key={category} className="space-y-2">
                        {/* Category Heading */}
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-1 pt-1">
                          <CategoryIcon className="size-3.5 text-slate-400" />
                          <h5 className="text-xs font-bold text-slate-700 font-sans">
                            {category}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-medium">
                            ({feats.length}টি ফিচার)
                          </span>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {feats.map((feat) => (
                            <div
                              key={feat.id}
                              className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                                feat.allowed
                                  ? "bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/70"
                                  : "bg-slate-50/60 border-slate-200/70 opacity-65 hover:opacity-90"
                              }`}
                            >
                              {feat.allowed ? (
                                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="size-4 text-slate-400 shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span
                                    className={`text-xs font-bold truncate ${
                                      feat.allowed
                                        ? "text-slate-900"
                                        : "text-slate-600"
                                    }`}
                                  >
                                    {feat.name}
                                  </span>
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
                                      feat.allowed
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                        : "bg-slate-200/70 text-slate-600 border border-slate-200"
                                    }`}
                                  >
                                    {feat.allowed ? "অনুমোদিত" : "সীমাবদ্ধ"}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-bengali leading-snug mt-0.5 line-clamp-2">
                                  {feat.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* Super Admin Notice if applicable */}
          {selectedRoleKey === ROLE_KEYS.SUPER_ADMIN && (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-800 text-xs font-bengali flex items-start gap-2">
              <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                সুপার এডমিন রোলটি শুধুমাত্র প্রধান সিস্টেম অ্যাডমিনিস্ট্রেটরদের জন্য নির্ধারিত। এই রোলের মেম্বাররা অন্য যে কারো পদবি পরিবর্তন ও স্টাফদের অ্যাকাউন্ট মুছে ফেলার পূর্ণ ক্ষমতা রাখেন।
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-bengali">
            সাইডবার ও রুট পারমিশন অনুযায়ী রিয়েল-টাইম তথ্য প্রদর্শিত হচ্ছে।
          </span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
