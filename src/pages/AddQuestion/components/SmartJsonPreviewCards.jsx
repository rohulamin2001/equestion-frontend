import { useState, useMemo } from "react";
import {
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Info,
} from "lucide-react";
import { validateCategoryQuestionsJson } from "@/lib/jsonQuestionValidator";
import QuestionPreviewCard from "./QuestionPreviewCard";
import { toast } from "sonner";

export default function SmartJsonPreviewCards({
  rawJson = "",
  onJsonChange = () => {},
  category = "MCQ",
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  // 1. Unconditionally validate and parse questions from rawJson
  const validation = useMemo(() => {
    if (!rawJson || !rawJson.trim()) return null;
    return validateCategoryQuestionsJson(rawJson, category);
  }, [rawJson, category]);

  // 2. Unconditionally extract parsed question list
  const questions = useMemo(() => {
    if (
      validation &&
      validation.isValid &&
      Array.isArray(validation.questions)
    ) {
      return validation.questions;
    }
    return [];
  }, [validation]);

  // 3. Unconditionally count questions with images
  const imagesCount = useMemo(() => {
    if (!questions || questions.length === 0) return 0;
    let count = 0;
    questions.forEach((q) => {
      const qStr = JSON.stringify(q);
      if (/<img[^>]*>/i.test(qStr)) {
        count++;
      }
    });
    return count;
  }, [questions]);

  // Handler functions
  const handleUpdateQuestion = (index, updatedQuestion) => {
    const updated = [...questions];
    updated[index] = updatedQuestion;
    onJsonChange(JSON.stringify(updated, null, 2));
  };

  const handleDeleteQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    onJsonChange(JSON.stringify(updated, null, 2));
    toast.info(`প্রশ্ন #${index + 1} সফলভাবে তালিকা থেকে বাদ দেওয়া হয়েছে`);
  };

  // Safe early return ONLY AFTER all hooks are called
  if (
    !validation ||
    !validation.isValid ||
    questions.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-4 pt-2 font-bengali">
      {/* Control Banner */}
      <div className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-950/90 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-purple-500/20 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                <Sparkles className="size-4 text-purple-300" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                স্মার্ট প্রশ্ন প্রিভিউ ও ইমেজ কন্ট্রোল প্যানেল
              </h3>
            </div>
            <p className="text-xs text-purple-200/80 pl-10.5">
              নিচের কার্ডগুলোতে সরাসরি উদ্দীপক বা অপশনে ছবি যুক্ত করুন বা স্ক্রিনশট (Ctrl+V) পেস্ট করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pl-10.5 sm:pl-0">
            <span className="px-3 py-1 bg-white/10 border border-white/15 rounded-xl text-xs font-semibold text-purple-200 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>{questions.length} টি প্রশ্ন প্রস্তুত</span>
            </span>

            <span className="px-3 py-1 bg-white/10 border border-white/15 rounded-xl text-xs font-semibold text-purple-200 flex items-center gap-1.5 shadow-2xs">
              <ImageIcon className="size-3.5 text-purple-300" />
              <span>{imagesCount} টিতে ছবি সংযুক্ত</span>
            </span>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md transition cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="size-3.5" />
                  <span>কার্ড লুকান</span>
                </>
              ) : (
                <>
                  <ChevronDown className="size-3.5" />
                  <span>কার্ড দেখুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tip Notice */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-start gap-2 text-[11px] text-purple-200/90">
          <Info className="size-3.5 text-purple-300 shrink-0 mt-0.5" />
          <span>
            <b>প্রো-টিপ:</b> Snipping Tool বা Lightshot দিয়ে চিত্র স্ক্রিনশট নিয়ে কার্ডের উপর ক্লিক করে <b>Ctrl+V</b> চাপলেই স্বয়ংক্রিয়ভাবে Cloudflare R2-তে ছবি আপলোড হয়ে যাবে। কোনো ফাইল সেভ বা HTML কোড লেখার প্রয়োজন নেই!
          </span>
        </div>
      </div>

      {/* Questions Cards List */}
      {isExpanded && (
        <div className="space-y-4">
          {questions.map((question, idx) => (
            <QuestionPreviewCard
              key={`preview-q-${idx}`}
              question={question}
              index={idx + 1}
              category={category}
              onUpdateQuestion={(updated) => handleUpdateQuestion(idx, updated)}
              onDeleteQuestion={() => handleDeleteQuestion(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
