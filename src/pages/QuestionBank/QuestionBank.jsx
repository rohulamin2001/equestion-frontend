import { Database } from "lucide-react";

export default function QuestionBank() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">প্রশ্নব্যাংক</h1>
        <p className="text-sm text-slate-500">ক্লাস ৩ থেকে ১২ পর্যন্ত সকল বিষয়ের অধ্যায়ভিত্তিক সৃজনশীল ও MCQ প্রশ্নভাণ্ডার</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
          <Database className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">প্রশ্নভাণ্ডার ব্রাউজার</h2>
        <p className="text-sm text-slate-500 text-center max-w-md leading-relaxed">
          এই মডিউলটির ডিজাইন এবং লজিক ডেভেলপমেন্ট পরবর্তী ধাপে আপনার কাছ থেকে নির্দেশনা নিয়ে সম্পন্ন করা হবে।
        </p>
      </div>
    </div>
  );
}
