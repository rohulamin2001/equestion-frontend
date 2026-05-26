import { CreditCard } from "lucide-react";

export default function Subscription() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">সাবস্ক্রিপশন ও প্যাকেজ</h1>
        <p className="text-sm text-slate-500">আপনার বর্তমান প্যাকেজের স্থিতি, বিলিং তথ্য এবং নতুন প্যাকেজ ক্রয়</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
          <CreditCard className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">বিলিং ও প্যাকেজ ব্যবস্থাপনা</h2>
        <p className="text-sm text-slate-500 text-center max-w-md leading-relaxed">
          এই মডিউলটির ডিজাইন এবং লজিক ডেভেলপমেন্ট পরবর্তী ধাপে আপনার কাছ থেকে নির্দেশনা নিয়ে সম্পন্ন করা হবে।
        </p>
      </div>
    </div>
  );
}
