import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { translateSubscriptionKey } from "@/constants/subscriptions";
import {
  Calendar,
  FileText,
  Folder,
  FolderOpen,
  HelpCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCreatedQuestions } from "./hook/useCreatedQuestions";

export default function CreatedQuestions() {
  const {
    expandedClass,
    setExpandedClass,
    selectedVersion,
    setSelectedVersion,
    setToDelete,
    setSetToDelete,
    activeClasses,
    isLoading,
    deleteMutation,
    handleDeleteClick,
    versionCounts,
    questionSetsByClass,
  } = useCreatedQuestions();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-bold text-sm font-bengali">
          আপনার তৈরিকৃত প্রশ্নপত্র লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-glass-elevated border border-slate-200/50 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1.5 text-left">
          <h2 className="text-xl font-black text-slate-800 font-bengali tracking-tight">
            তৈরিকৃত প্রশ্ন সংগ্রহশালা
          </h2>
          <p className="text-xs text-slate-400 font-semibold font-bengali">
            আপনার এক ক্লিকে জেনারেট করা প্রশ্নপত্রগুলোর ক্লাস-ভিত্তিক তালিকা
            নিচে ফোল্ডার আকারে সাজানো আছে।
          </p>
        </div>
        <Link
          to="/dashboard/generate"
          className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold font-bengali shadow-md shadow-indigo-600/10 transition-all text-center self-start md:self-auto cursor-pointer"
        >
          নতুন প্রশ্ন জেনারেট করুন
        </Link>
      </div>

      {/* Category selection tabs */}
      <div className="flex justify-start">
        <div className="bg-slate-100 p-1 rounded-xl flex flex-wrap gap-1 border border-slate-200/60 shadow-inner">
          <button
            onClick={() => {
              setSelectedVersion("Bangla");
              setExpandedClass(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-bengali transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${
              selectedVersion === "Bangla"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            বাংলা ভার্সন
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedVersion === "Bangla"
                  ? "bg-indigo-50 text-indigo-650"
                  : "bg-slate-200/60 text-slate-500"
              }`}
            >
              {versionCounts.bangla}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedVersion("English");
              setExpandedClass(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-bengali transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${
              selectedVersion === "English"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            ইংলিশ ভার্সন
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedVersion === "English"
                  ? "bg-indigo-50 text-indigo-650"
                  : "bg-slate-200/60 text-slate-500"
              }`}
            >
              {versionCounts.english}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedVersion("Madrasah");
              setExpandedClass(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-bengali transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${
              selectedVersion === "Madrasah"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            মাদ্রাসা
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedVersion === "Madrasah"
                  ? "bg-indigo-50 text-indigo-650"
                  : "bg-slate-200/60 text-slate-500"
              }`}
            >
              {versionCounts.madrasah}
            </span>
          </button>
        </div>
      </div>

      {/* Class folders grid */}
      <div className="grid grid-cols-1 gap-4">
        {activeClasses.map((clsName) => {
          const label = translateSubscriptionKey(clsName);
          const sets = questionSetsByClass[clsName] || [];
          const isExpanded = expandedClass === clsName;

          return (
            <div
              key={clsName}
              className={`bg-glass-elevated border rounded-2xl transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? "border-indigo-200 shadow-md ring-1 ring-indigo-500/5"
                  : "border-slate-200/50 shadow-sm hover:border-slate-350"
              }`}
            >
              {/* Folder Header */}
              <div
                onClick={() => setExpandedClass(isExpanded ? null : clsName)}
                className="flex items-center justify-between p-5 cursor-pointer select-none"
              >
                <div className="flex items-center gap-4 text-left">
                  <div
                    className={`p-3 rounded-xl transition ${
                      isExpanded
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    {isExpanded ? (
                      <FolderOpen className="size-6" />
                    ) : (
                      <Folder className="size-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-slate-800 font-bengali">
                      {label}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-bold font-sans mt-0.5">
                      মোট তৈরি করা প্রশ্ন সেট: {sets.length} টি
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  {isExpanded ? "বন্ধ করুন" : "খুলুন"}
                </span>
              </div>

              {/* Folder Content - Accordion Panel */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-[#FAFAFC]/40 p-5">
                  {sets.length === 0 ? (
                    <div className="text-center py-8 space-y-2 border border-dashed border-slate-200 rounded-xl bg-white/50">
                      <HelpCircle className="size-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-400 font-semibold font-bengali">
                        এই ক্লাসে এখনও কোনো প্রশ্ন সেট তৈরি করা হয়নি।
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sets.map((set) => (
                        <Link
                          key={set._id}
                          to={`/dashboard/questions?setId=${set._id}`}
                          className="group relative flex items-start gap-4 p-4 border border-slate-200/50 bg-white hover:border-indigo-200 hover:bg-indigo-50/5 rounded-xl shadow-sm hover:shadow transition-all duration-200 text-left"
                        >
                          <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
                            <FileText className="size-5" />
                          </div>

                          <div className="space-y-1.5 flex-1 min-w-0 pr-8">
                            <h4 className="text-[13px] font-black text-slate-800 font-bengali truncate group-hover:text-indigo-700 transition">
                              {set.examName}
                            </h4>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 font-bold font-bengali">
                              <span>
                                বিষয়:{" "}
                                <strong className="text-slate-600">
                                  {set.subjectName}
                                </strong>
                              </span>
                              <span className="h-3 w-px bg-slate-200 hidden sm:inline" />
                              <span>
                                মার্কস:{" "}
                                <strong className="text-slate-600">
                                  {set.totalMarks}
                                </strong>
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-sans mt-2">
                              <Calendar className="size-3" />
                              {new Date(set.createdAt).toLocaleDateString(
                                "bn-BD",
                              )}
                            </div>
                          </div>

                          {/* Delete Set Button */}
                          <button
                            onClick={(e) => handleDeleteClick(e, set._id)}
                            disabled={deleteMutation.isPending}
                            className="absolute right-3 top-3 p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {activeClasses.length === 0 && (
          <div className="text-center py-16 bg-glass-elevated border border-slate-200/50 rounded-2xl space-y-3">
            <HelpCircle className="size-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 font-bengali">
              কোনো সাবস্ক্রাইব করা ক্লাস নেই
            </h3>
            <p className="text-xs text-slate-400 font-semibold font-bengali max-w-md mx-auto">
              প্রশ্ন সেট তৈরি করতে হলে প্রথমে আপনাকে প্যাকেজ বা ক্লাস
              সাবস্ক্রাইব করতে হবে।
            </p>
            <Link
              to="/dashboard/subscription"
              className="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold font-bengali shadow mt-2"
            >
              সাবস্ক্রিপশন কিনুন
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!setToDelete}
        onOpenChange={(open) => !open && setSetToDelete(null)}
      >
        <AlertDialogPopup className="max-w-md p-6 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative text-left">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bengali text-base font-extrabold text-slate-850">
              প্রশ্ন সেট মুছে ফেলুন
            </AlertDialogTitle>
            <AlertDialogDescription className="font-bengali text-xs text-slate-500 mt-2 font-medium">
              আপনি কি নিশ্চিতভাবে এই প্রশ্ন সেটটি মুছে ফেলতে চান? এই কাজটি আর
              ফিরিয়ে আনা সম্ভব নয়।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center gap-2 justify-end mt-4">
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="font-bengali text-xs font-semibold px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl cursor-pointer"
            >
              বাতিল করুন
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteMutation.mutate(setToDelete);
              }}
              disabled={deleteMutation.isPending}
              className="font-bengali text-xs font-bold px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  মুছে ফেলা হচ্ছে...
                </>
              ) : (
                "মুছে ফেলুন"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}
