import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertTriangle,
  Ban,
  Building2,
  CalendarPlus,
  CheckCircle2,
  CreditCard,
  Edit3,
  Eye,
  FileText,
  GraduationCap,
  HelpCircle,
  KeyRound,
  Laptop,
  Loader2,
  LogOut,
  MapPin,
  MessageCircle,
  MessageSquare,
  Monitor,
  PauseCircle,
  Phone,
  PlayCircle,
  Plus,
  PlusCircle,
  Printer,
  ScanLine,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  StickyNote,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  INSTITUTION_TYPE_LABELS,
  STATUS_META,
  VERSION_LABELS,
  formatBengaliDate,
  formatCurrencyBDT,
  formatRelativeTime,
  getRemainingDaysText,
  toWhatsAppPhone,
} from "../constants/subscriberConstants";

const DRAWER_TABS = [
  { id: "overview", label: "প্রোফাইল ও প্রতিষ্ঠান", icon: User },
  { id: "subscriptions", label: "সাবস্ক্রিপশন", icon: CreditCard },
  { id: "orders", label: "অর্ডার ও ইনভয়েস", icon: FileText },
  { id: "usage", label: "ব্যবহার অ্যানালিটিক্স", icon: ScanLine },
  { id: "security", label: "ডিভাইস ও সিকিউরিটি", icon: Laptop },
  { id: "support", label: "টিকিট ও নোটস", icon: StickyNote },
];

export default function SubscriberDetailDrawer({
  open,
  onClose,
  detailsData,
  loading,
  isSuperAdmin,
  onOpenAssign,
  onOpenExtend,
  onToggleSubSuspension,
  onDeleteSub,
  onOpenSuspendAccount,
  onOpenEditProfile,
  onOpenResetPassword,
  onReset2FA,
  onRevokeSession,
  onAddNote,
  onDeleteNote,
  onOpenSms,
  onOpenInvoice,
  onImpersonate,
  mutationsPending,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [noteInput, setNoteInput] = useState("");
  const [nowTs] = useState(() => Date.now());

  if (!open) return null;

  const subscriber = detailsData?.subscriber;
  const orders = detailsData?.orders || [];
  const tickets = detailsData?.tickets || [];
  const usageStats = detailsData?.usageStats || {};
  const packages = detailsData?.packages || [];
  const packageMap = Object.fromEntries(packages.map((p) => [p.packageId, p]));

  const displayName =
    subscriber?.fullName ||
    `${subscriber?.firstName || ""} ${subscriber?.lastName || ""}`.trim() ||
    "সাবস্ক্রাইবার";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const statusInfo =
    STATUS_META[subscriber?.subscriberStatus] || STATUS_META.free;
  const waPhone = toWhatsAppPhone(subscriber?.phoneNumber);

  const getSubTitle = (sub) => {
    if (sub.purchaseType === "Package" && sub.packageId) {
      return packageMap[sub.packageId]?.title || sub.packageId;
    }
    if (sub.purchaseType === "Class") {
      return `শ্রেণি: ${sub.classNames?.join(", ") || "—"}`;
    }
    if (sub.purchaseType === "Subject") {
      const names = (sub.subjectIds || [])
        .map((s) => (typeof s === "object" ? s.subjectName : s))
        .filter(Boolean);
      return names.length > 0
        ? `বিষয়: ${names.join(", ")}`
        : `বিষয় (${sub.subjectIds?.length || 0}টি)`;
    }
    return "সাবস্ক্রিপশন";
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteInput.trim() || !subscriber) return;
    await onAddNote({ userId: subscriber._id, note: noteInput.trim() });
    setNoteInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} aria-hidden />

      <div className="relative z-10 w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-purple-50/30 to-white flex items-start justify-between gap-4">
          {loading || !subscriber ? (
            <div className="flex items-center gap-3 py-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span className="text-sm font-semibold text-slate-600 font-bengali">
                সাবস্ক্রাইবারের তথ্য লোড হচ্ছে...
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-3.5 min-w-0">
              <Avatar className="size-12 rounded-2xl border border-purple-200/70 shrink-0 shadow-xs">
                <AvatarImage
                  src={subscriber.imageUrl}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-purple-50 text-primary font-bold">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                    {displayName}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border font-bengali ${statusInfo.badgeClass}`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${statusInfo.dotClass}`}
                    />
                    {statusInfo.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-700 font-sans">
                    {subscriber.phoneNumber}
                  </span>
                  {subscriber.institutionName && (
                    <>
                      <span>•</span>
                      <span className="font-bengali truncate max-w-[260px]">
                        {subscriber.institutionName}
                      </span>
                    </>
                  )}
                </div>
                {/* Quick Communication & Action Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 font-bengali">
                  <a
                    href={`tel:${subscriber.phoneNumber}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition"
                  >
                    <Phone className="size-3" /> কল
                  </a>
                  {waPhone && (
                    <a
                      href={`https://wa.me/${waPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition"
                    >
                      <MessageCircle className="size-3" /> WhatsApp
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenSms([subscriber])}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition cursor-pointer"
                  >
                    <MessageSquare className="size-3" /> SMS
                  </button>
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => onImpersonate(subscriber)}
                      disabled={mutationsPending.impersonate}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/70 text-[11px] font-bold transition cursor-pointer"
                    >
                      <Eye className="size-3" /> View as User
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer shrink-0"
            aria-label="বন্ধ করুন"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Drawer Tabs */}
        {!loading && subscriber && (
          <>
            <div className="px-4 sm:px-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
              {DRAWER_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer font-bengali ${
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Drawer Tab Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 font-bengali bg-slate-50/30">
              {/* TAB 1: OVERVIEW & INSTITUTION */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {subscriber.isAccountSuspended && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 flex items-start gap-3 text-xs text-rose-800">
                      <AlertTriangle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                      <div>
                        <p className="font-bold">এই অ্যাকাউন্টটি স্থগিত করা রয়েছে</p>
                        {subscriber.accountSuspendedReason && (
                          <p className="mt-0.5 text-rose-700">
                            কারণ: {subscriber.accountSuspendedReason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-800">
                      ব্যক্তিগত ও প্রতিষ্ঠানের তথ্য
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenEditProfile(subscriber)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                      >
                        <Edit3 className="size-3.5" /> তথ্য এডিট করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenSuspendAccount(subscriber)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border ${
                          subscriber.isAccountSuspended
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                            : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        {subscriber.isAccountSuspended ? (
                          <>
                            <CheckCircle2 className="size-3.5" /> অ্যাকাউন্ট সচল করুন
                          </>
                        ) : (
                          <>
                            <Ban className="size-3.5" /> অ্যাকাউন্ট ব্লক করুন
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white rounded-xl border border-slate-200/70 p-3.5 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                        {subscriber.userType === "Institution" ? (
                          <Building2 className="size-3.5" />
                        ) : (
                          <GraduationCap className="size-3.5" />
                        )}
                        সাধারণ পরিচয়
                      </p>
                      <div className="space-y-1.5 text-slate-700">
                        <p>
                          <span className="text-slate-400">ধরন:</span>{" "}
                          <strong>
                            {subscriber.userType === "Institution"
                              ? "প্রতিষ্ঠান (Institution)"
                              : subscriber.userType === "Teacher"
                                ? "শিক্ষক (Teacher)"
                                : "অনবোর্ডিং সম্পন্ন হয়নি"}
                          </strong>
                        </p>
                        {subscriber.designation && (
                          <p>
                            <span className="text-slate-400">পদবি:</span>{" "}
                            {subscriber.designation}
                          </p>
                        )}
                        <p>
                          <span className="text-slate-400">ইমেইল:</span>{" "}
                          <span className="font-sans">
                            {subscriber.email || subscriber.officialEmail || "—"}
                          </span>
                        </p>
                        <p>
                          <span className="text-slate-400">যোগদানের তারিখ:</span>{" "}
                          {formatBengaliDate(subscriber.createdAt)}
                        </p>
                        <p>
                          <span className="text-slate-400">মোট খরচ (LTV):</span>{" "}
                          <strong className="text-primary">
                            {formatCurrencyBDT(subscriber.totalSpent || 0)}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/70 p-3.5 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                        <Building2 className="size-3.5" /> প্রতিষ্ঠানের বিবরণ
                      </p>
                      <div className="space-y-1.5 text-slate-700">
                        <p>
                          <span className="text-slate-400">নাম:</span>{" "}
                          <strong>{subscriber.institutionName || "—"}</strong>
                        </p>
                        <p>
                          <span className="text-slate-400">ধরন ও মিডিয়াম:</span>{" "}
                          {INSTITUTION_TYPE_LABELS[subscriber.institutionType] ||
                            "—"}{" "}
                          {subscriber.institutionMedium
                            ? `(${subscriber.institutionMedium})`
                            : ""}
                        </p>
                        <p>
                          <span className="text-slate-400">EIIN / কোড:</span>{" "}
                          {subscriber.eiin || "—"} /{" "}
                          {subscriber.institutionCode || "—"}
                        </p>
                        <p>
                          <span className="text-slate-400">শিক্ষার্থী সংখ্যা:</span>{" "}
                          {subscriber.studentCountRange || "—"}
                        </p>
                        {subscriber.addressInfo?.fullAddress && (
                          <p className="flex items-start gap-1 text-slate-600 pt-0.5">
                            <MapPin className="size-3.5 shrink-0 mt-0.5 text-slate-400" />
                            <span>
                              {[
                                subscriber.addressInfo.fullAddress,
                                subscriber.addressInfo.upazila,
                                subscriber.addressInfo.district,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SUBSCRIPTIONS */}
              {activeTab === "subscriptions" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">
                      সাবস্ক্রিপশন ও এক্সেসসমূহ (
                      {(subscriber.subscriptions?.length || 0).toLocaleString(
                        "bn-BD",
                      )}
                      )
                    </h3>
                    <button
                      type="button"
                      onClick={() => onOpenAssign(subscriber)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs"
                    >
                      <PlusCircle className="size-3.5" /> নতুন প্ল্যান দিন
                    </button>
                  </div>

                  {!subscriber.subscriptions ||
                  subscriber.subscriptions.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200/70 p-8 text-center text-xs text-slate-400">
                      এই গ্রাহকের কোনো সাবস্ক্রিপশন নেই।
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {subscriber.subscriptions.map((sub) => {
                        const isExpired =
                          new Date(sub.endDate).getTime() <= nowTs;
                        return (
                          <div
                            key={sub._id}
                            className={`bg-white rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              sub.isSuspended
                                ? "border-rose-200 bg-rose-50/30"
                                : isExpired
                                  ? "border-slate-200 opacity-75"
                                  : "border-purple-200/70"
                            }`}
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-xs sm:text-sm font-bold text-slate-800">
                                  {getSubTitle(sub)}
                                </p>
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                                  {VERSION_LABELS[sub.version] || sub.version}
                                </span>
                                {sub.assignedByAdmin?.isManual && (
                                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                    অ্যাডমিন বরাদ্দ
                                  </span>
                                )}
                                {sub.isSuspended && (
                                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                                    স্থগিত
                                  </span>
                                )}
                                {!sub.isSuspended && isExpired && (
                                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-bold">
                                    মেয়াদ শেষ
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500">
                                শুরু: {formatBengaliDate(sub.startDate)} • মেয়াদ শেষ:{" "}
                                <strong className="text-slate-700">
                                  {formatBengaliDate(sub.endDate)}
                                </strong>{" "}
                                ({getRemainingDaysText(sub.endDate)})
                              </p>
                              {sub.assignedByAdmin?.note && (
                                <p className="text-[11px] text-slate-400 italic">
                                  নোট: {sub.assignedByAdmin.note}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenExtend({
                                    user: subscriber,
                                    subscription: sub,
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold cursor-pointer"
                              >
                                <CalendarPlus className="size-3.5" /> মেয়াদ বাড়ান
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onToggleSubSuspension({
                                    userId: subscriber._id,
                                    subscriptionId: sub._id,
                                    payload: { isSuspended: !sub.isSuspended },
                                  })
                                }
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                                  sub.isSuspended
                                    ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                    : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                }`}
                              >
                                {sub.isSuspended ? (
                                  <>
                                    <PlayCircle className="size-3.5" /> চালু করুন
                                  </>
                                ) : (
                                  <>
                                    <PauseCircle className="size-3.5" /> স্থগিত
                                  </>
                                )}
                              </button>
                              {isSuperAdmin && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onDeleteSub({
                                      userId: subscriber._id,
                                      subscriptionId: sub._id,
                                    })
                                  }
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                                  title="সাবস্ক্রিপশন মুছুন"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ORDERS & INVOICES */}
              {activeTab === "orders" && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-800">
                    পেমেন্ট ও অর্ডার হিস্ট্রি (
                    {orders.length.toLocaleString("bn-BD")})
                  </h3>

                  {orders.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200/70 p-8 text-center text-xs text-slate-400">
                      এখনো কোনো অর্ডার বা পেমেন্ট রেকর্ড নেই।
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {orders.map((ord) => (
                        <div
                          key={ord._id}
                          className="bg-white rounded-xl border border-slate-200/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-slate-800">
                                #{ord.orderNumber}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  ord.status === "PAID"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : ord.status === "PENDING"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-rose-50 text-rose-700"
                                }`}
                              >
                                {ord.status}
                              </span>
                            </div>
                            <p className="font-semibold text-slate-700">
                              {ord.packageSnapshot?.title || ord.purchaseType} (
                              {VERSION_LABELS[ord.version] || ord.version})
                            </p>
                            <p className="text-[11px] text-slate-400">
                              তারিখ: {formatBengaliDate(ord.createdAt)} • পেমেন্ট:{" "}
                              <strong className="text-slate-700">
                                {formatCurrencyBDT(ord.finalAmount)}
                              </strong>
                              {ord.discountAmount > 0 &&
                                ` (ছাড়: ${formatCurrencyBDT(ord.discountAmount)})`}
                            </p>
                            {ord.affiliateSnapshot?.affiliateId && (
                              <p className="text-[11px] text-purple-600 font-semibold">
                                অ্যাফিলিয়েট রেফারেল:{" "}
                                {ord.affiliateSnapshot.affiliateId.fullName ||
                                  ord.affiliateSnapshot.couponCode}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenInvoice(ord, subscriber)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-primary hover:text-white text-slate-700 text-[11px] font-bold transition cursor-pointer shrink-0"
                          >
                            <Printer className="size-3.5" /> ইনভয়েস দেখুন
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: USAGE ANALYTICS */}
              {activeTab === "usage" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl border border-slate-200/70 p-4 space-y-1">
                      <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                        <FileText className="size-3.5 text-indigo-500" />{" "}
                        তৈরিকৃত প্রশ্নপত্র
                      </p>
                      <p className="text-2xl font-extrabold text-slate-800">
                        {(usageStats.questionSetsCount || 0).toLocaleString(
                          "bn-BD",
                        )}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200/70 p-4 space-y-1">
                      <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                        <KeyRound className="size-3.5 text-purple-500" /> OMR
                        টোকেন তৈরি
                      </p>
                      <p className="text-2xl font-extrabold text-slate-800">
                        {(usageStats.omrTokensCount || 0).toLocaleString("bn-BD")}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200/70 p-4 space-y-1">
                      <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                        <ScanLine className="size-3.5 text-emerald-500" /> OMR
                        মূল্যায়ন স্ক্যান
                      </p>
                      <p className="text-2xl font-extrabold text-slate-800">
                        {(usageStats.omrEvaluationsCount || 0).toLocaleString(
                          "bn-BD",
                        )}
                      </p>
                    </div>
                  </div>

                  {usageStats.recentQuestionSets?.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200/70 p-4 space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-700">
                        সাম্প্রতিক তৈরিকৃত প্রশ্নপত্র
                      </h4>
                      <div className="divide-y divide-slate-100 text-xs">
                        {usageStats.recentQuestionSets.map((qs) => (
                          <div
                            key={qs._id}
                            className="py-2 flex items-center justify-between gap-2"
                          >
                            <div>
                              <p className="font-bold text-slate-800">
                                {qs.examName}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {qs.className} • {qs.subjectName} ({qs.category})
                              </p>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {formatBengaliDate(qs.createdAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-3.5 text-[11px] text-slate-500 flex items-center gap-2">
                    <Monitor className="size-4 text-slate-400 shrink-0" />
                    <span>
                      অনলাইন পরীক্ষা মডিউল চালু হলে এখানে অনলাইন এক্সামের পরিসংখ্যানও স্বয়ংক্রিয়ভাবে যুক্ত হবে।
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 5: DEVICES & SECURITY */}
              {activeTab === "security" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200/70 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-800 flex items-center gap-1.5">
                        {subscriber.twoFactorEnabled ? (
                          <ShieldCheck className="size-4 text-emerald-600" />
                        ) : (
                          <ShieldOff className="size-4 text-slate-400" />
                        )}
                        ২-স্টেপ ভেরিফিকেশন (2FA):{" "}
                        {subscriber.twoFactorEnabled ? "চালু আছে" : "বন্ধ আছে"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        গ্রাহকের পাসওয়ার্ড ভুলে গেলে বা সিম হারিয়ে গেলে নিচের বাটন থেকে সহায়তা করুন।
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenResetPassword(subscriber)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold cursor-pointer"
                      >
                        <KeyRound className="size-3.5" /> পাসওয়ার্ড রিসেট
                      </button>
                      {subscriber.twoFactorEnabled && (
                        <button
                          type="button"
                          onClick={() => onReset2FA(subscriber._id)}
                          disabled={mutationsPending.reset2FA}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer"
                        >
                          <ShieldAlert className="size-3.5" /> 2FA রিসেট
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700">
                      লগইনকৃত ডিভাইসসমূহ (
                      {(subscriber.deviceSessions?.length || 0).toLocaleString(
                        "bn-BD",
                      )}
                      টি)
                    </h4>
                    {subscriber.deviceSessions?.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          onRevokeSession({ userId: subscriber._id })
                        }
                        disabled={mutationsPending.revokeSession}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer"
                      >
                        <LogOut className="size-3.5" /> সব ডিভাইস লগআউট করান
                      </button>
                    )}
                  </div>

                  {!subscriber.deviceSessions ||
                  subscriber.deviceSessions.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 text-center text-xs text-slate-400">
                      বর্তমানে কোনো অ্যাক্টিভ ডিভাইস সেশন নেই।
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {subscriber.deviceSessions.map((sess) => (
                        <div
                          key={sess.sessionId}
                          className="bg-white rounded-xl border border-slate-200/70 p-3.5 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <p className="font-bold text-slate-800">
                              {sess.deviceType || "Device"} •{" "}
                              {sess.browser || "Browser"} ({sess.os || "OS"})
                            </p>
                            <p className="text-[11px] text-slate-500 font-sans">
                              IP: {sess.ipAddress || "অজানা"} • সক্রিয়:{" "}
                              {formatRelativeTime(sess.lastActiveAt)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              onRevokeSession({
                                userId: subscriber._id,
                                sessionId: sess.sessionId,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-[11px] font-bold cursor-pointer shrink-0"
                          >
                            লগআউট
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: SUPPORT TICKETS & ADMIN NOTES */}
              {activeTab === "support" && (
                <div className="space-y-5">
                  {/* Admin Internal Notes */}
                  <div className="bg-white rounded-xl border border-slate-200/70 p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <StickyNote className="size-4 text-amber-500" /> অ্যাডমিন
                      ইন্টারনাল নোটস (শুধুমাত্র অ্যাডমিনদের জন্য)
                    </h3>

                    <form onSubmit={handleNoteSubmit} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="নতুন নোট লিখুন (যেমন: ফোনে কথা হয়েছে, রিনিউ করবে)..."
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary"
                      />
                      <button
                        type="submit"
                        disabled={mutationsPending.addNote || !noteInput.trim()}
                        className="inline-flex items-center gap-1 px-3.5 h-9 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                      >
                        <Plus className="size-3.5" /> যোগ করুন
                      </button>
                    </form>

                    {subscriber.adminNotes?.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
                        {subscriber.adminNotes.map((n) => (
                          <div
                            key={n._id}
                            className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-start justify-between gap-2 text-xs"
                          >
                            <div className="space-y-0.5">
                              <p className="text-slate-800">{n.note}</p>
                              <p className="text-[10px] text-slate-400">
                                {n.authorName} •{" "}
                                {formatRelativeTime(n.createdAt)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                onDeleteNote({
                                  userId: subscriber._id,
                                  noteId: n._id,
                                })
                              }
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="নোট মুছুন"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        এখনো কোনো ইন্টারনাল নোট যোগ করা হয়নি।
                      </p>
                    )}
                  </div>

                  {/* Support Tickets */}
                  <div className="bg-white rounded-xl border border-slate-200/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <HelpCircle className="size-4 text-indigo-500" /> সাপোর্ট
                        টিকিটসমূহ ({tickets.length.toLocaleString("bn-BD")})
                      </h3>
                      <Link
                        to="/dashboard/support-management"
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        সাপোর্ট সেন্টারে যান <Send className="size-3" />
                      </Link>
                    </div>

                    {tickets.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">
                        এই গ্রাহকের কোনো সাপোর্ট টিকিট নেই।
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {tickets.map((t) => (
                          <div
                            key={t._id}
                            className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <p className="font-bold text-slate-800">
                                #{t.ticketId} — {t.subject}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {t.category} • {formatBengaliDate(t.createdAt)}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
