import { CheckCircle2, Eye, Info, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { translateSubscriptionKey } from "../../constants/subscriptions";
import { useUserContext } from "../../context/UserContext";
import { useQuestions } from "./hook/useQuestions";

const toBanglaNumber = (num) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (digit) => banglaDigits[digit]);
};

const getExamTime = (category, totalMarks) => {
  const marks = parseInt(totalMarks, 10) || 100;
  let totalMinutes;

  if (category === "MCQ") {
    totalMinutes = marks; // 1 minute per mark
  } else if (category === "Creative") {
    // ~2.15 minutes per mark (70 marks = 150 minutes, 100 marks = 215 minutes)
    totalMinutes = Math.round(marks * 2.15);
  } else {
    // Other categories: 1.5 minutes per mark (e.g. 100 marks = 150 minutes, 50 marks = 75 minutes)
    totalMinutes = Math.round(marks * 1.5);
  }

  // Round to nearest 5 minutes
  let roundedMinutes = Math.round(totalMinutes / 5) * 5;
  if (roundedMinutes === 0 && totalMinutes > 0) {
    roundedMinutes = 5;
  }

  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  if (hours === 0) {
    return `${toBanglaNumber(minutes)} মিনিট`;
  }
  if (minutes === 0) {
    return `${toBanglaNumber(hours)} ঘণ্টা`;
  }
  return `${toBanglaNumber(hours)} ঘণ্টা ${toBanglaNumber(minutes)} মিনিট`;
};

const getChapterNames = (set, syllabusList) => {
  if (!set.chapters || set.chapters.length === 0) return "";

  const targetSubjectId = set.subjectId?._id || set.subjectId;

  const matchingSyllabus = syllabusList?.find(
    (s) =>
      s.className === set.className &&
      (s.subjectId?._id === targetSubjectId || s.subjectId === targetSubjectId),
  );

  if (!matchingSyllabus || !matchingSyllabus.chapters) {
    return `অধ্যায়: ${set.chapters.join(", ")}`;
  }

  const names = set.chapters.map((chapNum) => {
    const chap = matchingSyllabus.chapters.find(
      (c) => c.chapterNumber === chapNum,
    );
    return chap ? chap.chapterName : `অধ্যায় ${chapNum}`;
  });

  return names.join(", ");
};

export default function Questions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userProfile } = useUserContext();
  const idsParam =
    searchParams.get("setId") || searchParams.get("setIds") || "";

  const { questionSets, loadingSets, syllabusList } = useQuestions();

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

  const institutionName =
    userProfile?.institutionName || "সোনার বাংলা হাই স্কুল";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questionSets.map((set) => {
          const hasQuestions = set.questions && set.questions.length > 0;
          const banglaClass = translateSubscriptionKey(set.className);
          const chapterNames = getChapterNames(set, syllabusList);

          return (
            <div
              key={set._id}
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between p-1 bg-slate-50/20"
            >
              {/* ─── Question Paper Real Header Style ─── */}
              <div className="bg-white px-6 pt-6 pb-4 relative">
                {/* Main Exam Title (Centered) */}
                <div className="text-center space-y-1 mt-1">
                  <h2 className="text-base font-black text-slate-900 leading-tight">
                    {institutionName}
                  </h2>
                  <p className="text-xs text-slate-700 font-bold">
                    {set.examName}
                  </p>
                  <p className="text-xs text-slate-700 font-semibold">
                    {banglaClass}
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">
                    বিষয়: {set.subjectName}
                  </p>
                  {chapterNames && (
                    <p className="text-[10px] text-slate-500 font-medium">
                      অধ্যায়: {chapterNames}
                    </p>
                  )}
                </div>

                {/* Bottom Stats: Time & Marks */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-850 border-t border-slate-200 pt-2.5 font-bold font-sans">
                  <div>
                    সময়:{" "}
                    <span className="font-sans">
                      {getExamTime(set.category, set.totalMarks)}
                    </span>
                  </div>
                  <div>
                    পূর্ণমান:{" "}
                    <span className="font-sans">{set.totalMarks}</span>
                  </div>
                </div>

                {/* Instructions Text Bar */}
                <div className="mt-3 text-center border-t border-slate-100 pt-2 text-[10px] text-slate-500 font-bold">
                  {set.instructionsText ||
                    "প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেওয়া যাবে না।"}
                </div>
              </div>

              {/* ─── Card Body ─── */}
              <div className="px-6 py-5 bg-white border-t border-slate-100 flex-1 flex flex-col justify-center min-h-[140px]">
                {!hasQuestions ? (
                  /* Empty set */
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      প্রশ্নসেট তৈরি হয়েছে!
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal max-w-[240px] mx-auto">
                      নিচের বাটনে ক্লিক করে ডেটাবেজ থেকে প্রশ্ন যুক্ত করুন
                    </p>
                    <button
                      onClick={() => handleOpenSelectPage(set._id)}
                      className="mx-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition shadow-sm hover:shadow cursor-pointer"
                    >
                      প্রশ্ন যুক্ত করুন
                    </button>
                  </div>
                ) : (
                  /* Has questions */
                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      প্রশ্নপত্র প্রস্তুত
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      মোট {set.questions.length} টি প্রশ্ন যুক্ত আছে
                    </p>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 max-w-[280px] mx-auto">
                      <button
                        onClick={() => handleOpenSelectPage(set._id)}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        সম্পাদনা
                      </button>
                      <button
                        onClick={() => handleOpenPreviewPage(set._id)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow shadow-indigo-500/10"
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
