import { Monitor } from "lucide-react";

export default function Exams() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">অনলাইন পরীক্ষা</h1>
        <p className="text-sm text-slate-500">শিক্ষার্থীদের অনলাইন পরীক্ষার আয়োজন ও পর্যবেক্ষণ করার ড্যাশবোর্ড</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-pink-50 text-pink-600 rounded-full">
          <Monitor className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">পরীক্ষা নিয়ন্ত্রণ প্যানেল</h2>
        <p className="text-sm text-slate-500 text-center max-w-md leading-relaxed">
          এই মডিউলটির ডিজাইন এবং লজিক ডেভেলপমেন্ট পরবর্তী ধাপে আপনার কাছ থেকে নির্দেশনা নিয়ে সম্পন্ন করা হবে।
        </p>
      </div>
    </div>
  );
}
