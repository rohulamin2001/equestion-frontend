import { Loader2, RefreshCw, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useSms2FA } from "../../pages/Profile/hook/useSms2FA";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function Sms2FASetupModal({
  open,
  onOpenChange,
  phoneNumberMasked,
  onSuccess,
}) {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const { confirmEnable, sendEnableOtp } = useSms2FA();

  useEffect(() => {
    let timer;
    if (open && cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [open, cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    await sendEnableOtp.mutateAsync();
    setCooldown(60);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    confirmEnable.mutate(
      { otp },
      {
        onSuccess: () => {
          setOtp("");
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-bengali">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-purple-100 text-[var(--purple-700)] rounded-xl border border-purple-200/60 shrink-0">
              <ShieldCheck className="size-5 sm:size-6" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">
                SMS ২-স্টেপ সিকিউরিটি সক্রিয়করণ
              </DialogTitle>
              <DialogDescription className="text-[11px] sm:text-xs text-slate-500 font-bengali mt-0.5 leading-relaxed">
                আপনার রেজিস্টার্ড ফোন নম্বর{" "}
                <span className="font-semibold font-sans text-slate-800">
                  {phoneNumberMasked || "সংযুক্ত নম্বরে"}
                </span>{" "}
                একটি ৬ ডিজিটের OTP পাঠানো হয়েছে।
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 pt-2 sm:pt-3">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[11px] sm:text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>
                ৬ ডিজিটের OTP কোড লিখুন <span className="text-red-500">*</span>
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
                className="w-full h-11 sm:h-12 text-center text-lg sm:text-xl font-bold tracking-[0.25em] sm:tracking-[0.4em] font-sans rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] shadow-sm transition-all pl-9 pr-3 sm:pl-10"
              />
              <Smartphone className="absolute left-3 top-3 sm:top-3.5 size-4 sm:size-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] sm:text-xs gap-1 pt-0.5">
            <span className="text-slate-500">কোড পাননি?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || sendEnableOtp.isPending}
              className="font-bold text-[var(--purple-700)] hover:text-[var(--purple-900)] disabled:text-slate-400 transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw
                className={`size-3 sm:size-3.5 ${sendEnableOtp.isPending ? "animate-spin" : ""}`}
              />
              {cooldown > 0
                ? `পুনরায় পাঠান (${cooldown} সে)`
                : "নতুন OTP কোড পাঠান"}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={otp.length !== 6 || confirmEnable.isPending}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2"
            >
              {confirmEnable.isPending ? (
                <>
                  <Loader2 className="size-3.5 sm:size-4 animate-spin" />
                  যাচাই হচ্ছে...
                </>
              ) : (
                "সক্রিয় করুন"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
