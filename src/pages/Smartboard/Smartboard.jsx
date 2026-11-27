import {
  ArrowRight,
  Eraser,
  FileText,
  Layers,
  MousePointer2,
  PenTool,
  Presentation,
  Shapes,
  Sparkles,
  Tv,
  Type,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

const UPCOMING_FEATURES = [
  {
    icon: PenTool,
    title: "ইন্টারঅ্যাক্টিভ ড্রয়িং ও কলম টুল",
    description:
      "ক্লাস নেওয়ার সময় স্মুথ পেন, হাইলাইটার, কালার পিকার ও ইরেজার দিয়ে লাইভ সল্যুশন দেখানোর সুবিধা।",
    tone: "bg-indigo-50 text-indigo-600 border-indigo-200/70",
  },
  {
    icon: FileText,
    title: "প্রশ্নব্যাংক থেকে সরাসরি প্রশ্ন লোড",
    description:
      "তৈরিকৃত বা বোর্ড প্রশ্ন সরাসরি স্মার্টবোর্ড ক্যানভাসে এনে ধাপে ধাপে সমাধান বোঝানোর সুবিধা।",
    tone: "bg-purple-50 text-purple-600 border-purple-200/70",
  },
  {
    icon: Shapes,
    title: "জ্যামিতি ও সায়েন্স ডায়াগ্রাম টুল",
    description:
      "ত্রিভুজ, বৃত্ত, গ্রাফ পেপার এবং গণিত ও বিজ্ঞানের জন্য রেডি-টু-ইউজ শেপ ও অ্যানোটেশন।",
    tone: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
  },
  {
    icon: Tv,
    title: "বড় ডিসপ্লে ও প্রজেক্টর ফ্রেন্ডলি",
    description:
      "ডিজিটাল বোর্ড, প্রজেক্টর ও ট্যাবলেটে ফুল-স্ক্রিন মোডে ক্লিয়ার ও ল্যাগ-মুক্ত প্রেজেন্টেশন।",
    tone: "bg-amber-50 text-amber-600 border-amber-200/70",
  },
];

export default function Smartboard() {
  const { userProfile } = useUserContext();
  const isSubscriber = userProfile?.role === "Subscriber";

  return (
    <div className="space-y-6 font-bengali">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-200/70 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50/70 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200/80 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>শীঘ্রই আসছে • প্রিভিউ</span>
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ইন্টারঅ্যাক্টিভ স্মার্টবোর্ড
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              শ্রেণিকক্ষে ডিজিটাল বোর্ড বা অনলাইন লাইভ ক্লাসে সরাসরি প্রশ্ন দেখিয়ে
              সমাধান লেখার জন্য আধুনিক ডিজিটাল হোয়াইটবোর্ড তৈরি করা হচ্ছে।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to={isSubscriber ? "/dashboard/generate" : "/dashboard"}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition"
              >
                <span>
                  {isSubscriber
                    ? "১ ক্লিকে প্রশ্ন তৈরি করুন"
                    : "ড্যাশবোর্ডে ফিরে যান"}
                </span>
                <ArrowRight className="size-3.5" />
              </Link>
              {isSubscriber && (
                <Link
                  to="/dashboard/board-question-bank"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                >
                  <span>প্রশ্ন ব্যাংক দেখুন</span>
                </Link>
              )}
            </div>
          </div>

          {/* Visual Mockup Canvas Preview */}
          <div className="w-full lg:w-[360px] shrink-0 rounded-2xl border border-slate-200/90 bg-white shadow-md overflow-hidden">
            <div className="px-3.5 py-2.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Presentation className="size-4 text-purple-300" />
                <span>Smartboard Canvas</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] text-purple-200">
                Beta Preview
              </span>
            </div>

            <div className="p-4 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] space-y-3">
              <div className="rounded-xl border border-purple-200/80 bg-white/95 p-3 shadow-sm">
                <p className="text-[11px] font-semibold text-purple-700">
                  উদাহরণ প্রশ্ন • গণিত
                </p>
                <p className="text-xs text-slate-700 mt-1">
                  যদি a + b = 7 এবং ab = 10 হয়, তবে a² + b² এর মান কত?
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 p-3 text-xs text-indigo-800 space-y-1">
                <p className="font-semibold">বোর্ড সমাধান:</p>
                <p className="font-sans text-[11px]">
                  a² + b² = (a + b)² - 2ab = 7² - 2(10) = 49 - 20 = 29
                </p>
              </div>

              {/* Mock Toolbar */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {[MousePointer2, PenTool, Eraser, Shapes, Type, Layers].map(
                  (ToolIcon, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex size-8 items-center justify-center rounded-lg border text-xs ${
                        idx === 1
                          ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                          : "bg-white text-slate-500 border-slate-200"
                      }`}
                    >
                      <ToolIcon className="size-3.5" />
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {UPCOMING_FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl border ${item.tone}`}
                >
                  <Icon className="size-5" />
                </span>
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-slate-800">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
