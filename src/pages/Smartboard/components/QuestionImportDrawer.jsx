import RichTextRender from "@/components/RichTextRender";
import { useUserContext } from "@/context/UserContext";
import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronRight,
  Landmark,
  Layers,
  Loader2,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

export default function QuestionImportDrawer({
  open,
  onClose,
  onImportSingleQuestion,
  onImportWholeSet,
}) {
  const { userProfile } = useUserContext();
  const [activeSourceTab, setActiveSourceTab] = useState("created");
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const setsQuery = useQuery({
    queryKey: ["smartboardQuestionSets"],
    queryFn: async () => {
      const res = await apiClient.get("/question-sets");
      return res.data.questionSets || [];
    },
    enabled: open && !!userProfile && activeSourceTab === "created",
  });

  const setDetailsQuery = useQuery({
    queryKey: ["smartboardQuestionSetDetail", selectedSetId],
    queryFn: async () => {
      const res = await apiClient.get(`/question-sets/${selectedSetId}`);
      return res.data.questionSet || null;
    },
    enabled: open && Boolean(selectedSetId),
  });

  if (!open || typeof document === "undefined") return null;

  const sets = (setsQuery.data || []).filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.examName?.toLowerCase().includes(q) ||
      s.subjectName?.toLowerCase().includes(q) ||
      s.className?.toLowerCase().includes(q)
    );
  });

  const activeSet = setDetailsQuery.data;
  const questions = Array.isArray(activeSet?.questions) ? activeSet.questions : [];

  return createPortal(
    <div className="fixed inset-0 z-[9990] flex justify-end font-bengali">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
        aria-hidden
      />
      <aside className="relative z-10 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2 bg-gradient-to-r from-purple-50/80 to-white">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <BookOpen className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              বোর্ডে প্রশ্ন লোড করুন
            </h2>
            <p className="text-[11px] text-slate-500">
              ১ ক্লিকে প্রশ্ন সরাসরি স্লাইডে যুক্ত হবে
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
          aria-label="বন্ধ করুন"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Source Tabs */}
      <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setActiveSourceTab("created");
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSourceTab === "created"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          আমার তৈরিকৃত প্রশ্ন
        </button>
        <button
          type="button"
          onClick={() => setActiveSourceTab("board")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer inline-flex items-center justify-center gap-1 ${
            activeSourceTab === "board"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Landmark className="size-3.5" />
          <span>বোর্ড প্রশ্ন ব্যাংক</span>
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeSourceTab === "board" ? (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-center space-y-3">
            <Landmark className="size-8 text-indigo-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              বোর্ড প্রশ্ন ব্যাংক ইন্টিগ্রেশন প্রস্তুত
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              সিলেট, রাজশাহী, বরিশাল, ঢাকাসহ সকল বোর্ডের প্রশ্ন আপলোড হওয়ার সাথে
              সাথেই এখান থেকে সরাসরি স্মার্টবোর্ডে লোড করতে পারবেন।
            </p>
            <Link
              to="/dashboard/board-question-bank"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
            >
              <span>বোর্ড প্রশ্ন ব্যাংক দেখুন</span>
            </Link>
          </div>
        ) : selectedSetId && activeSet ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedSetId(null)}
                className="text-xs font-semibold text-purple-700 hover:underline cursor-pointer"
              >
                ← সব প্রশ্ন সেটে ফিরুন
              </button>
              <span className="text-[11px] text-slate-500">
                মোট {questions.length.toLocaleString("bn-BD")}টি প্রশ্ন
              </span>
            </div>

            <div className="rounded-xl border border-purple-200/80 bg-purple-50/50 p-3 space-y-2">
              <p className="text-xs font-bold text-slate-900">
                {activeSet.examName}
              </p>
              <p className="text-[11px] text-slate-600">
                {activeSet.className} • {activeSet.subjectName}
              </p>
              {questions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onImportWholeSet(activeSet);
                    onClose();
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm cursor-pointer transition"
                >
                  <Layers className="size-3.5" />
                  <span>সব প্রশ্ন আলাদা স্লাইডে আনুন (Auto Split)</span>
                </button>
              )}
            </div>

            {setDetailsQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-5 animate-spin text-purple-600" />
              </div>
            ) : questions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                এই সেটে কোনো প্রশ্ন পাওয়া যায়নি।
              </p>
            ) : (
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div
                    key={q._id || idx}
                    className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 hover:border-purple-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold shrink-0">
                        প্রশ্ন {(idx + 1).toLocaleString("bn-BD")}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onImportSingleQuestion(q, activeSet._id)
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 text-[11px] font-semibold cursor-pointer transition"
                      >
                        <Plus className="size-3" />
                        <span>স্লাইডে যোগ করুন</span>
                      </button>
                    </div>
                    <div className="text-xs text-slate-700 line-clamp-3">
                      <RichTextRender
                        content={q.questionText || q.stem || q.question || ""}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="পরীক্ষা, বিষয় বা শ্রেণি দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            {setsQuery.isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-xs text-slate-500">
                <Loader2 className="size-5 animate-spin text-purple-600" />
                <span>তৈরিকৃত প্রশ্ন সেট লোড হচ্ছে...</span>
              </div>
            ) : sets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center space-y-2">
                <Sparkles className="size-7 text-purple-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  কোনো সংরক্ষিত প্রশ্ন সেট পাওয়া যায়নি
                </p>
                <p className="text-[11px] text-slate-500">
                  “১ ক্লিকে প্রশ্ন তৈরি” থেকে প্রশ্ন সেট সেভ করলে এখানে দেখতে
                  পাবেন।
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sets.map((set) => (
                  <button
                    key={set._id}
                    type="button"
                    onClick={() => setSelectedSetId(set._id)}
                    className="w-full text-left rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 p-3 flex items-center justify-between gap-2 transition cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {set.examName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {set.className} • {set.subjectName} •{" "}
                        {(set.questions?.length || 0).toLocaleString("bn-BD")}টি
                        প্রশ্ন
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
    </div>,
    document.body,
  );
}
