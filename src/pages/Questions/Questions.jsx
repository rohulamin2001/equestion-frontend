import { CheckCircle2, Clock, Eye, Info, Loader2, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { translateSubscriptionKey } from "../../constants/subscriptions";
import { useQuestions } from "./hook/useQuestions";

// Category label map
const CATEGORY_LABEL = {
  MCQ: "বহুনির্বাচনী (MCQ)",
  Creative: "সৃজনশীল",
  ShortAnswer: "সংক্ষিপ্ত প্রশ্ন",
  BroadQuestion: "রচনামূলক",
  FillInBlanks: "শূন্যস্থান পূরণ",
  Matching: "মিলকরণ",
  Combined: "সম্মিলিত",
};

export default function Questions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idsParam =
    searchParams.get("setId") || searchParams.get("setIds") || "";

  const { questionSets, loadingSets } = useQuestions();

  if (loadingSets) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-500 font-semibold">
          প্রশ্নপত্র লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (questionSets.length === 0) {
    return (
      <div className="bg-white border p-12 text-center rounded-2xl max-w-md mx-auto mt-12 font-bengali text-left">
        <Info className="h-10 w-10 text-slate-350 mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-800">
          কোনো প্রশ্ন সেট পাওয়া যায়নি
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          দয়া করে এক ক্লিকে প্রশ্ন তৈরি পেজ থেকে নতুন প্রশ্নসেট জেনারেট করুন।
        </p>
      </div>
    );
  }

  const handleOpenSelectPage = (setId) => {
    navigate(`/dashboard/questions/select?setId=${setId}&setIds=${idsParam}`);
  };

  const handleOpenPreviewPage = (setId) => {
    navigate(`/dashboard/questions/preview?setId=${setId}&setIds=${idsParam}`);
  };

  // Helper to split subject code into digits or default to three empty boxes
  const renderSubjectCodeBoxes = (subjectCode) => {
    const codeStr = String(subjectCode || "").replace(/\D/g, "");
    const digits = codeStr ? codeStr.split("") : ["০", "০", "০"];
    // Ensure we show at least 3 boxes
    while (digits.length < 3) {
      digits.unshift("০");
    }
    return (
      <div className="flex items-center gap-0.5">
        <span className="text-[10px] text-slate-500 mr-1 font-bold">
          বিষয় কোড :
        </span>
        {digits.slice(-3).map((digit, idx) => (
          <span
            key={idx}
            className="w-4 h-5 inline-flex items-center justify-center border border-slate-800 text-[10px] font-black text-slate-900 bg-white font-sans"
          >
            {digit}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12 font-bengali text-left space-y-6">
      {/* Page Title Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          তৈরিকৃত প্রশ্ন সেটের তালিকা
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          শ্রেণী, পরীক্ষা এবং বিষয়ভিত্তিক প্রশ্নপত্রের তালিকা নিচে দেওয়া হলো।
        </p>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {questionSets.map((set) => {
          const hasQuestions = set.questions && set.questions.length > 0;
          const categoryLabel = CATEGORY_LABEL[set.category] || set.category;
          const banglaClass = translateSubscriptionKey(set.className);

          return (
            <div
              key={set._id}
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
            >
              {/* ─── Question Paper Real Header Style ─── */}
              <div className="bg-slate-50/50 border-b border-slate-200 px-5 pt-5 pb-3 relative">
                {/* Top Category Badge */}
                <div className="absolute top-3 left-4">
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                    {categoryLabel}
                  </span>
                </div>

                {/* Main Exam Title (Centered) */}
                <div className="text-center space-y-0.5 mt-1">
                  <h2 className="text-sm font-bold text-slate-900 leading-tight">
                    {set.examName}
                  </h2>
                  <p className="text-xs text-slate-700 font-semibold">
                    {banglaClass}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {set.subjectName}
                  </p>
                </div>

                {/* Middle Right: Subject Code (Styled exactly like exam paper) */}
                <div className="absolute top-3 right-4">
                  {renderSubjectCodeBoxes(
                    set.subjectCode || set.subjectId?.subjectCode,
                  )}
                </div>

                {/* Bottom Stats: Time & Marks */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-800 border-t border-slate-200 pt-2 font-medium">
                  <div>
                    সময়— <span className="font-semibold">২০ মিনিট</span>
                  </div>
                  <div>
                    পূর্ণমান—{" "}
                    <span className="font-semibold">{set.totalMarks}</span>
                  </div>
                </div>

                {/* Instructions Text Bar */}
                <div className="mt-2 text-center bg-slate-100 border border-slate-200 py-0.5 rounded text-[9px] text-slate-500 font-medium">
                  প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেওয়া যাবে না।
                </div>
              </div>

              {/* ─── Card Body ─── */}
              <div className="px-5 py-4 bg-white flex-1 flex flex-col justify-center">
                {!hasQuestions ? (
                  /* Empty set */
                  <div className="text-center space-y-3">
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-semibold text-slate-800 text-xs">
                        প্রশ্নসেট তৈরি হয়েছে!
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        এখনো কোনো প্রশ্ন যুক্ত করা হয়নি
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenSelectPage(set._id)}
                      className="mx-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      প্রশ্ন যুক্ত করুন
                    </button>
                  </div>
                ) : (
                  /* Has questions */
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800 leading-none">
                          প্রশ্নপত্র প্রস্তুত
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          মোট {set.questions.length} টি প্রশ্ন যুক্ত আছে
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenSelectPage(set._id)}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        সম্পাদনা
                      </button>
                      <button
                        onClick={() => handleOpenPreviewPage(set._id)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer shadow shadow-indigo-500/10"
                      >
                        <Eye className="size-3.5" />
                        প্রিভিউ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
