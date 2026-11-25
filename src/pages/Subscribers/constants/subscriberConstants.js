export const STATUS_META = {
  active: {
    label: "সক্রিয়",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dotClass: "bg-emerald-500",
  },
  expiring_soon: {
    label: "মেয়াদ শেষ হচ্ছে",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
    dotClass: "bg-amber-500",
  },
  expired: {
    label: "মেয়াদোত্তীর্ণ",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
    dotClass: "bg-rose-500",
  },
  free: {
    label: "ফ্রি / প্ল্যান নেই",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
  },
  suspended: {
    label: "স্থগিত",
    badgeClass: "bg-red-50 text-red-700 border-red-200/80",
    dotClass: "bg-red-600",
  },
};

export const VERSION_LABELS = {
  Bangla: "বাংলা ভার্সন",
  English: "ইংরেজি ভার্সন",
  Madrasah: "মাদ্রাসা ভার্সন",
};

export const USER_TYPE_LABELS = {
  Teacher: "শিক্ষক",
  Institution: "প্রতিষ্ঠান",
};

export const INSTITUTION_TYPE_LABELS = {
  School: "স্কুল",
  College: "কলেজ",
  "School & College": "স্কুল অ্যান্ড কলেজ",
  Madrasah: "মাদ্রাসা",
  "Coaching Center": "কোচিং সেন্টার",
  Other: "অন্যান্য",
};

export const SMS_TEMPLATES = [
  {
    id: "renewal",
    label: "মেয়াদ শেষ রিমাইন্ডার",
    text: "প্রিয় {name}, আপনার স্মার্ট প্রশ্নব্যাংক সাবস্ক্রিপশনের মেয়াদ {expiryDate} তারিখে শেষ হবে। নিরবচ্ছিন্ন সেবা পেতে অনুগ্রহ করে রিনিউ করুন।",
  },
  {
    id: "offer",
    label: "স্পেশাল অফার / প্রমোশন",
    text: "প্রিয় {name}, স্মার্ট প্রশ্নব্যাংকের সকল প্যাকেজে চলছে বিশেষ ছাড়! আজই আপনার পছন্দের প্যাকেজটি অ্যাক্টিভ করুন: smartproshnobank.com",
  },
  {
    id: "welcome",
    label: "স্বাগতম ও সহায়তা",
    text: "প্রিয় {name}, স্মার্ট প্রশ্নব্যাংকে স্বাগতম! প্রশ্নপত্র ও OMR তৈরি শুরু করতে ড্যাশবোর্ডে লগইন করুন। যেকোনো সহায়তায় আমাদের সাপোর্ট টিমে যোগাযোগ করুন।",
  },
];

export function formatBengaliDate(dateInput) {
  if (!dateInput) return "—";
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(dateInput) {
  if (!dateInput) return "অজানা";
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "অজানা";
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${mins.toLocaleString("bn-BD")} মিনিট আগে`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours.toLocaleString("bn-BD")} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days.toLocaleString("bn-BD")} দিন আগে`;
  return formatBengaliDate(d);
}

export function getRemainingDaysText(endDateInput) {
  if (!endDateInput) return null;
  const end = new Date(endDateInput);
  if (Number.isNaN(end.getTime())) return null;
  const diffDays = Math.ceil((end.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  if (diffDays < 0) return `${Math.abs(diffDays).toLocaleString("bn-BD")} দিন আগে শেষ`;
  if (diffDays === 0) return "আজই শেষ";
  return `${diffDays.toLocaleString("bn-BD")} দিন বাকি`;
}

export function formatCurrencyBDT(amount) {
  const num = Number(amount || 0);
  return `৳${num.toLocaleString("bn-BD")}`;
}

export function toWhatsAppPhone(phoneNumber) {
  if (!phoneNumber) return "";
  let digits = String(phoneNumber).replace(/\D/g, "");
  if (digits.startsWith("01")) digits = `88${digits}`;
  else if (!digits.startsWith("880") && digits.length === 10) digits = `880${digits}`;
  return digits;
}
