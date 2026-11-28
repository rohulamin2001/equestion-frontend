import RichTextRender from "@/components/RichTextRender";
import { getStructuredGeneralData } from "@/utils/generalQuestionUtils";
import { Check } from "lucide-react";
import { toBnNumber } from "../../utils/questionUtils";

const OPTION_LETTERS = ["ক", "খ", "গ", "ঘ"];
const CREATIVE_SUB_KEYS = [
  { key: "cognitiveA", label: "ক.", defaultMarks: 1 },
  { key: "cognitiveB", label: "খ.", defaultMarks: 2 },
  { key: "cognitiveC", label: "গ.", defaultMarks: 3 },
  { key: "cognitiveD", label: "ঘ.", defaultMarks: 4 },
];
const ROMAN_LABELS = ["i.", "ii.", "iii.", "iv."];

/**
 * Renders MCQ, Creative (CQ), or General question body matching MyQuestions typography (`text-[15px]`).
 * Shared between the Question Bank selector card and the Preview modal.
 */
export default function QuestionBodyContent({
  question,
  serialLabel = "",
  isAnswerVisible = false,
  className = "",
}) {
  if (!question) return null;

  if (question.category === "MCQ" && question.mcqData) {
    const mcq = question.mcqData;
    return (
      <div
        className={`space-y-3.5 text-slate-800 leading-relaxed font-bengali ${className}`}
      >
        {mcq.mcqType === "Contextual" && mcq.stem && (
          <div className="p-3.5 sm:p-4 bg-black/[0.02] border-l-4 border-l-[#900EB0]/60 border-y border-r border-black/[0.05] rounded-r-xl text-sm leading-relaxed text-slate-700">
            <strong className="block mb-1 text-slate-800">উদ্দীপক:</strong>
            <RichTextRender content={mcq.stem} />
          </div>
        )}

        <div className="text-[15px] flex justify-between items-start gap-3">
          <div className="flex gap-2 flex-1 min-w-0">
            {serialLabel && (
              <span className="font-bold shrink-0 text-slate-700">
                {serialLabel}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <RichTextRender content={mcq.questionText || ""} />

              {mcq.mcqType === "MultipleCompletion" &&
                Array.isArray(mcq.statements) &&
                mcq.statements.length > 0 && (
                  <div className="space-y-1 pl-5 mt-2 font-normal text-[15px] text-slate-700">
                    {mcq.statements.map((st, idx) => (
                      <div key={idx} className="flex gap-1.5 items-start">
                        <span className="shrink-0 text-slate-500 font-bold">
                          {ROMAN_LABELS[idx] || `${idx + 1}.`}
                        </span>
                        <RichTextRender
                          content={st}
                          inline
                          className="inline-block"
                        />
                      </div>
                    ))}
                    <div className="mt-2 font-semibold text-slate-800">
                      নিচের কোনটি সঠিক?
                    </div>
                  </div>
                )}
            </div>
          </div>

          <span className="text-slate-500 text-xs font-bold shrink-0 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70">
            {toBnNumber(mcq.marks || 1)}
          </span>
        </div>

        {Array.isArray(mcq.options) && mcq.options.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 ${
              serialLabel ? "pl-5" : ""
            } text-[15px]`}
          >
            {mcq.options.map((opt, idx) => {
              const isCorrect =
                isAnswerVisible && Number(mcq.correctAnswer) === idx;
              const optLetter = OPTION_LETTERS[idx] || idx + 1;

              return (
                <div
                  key={idx}
                  className={`min-h-[46px] sm:min-h-[50px] h-auto flex items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-800 shadow-xs"
                      : "bg-white/80 border-black/[0.06] text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-visible">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                        isCorrect
                          ? "bg-emerald-500 text-white"
                          : "bg-black/[0.05] text-slate-600"
                      }`}
                    >
                      {optLetter}
                    </span>
                    <div className="min-w-0 flex-1 overflow-visible mcq-option-render">
                      <RichTextRender
                        content={opt}
                        inline
                        className={`inline-block leading-relaxed overflow-visible ${
                          isCorrect ? "text-emerald-900 font-medium" : "font-normal"
                        }`}
                      />
                    </div>
                  </div>
                  {isCorrect && (
                    <Check className="size-4 text-emerald-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isAnswerVisible && mcq.explanation && (
          <div className="mt-2 p-3 bg-[#900EB0]/5 border border-[#900EB0]/15 rounded-xl text-[15px] text-slate-700">
            <span className="font-semibold text-[#720A7B]">বিশ্লেষণ: </span>
            <RichTextRender
              content={mcq.explanation}
              inline
              className="inline-block"
            />
          </div>
        )}
      </div>
    );
  }

  if (question.category === "Creative" && question.creativeData) {
    const cq = question.creativeData;
    return (
      <div
        className={`space-y-3.5 text-slate-800 leading-relaxed font-bengali ${className}`}
      >
        <div className="flex gap-2">
          {serialLabel && (
            <span className="font-bold shrink-0 text-[15px] text-slate-700">
              {serialLabel}
            </span>
          )}
          <div className="flex-1 min-w-0 space-y-3">
            {cq.stem && (
              <div className="p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl text-[15px] leading-relaxed text-slate-700">
                <strong className="block text-sm font-semibold text-slate-800 mb-1">
                  উদ্দীপক:
                </strong>
                <RichTextRender content={cq.stem} />
              </div>
            )}

            {cq.subQuestions && (
              <div className="space-y-2.5 text-[15px] text-slate-700">
                {CREATIVE_SUB_KEYS.map(({ key, label, defaultMarks }) => {
                  const sub = cq.subQuestions?.[key];
                  if (!sub?.text) return null;
                  return (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="w-6 shrink-0 font-semibold text-slate-600">
                            {label}
                          </span>
                          <RichTextRender
                            content={sub.text}
                            inline
                            className="flex-1 inline-block text-sm sm:text-[15px]"
                          />
                        </div>
                        <span className="text-slate-500 text-[14px] font-bold shrink-0">
                          {toBnNumber(sub.marks || defaultMarks)}
                        </span>
                      </div>
                      {isAnswerVisible && sub.answer && (
                        <div className="ml-6 p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-sm text-emerald-900 leading-relaxed">
                          <span className="font-bold text-emerald-700 mr-1.5">
                            উত্তর:
                          </span>
                          <RichTextRender content={sub.answer} inline />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // General / Short / Broad / English categories
  const parsed = getStructuredGeneralData(question.generalData);
  const hasSubQuestions =
    Array.isArray(parsed.subQuestions) && parsed.subQuestions.length > 0;

  return (
    <div
      className={`flex gap-2 text-[15px] text-slate-800 leading-relaxed font-bengali ${className}`}
    >
      {serialLabel && (
        <span className="font-bold shrink-0 text-slate-700">{serialLabel}</span>
      )}
      <div className="flex-1 min-w-0 space-y-3">
        {hasSubQuestions ? (
          <>
            {parsed.instruction && (
              <div className="flex justify-between items-start gap-3">
                <div className="font-medium text-[15px] text-slate-800 flex-1 min-w-0">
                  <RichTextRender content={parsed.instruction} />
                </div>
                <span className="text-slate-500 text-xs font-bold shrink-0 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70">
                  {toBnNumber(question.generalData?.marks || 10)}
                </span>
              </div>
            )}
            {parsed.stem && (
              <div className="p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl leading-relaxed text-slate-700">
                <RichTextRender content={parsed.stem} />
              </div>
            )}
            <div className="space-y-2 text-[15px] text-slate-700">
              {parsed.subQuestions.map((subQ, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="w-6 font-semibold shrink-0">
                        {subQ.identifier}
                      </span>
                      <RichTextRender
                        content={subQ.text}
                        inline
                        className="flex-1 inline-block text-sm sm:text-[15px]"
                      />
                    </div>
                    <span className="text-slate-500 text-[14px] font-bold shrink-0">
                      {toBnNumber(subQ.marks || 2)}
                    </span>
                  </div>
                  {isAnswerVisible && subQ.answer && (
                    <div className="ml-6 p-2 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-sm text-emerald-900 leading-relaxed">
                      <span className="font-bold text-emerald-700 mr-1.5">
                        উত্তর:
                      </span>
                      <RichTextRender content={subQ.answer} inline />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0 font-medium text-[15px] text-slate-800">
                <RichTextRender
                  content={question.generalData?.questionText || ""}
                />
              </div>
              <span className="text-slate-500 text-xs font-bold shrink-0 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70">
                {toBnNumber(question.generalData?.marks || 1)}
              </span>
            </div>
            {parsed.stem && (
              <div className="p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl leading-relaxed text-slate-700">
                <RichTextRender content={parsed.stem} />
              </div>
            )}
            {isAnswerVisible && question.generalData?.suggestedAnswer && (
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-sm text-emerald-950 leading-relaxed">
                <span className="font-bold text-emerald-700 mr-1.5">
                  উত্তর:
                </span>
                <RichTextRender
                  content={question.generalData.suggestedAnswer}
                  inline
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
