import { ScanLine } from "lucide-react";

export default function OMREvaluation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">OMR মূল্যায়ন</h1>
        <p className="text-sm text-slate-500">শিক্ষার্থীদের OMR শিটের ইমেজ স্ক্যান ও স্বয়ংক্রিয় মূল্যায়ন প্যানেল</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-violet-50 text-violet-600 rounded-full">
          <ScanLine className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">OMR শিট রিডার ও প্রসেসর</h2>
        <p className="text-sm text-slate-500 text-center max-w-md leading-relaxed">
          এই মডিউলটির ডিজাইন এবং লজিক ডেভেলপমেন্ট পরবর্তী ধাপে আপনার কাছ থেকে নির্দেশনা নিয়ে সম্পন্ন করা হবে।
        </p>
      </div>
    </div>
  );
}
