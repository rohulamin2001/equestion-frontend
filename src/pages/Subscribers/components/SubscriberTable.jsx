import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ban,
  Building2,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  FileText,
  GraduationCap,
  Laptop,
  Loader2,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Phone,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  STATUS_META,
  VERSION_LABELS,
  formatBengaliDate,
  formatCurrencyBDT,
  formatRelativeTime,
  getRemainingDaysText,
  toWhatsAppPhone,
} from "../constants/subscriberConstants";

export default function SubscriberTable({
  subscribers,
  loading,
  error,
  refetch,
  page,
  pages,
  total,
  setPage,
  selectedIds,
  setSelectedIds,
  onOpenDetail,
  onOpenAssign,
  onOpenExtend,
  onOpenSms,
  onOpenSuspend,
  onImpersonate,
  isSuperAdmin,
}) {
  const allOnPageSelected =
    subscribers.length > 0 &&
    subscribers.every((s) => selectedIds.includes(s._id));

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !subscribers.some((s) => s._id === id)),
      );
    } else {
      const nextIds = new Set(selectedIds);
      subscribers.forEach((s) => nextIds.add(s._id));
      setSelectedIds(Array.from(nextIds));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-sm text-slate-500 font-bengali">
            সাবস্ক্রাইবার তালিকা লোড হচ্ছে...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-3">
          <p className="text-sm font-bold text-rose-600 font-bengali">
            তালিকা লোড করা যায়নি
          </p>
          <button
            type="button"
            onClick={refetch}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer font-bengali"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-2">
          <Users className="size-10 text-slate-300" />
          <p className="text-sm font-bold text-slate-700 font-bengali">
            কোনো সাবস্ক্রাইবার পাওয়া যায়নি
          </p>
          <p className="text-xs text-slate-400 font-bengali">
            অন্য কোনো ফিল্টার বা সার্চ কিওয়ার্ড দিয়ে চেষ্টা করুন।
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-bengali">
                  <th className="pl-4 pr-2 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={toggleSelectAll}
                      className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      aria-label="সব নির্বাচন করুন"
                    />
                  </th>
                  <th className="px-4 py-3.5">সাবস্ক্রাইবার ও প্রতিষ্ঠান</th>
                  <th className="px-4 py-3.5">যোগাযোগ</th>
                  <th className="px-4 py-3.5">সাবস্ক্রিপশন ও স্ট্যাটাস</th>
                  <th className="px-4 py-3.5">মোট খরচ ও উৎস</th>
                  <th className="px-4 py-3.5">অ্যাক্টিভিটি ও ডিভাইস</th>
                  <th className="px-4 py-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.map((subUser) => {
                  const displayName =
                    subUser.fullName ||
                    `${subUser.firstName || ""} ${subUser.lastName || ""}`.trim() ||
                    "নামহীন ব্যবহারকারী";
                  const initials = displayName
                    .split(" ")
                    .filter(Boolean)
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  const statusInfo =
                    STATUS_META[subUser.subscriberStatus] || STATUS_META.free;
                  const isSelected = selectedIds.includes(subUser._id);
                  const expiryDate =
                    subUser.nearestActiveExpiry || subUser.latestExpiryDate;
                  const remainingText = getRemainingDaysText(expiryDate);
                  const waPhone = toWhatsAppPhone(subUser.phoneNumber);

                  return (
                    <tr
                      key={subUser._id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      <td className="pl-4 pr-2 py-3.5 align-top pt-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(subUser._id)}
                          className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                          aria-label={`${displayName} নির্বাচন করুন`}
                        />
                      </td>

                      {/* Identity */}
                      <td className="px-4 py-3.5 align-top">
                        <div
                          onClick={() => onOpenDetail(subUser._id)}
                          className="flex items-start gap-3 cursor-pointer group"
                        >
                          <Avatar className="size-10 rounded-xl border border-slate-200/80 shrink-0">
                            <AvatarImage
                              src={subUser.imageUrl}
                              alt={displayName}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-purple-50 text-primary text-xs font-bold">
                              {initials || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition truncate max-w-[190px]">
                                {displayName}
                              </span>
                              {subUser.userType === "Institution" ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[10px] font-bold">
                                  <Building2 className="size-2.5" /> প্রতিষ্ঠান
                                </span>
                              ) : subUser.userType === "Teacher" ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200/60 text-[10px] font-bold">
                                  <GraduationCap className="size-2.5" /> শিক্ষক
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-semibold">
                                  অনবোর্ডিং বাকি
                                </span>
                              )}
                            </div>

                            {subUser.institutionName && (
                              <p className="text-[11px] text-slate-500 truncate max-w-[230px] mt-0.5 font-bengali">
                                {subUser.institutionName}
                                {subUser.eiin ? ` • EIIN: ${subUser.eiin}` : ""}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                              <span>
                                যোগদান: {formatBengaliDate(subUser.createdAt)}
                              </span>
                              {subUser.twoFactorEnabled && (
                                <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
                                  <ShieldCheck className="size-3" /> 2FA
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-700 font-sans">
                              {subUser.phoneNumber}
                            </span>
                            <a
                              href={`tel:${subUser.phoneNumber}`}
                              title="সরাসরি কল করুন"
                              className="p-1 rounded-md bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition"
                            >
                              <Phone className="size-3" />
                            </a>
                            {waPhone && (
                              <a
                                href={`https://wa.me/${waPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                title="WhatsApp-এ মেসেজ দিন"
                                className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition"
                              >
                                <MessageCircle className="size-3" />
                              </a>
                            )}
                          </div>
                          {(subUser.email || subUser.officialEmail) && (
                            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {subUser.email || subUser.officialEmail}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Subscription & Status */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="space-y-1.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-bengali ${statusInfo.badgeClass}`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${statusInfo.dotClass}`}
                            />
                            {statusInfo.label}
                          </span>

                          {subUser.primaryPlanTitle ? (
                            <div className="text-xs">
                              <p className="font-bold text-slate-700 truncate max-w-[180px]">
                                {subUser.primaryPlanTitle}
                                {subUser.totalSubscriptionsCount > 1 && (
                                  <span className="ml-1 text-[10px] font-semibold text-primary">
                                    (+
                                    {(
                                      subUser.totalSubscriptionsCount - 1
                                    ).toLocaleString("bn-BD")}
                                    টি)
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-500 font-bengali">
                                {VERSION_LABELS[subUser.primaryPlanVersion] ||
                                  subUser.primaryPlanVersion ||
                                  ""}
                                {remainingText ? ` • ${remainingText}` : ""}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic font-bengali">
                              কোনো সাবস্ক্রিপশন নেই
                            </p>
                          )}
                        </div>
                      </td>

                      {/* LTV & Attribution */}
                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-slate-800">
                            {formatCurrencyBDT(subUser.totalSpent || 0)}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bengali">
                            {(subUser.paidOrdersCount || 0).toLocaleString("bn-BD")}
                            টি পেইড অর্ডার
                          </p>
                          {(subUser.referralCoupon ||
                            subUser.hasAffiliateReferral) && (
                            <span className="inline-block px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200/70 text-[10px] font-bold">
                              {subUser.referralCoupon
                                ? `কুপন: ${subUser.referralCoupon}`
                                : "অ্যাফিলিয়েট রেফারেল"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Activity & Devices */}
                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <div className="space-y-1 text-[11px] text-slate-600 font-bengali">
                          <p className="font-semibold text-slate-700">
                            {formatRelativeTime(subUser.lastActiveAt)}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <Laptop className="size-3" />
                              {(subUser.activeDevicesCount || 0).toLocaleString(
                                "bn-BD",
                              )}{" "}
                              ডিভাইস
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <FileText className="size-3" />
                              {(subUser.questionSetsCount || 0).toLocaleString(
                                "bn-BD",
                              )}{" "}
                              প্রশ্নপত্র
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="px-4 py-3.5 align-top text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenDetail(subUser._id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-primary hover:text-white text-slate-700 text-[11px] font-bold transition cursor-pointer font-bengali"
                          >
                            <Eye className="size-3.5" />
                            <span>বিস্তারিত</span>
                          </button>

                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer"
                                aria-label="আরও অ্যাকশন"
                              >
                                <MoreVertical className="size-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-52 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 text-xs font-bengali z-50"
                            >
                              <DropdownMenuItem
                                onSelect={() => onOpenAssign(subUser)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                              >
                                <PlusCircle className="size-3.5 text-primary" />
                                <span>নতুন প্ল্যান বরাদ্দ দিন</span>
                              </DropdownMenuItem>

                              {subUser.subscriptions?.length > 0 && (
                                <DropdownMenuItem
                                  onSelect={() =>
                                    onOpenExtend({
                                      user: subUser,
                                      subscription: subUser.subscriptions[0],
                                    })
                                  }
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                                >
                                  <CalendarPlus className="size-3.5 text-emerald-600" />
                                  <span>মেয়াদ বাড়ান / কমান</span>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                onSelect={() => onOpenSms([subUser])}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                              >
                                <MessageSquare className="size-3.5 text-indigo-600" />
                                <span>SMS পাঠান</span>
                              </DropdownMenuItem>

                              {isSuperAdmin && (
                                <DropdownMenuItem
                                  onSelect={() => onImpersonate(subUser)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                                >
                                  <CreditCard className="size-3.5 text-amber-600" />
                                  <span>View as User (প্রিভিউ)</span>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator className="my-1 bg-slate-100" />

                              <DropdownMenuItem
                                onSelect={() => onOpenSuspend(subUser)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${
                                  subUser.isAccountSuspended
                                    ? "text-emerald-600"
                                    : "text-rose-600"
                                }`}
                              >
                                {subUser.isAccountSuspended ? (
                                  <>
                                    <CheckCircle2 className="size-3.5" />
                                    <span>অ্যাকাউন্ট সচল করুন</span>
                                  </>
                                ) : (
                                  <>
                                    <Ban className="size-3.5" />
                                    <span>অ্যাকাউন্ট স্থগিত করুন</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="px-4 py-3.5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 font-bengali">
              <p className="text-xs text-slate-500">
                মোট{" "}
                <strong className="text-slate-700">
                  {total.toLocaleString("bn-BD")}
                </strong>{" "}
                জন সাবস্ক্রাইবার — পৃষ্ঠা{" "}
                <strong className="text-slate-700">
                  {page.toLocaleString("bn-BD")}
                </strong>{" "}
                / {pages.toLocaleString("bn-BD")}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>পূর্ববর্তী</span>
                </button>
                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  <span>পরবর্তী</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
