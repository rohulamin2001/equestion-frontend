import { Check, CheckCircle2, Eye, Info, Loader2, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuestions } from "./hook/useQuestions";

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
          কোনো প্রশ্ন সেট পাওয়া যায়নি
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          দয়া করে এক ক্লিকে প্রশ্ন তৈরি পেজ থেকে নতুন প্রশ্নসেট জেনারেট করুন।
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

  return (
    <div className="max-w-4xl mx-auto w-full pb-12 font-bengali text-left space-y-6">
      {/* Page Title Header */}
      <div>
        <h1 className="text-xl font-black text-slate-850">
          তৈরিকৃত প্রশ্ন সেটের তালিকা
        </h1>
        <p className="text-xs text-slate-450 mt-1">
          শ্রেণী, পরীক্ষা এবং বিষয়ভিত্তিক প্রশ্নপত্রের তালিকা নিচে দেওয়া হলো।
        </p>
      </div>

      {/* Cards list matching the number of generated question sets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questionSets.map((set) => {
          const hasQuestions = set.questions && set.questions.length > 0;
          return (
            <div
              key={set._id}
              className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5"
            >
              {/* Card Title Header */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase font-sans">
                  {set.category}
                </span>
                <h2 className="text-base font-black text-slate-850 pt-1">
                  {set.examName}
                </h2>
                <div className="flex gap-2 text-xs text-slate-450 font-bold">
                  <span>শ্রেণী: {set.className}</span>
                  <span>• বিষয়: {set.subjectName}</span>
                </div>
              </div>

              {/* Status Section */}
              {!hasQuestions ? (
                /* Empty set status placeholder */
                <div className="bg-indigo-50/15 border border-dashed border-indigo-100/60 p-5 rounded-2xl text-center space-y-3 py-6">
                  <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-slate-800 text-xs">
                      প্রশ্নসেট তৈরি হয়েছে!
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      নিচের বাটনে ক্লিক করে ডেটাবেজ থেকে প্রশ্ন যুক্ত করুন
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenSelectPage(set._id)}
                    className="mx-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    প্রশ্ন যুক্ত করুন
                  </button>
                </div>
              ) : (
                /* Questions added status placeholder */
                <div className="bg-emerald-50/10 border border-dashed border-emerald-100/60 p-5 rounded-2xl text-center space-y-3 py-6">
                  <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-slate-800 text-xs">
                      প্রশ্নপত্র প্রস্তুত!
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      এই সেটে মোট {set.questions.length} টি প্রশ্ন যুক্ত আছে।
                    </p>
                  </div>

                  {/* Option controls */}
                  <div className="grid grid-cols-2 gap-2 pt-1.5 max-w-xs mx-auto">
                    <button
                      onClick={() => handleOpenSelectPage(set._id)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      সম্পাদনা করুন
                    </button>
                    <button
                      onClick={() => handleOpenPreviewPage(set._id)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow shadow-indigo-500/10"
                    >
                      <Eye className="size-3.5" />
                      লেআউট প্রিভিউ
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
