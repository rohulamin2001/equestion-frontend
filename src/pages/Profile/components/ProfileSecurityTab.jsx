import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  Loader2,
  LogOut,
  MoreHorizontal,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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

export default function ProfileSecurityTab({ profile }) {
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
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-2 gap-2">
          <h3 className="text-xs sm:text-base font-bold text-slate-800 flex items-center gap-1.5 sm:gap-2 font-bengali">
            <KeyRound className="size-4 sm:size-5 text-indigo-500 shrink-0" />
            পাসওয়ার্ড পরিবর্তন করুন
          </h3>
          <button
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-[11px] sm:text-xs font-bold text-indigo-600 hover:text-indigo-850 px-2 sm:px-3 py-1 rounded-lg hover:bg-indigo-50 transition-all duration-200 shrink-0"
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
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">
                  বর্তমান পাসওয়ার্ড <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
                    placeholder="আপনার বর্তমান পাসওয়ার্ড লিখুন"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
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
              <div className="space-y-1">
                <div className="flex justify-between items-center h-6">
                  <label className="text-xs font-semibold text-slate-600">
                    নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateSecurePassword}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-all duration-200"
                  >
                    <Sparkles className="h-3 w-3" />
                    পাসওয়ার্ড জেনারেট করুন
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
                    placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
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
              <div className="space-y-1">
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
                    className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
                    placeholder="পাসওয়ার্ড পুনরায় টাইপ করুন"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
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

            <div className="flex justify-center pt-2 w-full">
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all duration-200 disabled:opacity-50 cursor-pointer"
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
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4 font-bengali">
        <h3 className="text-xs sm:text-base font-bold text-slate-800 flex items-center gap-1.5 sm:gap-2 border-b pb-2">
          <ShieldCheck className="size-4 sm:size-5 text-indigo-500 shrink-0" />
          অ্যাকাউন্ট নিরাপত্তা সুরক্ষা
        </h3>

        <div className="flex items-center justify-between gap-2 p-3 bg-indigo-50/30 rounded-xl border border-indigo-100">
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              JWT এবং HTTP-Only Cookie নিরাপত্তা
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500">
              আপনার অ্যাকাউন্টটি এনক্রিপ্টেড টোকেন এবং বহু-ডিভাইস সুরক্ষা
              ব্যবস্থার মাধ্যমে সুরক্ষিত।
            </p>
          </div>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap shrink-0">
            <CheckCircle2 className="size-3 sm:size-3.5" />
            সুরক্ষিত
          </span>
        </div>
      </div>

      {/* Custom Active Sessions / Devices Card */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-xs sm:text-base font-bold text-slate-800 flex items-center gap-1.5 sm:gap-2 border-b pb-2 font-bengali">
          <Laptop className="size-4 sm:size-5 text-indigo-500 shrink-0" />
          সক্রিয় সেশন ও ডিভাইস ট্র্যাকিং
        </h3>

        <div className="space-y-3 font-bengali">
          {sessionsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-5 sm:size-6 text-indigo-600 animate-spin" />
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
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all gap-2 ${
                    isCurrent
                      ? "border-indigo-100 bg-indigo-50/20 shadow-sm"
                      : "border-slate-100 bg-slate-50/30"
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${
                        isCurrent
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <IconComponent className="size-4 sm:size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-800 font-sans tracking-tight truncate">
                          {os}
                        </h5>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 whitespace-nowrap shrink-0 flex items-center gap-1">
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
                        <button className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition focus:outline-none cursor-pointer">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSessionToRevoke(session)}
                          variant="destructive"
                          className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 font-sans cursor-pointer text-xs flex items-center gap-1.5"
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
          <AlertDialogPopup>
            <AlertDialogHeader>
              <AlertDialogTitle>ডিভাইস লগ আউট করুন</AlertDialogTitle>
              <AlertDialogDescription>
                আপনি কি নিশ্চিতভাবে এই ডিভাইসটি থেকে আপনার অ্যাকাউন্ট লগ আউট
                করতে চান?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRevokeSession}
                className="bg-red-600 hover:bg-red-700"
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
