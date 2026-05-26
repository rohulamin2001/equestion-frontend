import { Sparkles } from "lucide-react";

export default function Generator() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">১ ক্লিকে প্রশ্ন তৈরি</h1>
        <p className="text-sm text-slate-500">খুব দ্রুত শ্রেণি, বিষয় এবং অধ্যায় নির্বাচন করে সৃজনশীল বা MCQ প্রশ্নপত্র তৈরি করুন</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-blue-50 text-blue-600 rounded-full animate-pulse">
          <Sparkles className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">১ ক্লিক প্রশ্নপত্র তৈরি ইঞ্জিন</h2>
        <p className="text-sm text-slate-500 text-center max-w-md leading-relaxed">
          এই মডিউলটির ডিজাইন এবং লজিক ডেভেলপমেন্ট পরবর্তী ধাপে আপনার কাছ থেকে নির্দেশনা নিয়ে সম্পন্ন করা হবে।
        </p>
      </div>
    </div>
  );
}
