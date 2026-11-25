import {
  CalendarPlus,
  Download,
  Loader2,
  MessageSquare,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

const STATUS_TABS = [
  { id: "all", label: "সকল" },
  { id: "active", label: "সক্রিয়" },
  { id: "expiring_soon", label: "মেয়াদ শেষ হচ্ছে" },
  { id: "expired", label: "মেয়াদোত্তীর্ণ" },
  { id: "free", label: "ফ্রি / লিডস" },
  { id: "suspended", label: "স্থগিত" },
];

export default function SubscriberFiltersBar({
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
  userTypeFilter,
  setUserTypeFilter,
  versionFilter,
  setVersionFilter,
  packageFilter,
  setPackageFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  sortBy,
  setSortBy,
  packages,
  resetAllFilters,
  onExportCsv,
  exporting,
  selectedCount,
  onClearSelection,
  onOpenBulkSms,
  onOpenBulkExtend,
}) {
  const hasActiveFilters =
    searchInput ||
    statusFilter !== "all" ||
    userTypeFilter !== "all" ||
    versionFilter !== "all" ||
    packageFilter !== "all" ||
    dateFrom ||
    dateTo ||
    sortBy !== "newest";

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3.5">
        {/* Top Row: Search + Export */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="নাম, মোবাইল নম্বর, ইমেইল, প্রতিষ্ঠানের নাম বা EIIN দিয়ে খুঁজুন..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/40 focus:bg-white"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="সার্চ মুছুন"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer font-bengali"
              >
                <RotateCcw className="size-3.5" />
                <span>রিসেট</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExportCsv}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-700 text-xs font-bold transition cursor-pointer disabled:opacity-50 font-bengali"
            >
              {exporting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              <span>CSV এক্সপোর্ট</span>
            </button>
          </div>
        </div>

        {/* Middle Row: Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-bengali transition cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bottom Row: Dropdown Filters & Date Range */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 border-t border-slate-100">
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="all">সব ধরন (শিক্ষক/প্রতিষ্ঠান)</option>
            <option value="Teacher">শিক্ষক (Teacher)</option>
            <option value="Institution">প্রতিষ্ঠান (Institution)</option>
            <option value="unset">অনবোর্ডিং অসম্পূর্ণ</option>
          </select>

          <select
            value={versionFilter}
            onChange={(e) => setVersionFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="all">সব ভার্সন</option>
            <option value="Bangla">বাংলা ভার্সন</option>
            <option value="English">ইংরেজি ভার্সন</option>
            <option value="Madrasah">মাদ্রাসা ভার্সন</option>
          </select>

          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="all">সব প্যাকেজ</option>
            {packages.map((pkg) => (
              <option key={pkg.packageId} value={pkg.packageId}>
                {pkg.title} ({pkg.version})
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="যোগদানের তারিখ (হতে)"
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-primary"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            title="যোগদানের তারিখ (পর্যন্ত)"
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-primary"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="newest">সর্বশেষ যোগদান</option>
            <option value="oldest">সবার আগে যোগদান</option>
            <option value="spent_desc">সর্বোচ্চ পেমেন্ট (LTV)</option>
            <option value="expiry_asc">আগে মেয়াদ শেষ</option>
            <option value="last_active">সর্বশেষ সক্রিয়</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedCount > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg font-bengali">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary text-white text-xs">
              {selectedCount.toLocaleString("bn-BD")}
            </span>
            <span>জন সাবস্ক্রাইবার নির্বাচিত হয়েছে</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenBulkSms}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition cursor-pointer"
            >
              <MessageSquare className="size-3.5" />
              <span>বাল্ক SMS পাঠান</span>
            </button>
            <button
              type="button"
              onClick={onOpenBulkExtend}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold transition cursor-pointer"
            >
              <CalendarPlus className="size-3.5" />
              <span>বাল্ক মেয়াদ বাড়ান</span>
            </button>
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition cursor-pointer"
            >
              <X className="size-3.5" />
              <span>বাতিল</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
