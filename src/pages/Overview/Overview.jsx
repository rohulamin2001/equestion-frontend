import { LayoutGrid, FileText, CheckCircle, Users } from "lucide-react";

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ড্যাশবোর্ড ওভারভিউ</h1>
          <p className="text-sm text-slate-500">আপনার প্রশ্ন ব্যাংক সিস্টেমের সংক্ষিপ্ত তথ্য</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">মোট প্রশ্নপত্র</p>
            <p className="text-2xl font-bold text-slate-900">১২টি</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">প্রশ্ন সংখ্যা</p>
            <p className="text-2xl font-bold text-slate-900">৪৫০টি</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">অনলাইন পরীক্ষা</p>
            <p className="text-2xl font-bold text-slate-900">৫টি</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">প্রতিষ্ঠানের শিক্ষক</p>
            <p className="text-2xl font-bold text-slate-900">৮ জন</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center max-w-2xl mx-auto py-12 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">স্বাগতম ইপ্রশ্নব্যাংক-এ!</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          আপনার প্রতিষ্ঠানের জন্য পরীক্ষার প্রশ্নপত্র তৈরি করতে বাম পাশের মেনু থেকে **"১ ক্লিকে প্রশ্ন তৈরি"** অথবা **"প্রশ্নব্যাংক"** অপশনটি নির্বাচন করুন।
        </p>
      </div>
    </div>
  );
}
