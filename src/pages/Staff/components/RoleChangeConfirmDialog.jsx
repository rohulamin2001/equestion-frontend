import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MinusCircle,
  ShieldAlert,
} from "lucide-react";
import {
  ROLE_CONFIGS,
  ROLE_KEYS,
  getRoleDiff,
} from "../constants/rolePermissions";

export default function RoleChangeConfirmDialog({
  pendingChange,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) {
  if (!pendingChange) return null;

  const { memberName, oldRole, newRole } = pendingChange;
  const oldConf = ROLE_CONFIGS[oldRole] || {
    bengaliTitle: oldRole,
    title: oldRole,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  };
  const newConf = ROLE_CONFIGS[newRole] || {
    bengaliTitle: newRole,
    title: newRole,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const { gained, lost } = getRoleDiff(oldRole, newRole);
  const isHighPrivilege =
    newRole === ROLE_KEYS.SUPER_ADMIN || newRole === ROLE_KEYS.ADMIN;

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => !open && !isLoading && onClose()}
    >
      <AlertDialogPopup className="max-w-lg p-0 border border-slate-200/80 bg-white/95 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <AlertDialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/20 text-left">
          <div className="flex items-start gap-3.5 pr-8">
            <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl shrink-0 shadow-sm shadow-primary/5">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <AlertDialogTitle className="font-bold text-slate-900 text-[17px] tracking-tight">
                পদবি (রোল) পরিবর্তন নিশ্চিতকরণ
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 text-xs mt-1 font-bengali">
                ব্যবহারকারীর পদবি পরিবর্তনের সাথে সাথে সিস্টেমে তার অ্যাক্সেস ও
                দায়িত্ব স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে।
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4 text-xs font-bengali scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* Member Card & Role Transition */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                স্টাফ মেম্বার
              </span>
              <span className="font-bold text-slate-800 text-[13px]">
                {memberName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
              <div className="flex-1 text-center p-2 rounded-lg bg-white border border-slate-200">
                <span className="block text-[10px] text-slate-400 font-medium mb-1">
                  বর্তমান পদবি
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${oldConf.badgeColor}`}
                >
                  {oldConf.bengaliTitle}
                </span>
              </div>

              <div className="shrink-0 p-1 rounded-full bg-slate-200/80 text-slate-500">
                <ArrowRight className="size-3.5" />
              </div>

              <div className="flex-1 text-center p-2 rounded-lg bg-white border border-slate-200">
                <span className="block text-[10px] text-slate-400 font-medium mb-1">
                  নতুন পদবি
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${newConf.badgeColor}`}
                >
                  {newConf.bengaliTitle}
                </span>
              </div>
            </div>
          </div>

          {/* Gained Permissions */}
          {gained.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>নতুন যেসব সুবিধা ও এক্সেস পাবেন ({gained.length}টি):</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc text-emerald-900 text-[11px] font-medium leading-relaxed max-h-44 overflow-y-auto scrollbar-thin">
                {gained.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Lost Permissions */}
          {lost.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <MinusCircle className="size-4 text-amber-600" />
                <span>যেসব সুবিধার এক্সেস আর থাকবে না ({lost.length}টি):</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc text-amber-900 text-[11px] font-medium leading-relaxed max-h-44 overflow-y-auto scrollbar-thin">
                {lost.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* High Privilege Warning */}
          {isHighPrivilege && (
            <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-800 text-[11px] flex items-start gap-2">
              <AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              <span>
                <strong>সতর্কতা:</strong> {newConf.bengaliTitle} রোলটি
                প্ল্যাটফর্মের অত্যন্ত সংবেদনশীল সেটিংস ও ইউজার ডেটা নিয়ন্ত্রণ
                করতে পারে। শুধুমাত্র নির্ভরযোগ্য ব্যক্তিকে এই ক্ষমতা প্রদান
                করুন।
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <AlertDialogFooter className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2.5">
          <AlertDialogCancel
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            বাতিল করুন
          </AlertDialogCancel>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/95 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                আপডেট হচ্ছে...
              </>
            ) : (
              "হ্যাঁ, রোল পরিবর্তন নিশ্চিত করুন"
            )}
          </button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
