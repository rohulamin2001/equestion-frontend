import { BookOpenCheck, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

export function SubjectSelectModal({
  showSubjectModal,
  setShowSubjectModal,
  selectedSubjects,
  setSelectedSubjects,
  tempSelectedSubjects,
  setTempSelectedSubjects,
  setSelectedChapters,
  filteredSyllabusList,
  fetchingSyllabus,
  subjectFilter,
  setSubjectFilter,
}) {
  return (
    <Dialog
      open={showSubjectModal}
      onOpenChange={(open) => {
        if (open) setTempSelectedSubjects(selectedSubjects);
        setShowSubjectModal(open);
      }}
    >
      <DialogContent
        from="top"
        showCloseButton={true}
        className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-sans"
      >
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-100/50 mb-0 flex flex-col justify-start items-start">
          <DialogTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <BookOpenCheck className="size-4 text-purple-600" />
            বিষয় সিলেক্ট করুন
          </DialogTitle>
          <DialogDescription className="text-[11px] text-slate-400 mt-0.5">
            একাধিক বিষয় নির্বাচন করতে পারবেন
          </DialogDescription>
        </DialogHeader>

        {/* Filter Tabs */}
        <div className="px-4 pt-3 pb-2 flex gap-1.5 flex-wrap border-b border-slate-100/50 bg-slate-50/40">
          {[
            { id: "all", label: "সবগুলো" },
            { id: "bangla", label: "বাংলা ভার্সন" },
            { id: "english", label: "English Version" },
            { id: "madrasah", label: "মাদ্রাসা" },
          ].map((f) => {
            const isActive = subjectFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSubjectFilter(f.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition cursor-pointer select-none ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-2xs"
                    : "bg-white text-slate-500 border border-slate-200 hover:border-purple-300 hover:text-purple-700"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Selected count bar */}
        {tempSelectedSubjects.length > 0 && (
          <div className="px-4 sm:px-5 pt-2.5 pb-0.5 flex items-center justify-between">
            <span className="text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-lg">
              {tempSelectedSubjects.length} টি বিষয় নির্বাচিত
            </span>
            <button
              type="button"
              onClick={() => setTempSelectedSubjects([])}
              className="text-[11px] font-medium text-rose-500 hover:text-rose-700 cursor-pointer"
            >
              সব সরান
            </button>
          </div>
        )}

        {/* Subject List */}
        <div className="max-h-[260px] overflow-y-auto px-4 sm:px-5 py-3 space-y-1.5 sm:space-y-2">
          {fetchingSyllabus ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-purple-500" />
            </div>
          ) : filteredSyllabusList.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8 font-normal italic">
              কোনো বিষয় পাওয়া যায়নি।
            </p>
          ) : (
            filteredSyllabusList.map((item) => {
              const itemId = item.subjectId?._id || item.subjectId;
              const isSelected = tempSelectedSubjects.some(
                (s) => (s.subjectId?._id || s.subjectId) === itemId,
              );
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    if (isSelected) {
                      setTempSelectedSubjects((prev) =>
                        prev.filter(
                          (s) => (s.subjectId?._id || s.subjectId) !== itemId,
                        ),
                      );
                    } else {
                      setTempSelectedSubjects((prev) => [...prev, item]);
                    }
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none group ${
                    isSelected
                      ? "border-purple-300 bg-purple-50/70 shadow-2xs"
                      : "border-slate-200 bg-white/80 hover:border-purple-200 hover:bg-purple-50/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div
                      className={`size-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "bg-purple-600 border-purple-600"
                          : "border-slate-300 group-hover:border-purple-400"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="size-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${isSelected ? "text-purple-800" : "text-slate-800"}`}
                    >
                      {item.subjectName}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-purple-100 text-purple-700 border-purple-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {item.version === "Bangla"
                      ? "বাংলা"
                      : item.version === "Madrasah"
                        ? "মাদ্রাসা"
                        : "ইংরেজি"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50/60 border-t border-slate-100/50 flex gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedSubjects(tempSelectedSubjects);
              const selectedIds = tempSelectedSubjects.map(
                (s) => s.subjectId?._id || s.subjectId,
              );
              setSelectedChapters((prev) =>
                prev.filter((key) => selectedIds.includes(key.split("_")[0])),
              );
              setShowSubjectModal(false);
            }}
            className="flex-1 h-9 sm:h-10 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 transition rounded-xl text-xs font-semibold text-white shadow-md shadow-purple-200 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="size-3.5" />
            সিলেক্ট করুন
          </button>
          <button
            type="button"
            onClick={() => setShowSubjectModal(false)}
            className="flex-1 h-9 sm:h-10 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-xl text-xs font-semibold text-slate-600 cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
