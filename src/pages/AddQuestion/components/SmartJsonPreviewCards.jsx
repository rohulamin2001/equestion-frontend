import { useState, useMemo } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
      {/* Modern Control & Preview Banner */}
      <div className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-purple-200/80 transition-all duration-200 hover:shadow-md">
        {/* Top Decorative Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500" />
        
        {/* Subtle Ambient Background Highlights */}
        <div className="absolute -top-16 -right-16 size-44 bg-purple-100/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 size-44 bg-indigo-100/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Title & Description */}
            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-600/20 flex items-center justify-center shrink-0 mt-0.5 ring-4 ring-purple-50">
                <Sparkles className="size-5 text-purple-100" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-slate-800 tracking-tight">
                    স্মার্ট প্রশ্ন প্রিভিউ ও ইমেজ কন্ট্রোল প্যানেল
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 border border-purple-200/80 uppercase tracking-wider">
                    {category} লাইভ
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  নিচের কার্ডগুলোতে সরাসরি উদ্দীপক বা অপশনে ছবি যুক্ত করুন বা স্ক্রিনশট (<kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-mono text-slate-700 font-bold shadow-2xs">Ctrl+V</kbd>) পেস্ট করুন।
                </p>
              </div>
            </div>

            {/* Right Status Badges & Accordion Toggle */}
            <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-13.5 lg:pl-0 shrink-0">
              {/* Ready Questions Badge */}
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200/90 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                </span>
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>{questions.length} টি প্রশ্ন প্রস্তুত</span>
              </div>

              {/* Images Attached Badge */}
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs border ${
                  imagesCount > 0
                    ? "bg-purple-50 border-purple-200 text-purple-800"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <ImageIcon
                  className={`size-4 ${
                    imagesCount > 0 ? "text-purple-600" : "text-slate-400"
                  }`}
                />
                <span>{imagesCount} টিতে ছবি সংযুক্ত</span>
              </div>

              {/* Accordion Toggle Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all duration-200 cursor-pointer active:scale-95 ${
                  isExpanded
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20"
                    : "bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200"
                }`}
                title={isExpanded ? "প্রশ্ন কার্ডগুলো লুকান" : "প্রশ্ন কার্ডগুলো খুলুন"}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="size-4" />
                    <span>কার্ড লুকান</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-4" />
                    <span>কার্ড দেখুন ({questions.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* High-Contrast Pro-Tip Banner */}
          <div className="mt-4 pt-3.5 border-t border-purple-100/90 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed bg-purple-50/70 p-3 sm:p-3.5 rounded-xl border border-purple-200/70">
            <div className="size-6 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center shrink-0 mt-0.5 text-purple-700 shadow-2xs">
              <Lightbulb className="size-3.5 text-purple-700" />
            </div>
            <div className="space-y-0.5 flex-1">
              <span className="font-bold text-purple-900 mr-1.5 inline-block">
                প্রো-টিপ:
              </span>
              <span className="text-slate-700 font-medium">
                Snipping Tool বা Lightshot দিয়ে চিত্র স্ক্রিনশট নিয়ে নিচের কার্ডের যেকোনো ছবি বক্সে ক্লিক করে{" "}
                <kbd className="px-1.5 py-0.5 bg-white border border-purple-300 rounded font-mono font-bold text-purple-900 shadow-2xs text-[11px]">
                  Ctrl+V
                </kbd>{" "}
                চাপলেই স্বয়ংক্রিয়ভাবে <span className="font-semibold text-slate-900">Cloudflare R2</span>-তে আপলোড হয়ে যুক্ত হবে। কোনো ফাইল সেভ বা HTML কোড লেখার প্রয়োজন নেই!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Cards List with Smooth Expand/Collapse */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="space-y-4 overflow-hidden pt-1"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
