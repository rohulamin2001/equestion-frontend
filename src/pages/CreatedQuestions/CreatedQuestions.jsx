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
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { useCreatedQuestions } from "./hook/useCreatedQuestions";

export default function CreatedQuestions() {
  const {
    expandedClass,
    setExpandedClass,
    selectedVersion,
    setSelectedVersion,
    activeVersions = ["Bangla", "English", "Madrasah"],
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
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--purple-600)]" />
        <p className="text-slate-500 font-medium text-sm">
          আপনার তৈরিকৃত প্রশ্নপত্র লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-glass-elevated border border-slate-200/50 p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="space-y-1 text-left z-10">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            তৈরিকৃত প্রশ্ন সংগ্রহশালা
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            আপনার এক ক্লিকে জেনারেট করা প্রশ্নপত্রগুলোর ক্লাস-ভিত্তিক তালিকা
            নিচে ফোল্ডার আকারে সাজানো আছে।
          </p>
        </div>
        <Link
          to="/dashboard/generate"
          className="px-5 py-2.5 bg-gradient-to-r from-[var(--purple-700)] to-[var(--purple-600)] hover:from-[var(--purple-800)] hover:to-[var(--purple-700)] text-white rounded-xl text-xs font-semibold shadow-md shadow-[var(--purple-600)]/20 transition-all text-center self-start md:self-auto cursor-pointer z-10"
        >
          নতুন প্রশ্ন জেনারেট করুন
        </Link>
      </div>

      {/* Category selection tabs */}
      {activeVersions.length > 0 && (
        <div className="flex justify-start">
          <div className="bg-slate-100/80 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200/60 shadow-inner relative">
            {[
              {
                id: "Bangla",
                label: "বাংলা ভার্সন",
                count: versionCounts.bangla,
              },
              {
                id: "English",
                label: "ইংলিশ ভার্সন",
                count: versionCounts.english,
              },
              {
                id: "Madrasah",
                label: "মাদ্রাসা",
                count: versionCounts.madrasah,
              },
            ]
              .filter((tab) => activeVersions.includes(tab.id))
              .map((tab) => {
                const isSelected = selectedVersion === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedVersion(tab.id);
                      setExpandedClass(null);
                    }}
                    className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-200 flex items-center gap-2 cursor-pointer select-none z-10 ${
                      isSelected
                        ? "text-[var(--purple-700)]"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeCreatedVersionTab"
                        className="absolute inset-0 bg-white rounded-xl shadow-sm border border-purple-200/50 -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                        isSelected
                          ? "bg-[var(--purple-50)] text-[var(--purple-700)] font-bold"
                          : "bg-slate-200/70 text-slate-500 font-medium"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Class folders grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedVersion}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="grid grid-cols-1 gap-4"
        >
          {activeClasses.map((clsName) => {
            const label = translateSubscriptionKey(clsName);
            const sets = questionSetsByClass[clsName] || [];
            const isExpanded = expandedClass === clsName;

            return (
              <div
                key={clsName}
                className={`bg-glass-elevated border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "border-[var(--purple-200)] shadow-md ring-1 ring-[var(--purple-600)]/10"
                    : "border-slate-200/50 shadow-sm hover:border-purple-200/60 hover:shadow-md"
                }`}
              >
                {/* Folder Header */}
                <div
                  onClick={() => setExpandedClass(isExpanded ? null : clsName)}
                  className="flex items-center justify-between p-4 sm:p-5 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 text-left">
                    <div
                      className={`p-2.5 sm:p-3 rounded-xl transition-all duration-200 ${
                        isExpanded
                          ? "bg-[var(--purple-50)] text-[var(--purple-600)] shadow-xs"
                          : "bg-slate-100/70 text-slate-500 group-hover:bg-purple-50 group-hover:text-purple-600"
                      }`}
                    >
                      {isExpanded ? (
                        <FolderOpen className="size-5 sm:size-6 text-purple-600" />
                      ) : (
                        <Folder className="size-5 sm:size-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-800">
                        {label}
                      </h3>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">
                        মোট তৈরি করা প্রশ্ন সেট: {sets.length} টি
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1 group-hover:text-purple-600 transition">
                    {isExpanded ? "বন্ধ করুন" : "খুলুন"}
                  </span>
                </div>

                {/* Folder Content - Accordion Panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-purple-100/50 bg-slate-50/50 p-4 sm:p-5">
                        {sets.length === 0 ? (
                          <div className="text-center py-8 space-y-2 border border-dashed border-slate-200 rounded-xl bg-white/50">
                            <HelpCircle className="size-8 text-slate-300 mx-auto" />
                            <p className="text-xs text-slate-400 font-normal">
                              এই ক্লাসে এখনও কোনো প্রশ্ন সেট তৈরি করা হয়নি।
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                            {sets.map((set) => (
                              <Link
                                key={set._id}
                                to={`/dashboard/questions?setId=${set._id}`}
                                className="group relative flex items-start gap-3.5 p-3.5 sm:p-4 border border-slate-200/60 bg-white/90 hover:bg-white hover:border-[var(--purple-200)] hover:shadow-md transition-all duration-200 rounded-xl text-left"
                              >
                                <div className="p-2 sm:p-2.5 bg-[var(--purple-50)] text-[var(--purple-600)] rounded-xl group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                                  <FileText className="size-4.5 sm:size-5 text-purple-600" />
                                </div>

                                <div className="space-y-1 flex-1 min-w-0 pr-8">
                                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-[var(--purple-700)] transition">
                                    {set.examName}
                                  </h4>

                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-normal">
                                    <span>
                                      বিষয়:{" "}
                                      <strong className="font-semibold text-slate-700">
                                        {set.subjectName}
                                      </strong>
                                    </span>
                                    <span className="h-3 w-px bg-slate-200 hidden sm:inline" />
                                    <span>
                                      মার্কস:{" "}
                                      <strong className="font-semibold text-slate-700">
                                        {set.totalMarks}
                                      </strong>
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-normal mt-1.5">
                                    <Calendar className="size-3 text-slate-400" />
                                    {new Date(set.createdAt).toLocaleDateString(
                                      "bn-BD",
                                    )}
                                  </div>
                                </div>

                                {/* Delete Set Button */}
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteClick(e, set._id)}
                                  disabled={deleteMutation.isPending}
                                  className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition opacity-0 group-hover:opacity-100 cursor-pointer"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {activeClasses.length === 0 && (
            <div className="text-center py-16 bg-glass-elevated border border-slate-200/50 rounded-2xl space-y-3">
              <HelpCircle className="size-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-800">
                কোনো প্রশ্ন সেট পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-500 font-normal max-w-sm mx-auto">
                আপনার পছন্দের ক্যাটাগরিতে এখনও কোনো প্রশ্নপত্র তৈরি করা হয়নি।
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AlertDialog
        open={!!setToDelete}
        onOpenChange={() => setSetToDelete(null)}
      >
        <AlertDialogPopup className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans">
          <div className="p-6 text-center space-y-4">
            <div className="size-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600">
              <Trash2 className="size-6 text-rose-600" />
            </div>

            <AlertDialogHeader className="space-y-1.5 p-0">
              <AlertDialogTitle className="text-base font-semibold text-slate-800 text-center">
                প্রশ্ন সেটটি কি মুছে ফেলতে চান?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-slate-500 text-center font-normal leading-relaxed">
                এটি স্থায়ীভাবে আপনার অ্যাকাউন্ট থেকে মুছে ফেলা হবে। এই কাজটি আর
                ফিরিয়ে নেওয়া যাবে না।
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex sm:flex-row gap-2.5 pt-2 sm:justify-center">
              <AlertDialogCancel
                onClick={() => setSetToDelete(null)}
                className="flex-1 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                বাতিল করুন
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  setToDelete && deleteMutation.mutate(setToDelete)
                }
                disabled={deleteMutation.isPending}
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-semibold shadow-md shadow-rose-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin text-white" />
                ) : (
                  "হ্যাঁ, মুছে ফেলুন"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}
