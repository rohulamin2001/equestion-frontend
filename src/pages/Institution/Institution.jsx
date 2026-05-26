import { Home } from "lucide-react";

export default function Institution() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">আমার প্রতিষ্ঠান</h1>
        <p className="text-sm text-slate-500">আপনার শিক্ষাপ্রতিষ্ঠানের প্রোফাইল, লোগো এবং শিক্ষক ব্যবস্থাপনা</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-sky-50 text-sky-600 rounded-full">
          <Home className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">প্রতিষ্ঠান প্রোফাইল ও লোগো</h2>
        <p className="text-sm text-slate-500 text-center max-w-md leading-relaxed">
          এই মডিউলটির ডিজাইন এবং লজিক ডেভেলপমেন্ট পরবর্তী ধাপে আপনার কাছ থেকে নির্দেশনা নিয়ে সম্পন্ন করা হবে।
        </p>
      </div>
    </div>
  );
}
