import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  Loader2,
  Lock,
  LogOut,
  MoreHorizontal,
  Save,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import Sms2FADisableModal from "../../../components/auth/Sms2FADisableModal";
import Sms2FASetupModal from "../../../components/auth/Sms2FASetupModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useSms2FA } from "../hook/useSms2FA";

export default function ProfileSecurityTab({ profile }) {
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [isEnableConfirmOpen, setIsEnableConfirmOpen] = useState(false);
  const [phoneNumberMasked, setPhoneNumberMasked] = useState("");

  const { sendEnableOtp } = useSms2FA();
  const is2FAEnabled = Boolean(profile?.userProfile?.twoFactorEnabled);

  const handleConfirmEnable2FA = () => {
    setIsEnableConfirmOpen(false);
    sendEnableOtp.mutate(undefined, {
      onSuccess: (data) => {
        setPhoneNumberMasked(data.phoneNumberMasked || "");
        setIsSetupModalOpen(true);
      },
    });
  };

  const {
    currentPassword,
    setCurrentPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordLoading,
    showPasswordForm,
    setShowPasswordForm,
    sessionToRevoke,
    setSessionToRevoke,
    activeSessions,
    sessionsLoading,
    currentSessionId,
    handlePasswordSubmit,
    generateSecurePassword,
    confirmRevokeSession,
    formatSessionDate,
    getSessionInfo,
  } = profile;

  return (
    <div className="space-y-6">
      {/* Custom Password Update Card */}
      <div className="bg-glass-elevated backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 gap-2">
          <h3 className="text-xs sm:text-base font-bold text-slate-800 flex items-center gap-2 font-bengali">
            <div className="p-2 bg-purple-100/60 text-[var(--purple-700)] rounded-xl shrink-0 border border-purple-200/60">
              <KeyRound className="size-4 sm:size-5" />
            </div>
            পাসওয়ার্ড পরিবর্তন করুন
          </h3>
          <button
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-[11px] sm:text-xs font-bold text-[var(--purple-700)] hover:text-[var(--purple-900)] px-3 py-1.5 rounded-xl hover:bg-purple-100/60 transition-all duration-200 shrink-0 border border-purple-200/40 cursor-pointer"
          >
            {showPasswordForm ? "বাতিল করুন" : "আপডেট করুন"}
          </button>
        </div>

        {showPasswordForm && (
          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-4 font-bengali pt-2 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Password - Full Width */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">
                  বর্তমান পাসওয়ার্ড <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans shadow-sm transition-all"
                    placeholder="আপনার বর্তমান পাসওয়ার্ড লিখুন"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center h-6">
                  <label className="text-xs font-semibold text-slate-600">
                    নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateSecurePassword}
                    className="text-[10px] font-bold text-[var(--purple-700)] hover:text-[var(--purple-900)] flex items-center gap-1 transition-all duration-200 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    পাসওয়ার্ড জেনারেট করুন
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans shadow-sm transition-all"
                    placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  * পাসওয়ার্ডে অন্তত ৮টি অক্ষর, একটি বড় হাতের অক্ষর, একটি ছোট
                  হাতের অক্ষর, একটি সংখ্যা এবং একটি বিশেষ চিহ্নের সংমিশ্রণ থাকতে
                  হবে।
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center h-6">
                  <label className="text-xs font-semibold text-slate-600">
                    নতুন পাসওয়ার্ড পুনরায় নিশ্চিত করুন{" "}
                    <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans shadow-sm transition-all"
                    placeholder="পাসওয়ার্ড পুনরায় টাইপ করুন"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-3 w-full">
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] shadow-md shadow-purple-600/25 hover:shadow-lg hover:shadow-purple-600/35 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    পাসওয়ার্ড আপডেট করুন
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Security Card */}
      <div className="bg-glass-elevated backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-soft space-y-4 font-bengali">
        <h3 className="text-xs sm:text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/60 pb-3">
          <div className="p-2 bg-purple-100/60 text-[var(--purple-700)] rounded-xl shrink-0 border border-purple-200/60">
            <ShieldCheck className="size-4 sm:size-5" />
          </div>
          অ্যাকাউন্ট নিরাপত্তা সুরক্ষা
        </h3>

        <div className="flex items-center justify-between gap-3 p-3.5 bg-purple-50/40 rounded-xl border border-purple-100/80">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100/60 text-[var(--green-700)] rounded-lg shrink-0 mt-0.5 h-fit">
              <Lock className="size-4.5" />
            </div>
            <div>
              {" "}
              <p className="text-xs sm:text-sm font-bold text-slate-800 font-sans tracking-tight">
                এনক্রিপ্টেড
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bengali mt-0.5">
                আপনার অ্যাকাউন্টটি এনক্রিপ্টেড টোকেন এবং বহু-ডিভাইস সুরক্ষা
                ব্যবস্থার মাধ্যমে সুরক্ষিত।
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 whitespace-nowrap shrink-0">
            <CheckCircle2 className="size-3 sm:size-3.5" />
            সুরক্ষিত
          </span>
        </div>

        {/* 2FA Toggle & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50/60 rounded-xl border border-slate-200/80">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 text-[var(--purple-700)] rounded-lg shrink-0 mt-0.5 h-fit">
              <Smartphone className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-bold text-slate-800 font-sans tracking-tight">
                  ২-স্টেপ টু-ফ্যাক্টর নিরাপত্তা (2FA)
                </p>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap ${
                    is2FAEnabled
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                      : "bg-amber-50 text-amber-600 border-amber-200/60"
                  }`}
                >
                  {is2FAEnabled ? "সক্রিয় রয়েছে" : "নিষ্ক্রিয় রয়েছে"}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bengali mt-0.5">
                লগইনের সময় নিবন্ধিত ফোন নম্বরে পাঠানো ৬ ডিজিটের OTP ব্যবহার করে
                দ্বিস্তরী নিরাপত্তা প্রদান করে।
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-end">
            {is2FAEnabled ? (
              <button
                type="button"
                onClick={() => setIsDisableModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 transition cursor-pointer"
              >
                2FA বন্ধ করুন
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEnableConfirmOpen(true)}
                disabled={sendEnableOtp.isPending}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {sendEnableOtp.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    OTP পাঠানো হচ্ছে...
                  </>
                ) : (
                  "2FA সক্রিয় করুন"
                )}
              </button>
            )}
          </div>
        </div>

        {/* 2FA Enable Confirmation Modal */}
        <AlertDialog
          open={isEnableConfirmOpen}
          onOpenChange={setIsEnableConfirmOpen}
        >
          <AlertDialogPopup className="p-4 sm:p-6 max-w-[92vw] sm:max-w-md rounded-2xl">
            <AlertDialogHeader className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
              <AlertDialogTitle className="text-sm sm:text-lg font-bold text-slate-900 font-bengali">
                টু-ফ্যাক্টর নিরাপত্তা (2FA) সক্রিয় করুন
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 font-bengali leading-relaxed">
                আপনি কি নিশ্চিতভাবে আপনার অ্যাকাউন্টে টু-ফ্যাক্টর নিরাপত্তা
                (2FA) সক্রিয় করতে চান? নিশ্চিত করলে আপনার নিবন্ধিত ফোন নম্বরে
                একটি OTP কোড পাঠানো হবে।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row justify-end gap-2 space-x-0 mt-4 sm:mt-6 pt-3 border-t border-slate-100/80">
              <AlertDialogCancel className="mt-0 flex-1 sm:flex-initial h-9 sm:h-10 text-xs sm:text-sm rounded-xl px-3 sm:px-4 font-bengali">
                বাতিল করুন
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmEnable2FA}
                className="mt-0 flex-1 sm:flex-initial h-9 sm:h-10 text-xs sm:text-sm rounded-xl px-3 sm:px-4 font-bengali bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] text-white hover:from-[var(--purple-900)] hover:to-[var(--purple-700)] cursor-pointer whitespace-nowrap"
              >
                হ্যাঁ, 2FA সক্রিয় করুন
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialog>

        <Sms2FASetupModal
          open={isSetupModalOpen}
          onOpenChange={setIsSetupModalOpen}
          phoneNumberMasked={phoneNumberMasked}
          onSuccess={() => profile?.refreshProfile?.()}
        />

        <Sms2FADisableModal
          open={isDisableModalOpen}
          onOpenChange={setIsDisableModalOpen}
          onSuccess={() => profile?.refreshProfile?.()}
        />
      </div>

      {/* Custom Active Sessions / Devices Card */}
      <div className="bg-glass-elevated backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-soft space-y-4">
        <h3 className="text-xs sm:text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/60 pb-3 font-bengali">
          <div className="p-2 bg-purple-100/60 text-[var(--purple-700)] rounded-xl shrink-0 border border-purple-200/60">
            <Laptop className="size-4 sm:size-5" />
          </div>
          সক্রিয় সেশন ও ডিভাইস ট্র্যাকিং
        </h3>

        <div className="space-y-3 font-bengali">
          {sessionsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-6 text-[var(--purple-600)] animate-spin" />
            </div>
          ) : (
            activeSessions.map((session) => {
              const isCurrent =
                (session.sessionId && session.sessionId === currentSessionId) ||
                (session.id && session.id === currentSessionId) ||
                (session._id && session._id === currentSessionId);
              const { os, browser, IconComponent } = getSessionInfo(session);
              const rawIp =
                session.ipAddress || session.latestActivity?.ipAddress || "";
              const ipDisplay =
                rawIp === "::1" || rawIp === "127.0.0.1"
                  ? `${rawIp} (লোকালহোস্ট)`
                  : rawIp || "অজানা আইপি";

              return (
                <div
                  key={session._id || session.sessionId || session.id}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all gap-2 ${
                    isCurrent
                      ? "border-purple-200/80 bg-purple-50/40 shadow-sm"
                      : "border-slate-200/60 bg-white/40 hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${
                        isCurrent
                          ? "bg-gradient-to-br from-[var(--purple-700)] to-[var(--purple-600)] text-white shadow-md shadow-purple-600/20"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <IconComponent className="size-4 sm:size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-800 font-sans tracking-tight truncate">
                          {os}
                        </h5>
                        {isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 whitespace-nowrap shrink-0 flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            বর্তমানে সক্রিয়
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-600 font-sans font-medium mt-0.5 truncate">
                        ব্রাউজার:{" "}
                        <span className="text-slate-800 font-semibold">
                          {browser}
                        </span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">
                        আইপি এড্রেস:{" "}
                        <span className="font-sans font-semibold text-slate-600">
                          {ipDisplay}
                        </span>
                      </p>
                      <p className="text-[9.5px] sm:text-[11px] text-slate-400 mt-0.5">
                        সর্বশেষ সক্রিয়:{" "}
                        <span className="font-sans text-slate-500">
                          {formatSessionDate(
                            session.lastActiveAt ||
                              session.createdAt ||
                              session.latestActivity?.updatedAt,
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-purple-100/60 hover:text-[var(--purple-700)] transition focus:outline-none cursor-pointer">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl p-1 z-50"
                      >
                        <DropdownMenuItem
                          onClick={() => setSessionToRevoke(session)}
                          variant="destructive"
                          className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 font-sans cursor-pointer text-xs flex items-center gap-1.5 rounded-lg px-3 py-2"
                        >
                          <LogOut className="size-3.5" />
                          লগআউট করুন
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <AlertDialog
          open={!!sessionToRevoke}
          onOpenChange={(open) => !open && setSessionToRevoke(null)}
        >
          <AlertDialogPopup className="p-4 sm:p-6 max-w-[92vw] sm:max-w-md rounded-2xl">
            <AlertDialogHeader className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
              <AlertDialogTitle className="text-sm sm:text-lg font-bold text-slate-900 font-bengali">
                ডিভাইস লগ আউট করুন
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 font-bengali leading-relaxed">
                আপনি কি নিশ্চিতভাবে এই ডিভাইসটি থেকে আপনার অ্যাকাউন্ট লগ আউট
                করতে চান?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row justify-end gap-2 space-x-0 mt-4 sm:mt-6 pt-3 border-t border-slate-100/80">
              <AlertDialogCancel className="mt-0 flex-1 sm:flex-initial h-9 sm:h-10 text-xs sm:text-sm rounded-xl px-3 sm:px-4 font-bengali">
                বাতিল করুন
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRevokeSession}
                className="mt-0 flex-1 sm:flex-initial h-9 sm:h-10 text-xs sm:text-sm rounded-xl px-3 sm:px-4 font-bengali bg-red-600 hover:bg-red-700 text-white cursor-pointer whitespace-nowrap"
              >
                লগ আউট করুন
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialog>
      </div>
    </div>
  );
}
