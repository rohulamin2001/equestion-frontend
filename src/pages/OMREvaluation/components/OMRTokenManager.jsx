import React, { useState } from "react";
import {
  Plus,
  KeyRound,
  CheckCircle2,
  Copy,
  Trash2,
  Edit,
  PlayCircle,
  FileCheck,
  ChevronRight,
  BookOpen,
  Hash,
  Layers,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  useOMRTokens,
  useOMRTemplates,
  useCreateOMRToken,
  useUpdateOMRToken,
  useDeleteOMRToken,
} from "../hook/useOMREvaluation";
import { toast } from "sonner";

export default function OMRTokenManager({ onSelectTokenForEvaluation }) {
  const { data: tokens = [], isLoading: loadingTokens } = useOMRTokens();
  const { data: templates = [], isLoading: loadingTemplates } = useOMRTemplates();
  const createTokenMutation = useCreateOMRToken();
  const updateTokenMutation = useUpdateOMRToken();
  const deleteTokenMutation = useDeleteOMRToken();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingToken, setEditingToken] = useState(null);

  // Form State
  const [examTitle, setExamTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [negativeMarks, setNegativeMarks] = useState(0.25);
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [answerKey, setAnswerKey] = useState({}); // { 1: 'A', 2: 'B', ... }

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingToken(null);
    setExamTitle("");
    setSubject("");
    setClassName("");
    setNegativeMarks(0.25);
    setMarksPerQuestion(1);

    const defaultTpl = templates[0] || null;
    if (defaultTpl) {
      setSelectedTemplateId(defaultTpl._id);
      initAnswers(defaultTpl.totalQuestions);
    } else {
      setSelectedTemplateId("");
      setAnswerKey({});
    }

    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (token) => {
    setEditingToken(token);
    setExamTitle(token.examTitle || "");
    setSubject(token.subject || "");
    setClassName(token.className || "");
    setNegativeMarks(token.negativeMarks ?? 0.25);
    setMarksPerQuestion(token.marksPerQuestion ?? 1);
    setSelectedTemplateId(token.omrTemplate?._id || token.omrTemplate);

    const keyObj = {};
    (token.answerKey || []).forEach((k) => {
      keyObj[k.questionNo] = k.correctAnswer;
    });
    setAnswerKey(keyObj);

    setIsModalOpen(true);
  };

  const selectedTemplate = templates.find((t) => t._id === selectedTemplateId);
  const totalQuestions = selectedTemplate?.totalQuestions || 50;

  const initAnswers = (count) => {
    const obj = {};
    for (let i = 1; i <= count; i++) {
      obj[i] = "A";
    }
    setAnswerKey(obj);
  };

  const handleTemplateChange = (tplId) => {
    setSelectedTemplateId(tplId);
    const tpl = templates.find((t) => t._id === tplId);
    if (tpl) {
      initAnswers(tpl.totalQuestions);
    }
  };

  const handleOptionSelect = (qNo, opt) => {
    setAnswerKey((prev) => ({
      ...prev,
      [qNo]: opt,
    }));
  };

  const quickFillAll = (opt) => {
    const obj = {};
    for (let i = 1; i <= totalQuestions; i++) {
      obj[i] = opt;
    }
    setAnswerKey(obj);
    toast.info(`সকল প্রশ্নের উত্তর '${opt}' সেট করা হয়েছে`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!examTitle.trim()) {
      toast.error("পরীক্ষার শিরোনাম লিখুন");
      return;
    }

    if (!selectedTemplateId) {
      toast.error("OMR টেমপ্লেট নির্বাচন করুন");
      return;
    }

    const formattedKey = [];
    for (let i = 1; i <= totalQuestions; i++) {
      formattedKey.push({
        questionNo: i,
        correctAnswer: answerKey[i] || "A",
      });
    }

    const payload = {
      examTitle,
      subject,
      className,
      totalQuestions,
      omrTemplateId: selectedTemplateId,
      negativeMarks: Number(negativeMarks),
      marksPerQuestion: Number(marksPerQuestion),
      answerKey: formattedKey,
    };

    if (editingToken) {
      await updateTokenMutation.mutateAsync({
        id: editingToken._id,
        payload,
      });
    } else {
      await createTokenMutation.mutateAsync(payload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (token) => {
    if (
      window.confirm(
        `আপনি কি নিশ্চিত যে "${token.examTitle}" টোকেন ও এর সকল রেজাল্ট মুছে ফেলতে চান?`
      )
    ) {
      await deleteTokenMutation.mutateAsync(token._id);
    }
  };

  const copyTokenId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success(`টোকেন আইডি "${id}" কপি করা হয়েছে!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Step 2: Get OMR Token</span>
          </div>
          <h2 className="text-xl font-bold">OMR টোকেন ও উত্তরমালা (Answer Key) তৈরি</h2>
          <p className="text-xs text-blue-100 max-w-xl">
            একটি OMR Token তৈরি করুন যেখানে আপনার পরীক্ষার উত্তরপত্র, সিলেক্টেড OMR ও নেগেটিভ মার্কিং সংরক্ষিত থাকবে।
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-md transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন টোকেন তৈরি করুন</span>
        </button>
      </div>

      {/* Tokens List */}
      {loadingTokens ? (
        <div className="p-12 text-center text-slate-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
          <p className="text-sm">টোকেন লোড হচ্ছে...</p>
        </div>
      ) : tokens.length === 0 ? (
        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-600 mx-auto rounded-full flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">কোনো OMR টোকেন পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            OMR শিট মূল্যায়ন করার জন্য প্রথমে একটি টোকেন তৈরি করে সঠিক উত্তরপত্র সেট করুন।
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
          >
            প্রথম টোকেন তৈরি করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token) => (
            <div
              key={token._id}
              className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    onClick={() => copyTokenId(token.tokenId)}
                    className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-mono font-bold border border-blue-200 dark:border-blue-800"
                    title="কপি করতে ক্লিক করুন"
                  >
                    <span>{token.tokenId}</span>
                    <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                    {token.totalQuestions} টি প্রশ্ন
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
                  {token.examTitle}
                </h3>

                <div className="text-xs text-slate-500 space-y-1 mb-4">
                  {token.subject && <div>বিষয়: <span className="font-medium text-slate-700 dark:text-slate-300">{token.subject}</span></div>}
                  {token.className && <div>শ্রেণি: <span className="font-medium text-slate-700 dark:text-slate-300">{token.className}</span></div>}
                  <div className="flex items-center gap-3 pt-1">
                    <span>নেগেটিভ মার্ক: <b className="text-red-500">{token.negativeMarks}</b></span>
                    <span>প্রতি প্রশ্নে: <b className="text-green-600">{token.marksPerQuestion}</b></span>
                  </div>
                </div>

                {/* Evaluation stats pill */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl text-xs flex justify-around items-center mb-4 border border-slate-100 dark:border-slate-800">
                  <div className="text-center">
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {token.stats?.totalEvaluated || 0}
                    </div>
                    <div className="text-[10px] text-slate-500">মূল্যায়িত খাতা</div>
                  </div>
                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                  <div className="text-center">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">
                      {token.stats?.avgScore || 0}
                    </div>
                    <div className="text-[10px] text-slate-500">গড় নম্বর</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onSelectTokenForEvaluation && onSelectTokenForEvaluation(token.tokenId)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>মূল্যায়ন শুরু</span>
                </button>

                <button
                  onClick={() => handleOpenEditModal(token)}
                  className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950 rounded-xl transition"
                  title="উত্তরমালা ও সেটিংস সম্পাদনা"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(token)}
                  className="p-2 text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950 rounded-xl transition"
                  title="টোকেন ডিলিট করুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT TOKEN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                    {editingToken ? "OMR টোকেন ও উত্তরমালা সম্পাদনা" : "নতুন OMR টোকেন তৈরি করুন"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    পরীক্ষার তথ্য ও সঠিক উত্তরমালা সিলেক্ট করুন
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    পরীক্ষার শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="যেমন: ১ম সাময়িক পরীক্ষা ২০২৬"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    OMR টেমপ্লেট *
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                  >
                    {templates.map((tpl) => (
                      <option key={tpl._id} value={tpl._id}>
                        {tpl.title} ({tpl.totalQuestions} প্রশ্ন)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    বিষয় (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="যেমন: রসায়ন"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    নেগেটিভ মার্ক
                  </label>
                  <select
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    <option value={0}>০ (কোনো নেগেটিভ নেই)</option>
                    <option value={0.25}>০.২৫ (৪টি ভুলে ১ নম্বর কাটা)</option>
                    <option value={0.5}>০.৫০ (২টি ভুলে ১ নম্বর কাটা)</option>
                    <option value={1}>১.০০ (১টি ভুলে ১ নম্বর কাটা)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    প্রতি সঠিক প্রশ্নের নম্বর
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={marksPerQuestion}
                    onChange={(e) => setMarksPerQuestion(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Answer Key Matrix Section */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>উত্তরমালা (Answer Key) সেট করুন ({totalQuestions} টি প্রশ্ন)</span>
                  </div>

                  {/* Quick Fill Helpers */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500">কুইক ফিল:</span>
                    {["A", "B", "C", "D"].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => quickFillAll(opt)}
                        className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 text-[10px] font-bold rounded"
                      >
                        সব {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bubble matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
                  {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNo) => (
                    <div
                      key={qNo}
                      className="flex items-center justify-between bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 shadow-xs"
                    >
                      <span className="font-mono font-bold text-[11px] text-slate-600 dark:text-slate-400 w-7">
                        {qNo.toString().padStart(2, "0")}.
                      </span>
                      <div className="flex items-center gap-1">
                        {["A", "B", "C", "D"].map((opt) => {
                          const isSelected = (answerKey[qNo] || "A") === opt;
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => handleOptionSelect(qNo, opt)}
                              className={`w-6 h-6 rounded-full text-[10px] font-bold transition flex items-center justify-center ${
                                isSelected
                                  ? "bg-blue-600 text-white shadow-xs"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-100"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold rounded-xl text-xs"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  disabled={createTokenMutation.isPending || updateTokenMutation.isPending}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {createTokenMutation.isPending || updateTokenMutation.isPending
                    ? "সংরক্ষণ হচ্ছে..."
                    : editingToken
                    ? "আপডেট করুন"
                    : "টোকেন সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
