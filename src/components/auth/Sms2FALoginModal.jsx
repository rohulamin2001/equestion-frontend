import { Loader2, Lock, RefreshCw, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useSms2FA } from "../../pages/Profile/hook/useSms2FA";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function Sms2FALoginModal({
  open,
  onOpenChange,
  tempToken,
  phoneNumberMasked,
  onLoginSuccess,
}) {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(60);

  const { verifyLoginOtp, resendLoginOtp } = useSms2FA();

  useEffect(() => {
    let timer;
    if (open && cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [open, cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !tempToken) return;
    resendLoginOtp.mutate(
      { tempToken },
      {
        onSuccess: () => setCooldown(60),
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || !tempToken) return;

    verifyLoginOtp.mutate(
      { tempToken, otp },
      {
        onSuccess: (data) => {
          setOtp("");
          if (onLoginSuccess) {
            onLoginSuccess(data);
          }
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-bengali">
        <DialogHeader className="space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-[var(--purple-700)] rounded-xl border border-purple-200/60 shrink-0">
              <Lock className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 font-sans tracking-tight">
                ২-স্টেপ সিকিউরিটি ভেরিফিকেশন
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-bengali mt-0.5">
                আপনার রেজিস্টার্ড ফোন নম্বর{" "}
                <span className="font-semibold font-sans text-slate-800">
                  {phoneNumberMasked || "সংযুক্ত নম্বরে"}
                </span>{" "}
                প্রেরিত ৬ ডিজিটের OTP প্রবেশ করুন।
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>
                ৬ ডিজিটের OTP কোড টাইপ করুন{" "}
                <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-slate-400 font-sans">
                মেয়াদ: ৫ মিনিট
              </span>
            </label>

            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="• • • • • •"
                autoFocus
                className="w-full h-12 text-center text-xl font-bold tracking-[0.4em] font-sans rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] shadow-sm transition-all"
              />
              <Smartphone className="absolute left-3.5 top-3.5 size-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">কোড পাননি?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resendLoginOtp.isPending}
              className="font-bold text-[var(--purple-700)] hover:text-[var(--purple-900)] disabled:text-slate-400 transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw
                className={`size-3.5 ${resendLoginOtp.isPending ? "animate-spin" : ""}`}
              />
              {cooldown > 0
                ? `পুনরায় পাঠান (${cooldown} সে)`
                : "নতুন OTP কোড পাঠান"}
            </button>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={otp.length !== 6 || verifyLoginOtp.isPending}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
            >
              {verifyLoginOtp.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  যাচাই হচ্ছে...
                </>
              ) : (
                "লগইন সম্পন্ন করুন"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
