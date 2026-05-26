import { PlusCircle } from "lucide-react";

export default function AddQuestion() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">নতুন প্রশ্ন যোগ</h1>
        <p className="text-sm text-slate-500">আপনার নিজস্ব প্রশ্ন লিখে ডাটাবেজে সংরক্ষণ করুন</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-orange-50 text-orange-600 rounded-full">
          <PlusCircle className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">কাস্টম প্রশ্ন ফরম</h2>
        <p className="text-sm text-slate-500 text-center max-w-md leading-relaxed">
          এই মডিউলটির ডিজাইন এবং লজিক ডেভেলপমেন্ট পরবর্তী ধাপে আপনার কাছ থেকে নির্দেশনা নিয়ে সম্পন্ন করা হবে।
        </p>
      </div>
    </div>
  );
}
