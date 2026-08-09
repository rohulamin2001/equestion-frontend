import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSms2FA } from "../../pages/Profile/hook/useSms2FA";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function Sms2FADisableModal({ open, onOpenChange, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Password Check, 2: OTP Check
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneNumberMasked, setPhoneNumberMasked] = useState("");
  const [cooldown, setCooldown] = useState(60);

  const { sendDisableOtp, confirmDisable } = useSms2FA();

  useEffect(() => {
    let timer;
    if (open && step === 2 && cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [open, step, cooldown]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) return;

    sendDisableOtp.mutate(
      { currentPassword },
      {
        onSuccess: (data) => {
          setPhoneNumberMasked(data.phoneNumberMasked || "");
          setStep(2);
          setCooldown(60);
        },
      },
    );
  };

  const handleResendDisableOtp = async () => {
    if (cooldown > 0) return;
    sendDisableOtp.mutate(
      { currentPassword },
      {
        onSuccess: (data) => {
          setPhoneNumberMasked(data.phoneNumberMasked || "");
          setCooldown(60);
        },
      },
    );
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || !currentPassword) return;

    confirmDisable.mutate(
      { currentPassword, otp },
      {
        onSuccess: () => {
          setStep(1);
          setCurrentPassword("");
          setOtp("");
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  const handleClose = () => {
    setStep(1);
    setCurrentPassword("");
    setOtp("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-bengali">
        <DialogHeader className="space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl border border-red-200/60 shrink-0">
              <Lock className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 font-sans tracking-tight">
                SMS ২-স্টেপ সিকিউরিটি নিষ্ক্রিয়করণ
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-bengali mt-0.5">
                {step === 1
                  ? "নিরাপত্তার স্বার্থে আপনার বর্তমান পাসওয়ার্ড প্রদান করুন।"
                  : `${phoneNumberMasked || "নিবন্ধিত নম্বরে"} পাঠানো ৬ ডিজিটের OTP প্রবেশ করুন।`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === 1 ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                বর্তমান পাসওয়ার্ড <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="আপনার বর্তমান পাসওয়ার্ড টাইপ করুন"
                  className="w-full h-11 pl-3 pr-10 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans shadow-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={!currentPassword || sendDisableOtp.isPending}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
              >
                {sendDisableOtp.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    পাসওয়ার্ড যাচাই হচ্ছে...
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4" />
                    পরবর্তী ধাপ (OTP)
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>
                  ৬ ডিজিটের OTP কোড লিখুন{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="• • • • • •"
                  autoFocus
                  className="w-full h-12 text-center text-xl font-bold tracking-[0.4em] font-sans rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 shadow-sm transition-all"
                />
                <Smartphone className="absolute left-3.5 top-3.5 size-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">কোড পাননি?</span>
              <button
                type="button"
                onClick={handleResendDisableOtp}
                disabled={cooldown > 0 || sendDisableOtp.isPending}
                className="font-bold text-red-600 hover:text-red-800 disabled:text-slate-400 transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw
                  className={`size-3.5 ${sendDisableOtp.isPending ? "animate-spin" : ""}`}
                />
                {cooldown > 0
                  ? `পুনরায় পাঠান (${cooldown} সে)`
                  : "নতুন OTP কোড পাঠান"}
              </button>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                আগের ধাপ
              </button>
              <button
                type="submit"
                disabled={otp.length !== 6 || confirmDisable.isPending}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
              >
                {confirmDisable.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    বন্ধ করা হচ্ছে...
                  </>
                ) : (
                  "2FA সম্পূর্ণ বন্ধ করুন"
                )}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
