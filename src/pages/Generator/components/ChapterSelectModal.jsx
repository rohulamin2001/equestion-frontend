import { BookOpen, CheckCircle2, FolderTree, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

export function ChapterSelectModal({
  showChapterModal,
  setShowChapterModal,
  selectedSubjects,
  selectedChapters,
  setSelectedChapters,
  hasSubjectAccess,
}) {
  return (
    <Dialog open={showChapterModal} onOpenChange={setShowChapterModal}>
      <DialogContent
        from="top"
        showCloseButton={true}
        className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans"
      >
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-100/50 mb-0 flex flex-col justify-start items-start">
          <DialogTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <FolderTree className="size-4 text-purple-600" />
            অধ্যায় সিলেক্ট করুন
          </DialogTitle>
          <DialogDescription className="text-[11px] text-slate-400 mt-0.5">
            প্রতিটি বিষয় থেকে পছন্দের অধ্যায় নির্বাচন করুন
          </DialogDescription>
        </DialogHeader>

        {/* Chapter List */}
        <div className="max-h-[380px] overflow-y-auto p-4 sm:p-5 space-y-3.5 sm:space-y-4">
          {selectedSubjects.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6 italic font-normal">
              কোনো বিষয় সিলেক্ট করা নেই।
            </p>
          ) : (
            selectedSubjects.map((sub) => {
              const subId = sub.subjectId?._id || sub.subjectId;
              const isSubscribed = hasSubjectAccess(sub);
              const subjectKeys = (sub.chapters || []).map(
                (ch) => `${subId}_${ch.chapterNumber}`,
              );
              const checkedInSubject = subjectKeys.filter((k) =>
                selectedChapters.includes(k),
              );

              return (
                <div key={subId} className="space-y-1.5 sm:space-y-2">
                  {/* Subject header with select all */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-purple-50/80 rounded-xl border border-purple-100">
                    <h4 className="text-xs font-semibold text-purple-700 flex items-center gap-1.5">
                      <BookOpen className="size-3.5" />
                      {sub.subjectName} (
                      {sub.version === "Bangla"
                        ? "বাংলা"
                        : sub.version === "Madrasah"
                          ? "মাদ্রাসা"
                          : "ইংরেজি"}
                      )
                    </h4>
                    {isSubscribed &&
                      sub.chapters &&
                      sub.chapters.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const allChecked = subjectKeys.every((k) =>
                              selectedChapters.includes(k),
                            );
                            if (allChecked) {
                              setSelectedChapters((prev) =>
                                prev.filter((k) => !subjectKeys.includes(k)),
                              );
                            } else {
                              setSelectedChapters((prev) => [
                                ...new Set([...prev, ...subjectKeys]),
                              ]);
                            }
                          }}
                          className="text-[10px] font-semibold text-purple-600 hover:text-purple-800 cursor-pointer transition"
                        >
                          {subjectKeys.every((k) =>
                            selectedChapters.includes(k),
                          )
                            ? "সব সরান"
                            : "সব নির্বাচন"}
                        </button>
                      )}
                  </div>

                  {/* Chapter count badge */}
                  {checkedInSubject.length > 0 && (
                    <div className="px-2 text-[10px] font-semibold text-emerald-600">
                      ✓ {checkedInSubject.length} টি অধ্যায় নির্বাচিত
                    </div>
                  )}

                  {!sub.chapters || sub.chapters.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic pl-2 font-normal">
                      কোনো অধ্যায় পাওয়া যায়নি।
                    </p>
                  ) : (
                    <div className="space-y-1.5 pl-1">
                      {sub.chapters.map((ch, idx) => {
                        const isLocked = !isSubscribed && idx > 0;
                        const key = `${subId}_${ch.chapterNumber}`;
                        const isChecked = selectedChapters.includes(key);

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (isLocked) {
                                toast.error(
                                  "বাকি অধ্যায়সমূহ আনলক করতে সাবস্ক্রাইব করুন।",
                                );
                                return;
                              }
                              setSelectedChapters((prev) =>
                                prev.includes(key)
                                  ? prev.filter((k) => k !== key)
                                  : [...prev, key],
                              );
                            }}
                            className={`p-2.5 sm:p-3 border rounded-xl flex items-center justify-between transition select-none group ${
                              isLocked
                                ? "border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-55"
                                : isChecked
                                  ? "border-purple-300 bg-purple-50/70 cursor-pointer shadow-2xs"
                                  : "border-slate-200 bg-white/80 hover:border-purple-200 hover:bg-purple-50/20 cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 sm:gap-3">
                              {isLocked ? (
                                <Lock className="size-3.5 sm:size-4 text-slate-300 shrink-0" />
                              ) : (
                                <div
                                  className={`size-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                    isChecked
                                      ? "bg-purple-600 border-purple-600"
                                      : "border-slate-300 group-hover:border-purple-400"
                                  }`}
                                >
                                  {isChecked && (
                                    <CheckCircle2 className="size-3 text-white" />
                                  )}
                                </div>
                              )}
                              <span
                                className={`text-xs font-medium ${isLocked ? "text-slate-300" : isChecked ? "text-purple-800" : "text-slate-800"}`}
                              >
                                {ch.chapterName}
                              </span>
                            </div>
                            {isLocked && (
                              <span className="text-[10px] font-medium text-slate-300 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                <Lock className="size-2.5" /> Locked
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50/60 border-t border-slate-100/50">
          <button
            type="button"
            onClick={() => setShowChapterModal(false)}
            className="w-full h-9 sm:h-10 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 transition rounded-xl text-xs font-semibold text-white shadow-md shadow-purple-200 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="size-3.5" />
            ঠিক আছে ({selectedChapters.length} টি নির্বাচিত)
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
