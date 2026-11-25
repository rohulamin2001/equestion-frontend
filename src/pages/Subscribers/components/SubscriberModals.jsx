import { ModalCancelButton, ModalSubmitButton } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Ban,
  CalendarPlus,
  CheckCircle2,
  KeyRound,
  Loader2,
  MessageSquare,
  PlusCircle,
  Printer,
  RefreshCw,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import {
  SMS_TEMPLATES,
  VERSION_LABELS,
  formatBengaliDate,
  formatCurrencyBDT,
} from "../constants/subscriberConstants";

// 1. Assign Manual Subscription Modal
export function AssignSubscriptionModal({
  open,
  onClose,
  user,
  packages,
  academicConfig,
  allSubjects,
  onSubmit,
  isPending,
}) {
  const [purchaseType, setPurchaseType] = useState("Package");
  const [version, setVersion] = useState("Bangla");
  const [packageId, setPackageId] = useState("");
  const [classNames, setClassNames] = useState([]);
  const [subjectIds, setSubjectIds] = useState([]);
  const [durationDays, setDurationDays] = useState("365");
  const [paymentReference, setPaymentReference] = useState("MANUAL_BKASH");
  const [note, setNote] = useState("");

  const filteredPackages = packages.filter((p) => p.version === version);
  const availableClasses =
    academicConfig?.versions?.find((v) => v.id === version)?.classes || [
      "ষষ্ঠ শ্রেণি",
      "সপ্তম শ্রেণি",
      "অষ্টম শ্রেণি",
      "নবম শ্রেণি",
      "দশম শ্রেণি",
      "একাদশ-দ্বাদশ শ্রেণি",
    ];
  const filteredSubjects = allSubjects.filter(
    (s) =>
      classNames.length === 0 || classNames.includes(s.className),
  );

  const handleToggleClass = (cls) => {
    setClassNames((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls],
    );
  };

  const handleToggleSubject = (id) => {
    setSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    await onSubmit({
      userId: user._id,
      payload: {
        purchaseType,
        version,
        packageId: purchaseType === "Package" ? packageId : "",
        classNames:
          purchaseType === "Class" || purchaseType === "Package"
            ? classNames
            : [],
        subjectIds: purchaseType === "Subject" ? subjectIds : [],
        durationDays: Number(durationDays) || 365,
        paymentReference,
        note,
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !isPending && onClose()}>
      <DialogContent className="max-w-xl p-0 rounded-2xl overflow-hidden bg-white">
        <form onSubmit={handleFormSubmit} className="flex flex-col max-h-[85vh]">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <PlusCircle className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-800">
                  ম্যানুয়াল সাবস্ক্রিপশন বরাদ্দ দিন
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-bengali">
                  গ্রাহক: {user?.institutionName || user?.fullName || user?.phoneNumber}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 font-bengali text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">
                  সাবস্ক্রিপশন ধরন
                </label>
                <select
                  value={purchaseType}
                  onChange={(e) => setPurchaseType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="Package">প্যাকেজ (Package)</option>
                  <option value="Class">নির্দিষ্ট শ্রেণি (Class)</option>
                  <option value="Subject">নির্দিষ্ট বিষয় (Subject)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">ভার্সন</label>
                <select
                  value={version}
                  onChange={(e) => {
                    setVersion(e.target.value);
                    setPackageId("");
                    setClassNames([]);
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  {Object.entries(VERSION_LABELS).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {purchaseType === "Package" && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">
                  প্যাকেজ নির্বাচন করুন
                </label>
                <select
                  required
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="">-- একটি প্যাকেজ বেছে নিন --</option>
                  {filteredPackages.map((pkg) => (
                    <option key={pkg.packageId} value={pkg.packageId}>
                      {pkg.title} ({formatCurrencyBDT(pkg.basePrice)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 block">
                শ্রেণি নির্বাচন করুন{" "}
                {purchaseType === "Package" && "(ঐচ্ছিক — প্যাকেজের ডিফল্ট ক্লাস নিতে ফাঁকা রাখুন)"}
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl border border-slate-200 bg-slate-50/50">
                {availableClasses.map((cls) => {
                  const active = classNames.includes(cls);
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => handleToggleClass(cls)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                        active
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>
            </div>

            {purchaseType === "Subject" && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">
                  বিষয়সমূহ নির্বাচন করুন ({subjectIds.length}টি নির্বাচিত)
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl border border-slate-200 bg-slate-50/50">
                  {filteredSubjects.map((sub) => {
                    const checked = subjectIds.includes(sub._id);
                    return (
                      <label
                        key={sub._id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-[11px] ${
                          checked
                            ? "bg-indigo-50 border-indigo-300 text-indigo-800 font-bold"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleSubject(sub._id)}
                          className="rounded border-slate-300"
                        />
                        <span className="truncate">
                          {sub.subjectName} ({sub.className})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">
                  মেয়াদ (দিন)
                </label>
                <Input
                  type="number"
                  min={1}
                  required
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="h-10 rounded-xl text-xs font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">
                  পেমেন্ট রেফারেন্স
                </label>
                <Input
                  placeholder="যেমন: BKASH_TXN123"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="h-10 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 block">
                অ্যাডমিন নোট (ঐচ্ছিক)
              </label>
              <Input
                placeholder="যেমন: অফিসে সরাসরি ক্যাশ পেমেন্ট করেছে"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <DialogClose asChild>
              <ModalCancelButton disabled={isPending}>বাতিল</ModalCancelButton>
            </DialogClose>
            <ModalSubmitButton type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" /> বরাদ্দ হচ্ছে...
                </>
              ) : (
                "সাবস্ক্রিপশন সচল করুন"
              )}
            </ModalSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// 2. Extend / Modify Expiry Modal (Single or Bulk)
export function ExtendExpiryModal({
  open,
  onClose,
  target,
  bulkCount = 0,
  onSubmit,
  isPending,
}) {
  const [extendDays, setExtendDays] = useState("30");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const days = Number(extendDays);
    if (!days) return;
    await onSubmit(days);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !isPending && onClose()}>
      <DialogContent className="max-w-md p-0 rounded-2xl overflow-hidden bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarPlus className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-800">
                  {bulkCount > 0
                    ? `বাল্ক মেয়াদ বাড়ান (${bulkCount.toLocaleString("bn-BD")} জন)`
                    : "সাবস্ক্রিপশনের মেয়াদ পরিবর্তন"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-bengali">
                  {bulkCount > 0
                    ? "নির্বাচিত সাবস্ক্রাইবারদের চলমান বা সর্বশেষ প্ল্যানের মেয়াদ বাড়বে।"
                    : target?.user?.institutionName ||
                      target?.user?.fullName ||
                      target?.user?.phoneNumber}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4 font-bengali text-xs">
            <div className="flex flex-wrap gap-2">
              {[7, 15, 30, 90, 365].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setExtendDays(String(d))}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition ${
                    Number(extendDays) === d
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  +{d.toLocaleString("bn-BD")} দিন
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 block">
                অথবা দিনসংখ্যা লিখুন {bulkCount === 0 && "(কমাতে চাইলে মাইনাস দিন, যেমন -7)"}
              </label>
              <Input
                type="number"
                required
                value={extendDays}
                onChange={(e) => setExtendDays(e.target.value)}
                className="h-10 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <DialogClose asChild>
              <ModalCancelButton disabled={isPending}>বাতিল</ModalCancelButton>
            </DialogClose>
            <ModalSubmitButton type="submit" disabled={isPending}>
              {isPending ? "আপডেট হচ্ছে..." : "মেয়াদ আপডেট করুন"}
            </ModalSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// 3. Send Single or Bulk SMS Modal
export function SendSmsModal({
  open,
  onClose,
  recipients,
  onSubmit,
  isPending,
}) {
  const [message, setMessage] = useState(SMS_TEMPLATES[0].text);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || recipients.length === 0) return;
    await onSubmit({
      userIds: recipients.map((r) => r._id),
      message: message.trim(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !isPending && onClose()}>
      <DialogContent className="max-w-lg p-0 rounded-2xl overflow-hidden bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-800">
                  সাবস্ক্রাইবারকে SMS পাঠান
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-bengali">
                  প্রাপক: {recipients.length.toLocaleString("bn-BD")} জন সাবস্ক্রাইবার
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-3.5 font-bengali text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1.5">
                কুইক টেমপ্লেট:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SMS_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setMessage(tpl.text)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] font-semibold text-slate-700 transition cursor-pointer"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-600">মেসেজ টেক্সট</label>
                <span className="text-[11px] text-slate-400">
                  {message.length.toLocaleString("bn-BD")} অক্ষর
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs leading-relaxed"
                placeholder="আপনার বার্তা লিখুন..."
              />
              <p className="text-[11px] text-slate-400">
                টিপস: <code>{"{name}"}</code> এবং <code>{"{expiryDate}"}</code> ব্যবহার করলে স্বয়ংক্রিয়ভাবে প্রতিটি গ্রাহকের নাম ও মেয়াদের তারিখ বসে যাবে।
              </p>
            </div>
          </div>

          <DialogFooter className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <DialogClose asChild>
              <ModalCancelButton disabled={isPending}>বাতিল</ModalCancelButton>
            </DialogClose>
            <ModalSubmitButton type="submit" disabled={isPending}>
              {isPending ? "পাঠানো হচ্ছে..." : "SMS পাঠান"}
            </ModalSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// 4. Edit Subscriber Profile Modal
export function EditSubscriberModal({
  open,
  onClose,
  user,
  onSubmit,
  isPending,
}) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [userType, setUserType] = useState(user?.userType || "Teacher");
  const [institutionName, setInstitutionName] = useState(
    user?.institutionName || "",
  );
  const [eiin, setEiin] = useState(user?.eiin || "");
  const [designation, setDesignation] = useState(user?.designation || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      userId: user._id,
      payload: {
        firstName,
        lastName,
        email,
        userType,
        institutionName,
        eiin,
        designation,
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !isPending && onClose()}>
      <DialogContent className="max-w-lg p-0 rounded-2xl overflow-hidden bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <UserCog className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-800">
                  সাবস্ক্রাইবারের তথ্য সংশোধন
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  {user?.phoneNumber}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-3 font-bengali text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  নামের প্রথম অংশ
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  নামের শেষ অংশ
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 block mb-1">ধরন</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                >
                  <option value="Teacher">শিক্ষক (Teacher)</option>
                  <option value="Institution">প্রতিষ্ঠান (Institution)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  পদবি (ঐচ্ছিক)
                </label>
                <Input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">
                প্রতিষ্ঠানের নাম
              </label>
              <Input
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  EIIN নম্বর
                </label>
                <Input
                  value={eiin}
                  onChange={(e) => setEiin(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  ইমেইল
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <DialogClose asChild>
              <ModalCancelButton disabled={isPending}>বাতিল</ModalCancelButton>
            </DialogClose>
            <ModalSubmitButton type="submit" disabled={isPending}>
              {isPending ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
            </ModalSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// 5. Reset Password Modal
export function ResetPasswordModal({
  open,
  onClose,
  user,
  onSubmit,
  isPending,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [sendViaSms, setSendViaSms] = useState(true);

  const generateRandom = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setNewPassword(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return;
    await onSubmit({ userId: user._id, newPassword, sendViaSms });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !isPending && onClose()}>
      <DialogContent className="max-w-md p-0 rounded-2xl overflow-hidden bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <KeyRound className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-800">
                  পাসওয়ার্ড রিসেট করুন
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-bengali">
                  {user?.fullName} ({user?.phoneNumber})
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-3.5 font-bengali text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-600">
                  নতুন টেম্পোরারি পাসওয়ার্ড
                </label>
                <button
                  type="button"
                  onClick={generateRandom}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
                >
                  <RefreshCw className="size-3" /> অটো জেনারেট
                </button>
              </div>
              <Input
                required
                minLength={6}
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 rounded-xl font-mono text-sm"
              />
            </div>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={sendViaSms}
                onChange={(e) => setSendViaSms(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span className="font-semibold text-slate-700">
                গ্রাহকের মোবাইল নম্বরে SMS-এ পাসওয়ার্ড পাঠান
              </span>
            </label>
          </div>

          <DialogFooter className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <DialogClose asChild>
              <ModalCancelButton disabled={isPending}>বাতিল</ModalCancelButton>
            </DialogClose>
            <ModalSubmitButton type="submit" disabled={isPending}>
              {isPending ? "রিসেট হচ্ছে..." : "পাসওয়ার্ড রিসেট করুন"}
            </ModalSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// 6. Account Suspend / Resume Confirmation Modal
export function AccountSuspendModal({
  open,
  onClose,
  user,
  onSubmit,
  isPending,
}) {
  const [reason, setReason] = useState(user?.accountSuspendedReason || "");
  const isCurrentlySuspended = Boolean(user?.isAccountSuspended);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      userId: user._id,
      isAccountSuspended: !isCurrentlySuspended,
      reason,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !isPending && onClose()}>
      <DialogContent className="max-w-md p-0 rounded-2xl overflow-hidden bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100 text-left">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  isCurrentlySuspended
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {isCurrentlySuspended ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <Ban className="size-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-800">
                  {isCurrentlySuspended
                    ? "অ্যাকাউন্ট পুনরায় সচল করবেন?"
                    : "অ্যাকাউন্ট স্থগিত (ব্লক) করবেন?"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-bengali">
                  {user?.fullName} ({user?.phoneNumber})
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-3 font-bengali text-xs">
            <p className="text-slate-600 leading-relaxed">
              {isCurrentlySuspended
                ? "অ্যাকাউন্ট সচল করলে গ্রাহক আবার তার ফোন নম্বর ও পাসওয়ার্ড দিয়ে ড্যাশবোর্ডে লগইন করতে পারবেন।"
                : "অ্যাকাউন্ট স্থগিত করলে গ্রাহক তাৎক্ষণিকভাবে সকল ডিভাইস থেকে লগআউট হয়ে যাবেন এবং লগইন করতে পারবেন না।"}
            </p>

            {!isCurrentlySuspended && (
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  স্থগিতের কারণ (ঐচ্ছিক — গ্রাহককে দেখানো হবে)
                </label>
                <Input
                  placeholder="যেমন: একাধিক ডিভাইসে অ্যাকাউন্ট শেয়ারিং / নীতিমালা ভঙ্গ"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2">
            <DialogClose asChild>
              <ModalCancelButton disabled={isPending}>বাতিল</ModalCancelButton>
            </DialogClose>
            <button
              type="submit"
              disabled={isPending}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer disabled:opacity-50 ${
                isCurrentlySuspended
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {isPending
                ? "প্রসেস হচ্ছে..."
                : isCurrentlySuspended
                  ? "হ্যাঁ, সচল করুন"
                  : "হ্যাঁ, স্থগিত করুন"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// 7. Printable Order Invoice Modal
export function OrderInvoiceModal({ open, onClose, order, subscriber }) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-lg p-0 rounded-2xl overflow-hidden bg-white">
        <div className="p-6 space-y-5 font-bengali" id="printable-invoice">
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 font-sans">
                স্মার্ট প্রশ্নব্যাংক
              </h2>
              <p className="text-[11px] text-slate-500">
                সিডস্টোর বাজার, ভালুকা–২২৪০, ময়মনসিংহ
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                support@smartproshnobank.com
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                INVOICE / রসিদ
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1 font-mono">
                #{order.orderNumber}
              </p>
              <p className="text-[11px] text-slate-500">
                তারিখ: {formatBengaliDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                গ্রাহকের তথ্য
              </p>
              <p className="font-bold text-slate-800 mt-0.5">
                {subscriber?.institutionName || subscriber?.fullName}
              </p>
              <p className="text-slate-600 font-sans">{subscriber?.phoneNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                পেমেন্ট স্ট্যাটাস
              </p>
              <p className="font-bold text-slate-800 mt-0.5">{order.status}</p>
              <p className="text-slate-500 text-[11px]">
                গেটওয়ে: {order.paymentGateway || "PortPos"}
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                <tr>
                  <th className="px-3.5 py-2 text-left">বিবরণ</th>
                  <th className="px-3.5 py-2 text-right">পরিমাণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-3.5 py-2.5">
                    <p className="font-bold text-slate-800">
                      {order.packageSnapshot?.title ||
                        (order.purchaseType === "Class"
                          ? `শ্রেণি (${order.classNames?.join(", ")})`
                          : `সাবজেক্ট (${order.subjectIds?.length || 0}টি)`)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ভার্সন: {VERSION_LABELS[order.version] || order.version}
                    </p>
                  </td>
                  <td className="px-3.5 py-2.5 text-right font-semibold">
                    {formatCurrencyBDT(order.originalAmount)}
                  </td>
                </tr>
                {order.discountAmount > 0 && (
                  <tr>
                    <td className="px-3.5 py-2 text-emerald-700">
                      ডিসকাউন্ট (
                      {order.couponSnapshot?.code ||
                        order.affiliateSnapshot?.couponCode ||
                        "কুপন"}
                      )
                    </td>
                    <td className="px-3.5 py-2 text-right font-semibold text-emerald-700">
                      -{formatCurrencyBDT(order.discountAmount)}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50/70 font-bold text-slate-900">
                  <td className="px-3.5 py-2.5">সর্বমোট পরিশোধযোগ্য</td>
                  <td className="px-3.5 py-2.5 text-right text-sm">
                    {formatCurrencyBDT(order.finalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2 print:hidden">
          <DialogClose asChild>
            <ModalCancelButton>বন্ধ করুন</ModalCancelButton>
          </DialogClose>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 cursor-pointer"
          >
            <Printer className="size-3.5" />
            <span>প্রিন্ট / PDF সেভ করুন</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
