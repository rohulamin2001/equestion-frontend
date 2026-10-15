import { useState } from "react";
import RichTextRender from "@/components/RichTextRender";
import {
  HelpCircle,
  Trash2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  FileText,
  Lightbulb,
  X,
} from "lucide-react";
import QuestionImageSlot from "./QuestionImageSlot";

/**
 * Utility functions for extracting, attaching, and removing images from HTML strings.
 */
function extractFirstImageSrc(html) {
  if (!html || typeof html !== "string") return "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : "";
}

function attachImageToHtml(html = "", imagePath) {
  const imgTag = `<img src="${imagePath}" class="question-image max-w-full my-1 object-contain inline-block" alt="চিত্র" />`;
  if (!html || !html.trim()) {
    return `<p>${imgTag}</p>`;
  }
  // Replace existing <img> if present
  if (/<img[^>]*>/i.test(html)) {
    return html.replace(/<img[^>]*>/i, imgTag);
  }
  // Otherwise append to existing HTML
  return `${html}<p>${imgTag}</p>`;
}

function removeImageFromHtml(html = "") {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<p>\s*<img[^>]*>\s*<\/p>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .trim();
}

/**
 * Removes <img> tags strictly for previewing the text part so it doesn't double-render
 * when QuestionImageSlot is also displaying the image thumbnail.
 */
function stripImgForTextPreview(html = "") {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<p>\s*<img[^>]*>\s*<\/p>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .trim();
}

function extractTextFromOption(html = "") {
  if (!html || typeof html !== "string") return "";
  let clean = html.replace(/<img[^>]*>/gi, "");
  clean = clean.replace(/<br\s*\/?>/gi, " ");
  clean = clean.replace(/<\/p>\s*<p[^>]*>/gi, " ");
  clean = clean.replace(/<\/?p[^>]*>/gi, "");
  clean = clean.replace(/&nbsp;/g, " ");
  return clean.trim();
}

function buildOptionHtml(text = "", imagePath = "") {
  const cleanText = (text || "").trim();
  const imgTag = imagePath
    ? `<img src="${imagePath}" class="question-image max-w-full my-1 object-contain inline-block" alt="চিত্র" />`
    : "";
  if (cleanText && imgTag) {
    return `<p>${cleanText} ${imgTag}</p>`;
  }
  if (imgTag) {
    return `<p>${imgTag}</p>`;
  }
  if (cleanText) {
    return `<p>${cleanText}</p>`;
  }
  return "";
}

const OPTION_LETTERS = ["ক", "খ", "গ", "ঘ"];
const CQ_LABELS = [
  { key: "cognitiveA", label: "ক", defaultMarks: 1 },
  { key: "cognitiveB", label: "খ", defaultMarks: 2 },
  { key: "cognitiveC", label: "গ", defaultMarks: 3 },
  { key: "cognitiveD", label: "ঘ", defaultMarks: 4 },
];

export default function QuestionPreviewCard({
  question = {},
  index = 1,
  category = "MCQ",
  onUpdateQuestion = () => {},
  onDeleteQuestion = () => {},
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  // Difficulty badge colors
  const difficulty = question.difficulty || "Medium";
  const difficultyBadge =
    difficulty === "Easy"
      ? { text: "সহজ", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      : difficulty === "Hard"
        ? { text: "কঠিন", bg: "bg-rose-50 text-rose-700 border-rose-200" }
        : { text: "মাঝারি", bg: "bg-amber-50 text-amber-700 border-amber-200" };

  // MCQ rendering
  if (category === "MCQ" || question.mcqData) {
    const mcq = question.mcqData || {};
    const stemHtml = mcq.questionText || mcq.stem || "";
    const stemImage = extractFirstImageSrc(stemHtml);

    const handleStemImageAttach = (path) => {
      const updatedHtml = attachImageToHtml(stemHtml, path);
      onUpdateQuestion({
        ...question,
        mcqData: {
          ...mcq,
          questionText: updatedHtml,
        },
      });
    };

    const handleStemImageRemove = () => {
      const updatedHtml = removeImageFromHtml(stemHtml);
      onUpdateQuestion({
        ...question,
        mcqData: {
          ...mcq,
          questionText: updatedHtml,
        },
      });
    };

    const handleOptionImageAttach = (optIndex, path) => {
      const options = Array.isArray(mcq.options) ? [...mcq.options] : [];
      const currentText = extractTextFromOption(options[optIndex]);
      options[optIndex] = buildOptionHtml(currentText, path);
      onUpdateQuestion({
        ...question,
        mcqData: {
          ...mcq,
          options,
        },
      });
    };

    const handleOptionImageRemove = (optIndex) => {
      const options = Array.isArray(mcq.options) ? [...mcq.options] : [];
      const currentText = extractTextFromOption(options[optIndex]);
      options[optIndex] = buildOptionHtml(currentText, "");
      onUpdateQuestion({
        ...question,
        mcqData: {
          ...mcq,
          options,
        },
      });
    };

    const handleOptionTextChange = (optIndex, newText) => {
      const options = Array.isArray(mcq.options) ? [...mcq.options] : [];
      const optImage = extractFirstImageSrc(options[optIndex]);
      options[optIndex] = buildOptionHtml(newText, optImage);
      onUpdateQuestion({
        ...question,
        mcqData: {
          ...mcq,
          options,
        },
      });
    };

    const handleOptionTextClear = (optIndex) => {
      const options = Array.isArray(mcq.options) ? [...mcq.options] : [];
      const optImage = extractFirstImageSrc(options[optIndex]);
      options[optIndex] = buildOptionHtml("", optImage);
      onUpdateQuestion({
        ...question,
        mcqData: {
          ...mcq,
          options,
        },
      });
    };

    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-xs hover:shadow-md transition p-4 sm:p-5 space-y-4 font-bengali">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-2xs">
              প্রশ্ন #{index}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
              {mcq.mcqType || "MCQ"}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${difficultyBadge.bg}`}
            >
              {difficultyBadge.text}
            </span>
            {question.level && (
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[11px] font-semibold border border-indigo-200">
                {question.level}
              </span>
            )}
            {question.topics && question.topics.length > 0 && (
              <span className="text-[11px] text-slate-500 font-medium">
                টপিক: {question.topics.join(", ")}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onDeleteQuestion}
            className="text-[11px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg border border-transparent hover:border-rose-200 transition cursor-pointer flex items-center gap-1"
            title="এই প্রশ্নটি তালিকা থেকে বাদ দিন"
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">রিমুভ</span>
          </button>
        </div>

        {/* Stem / Question Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            প্রশ্নের বিবরণ / উদ্দীপক
          </label>
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 leading-relaxed">
            <RichTextRender
              html={stripImgForTextPreview(stemHtml) || "<i>(প্রশ্নের টেক্সট নেই)</i>"}
            />
          </div>

          {/* Stem Image Slot */}
          <QuestionImageSlot
            imageUrl={stemImage}
            onImageAttached={handleStemImageAttach}
            onImageRemoved={handleStemImageRemove}
            label="উদ্দীপকের চিত্র"
          />
        </div>

        {/* Statements (for Contextual / MultipleCompletion) */}
        {Array.isArray(mcq.statements) && mcq.statements.length > 0 && (
          <div className="space-y-1 pl-2 border-l-2 border-purple-200">
            {mcq.statements.map((stm, i) => (
              <div key={i} className="text-xs text-slate-700 font-medium">
                <span className="font-bold text-purple-700">
                  {i === 0 ? "i. " : i === 1 ? "ii. " : "iii. "}
                </span>
                <span>{stm}</span>
              </div>
            ))}
          </div>
        )}

        {/* Options Grid */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            অপশনসমূহ (টেক্সট এডিট করতে পারেন বা [✕] চেপে শুধু ছবির অপশন করতে পারেন)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(mcq.options || []).map((opt, optIdx) => {
              const isCorrect = Number(mcq.correctAnswer) === optIdx;
              const optImage = extractFirstImageSrc(opt);
              const optText = extractTextFromOption(opt);
              const letter = OPTION_LETTERS[optIdx] || String(optIdx + 1);

              return (
                <div
                  key={optIdx}
                  className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center justify-between gap-2 ${
                    isCorrect
                      ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/20"
                      : "bg-white border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCorrect
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {letter}
                    </span>

                    {/* Inline Editable Option Text Input with 1-Click Clear */}
                    <div className="relative flex-1 min-w-0 flex items-center">
                      <input
                        type="text"
                        value={optText}
                        onChange={(e) => handleOptionTextChange(optIdx, e.target.value)}
                        placeholder={
                          optImage
                            ? "শুধু চিত্র (টেক্সট নেই)"
                            : "অপশন টেক্সট লিখুন..."
                        }
                        className={`w-full text-xs font-medium px-2 py-1.5 rounded-lg border transition outline-none pr-6 ${
                          optText
                            ? "bg-white/90 text-slate-800 border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-200"
                            : optImage
                            ? "bg-slate-50/80 text-slate-400 italic border-transparent placeholder:text-slate-400"
                            : "bg-slate-50/60 text-slate-700 border-dashed border-slate-300 focus:bg-white focus:border-purple-400"
                        }`}
                        title={
                          optText
                            ? "টেক্সট পরিবর্তন করতে এখানে লিখুন"
                            : optImage
                            ? "এই অপশনটিতে শুধু চিত্র রয়েছে (টেক্সট খালি)"
                            : "অপশন টেক্সট লিখুন"
                        }
                      />
                      {optText && (
                        <button
                          type="button"
                          onClick={() => handleOptionTextClear(optIdx)}
                          className="absolute right-1.5 p-0.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="টেক্সট মুছে শুধু ছবি রাখুন (১-ক্লিক ক্লিয়ার)"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Option Image Slot */}
                  <QuestionImageSlot
                    compact
                    imageUrl={optImage}
                    onImageAttached={(path) => handleOptionImageAttach(optIdx, path)}
                    onImageRemoved={() => handleOptionImageRemove(optIdx)}
                    label={`অপশন ${letter}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {mcq.explanation && (
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="size-3.5 text-amber-500" />
              <span>{showExplanation ? "ব্যাখ্যা লুকান" : "ব্যাখ্যা দেখুন"}</span>
            </button>
            {showExplanation && (
              <div className="mt-2 p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-slate-700 leading-relaxed animate-in fade-in">
                <RichTextRender html={mcq.explanation} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Creative (CQ) rendering
  if (category === "Creative" || question.creativeData) {
    const cd = question.creativeData || {};
    const stemHtml = cd.stem || "";
    const stemImage = extractFirstImageSrc(stemHtml);

    const handleStemImageAttach = (path) => {
      const updatedHtml = attachImageToHtml(stemHtml, path);
      onUpdateQuestion({
        ...question,
        creativeData: {
          ...cd,
          stem: updatedHtml,
        },
      });
    };

    const handleStemImageRemove = () => {
      const updatedHtml = removeImageFromHtml(stemHtml);
      onUpdateQuestion({
        ...question,
        creativeData: {
          ...cd,
          stem: updatedHtml,
        },
      });
    };

    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-xs hover:shadow-md transition p-4 sm:p-5 space-y-4 font-bengali">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-2xs">
              প্রশ্ন #{index}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
              সৃজনশীল প্রশ্ন
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${difficultyBadge.bg}`}
            >
              {difficultyBadge.text}
            </span>
            {question.topics && question.topics.length > 0 && (
              <span className="text-[11px] text-slate-500 font-medium">
                টপিক: {question.topics.join(", ")}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onDeleteQuestion}
            className="text-[11px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg border border-transparent hover:border-rose-200 transition cursor-pointer flex items-center gap-1"
            title="এই সৃজনশীল প্রশ্নটি বাদ দিন"
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">রিমুভ</span>
          </button>
        </div>

        {/* Stem */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            উদ্দীপক
          </label>
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 leading-relaxed">
            <RichTextRender
              html={stripImgForTextPreview(stemHtml) || "<i>(উদ্দীপক নেই)</i>"}
            />
          </div>

          {/* Stem Image Slot */}
          <QuestionImageSlot
            imageUrl={stemImage}
            onImageAttached={handleStemImageAttach}
            onImageRemoved={handleStemImageRemove}
            label="উদ্দীপকের চিত্র"
          />
        </div>

        {/* Sub-questions (ক, খ, গ, ঘ) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            উপ-প্রশ্নসমূহ
          </label>
          <div className="space-y-2">
            {CQ_LABELS.map(({ key, label, defaultMarks }) => {
              const subObj = cd.subQuestions?.[key] || cd.questions?.[key];
              const qText =
                typeof subObj === "string" ? subObj : subObj?.text || "";
              const marks = subObj?.marks || defaultMarks;

              return (
                <div
                  key={key}
                  className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/40 flex items-start gap-2.5"
                >
                  <span className="size-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {label}
                  </span>
                  <div className="flex-1 text-xs font-semibold text-slate-800 leading-relaxed">
                    <RichTextRender
                      html={qText || `<i>(${label}-এর প্রশ্ন খালি)</i>`}
                    />
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-bold shrink-0">
                    মান: {marks}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // General / Other Categories rendering
  const general = question.generalData || {};
  const questionTextHtml = general.questionText || question.questionText || "";
  const questionImage = extractFirstImageSrc(questionTextHtml);

  const handleGeneralImageAttach = (path) => {
    const updatedHtml = attachImageToHtml(questionTextHtml, path);
    onUpdateQuestion({
      ...question,
      generalData: {
        ...general,
        questionText: updatedHtml,
      },
    });
  };

  const handleGeneralImageRemove = () => {
    const updatedHtml = removeImageFromHtml(questionTextHtml);
    onUpdateQuestion({
      ...question,
      generalData: {
        ...general,
        questionText: updatedHtml,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-xs hover:shadow-md transition p-4 sm:p-5 space-y-4 font-bengali">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-2xs">
            প্রশ্ন #{index}
          </span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
            {category}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${difficultyBadge.bg}`}
          >
            {difficultyBadge.text}
          </span>
        </div>

        <button
          type="button"
          onClick={onDeleteQuestion}
          className="text-[11px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg border border-transparent hover:border-rose-200 transition cursor-pointer flex items-center gap-1"
          title="এই প্রশ্নটি বাদ দিন"
        >
          <Trash2 className="size-3.5" />
          <span className="hidden sm:inline">রিমুভ</span>
        </button>
      </div>

      {/* Question Text */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          প্রশ্ন বিবরণ
        </label>
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 leading-relaxed">
          <RichTextRender
            html={
              stripImgForTextPreview(questionTextHtml) ||
              "<i>(প্রশ্নের টেক্সট নেই)</i>"
            }
          />
        </div>

        <QuestionImageSlot
          imageUrl={questionImage}
          onImageAttached={handleGeneralImageAttach}
          onImageRemoved={handleGeneralImageRemove}
          label="প্রশ্নের চিত্র"
        />
      </div>

      {/* Suggested Answer */}
      {general.suggestedAnswer && (
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
          <span className="font-bold text-slate-600">উত্তর: </span>
          <span>{general.suggestedAnswer}</span>
        </div>
      )}
    </div>
  );
}
