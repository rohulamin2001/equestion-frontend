import { CheckCircle, FileText, LayoutGrid, Users } from "lucide-react";

export default function Overview() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-bengali">
            ড্যাশবোর্ড ওভারভিউ
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-bengali">
            আপনার প্রশ্ন ব্যাংক সিস্টেমের সংক্ষিপ্ত তথ্য ও পরিসংখ্যান
          </p>
        </div>
      </div>

      {/* Premium Glassmorphic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Card 1: Total Question Papers */}
        <div className="bg-glass border-t-[3px] border-t-[#4F46E5] p-6 rounded-2xl inner-glow flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.65] hover:shadow-lg">
          <div className="p-3 bg-[#4F46E5]/10 text-[#4F46E5] rounded-xl border border-[#4F46E5]/10">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 font-bengali uppercase tracking-wider">
              মোট প্রশ্নপত্র
            </p>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-3xl font-bold text-slate-800 font-sans tracking-tight">
                12
              </span>
              <span className="text-sm font-semibold text-slate-500 font-bengali">
                টি
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Questions */}
        <div className="bg-glass border-t-[3px] border-t-[#10B981] p-6 rounded-2xl inner-glow flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.65] hover:shadow-lg">
          <div className="p-3 bg-[#10B981]/10 text-[#10B981] rounded-xl border border-[#10B981]/10">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 font-bengali uppercase tracking-wider">
              প্রশ্ন সংখ্যা
            </p>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-3xl font-bold text-slate-800 font-sans tracking-tight">
                450
              </span>
              <span className="text-sm font-semibold text-slate-500 font-bengali">
                টি
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Online Exams */}
        <div className="bg-glass border-t-[3px] border-t-[#F97316] p-6 rounded-2xl inner-glow flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.65] hover:shadow-lg">
          <div className="p-3 bg-[#F97316]/10 text-[#F97316] rounded-xl border border-[#F97316]/10">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 font-bengali uppercase tracking-wider">
              অনলাইন পরীক্ষা
            </p>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-3xl font-bold text-slate-800 font-sans tracking-tight">
                5
              </span>
              <span className="text-sm font-semibold text-slate-500 font-bengali">
                টি
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Institution Teachers */}
        <div className="bg-glass border-t-[3px] border-t-[#06B6D4] p-6 rounded-2xl inner-glow flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.65] hover:shadow-lg">
          <div className="p-3 bg-[#06B6D4]/10 text-[#06B6D4] rounded-xl border border-[#06B6D4]/10">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 font-bengali uppercase tracking-wider">
              প্রতিষ্ঠানের শিক্ষক
            </p>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-3xl font-bold text-slate-800 font-sans tracking-tight">
                8
              </span>
              <span className="text-sm font-semibold text-slate-500 font-bengali">
                জন
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Elevated Glass Welcome Card */}
      <div className="bg-glass-elevated p-8 md:p-12 rounded-2xl border border-white/[0.08] text-center space-y-4 relative overflow-hidden group">
        {/* Subtle decorative glowing badge or line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[3px] bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent shadow-[0_1px_12px_rgba(79,70,229,0.3)]" />

        <h2 className="text-2xl font-bold text-slate-800 font-bengali tracking-tight">
          স্বাগতম প্রশ্ন-এ!
        </h2>
        <p className="text-[15px] text-slate-600 leading-relaxed font-bengali max-w-2xl mx-auto">
          আপনার প্রতিষ্ঠানের জন্য পরীক্ষার প্রশ্নপত্র তৈরি করতে বাম পাশের মেনু
          থেকে{" "}
          <span className="text-[#4F46E5] font-bold">
            "১ ক্লিকে প্রশ্ন তৈরি"
          </span>{" "}
          অথবা <span className="text-[#4F46E5] font-bold">"প্রশ্ন"</span> অপশনটি
          নির্বাচন করুন।
        </p>
      </div>
    </div>
  );
}
