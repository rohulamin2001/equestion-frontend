import { useQuery } from "@tanstack/react-query";
import {
  Copy,
  FolderOpen,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { smartboardApi } from "../services/smartboardApi";

export default function SmartboardLibraryModal({
  open,
  onClose,
  onOpenLesson,
  onNewLesson,
  onDuplicateLesson,
  onDeleteLesson,
}) {
  const [search, setSearch] = useState("");

  const lessonsQuery = useQuery({
    queryKey: ["smartboardLessons", search],
    queryFn: () => smartboardApi.listLessons({ search: search.trim() }),
    enabled: open,
  });

  if (!open || typeof document === "undefined") return null;

  const lessons = lessonsQuery.data?.lessons || [];

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9990] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 font-bengali"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
      >
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="size-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              সংরক্ষিত স্মার্টবোর্ড লেসন লাইব্রেরি
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onNewLesson();
                onClose();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>নতুন লেসন</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="লেসনের নাম বা বিষয় দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {lessonsQuery.isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="size-6 animate-spin text-purple-600" />
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-10">
              এখনো কোনো ক্লাউড লেসন সেভ করা হয়নি।
            </p>
          ) : (
            lessons.map((l) => (
              <div
                key={l._id}
                className="rounded-xl border border-slate-200 hover:border-purple-300 bg-white p-3 flex items-center justify-between gap-3 transition"
              >
                <div
                  onClick={() => {
                    onOpenLesson(l._id);
                    onClose();
                  }}
                  className="min-w-0 flex-1 cursor-pointer"
                >
                  <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {l.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {(l.slideCount || l.slideOrder?.length || 1).toLocaleString(
                      "bn-BD",
                    )}
                    টি স্লাইড • সর্বশেষ এডিট:{" "}
                    {new Date(l.updatedAt).toLocaleDateString("bn-BD")}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenLesson(l._id);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white text-xs font-semibold cursor-pointer transition"
                  >
                    খুলুন
                  </button>
                  <button
                    type="button"
                    title="ডুপ্লিকেট"
                    onClick={() => onDuplicateLesson(l._id)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    title="ডিলিট"
                    onClick={() => onDeleteLesson(l._id)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
