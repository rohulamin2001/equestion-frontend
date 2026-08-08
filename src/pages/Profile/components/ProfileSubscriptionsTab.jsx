import {
  Calendar,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { translateSubscriptionKey } from "../../../constants/subscriptions";

export default function ProfileSubscriptionsTab({ profile }) {
  const { mySubs, mySubsLoading, packagesList, formatDate } = profile;

  return (
    <div className="bg-glass-elevated backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-soft space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-xs sm:text-base font-bold text-slate-800 flex items-center gap-2 mb-1 text-left font-bengali">
          <div className="p-2 bg-purple-100/60 text-[var(--purple-700)] rounded-xl shrink-0 border border-purple-200/60">
            <Sparkles className="size-4 sm:size-5" />
          </div>
          আপনার সক্রিয় লাইসেন্স সমূহ
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 text-left mb-4 sm:mb-6 font-bengali font-medium">
          আপনার অ্যাকাউন্টে সক্রিয় সাবস্ক্রিপশন এবং বিষয়ভিত্তিক লাইসেন্সসমূহের তালিকা
        </p>
      </div>

      {mySubsLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 sm:size-8 animate-spin text-[var(--purple-600)]" />
        </div>
      ) : (
        (() => {
          const activeSubs = mySubs.filter(
            (sub) =>
              sub.isActive &&
              !sub.isSuspended &&
              new Date(sub.endDate) >= new Date(),
          );
          if (activeSubs.length === 0) {
            return (
              <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-100/80 flex items-start gap-3 text-left font-bengali">
                <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl shrink-0">
                  <ShieldCheck className="size-5 sm:size-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    কোনো সক্রিয় লাইসেন্স পাওয়া যায়নি
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
                    প্রশ্নপত্র তৈরির সম্পূর্ণ অ্যাক্সেস পেতে দয়া করে সাবস্ক্রিপশন প্যানেল থেকে কোনো প্যাকেজ বা বিষয় ক্রয় করুন।
                  </p>
                </div>
              </div>
            );
          }
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-left font-bengali">
              {activeSubs.map((sub, idx) => (
                <div
                  key={idx}
                  className="border border-purple-200/70 bg-purple-50/40 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 sm:gap-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-purple-100/80 text-[var(--purple-700)] text-[9.5px] sm:text-[10px] font-bold rounded-lg whitespace-nowrap shrink-0 border border-purple-200/60 font-sans">
                        {sub.purchaseType === "Package"
                          ? "গ্রুপ প্যাক"
                          : sub.purchaseType === "Class"
                            ? "শ্রেণি প্যাক"
                            : "বিষয় প্যাক"}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
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
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 truncate">
                        বিষয়:{" "}
                        <span className="font-bold text-slate-700">
                          {sub.subjectIds.map((s) => s.subjectName).join(", ")}
                        </span>
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 mt-2.5 font-sans font-medium">
                      <Calendar className="size-3.5 shrink-0 text-[var(--purple-600)]" />
                      <span>মেয়াদ শেষ: {formatDate(sub.endDate)}</span>
                    </div>
                  </div>
                  <div className="size-9 sm:size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm border border-emerald-200/60">
                    <CheckCircle2 className="size-5" />
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
}
